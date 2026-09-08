'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

interface CandidateRow {
  id: string
  firstName: string
  lastName: string
  email: string
  status: string | null
}

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  interviewing: 'bg-blue-100 text-blue-700',
  in_process: 'bg-blue-100 text-blue-700',
  hired: 'bg-slate-100 text-slate-700',
  unavailable: 'bg-red-100 text-red-700',
}

export default function CandidatosPage() {
  const t = useTranslations('admin.candidates')
  const [candidates, setCandidates] = useState<CandidateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusLabels: Record<string, string> = {
    available: t('available'),
    in_process: t('inProcess'),
    interviewing: t('inProcess'),
    hired: t('hired'),
    unavailable: t('hired'),
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/candidatos')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los candidatos')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCandidates(data as CandidateRow[])
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
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('name')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('email')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-medium text-slate-900">
                  {candidate.firstName} {candidate.lastName}
                </td>
                <td className="p-4 text-sm text-slate-600">{candidate.email}</td>
                <td className="p-4">
                  <Badge className={statusColors[candidate.status ?? 'available']}>
                    {statusLabels[candidate.status ?? 'available'] ?? candidate.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <p className="p-4 text-sm text-slate-500">Todavía no hay candidatos.</p>
        )}
      </div>
    </div>
  )
}
