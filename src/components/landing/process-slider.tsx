'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Slide {
  img: string
  step: string
  title: string
}

const slides: Slide[] = [
  { img: '/images/process/01-solicitud.jpg', step: 'Paso 1', title: 'Creás tu solicitud' },
  { img: '/images/process/02-busqueda.jpg', step: 'Paso 2', title: 'Nosotros buscamos' },
  { img: '/images/process/03-candidatos.jpg', step: 'Paso 3', title: 'Recibís candidatos' },
  { img: '/images/process/04-contratacion.jpg', step: 'Paso 4', title: 'Contratás al mejor' },
]

export function ProcessSlider() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Proceso de reclutamiento"
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} de ${slides.length}`}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            i === current
              ? 'opacity-100 scale-100 z-10'
              : 'opacity-0 scale-[1.02] z-0'
          }`}
        >
          <Image
            src={slide.img}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority={i === 0}
            loading={i === 0 ? undefined : 'lazy'}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-4 pt-12">
            <span className="inline-block text-xs font-semibold text-blue-300 bg-blue-600/80 px-2 py-0.5 rounded-full mb-1.5">
              {slide.step}
            </span>
            <p className="text-sm font-medium text-white">{slide.title}</p>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        aria-label="Slide anterior"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 border-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Slide siguiente"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 border-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
