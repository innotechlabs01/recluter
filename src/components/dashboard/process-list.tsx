'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const statusColors: Record<string, string> = {
  received: 'bg-slate-100 text-slate-700',
  reviewing: 'bg-yellow-100 text-yellow-700',
  searching: 'bg-blue-100 text-blue-700',
  candidates_sent: 'bg-green-100 text-green-700',
  interview: 'bg-purple-100 text-purple-700',
  hired: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-500',
}

const statusLabels: Record<string, string> = {
  received: 'Recibida',
  reviewing: 'En revisión',
  searching: 'Búsqueda activa',
  candidates_sent: 'Candidatos enviados',
  interview: 'Entrevista',
  hired: 'Contratado',
  closed: 'Cerrada',
}

interface ProcessItem {
  id: string
  title: string
  positionsCount: number
  location?: string | null
  status?: string
}

export function ProcessList() {
  const [processes, setProcesses] = useState<ProcessItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/solicitudes')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los procesos')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setProcesses(data)
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (processes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No hay procesos activos
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {processes.map((process) => (
        <Link key={process.id} href={`/empresa/procesos/${process.id}`}>
          <div className="bg-white p-4 rounded-lg border hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{process.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {process.positionsCount} posiciones{process.location ? ` • ${process.location}` : ''}
                </p>
              </div>
              <Badge className={statusColors[process.status || 'received'] || statusColors.received}>
                {statusLabels[process.status || 'received'] || process.status}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
