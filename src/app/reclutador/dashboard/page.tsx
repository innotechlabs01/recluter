'use client'

import { useEffect, useState } from 'react'

interface Metrics {
  counts: { companies: number; requests: number; candidates: number; recruiters: number }
}

export default function ReclutadorDashboard() {
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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Reclutador</h1>
          <p className="text-slate-600">Tus vacantes asignadas y actividad reciente</p>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Reclutador</h1>
        <p className="text-slate-600">Tus vacantes asignadas y actividad reciente</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Solicitudes', value: metrics?.counts.requests ?? '—' },
          { label: 'Candidatos', value: metrics?.counts.candidates ?? '—' },
          { label: 'Empresas', value: metrics?.counts.companies ?? '—' },
          { label: 'Reclutadores', value: metrics?.counts.recruiters ?? '—' },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-lg border">
            <p className="text-sm text-slate-600">{s.label}</p>
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
