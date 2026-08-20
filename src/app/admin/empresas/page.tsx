'use client'


import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'

const companies = [
  { name: 'Acme Corp', industry: 'Tecnología', location: 'New York, US', users: 5, requests: 8, status: 'active' },
  { name: 'TechCo', industry: 'SaaS', location: 'San Francisco, US', users: 3, requests: 5, status: 'active' },
  { name: 'GlobalInc', industry: 'Consultoría', location: 'Miami, US', users: 8, requests: 12, status: 'active' },
]

const columns = [
  { key: 'name', header: 'Empresa' },
  { key: 'industry', header: 'Industria' },
  { key: 'location', header: 'Ubicación' },
  { key: 'users', header: 'Usuarios' },
  { key: 'requests', header: 'Solicitudes' },
  {
    key: 'status',
    header: 'Estado',
    render: (item: any) => (
      <Badge className="bg-green-100 text-green-700">Activa</Badge>
    ),
  },
]

export default function EmpresasPage() {
  const t = useTranslations('admin.companies')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden p-6">
        <DataTable
          data={companies}
          columns={columns}
          searchPlaceholder="Buscar empresa..."
        />
      </div>
    </div>
  )
}
