'use client'

import { useTranslations } from 'next-intl'

export function Payment() {
  const t = useTranslations('landing.payment')

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-8">{t('subtitle')}</p>
        <div className="bg-white p-8 rounded-lg border">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">{t('model')}</h3>
          <p className="text-slate-600 mb-6">{t('description')}</p>
          <p className="font-medium text-slate-900 mb-2">{t('methods')}</p>
          <div className="flex gap-6 text-slate-600">
            <span>💳 {t('bank')}</span>
            <span>🅿️ {t('paypal')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
