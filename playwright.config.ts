import { defineConfig, devices } from '@playwright/test'

/**
 * E2E configuration for Recluter.
 *
 * Auth strategy: SIMULATED login (decision #2) — no real Clerk OAuth flows are
 * exercised. Each spec sets a `user_role` cookie + optional metadata via the
 * global setup / test storage state so middleware behaves as if a user chose a
 * role. See `e2e/fixtures.ts` for the helpers.
 *
 * NOTE: requires a reachable Supabase DB (DATABASE_URL) to run against seeded
 * data. In environments where the DB is unreachable the specs are authored
 * artifacts that cannot execute.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  globalSetup: './e2e/global-setup.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `PORT=${process.env.E2E_PORT || 3000} npm run dev`,
    url: process.env.E2E_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      E2E_BYPASS_CLERK: '1',
      DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@127.0.0.1:54422/postgres',
    },
  },
})
