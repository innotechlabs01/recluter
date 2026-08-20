import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { candidates } from '@/lib/db/schema'

// GET /api/candidatos - Get all candidates
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allCandidates = await db.select().from(candidates)
  return NextResponse.json(allCandidates)
}
