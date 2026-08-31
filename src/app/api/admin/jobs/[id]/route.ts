import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { jobRequests } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/admin/jobs/[id] - Reassign a job request to a recruiter
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const [updated] = await db
    .update(jobRequests)
    .set({ recruiterId: body.recruiterId ?? null })
    .where(eq(jobRequests.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(updated)
}
