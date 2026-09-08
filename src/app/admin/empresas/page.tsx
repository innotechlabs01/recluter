'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import type { ReactNode } from 'react'

interface Company {
  id: string
  name: string
  industry: string
  location: string
  users: number
  requests: number
  status: 'active' | 'inactive' | 'suspended'
}

interface CompanyColumn {
  key: string
  header: string
  render?: (item: Company) => ReactNode
}

const columns: CompanyColumn[] = [
  { key: 'name', header: 'Empresa' },
  { key: 'industry', header: 'Industria' },
  { key: 'location', header: 'Ubicación' },
  { key: 'users', header: 'Usuarios' },
  { key: 'requests', header: 'Solicitudes' },
  {
    key: 'status',
    header: 'Estado',
    render: (item) => (
      <Badge className={item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
        {item.status === 'active' ? 'Activa' : 'Inactiva'}
      </Badge>
    ),
  },
]

export default function EmpresasPage() {
  const t = useTranslations('admin.companies')
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/companies')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las empresas')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCompanies(data as Company[])
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
          data={companies}
          columns={columns}
          searchPlaceholder="Buscar empresa..."
        />
        {companies.length === 0 && (
          <p className="p-4 text-sm text-slate-500">Todavía no hay empresas.</p>
        )}
      </div>
    </div>
  )
}
