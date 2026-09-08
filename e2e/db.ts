import 'dotenv/config'
import postgres from 'postgres'

/**
 * Thin DB helper for E2E seeding / assertions. Uses the same `postgres` client
 * as the app (`src/lib/db`). Returns a structured result instead of throwing
 * so specs can degrade gracefully when the DB is unreachable.
 *
 * E2E always targets the LOCAL Supabase stack (see docs/local-supabase.md).
 * The app's `.env.local` may point at cloud, but the playwright webServer
 * overrides DATABASE_URL to local for the app; the test runner resolves the
 * same local URL here so spec-side DB assertions hit the same database.
 */
const LOCAL_DB_URL = 'postgresql://postgres:postgres@127.0.0.1:54422/postgres'

export function resolveDbUrl(): string {
  return process.env.E2E_DATABASE_URL || LOCAL_DB_URL
}

export interface DbResult {
  ok: boolean
  error?: string
}

export async function checkDb(): Promise<DbResult> {
  const url = resolveDbUrl()
  try {
    const sql = postgres(url, { max: 1 })
    await sql`select 1`
    await sql.end()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}