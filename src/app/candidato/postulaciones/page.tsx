'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

interface Row {
  id: string
  jobTitle: string
  companyName: string
  status?: string | null
  createdAt?: string | null
}

const statusColors: Record<string, string> = {
  suggested: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-slate-100 text-slate-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  interviewed: 'bg-purple-100 text-purple-700',
  selected: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function PostulacionesPage() {
  const t = useTranslations('candidato.applications')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candidato/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las postulaciones')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setRows(data?.recentUpdates ?? [])
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
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('company')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('position')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('date')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((app) => (
              <tr key={app.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{app.companyName}</td>
                <td className="p-4 text-sm text-slate-600">{app.jobTitle}</td>
                <td className="p-4 text-sm text-slate-600">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString('es-AR') : '—'}
                </td>
                <td className="p-4">
                  <Badge className={statusColors[app.status ?? 'suggested']}>{app.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="text-slate-500">Todavía no te postulaste a ninguna oferta.</p>}
    </div>
  )
}
