import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { applications, processEvents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { requestTestimonialsForJob } from '@/lib/testimonials'

const patchSchema = z.object({
  status: z.enum(['suggested', 'reviewed', 'shortlisted', 'interviewed', 'selected', 'rejected']),
  notes: z.string().optional(),
})

// PATCH /api/applications/[id] — change stage + log process event.
// On selected/hired-equivalent (selected) triggers testimonial requests
// for both empresa + candidato profiles (app-like flow).
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await resolveAuth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const [updated] = await db
    .update(applications)
    .set({ status: parsed.data.status, notes: parsed.data.notes, reviewedAt: new Date() })
    .where(eq(applications.id, id))
    .returning()

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (updated.jobRequestId) {
    await db.insert(processEvents).values({
      jobRequestId: updated.jobRequestId,
      eventType: 'stage_changed',
      description: `Etapa cambiada a ${parsed.data.status}`,
      actorId: userId,
      metadata: { applicationId: id, status: parsed.data.status },
    })

    if (parsed.data.status === 'selected') {
      try {
        await requestTestimonialsForJob(updated.jobRequestId)
      } catch (err) {
        console.error('Failed to request testimonials:', err)
      }
    }
  }

  return NextResponse.json(updated)
}
