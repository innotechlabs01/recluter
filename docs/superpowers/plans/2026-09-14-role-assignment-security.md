# Role Assignment Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace client-side role selection with server-side DB-driven role assignment, eliminating privilege escalation via cookie manipulation.

**Architecture:** New `user_roles` table becomes the single source of truth. Middleware queries DB instead of reading cookie. `/role-selection` replaced by `/onboarding` with self-service company/candidate registration. Admin only creates recruiters.

**Tech Stack:** Next.js 15, Clerk auth, Drizzle ORM, Supabase (PostgreSQL), Playwright E2E

**Spec:** `docs/superpowers/specs/2026-09-14-role-assignment-security-design.md`

## Global Constraints

- Clerk auth is the real authentication layer (not bypassed except in E2E)
- Drizzle ORM for all DB operations (no raw SQL except migrations)
- Supabase PostgreSQL as database
- Existing E2E tests use `E2E_BYPASS_CLERK=1` + cookie simulation
- All new code must have corresponding tests
- Conventional commits format

---

## Task 1: Database Schema — userRoles table

**Files:**
- Modify: `src/lib/db/schema.ts`
- Create: `supabase/migrations/XXXX_add_user_roles.sql` (manual SQL for Supabase)

**Interfaces:**
- Produces: `userRoles` table export from schema, usable by all subsequent tasks

- [ ] **Step 1: Add userRoles table to Drizzle schema**

```typescript
// Add to src/lib/db/schema.ts after the existing enums

export const userRoleStatusEnum = pgEnum('user_role_status', [
  'pending',
  'approved',
  'rejected',
])

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  role: text('role').notNull(),
  status: userRoleStatusEnum('status').default('approved'),
  assignedBy: text('assigned_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

- [ ] **Step 2: Create Supabase migration SQL**

Create `supabase/migrations/20260914_add_user_roles.sql`:

```sql
CREATE TYPE user_role_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('company','candidate','admin','recruiter')),
  status user_role_status DEFAULT 'approved',
  assigned_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_roles_clerk_user_id ON user_roles(clerk_user_id);
```

- [ ] **Step 3: Verify schema compiles**

Run: `npx drizzle-kit generate --name add_user_roles`
Expected: Migration file generated without errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts supabase/migrations/
git commit -m "feat(db): add userRoles table for server-side role assignment"
```

---

## Task 2: Role Resolution — DB-backed getResolvedRole

**Files:**
- Modify: `src/lib/role-server.ts`
- Modify: `src/lib/role.ts` (add helper)
- Create: `src/lib/__tests__/role-server.test.ts`

**Interfaces:**
- Consumes: `userRoles` table from Task 1
- Produces: `getResolvedRole(clerkUserId)` returns `Role | null` from DB

- [ ] **Step 1: Write failing test for DB role resolution**

```typescript
// src/lib/__tests__/role-server.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('getResolvedRole', () => {
  it('returns role from user_roles table when row exists', async () => {
    // Mock the DB query
    vi.mock('@/lib/db', () => ({
      db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ role: 'company', status: 'approved' }]),
      },
    }))

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_123')
    expect(role).toBe('company')
  })

  it('returns null when no row exists', async () => {
    vi.mock('@/lib/db', () => ({
      db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      },
    }))

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_unknown')
    expect(role).toBeNull()
  })

  it('returns null when status is pending', async () => {
    vi.mock('@/lib/db', () => ({
      db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ role: 'company', status: 'pending' }]),
      },
    }))

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_123')
    expect(role).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/role-server.test.ts`
Expected: FAIL — module not found or function doesn't exist

- [ ] **Step 3: Implement DB-backed getResolvedRole**

```typescript
// src/lib/role-server.ts
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { resolveRole, type Role } from './role'

// Simple in-memory cache (60s TTL)
const roleCache = new Map<string, { role: Role | null; expiresAt: number }>()
const CACHE_TTL_MS = 60_000

/**
 * Resolves the current user's role from the database.
 * Uses in-memory cache to avoid DB hit per request.
 * Returns null when user has no approved role.
 */
export async function getResolvedRole(clerkUserId: string): Promise<Role | null> {
  const now = Date.now()
  const cached = roleCache.get(clerkUserId)
  if (cached && cached.expiresAt > now) {
    return cached.role
  }

  const rows = await db
    .select({ role: userRoles.role, status: userRoles.status })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.clerkUserId, clerkUserId),
        eq(userRoles.status, 'approved')
      )
    )
    .limit(1)

  const role = rows.length > 0 ? resolveRole({ unsafeMetadata: { role: rows[0].role } }) : null

  roleCache.set(clerkUserId, { role, expiresAt: now + CACHE_TTL_MS })
  return role
}

/**
 * Invalidates the cache for a user (called after role assignment).
 */
export function invalidateRoleCache(clerkUserId: string): void {
  roleCache.delete(clerkUserId)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/role-server.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/role-server.ts src/lib/__tests__/
git commit -m "feat(auth): DB-backed role resolution with cache"
```

