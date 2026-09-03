import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials, testimonialStatusEnum } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const requestedStatus = searchParams.get('status') || 'approved'
  const validStatuses = testimonialStatusEnum.enumValues
  const status = (validStatuses as readonly string[]).includes(requestedStatus)
    ? (requestedStatus as (typeof testimonialStatusEnum.enumValues)[number])
    : 'approved'
  const limit = parseInt(searchParams.get('limit') || '6')
  const token = searchParams.get('token')

  // If token provided, return matching testimonial (for form)
  if (token) {
    const result = await db
      .select({
        id: testimonials.id,
        authorName: testimonials.authorName,
        authorRole: testimonials.authorRole,
        companyName: testimonials.companyName,
        quote: testimonials.quote,
        rating: testimonials.rating,
        status: testimonials.status,
      })
      .from(testimonials)
      .where(eq(testimonials.token, token))
      .limit(1)
    return NextResponse.json(result)
  }

  const results = await db
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorRole: testimonials.authorRole,
      companyName: testimonials.companyName,
      quote: testimonials.quote,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.status, status))
    .orderBy(desc(testimonials.createdAt))
    .limit(limit)

  return NextResponse.json(results)
}
