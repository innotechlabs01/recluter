'use client'


import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Briefcase, Users, Clock, TrendingUp, UserPlus } from 'lucide-react'

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

export default function EmpresaDashboard() {
  const t = useTranslations('empresa.dashboard')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
          <p className="text-slate-500">
            {t('subtitle')}
          </p>
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
            <div className="text-3xl font-bold text-slate-900">—</div>
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
            <div className="text-3xl font-bold text-slate-900">—</div>
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
            <div className="text-3xl font-bold text-slate-900">—</div>
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
            <div className="text-3xl font-bold text-slate-900">—</div>
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
          <div className="text-center py-8 text-slate-500">
            <p>{t('noRequests')}</p>
            <Link href="/empresa/solicitar/1">
              <Button className="mt-4">{t('createFirst')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
