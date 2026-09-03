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

const initialRequests: RequestRow[] = [
  { id: '1', company: 'Acme Corp', title: 'Desarrollador Senior', date: '18 Ago', recruiterId: null, recruiterName: null, status: 'searching', candidates: 5 },
  { id: '2', company: 'TechCo', title: 'Account Manager', date: '15 Ago', recruiterId: null, recruiterName: null, status: 'candidates_sent', candidates: 3 },
  { id: '3', company: 'GlobalInc', title: 'Designer UX', date: '20 Ago', recruiterId: null, recruiterName: null, status: 'reviewing', candidates: 0 },
]

export default function SolicitudesPage() {
  const t = useTranslations('admin.requests')

  const [requests, setRequests] = useState<RequestRow[]>(initialRequests)
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [assigning, setAssigning] = useState<Record<string, boolean>>({})

  const statusLabels: Record<string, string> = {
    reviewing: t('reviewing'),
    searching: t('searching'),
    candidates_sent: t('candidatesSent'),
  }

  useEffect(() => {
    const activeRecruiters = async () => {
      try {
        const res = await fetch('/api/admin/recruiters')
        if (res.ok) {
          const all = (await res.json()) as Recruiter[]
          setRecruiters(all.filter((r) => r.isActive))
        }
      } catch {
        // fall back to empty list if the DB is unavailable
      }
    }
    activeRecruiters()
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
      </div>
    </div>
  )
}
