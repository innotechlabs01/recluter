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

test('company card navigates to the company dashboard after role selection', async ({
  page,
}) => {
  await page.goto('/role-selection')
  await page.getByText('Soy empresa').click()
  await expect(page).toHaveURL(/empresa\/dashboard/, { timeout: 10_000 })
})
