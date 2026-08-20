# Recluter Platform — Re-Analysis Report

**Status:** DONE_WITH_CONCERNS  
**Date:** 2026-08-20  
**Compared against:** `docs/improvement-report.md` (2026-08-19)  
**Build:** TypeScript compiles clean (`tsc --noEmit` passes)

---

## Executive Summary

The 10 previously reported fixes are all implemented at the **infrastructure level** — middleware enforces roles, Zustand persists wizard state, API routes exist, Zod schemas are defined, a shared sidebar exists, and i18n keys cover all portals. However, **almost no page actually connects to these APIs or uses the validation schemas**. Every portal page still renders hardcoded mock arrays. The app went from "skeleton with zero plumbing" to "plumbing installed but no water flowing."

**Overall grade: 5/10 — Infrastructure complete, data flow still absent.**

---

## ✅ What's Actually Fixed (10/10 items)

| # | Original Item | Status | Evidence |
|---|--------------|--------|----------|
| 1 | Role-based middleware | ✅ DONE | `src/middleware.ts` checks `unsafeMetadata.role`, redirects wrong-role users |
| 2 | Wizard state (Zustand) | ✅ DONE | `src/hooks/use-wizard.ts` — full `WizardData` interface, `persist` middleware |
| 3 | API routes | ✅ DONE | 4 routes: `/api/solicitudes`, `/api/candidatos`, `/api/empresa/profile`, `/api/webhooks/clerk` |
| 4 | Data fetching in pages | ⚠️ PARTIAL | APIs exist; zero pages call them (see Critical Issues) |
| 5 | Form validation (Zod) | ⚠️ PARTIAL | Schema exists in `src/lib/validations/solicitud.ts`; wizard does NOT use it |
| 6 | Loading states | ⚠️ PARTIAL | Only `empresa/dashboard/loading.tsx` exists; no `error.tsx` or `not-found.tsx` anywhere |
| 7 | Shared sidebar | ✅ DONE | `src/components/layout/shared-sidebar.tsx` — role-based, Lucide icons, i18n |
| 8 | i18n completion | ✅ DONE | `messages/en.json` has keys for all 3 portals (empresa, admin, candidato) — ~90% |
| 9 | DB schema (interviews, documents) | ✅ DONE | `interviews` and `documents` tables added to `src/lib/db/schema.ts` |
| 10 | DataTable with search/pagination | ✅ DONE | Used in `empresa/historial`, `admin/empresas`, `admin/solicitudes` |

---

## 🔴 P0 — Critical Issues (Blocks functional use)

### 1. Zero data fetching in any page
**All pages still render hardcoded arrays.** The API routes exist but no page calls `fetch('/api/...')`.

| Page | Hardcoded Data |
|------|---------------|
| `empresa/dashboard` | Stats show `—` (em dash) instead of real counts |
| `empresa/procesos` | Empty state (no fetch) |
| `empresa/procesos/[id]` | Ignores `[id]` param — always shows "Desarrollador Senior" |
| `empresa/candidatos` | Hardcoded 4-candidate array |
| `empresa/historial` | Hardcoded 4-item history array |
| `admin/dashboard` | Hardcoded stats (12, 28, 156, 8) |
| `admin/empresas` | Hardcoded 3-company array |
| `admin/solicitudes` | Hardcoded 3-request array |
| `admin/candidatos` | Hardcoded 4-candidate array |
| `admin/reclutadores` | Hardcoded 3-recruiter array |
| `candidato/dashboard` | Hardcoded stats (3, 1, 2) |
| `candidato/postulaciones` | Hardcoded 3-application array |
| `candidato/entrevistas` | Hardcoded 2-interview array |
| `candidato/notificaciones` | Hardcoded 3-notification array |
| `candidato/oportunidades` | Hardcoded 2-opportunity array |

**Impact:** The app is a static mockup. No real data flows from DB → API → UI.

### 2. Process detail ignores `[id]` param
`src/app/empresa/procesos/[id]/page.tsx` is a Server Component that never reads `params.id`. It renders hardcoded "Desarrollador Senior" and a hardcoded summary. Should fetch from DB using the ID.

### 3. Candidate profile "Save" button does nothing
`src/app/candidato/perfil/page.tsx` — The form renders Clerk user data in inputs but has no `onSubmit` handler, no API call, no state management. The "Save changes" button is decorative.

### 4. Candidate opportunities "Apply" button does nothing
`src/app/candidato/oportunidades/page.tsx` — The `Button` labeled "Apply" has no `onClick` handler. No POST to `/api/applications`.

### 5. Candidate documents upload is purely visual
`src/app/candidato/documentos/page.tsx` — Drag-drop area and file list are static HTML. No file input, no upload handler, no storage integration.

### 6. Webhook handler has a logic bug
`src/app/api/webhooks/clerk/route.ts` — The `user.created` event for `role === 'candidate'` inserts into the `recruiters` table instead of the `candidates` table. Candidates are being stored as recruiters.

---

## 🟡 P1 — Important Issues (Needed for MVP)

### 7. Zod validation schema exists but is not integrated
`solicitudSchema` is defined in `src/lib/validations/solicitud.ts` but:
- Wizard steps don't validate before advancing
- The POST route in `/api/solicitudes` doesn't validate the request body
- `@hookform/resolvers` is installed but unused

