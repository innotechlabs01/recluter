import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })

// MIGRATION AUTHORITY — READ BEFORE RUNNING:
// supabase/migrations/ is AUTHORITATIVE for shared/prod schema (Supabase CLI
// applies it via `supabase db push`). This drizzle `out` dir is a LOCAL-DEV
// mirror only — do NOT apply both tracks to the same DB (double-apply risk).
// Local flow: edit src/lib/db/schema.ts → `drizzle-kit generate` → port SQL
// into a new supabase/migrations/<ts>_name.sql → `supabase db push` (local).
export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
