# Testimonial System Design — Real Client Feedback for Landing

**Date:** 2026-08-20
**Status:** Approved
**Scope:** DB schema + API + email + form + admin panel + landing integration

## 1. Goal
Replace hardcoded testimonials on landing with real client feedback. After a successful hire, the system automatically requests a testimonial via email. Admin reviews before publishing. Landing displays only approved testimonials.

## 2. Context & Constraints
- Stack: Next.js 16.3.1, Tailwind 4, shadcn, Drizzle ORM, Supabase (PostgreSQL), Clerk auth, Resend (email)
- Existing schema: `companies` (clerkOrgId), `jobRequests` (companyId, status), `applications` (candidateId, jobRequestId)
- `jobRequestStatusEnum` includes `hired` status — this is the trigger
- No existing email service — Resend just installed (`resend@^6.21.0`), API key in `.env.local` as `RESEND_API_KEY`
- Auth: Clerk with organizations — companies map to Clerk orgs
- Admin pages exist at `/admin/*` with sidebar nav

## 3. Architecture

### New Files
| File | Purpose |
|------|---------|
| `src/lib/db/schema.ts` | Add `testimonials` table + `testimonialStatusEnum` |
| `src/lib/db/migrations/0001_add_testimonials.sql` | Drizzle migration |
| `src/lib/resend.ts` | Resend client singleton |
| `src/lib/email/testimonial-request.tsx` | Email template (React Email style) |
| `src/app/api/testimonials/request/route.ts` | POST — trigger email + create DB record |
| `src/app/api/testimonials/route.ts` | GET — public, returns approved testimonials |
| `src/app/api/admin/testimonials/route.ts` | GET — list all (admin), PATCH — approve/reject |
| `src/app/api/admin/testimonials/[id]/route.ts` | PATCH — approve/reject single, DELETE — remove |
| `src/app/(marketing)/testimonio/page.tsx` | Public testimonial form (token-protected) |
| `src/app/admin/testimonios/page.tsx` | Admin testimonial management |
| `src/components/landing/testimonials.tsx` | Rewrite to fetch from API |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/db/schema.ts` | Add testimonialStatusEnum + testimonials table |
| `src/components/landing/testimonials.tsx` | Fetch from API instead of hardcoded |
| `src/app/admin/layout.tsx` | Add "Testimonios" nav item |
| `messages/es.json` | Add testimonial translations |

### Not Touched
- Auth flow, other admin pages, empresa/candidato portals, i18n structure

## 4. Component Design

### 4.1 DB Schema — `testimonials` table

```ts
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
  rating: integer('rating').notNull(), // 1-5
  status: testimonialStatusEnum('status').default('pending'),
  token: text('token').unique().notNull(), // JWT for form access
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
})
```

### 4.2 Email Trigger — `/api/testimonials/request`

POST body: `{ jobRequestId: string }`

Flow:
1. Verify caller is admin (Clerk auth)
2. Load jobRequest + company
3. Generate JWT token (HS256, 7-day expiry) with `{ companyId, jobRequestId, authorName, authorRole, companyName }`
4. Insert testimonial record with status `pending`
5. Send email via Resend to company contactEmail
6. Return success

### 4.3 Testimonial Form — `/testimonio?token=<jwt>`

- Decodes token, validates expiry
- Shows: company name, author name/role (readonly)
- User fills: rating (1-5 stars), quote (textarea)
- Submit → PATCH `/api/testimonials` → sets status to `approved` (auto-approve for v1)
- Success page: "¡Gracias por tu testimonio!"

### 4.4 Admin Panel — `/admin/testimonios`

- Table: author, company, rating, status, date
- Actions: Approve, Reject, Delete
- Badge colors: pending=yellow, approved=green, rejected=red

### 4.5 Landing — `Testimonials` component

- Fetches `/api/testimonials?status=approved&limit=6`
- Shows star rating per testimonial
- Falls back to hardcoded testimonials if API fails or returns 0

### 4.6 Email Template

Professional HTML email:
- Recluter branding
- "¡Felicitaciones por tu nueva contratación!"
- CTA button: "Dejar mi testimonio" → `/testimonio?token=...`
- Footer with unsubscribe link

## 5. Data Flow

```
Admin marks candidate "hired"
  → POST /api/testimonials/request { jobRequestId }
    → DB: insert testimonial (status: pending, token: jwt)
    → Email: Resend sends to company.contactEmail
      → Client clicks link → /testimonio?token=...
        → Fills form → PATCH /api/testimonials
          → DB: status → approved
            → Landing fetches approved → displays
```

## 6. Security

- JWT tokens: 7-day expiry, HS256 signed with `CLERK_SECRET_KEY`
- Admin routes: protected by Clerk auth middleware
- Public form: only accessible with valid token
- No sensitive data in tokens (just IDs + names)
- Rate limiting: not needed for v1 (low volume)

## 7. Migration

1. Run `npx drizzle-kit generate` to create migration SQL
2. Run `npx drizzle-kit push` to apply to Supabase
3. No data loss — new table only

## 8. Testing

- Unit: token generation, email sending (mock Resend)
- Integration: API routes, DB operations
- E2E: full flow (admin request → email → form submit → landing display)
- Manual: check email delivery, form UX, admin panel

## 9. Future Enhancements (out of scope)

- Webhook trigger (instead of manual admin action)
- Email reminders (if no response after 7 days)
- Testimonial moderation queue with notes
- Public testimonial page with all approved
- Video testimonials
