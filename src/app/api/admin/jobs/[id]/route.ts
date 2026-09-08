import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { jobRequests, processEvents, recruiters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { requestTestimonialsForJob } from '@/lib/testimonials'

const patchSchema = z.object({
  recruiterId: z.uuid().nullable().optional(),
  status: z
    .enum([
      'received',
      'reviewing',
      'info_pending',
      'searching',
      'evaluating',
      'candidates_sent',
      'interview',
      'selected',
      'hired',
      'closed',
      'paused',
      'cancelled',
      'new_search_required',
    ])
    .optional(),
})

// PATCH /api/admin/jobs/[id] - reassign a job request and/or move its status.
// Every change is logged in processEvents so velocities stay measurable.
// On hired/selected triggers testimonial requests for empresa + candidato.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await resolveAuth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const [current] = await db.select().from(jobRequests).where(eq(jobRequests.id, id))
  if (!current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { recruiterId, status } = parsed.data
  const updates: Partial<typeof jobRequests.$inferInsert> = {}
  if (recruiterId !== undefined) {
    updates.recruiterId = recruiterId
    updates.assignedAt = recruiterId ? new Date() : null
  }
  if (status !== undefined) updates.status = status

  const [updated] = await db
    .update(jobRequests)
    .set(updates)
    .where(eq(jobRequests.id, id))
    .returning()

  if (recruiterId !== undefined && recruiterId !== current.recruiterId) {
    const [recruiter] = recruiterId
      ? await db.select().from(recruiters).where(eq(recruiters.id, recruiterId))
      : [null]
    await db.insert(processEvents).values({
      jobRequestId: id,
      eventType: 'assigned',
      description: recruiter ? `Reasignada a ${recruiter.name}` : 'Asignación removida',
      actorId: userId,
      metadata: { recruiterId, previousRecruiterId: current.recruiterId, source: 'admin' },
    })
  }

  if (status !== undefined && status !== current.status) {
    await db.insert(processEvents).values({
      jobRequestId: id,
      eventType: status,
      description: `Estado cambiado a ${status}`,
      actorId: userId,
      metadata: { previousStatus: current.status, source: 'admin' },
    })

    if (status === 'hired' || status === 'selected') {
      try {
        await requestTestimonialsForJob(id)
      } catch (err) {
        console.error('Failed to request testimonials:', err)
      }
    }
  }

  return NextResponse.json(updated)
}
