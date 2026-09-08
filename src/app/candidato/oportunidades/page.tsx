'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Job {
  id: string
  title: string
  companyName: string
  location?: string | null
  workMode?: string | null
  salaryMin?: string | null
  salaryMax?: string | null
  currency?: string | null
}

export default function OportunidadesPage() {
  const t = useTranslations('candidato.opportunities')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las oportunidades')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setJobs(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const apply = async (id: string) => {
    setApplyingId(id)
    setMessage(null)
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setMessage(res.ok ? 'Postulación enviada' : 'Error al postularse')
    } catch {
      setMessage('Error de conexión')
    } finally {
      setApplyingId(null)
    }
  }

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <div className="grid grid-cols-3 gap-2">
        <Input placeholder="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input placeholder="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((opp) => (
          <Card key={opp.id} className="hover:border-blue-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                {opp.workMode && <Badge variant="secondary">{opp.workMode}</Badge>}
              </div>
              <p className="text-sm text-slate-600 mb-1">{opp.companyName}</p>
              <p className="text-sm text-green-600 font-medium mb-3">
                {opp.salaryMin && opp.salaryMax ? `$${opp.salaryMin} - $${opp.salaryMax} ${opp.currency ?? 'USD'}` : 'Salario a convenir'}
              </p>
              <Button size="sm" className="w-full" disabled={applyingId === opp.id} onClick={() => apply(opp.id)}>
                {t('apply')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {jobs.length === 0 && <p className="text-slate-500">No hay oportunidades disponibles.</p>}
    </div>
  )
}
