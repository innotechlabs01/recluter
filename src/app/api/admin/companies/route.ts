import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { companies, jobRequests } from '@/lib/db/schema'
import { count, desc, eq } from 'drizzle-orm'

// GET /api/admin/companies — companies with user/request aggregates.
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(companies).orderBy(desc(companies.createdAt))

  const result = await Promise.all(
    rows.map(async (c) => {
      const [req] = await db
        .select({ value: count() })
        .from(jobRequests)
        .where(eq(jobRequests.companyId, c.id))
      return {
        id: c.id,
        name: c.name,
        industry: c.industry ?? '—',
        location: c.location ?? '—',
        users: 0,
        requests: req.value,
        status: c.status ?? 'active',
      }
    })
  )

  return NextResponse.json(result)
}
