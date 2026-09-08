'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Timeline, type ProcessEventItem } from '@/components/dashboard/timeline'
import { JobChatPanel } from '@/components/chat/job-chat-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  received: 'Recibida',
  reviewing: 'En revisión',
  searching: 'Búsqueda activa',
  candidates_sent: 'Candidatos enviados',
  interview: 'Entrevista',
  hired: 'Contratado',
  closed: 'Cerrada',
}

interface ProcessDetail {
  id: string
  title: string
  positionsCount: number
  status: string
  salaryMin?: number | null
  salaryMax?: number | null
  currency?: string | null
  workMode?: string | null
}

export default function ProcessDetailPage() {
  const params = useParams()
  const [process, setProcess] = useState<ProcessDetail | null>(null)
  const [applications, setApplications] = useState<Array<{ id: string; firstName: string; lastName: string; email: string; status?: string | null }>>([])
  const [events, setEvents] = useState<ProcessEventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return
    let cancelled = false
    Promise.all([
      fetch(`/api/solicitudes/${params.id}`).then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      }),
      fetch(`/api/solicitudes/${params.id}/applications`).then((res) => (res.ok ? res.json() : [])),
      fetch(`/api/solicitudes/${params.id}/events`).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([data, apps, evts]) => {
        if (cancelled) return
        setProcess(data)
        setApplications(apps)
        setEvents(evts)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('No se pudo cargar el proceso')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-48 bg-slate-100 rounded-lg" />
      </div>
    )
  }

  if (!process) {
    return <div className="text-center py-8 text-slate-500">{error ?? 'Proceso no encontrado'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{process.title}</h1>
          <p className="text-slate-600">{process.positionsCount} posiciones</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          {statusLabels[process.status || 'received'] || process.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Timeline del proceso</h2>
          <Timeline events={events} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen</h2>
          <div className="bg-white p-4 rounded-lg border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Posiciones:</span>
              <span className="font-medium">{process.positionsCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Salario:</span>
              <span className="font-medium">
                {process.salaryMin && process.salaryMax
                  ? `$${process.salaryMin} - $${process.salaryMax} ${process.currency || 'USD'}`
                  : 'No especificado'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Modalidad:</span>
              <span className="font-medium">{process.workMode || 'No especificado'}</span>
            </div>
          </div>
          <Link href="/empresa/candidatos" className="block mt-4">
            <Button variant="outline" className="w-full">Ver candidatos</Button>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Postulaciones ({applications.length})
        </h2>        <div className="bg-white rounded-lg border divide-y">
          {applications.map((app) => (
            <div key={app.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-900">{app.firstName} {app.lastName}</p>
                <p className="text-slate-500">{app.email}</p>
              </div>
              <Badge className="bg-slate-100 text-slate-700">{app.status}</Badge>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="p-4 text-sm text-slate-500">Sin postulaciones todavía.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Chat con tu reclutador
        </h2>
        <div className="bg-white rounded-lg border p-4">
          <JobChatPanel jobRequestId={process.id} />
        </div>
      </div>
    </div>
  )
}
