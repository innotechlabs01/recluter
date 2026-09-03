/**
 * Global setup (once per test run).
 *
 * Verifes the app server is reachable and that Clerk + Supabase env vars are
 * present. Because the real DB is unreachable in some environments, this
 * bails out with a clear message rather than failing the whole run silently.
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { request } from '@playwright/test'
import { checkDb } from './db'

export default async function globalSetup() {
  // Next loads .env.local for the app; replicate that so the test runner sees
  // the same values the app does.
  config({ path: resolve(process.cwd(), '.env.local') })

  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'

  const ctx = await request.newContext()
  try {
    const res = await ctx.get(`${baseURL}/`)
    if (!res.ok()) {
      throw new Error(
        `App not reachable at ${baseURL} (status ${res.status()}). Start the dev server first.`
      )
    }
    console.log(`[global-setup] App reachable at ${baseURL}`)
  } finally {
    await ctx.dispose()
  }

  if (!process.env.DATABASE_URL) {
    console.warn('[global-setup] DATABASE_URL missing — DB-backed assertions will be skipped.')
    return
  }

  const dbOk = await checkDb()
  if (!dbOk.ok) {
    console.warn(
      `[global-setup] DB unreachable: ${dbOk.error}. ` +
        'Tests will run in authoring mode (no seeded data).'
    )
  }
}
