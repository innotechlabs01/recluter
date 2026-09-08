import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'

/**
 * E2E test bypass (decision: simulated cookie auth).
 *
 * Playwright specs never perform a real Clerk login — they inject a
 * `user_role` cookie (see e2e/fixtures.ts). When `E2E_BYPASS_CLERK=1` (set
 * ONLY by the playwright webServer, never in production), API routes accept
 * that cookie as identity instead of requiring a Clerk session.
 */
export function isE2eBypass(): boolean {
  return process.env.E2E_BYPASS_CLERK === '1'
}

export async function e2eRoleFromCookies(): Promise<string | undefined> {
  const store = await cookies()
  return store.get('user_role')?.value
}

export async function resolveAuth(): Promise<{
  userId: string | null
  orgId: string | null
}> {
  const { userId, orgId } = await auth()
  if (userId) return { userId, orgId: orgId ?? null }
  if (isE2eBypass()) {
    const role = await e2eRoleFromCookies()
    if (role) {
      return {
        userId: `e2e-${role}`,
        orgId: role === 'company' ? 'org_e2e_seed' : null,
      }
    }
  }
  return { userId: null, orgId: null }
}
