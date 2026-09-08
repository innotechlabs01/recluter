'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface AdminEvent {
  id: string
  eventType: string
  description: string | null
  createdAt: string | null
}

export default function AdminHistorialPage() {
  const t = useTranslations('admin.history')
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/metrics')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el historial')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setEvents((data?.recentEvents ?? []) as AdminEvent[])
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
      <p className="text-slate-600">{t('subtitle')}</p>
      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-slate-500">
          Sin actividad todavía.
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {events.map((e) => (
            <div key={e.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-900">{e.description ?? e.eventType}</p>
                <p className="text-xs text-slate-500">
                  {e.createdAt ? new Date(e.createdAt).toLocaleString('es-AR') : ''}
                </p>
              </div>
              <span className="text-xs text-slate-500">{e.eventType}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
