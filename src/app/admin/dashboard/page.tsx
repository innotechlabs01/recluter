'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Metrics {
  counts: { companies: number; requests: number; candidates: number; recruiters: number; applications?: number }
  funnel: Record<string, number>
  applicationFunnel?: Record<string, number>
  velocities: {
    createdToSearchingHours: number | null
    searchingToSentHours: number | null
    createdToHiredHours: number | null
    applicationReviewHours?: number | null
    sampleSizes: { createdToSearching: number; searchingToSent: number; createdToHired: number; applicationReview?: number }
  }
  recruiterLoad: Array<{
    id: string
    name: string
    activeJobs: number
    maxConcurrent: number
    isActive: boolean | null
  }>
  recentEvents: Array<{ id: string; eventType: string; description?: string | null }>
}

export default function AdminDashboard() {
  const t = useTranslations('admin.dashboard')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/metrics')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las métricas')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setMetrics(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    { label: t('registeredCompanies'), value: metrics?.counts.companies ?? '—' },
    { label: t('activeRequests'), value: metrics?.counts.requests ?? '—' },
    { label: t('candidatePool'), value: metrics?.counts.candidates ?? '—' },
    { label: t('activeRecruiters'), value: metrics?.counts.recruiters ?? '—' },
    { label: 'Postulaciones', value: metrics?.counts.applications ?? '—' },
  ]

  const velocityRows = [
    { label: `${t('createdToSearching')} (tiempo búsqueda)`, value: metrics?.velocities.createdToSearchingHours },
    { label: t('searchingToSent'), value: metrics?.velocities.searchingToSentHours },
    { label: t('createdToHired'), value: metrics?.velocities.createdToHiredHours },
    { label: 'Tiempo postulación (creada → revisada)', value: metrics?.velocities.applicationReviewHours ?? null },
  ]

  const funnelEntries = Object.entries(metrics?.funnel ?? {}).sort((a, b) => b[1] - a[1])
  const funnelTotal = funnelEntries.reduce((sum, [, v]) => sum + v, 0)
  const appFunnelEntries = Object.entries(metrics?.applicationFunnel ?? {}).sort((a, b) => b[1] - a[1])
  const appFunnelTotal = appFunnelEntries.reduce((sum, [, v]) => sum + v, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-lg border">
            <p className="text-sm text-slate-600">{c.label}</p>
            <p className="text-3xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('funnel')}</h2>
          <div className="space-y-3">
            {funnelEntries.map(([status, value]) => (
              <div key={status} className="flex items-center gap-3 text-sm">
                <span className="w-36 truncate text-slate-700">{status}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${funnelTotal > 0 ? Math.round((value / funnelTotal) * 100) : 0}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-slate-900">{value}</span>
              </div>
            ))}
            {funnelEntries.length === 0 && (
              <p className="text-sm text-slate-500">{t('noData')}</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('stageTimes')}</h2>
          <div className="space-y-3">
            {velocityRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{r.label}</span>
                <span className="font-medium text-slate-900">
                  {r.value == null ? '—' : `${r.value} ${t('hours')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Funnel de postulaciones</h2>
        <div className="space-y-3">
          {appFunnelEntries.map(([status, value]) => (
            <div key={status} className="flex items-center gap-3 text-sm">
              <span className="w-36 truncate text-slate-700">{status}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${appFunnelTotal > 0 ? Math.round((value / appFunnelTotal) * 100) : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-slate-900">{value}</span>
            </div>
          ))}
          {appFunnelEntries.length === 0 && (
            <p className="text-sm text-slate-500">{t('noData')}</p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('recruiterLoad')}</h2>
        <div className="space-y-3">
          {(metrics?.recruiterLoad ?? []).map((r) => (
            <div key={r.id} className="flex items-center gap-3 text-sm">
              <span className="w-40 truncate text-slate-700">
                {r.name}
                {r.isActive === false && <span className="text-slate-400"> ({t('inactive')})</span>}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${r.activeJobs >= r.maxConcurrent ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{
                    width: `${r.maxConcurrent > 0 ? Math.min(100, Math.round((r.activeJobs / r.maxConcurrent) * 100)) : 0}%`,
                  }}
                />
              </div>
              <span className="w-16 text-right font-medium text-slate-900">
                {r.activeJobs}/{r.maxConcurrent}
              </span>
            </div>
          ))}
          {(metrics?.recruiterLoad ?? []).length === 0 && (
            <p className="text-sm text-slate-500">{t('noData')}</p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('recentRequests')}</h2>
        <div className="space-y-3">
          {(metrics?.recentEvents ?? []).map((e) => (
            <div key={e.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{e.description ?? e.eventType}</span>
              <span className="text-xs text-slate-500">{e.eventType}</span>
            </div>
          ))}
          {(metrics?.recentEvents ?? []).length === 0 && (
            <p className="text-sm text-slate-500">Sin actividad todavía.</p>
          )}
        </div>
      </div>
    </div>
  )
}