---

## Task 3: Middleware — Replace cookie with DB role resolution

**Files:**
- Modify: `src/middleware.ts`

**Interfaces:**
- Consumes: `getResolvedRole()` from Task 2
- Produces: Middleware that blocks unauthorized portal access

- [ ] **Step 1: Update middleware to read from DB**

Replace the role resolution logic in `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { getResolvedRole } from '@/lib/role-server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/como-funciona(.*)',
  '/beneficios(.*)',
  '/faq(.*)',
  '/terminos(.*)',
  '/contacto(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
  '/api/webhooks(.*)',
  '/api/jobs(.*)',
  '/api/testimonials(.*)',
  '/testimonio(.*)',
  '/api/cron(.*)',
  '/empleos(.*)',
])

const isEmpresaRoute = createRouteMatcher(['/empresa(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isCandidatoRoute = createRouteMatcher(['/candidato(.*)'])
const isReclutadorRoute = createRouteMatcher(['/reclutador(.*)'])

function handleRoleRedirect(req: NextRequest, role: string) {
  if (isAdminRoute(req) && role !== 'admin') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isEmpresaRoute(req) && role !== 'company') {
    const redirectTo = role === 'admin' ? '/admin/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isCandidatoRoute(req) && role !== 'candidate') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'admin' ? '/admin/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isReclutadorRoute(req) && role !== 'recruiter') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'admin' ? '/admin/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  // E2E bypass: simulated cookie auth
  if (process.env.E2E_BYPASS_CLERK === '1') {
    const role = req.cookies.get('user_role')?.value
    if (role === 'admin') return
    if (role) return handleRoleRedirect(req, role)
    // No role cookie in E2E → redirect to onboarding
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req) || isReclutadorRoute(req)) {
      return Response.redirect(new URL('/onboarding', req.url))
    }
    return
  }

  // Protect all other routes
  await auth.protect()

  // Get userId from Clerk session
  const { userId } = await auth()
  if (!userId) {
    return Response.redirect(new URL('/sign-in', req.url))
  }

  // Resolve role from DATABASE (not cookie)
  const role = await getResolvedRole(userId)

  if (role) {
    if (role === 'admin') return
    return handleRoleRedirect(req, role)
  } else {
    // No role in DB → redirect to onboarding
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req) || isReclutadorRoute(req)) {
      return Response.redirect(new URL('/onboarding', req.url))
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

- [ ] **Step 2: Verify middleware compiles**

Run: `npx next build` (or just check no TypeScript errors)
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(auth): middleware reads role from DB, removes cookie dependency"
```

---

## Task 4: Onboarding Pages — Replace role-selection

**Files:**
- Create: `src/app/(auth)/onboarding/page.tsx`
- Create: `src/app/(auth)/onboarding/empresa/page.tsx`
- Create: `src/app/(auth)/onboarding/candidato/page.tsx`
- Create: `src/app/actions/complete-onboarding.ts`

**Interfaces:**
- Consumes: `userRoles` table from Task 1, `invalidateRoleCache` from Task 2
- Produces: Onboarding flow that assigns roles after form completion

- [ ] **Step 1: Create onboarding choice page**

```tsx
// src/app/(auth)/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getResolvedRole } from '@/lib/role-server'
import { roleDashboardPath } from '@/lib/role'
import { auth } from '@clerk/nextjs/server'
import OnboardingCards from './onboarding-cards'

export const metadata = {
  title: 'Completá tu registro | Recluter',
}

export default async function OnboardingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const role = await getResolvedRole(userId)
  if (role) redirect(roleDashboardPath(role))

  return <OnboardingCards />
}
```

- [ ] **Step 2: Create onboarding cards component**

```tsx
// src/app/(auth)/onboarding/onboarding-cards.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Building2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OnboardingCards() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Completá tu registro</h1>
        <p className="text-slate-500 mt-2">¿Cómo querés usar la plataforma?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          className="cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
          onClick={() => router.push('/onboarding/empresa')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Soy empresa</h3>
                <p className="text-slate-500 mt-1">Necesito contratar personal para mi equipo</p>
                <p className="text-sm text-blue-600 mt-3 font-medium">
                  Crear mi empresa →
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group"
          onClick={() => router.push('/onboarding/candidato')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Busco oportunidades laborales</h3>
                <p className="text-slate-500 mt-1">Quiero encontrar trabajo en empresas de Estados Unidos</p>
                <p className="text-sm text-green-600 mt-3 font-medium">
                  Completar mi perfil →
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create server action for completing onboarding**

```typescript
// src/app/actions/complete-onboarding.ts
'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { invalidateRoleCache } from '@/lib/role-server'
import { cookies } from 'next/headers'

