'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ClipboardList, Users, MessageSquare, Handshake } from 'lucide-react'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const
const icons = [ClipboardList, Users, MessageSquare, Handshake]
const images = [
  '/images/process/01-solicitud.jpg',
  '/images/process/02-busqueda.jpg',
  '/images/process/03-candidatos.jpg',
  '/images/process/04-contratacion.jpg',
]

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  const steps = stepKeys.map((key, i) => ({
    num: String(i + 1),
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    Icon: icons[i],
    img: images[i],
  }))

  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <step.Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="pt-8 p-5">
                <h3 className="font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
