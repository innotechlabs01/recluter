import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await db
    .update(testimonials)
    .set({ status, reviewedAt: new Date() })
    .where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(testimonials).where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}
