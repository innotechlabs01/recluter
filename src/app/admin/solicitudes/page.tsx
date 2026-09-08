'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'

type Recruiter = {
  id: string
  name: string
  email: string
  isActive: boolean
}

type RequestRow = {
  id: string
  company: string
  title: string
  date: string
  recruiterId: string | null
  recruiterName: string | null
  status: string
  candidates: number
}

const statusColors: Record<string, string> = {
  reviewing: 'bg-yellow-100 text-yellow-700',
  searching: 'bg-blue-100 text-blue-700',
  candidates_sent: 'bg-green-100 text-green-700',
}

export default function SolicitudesPage() {
  const t = useTranslations('admin.requests')

  const [requests, setRequests] = useState<RequestRow[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [assigning, setAssigning] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusLabels: Record<string, string> = {
    reviewing: t('reviewing'),
    searching: t('searching'),
    candidates_sent: t('candidatesSent'),
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [jobsRes, recruitersRes] = await Promise.all([
          fetch('/api/admin/jobs'),
          fetch('/api/admin/recruiters'),
        ])
        if (!jobsRes.ok) throw new Error('No se pudieron cargar las solicitudes')
        const jobs = (await jobsRes.json()) as RequestRow[]
        const all = recruitersRes.ok ? ((await recruitersRes.json()) as Recruiter[]) : []
        if (cancelled) return
        setRequests(jobs)
        setRecruiters(all.filter((r) => r.isActive))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleAssign = async (requestId: string, recruiterId: string) => {
    setAssigning((prev) => ({ ...prev, [requestId]: true }))
    try {
      const res = await fetch(`/api/admin/jobs/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruiterId: recruiterId || null }),
      })
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  recruiterId: recruiterId || null,
                  recruiterName:
                    recruiters.find((rec) => rec.id === recruiterId)?.name ?? null,
                }
              : r
          )
        )
      }
    } finally {
      setAssigning((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const columns = [
    { key: 'company', header: t('company') },
    { key: 'title', header: t('position') },
    { key: 'date', header: t('date') },
    {
      key: 'recruiter',
      header: t('recruiter'),
      render: (item: RequestRow) => (
        <select
          className="rounded-lg border px-2 py-1 text-sm"
          defaultValue={item.recruiterId ?? ''}
          disabled={assigning[item.id]}
          onChange={(e) => handleAssign(item.id, e.target.value)}
          data-testid={`assign-${item.id}`}
        >
          <option value="">{t('unassigned')}</option>
          {recruiters.map((rec) => (
            <option key={rec.id} value={rec.id}>
              {rec.name}
            </option>
          ))}
        </select>
      ),
    },
    { key: 'candidates', header: t('candidates') },
    {
      key: 'status',
      header: t('status'),
      render: (item: RequestRow) => (
        <Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge>
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
          data={requests}
          columns={columns}
          searchPlaceholder="Buscar solicitud..."
        />
        {requests.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No hay solicitudes todavía.</p>
        )}
      </div>
    </div>
  )
}
