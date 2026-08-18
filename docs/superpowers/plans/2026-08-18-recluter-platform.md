# Recluter Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete recruitment platform connecting US companies with Colombian talent, featuring company/admin/candidate portals, a 6-step job request wizard, process tracking, and multi-tenancy.

**Architecture:** Next.js 14+ monolith with App Router, route groups per portal, Clerk Organizations for multi-tenancy, Supabase PostgreSQL with RLS, shadcn/ui components, next-intl for i18n (ES/EN).

**Tech Stack:** Next.js 14+, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Clerk, Supabase (PostgreSQL + Storage + Edge Functions), Drizzle ORM, next-intl, Vercel.

---

## File Structure

```
recluter_system/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                    # Landing homepage
│   │   │   ├── layout.tsx                  # Marketing layout (no sidebar)
│   │   │   ├── como-funciona/page.tsx
│   │   │   ├── beneficios/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── terminos/page.tsx
│   │   │   └── contacto/page.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── role-selection/page.tsx
│   │   ├── (empresa)/
│   │   │   ├── layout.tsx                  # Empresa sidebar layout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── solicitar/[step]/page.tsx
│   │   │   ├── procesos/page.tsx
│   │   │   ├── procesos/[id]/page.tsx
│   │   │   ├── candidatos/page.tsx
│   │   │   ├── historial/page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   └── notificaciones/page.tsx
│   │   ├── (candidato)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   ├── oportunidades/page.tsx
│   │   │   ├── postulaciones/page.tsx
│   │   │   ├── entrevistas/page.tsx
│   │   │   ├── documentos/page.tsx
│   │   │   └── notificaciones/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── empresas/page.tsx
│   │   │   ├── solicitudes/page.tsx
│   │   │   ├── candidatos/page.tsx
│   │   │   ├── reclutadores/page.tsx
│   │   │   ├── historial/page.tsx
│   │   │   └── configuracion/page.tsx
│   │   └── api/
│   │       ├── solicitudes/route.ts
│   │       ├── candidatos/route.ts
│   │       └── webhooks/clerk/route.ts
│   ├── components/
│   │   ├── ui/                             # shadcn components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── notifications-bell.tsx
│   │   ├── wizard/
│   │   │   ├── stepper.tsx
│   │   │   ├── step-company.tsx
│   │   │   ├── step-position.tsx
│   │   │   ├── step-profile.tsx
│   │   │   ├── step-conditions.tsx
│   │   │   ├── step-selection.tsx
│   │   │   └── step-review.tsx
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx
│   │   │   ├── process-list.tsx
│   │   │   └── candidate-card.tsx
│   │   └── shared/
│   │       ├── language-switcher.tsx
│   │       └── logo.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                    # Drizzle client
│   │   │   ├── schema.ts                   # All tables
│   │   │   └── migrations/
│   │   ├── auth.ts                         # Clerk helpers
│   │   ├── i18n.ts                         # next-intl config
│   │   ├── supabase.ts                     # Supabase client
│   │   └── utils.ts                        # Shared utilities
│   ├── hooks/
│   │   ├── use-wizard.ts
│   │   └── use-translations.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── db.ts
│   └── messages/
│       ├── es.json
│       └── en.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── drizzle.config.ts
├── next.config.ts
├── middleware.ts
├── tailwind.config.ts
├── components.json                         # shadcn config
└── package.json
```

---

## Phase 1: Foundation

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `components.json`, `postcss.config.js`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest recluter_system \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install @clerk/nextjs @supabase/supabase-js drizzle-orm next-intl
npm install -D drizzle-kit @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea badge separator tabs dialog dropdown-menu avatar
```

- [ ] **Step 4: Configure next.config.ts**

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with Clerk, Supabase, shadcn, next-intl"
```

### Task 2: Environment Configuration

**Files:**
- Create: `.env.local`, `.env.example`

- [ ] **Step 1: Create .env.example**

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 2: Create .env.local with placeholder values**

Copy `.env.example` to `.env.local` and add actual keys from Clerk and Supabase dashboards.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "feat: add environment configuration template"
```

### Task 3: Database Schema

**Files:**
- Create: `src/lib/db/schema.ts`, `src/lib/db/index.ts`, `drizzle.config.ts`, `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create Drizzle schema**

