import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { jobRequests, companies, applications, recruiters } from '@/lib/db/schema'
import { desc, eq, count } from 'drizzle-orm'

// GET /api/admin/jobs — job requests with company name + candidate count.
// Used by the admin solicitudes page. No mock fallback on the client.
export async function GET() {
  const { userId } = await resolveAuth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const jobs = await db
    .select({
      id: jobRequests.id,
      title: jobRequests.title,
      status: jobRequests.status,
      recruiterId: jobRequests.recruiterId,
      createdAt: jobRequests.createdAt,
      company: companies.name,
      recruiterName: recruiters.name,
    })
    .from(jobRequests)
    .leftJoin(companies, eq(jobRequests.companyId, companies.id))
    .leftJoin(recruiters, eq(jobRequests.recruiterId, recruiters.id))
    .orderBy(desc(jobRequests.createdAt))

  const rows = await Promise.all(
    jobs.map(async (j) => {
      const [row] = await db
        .select({ value: count() })
        .from(applications)
        .where(eq(applications.jobRequestId, j.id))
      return {
        id: j.id,
        company: j.company ?? '—',
        title: j.title,
        date: j.createdAt ? new Date(j.createdAt).toISOString() : '',
        recruiterId: j.recruiterId,
        recruiterName: j.recruiterName,
        status: j.status ?? 'received',
        candidates: row.value,
      }
    })
  )

  return NextResponse.json(rows)
}
