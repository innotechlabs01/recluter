'use client'

import { useTranslations } from 'next-intl'
import { ClipboardList, Users, MessageSquare, Handshake } from 'lucide-react'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const
const icons = [ClipboardList, Users, MessageSquare, Handshake]

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  const steps = stepKeys.map((key, i) => ({
    num: String(i + 1),
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    Icon: icons[i],
  }))

  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <step.Icon className="w-7 h-7 text-blue-600" />
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
