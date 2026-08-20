'use client'

import { useTranslations } from 'next-intl'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export function FAQ() {
  const t = useTranslations('landing.faq')

  const items = [0, 1, 2, 3].map((i) => ({
    q: t(`items.${i}.q`),
    a: t(`items.${i}.a`),
  }))

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('title')}</h2>
        <Accordion multiple className="space-y-2">
          {items.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
