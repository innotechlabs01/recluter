'use client'


import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type HistoryStatus = 'hired' | 'closed' | 'cancelled'

interface HistoryItem {
  id: string
  title: string
  date: string
  closed: string
  status: HistoryStatus
  time: string
}

const history: HistoryItem[] = [
  { id: '1', title: 'Desarrollador Frontend', date: '01 Jul 2026', closed: '15 Jul 2026', status: 'hired', time: '14 días' },
  { id: '2', title: 'Project Manager', date: '10 Jun 2026', closed: '28 Jun 2026', status: 'closed', time: '18 días' },
  { id: '3', title: 'DevOps Engineer', date: '01 May 2026', closed: '20 May 2026', status: 'hired', time: '19 días' },
  { id: '4', title: 'QA Tester', date: '15 Abr 2026', closed: '30 Abr 2026', status: 'cancelled', time: '15 días' },
]

const statusColors: Record<HistoryStatus, string> = {
  hired: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function HistorialPage() {
  const t = useTranslations('empresa.history')

  const statusLabels = {
    hired: t('hired'),
    closed: t('closed'),
    cancelled: t('cancelled'),
  }

  const columns = [
    { key: 'title', header: t('position') },
    { key: 'date', header: t('requestDate') },
    { key: 'closed', header: t('closeDate') },
    { key: 'time', header: t('time') },
    {
      key: 'status',
      header: t('status'),
      render: (item: HistoryItem) => (
        <Badge className={cn(statusColors[item.status])}>{statusLabels[item.status]}</Badge>
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
          data={history}
          columns={columns}
          searchPlaceholder="Buscar en historial..."
        />
      </div>
    </div>
  )
}
