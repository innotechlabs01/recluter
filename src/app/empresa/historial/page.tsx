'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Solicitud {
  id: string
  title: string
  status: string | null
  createdAt: string | null
  updatedAt: string | null
}

const TERMINAL = new Set(['hired', 'closed', 'cancelled'])

const statusColors: Record<string, string> = {
  hired: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function HistorialPage() {
  const t = useTranslations('empresa.history')
  const [history, setHistory] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusLabels: Record<string, string> = {
    hired: t('hired'),
    closed: t('closed'),
    cancelled: t('cancelled'),
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/solicitudes')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el historial')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setHistory((data as Solicitud[]).filter((s) => TERMINAL.has(s.status ?? '')))
        }
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

  const columns = [
    { key: 'title', header: t('position') },
    {
      key: 'createdAt',
      header: t('requestDate'),
      render: (item: Solicitud) => (item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-AR') : '—'),
    },
    {
      key: 'updatedAt',
      header: t('closeDate'),
      render: (item: Solicitud) => (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('es-AR') : '—'),
    },
    {
      key: 'status',
      header: t('status'),
      render: (item: Solicitud) => (
        <Badge className={cn(statusColors[item.status ?? 'closed'])}>
          {statusLabels[item.status ?? 'closed'] ?? item.status}
        </Badge>
      ),
    },
  ]

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden p-6">
        <DataTable
          data={history}
          columns={columns}
          searchPlaceholder="Buscar en historial..."
        />
        {history.length === 0 && (
          <p className="p-4 text-sm text-slate-500">Todavía no hay procesos cerrados.</p>
        )}
      </div>
    </div>
  )
}
