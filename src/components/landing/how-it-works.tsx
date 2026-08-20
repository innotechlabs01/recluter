'use client'

import { useTranslations } from 'next-intl'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  const steps = stepKeys.map((key, i) => ({
    num: String(i + 1),
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  }))

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{step.num}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