```typescript
// src/lib/db/schema.ts
import { pgTable, uuid, text, timestamp, jsonb, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const companyStatusEnum = pgEnum('company_status', ['active', 'inactive', 'suspended'])
export const jobRequestStatusEnum = pgEnum('job_request_status', [
  'received', 'reviewing', 'info_pending', 'searching', 'evaluating',
  'candidates_sent', 'interview', 'selected', 'hired', 'closed',
  'paused', 'cancelled', 'new_search_required'
])
export const candidateStatusEnum = pgEnum('candidate_status', ['available', 'interviewing', 'hired', 'unavailable'])
export const applicationStatusEnum = pgEnum('application_status', [
  'suggested', 'reviewed', 'shortlisted', 'interviewed', 'selected', 'rejected'
])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent'])
export const workModeEnum = pgEnum('work_mode', ['remote', 'hybrid', 'onsite'])

// Companies
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  name: text('name').notNull(),
  industry: text('industry'),
  location: text('location'),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  billingInfo: jsonb('billing_info'),
  status: companyStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Job Requests
export const jobRequests = pgTable('job_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id),
  title: text('title').notNull(),
  status: jobRequestStatusEnum('status').default('received'),
  priority: priorityEnum('priority').default('medium'),
  recruiterId: uuid('recruiter_id'),
  positionsCount: integer('positions_count').default(1),
  salaryMin: decimal('salary_min'),
  salaryMax: decimal('salary_max'),
  currency: text('currency').default('USD'),
  workMode: workModeEnum('work_mode'),
  location: text('location'),
  startDate: timestamp('start_date'),
  deadline: timestamp('deadline'),
  additionalInfo: jsonb('additional_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Job Request Steps (wizard data)
export const jobRequestSteps = pgTable('job_request_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  stepNumber: integer('step_number').notNull(),
  stepName: text('step_name').notNull(),
  data: jsonb('data'),
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Candidates
export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  clerkUserId: text('clerk_user_id'),
  status: candidateStatusEnum('status').default('available'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Candidate Profiles
export const candidateProfiles = pgTable('candidate_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  experienceYears: integer('experience_years'),
  education: jsonb('education'),
  certifications: jsonb('certifications'),
  skills: jsonb('skills'),
  languages: jsonb('languages'),
  englishLevel: text('english_level'),
  resumeUrl: text('resume_url'),
  availability: text('availability'),
  preferredWork: text('preferred_work'),
  salaryExpected: decimal('salary_expected'),
  bio: text('bio'),
})

// Applications
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  status: applicationStatusEnum('status').default('suggested'),
  sentAt: timestamp('sent_at'),
  reviewedAt: timestamp('reviewed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Process Events (timeline)
export const processEvents = pgTable('process_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  eventType: text('event_type').notNull(),
  description: text('description'),
  actorId: text('actor_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Recruiters
export const recruiters = pgTable('recruiters', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  specialties: jsonb('specialties'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  type: text('type').default('info'),
  title: text('title').notNull(),
  message: text('message'),
  read: boolean('read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  action: text('action').notNull(),
  resource: text('resource'),
  resourceId: uuid('resource_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
})

// System Config
export const systemConfig = pgTable('system_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  value: jsonb('value'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

- [ ] **Step 2: Create Drizzle client**

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)
export const db = drizzle(client, { schema })
```

- [ ] **Step 3: Create drizzle.config.ts**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 4: Generate migration and push to Supabase**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/ drizzle.config.ts
git commit -m "feat: add Drizzle schema with all tables and relationships"
```

### Task 4: Clerk + Multi-tenancy Setup

**Files:**
- Create: `src/lib/auth.ts`, `middleware.ts`

- [ ] **Step 1: Configure Clerk in next.config.ts**

Already done in Task 1.

- [ ] **Step 2: Create auth helpers**

```typescript
// src/lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs/server'

export async function getAuthUser() {
  const { userId, orgId, orgRole } = await auth()
  return { userId, orgId, orgRole }
}

export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

export function isAdmin(orgRole: string | null) {
  return orgRole === 'org:admin'
}

