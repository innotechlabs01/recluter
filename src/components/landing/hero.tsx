'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProcessSlider } from '@/components/landing/process-slider'

export function Hero() {
  const t = useTranslations('landing.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 md:py-28">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-none">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              🚀 Plataforma de Reclutamiento
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('title')}
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-blue-50 shadow-lg shadow-blue-500/25">
                  {t('cta')}
                </Button>
              </a>
              <a href="#como-funciona">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  {t('secondary')}
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Sin costos fijos
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Talento verificado
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Proceso transparente
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[45%] max-w-lg lg:max-w-none">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 p-3">
              <ProcessSlider />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
