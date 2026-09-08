import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { applications, candidates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/solicitudes/[id]/applications — applications for a job request
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const rows = await db
    .select({
      id: applications.id,
      status: applications.status,
      notes: applications.notes,
      createdAt: applications.createdAt,
      candidateId: applications.candidateId,
      firstName: candidates.firstName,
      lastName: candidates.lastName,
      email: candidates.email,
    })
    .from(applications)
    .innerJoin(candidates, eq(applications.candidateId, candidates.id))
    .where(eq(applications.jobRequestId, id))

  return NextResponse.json(rows)
}