export function isCompanyAdmin(orgRole: string | null) {
  return orgRole === 'org:admin'
}
```

- [ ] **Step 3: Create middleware**

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/como-funciona(.*)',
  '/beneficios(.*)',
  '/faq(.*)',
  '/terminos(.*)',
  '/contacto(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isEmpresaRoute = createRouteMatcher(['/empresa(.*)'])
const isCandidatoRoute = createRouteMatcher(['/candidato(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Role-based routing after auth
  if (auth().userId) {
    const orgRole = auth().orgRole

    if (isAdminRoute(req) && orgRole !== 'org:admin') {
      // Redirect non-admins
      return Response.redirect(new URL('/empresa/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

- [ ] **Step 4: Add Clerk Provider to layout**

```typescript
// Update src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts middleware.ts src/app/layout.tsx
git commit -m "feat: configure Clerk auth with multi-tenancy and route protection"
```

### Task 5: Internationalization Setup

**Files:**
- Create: `src/lib/i18n.ts`, `src/messages/es.json`, `src/messages/en.json`, `src/middleware.ts`

- [ ] **Step 1: Create i18n config**

```typescript
// src/lib/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 2: Create Spanish messages**

```json
// src/messages/es.json
{
  "common": {
    "appName": "Recluter",
    "loading": "Cargando...",
    "save": "Guardar",
    "cancel": "Cancelar",
    "next": "Siguiente",
    "back": "Atrás",
    "submit": "Enviar",
    "search": "Buscar",
    "filter": "Filtrar",
    "noResults": "No se encontraron resultados"
  },
  "nav": {
    "home": "Inicio",
    "howItWorks": "Cómo Funciona",
    "benefits": "Beneficios",
    "faq": "FAQ",
    "contact": "Contacto",
    "login": "Iniciar sesión",
    "requestPersonnel": "Solicitar personal"
  },
  "landing": {
    "hero": {
      "title": "Encontramos el talento perfecto para tu empresa en Colombia",
      "subtitle": "Conectamos empresas de Estados Unidos con profesionales calificados colombianos. Proceso transparente, rápido y sin riesgo hasta contratar.",
      "cta": "Solicitar personal",
      "secondary": "Cómo funciona"
    },
    "howItWorks": {
      "title": "Cómo Funciona",
      "subtitle": "En 4 simples pasos tenés al talento que necesitás",
      "steps": [
        {"title": "Creás tu solicitud", "description": "Completá el wizard con los requisitos del puesto"},
        {"title": "Nosotros buscamos", "description": "Nuestro equipo de reclutamiento busca candidatos"},
        {"title": "Recibís candidatos", "description": "Evaluá perfiles y CVs de candidatos preseleccionados"},
        {"title": "Contratás al mejor", "description": "Elegí y contratá al candidato ideal para tu empresa"}
      ]
    }
  },
  "auth": {
    "roleSelection": {
      "title": "¿Cómo querés usar la plataforma?",
      "company": "Soy empresa",
      "companyDesc": "Necesito contratar personal",
      "candidate": "Busco oportunidades laborales",
      "candidateDesc": "Quiero encontrar trabajo"
    }
  },
  "empresa": {
    "dashboard": {
      "welcome": "Bienvenido",
      "activeProcesses": "Procesos activos",
      "candidatesReceived": "Candidatos recibidos",
      "pendingInterviews": "Entrevistas pendientes",
      "searchPersonnel": "Buscar personal"
    },
    "wizard": {
      "title": "Nueva solicitud de personal",
      "step1": "Empresa",
      "step2": "Posición",
      "step3": "Perfil",
      "step4": "Condiciones",
      "step5": "Proceso",
      "step6": "Resumen",
      "companyInfo": "Información de la empresa",
      "position": "Posición requerida",
      "profile": "Perfil del candidato",
      "conditions": "Condiciones laborales",
      "selection": "Proceso de selección",
      "review": "Revisión y confirmación"
    }
  }
}
```

- [ ] **Step 3: Create English messages**

