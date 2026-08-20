'use client'

import { useTranslations } from 'next-intl'

export default function CandidatoDashboard() {
  const t = useTranslations('candidato.dashboard')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('welcome')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('activeApplications')}</p>
          <p className="text-3xl font-bold text-slate-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('pendingInterviews')}</p>
          <p className="text-3xl font-bold text-slate-900">1</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('availableOpportunities')}</p>
          <p className="text-3xl font-bold text-slate-900">2</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('upcomingInterviews')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div><span className="font-medium">Acme Corp</span> — Desarrollador Senior</div>
              <span className="text-slate-500">25 Ago 10:00</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('recentUpdates')}</h2>
          <div className="space-y-3">
            <div className="text-sm"><span className="font-medium text-green-600">CV revisado</span> — Acme Corp revisó tu perfil</div>
            <div className="text-sm"><span className="font-medium text-blue-600">Postulación enviada</span> — TechCo — Account Manager</div>
          </div>
        </div>
      </div>
    </div>
  )
}
