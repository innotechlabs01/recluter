import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { jobRequests, jobRequestSteps, companies } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/solicitudes - Get all solicitudes for current company
export async function GET() {
  const { userId, orgId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // If user has an org, filter by company; otherwise return all
  if (orgId) {
    const [company] = await db.select().from(companies).where(eq(companies.clerkOrgId, orgId))
    if (company) {
      const solicitudes = await db.select().from(jobRequests).where(eq(jobRequests.companyId, company.id))
      return NextResponse.json(solicitudes)
    }
  }

  const solicitudes = await db.select().from(jobRequests)
  return NextResponse.json(solicitudes)
}

// POST /api/solicitudes - Create new solicitud
export async function POST(req: Request) {
  const { userId, orgId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Resolve company ID from orgId
  let companyId = body.companyId
  if (orgId && !companyId) {
    const [company] = await db.select().from(companies).where(eq(companies.clerkOrgId, orgId))
    if (company) {
      companyId = company.id
    }
  }

  if (!companyId) {
    return NextResponse.json({ error: 'Company not found' }, { status: 400 })
  }

  // Insert job request
  const [solicitud] = await db.insert(jobRequests).values({
    companyId,
    title: body.positionTitle,
    positionsCount: body.positionsCount,
    workMode: body.workMode,
    location: body.positionLocation,
    salaryMin: body.salaryMin?.toString(),
    salaryMax: body.salaryMax?.toString(),
    currency: body.currency,
  }).returning()

  // Insert wizard steps data
  const steps = [
    { stepNumber: 1, stepName: 'company', data: body.companyData },
    { stepNumber: 2, stepName: 'position', data: body.positionData },
    { stepNumber: 3, stepName: 'profile', data: body.profileData },
    { stepNumber: 4, stepName: 'conditions', data: body.conditionsData },
    { stepNumber: 5, stepName: 'selection', data: body.selectionData },
  ]

  for (const step of steps) {
    await db.insert(jobRequestSteps).values({
      jobRequestId: solicitud.id,
      stepNumber: step.stepNumber,
      stepName: step.stepName,
      data: step.data,
      isComplete: true,
    })
  }

  return NextResponse.json(solicitud, { status: 201 })
}