```json
// src/messages/en.json
{
  "common": {
    "appName": "Recluter",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "next": "Next",
    "back": "Back",
    "submit": "Submit",
    "search": "Search",
    "filter": "Filter",
    "noResults": "No results found"
  },
  "nav": {
    "home": "Home",
    "howItWorks": "How It Works",
    "benefits": "Benefits",
    "faq": "FAQ",
    "contact": "Contact",
    "login": "Sign in",
    "requestPersonnel": "Request Personnel"
  },
  "landing": {
    "hero": {
      "title": "We find the perfect talent for your company in Colombia",
      "subtitle": "We connect US companies with qualified Colombian professionals. Transparent, fast process with no risk until you hire.",
      "cta": "Request Personnel",
      "secondary": "How It Works"
    },
    "howItWorks": {
      "title": "How It Works",
      "subtitle": "In 4 simple steps you have the talent you need",
      "steps": [
        {"title": "Create your request", "description": "Complete the wizard with position requirements"},
        {"title": "We search", "description": "Our recruitment team finds candidates"},
        {"title": "Receive candidates", "description": "Review profiles and CVs of pre-selected candidates"},
        {"title": "Hire the best", "description": "Choose and hire the ideal candidate for your company"}
      ]
    }
  },
  "auth": {
    "roleSelection": {
      "title": "How do you want to use the platform?",
      "company": "I'm a company",
      "companyDesc": "I need to hire personnel",
      "candidate": "I'm looking for opportunities",
      "candidateDesc": "I want to find a job"
    }
  },
  "empresa": {
    "dashboard": {
      "welcome": "Welcome",
      "activeProcesses": "Active processes",
      "candidatesReceived": "Candidates received",
      "pendingInterviews": "Pending interviews",
      "searchPersonnel": "Search Personnel"
    },
    "wizard": {
      "title": "New personnel request",
      "step1": "Company",
      "step2": "Position",
      "step3": "Profile",
      "step4": "Conditions",
      "step5": "Process",
      "step6": "Summary",
      "companyInfo": "Company Information",
      "position": "Required Position",
      "profile": "Candidate Profile",
      "conditions": "Work Conditions",
      "selection": "Selection Process",
      "review": "Review and Confirm"
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts src/messages/
git commit -m "feat: add i18n configuration with ES/EN translations"
```

---

## Phase 2: Landing Page + Auth Flow

### Task 6: Marketing Layout

**Files:**
- Create: `src/app/(marketing)/layout.tsx`, `src/components/layout/header.tsx`, `src/components/shared/logo.tsx`, `src/components/shared/language-switcher.tsx`

- [ ] **Step 1: Create marketing layout**

```typescript
// src/app/(marketing)/layout.tsx
import { Header } from '@/components/layout/header'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 Recluter. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Create Header component**

```typescript
// src/components/layout/header.tsx
import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/como-funciona" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cómo Funciona
          </Link>
          <Link href="/beneficios" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Beneficios
          </Link>
          <Link href="/faq" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            FAQ
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Iniciar sesión</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Solicitar personal</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create Logo component**

```typescript
// src/components/shared/logo.tsx
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-xl font-bold text-slate-900">Recluter</span>
      <span className="w-2 h-2 rounded-full bg-blue-600" />
    </Link>
  )
}
```

- [ ] **Step 4: Create LanguageSwitcher**

```typescript
// src/components/shared/language-switcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    router.push(`/${newLocale}${pathname}`)
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale}>
      {locale === 'es' ? 'EN' : 'ES'}
    </Button>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(marketing\)/ src/components/
git commit -m "feat: add marketing layout with header, logo, and language switcher"
```

### Task 7: Landing Page Sections

**Files:**
- Create: `src/app/(marketing)/page.tsx`, `src/components/landing/hero.tsx`, `src/components/landing/how-it-works.tsx`, `src/components/landing/benefits.tsx`, `src/components/landing/faq.tsx`, `src/components/landing/payment.tsx`, `src/components/landing/contact.tsx`

- [ ] **Step 1: Create Landing Page**

```typescript
// src/app/(marketing)/page.tsx
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Benefits } from '@/components/landing/benefits'
import { FAQ } from '@/components/landing/faq'
import { Payment } from '@/components/landing/payment'
import { Contact } from '@/components/landing/contact'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <Payment />
      <Contact />
    </>
  )
}
```

- [ ] **Step 2: Create Hero component**

