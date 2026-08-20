'use client'

import { useTranslations } from 'next-intl'

export function Benefits() {
  const t = useTranslations('landing.benefits')

  const items = [0, 1, 2, 3].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
  }))

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <span className="text-2xl">✅</span>
              <h3 className="font-semibold text-slate-900 mt-4 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