### 8. Missing pages that sidebar links to
- `/empresa/perfil` — Sidebar "Settings" links here; page doesn't exist
- `/empresa/notificaciones` — Sidebar "Notifications" links here; page doesn't exist

### 9. Admin placeholder pages
- `admin/historial` — "Coming soon" placeholder
- `admin/configuracion` — "Coming soon" placeholder

### 10. Wizard steps use hardcoded Spanish, not i18n
All wizard steps (`step-company.tsx`, `step-position.tsx`, etc.) have hardcoded Spanish labels like "Nombre de la empresa *". The i18n keys exist in `en.json`/`es.json` under `empresa.wizard.fields.*` but the components don't use `useTranslations()`.

### 11. Sidebar navigation label collisions
`shared-sidebar.tsx` has duplicate `t('candidates')` for admin (empresas, candidatos, reclutadores all show "Candidates") and duplicate `t('jobs')` for candidato (oportunidades, postulaciones, entrevistas all show "Jobs"). Need unique nav keys.

### 12. No `db:generate` / `db:migrate` scripts
`drizzle-kit` is installed but `package.json` has no scripts for `drizzle-kit generate` or `drizzle-kit migrate`. DB migrations can't be run.

### 13. Only 1 loading state exists
Only `empresa/dashboard/loading.tsx`. No loading skeletons for admin or candidato portals.

### 14. No `error.tsx` or `not-found.tsx` anywhere
Zero error boundaries. Any runtime error crashes the entire app with no recovery UI.

### 15. Empresa dashboard doesn't fetch real stats
Shows em-dash (`—`) for all 4 stat cards. Should query `jobRequests` count for the current company.

---

## 🔵 P2 — Production Issues

| # | Issue | Status |
|---|-------|--------|
| 16 | No file upload integration | ❌ Pending |
| 17 | No email notifications | ❌ Pending |
| 18 | No audit logging (table exists, nothing writes) | ❌ Pending |
| 19 | No rate limiting on API routes | ❌ Pending |
| 20 | No CSP headers | ❌ Pending |
| 21 | No responsive sidebar (fixed `w-64`) | ❌ Pending |
| 22 | No dark mode toggle | ❌ Pending |
| 23 | No testing (zero test files) | ❌ Pending |
| 24 | No CI/CD pipeline | ❌ Pending |
| 25 | No `generateMetadata` on pages (SEO) | ❌ Pending |
| 26 | Unused `@supabase/supabase-js` dependency | ❌ Pending |
| 27 | No `.env.local` validation (DB crashes if missing) | ❌ Pending |
| 28 | No seed data script | ❌ Pending |
| 29 | `recruiters.userId` has no FK reference | ❌ Pending |
| 30 | No `ON DELETE` cascade rules | ❌ Pending |
| 31 | No DB indexes on frequently queried columns | ❌ Pending |

---

## Priority Matrix (Updated)

| Priority | Count | Status |
|----------|-------|--------|
| P0 — Blocks functional use | 6 | All still open — app cannot show real data |
| P1 — Needed for MVP | 9 | Infrastructure done, integration missing |
| P2 — Needed for production | 16 | Not started |

---

## Recommended Fix Order

### Phase 1: Make data flow (P0 — ~2 days)
1. Fix webhook bug (candidate → candidates table, not recruiters)
2. Add `fetch` calls to all portal pages to use existing API routes
3. Make `empresa/procesos/[id]` dynamic with the route param
4. Connect candidate profile form to API (add PUT endpoint)
5. Add "Apply" action for candidate opportunities (add POST /api/applications)
6. Add file upload handler for documents

### Phase 2: Wire up validation and missing pages (P1 — ~1 day)
7. Integrate Zod validation in wizard steps (before advancing)
8. Add validation to API routes
9. Create `/empresa/perfil` and `/empresa/notificaciones` pages
10. Add i18n to wizard step components
11. Fix sidebar label collisions
12. Add `db:generate` and `db:migrate` scripts
13. Add `error.tsx` and `not-found.tsx` to all portal layouts

### Phase 3: Production hardening (P2 — ~1 week)
14. Error boundaries, loading skeletons, responsive sidebar
15. File upload, email, audit logging
16. Testing, CI/CD, SEO

---

## Key Files Reference

| File | Role | Status |
|------|------|--------|
| `src/middleware.ts` | Role-based auth | ✅ Working |
| `src/hooks/use-wizard.ts` | Wizard state (Zustand) | ✅ Working |
| `src/components/layout/shared-sidebar.tsx` | Shared sidebar | ✅ Working |
| `src/lib/db/schema.ts` | DB schema | ✅ Complete |
| `src/lib/validations/solicitud.ts` | Zod schema | ✅ Defined, ❌ Not used |
| `src/app/api/solicitudes/route.ts` | POST/GET solicitudes | ✅ Exists |
| `src/app/api/webhooks/clerk/route.ts` | Clerk webhooks | ⚠️ Bug: candidate → recruiters |
| `src/app/empresa/procesos/[id]/page.tsx` | Process detail | ❌ Ignores [id] |
| `src/app/candidato/perfil/page.tsx` | Candidate profile | ❌ Save does nothing |
| `src/app/candidato/oportunidades/page.tsx` | Opportunities | ❌ Apply does nothing |
| `messages/en.json` | English translations | ✅ ~90% coverage |
| `messages/es.json` | Spanish translations | ✅ ~90% coverage |

---

*Report generated by analyzing 81+ source files across all portals, API routes, components, and config.*
