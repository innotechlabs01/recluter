import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jobRequests, jobRequestSteps, recruiters, processEvents } from '@/lib/db/schema'
import { and, eq, isNull, notInArray } from 'drizzle-orm'

// Statuses that still occupy recruiter capacity.
const TERMINAL_STATUSES = ['closed', 'cancelled', 'hired', 'paused'] as const

type Job = typeof jobRequests.$inferSelect
type Recruiter = typeof recruiters.$inferSelect

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return []
}

/** Specialty score: +1 per specialty keyword found in the job signals. */
function specialtyScore(job: Job, stepsData: Record<string, unknown>, recruiter: Recruiter): number {
  const specialties = asStringArray(recruiter.specialties).map((s) => s.toLowerCase())
  if (specialties.length === 0) return 0
  const haystack = [job.title, job.location, JSON.stringify(stepsData)].join(' ').toLowerCase()
  return specialties.filter((s) => s.length >= 3 && haystack.includes(s)).length
}

// GET /api/cron/auto-assign — least-loaded + specialty match.
// Idempotent: only touches rows with recruiter_id IS NULL, so re-runs are safe.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const unassigned = await db.select().from(jobRequests).where(isNull(jobRequests.recruiterId))
  if (unassigned.length === 0) return NextResponse.json({ assigned: 0, details: [] })

  const active = await db.select().from(recruiters).where(eq(recruiters.isActive, true))
  if (active.length === 0) {
    return NextResponse.json({ assigned: 0, reason: 'no-active-recruiters' })
  }

  // Active load per recruiter (closed/cancelled/hired/paused free capacity).
  const loads = await Promise.all(
    active.map(async (r) => {
      const rows = await db
        .select({ id: jobRequests.id })
        .from(jobRequests)
        .where(and(eq(jobRequests.recruiterId, r.id), notInArray(jobRequests.status, [...TERMINAL_STATUSES])))
      return { recruiter: r, load: rows.length }
    })
  )

  const details: Array<{ jobId: string; recruiterId: string; specialtyScore: number; loadBefore: number }> = []
  let assigned = 0
  let skippedAtCapacity = 0

  for (const job of unassigned) {
    const steps = await db
      .select()
      .from(jobRequestSteps)
      .where(eq(jobRequestSteps.jobRequestId, job.id))
    const stepsData = Object.fromEntries(steps.map((s) => [s.stepName, s.data ?? null]))

    const ranked = loads
      .map((entry) => ({ ...entry, score: specialtyScore(job, stepsData, entry.recruiter) }))
      .sort((a, b) => b.score - a.score || a.load - b.load)

    const target = ranked[0]
    const capacity = target.recruiter.maxConcurrent ?? 5
    if (target.load >= capacity) {
      skippedAtCapacity += 1
      continue
    }

    await db
      .update(jobRequests)
      .set({ recruiterId: target.recruiter.id, assignedAt: new Date(), status: 'reviewing' })
      .where(eq(jobRequests.id, job.id))

    await db.insert(processEvents).values({
      jobRequestId: job.id,
      eventType: 'assigned',
      description: `Asignada a ${target.recruiter.name}`,
      actorId: 'cron:auto-assign',
      metadata: {
        recruiterId: target.recruiter.id,
        strategy: target.score > 0 ? 'specialty+least-loaded' : 'least-loaded',
        specialtyScore: target.score,
        loadBefore: target.load,
        capacity,
      },
    })

    target.load += 1
    assigned += 1
    details.push({
      jobId: job.id,
      recruiterId: target.recruiter.id,
      specialtyScore: target.score,
      loadBefore: target.load - 1,
    })
  }

  return NextResponse.json({ assigned, skippedAtCapacity, details })
}
