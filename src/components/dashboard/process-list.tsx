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

export function ProcessList() {
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/solicitudes')
      .then(res => res.json())
      .then(data => {
        setProcesses(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
