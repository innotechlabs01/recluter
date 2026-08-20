import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt))

  return NextResponse.json(results)
}
