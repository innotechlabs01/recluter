'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Timeline } from '@/components/dashboard/timeline'
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

export default function ProcessDetailPage() {
  const params = useParams()
  const [process, setProcess] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/solicitudes/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setProcess(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
    return <div className="text-center py-8 text-slate-500">Proceso no encontrado</div>
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
          <Timeline />
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
    </div>
  )
}
