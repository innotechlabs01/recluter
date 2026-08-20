# Landing Pro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Recluter landing from functional to premium B2B with a split hero featuring an auto-rotating process slider, elevated trust logos, and rich process cards.

**Architecture:** 4 new/modified React components (`ProcessSlider` new, `Hero` redesigned, `TrustLogos` elevated, `HowItWorks` redesigned). No new dependencies, no i18n changes, no API changes. Images go in `public/images/process/`.

**Tech Stack:** Next.js 16.3.1 (Turbopack), Tailwind 4, shadcn base-nova, next-intl, lucide-react, next/image

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `public/images/process/01-solicitud.jpg` | Create | Stock image — team filling form |
| `public/images/process/02-busqueda.jpg` | Create | Stock image — recruiter sourcing |
| `public/images/process/03-candidatos.jpg` | Create | Stock image — interview/profiles |
| `public/images/process/04-contratacion.jpg` | Create | Stock image — handshake |
| `src/components/landing/process-slider.tsx` | Create | Auto-rotating carousel component |
| `src/components/landing/hero.tsx` | Modify | Split 55/45 layout + slider integration |
| `src/components/landing/trust-logos.tsx` | Modify | Grayscale logos with hover transition |
| `src/components/landing/how-it-works.tsx` | Modify | Rich cards with 16:9 images |
| `src/components/landing/metrics.tsx` | Modify | Minor scroll animation |

---

### Task 1: Download stock images

**Files:**
- Create: `public/images/process/01-solicitud.jpg`
- Create: `public/images/process/02-busqueda.jpg`
- Create: `public/images/process/03-candidatos.jpg`
- Create: `public/images/process/04-contratacion.jpg`

- [ ] **Step 1: Create directory**

```bash
mkdir -p public/images/process
```

- [ ] **Step 2: Download 4 images from Unsplash (free license)**

```bash
curl -sL "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&q=80" -o public/images/process/01-solicitud.jpg
curl -sL "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=800&fit=crop&q=80" -o public/images/process/02-busqueda.jpg
curl -sL "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop&q=80" -o public/images/process/03-candidatos.jpg
curl -sL "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=1200&h=800&fit=crop&q=80" -o public/images/process/04-contratacion.jpg
```

- [ ] **Step 3: Verify images downloaded**

```bash
ls -lh public/images/process/
```

Expected: 4 files, each ~100-300KB, type JPEG.

- [ ] **Step 4: Commit**

```bash
git add public/images/process/
git commit -m "chore: add stock process images for landing hero slider"
```

---

### Task 2: Create ProcessSlider component

**Files:**
- Create: `src/components/landing/process-slider.tsx`

- [ ] **Step 1: Create the slider component**

```tsx
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

  // Auto-rotate every 4s, pause on hover
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
          {/* Caption overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-4 pt-12">
            <span className="inline-block text-xs font-semibold text-blue-300 bg-blue-600/80 px-2 py-0.5 rounded-full mb-1.5">
              {slide.step}
            </span>
            <p className="text-sm font-medium text-white">{slide.title}</p>
          </div>
        </div>
      ))}

      {/* Arrow buttons */}
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

      {/* Dots */}
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No errors (or only pre-existing ones).

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/process-slider.tsx
git commit -m "feat: add ProcessSlider component for landing hero"
```

---

### Task 3: Redesign Hero to split layout

**Files:**
- Modify: `src/components/landing/hero.tsx` (full rewrite)

- [ ] **Step 1: Rewrite hero component**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProcessSlider } from '@/components/landing/process-slider'

export function Hero() {
  const t = useTranslations('landing.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Text */}
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

            {/* Trust indicators */}
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

          {/* Right — Process Slider */}
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
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds, no errors.

- [ ] **Step 3: Visual check in dev**

```bash
npm run dev
```

Open `http://localhost:3000/es`, verify:
- Hero splits 55/45 on desktop
- Slider auto-rotates on right
- Mobile stacks vertically
- No layout shift

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/hero.tsx
git commit -m "feat: redesign Hero to split layout with process slider"
```

---

### Task 4: Redesign TrustLogos

**Files:**
- Modify: `src/components/landing/trust-logos.tsx` (full rewrite)

- [ ] **Step 1: Rewrite trust logos component**

```tsx
export function TrustLogos() {
  const logos = [
    { name: 'Acme Corp', width: 'w-28' },
    { name: 'TechCo', width: 'w-24' },
    { name: 'GlobalInc', width: 'w-32' },
    { name: 'InnovateLab', width: 'w-36' },
    { name: 'StartupX', width: 'w-28' },
  ]

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-slate-400 mb-6 uppercase tracking-widest font-medium">
          Empresas que confían en nosotros
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`${logo.width} h-10 flex items-center justify-center text-xl font-bold text-slate-300 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/trust-logos.tsx
git commit -m "feat: elevate TrustLogos with grayscale hover transition"
```

---

### Task 5: Redesign HowItWorks with images

**Files:**
- Modify: `src/components/landing/how-it-works.tsx` (full rewrite)

- [ ] **Step 1: Rewrite how-it-works component**

```tsx
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
              {/* Image */}
              <div className="relative aspect-[16/9]">
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Icon overlay */}
                <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <step.Icon className="w-5 h-5" />
                </div>
              </div>
              {/* Body */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: redesign HowItWorks with 16:9 images and icon overlays"
```

---

### Task 6: Final build verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build succeeds, all 34 routes generated.

- [ ] **Step 2: Visual verification checklist**

```bash
npm run dev
```

Check at 3 breakpoints:
- [ ] 1440px: Hero split 55/45, slider on right, 4 HowItWorks cards in row
- [ ] 768px: Hero stacked, HowItWorks 2x2 grid
- [ ] 375px: Hero full-width, slider full-width, HowItWorks single column
- [ ] Slider auto-rotates, pauses on hover
- [ ] Trust logos show grayscale, hover returns color
- [ ] No layout shift on any breakpoint
- [ ] No console errors

- [ ] **Step 3: Lint check**

```bash
npm run lint 2>&1 | tail -10
```

Expected: No errors (warnings acceptable).

- [ ] **Step 4: Commit all and push**

```bash
git add -A
git commit -m "feat: landing pro redesign - split hero, process slider, elevated sections"
git push origin main
```

- [ ] **Step 5: Verify Vercel deploy**

Wait for Vercel auto-deploy (~2 min). Open `https://reclutersystem.vercel.app/` with hard refresh (`Ctrl+Shift+R`). Verify all 4 sections look correct.

---

## Summary

| Task | What | Est. Time |
|------|------|-----------|
| 1 | Download stock images | 2 min |
| 2 | Create ProcessSlider | 5 min |
| 3 | Redesign Hero | 5 min |
| 4 | Redesign TrustLogos | 3 min |
| 5 | Redesign HowItWorks | 5 min |
| 6 | Final verification + deploy | 5 min |
| **Total** | | **~25 min** |