```typescript
// src/components/landing/hero.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-slate-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Encontramos el talento perfecto para tu empresa en Colombia
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Conectamos empresas de Estados Unidos con profesionales calificados colombianos.
          Proceso transparente, rápido y sin riesgo hasta contratar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto">Solicitar personal</Button>
          </Link>
          <Link href="/como-funciona">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Cómo funciona</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create HowItWorks component**

```typescript
// src/components/landing/how-it-works.tsx
const steps = [
  { num: '1', title: 'Creás tu solicitud', description: 'Completá el wizard con los requisitos del puesto' },
  { num: '2', title: 'Nosotros buscamos', description: 'Nuestro equipo de reclutamiento busca candidatos' },
  { num: '3', title: 'Recibís candidatos', description: 'Evaluá perfiles y CVs de candidatos preseleccionados' },
  { num: '4', title: 'Contratás al mejor', description: 'Elegí y contratá al candidato ideal para tu empresa' },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Cómo Funciona</h2>
        <p className="text-center text-slate-600 mb-12">En 4 simples pasos tenés al talento que necesitás</p>
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
```

- [ ] **Step 4: Create Benefits component**

```typescript
// src/components/landing/benefits.tsx
const benefits = [
  { icon: '✅', title: 'Talento verificado', description: 'Candidatos preseleccionados y evaluados por nuestro equipo' },
  { icon: '✅', title: 'Proceso transparente', description: 'Seguimiento en tiempo real de cada paso del proceso' },
  { icon: '✅', title: 'Sin riesgo', description: 'Solo cobramos cuando contratás al candidato' },
  { icon: '✅', title: 'Talento colombiano', description: 'Profesionales altamente calificados en Latinoamérica' },
]

export function Benefits() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">¿Por qué elegirnos?</h2>
        <p className="text-center text-slate-600 mb-12">Ventajas de trabajar con nuestro equipo de reclutamiento</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <span className="text-2xl">{benefit.icon}</span>
              <h3 className="font-semibold text-slate-900 mt-4 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create FAQ component**

```typescript
// src/components/landing/faq.tsx
const faqs = [
  { q: '¿Cuánto tiempo toma encontrar candidatos?', a: 'El tiempo promedio es de 2-4 semanas dependiendo de la complejidad del puesto.' },
  { q: '¿Cuánto cuesta el servicio?', a: 'Trabajamos con comisión por contratación exitosa. Solo cobramos cuando contratás al candidato.' },
  { q: '¿Cómo funciona la contratación con talento en Colombia?', a: 'Nos encargamos de la búsqueda, preselección y evaluación. Vos solo elegís y contratás.' },
  { q: '¿Puedo cancelar si no estoy satisfecho?', a: 'Sí, podés cancelar en cualquier momento. Solo cobramos si contratás.' },
]

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
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
```

- [ ] **Step 6: Create Payment component**

```typescript
// src/components/landing/payment.tsx
export function Payment() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Condiciones de Pago</h2>
        <p className="text-center text-slate-600 mb-8">Modelo de negocio transparente y sin sorpresas</p>
        <div className="bg-white p-8 rounded-lg border">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Comisión por contratación exitosa</h3>
          <p className="text-slate-600 mb-6">
            Nuestro modelo es simple: solo cobramos cuando contratás al candidato.
            Sin costos fijos, sin sorpresas.
          </p>
          <p className="font-medium text-slate-900 mb-2">Medios de pago aceptados:</p>
          <div className="flex gap-6 text-slate-600">
            <span>💳 Transferencia bancaria</span>
            <span>🅿️ PayPal</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create Contact component**

```typescript
// src/components/landing/contact.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function Contact() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Contacto</h2>
        <p className="text-center text-slate-600 mb-8">¿Tenés preguntas? Escribinos</p>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Tu nombre" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" />
          </div>
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Tu mensaje..." rows={4} />
          </div>
          <Button type="submit" className="w-full">Enviar mensaje</Button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/\(marketing\)/page.tsx src/components/landing/
git commit -m "feat: add landing page with all sections (hero, how-it-works, benefits, faq, payment, contact)"
```

### Task 8: Auth Flow (Sign-in / Sign-up / Role Selection)

**Files:**
- Create: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`, `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`, `src/app/(auth)/role-selection/page.tsx`, `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Create auth layout**

```typescript
// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create sign-in page**

```typescript
// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return <SignIn />
}
```

- [ ] **Step 3: Create sign-up page**

```typescript
// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return <SignUp />
}
```

- [ ] **Step 4: Create role selection page**

```typescript
// src/app/(auth)/role-selection/page.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function RoleSelectionPage() {
  const { user } = useUser()
  const router = useRouter()

  const selectRole = async (role: 'company' | 'candidate') => {
    // Update user metadata with role
    await user?.update({ unsafeMetadata: { role } })

    // Redirect based on role
    if (role === 'company') {
      router.push('/empresa/dashboard')
    } else {
      router.push('/candidato/dashboard')
    }
  }

  return (
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">¿Cómo querés usar la plataforma?</h1>
        <p className="text-slate-600 mt-2">Seleccioná tu perfil para continuar</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => selectRole('company')}
          className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900">Soy empresa</h3>
          <p className="text-sm text-slate-600">Necesito contratar personal</p>
        </button>

        <button
          onClick={() => selectRole('candidate')}
          className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900">Busco oportunidades laborales</h3>
          <p className="text-sm text-slate-600">Quiero encontrar trabajo</p>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(auth\)/
git commit -m "feat: add auth flow with sign-in, sign-up, and role selection"
```

---

## Phase 3: Company Portal

### Task 9: Empresa Layout + Dashboard

**Files:**
- Create: `src/app/(empresa)/layout.tsx`, `src/components/layout/sidebar.tsx`, `src/app/(empresa)/dashboard/page.tsx`, `src/components/dashboard/stat-card.tsx`, `src/components/dashboard/process-list.tsx`

- [ ] **Step 1: Create sidebar component**

```typescript
// src/components/layout/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/empresa/dashboard', icon: '📊' },
  { name: 'Buscar personal', href: '/empresa/solicitar/1', icon: '➕' },
  { name: 'Mis procesos', href: '/empresa/procesos', icon: '📋' },
  { name: 'Candidatos', href: '/empresa/candidatos', icon: '👥' },
  { name: 'Historial', href: '/empresa/historial', icon: '📅' },
]

const bottomNav = [
  { name: 'Mi perfil', href: '/empresa/perfil', icon: '⚙️' },
  { name: 'Notificaciones', href: '/empresa/notificaciones', icon: '🔔' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-4">
        <Logo />
        <span className="text-xs text-slate-400 mt-1 block">Empresa</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-800">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create empresa layout**

```typescript
// src/app/(empresa)/layout.tsx
import { Sidebar } from '@/components/layout/sidebar'

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Create StatCard component**

```typescript
// src/components/dashboard/stat-card.tsx
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'yellow'
}

export function StatCard({ value, label, color = 'blue' }: StatCardProps) {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={cn('text-3xl font-bold', colorMap[color])}>{value}</div>
        <div className="text-sm text-slate-600 mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Create Dashboard page**

```typescript
// src/app/(empresa)/dashboard/page.tsx
import { StatCard } from '@/components/dashboard/stat-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EmpresaDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, Acme Corp</h1>
        <p className="text-slate-600">Resumen de tus procesos de reclutamiento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value={3} label="Procesos activos" color="blue" />
        <StatCard value={12} label="Candidatos recibidos" color="green" />
        <StatCard value={2} label="Entrevistas pendientes" color="yellow" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Procesos activos</h2>
          <Link href="/empresa/solicitar/1">
            <Button>+ Buscar personal</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {/* Process list items will go here */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="font-medium">Desarrollador Senior</div>
            <div className="text-sm text-slate-600">Búsqueda activa • María García</div>
            <div className="text-xs text-blue-600 mt-1">En progreso</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(empresa\)/ src/components/layout/sidebar.tsx src/components/dashboard/
git commit -m "feat: add empresa layout with sidebar and dashboard"
```

### Task 10: Wizard Stepper + Step 1 (Company Info)

**Files:**
- Create: `src/components/wizard/stepper.tsx`, `src/app/(empresa)/solicitar/[step]/page.tsx`, `src/components/wizard/step-company.tsx`, `src/hooks/use-wizard.ts`

- [ ] **Step 1: Create Stepper component**

```typescript
// src/components/wizard/stepper.tsx
'use client'

import { cn } from '@/lib/utils'

const steps = [
  { num: 1, label: 'Empresa' },
  { num: 2, label: 'Posición' },
  { num: 3, label: 'Perfil' },
  { num: 4, label: 'Condiciones' },
  { num: 5, label: 'Proceso' },
  { num: 6, label: 'Resumen' },
]

interface StepperProps {
  currentStep: number
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step.num <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              )}
            >
              {step.num}
            </div>
            <span
              className={cn(
                'text-sm',
                step.num <= currentStep ? 'text-blue-600 font-medium' : 'text-slate-500'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-slate-200 mx-2" />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create Step Company form**

```typescript
// src/components/wizard/step-company.tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function StepCompany() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Información de la empresa</h3>
        <p className="text-sm text-slate-600">Datos básicos de la empresa para la solicitud</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la empresa *</Label>
          <Input id="companyName" placeholder="Ej: Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industria *</Label>
          <Input id="industry" placeholder="Seleccionar industria" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input id="location" placeholder="Ciudad, País" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Persona de contacto *</Label>
          <Input id="contactName" placeholder="Nombre completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactRole">Cargo *</Label>
          <Input id="contactRole" placeholder="Ej: CEO, HR Manager" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email corporativo *</Label>
          <Input id="contactEmail" type="email" placeholder="email@empresa.com" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create wizard page**

```typescript
// src/app/(empresa)/solicitar/[step]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { Stepper } from '@/components/wizard/stepper'
import { StepCompany } from '@/components/wizard/step-company'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function WizardStepPage() {
  const params = useParams()
  const router = useRouter()
  const step = Number(params.step)

  const steps = [
    { component: StepCompany, title: 'Información de la empresa' },
    // Steps 2-6 will be added in later tasks
  ]

  const CurrentStepComponent = steps[step - 1]?.component || StepCompany

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva solicitud de personal</h1>
        <p className="text-slate-600">Paso {step} de 6</p>
      </div>

      <Stepper currentStep={step} />

      <Card className="p-6">
        <CurrentStepComponent />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 1 && router.push(`/empresa/solicitar/${step - 1}`)}>
          {step > 1 ? '← Atrás' : 'Cancelar'}
        </Button>
        <Button onClick={() => step < 6 && router.push(`/empresa/solicitar/${step + 1}`)}>
          {step < 6 ? 'Siguiente →' : 'Enviar solicitud'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/wizard/ src/app/\(empresa\)/solicitar/
git commit -m "feat: add wizard stepper and step 1 (company info form)"
```

---

## Phase 4-6: Remaining Phases (Summary)

Due to the scope of this project, the remaining phases follow the same pattern. Each phase creates:
- Layout components for the portal
- Page components with real content
- Form components where needed
- Server Actions for data operations

### Phase 4: Company Portal (Steps 2-6 + Process Tracking + Candidates)
- Steps 2-6 of the wizard (position, profile, conditions, selection, review)
- Process tracking page with timeline
- Candidate view per process
- History page

### Phase 5: Admin Portal
- Admin dashboard with global stats
- Company management (CRUD)
- Request management (list, assign recruiters)
- Candidate management
- Recruiter management

### Phase 6: Candidate Portal + Notifications
- Candidate dashboard
- Profile management
- Opportunities listing
- Application tracking
- Interview calendar
- Document management
- Notification system
- Email templates via Supabase Edge Functions

---

## Testing Strategy

- **Unit tests:** Vitest for utility functions, hooks
- **Component tests:** React Testing Library for UI components
- **E2E tests:** Playwright for critical flows (auth, wizard, process tracking)
- **Database tests:** Test Drizzle queries against a test database

## Deployment

1. **Development:** `npm run dev` locally
2. **Preview:** Push to `dev` branch → Vercel preview deploy
3. **QA:** Push to `qa` branch → Vercel preview with QA env vars
4. **Production:** Push to `prd` branch → Vercel production deploy

## Environment Variables by Branch

| Variable | dev | qa | prd |
|----------|-----|-----|-----|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | dev key | qa key | prd key |
| CLERK_SECRET_KEY | dev secret | qa secret | prd secret |
| NEXT_PUBLIC_SUPABASE_URL | dev url | qa url | prd url |
| DATABASE_URL | dev db | qa db | prd db |
