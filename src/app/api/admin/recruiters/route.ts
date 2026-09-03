import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { recruiters } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

// GET /api/admin/recruiters - List all recruiters (active + inactive)
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = await db.select().from(recruiters).orderBy(desc(recruiters.createdAt))
  return NextResponse.json(all)
}

// POST /api/admin/recruiters - Create a recruiter
export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'name and email are required' },
      { status: 400 }
    )
  }

  const [created] = await db
    .insert(recruiters)
    .values({
      userId,
      name: body.name,
      email: body.email,
      specialties: body.specialties ? (Array.isArray(body.specialties) ? body.specialties : [body.specialties]) : null,
      isActive: body.isActive ?? true,
    })
    .returning()

  return NextResponse.json(created, { status: 201 })
}
