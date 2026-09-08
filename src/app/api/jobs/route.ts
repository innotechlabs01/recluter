import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jobRequests, companies } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/jobs — public listing of published, non-expired jobs
export async function GET() {
  const now = new Date()
  const jobs = await db
    .select({
      id: jobRequests.id,
      title: jobRequests.title,
      location: jobRequests.location,
      workMode: jobRequests.workMode,
      salaryMin: jobRequests.salaryMin,
      salaryMax: jobRequests.salaryMax,
      currency: jobRequests.currency,
      deadline: jobRequests.deadline,
      shareToken: jobRequests.shareToken,
      companyName: companies.name,
    })
    .from(jobRequests)
    .innerJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(and(eq(jobRequests.isPublic, true), eq(jobRequests.status, 'searching')))

  return NextResponse.json(jobs.filter((j) => !j.deadline || new Date(j.deadline) >= now))
}
