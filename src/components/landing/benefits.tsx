'use client'

import { useTranslations } from 'next-intl'
import { Shield, Zap, DollarSign, Globe } from 'lucide-react'

const icons = [Shield, Zap, DollarSign, Globe]

export function Benefits() {
  const t = useTranslations('landing.benefits')

  const items = [0, 1, 2, 3].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    Icon: icons[i],
  }))

  return (
    <section id="beneficios" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <benefit.Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
