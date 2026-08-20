# Landing Pro Design — Hero Partido + Process Slider

**Date:** 2026-08-20
**Status:** Approved
**Scope:** UI elevation of marketing landing (no logic/i18n/route changes)
**Decision:** Option A — Hero split (55/45) with right-side auto-rotating process slider (stock premium, replaceable)

## 1. Goal
Transform landing from functional to premium B2B to increase trust and conversion for US companies hiring in Colombia. First 3 seconds must convey: professional, orderly, human talent. Keep existing message, CTA, and 10-section structure; elevate only above-the-fold + process storytelling.

## 2. Context & Constraints
- Stack: Next 16.3.1 (Turbopack), Tailwind 4, shadcn (base-nova), next-intl, lucide-react, next/image.
- Existing landing: `src/app/(marketing)/page.tsx` composes 10 sections: Hero, TrustLogos, HowItWorks, Metrics, Benefits, Testimonials, FAQ, Payment, FinalCTA, Contact. All use `useTranslations`.
- No new dependencies allowed; must not break i18n or build.
- Images: stock premium (Unsplash, free license) as placeholders in `public/images/process/` for 4 steps, replaceable without code change. No real client photos available yet.
- Must respect `prefers-reduced-motion`, be fully responsive, and keep performance (no layout shift, lazy loading).

## 3. Architecture
### Files Touched
- `src/components/landing/hero.tsx` — full redesign to split layout, integrates new slider.
- `src/components/landing/trust-logos.tsx` — grayscale logo marquee.
- `src/components/landing/how-it-works.tsx` — rich cards with 16:9 images.
- `src/components/landing/process-slider.tsx` — **new** isolated slider component (client, `useState` + `setInterval`).

### Assets Added
- `public/images/process/01-solicitud.jpg` (1200x800, team filling form / office)
- `public/images/process/02-busqueda.jpg` (sourcing / recruiter at desk)
- `public/images/process/03-candidatos.jpg` (profiles / interview)
- `public/images/process/04-contratacion.jpg` (handshake / hiring)
- Optional: keep `public/grid.svg` already used.

### Not Touched
- `src/app/(marketing)/page.tsx` structure order, all other sections (Benefits, Testimonials, etc.), API, middleware, i18n files (`messages/es.json`).

## 4. Component Design

### 4.1 Hero (split 55/45)
Layout:
```
Desktop: [ Left 55% | Right 45% ]  (flex row, gap-12, items-center)
Mobile: stacked (text top, slider full-width below)
```
Left:
- Badge "🚀 Plataforma de Reclutamiento" (keep)
- H1 `t('title')`, Subtitle `t('subtitle')` (keep translations)
- 2 CTAs (keep)
- Trust indicators row (keep, subtle style tweak)

Right:
- Card wrapper: `bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 p-3`
- Contains `ProcessSlider` (4:3 aspect, `overflow-hidden rounded-xl`)

Background: keep gradient `from-slate-900 via-blue-900 to-slate-900` but reduce intensity to 90%, keep grid.svg at `opacity-[0.06]` and single blur blob at `bg-blue-500/15`.

### 4.2 ProcessSlider (new)
Props: none (internal slide data array with image path, step number, title from translations or hardcoded labels for slider captions).
State: `current: number`, `paused: boolean`.
Behavior:
- Auto-rotate every 4000ms via `setInterval`, pause on hover/focus.
- If `prefers-reduced-motion: reduce` → disable auto-rotate, manual only.
- Dots + arrow buttons (shadcn Button variant ghost, `aria-label`).
- Transition: `opacity` + `scale-[1.02]` fade (Tailwind `transition-all duration-500`).
- Images: `next/image` with `fill`, `object-cover`, `sizes="(max-width: 768px) 100vw, 45vw"`, first image `priority`, rest `loading="lazy"`, all with descriptive `alt`.
- Caption overlay: bottom gradient `from-slate-900/80 to-transparent` with `Badge` Step N + title.

### 4.3 TrustLogos (elevated)
From text pills to logo row:
- Replace text names with 5 inline SVGs or styled text logos still (keep no external images to avoid licensing) but styled as `grayscale opacity-60 hover:opacity-100 transition` + `text-slate-400`.
- Layout: `flex` with `gap-12` + subtle marquee via CSS animation `animate-marquee` (if tw-animate-css supports) or simple static row (no JS). Keep heading.

### 4.4 HowItWorks (rich cards)
From 4 small centered cards to:
- Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Each card: `bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition`
  - Top: `aspect-[16/9] relative` image (same 4 images as slider, reused)
  - Icon overlay: `absolute -bottom-6 left-6 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg`
  - Body: `pt-10 p-6` with title + description (keep translations)
- Keep `id="como-funciona"` anchor.

### 4.5 Metrics
No structural change. Add `data-animate` and Tailwind `animate-in` fade on scroll (optional, via CSS only, no JS). Keep blue background.

## 5. Data Flow
Static only. No fetch. Slider data is local array:
```ts
const slides = [
  { img: "/images/process/01-solicitud.jpg", step: "Paso 1", title: t('step1.title') },
  // ...
]
```
i18n remains via `useTranslations` in Hero/HowItWorks; slider captions reuse same translation keys to stay in sync.

## 6. Responsive & Accessibility
- Breakpoints: `md` splits hero, `lg` for 4-col HowItWorks.
- Keyboard: dots and arrows are buttons with focus ring.
- ARIA: slider `role="region" aria-roledescription="carousel"`, each slide `aria-label="Slide 3 of 4"`.
- Alt text per image: e.g., "Equipo de reclutamiento revisando solicitudes".
- Reduced motion: media query disables auto-rotate.

## 7. Performance
- Images optimized ~150-250KB each, total <1MB.
- `priority` only first slide; others lazy.
- No new JS libs; slider JS <2KB.
- No CLS: fixed aspect ratios.

## 8. Risks & Mitigations
- Risk: Stock images feel generic → Mitigation: choose authentic office/team photos, not staged corporate, and make path trivial to replace.
- Risk: Slider distraction → Mitigation: slow 4s interval, pause on hover, subtle animation.
- Risk: Build break with next/image → Mitigation: use `fill` correctly, keep `public/` paths, test `npm run build`.

## 9. Testing / Verification
- Visual: manual check at 375px, 768px, 1440px.
- Build: `npm run build` must pass.
- Lint: `npm run lint`.
- Deploy preview on Vercel; hard refresh to see stylesheet.

## 10. Future Enhancements (out of scope)
- Replace stock with real photos/video loop background.
- Add video modal in hero (trigger from slider).
- CMS for logos/testimonials.
