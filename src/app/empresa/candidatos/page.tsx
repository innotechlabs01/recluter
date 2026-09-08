'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function CandidatosPage() {
  const t = useTranslations('empresa.candidates')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candidatos')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los candidatos')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCandidates(data)
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-slate-900">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-slate-600">{candidate.email}</p>
          </div>
        ))}
      </div>
      {candidates.length === 0 && <p className="text-slate-500">Todavía no hay candidatos.</p>}
    </div>
  )
}
