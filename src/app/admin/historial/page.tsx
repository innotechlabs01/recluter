'use client'


import { useTranslations } from 'next-intl'

export default function AdminHistorialPage() {
  const t = useTranslations('admin.history')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <p className="text-slate-600">{t('subtitle')}</p>
      <div className="bg-white p-8 rounded-lg border text-center text-slate-500">
        {t('comingSoon')}
      </div>
    </div>
  )
}
