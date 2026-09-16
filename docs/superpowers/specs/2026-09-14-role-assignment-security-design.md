# Design: Role Assignment Security

## Problem

The current auth flow lets users **choose their role** via a client-side cookie (`user_role`). Anyone can modify this cookie to escalate privileges (e.g., set `admin`). The role must be determined server-side from the database, not from client input.

## Current State

1. User registers via Clerk (real auth)
2. User lands on `/role-selection` and picks "Empresa" or "Candidato"
3. Role stored in Clerk `unsafeMetadata.role` + cookie `user_role`
4. Middleware reads the cookie to enforce routing
5. Admin role is a hand-set cookie — no real auth

**Vulnerability:** Cookie is client-side and modifiable. Any user can access any portal.

## Proposed Design

### Role Assignment Model

| Role | Assigned by | Mechanism |
|------|-------------|-----------|
| Company | Self-service | User completes company onboarding form → DB insert → role assigned |
| Candidate | Self-service | User completes candidate profile form → DB insert → role assigned |
| Recruiter | Admin only | Admin creates user from `/admin/usuarios` → DB insert → role assigned |
| Admin | Predefined | Hardcoded or env-based, never assigned via UI |

### New Flow

```
Register (Clerk)
    │
    ▼
/onboarding  ←── "¿Qué buscás?"
    │
    ├── "Soy empresa"  → /onboarding/empresa → fill form → role=company → /empresa/dashboard
    │
    └── "Busco trabajo" → /onboarding/candidato → fill form → role=candidate → /candidato/dashboard


Recruiter: Admin creates from /admin/usuarios
Admin: predefined, no UI assignment
```

### Database Schema

New table `user_roles`:

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('company','candidate','admin','recruiter')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending','approved','rejected')),
  assigned_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Middleware Changes

**Before:** Read `user_role` cookie (client-modifiable)
**After:** Query `user_roles` table by `clerk_user_id` (server-side only)

- Middleware calls `getResolvedRole()` which queries DB
- Cache in memory with 60s TTL to avoid DB hit per request
- If no role found → redirect to `/onboarding`
- If role found → redirect to correct portal

### Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/lib/db/schema.ts` | Modify | Add `userRoles` table |
| `src/middleware.ts` | Modify | Read role from DB, remove cookie dependency |
| `src/lib/role-server.ts` | Modify | Query DB instead of Clerk metadata |
| `src/lib/role.ts` | Keep | Mapping role→dashboard path unchanged |
| `src/app/(auth)/role-selection/` | Replace | Becomes `/onboarding` with 2 options |
| `src/app/(auth)/onboarding/empresa/page.tsx` | New | Company creation form |
| `src/app/(auth)/onboarding/candidato/page.tsx` | New | Candidate profile form |
| `src/app/actions/set-role.ts` | Delete | No more user-selected roles |
| `src/app/admin/usuarios/page.tsx` | New | Admin CRUD for recruiters |
| `src/app/api/admin/users/route.ts` | New | API for admin to create/list users |
| `e2e/` tests | Modify | Update for new flow |

### Security Properties

1. **No client-side role selection** — role comes from DB only
2. **Middleware enforces server-side** — cookie is ignored for role resolution
3. **Admin controls recruiter creation** — only admin can assign `recruiter`
4. **Self-service for company/candidate** — but role is written server-side after form validation
5. **No privilege escalation** — user cannot modify their own role

### Testing Strategy

- E2E: Register → onboarding → verify role in DB → verify portal access
- E2E: Admin creates recruiter → verify role in DB
- E2E: User without role → verify redirected to `/onboarding`
- E2E: User tries to access wrong portal → verify redirect
- Unit: `getResolvedRole()` reads from DB correctly
- Unit: Middleware blocks unauthorized portal access

### Migration: Existing Users

Users who already have `unsafeMetadata.role` in Clerk need migration:

1. On first login after deploy, `getResolvedRole()` checks `user_roles` table
2. If no row found, check Clerk `unsafeMetadata.role`
3. If Clerk has a valid role → insert into `user_roles` with `status: 'approved'` (one-time seed)
4. Clear `unsafeMetadata.role` after migration (optional, for cleanup)

This ensures zero disruption for existing users.

### Rollback Plan

All changes are additive. Rollback = revert commits per phase:
- Phase 1: Remove `userRoles` table, revert middleware
- Phase 2: Restore `/role-selection`, remove `/onboarding`
- Phase 3: Remove admin user management

### Success Criteria

- [ ] No `user_role` cookie used for role resolution
- [ ] Role determined solely from `user_roles` DB table
- [ ] New users see `/onboarding` (not `/role-selection`)
- [ ] Company/candidate self-service assigns role after form completion
- [ ] Admin can create recruiters from `/admin/usuarios`
- [ ] All existing portals remain functional
- [ ] E2E tests pass with new flow
