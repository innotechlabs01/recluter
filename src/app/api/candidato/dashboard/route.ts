import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import {
  candidates,
  applications,
  interviews,
  jobRequests,
  companies,
} from '@/lib/db/schema'
import { eq, and, gte, desc } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find candidate by Clerk user ID
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))

  if (!candidate) {
    return NextResponse.json(
      { error: 'Candidate not found' },
      { status: 404 }
    )
  }

  // Active applications (not rejected)
  const activeApplications = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, candidate.id),
      )
    )
    .orderBy(desc(applications.createdAt))

  const activeAppCount = activeApplications.filter(
    (a) => a.status !== 'rejected'
  ).length

  // Pending interviews
  const now = new Date()
  const pendingInterviews = await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.candidateId, candidate.id),
        eq(interviews.status, 'scheduled'),
        gte(interviews.scheduledAt, now)
      )
    )
    .orderBy(desc(interviews.scheduledAt))

  // Available opportunities (open job requests not yet applied to)
  const appliedJobIds = activeApplications.map((a) => a.jobRequestId)
  const allOpenJobs = await db
    .select({
      id: jobRequests.id,
      title: jobRequests.title,
      companyName: companies.name,
      location: jobRequests.location,
      workMode: jobRequests.workMode,
      salaryMin: jobRequests.salaryMin,
      salaryMax: jobRequests.salaryMax,
      currency: jobRequests.currency,
      createdAt: jobRequests.createdAt,
    })
    .from(jobRequests)
    .innerJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(
      and(
        eq(jobRequests.status, 'searching'),
      )
    )
    .orderBy(desc(jobRequests.createdAt))

  const availableOpportunities = allOpenJobs.filter(
    (job) => !appliedJobIds.includes(job.id)
  )

  // Upcoming interviews with job request details
  const upcomingInterviewDetails = await db
    .select({
      id: interviews.id,
      scheduledAt: interviews.scheduledAt,
      type: interviews.type,
      meetingLink: interviews.meetingLink,
      jobTitle: jobRequests.title,
      companyName: companies.name,
    })
    .from(interviews)
    .innerJoin(jobRequests, eq(interviews.jobRequestId, jobRequests.id))
    .innerJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(
      and(
        eq(interviews.candidateId, candidate.id),
        eq(interviews.status, 'scheduled'),
        gte(interviews.scheduledAt, now)
      )
    )
    .orderBy(desc(interviews.scheduledAt))

  // Recent updates (latest applications with job details)
  const recentUpdates = await db
    .select({
      id: applications.id,
      status: applications.status,
      createdAt: applications.createdAt,
      jobTitle: jobRequests.title,
      companyName: companies.name,
    })
    .from(applications)
    .innerJoin(jobRequests, eq(applications.jobRequestId, jobRequests.id))
    .innerJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(eq(applications.candidateId, candidate.id))
    .orderBy(desc(applications.createdAt))
    .limit(5)

  return NextResponse.json({
    stats: {
      activeApplications: activeAppCount,
      pendingInterviews: pendingInterviews.length,
      availableOpportunities: availableOpportunities.length,
    },
    upcomingInterviews: upcomingInterviewDetails,
    recentUpdates,
    availableOpportunities: availableOpportunities.slice(0, 5),
  })
}
