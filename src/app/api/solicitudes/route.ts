import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { jobRequests, jobRequestSteps, companies, processEvents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/solicitudes - Get all solicitudes for current company
export async function GET() {
  const { userId, orgId } = await resolveAuth()

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
  const { userId, orgId } = await resolveAuth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Resolve company ID from orgId (E2E seed org: org_e2e_seed)
  let companyId = body.companyId
  if (orgId && !companyId) {
    const [company] = await db.select().from(companies).where(eq(companies.clerkOrgId, orgId))
    if (company) {
      companyId = company.id
    }
  }
  // E2E fallback: ensure seed company exists so simulated auth can create jobs.
  if (!companyId && userId?.startsWith('e2e-')) {
    const [seed] = await db.select().from(companies).where(eq(companies.clerkOrgId, 'org_e2e_seed'))
    if (seed) {
      companyId = seed.id
    } else {
      const [created] = await db
        .insert(companies)
        .values({ clerkOrgId: 'org_e2e_seed', name: 'E2E Seed Co', contactEmail: 'e2e@recluter.test' })
        .returning()
      companyId = created.id
    }
  }

  if (!companyId) {
    return NextResponse.json({ error: 'Company not found' }, { status: 400 })
  }

  // Insert job request
  const deadline = body.deadline ? new Date(body.deadline) : body.selectionData?.deadline ? new Date(body.selectionData.deadline) : undefined
  const startDate = body.startDate ? new Date(body.startDate) : body.positionData?.startDate ? new Date(body.positionData.startDate) : undefined
  const validDeadline = deadline && !Number.isNaN(deadline.getTime()) ? deadline : undefined
  const validStartDate = startDate && !Number.isNaN(startDate.getTime()) ? startDate : undefined
  const [solicitud] = await db.insert(jobRequests).values({
    companyId,
    title: body.positionTitle,
    positionsCount: body.positionsCount,
    workMode: body.workMode,
    location: body.positionLocation,
    salaryMin: body.salaryMin?.toString(),
    salaryMax: body.salaryMax?.toString(),
    currency: body.currency,
    deadline: validDeadline,
    startDate: validStartDate,
    isPublic: true,
    publishedAt: new Date(),
    expiresAt: validDeadline,
    shareToken: crypto.randomUUID(),
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

  await db.insert(processEvents).values({
    jobRequestId: solicitud.id,
    eventType: 'created',
    description: `Solicitud creada: ${solicitud.title}`,
    actorId: userId,
  })

  return NextResponse.json(solicitud, { status: 201 })
}
