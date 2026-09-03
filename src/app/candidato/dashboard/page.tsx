'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, TrendingUp, Calendar } from 'lucide-react'

interface DashboardData {
  stats: {
    activeApplications: number
    pendingInterviews: number
    availableOpportunities: number
  }
  upcomingInterviews: Array<{
    id: string
    scheduledAt: string
    type: string
    jobTitle: string
    companyName: string
  }>
  recentUpdates: Array<{
    id: string
    status: string
    createdAt: string
    jobTitle: string
    companyName: string
  }>
}

const statusColors: Record<string, string> = {
  suggested: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  interviewed: 'bg-purple-100 text-purple-800',
  selected: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  suggested: 'Sugerida',
  reviewed: 'Revisada',
  shortlisted: 'Preseleccionado',
  interviewed: 'Entrevistado',
  selected: 'Seleccionado',
  rejected: 'Rechazada',
}

export default function CandidatoDashboard() {
  const t = useTranslations('candidato.dashboard')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/candidato/dashboard')
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border text-center text-slate-500">
          <p>{error || 'No se pudieron cargar los datos'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('activeApplications')}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.activeApplications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('pendingInterviews')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.pendingInterviews}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('availableOpportunities')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {data.stats.availableOpportunities}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('upcomingInterviews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.upcomingInterviews.length === 0 ? (
              <p className="text-sm text-slate-500">No hay entrevistas programadas</p>
            ) : (
              <div className="space-y-3">
                {data.upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-medium">{interview.companyName}</span>
                      {' — '}
                      {interview.jobTitle}
                    </div>
                    <span className="text-slate-500">
                      {new Date(interview.scheduledAt).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentUpdates')}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentUpdates.length === 0 ? (
              <p className="text-sm text-slate-500">No hay actualizaciones recientes</p>
            ) : (
              <div className="space-y-3">
                {data.recentUpdates.map((update) => (
                  <div key={update.id} className="flex items-center gap-2 text-sm">
                    <Badge
                      variant="secondary"
                      className={statusColors[update.status] || ''}
                    >
                      {statusLabels[update.status] || update.status}
                    </Badge>
                    <span className="text-slate-600">
                      {update.companyName} — {update.jobTitle}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
