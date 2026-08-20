import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { quote, rating } = await req.json()

  if (!quote || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await db
    .update(testimonials)
    .set({
      quote,
      rating,
      status: 'approved',
      reviewedAt: new Date(),
    })
    .where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}
