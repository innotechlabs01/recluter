import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { candidates, documents } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/candidato/documents — documents for the logged candidate.
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))
  if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })

  const rows = await db
    .select()
    .from(documents)
    .where(eq(documents.candidateId, candidate.id))
    .orderBy(desc(documents.uploadedAt))

  return NextResponse.json(rows)
}
