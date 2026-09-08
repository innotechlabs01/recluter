'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Interview {
  id: string
  scheduledAt: string | null
  type: string | null
  status: string | null
  meetingLink: string | null
  jobTitle: string | null
  companyName: string | null
}

export default function EntrevistasPage() {
  const t = useTranslations('candidato.interviews')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candidato/interviews')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las entrevistas')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setInterviews(data as Interview[])
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

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      {interviews.length === 0 ? (
        <p className="text-slate-500">No tenés entrevistas programadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-900">{interview.jobTitle ?? '—'}</h3>
                  <Badge className="bg-blue-100 text-blue-700">
                    {interview.type === 'virtual' ? t('virtual') : t('presential')}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-1">{interview.companyName ?? '—'}</p>
                <div className="flex gap-4 text-sm text-slate-500 mt-3">
                  <span>
                    📅 {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleDateString('es-AR') : '—'}
                  </span>
                  <span>
                    🕐 {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
