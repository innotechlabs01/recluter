import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { applications, companies, jobRequests, candidates, recruiters, processEvents } from '@/lib/db/schema'
import { and, count, desc, eq, notInArray } from 'drizzle-orm'

const TERMINAL_STATUSES = ['closed', 'cancelled', 'hired', 'paused'] as const

type Job = typeof jobRequests.$inferSelect
type ProcessEvent = typeof processEvents.$inferSelect

function hoursBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 3_600_000
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10
}

/** First event timestamp per job for a given event type. */
function firstByJob(events: ProcessEvent[], type: string): Map<string, Date> {
  const map = new Map<string, Date>()
  for (const e of events) {
    if (e.eventType !== type || !e.jobRequestId || !e.createdAt) continue
    const prev = map.get(e.jobRequestId)
    if (!prev || e.createdAt < prev) map.set(e.jobRequestId, e.createdAt)
  }
  return map
}

// GET /api/admin/metrics — counts (incl. postulaciones), funnel, stage
// velocities incl. tiempo postulación + tiempo búsqueda (hours),
// recruiter load, and recent process events.
export async function GET() {
  const { userId } = await resolveAuth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [companyCount] = await db.select({ value: count() }).from(companies)
  const [requestCount] = await db.select({ value: count() }).from(jobRequests)
  const [candidateCount] = await db.select({ value: count() }).from(candidates)
  const [recruiterCount] = await db.select({ value: count() }).from(recruiters)
  const [applicationCount] = await db.select({ value: count() }).from(applications)

  const jobs: Job[] = await db.select().from(jobRequests)
  const allApplications = await db.select().from(applications)
  const allEvents: ProcessEvent[] = await db
    .select()
    .from(processEvents)
    .orderBy(desc(processEvents.createdAt))

  // Funnel: jobs per status.
  const funnel: Record<string, number> = {}
  for (const job of jobs) {
    const status = job.status ?? 'received'
    funnel[status] = (funnel[status] ?? 0) + 1
  }

  // Velocities in hours, derived from processEvents timeline.
  const searchingAt = firstByJob(allEvents, 'searching')
  const sentAt = firstByJob(allEvents, 'candidates_sent')
  const hiredAt = firstByJob(allEvents, 'hired')

  const createdToSearching: number[] = []
  const searchingToSent: number[] = []
  const createdToHired: number[] = []
  const applicationReview: number[] = []
  for (const job of jobs) {
    if (!job.createdAt) continue
    const s = job.id ? searchingAt.get(job.id) : undefined
    const sent = job.id ? sentAt.get(job.id) : undefined
    const hired = job.id ? hiredAt.get(job.id) : undefined
    if (s) createdToSearching.push(hoursBetween(job.createdAt, s))
    if (s && sent) searchingToSent.push(hoursBetween(s, sent))
    if (hired) createdToHired.push(hoursBetween(job.createdAt, hired))
  }
  // Tiempo postulación: avg hours from application created → reviewed.
  const applicationFunnel: Record<string, number> = {}
  for (const app of allApplications) {
    const status = app.status ?? 'suggested'
    applicationFunnel[status] = (applicationFunnel[status] ?? 0) + 1
    if (app.createdAt && app.reviewedAt) {
      applicationReview.push(hoursBetween(app.createdAt, app.reviewedAt))
    }
  }

  // Active load per recruiter.
  const recruiterRows = await db.select().from(recruiters)
  const load = await Promise.all(
    recruiterRows.map(async (r) => {
      const [row] = await db
        .select({ value: count() })
        .from(jobRequests)
        .where(and(eq(jobRequests.recruiterId, r.id), notInArray(jobRequests.status, [...TERMINAL_STATUSES])))
      return {
        id: r.id,
        name: r.name,
        activeJobs: row.value,
        maxConcurrent: r.maxConcurrent ?? 5,
        isActive: r.isActive,
      }
    })
  )

  return NextResponse.json({
    counts: {
      companies: companyCount.value,
      requests: requestCount.value,
      candidates: candidateCount.value,
      recruiters: recruiterCount.value,
      applications: applicationCount.value,
    },
    funnel,
    applicationFunnel,
    velocities: {
      createdToSearchingHours: avg(createdToSearching),
      searchingToSentHours: avg(searchingToSent),
      createdToHiredHours: avg(createdToHired),
      applicationReviewHours: avg(applicationReview),
      sampleSizes: {
        createdToSearching: createdToSearching.length,
        searchingToSent: searchingToSent.length,
        createdToHired: createdToHired.length,
        applicationReview: applicationReview.length,
      },
    },
    recruiterLoad: load,
    recentEvents: allEvents.slice(0, 20),
  })
}
