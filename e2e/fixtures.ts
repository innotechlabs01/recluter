import { test as base } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Simulated auth helpers (decision #2): real Clerk login is NOT exercised.
 * These helpers inject the `user_role` cookie that middleware reads, which is
 * enough to drive role-based routing in the app.
 */

export type Role = 'company' | 'candidate' | 'admin' | 'recruiter'

export async function setRoleCookie(page: Page, role: Role) {
  await page.context().addCookies([
    {
      name: 'user_role',
      value: role,
      url: process.env.E2E_BASE_URL || 'http://localhost:3000',
      sameSite: 'Lax',
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    },
  ])
}

/**
 * Complete the onboarding flow by navigating to /onboarding, selecting a role
 * card, filling the form, and submitting. In E2E bypass mode the server action
 * sets the user_role cookie directly.
 */
export async function completeOnboarding(
  page: Page,
  role: 'company' | 'candidate',
) {
  await page.goto('/onboarding')

  const cardText =
    role === 'company' ? 'Soy empresa' : 'Busco oportunidades'
  await page.getByText(cardText).click()

  // Wait for the form page to load
  await page.waitForURL(
    role === 'company' ? /onboarding\/empresa/ : /onboarding\/candidato/,
  )

  if (role === 'company') {
    await page.getByLabel(/nombre de la empresa/i).fill('Test Corp')
    await page.getByLabel(/industria/i).fill('Tech')
  } else {
    await page.getByLabel(/nombre/i).fill('Test')
    await page.getByLabel(/apellido/i).fill('Candidate')
  }

  await page
    .getByRole('button', { name: /crear|completar/i })
    .click()

  // Wait for navigation to the dashboard after onboarding completes
  await page.waitForURL(
    role === 'company' ? /empresa\/dashboard/ : /candidato\/dashboard/,
  )
}

export const test = base.extend<{ role: Role }>({
  role: ['company', { option: true }],
})

export { expect } from '@playwright/test'
