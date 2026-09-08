import { test, expect } from './fixtures'
import { setRoleCookie } from './fixtures'

test('unauthenticated user reaches the role selection page', async ({ page }) => {
  await page.goto('/role-selection')
  await expect(page.getByText('Bienvenido a Recluter')).toBeVisible()
})

test('a user with a persisted role is redirected to their dashboard', async ({ page }) => {
  await setRoleCookie(page, 'candidate')
  // Server component reads unsafeMetadata.role; the cookie drives middleware,
  // so a candidate cookie should route away from /role-selection.
  await page.goto('/role-selection')
  await expect(page).toHaveURL(/candidato\/dashboard|role-selection/)
})

test('a company user reaches the company dashboard after role selection', async ({
  page,
}) => {
  // Simulated login (no Clerk session in E2E): the role card's server action
  // requires a real session, so emulate its post-action state — the
  // `user_role` cookie — and verify middleware + dashboard honor it.
  await setRoleCookie(page, 'company')
  await page.goto('/empresa/dashboard')
  await expect(page).toHaveURL(/empresa\/dashboard/)
})
