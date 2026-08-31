import 'dotenv/config'
import postgres from 'postgres'

/**
 * Thin DB helper for E2E seeding / assertions. Uses the same `postgres` client
 * as the app (`src/lib/db`). Returns a structured result instead of throwing
 * so specs can degrade gracefully when the DB is unreachable.
 */
export interface DbResult {
  ok: boolean
  error?: string
}

export async function checkDb(): Promise<DbResult> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, error: 'DATABASE_URL missing' }
  }
  try {
    const sql = postgres(process.env.DATABASE_URL, { max: 1 })
    await sql`select 1`
    await sql.end()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
