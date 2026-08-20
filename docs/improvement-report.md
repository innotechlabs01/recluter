# Recluter Platform — Improvement Report

**Status:** DONE  
**Date:** 2026-08-19  
**Analyzed:** Full codebase (src/app, src/components, src/lib, messages, config)

---

## Executive Summary

Recluter is a **UI shell** — a well-structured frontend scaffold with a complete DB schema, but **zero business logic, zero data fetching, zero API routes, and zero tests**. Every page renders hardcoded mock data. The wizard doesn't persist. The contact form doesn't submit. Auth is Clerk-only but there's no role-based route protection (any user can access any portal). The i18n coverage is partial — the landing page uses translations, but all three portals are entirely hardcoded in Spanish.

**Overall grade: 3/10 — Skeleton complete, application non-functional.**

---

## Critical Issues (Must Fix)

- [ ] **No API routes exist** — `src/app/api/` is empty. There is no way to create, read, update, or delete any entity.
- [ ] **Zero data fetching** — Every page renders hardcoded arrays. The DB schema exists but nothing queries it.
- [ ] **No role-based access control** — The middleware only checks if the user is authenticated. Any signed-in user can navigate to `/admin/*`, `/empresa/*`, or `/candidato/*`.
- [ ] **Wizard doesn't persist** — The 6-step solicitar wizard navigates between URL steps but stores no state. The "Submit" button fires `alert('Solicitud enviada!')`.
- [ ] **Contact form does nothing** — No `onSubmit` handler, no API call, no validation.
- [ ] **No webhook handler** — `CLERK_WEBHOOK_SECRET` is in `.env.example` but no `/api/webhooks` route exists to sync Clerk users with the DB.
- [ ] **No server actions or mutations** — The "Guardar cambios" button on candidate profile does nothing. "Postularme" does nothing. "Actualizar" on documents does nothing.
- [ ] **Review step shows all dashes** — `StepReview` displays "—" for every field because there's no form state management connecting previous steps.
- [ ] **Process detail page ignores `[id]` param** — The page renders hardcoded "Desarrollador Senior" regardless of which ID is in the URL.
- [ ] **No loading/error states** — No `loading.tsx`, `error.tsx`, or `not-found.tsx` anywhere in the app.

---

## Important Improvements (Should Fix)

- [ ] **i18n gaps in all portals** — Empresa, Admin, and Candidato portals have 0 translation keys. All text is hardcoded Spanish.
- [ ] **i18n gaps in landing components** — `Testimonials`, `Metrics`, `TrustLogos`, and `FinalCTA` are not i18n-ized (hardcoded Spanish strings).
- [ ] **Admin sidebar uses emojis for icons** — `📊🏢📋🎯📅⚙️` instead of Lucide icons like the Empresa sidebar does.
- [ ] **Candidate sidebar uses emojis for icons** — Same issue as admin.
- [ ] **Sidebar duplicated 3 times** — Empresa uses `components/layout/sidebar.tsx`, Admin and Candidate inline their own `<aside>` blocks. Should be a single configurable `Sidebar` component.
- [ ] **No form state management** — No `react-hook-form`, no `zod` schemas, no `useState`/`useReducer` in wizard steps. Forms are uncontrolled.
- [ ] **No form validation** — Zero zod schemas, zero client-side validation, zero server-side validation.
- [ ] **No database migrations tooling** — `drizzle-kit` is installed and configured, but `drizzle-kit generate` / `drizzle-kit migrate` scripts are missing from `package.json`.
- [ ] **`isAdmin` and `isCompanyAdmin` are identical functions** — Both check `orgRole === 'org:admin'`. One of these should check a different role or the org mapping.
- [ ] **No `next-intl` middleware** — The language is read from cookies, but there's no Next.js middleware to handle locale routing or redirect based on `Accept-Language`.
- [ ] **Auth layout hardcodes "Colombia"** — The left branding panel says "Conectamos empresas con profesionales calificados en Colombia" but the landing page says "Estados Unidos". Inconsistent messaging.
- [ ] **`@supabase/supabase-js` is a dependency but unused** — Drizzle + `postgres` is used for DB. Supabase client is never imported anywhere.
- [ ] **No `hooks` directory** — `components.json` aliases `@/hooks` but the directory doesn't exist.
- [ ] **No `middleware.ts` role protection** — The Clerk middleware should check `unsafeMetadata.role` to redirect users to the correct portal after login.
- [ ] **No seed data script** — No way to populate the DB for development.
- [ ] **No `.env.local` validation** — `db/index.ts` does `process.env.DATABASE_URL!` with no check. Will crash at runtime if missing.
- [ ] **`process-list.tsx` has hardcoded data** — Should query the DB for the current company's processes.
- [ ] **`timeline.tsx` has hardcoded data** — Should accept `jobRequestId` and fetch events.
- [ ] **`stat-card.tsx` is generic but all dashboards pass hardcoded numbers** — Should compute from real data.
- [ ] **No pagination** — Tables in admin/empresa portals show all rows with no pagination.
- [ ] **No search/filter** — Admin empresas, solicitudes, candidatos pages have no search or filter capability.

