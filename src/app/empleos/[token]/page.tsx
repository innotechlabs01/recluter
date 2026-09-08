import { db } from '@/lib/db'
import { jobRequests, companies } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { PublicApplyForm } from './apply-form'

export default async function EmpleoPublicoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [job] = await db.select().from(jobRequests).where(eq(jobRequests.shareToken, token))
  if (!job || !job.isPublic) notFound()

  const [company] = job.companyId
    ? await db.select().from(companies).where(eq(companies.id, job.companyId))
    : []

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-slate-600">{company?.name ?? 'Empresa confidencial'} · {job.location ?? 'Ubicación a convenir'}</p>
      </div>
      <div className="bg-white p-6 rounded-lg border space-y-2 text-sm">
        <p><span className="text-slate-500">Modalidad:</span> {job.workMode ?? '—'}</p>
        <p><span className="text-slate-500">Salario:</span> {job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax} ${job.currency ?? 'USD'}` : 'A convenir'}</p>
        <p><span className="text-slate-500">Cierra:</span> {job.deadline ? new Date(job.deadline).toLocaleDateString('es-AR') : '—'}</p>
      </div>
      <PublicApplyForm jobId={job.id} shareToken={token} />
    </div>
  )
}
