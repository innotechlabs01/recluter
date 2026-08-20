'use client'

import { useTranslations } from 'next-intl'

export function FAQ() {
  const t = useTranslations('landing.faq')

  const items = [0, 1, 2, 3].map((i) => ({
    q: t(`items.${i}.q`),
    a: t(`items.${i}.a`),
  }))

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('title')}</h2>
        <div className="space-y-6">
          {items.map((faq, i) => (
            <div key={i} className="border-b pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
