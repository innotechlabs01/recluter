# Recluter System

Hiring platform built with Next.js 16, Clerk (auth), Supabase, Drizzle ORM, and Resend.

## Test-mode setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your local env file:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in every variable in `.env.local` (see "Required env" below).
4. Run the database migrations (Drizzle) against your `DATABASE_URL`.
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Required env

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Drizzle) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server only) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (also signs testimonial tokens) |
| `CLERK_WEBHOOK_SECRET` | Verifies Clerk webhook signatures |
| `RESEND_API_KEY` | Sends transactional email via Resend |
| `NEXT_PUBLIC_APP_URL` | Public app URL (links, callbacks) |

Missing `DATABASE_URL` or `CLERK_SECRET_KEY` throws an explicit error at startup/use instead of silently falling back.

## Migrations — authority

`supabase/migrations/` is AUTHORITATIVE. `src/lib/db/migrations/` (drizzle-kit
`out`) is a local-dev mirror only. Never apply both tracks to the same DB.

Flow: edit `src/lib/db/schema.ts` → `drizzle-kit generate` → port SQL into a
new `supabase/migrations/<timestamp>_name.sql` → `supabase db push`.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
npm run test:unit  # node --test tests/unit/*.test.ts (no extra deps)
npm run test:e2e   # playwright test
```

## Notes

- Unit tests use the Node built-in test runner (`node:test`). No vitest/jest.
- Real Clerk auth is used in all environments; there is no mocked auth or E2E seed beyond what docs describe.
