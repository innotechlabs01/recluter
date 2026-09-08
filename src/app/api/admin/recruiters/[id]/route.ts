import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { recruiters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/admin/recruiters/[id] - Activate / deactivate or update
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
    .update(recruiters)
    .set({
      name: body.name,
      email: body.email,
      specialties:
        body.specialties !== undefined
          ? Array.isArray(body.specialties)
            ? body.specialties
            : [body.specialties]
          : undefined,
      isActive: body.isActive,
      maxConcurrent: body.maxConcurrent,
    })
    .where(eq(recruiters.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(updated)
}

// DELETE /api/admin/recruiters/[id] - Remove a recruiter
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await db.delete(recruiters).where(eq(recruiters.id, id))

  return NextResponse.json({ success: true })
}
