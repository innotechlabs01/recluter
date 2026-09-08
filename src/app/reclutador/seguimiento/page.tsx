'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface ProcessItem {
  id: string
  title: string
  status?: string | null
}

export default function ReclutadorSeguimiento() {
  const [processes, setProcesses] = useState<ProcessItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/solicitudes')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las vacantes')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setProcesses(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Seguimiento</h1>
        <p className="text-slate-600">Vacantes asignadas y su estado</p>
      </div>
      <div className="space-y-3">
        {processes.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
            <p className="font-medium text-slate-900">{p.title}</p>
            <Badge className="bg-blue-100 text-blue-700">{p.status}</Badge>
          </div>
        ))}
        {processes.length === 0 && <p className="text-slate-500">Sin vacantes asignadas.</p>}
      </div>
    </div>
  )
}
