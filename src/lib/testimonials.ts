import { db } from '@/lib/db'
import { applications, candidates, companies, jobRequests, testimonials } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { generateTestimonialToken } from '@/lib/token'

/**
 * Creates testimonial request rows for a hired/selected job, idempotently.
 * One row for the company contact (authorRole Cliente/Empresa) and one per
 * hired/selected candidate (authorRole Candidato), so both profiles can leave
 * app-like testimonials. Landing only shows approved ones.
 */
export async function requestTestimonialsForJob(jobId: string): Promise<void> {
  const [job] = await db.select().from(jobRequests).where(eq(jobRequests.id, jobId))
  if (!job?.companyId) return

  const existing = await db
    .select({ id: testimonials.id })
    .from(testimonials)
    .where(eq(testimonials.jobRequestId, jobId))
  const hasCompany = existing.length > 0
  if (hasCompany && existing.length > 1) return

  const [company] = await db.select().from(companies).where(eq(companies.id, job.companyId))
  if (!company) return

  if (!hasCompany) {
    const token = generateTestimonialToken({
      companyId: company.id,
      jobRequestId: jobId,
      authorName: company.contactName || company.name,
      authorRole: 'Empresa',
      companyName: company.name,
    })
    await db.insert(testimonials).values({
      companyId: company.id,
      jobRequestId: jobId,
      authorName: company.contactName || company.name,
      authorRole: 'Empresa',
      companyName: company.name,
      quote: '',
      rating: 5,
      token,
    })
  }

  const hired = await db
    .select({ candidate: candidates })
    .from(applications)
    .innerJoin(candidates, eq(applications.candidateId, candidates.id))
    .where(
      and(
        eq(applications.jobRequestId, jobId),
        eq(applications.status, 'selected'),
      ),
    )

  for (const row of hired) {
    const c = row.candidate
    const token = generateTestimonialToken({
      companyId: company.id,
      jobRequestId: jobId,
      authorName: `${c.firstName} ${c.lastName}`,
      authorRole: 'Candidato',
      companyName: company.name,
    })
    try {
      await db.insert(testimonials).values({
        companyId: company.id,
        jobRequestId: jobId,
        authorName: `${c.firstName} ${c.lastName}`,
        authorRole: 'Candidato',
        companyName: company.name,
        quote: '',
        rating: 5,
        token,
      })
    } catch {
      // Ignore duplicate token collisions; request is best-effort.
    }
  }
}
