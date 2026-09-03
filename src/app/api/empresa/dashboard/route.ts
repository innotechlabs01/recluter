import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import {
  companies,
  jobRequests,
  applications,
} from '@/lib/db/schema'
import { eq, count, desc } from 'drizzle-orm'

export async function GET() {
  const { userId, orgId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find company by Clerk org ID
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkOrgId, orgId || ''))

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  // Total solicitudes
  const [totalResult] = await db
    .select({ value: count() })
    .from(jobRequests)
    .where(eq(jobRequests.companyId, company.id))

  const activeProcesses = await db
    .select()
    .from(jobRequests)
    .where(eq(jobRequests.companyId, company.id))

  const activeCount = activeProcesses.filter(
    (j) =>
      !['closed', 'cancelled', 'hired', 'paused'].includes(j.status || '')
  ).length

  // Open positions (sum of positionsCount for active requests)
  const openPositions = activeProcesses
    .filter((j) => !['closed', 'cancelled', 'hired', 'paused'].includes(j.status || ''))
    .reduce((sum, j) => sum + (j.positionsCount || 0), 0)

  // Success rate (hired / total)
  const hiredCount = activeProcesses.filter(
    (j) => j.status === 'hired'
  ).length
  const successRate =
    totalResult.value > 0
      ? Math.round((hiredCount / totalResult.value) * 100)
      : 0

  // Recent requests with application counts
  const recentRequests = await db
    .select({
      id: jobRequests.id,
      title: jobRequests.title,
      status: jobRequests.status,
      priority: jobRequests.priority,
      positionsCount: jobRequests.positionsCount,
      createdAt: jobRequests.createdAt,
    })
    .from(jobRequests)
    .where(eq(jobRequests.companyId, company.id))
    .orderBy(desc(jobRequests.createdAt))
    .limit(5)

  // Get application counts per job request
  const recentRequestIds = recentRequests.map((r) => r.id)
  const applicationCounts: Record<string, number> = {}

  if (recentRequestIds.length > 0) {
    const counts = await db
      .select({
        jobRequestId: applications.jobRequestId,
        value: count(),
      })
      .from(applications)
    // Group by jobRequestId
    for (const c of counts) {
      if (c.jobRequestId) {
        applicationCounts[c.jobRequestId] = c.value
      }
    }
  }

  const recentRequestsWithCounts = recentRequests.map((r) => ({
    ...r,
    applicationCount: applicationCounts[r.id] || 0,
  }))

  return NextResponse.json({
    stats: {
      totalRequests: totalResult.value,
      activeProcesses: activeCount,
      openPositions,
      successRate,
    },
    recentRequests: recentRequestsWithCounts,
  })
}