export async function completeOnboarding(role: 'company' | 'candidate') {
  const cookieStore = await cookies()

  // E2E bypass
  if (process.env.E2E_BYPASS_CLERK === '1') {
    cookieStore.set('user_role', role, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
    return { success: true }
  }

  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  // Check if user already has a role (prevent double-assignment)
  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, userId))
    .limit(1)

  if (existing.length > 0) {
    return { success: true, alreadyAssigned: true }
  }

  // Insert role into DB
  await db.insert(userRoles).values({
    clerkUserId: userId,
    role,
    status: 'approved',
  })

  // Update Clerk metadata for backward compatibility
  const client = await clerkClient()
  await client.users.updateUser(userId, {
    unsafeMetadata: { role },
  })

  // Sync cookie for middleware (DB is primary, cookie is fallback for edge cases)
  cookieStore.set('user_role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  // Invalidate cache
  invalidateRoleCache(userId)

  return { success: true }
}
```

- [ ] **Step 4: Create empresa onboarding page**

```tsx
// src/app/(auth)/onboarding/empresa/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from '@/app/actions/complete-onboarding'

export default function EmpresaOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const industry = formData.get('industry') as string

    if (!name || !industry) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // TODO: Create company record in DB (Task 5)
    // For now, just assign the role
    const result = await completeOnboarding('company')
    if (result.success) {
      router.push('/empresa/dashboard')
    } else {
      setError('Error al completar el registro')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Crear empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la empresa</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="industry">Industria</Label>
            <Input id="industry" name="industry" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear empresa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5: Create candidato onboarding page**

```tsx
// src/app/(auth)/onboarding/candidato/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from '@/app/actions/complete-onboarding'

export default function CandidatoOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!firstName || !lastName) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // TODO: Create candidate record in DB (Task 5)
    // For now, just assign the role
    const result = await completeOnboarding('candidate')
    if (result.success) {
      router.push('/candidato/dashboard')
    } else {
      setError('Error al completar el registro')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Completar perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Completar registro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 6: Remove old role-selection page**

Delete or repurpose `src/app/(auth)/role-selection/` directory.
Update any references to `/role-selection` to point to `/onboarding`.

- [ ] **Step 7: Verify onboarding flow compiles**

Run: `npx next build`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/app/\(auth\)/onboarding/ src/app/actions/complete-onboarding.ts
git rm -r src/app/\(auth\)/role-selection/
git commit -m "feat(auth): replace role-selection with onboarding flow"
```

---

## Task 5: Admin User Management — Create Recruiters

**Files:**
- Create: `src/app/admin/usuarios/page.tsx`
- Create: `src/app/api/admin/users/route.ts`
- Create: `src/app/api/admin/users/[id]/route.ts`

**Interfaces:**
- Consumes: `userRoles` table from Task 1
- Produces: Admin UI + API for recruiter CRUD

- [ ] **Step 1: Create admin users API**

```typescript
// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify user is admin
  const adminRole = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, userId))
    .limit(1)

  if (adminRole.length === 0 || adminRole[0].role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // List all users with roles
  const users = await db.select().from(userRoles)
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify user is admin
  const adminRole = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, userId))
    .limit(1)

  if (adminRole.length === 0 || adminRole[0].role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { clerkUserId, role } = body

  if (!clerkUserId || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['company', 'candidate', 'admin', 'recruiter'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Insert or update role
  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, clerkUserId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(userRoles)
      .set({ role, status: 'approved', assignedBy: userId })
      .where(eq(userRoles.clerkUserId, clerkUserId))
  } else {
    await db.insert(userRoles).values({
      clerkUserId,
      role,
      status: 'approved',
      assignedBy: userId,
    })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Create admin users page**

```tsx
// src/app/admin/usuarios/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UserRole {
  id: string
  clerkUserId: string
  role: string
  status: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ clerkUserId: '', role: 'recruiter' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data)
    }
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    if (res.ok) {
      setNewUser({ clerkUserId: '', role: 'recruiter' })
      fetchUsers()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Crear Reclutador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="clerkUserId">Clerk User ID</Label>
              <Input
                id="clerkUserId"
                value={newUser.clerkUserId}
                onChange={(e) => setNewUser({ ...newUser, clerkUserId: e.target.value })}
                required
              />
            </div>
            <div className="w-48">
              <Label>Rol</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter">Reclutador</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Crear</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{user.clerkUserId}</p>
                    <p className="text-sm text-slate-500">{user.role} — {user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Add admin usuarios to navigation**

Update admin sidebar/nav to include "Usuarios" link pointing to `/admin/usuarios`.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/usuarios/ src/app/api/admin/users/
git commit -m "feat(admin): add user management for recruiter creation"
```

---

## Task 6: Migration — Seed Existing Users

**Files:**
- Create: `supabase/migrations/20260914_seed_existing_user_roles.sql`

**Interfaces:**
- Consumes: Existing `unsafeMetadata.role` in Clerk
- Produces: `user_roles` rows for all existing users

- [ ] **Step 1: Create migration SQL**

```sql
-- supabase/migrations/20260914_seed_existing_user_roles.sql
-- This is a reference script. Actual seeding must be done via Clerk API
-- because unsafeMetadata is not in the database.

-- After running the Clerk migration script, verify:
-- SELECT clerk_user_id, role, status FROM user_roles;
```

- [ ] **Step 2: Create Node.js migration script**

```typescript
// supabase/migrate-existing-users.ts
// Run once after deploy: npx tsx supabase/migrate-existing-users.ts

import { clerkClient } from '@clerk/nextjs/server'
import { db } from '../src/lib/db'
import { userRoles } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

async function migrateExistingUsers() {
  const client = await clerkClient()

  // Paginate through all users
  let hasMore = true
  let offset = 0
  const limit = 100

  while (hasMore) {
    const users = await client.users.getUserList({ limit, offset })

    for (const user of users.data) {
      const role = user.unsafeMetadata?.role
      if (typeof role === 'string' && ['company', 'candidate', 'admin', 'recruiter'].includes(role)) {
        // Check if already migrated
        const existing = await db
          .select()
          .from(userRoles)
          .where(eq(userRoles.clerkUserId, user.id))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(userRoles).values({
            clerkUserId: user.id,
            role,
            status: 'approved',
          })
          console.log(`Migrated user ${user.id} → ${role}`)
        }
      }
    }

    hasMore = users.data.length === limit
    offset += limit
  }

  console.log('Migration complete')
}

migrateExistingUsers().catch(console.error)
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/ supabase/migrate-existing-users.ts
git commit -m "feat(db): add migration script for existing user roles"
```

---

## Task 7: Update E2E Tests

**Files:**
- Modify: `e2e/role-selection.spec.ts` → rename to `e2e/onboarding.spec.ts`
- Modify: `e2e/full-flow.spec.ts`
- Modify: `e2e/fixtures.ts`

**Interfaces:**
- Consumes: New onboarding flow from Task 4
- Produces: Updated E2E tests that verify new flow

- [ ] **Step 1: Update fixtures with onboarding helper**

```typescript
// e2e/fixtures.ts — add this helper
export async function completeOnboarding(page: Page, role: 'company' | 'candidate') {
  await page.goto('/onboarding')
  const cardText = role === 'company' ? 'Soy empresa' : 'Busco oportunidades'
  await page.getByText(cardText).click()
  // Fill the form and submit
  if (role === 'company') {
    await page.getByLabel(/nombre de la empresa/i).fill('Test Corp')
    await page.getByLabel(/industria/i).fill('Tech')
  } else {
    await page.getByLabel(/nombre/i).fill('Test')
    await page.getByLabel(/apellido/i).fill('Candidate')
  }
  await page.getByRole('button', { name: /crear|completar/i }).click()
}
```

- [ ] **Step 2: Update role-selection spec to test onboarding**

```typescript
// e2e/onboarding.spec.ts
import { test, expect, setRoleCookie } from './fixtures'

test('unauthenticated user is redirected to onboarding', async ({ page }) => {
  await page.goto('/empresa/dashboard')
  await expect(page).toHaveURL(/onboarding|sign-in/)
})

test('onboarding page shows two options', async ({ page }) => {
  await page.goto('/onboarding')
  await expect(page.getByText('Soy empresa')).toBeVisible()
  await expect(page.getByText('Busco oportunidades')).toBeVisible()
})
```

- [ ] **Step 3: Update full-flow spec**

Replace cookie-based role setting with onboarding completion where needed.

- [ ] **Step 4: Run E2E tests**

Run: `npx playwright test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add e2e/
git commit -m "test(e2e): update tests for onboarding-based role assignment"
```

---

## Task 8: Final Verification

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run && npx playwright test`
Expected: All tests pass

- [ ] **Step 2: Verify no cookie-based role resolution**

Search codebase: `grep -r "user_role" src/ --include="*.ts" --include="*.tsx"`
Expected: Only in E2E bypass and complete-onboarding.ts (for sync), NOT in middleware or role resolution

- [ ] **Step 3: Manual verification checklist**

- [ ] New user → sees `/onboarding`
- [ ] Company onboarding → creates role in DB → redirects to `/empresa/dashboard`
- [ ] Candidate onboarding → creates role in DB → redirects to `/candidato/dashboard`
- [ ] Admin creates recruiter → role in DB → recruiter can access `/reclutador/dashboard`
- [ ] User without role → cannot access any portal
- [ ] User with role → cannot access wrong portal

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete role assignment security overhaul"
```
