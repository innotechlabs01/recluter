import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials, jobRequests, companies } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { resend } from '@/lib/resend'
import { TestimonialRequestEmail } from '@/lib/email/testimonial-request'
import { generateTestimonialToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobRequestId } = await req.json()

  const [jobRequest] = await db
    .select()
    .from(jobRequests)
    .leftJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(eq(jobRequests.id, jobRequestId))
    .limit(1)

  if (!jobRequest || !jobRequest.companies) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const company = jobRequest.companies

  const token = generateTestimonialToken({
    companyId: company.id,
    jobRequestId: jobRequest.job_requests.id,
    authorName: company.contactName || company.name,
    authorRole: 'Cliente',
    companyName: company.name,
  })

  await db.insert(testimonials).values({
    companyId: company.id,
    jobRequestId: jobRequest.job_requests.id,
    authorName: company.contactName || company.name,
    authorRole: 'Cliente',
    companyName: company.name,
    quote: '',
    rating: 5,
    token,
  })

  await resend.emails.send({
    from: 'Recluter <onboarding@resend.dev>',
    to: company.contactEmail || 'admin@recluter.com',
    subject: '¡Compartí tu experiencia con Recluter!',
    react: TestimonialRequestEmail({
      authorName: company.contactName || company.name,
      companyName: company.name,
      token,
    }),
  })

  return NextResponse.json({ success: true })
}
