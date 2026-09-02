import { test as base } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Simulated auth helpers (decision #2): real Clerk login is NOT exercised.
 * These helpers inject the `user_role` cookie that middleware reads, which is
 * enough to drive role-based routing in the app.
 */

export type Role = 'company' | 'candidate' | 'admin'

export async function setRoleCookie(page: Page, role: Role) {
  await page.context().addCookies([
    {
      name: 'user_role',
      value: role,
      url: 'http://localhost:3000',
      sameSite: 'Lax',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    },
  ])
}

export const test = base.extend<{ role: Role }>({
  role: ['company', { option: true }],
})

export { expect } from '@playwright/test'
