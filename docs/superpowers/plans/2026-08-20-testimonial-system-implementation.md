# Testimonial System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded landing testimonials with real client feedback — auto-request via email post-hire, admin review, public form, landing display.

**Architecture:** New `testimonials` DB table, Resend email integration, token-protected form, admin CRUD, API routes, landing fetch from DB.

**Tech Stack:** Next.js 16.3.1, Drizzle ORM, Supabase PostgreSQL, Clerk auth, Resend email, Tailwind 4, shadcn

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/db/schema.ts` | Modify | Add testimonialStatusEnum + testimonials table |
| `src/lib/resend.ts` | Create | Resend client singleton |
| `src/lib/email/testimonial-request.tsx` | Create | Email template component |
| `src/lib/token.ts` | Create | JWT token generate/verify helpers |
| `src/app/api/testimonials/request/route.ts` | Create | POST — trigger email + create record |
| `src/app/api/testimonials/route.ts` | Create | GET — public approved testimonials |
| `src/app/api/testimonials/[id]/route.ts` | Create | PATCH — submit testimonial from form |
| `src/app/api/admin/testimonials/route.ts` | Create | GET — list all (admin) |
| `src/app/api/admin/testimonials/[id]/route.ts` | Create | PATCH — approve/reject, DELETE — remove |
| `src/app/(marketing)/testimonio/page.tsx` | Create | Public testimonial form |
| `src/app/admin/testimonios/page.tsx` | Create | Admin testimonial management |
| `src/components/landing/testimonials.tsx` | Modify | Fetch from API |
| `src/app/admin/layout.tsx` | Modify | Add nav item |
| `messages/es.json` | Modify | Add testimonial translations |
| `package.json` | Modify | Add `jsonwebtoken` for JWT |

---

### Task 1: DB Schema + Migration

**Files:**
- Modify: `src/lib/db/schema.ts`

- [ ] **Step 1: Add testimonials table to schema**

Append to `src/lib/db/schema.ts` (after the `systemConfig` table):

```ts
// ── Testimonials ────────────────────────────────────────────────────────────────

export const testimonialStatusEnum = pgEnum('testimonial_status', [
  'pending',
  'approved',
  'rejected',
])

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  companyName: text('company_name').notNull(),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull(),
  status: testimonialStatusEnum('status').default('pending'),
  token: text('token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
})
```

- [ ] **Step 2: Generate migration**

```bash
npx drizzle-kit generate
```

- [ ] **Step 3: Apply migration**

```bash
npx drizzle-kit push
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts src/lib/db/migrations/
git commit -m "feat: add testimonials table schema and migration"
```

---

### Task 2: Resend Client + Email Template

**Files:**
- Create: `src/lib/resend.ts`
- Create: `src/lib/email/testimonial-request.tsx`

- [ ] **Step 1: Create Resend client**

```ts
// src/lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

- [ ] **Step 2: Create email template**

```tsx
// src/lib/email/testimonial-request.tsx
interface TestimonialRequestEmailProps {
  authorName: string
  companyName: string
  token: string
}

export function TestimonialRequestEmail({
  authorName,
  companyName,
  token,
}: TestimonialRequestEmailProps) {
  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://reclutersystem.vercel.app'}/testimonio?token=${token}`

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, color: '#1e293b', marginBottom: 8 }}>
          ¡Felicitaciones, {authorName}! 🎉
        </h1>
        <p style={{ fontSize: 16, color: '#64748b' }}>
          {companyName} acaba de hacer una contratación exitosa con Recluter
        </p>
      </div>

      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, margin: 0 }}>
          Nos encantaría conocer tu experiencia. Tu testimonio ayuda a otras empresas a confiar en nuestro proceso de reclutamiento.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <a
          href={formUrl}
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Dejar mi testimonio
        </a>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>
        Solo toma 1 minuto. Tu testimonio será revisado antes de publicarse.
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />

      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
        Recluter — Plataforma de Reclutamiento
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/resend.ts src/lib/email/
git commit -m "feat: add Resend client and testimonial request email template"
```

---

### Task 3: JWT Token Helper

**Files:**
- Create: `src/lib/token.ts`

- [ ] **Step 1: Install jsonwebtoken**

```bash
npm install jsonwebtoken && npm install -D @types/jsonwebtoken
```

- [ ] **Step 2: Create token helper**

```ts
// src/lib/token.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.CLERK_SECRET_KEY || 'fallback-secret'

export interface TestimonialTokenPayload {
  companyId: string
  jobRequestId: string
  authorName: string
  authorRole: string
  companyName: string
}

