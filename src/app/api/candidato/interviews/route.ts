import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { candidates, interviews, jobRequests, companies } from '@/lib/db/schema'
import { and, eq, gte, desc } from 'drizzle-orm'

// GET /api/candidato/interviews — upcoming + past interviews for the logged candidate.
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))
  if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })

  const rows = await db
    .select({
      id: interviews.id,
      scheduledAt: interviews.scheduledAt,
      type: interviews.type,
      status: interviews.status,
      meetingLink: interviews.meetingLink,
      jobTitle: jobRequests.title,
      companyName: companies.name,
    })
    .from(interviews)
    .innerJoin(jobRequests, eq(interviews.jobRequestId, jobRequests.id))
    .leftJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(
      and(eq(interviews.candidateId, candidate.id), gte(interviews.scheduledAt, new Date(0)))
    )
    .orderBy(desc(interviews.scheduledAt))

  return NextResponse.json(rows)
}
