import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jobRequests, candidates, applications, processEvents } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const applySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
})

// POST /api/jobs/[id]/apply — public apply with lazy candidate creation + expiry check
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const parsed = applySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const [job] = await db.select().from(jobRequests).where(eq(jobRequests.id, id))
  if (!job || !job.isPublic) {
    return NextResponse.json({ error: 'Oferta no disponible' }, { status: 404 })
  }
  if (job.deadline && new Date(job.deadline) < new Date()) {
    return NextResponse.json({ error: 'La oferta expiró' }, { status: 410 })
  }

  let [candidate] = await db.select().from(candidates).where(eq(candidates.email, parsed.data.email))
  if (!candidate) {
    ;[candidate] = await db
      .insert(candidates)
      .values({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
      })
      .returning()
  }

  const [existing] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.jobRequestId, id), eq(applications.candidateId, candidate.id)))
  if (existing) {
    return NextResponse.json(existing, { status: 200 })
  }

  const [application] = await db
    .insert(applications)
    .values({ jobRequestId: id, candidateId: candidate.id, status: 'suggested' })
    .returning()

  await db.insert(processEvents).values({
    jobRequestId: id,
    eventType: 'application_received',
    description: `Postulación recibida: ${candidate.email}`,
  })

  return NextResponse.json(application, { status: 201 })
}