export function generateTestimonialToken(payload: TestimonialTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyTestimonialToken(token: string): TestimonialTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TestimonialTokenPayload
  } catch {
    return null
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/token.ts package.json package-lock.json
git commit -m "feat: add JWT token helper for testimonial forms"
```

---

### Task 4: API Routes — Request + Public + Admin

**Files:**
- Create: `src/app/api/testimonials/request/route.ts`
- Create: `src/app/api/testimonials/route.ts`
- Create: `src/app/api/testimonials/[id]/route.ts`
- Create: `src/app/api/admin/testimonials/route.ts`
- Create: `src/app/api/admin/testimonials/[id]/route.ts`

- [ ] **Step 1: Create POST /api/testimonials/request**

```ts
// src/app/api/testimonials/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials, jobRequests, companies } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { resend } from '@/lib/resend'
import { TestimonialRequestEmail } from '@/lib/email/testimonial-request'
import { generateTestimonialToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { jobRequestId } = await req.json()

  // Load job request with company
  const [jobRequest] = await db
    .select()
    .from(jobRequests)
    .leftJoin(companies, eq(jobRequests.companyId, companies.id))
    .where(eq(jobRequests.id, jobRequestId))
    .limit(1)

  if (!jobRequest || !jobRequest.companies) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const company = jobRequest.companies

  // Generate token
  const token = generateTestimonialToken({
    companyId: company.id,
    jobRequestId: jobRequest.job_requests.id,
    authorName: company.contactName || company.name,
    authorRole: 'Cliente',
    companyName: company.name,
  })

  // Insert testimonial record
  await db.insert(testimonials).values({
    companyId: company.id,
    jobRequestId: jobRequest.job_requests.id,
    authorName: company.contactName || company.name,
    authorRole: 'Cliente',
    companyName: company.name,
    quote: '', // Will be filled by client
    rating: 5, // Default, will be updated
    token,
  })

  // Send email
  await resend.emails.send({
    from: 'Recluter <onboarding@resend.dev>',
    to: company.contactEmail || 'admin@recluter.com',
    subject: '¡Compartí tu experiencia con Recluter!',
    react: TestimonialRequestEmail({
      authorName: company.contactName || company.name,
      companyName: company.name,
      token,
    }),
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Create GET /api/testimonials (public)**

```ts
// src/app/api/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'approved'
  const limit = parseInt(searchParams.get('limit') || '6')

  const results = await db
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorRole: testimonials.authorRole,
      companyName: testimonials.companyName,
      quote: testimonials.quote,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.status, status as any))
    .orderBy(desc(testimonials.createdAt))
    .limit(limit)

  return NextResponse.json(results)
}
```

- [ ] **Step 3: Create PATCH /api/testimonials/[id] (form submit)**

```ts
// src/app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { quote, rating } = await req.json()

  if (!quote || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await db
    .update(testimonials)
    .set({
      quote,
      rating,
      status: 'approved', // Auto-approve for v1
      reviewedAt: new Date(),
    })
    .where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 4: Create GET /api/admin/testimonials**

```ts
// src/app/api/admin/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt))

  return NextResponse.json(results)
}
```

- [ ] **Step 5: Create PATCH + DELETE /api/admin/testimonials/[id]**

```ts
// src/app/api/admin/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await db
    .update(testimonials)
    .set({ status, reviewedAt: new Date() })
    .where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(testimonials).where(eq(testimonials.id, id))

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/testimonials/ src/app/api/admin/testimonials/
git commit -m "feat: add testimonial API routes (request, public, admin)"
```

---

### Task 5: Testimonial Form Page

**Files:**
- Create: `src/app/(marketing)/testimonio/page.tsx`

- [ ] **Step 1: Create testimonial form page**

```tsx
// src/app/(marketing)/testimonio/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface TokenData {
  authorName: string
  authorRole: string
  companyName: string
  jobRequestId: string
}

export default function TestimonioPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [quote, setQuote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Token no válido')
      return
    }
    // Decode JWT payload (base64)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setTokenData({
        authorName: payload.authorName,
        authorRole: payload.authorRole,
        companyName: payload.companyName,
        jobRequestId: payload.jobRequestId,
      })
    } catch {
      setError('Token no válido')
    }
  }, [token])

  const handleSubmit = async () => {
    if (rating === 0 || quote.length < 10) {
      setError('Por favor completá todas las campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // We need the testimonial ID from the token — decode it
      const payload = JSON.parse(atob(token!.split('.')[1]))

      // Find testimonial by token
      const res = await fetch(`/api/testimonials?token=${token}`)
      const testimonials = await res.json()

      if (testimonials.length === 0) {
        setError('Testimonial no encontrado')
        return
      }

      // Update testimonial
      await fetch(`/api/testimonials/${testimonials[0].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, rating }),
      })

      setSubmitted(true)
    } catch {
      setError('Error al enviar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias!</h1>
          <p className="text-slate-600">
            Tu testimonio fue enviado y será revisado antes de publicarse.
          </p>
        </div>
      </div>
    )
  }

  if (error && !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Token no válido</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-lg mx-auto p-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">Testimonio</Badge>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ¿Cómo fue tu experiencia?
          </h1>
          <p className="text-slate-600">
            {tokenData?.companyName} — Tu opinión nos ayuda a mejorar
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Author info */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {tokenData?.authorName?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900">{tokenData?.authorName}</p>
              <p className="text-sm text-slate-500">{tokenData?.authorRole}</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tu testimonio
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Contanos sobre tu experiencia con Recluter..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Mínimo 10 caracteres ({quote.length}/500)
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || quote.length < 10}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Enviar testimonio'}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(marketing\)/testimonio/
git commit -m "feat: add public testimonial form page"
```

---

### Task 6: Admin Testimonials Page

**Files:**
- Create: `src/app/admin/testimonios/page.tsx`
- Modify: `src/app/admin/layout.tsx` (add nav item)

- [ ] **Step 1: Create admin testimonials page**

```tsx
// src/app/admin/testimonios/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Trash2, Star } from 'lucide-react'

interface Testimonial {
  id: string
  authorName: string
  authorRole: string
  companyName: string
  quote: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function AdminTestimoniosPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setTestimonials(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchTestimonials()
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    fetchTestimonials()
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Testimonios</h1>
        <p className="text-slate-600">Gestiona los testimonios de tus clientes</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-slate-500">No hay testimonios ainda</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 text-sm font-medium text-slate-600">Autor</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Empresa</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Rating</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Testimonio</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{t.authorName}</p>
                    <p className="text-xs text-slate-500">{t.authorRole}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{t.companyName}</td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                    {t.quote || <span className="italic text-slate-400">Sin testimonio</span>}
                  </td>
                  <td className="p-4">
                    <Badge className={statusColors[t.status]}>{t.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {t.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(t.id, 'approved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(t.id, 'rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTestimonial(t.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add nav item to admin layout**

In `src/app/admin/layout.tsx`, find the navigation array and add:

```ts
{ label: 'Testimonios', href: '/admin/testimonios' },
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/testimonios/ src/app/admin/layout.tsx
git commit -m "feat: add admin testimonials management page"
```

---

### Task 7: Landing Testimonials from API

**Files:**
- Modify: `src/components/landing/testimonials.tsx`

- [ ] **Step 1: Rewrite testimonials to fetch from API**

```tsx
// src/components/landing/testimonials.tsx
'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  authorName: string
  authorRole: string
  companyName: string
  quote: string
  rating: number
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    authorName: 'Sarah Johnson',
    authorRole: 'CTO',
    companyName: 'TechCo',
    quote: 'Recluter nos ayudó a encontrar 3 desarrolladores senior en menos de 2 semanas. El proceso fue transparente y sin sorpresas.',
    rating: 5,
  },
  {
    id: '2',
    authorName: 'Michael Chen',
    authorRole: 'VP Engineering',
    companyName: 'GlobalInc',
    quote: 'La calidad del talento colombiano es excepcional. Ahora tenemos un equipo completo de 8 personas trabajando desde Colombia.',
    rating: 5,
  },
  {
    id: '3',
    authorName: 'Laura Martínez',
    authorRole: 'HR Director',
    companyName: 'InnovateLab',
    quote: 'Lo que más me gustó es que solo cobran cuando contratás. Sin riesgo, sin costos ocultos. Totalmente recomendado.',
    rating: 5,
  },
]

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)

  useEffect(() => {
    fetch('/api/testimonials?status=approved&limit=6')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setTestimonials(data)
      })
      .catch(() => {
        // Keep fallback testimonials
      })
  }, [])

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Empresas que ya confiaron en nosotros
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {testimonial.authorName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{testimonial.authorName}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.authorRole}, {testimonial.companyName}
                  </p>
                </div>
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
git add src/components/landing/testimonials.tsx
git commit -m "feat: testimonials now fetch from API with fallback"
```

---

### Task 8: Translations + Final Verification

**Files:**
- Modify: `messages/es.json`

- [ ] **Step 1: Add testimonial translations to messages/es.json**

Add under the `landing` key:

```json
"testimonials": {
  "title": "Lo que dicen nuestros clientes",
  "subtitle": "Empresas que ya confiaron en nosotros"
}
```

- [ ] **Step 2: Build verification**

```bash
npm run build 2>&1 | tail -30
```

- [ ] **Step 3: Commit + push**

```bash
git add messages/es.json
git commit -m "feat: add testimonial translations"
git push origin main
```

---

## Summary

| Task | What | Est. Time |
|------|------|-----------|
| 1 | DB schema + migration | 3 min |
| 2 | Resend client + email template | 3 min |
| 3 | JWT token helper | 2 min |
| 4 | API routes (5 files) | 8 min |
| 5 | Testimonial form page | 5 min |
| 6 | Admin testimonials page | 5 min |
| 7 | Landing fetch from API | 3 min |
| 8 | Translations + verification | 3 min |
| **Total** | | **~32 min** |
