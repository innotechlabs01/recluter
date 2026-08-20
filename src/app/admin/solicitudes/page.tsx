'use client'


import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'

const requests = [
  { id: '1', company: 'Acme Corp', title: 'Desarrollador Senior', date: '18 Ago', recruiter: 'María García', status: 'searching', candidates: 5 },
  { id: '2', company: 'TechCo', title: 'Account Manager', date: '15 Ago', recruiter: 'Carlos López', status: 'candidates_sent', candidates: 3 },
  { id: '3', company: 'GlobalInc', title: 'Designer UX', date: '20 Ago', recruiter: null, status: 'reviewing', candidates: 0 },
]

const statusColors: Record<string, string> = {
  reviewing: 'bg-yellow-100 text-yellow-700',
  searching: 'bg-blue-100 text-blue-700',
  candidates_sent: 'bg-green-100 text-green-700',
}

export default function SolicitudesPage() {
  const t = useTranslations('admin.requests')

  const statusLabels: Record<string, string> = {
    reviewing: t('reviewing'),
    searching: t('searching'),
    candidates_sent: t('candidatesSent'),
  }

  const columns = [
    { key: 'company', header: t('company') },
    { key: 'title', header: t('position') },
    { key: 'date', header: t('date') },
    {
      key: 'recruiter',
      header: t('recruiter'),
      render: (item: any) => item.recruiter || t('unassigned'),
    },
    { key: 'candidates', header: t('candidates') },
    {
      key: 'status',
      header: t('status'),
      render: (item: any) => (
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