---

## Nice to Have

- [ ] **Dark mode support** — Only light mode. The CSS variables are set up but no toggle exists.
- [ ] **Responsive sidebar** — Sidebars are fixed `w-64` with no mobile hamburger/drawer.
- [ ] **Audit log integration** — `auditLogs` table exists in schema but nothing writes to it.
- [ ] **Notification system** — `notifications` table exists but no real-time push, no read/unread toggle, no mark-as-read API.
- [ ] **Email notifications** — No email service integration (Resend, SendGrid, etc.).
- [ ] **File upload** — Documents page has drag-drop UI but no upload handler. No Supabase Storage or S3 integration.
- [ ] **Calendar integration** — Interviews page shows dates but no calendar view, no `.ics` export, no Google Calendar sync.
- [ ] **Analytics dashboard** — Admin dashboard shows mock metrics. Should query real data.
- [ ] **Candidate rating system** — Admin candidatos page shows ratings but there's no way to rate.
- [ ] **Company profile management** — Empresa portal has no settings/profile page (sidebar links to `/empresa/perfil` which doesn't exist).
- [ ] **Candidate portal settings** — No settings page for candidates.
- [ ] **Multi-step form with progress persistence** — If user navigates away from wizard, all progress is lost.
- [ ] **PDF export** — No way to export candidate profiles, process summaries, or reports.
- [ ] **Bulk actions** — No bulk select, bulk status change, bulk export on any table.
- [ ] **Accessibility audit** — No ARIA labels, no focus management, no skip-nav links.
- [ ] **SEO** — No `generateMetadata` on any page. Only root layout has metadata.
- [ ] **Testing** — Zero test files. No unit, integration, or E2E tests.
- [ ] **CI/CD** — No GitHub Actions, no Vercel config, no deployment pipeline.
- [ ] **Storybook** — No component documentation.
- [ ] **Error boundaries** — No React error boundaries.
- [ ] **Rate limiting** — No API rate limiting (no API routes exist anyway).

---

## Detailed Analysis by Section

### Auth Pages

**Current state:** Sign-in and sign-up use Clerk's prebuilt `<SignIn />` and `<SignUp />` components. Role-selection page saves role to `unsafeMetadata`.

**Issues found:**
- Role-selection page is accessible even after role is already set (no redirect).
- No post-signup redirect logic — after selecting role, user goes to portal but middleware doesn't enforce it.
- Auth layout mentions "Colombia" while landing says "Estados Unidos" — inconsistent copy.
- No email verification flow handling.
- No "forgot password" page (Clerk handles this, but no custom UI).

**Recommended improvements:**
1. Add middleware logic: after auth, check `unsafeMetadata.role` and redirect to correct portal.
2. Prevent role-selection page access if role is already set.
3. Align branding copy between auth layout and landing page.
4. Add `afterSignInUrl` / `afterSignUpUrl` to Clerk components.

---

### Landing Page

**Current state:** 10 sections implemented (Hero, TrustLogos, HowItWorks, Metrics, Benefits, Testimonials, FAQ, Payment, FinalCTA, Contact). Hero, HowItWorks, Benefits, FAQ, Payment, Contact use i18n. TrustLogos, Metrics, Testimonials, FinalCTA are hardcoded Spanish.

**Issues found:**
- `TrustLogos` — Placeholder company names ("Acme Corp", "TechCo"). Not real logos.
- `Metrics` — Hardcoded numbers ("500+", "48h", "95%", "50+"). Not dynamic.
- `Testimonials` — Hardcoded testimonials with names. Not from DB.
- `FinalCTA` — Hardcoded Spanish text, not i18n-ized.
- Contact form has no `onSubmit`, no API, no validation.
- No mobile menu toggle in Header.
- Footer is minimal — no links, no social media, no legal pages.

**Recommended improvements:**
1. i18n-ize all remaining components.
2. Make Contact form functional with API route.
3. Add mobile hamburger menu.
4. Add real trust logos or remove section.
5. Make metrics dynamic or clearly mark as marketing copy.
6. Expand footer with links, social, legal.

---

### Empresa Portal

**Current state:** Dashboard, wizard (6 steps), processes list, process detail, candidates, history. All render hardcoded data.

**Issues found:**
- Dashboard shows hardcoded stats (3 processes, 12 candidates, etc.).
- Wizard step "Review" shows all dashes — no state management connecting steps.
- Wizard "Submit" button fires `alert()`.
- Process detail ignores `[id]` param.
- Candidates page has hardcoded candidate array.
- History page has hardcoded history array.
- No empresa settings/profile page (sidebar links to `/empresa/perfil` which doesn't exist).
- Sidebar has a "Notificaciones" link to `/empresa/notificaciones` which doesn't exist.
- Sidebar shows hardcoded user "Acme Corp" — should be dynamic from Clerk.

**Recommended improvements:**
1. Add form state management (zustand, react-hook-form, or useReducer).
2. Create API routes for wizard submission.
3. Make process detail dynamic with `[id]` param.
4. Create empresa settings page.
5. Create empresa notifications page.
6. Fetch real data for all dashboard stats.

---

### Admin Portal

**Current state:** Dashboard, empresas, solicitudes, candidatos, reclutadores, historial (placeholder), configuracion (placeholder). All hardcoded.

**Issues found:**
- `historial/page.tsx` — "Próximamente" placeholder.
- `configuracion/page.tsx` — "Próximamente" placeholder.
- Sidebar uses emojis instead of Lucide icons (inconsistent with empresa sidebar).
- No admin-specific sidebar component — duplicated layout code.
- No CRUD operations on any entity (can't create/edit/delete companies, recruiters, etc.).
- No recruiter assignment workflow.
- No solicitude status management.
- Candidatos page shows rating but no way to rate or manage.

**Recommended improvements:**
1. Implement `historial` with real data from `processEvents` table.
2. Implement `configuracion` with system settings from `systemConfig` table.
3. Replace emoji icons with Lucide icons.
4. Extract admin sidebar into shared component.
5. Add CRUD operations for empresas, reclutadores.
6. Add recruiter assignment to solicitudes.

---

### Candidate Portal

**Current state:** Dashboard, perfil, oportunidades, postulaciones, entrevistas, documentos, notificaciones. All hardcoded.

**Issues found:**
- `perfil/page.tsx` — "Guardar cambios" button does nothing. Form is not connected to any state or API.
- `oportunidades/page.tsx` — "Postularme" button does nothing.
- `documentos/page.tsx` — Upload area is purely visual, no file handling.
- `notificaciones/page.tsx` — Hardcoded notifications, no read/unread toggle, no mark-as-read.
- No candidate settings page.
- Dashboard shows hardcoded "Bienvenido, Juan" — should be dynamic.
- No profile completion indicator.

**Recommended improvements:**
1. Connect perfil form to state and API.
2. Implement "Postularme" action with API route.
3. Implement file upload for documents (Supabase Storage or S3).
4. Make notifications read/unread functional.
5. Dynamic welcome message from Clerk user data.
6. Add profile completion percentage.

---

### Components

**Current state:** 14 UI components (shadcn), 10 landing components, 4 dashboard components, 2 shared, 6 wizard components, 2 layout components.

**Issues found:**
- `sidebar.tsx` — Hardcoded user "Acme Corp" and email.
- `timeline.tsx` — Hardcoded events, should accept props.
- `process-list.tsx` — Hardcoded processes, should fetch data.
- `candidate-card.tsx` — Well-structured but unused in candidato portal.
- `stat-card.tsx` — Generic but always receives hardcoded values.
- `language-switcher.tsx` — Uses cookie manipulation instead of Next.js `useRouter` with locale prefix.
- `logo.tsx` — Text-only logo, no SVG/image option.
- No `Select` component used in wizard steps is actually controlled.
- No `Dialog` or `Modal` component used anywhere (imported but unused in practice).
- `accordion.tsx` is imported in FAQ but its API (`multiple` prop) may not match shadcn's standard.

**Recommended improvements:**
1. Make sidebar accept user data as props or fetch from Clerk.
2. Make timeline accept events as props.
3. Make process-list fetch from API.
4. Add `Select` controlled state in wizard.
5. Use Dialog for confirmations (delete, status change).
6. Add loading skeletons to dashboard components.

---

### i18n

**Current state:** `next-intl` configured. Two locale files: `es.json` and `en.json`. Covers: common, nav, landing (hero, howItWorks, benefits, faq, payment, contact), auth (roleSelection), empresa (dashboard, wizard).

**Coverage gaps:**
| Section | i18n Status |
|---------|------------|
| Landing Hero | ✅ Done |
| Landing HowItWorks | ✅ Done |
| Landing Benefits | ✅ Done |
| Landing FAQ | ✅ Done |
| Landing Payment | ✅ Done |
| Landing Contact | ✅ Done |
| Landing TrustLogos | ❌ Hardcoded |
| Landing Metrics | ❌ Hardcoded |
| Landing Testimonials | ❌ Hardcoded |
| Landing FinalCTA | ❌ Hardcoded |
| Auth Role Selection | ⚠️ Keys exist but page uses hardcoded Spanish |
| Empresa Dashboard | ⚠️ Keys exist but page uses hardcoded Spanish |
| Empresa Wizard | ⚠️ Keys exist but wizard uses hardcoded Spanish |
| Empresa Processes | ❌ No keys |
| Empresa Candidates | ❌ No keys |
| Empresa History | ❌ No keys |
| Admin Dashboard | ❌ No keys |
| Admin Empresas | ❌ No keys |
| Admin Solicitudes | ❌ No keys |
| Admin Candidatos | ❌ No keys |
| Admin Reclutadores | ❌ No keys |
| Admin Historial | ❌ No keys |
| Admin Config | ❌ No keys |
| Candidate Dashboard | ❌ No keys |
| Candidate Profile | ❌ No keys |
| Candidate Opportunities | ❌ No keys |
| Candidate Applications | ❌ No keys |
| Candidate Interviews | ❌ No keys |
| Candidate Documents | ❌ No keys |
| Candidate Notifications | ❌ No keys |

**Total: ~30% i18n coverage.**

---

### Database

**Current state:** 11 tables defined in `schema.ts`: companies, jobRequests, jobRequestSteps, candidates, candidateProfiles, applications, processEvents, recruiters, notifications, auditLogs, systemConfig. Migrations directory exists with initial snapshot.

**Issues found:**
- **No foreign key on `recruiters.userId`** — Should reference a user table or Clerk ID.
- **No foreign key on `jobRequests.recruiterId`** — Should reference `recruiters.id`.
- **No `recruiterId` on `applications`** — No tracking of which recruiter submitted.
- **No `interviews` table** — Candidate portal has interviews page but no DB table for it.
- **No `documents` table** — Candidate portal has documents page but no DB table.
- **No `messages` or `comments` table** — No way to communicate between parties.
- **No `tags` or `skills` table** — Skills are stored as JSONB arrays, not normalized.
- **`candidateProfiles.resumeUrl`** — No storage integration to actually upload/store resumes.
- **No `ON DELETE` cascade rules** — Deleting a company won't cascade to job_requests.
- **No indexes defined** — No performance optimization for common queries.
- **No `role` field on any table** — Role is only in Clerk's `unsafeMetadata`, not in DB.
- **`systemConfig` is empty** — No actual config entries seeded.
- **Drizzle Kit scripts missing** — `package.json` has no `db:generate` or `db:migrate` scripts.

**Recommended improvements:**
1. Add `interviews` table with date, time, type, status, meetingLink.
2. Add `documents` table with filename, url, type, uploadedAt.
3. Add foreign keys for `recruiters.userId` and `jobRequests.recruiterId`.
4. Add `ON DELETE` cascade rules.
5. Add database indexes on frequently queried columns.
6. Add `db:generate` and `db:migrate` scripts to package.json.
7. Normalize skills into a separate table.
8. Seed `systemConfig` with default values.

---

### Security

**Current state:** Clerk authentication is in place. Middleware protects non-public routes. Webhook secret is configured but no handler exists.

**Issues found:**
- **No role-based route protection** — Any authenticated user can access `/admin/*`, `/empresa/*`, `/candidato/*`. The middleware only checks `auth.protect()`, not the user's role.
- **No API route authorization** — No API routes exist, but when they do, there's no pattern for checking permissions.
- **No CSRF protection** — Forms have no CSRF tokens.
- **No input sanitization** — No zod validation, no server-side sanitization.
- **No rate limiting** — No protection against brute force or abuse.
- **No CSP headers** — No Content Security Policy configuration.
- **Webhook handler missing** — `CLERK_WEBHOOK_SECRET` is configured but no route to verify webhooks.
- **No audit logging** — `auditLogs` table exists but nothing writes to it.
- **Hardcoded secrets risk** — `.env.local` is not in `.gitignore` check (should verify).
- **No HTTPS enforcement** — No redirect from HTTP to HTTPS in middleware.
- **`unsafeMetadata.role` is client-writable** — Users can set their own role via the role-selection page. A malicious user could set `role: 'admin'` via Clerk's JS API.

**Recommended improvements:**
1. Add role-based middleware: check `unsafeMetadata.role` and redirect accordingly.
2. Lock down admin routes to only `org:admin` role.
3. Add zod validation on all form inputs (server-side).
4. Implement webhook handler for Clerk events.
5. Add audit logging for all mutations.
6. Validate `unsafeMetadata.role` server-side (don't trust client).
7. Add CSP headers via next.config.ts or middleware.
8. Add rate limiting to API routes.

---

## Priority Matrix

| Priority | Count | Items |
|----------|-------|-------|
| P0 — Blocks launch | 10 | No API routes, no data fetching, no role protection, no form persistence, no webhook handler |
| P1 — Needed for MVP | 16 | i18n gaps, form validation, sidebar dedup, DB migrations, CRUD operations |
| P2 — Needed for production | 12 | Pagination, search, email notifications, audit logging, error handling |
| P3 — Enhancements | 13 | Dark mode, mobile responsive, testing, analytics, PDF export |

---

*Report generated by analyzing 81 source files across src/app, src/components, src/lib, messages, and config.*
