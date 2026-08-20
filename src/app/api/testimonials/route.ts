import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'approved'
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
    .where(eq(testimonials.status, status as any))
    .orderBy(desc(testimonials.createdAt))
    .limit(limit)

  return NextResponse.json(results)
}
