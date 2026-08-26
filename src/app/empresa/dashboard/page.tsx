'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Briefcase, Users, Clock, TrendingUp, UserPlus } from 'lucide-react'

interface DashboardData {
  stats: {
    totalRequests: number
    activeProcesses: number
    openPositions: number
    successRate: number
  }
  recentRequests: Array<{
    id: string
    title: string
    status: string
    priority: string
    positionsCount: number
    createdAt: string
    applicationCount: number
  }>
}

const statusLabels: Record<string, string> = {
  received: 'Recibida',
  reviewing: 'En revisión',
  info_pending: 'Info pendiente',
  searching: 'Búsqueda activa',
  evaluating: 'Evaluando',
  candidates_sent: 'Candidatos enviados',
  interview: 'Entrevista',
  selected: 'Seleccionado',
  hired: 'Contratado',
  closed: 'Cerrada',
  paused: 'Pausada',
  cancelled: 'Cancelada',
  new_search_required: 'Nueva búsqueda',
}

const statusColors: Record<string, string> = {
  received: 'bg-slate-100 text-slate-800',
  reviewing: 'bg-blue-100 text-blue-800',
  info_pending: 'bg-yellow-100 text-yellow-800',
  searching: 'bg-purple-100 text-purple-800',
  evaluating: 'bg-indigo-100 text-indigo-800',
  candidates_sent: 'bg-cyan-100 text-cyan-800',
  interview: 'bg-orange-100 text-orange-800',
  selected: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-100 text-slate-800',
  paused: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
  new_search_required: 'bg-pink-100 text-pink-800',
}

export default function EmpresaDashboard() {
  const t = useTranslations('empresa.dashboard')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/empresa/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
            <p className="text-slate-500">{t('subtitle')}</p>
          </div>
          <Link href="/empresa/solicitar/1">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t('searchPersonnel')}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-3" />
                <div className="h-8 bg-slate-200 rounded animate-pulse w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
            <p className="text-slate-500">{t('subtitle')}</p>
          </div>
          <Link href="/empresa/solicitar/1">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t('searchPersonnel')}
            </Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg border text-center text-slate-500">
          <p>{error || 'No se pudieron cargar los datos'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
          <p className="text-slate-500">{t('subtitle')}</p>
        </div>
        <Link href="/empresa/solicitar/1">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            {t('searchPersonnel')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('totalRequests')}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.totalRequests}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('activeProcesses')}
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.activeProcesses}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('openPositions')}
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.openPositions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('successRate')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.successRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('recentRequests')}</CardTitle>
          <Link href="/empresa/procesos">
            <Button variant="outline" size="sm">
              {t('viewAll')}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.recentRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>{t('noRequests')}</p>
              <Link href="/empresa/solicitar/1">
                <Button className="mt-4">{t('createFirst')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">
                        {request.title}
                      </p>
                      <Badge
                        variant="secondary"
                        className={statusColors[request.status] || ''}
                      >
                        {statusLabels[request.status] || request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {request.positionsCount} posiciones · {request.applicationCount} candidatos
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
