'use client'


import { useTranslations } from 'next-intl'

export default function AdminDashboard() {
  const t = useTranslations('admin.dashboard')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('registeredCompanies')}</p>
          <p className="text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('activeRequests')}</p>
          <p className="text-3xl font-bold text-slate-900">28</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('candidatePool')}</p>
          <p className="text-3xl font-bold text-slate-900">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-slate-600">{t('activeRecruiters')}</p>
          <p className="text-3xl font-bold text-slate-900">8</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('recentRequests')}</h2>
          <div className="space-y-3">
            {['Desarrollador Senior - Acme Corp', 'Account Manager - TechCo', 'Designer UX - GlobalInc'].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item}</span>
                <span className="text-xs text-slate-500">Hace {i + 1} día</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('metrics')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-600">{t('avgHireTime')}:</span><span className="font-medium">18 días</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">{t('successRate')}:</span><span className="font-medium">85%</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">{t('monthlyRequests')}:</span><span className="font-medium">28</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
