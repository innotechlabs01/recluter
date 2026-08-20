'use client'

import { useTranslations } from 'next-intl'

const recruiters = [
  { name: 'María García', email: 'maria@recluter.com', specialty: 'Tecnología', active: 5, completed: 12 },
  { name: 'Carlos López', email: 'carlos@recluter.com', specialty: 'Ventas & Marketing', active: 3, completed: 8 },
  { name: 'Ana Martínez', email: 'ana@recluter.com', specialty: 'Administración', active: 4, completed: 15 },
]

export default function ReclutadoresPage() {
  const t = useTranslations('admin.recruiters')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recruiters.map((recruiter) => (
          <div key={recruiter.email} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{recruiter.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{recruiter.name}</h3>
                <p className="text-xs text-slate-500">{recruiter.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">{t('specialty')}:</span><span>{recruiter.specialty}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">{t('active')}:</span><span className="font-medium">{recruiter.active}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">{t('completed')}:</span><span className="font-medium">{recruiter.completed}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
