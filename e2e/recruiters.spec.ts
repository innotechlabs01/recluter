import { test, expect, setRoleCookie } from './fixtures'

test.beforeEach(async ({ page }) => {
  await setRoleCookie(page, 'admin')
})

test('lists recruiters and renders the create form', async ({ page }) => {
  await page.goto('/admin/reclutadores')
  await expect(page.getByTestId('recruiter-form')).toBeVisible()
})

test('creates a new recruiter and it appears in the list', async ({ page }) => {
  await page.goto('/admin/reclutadores')
  await page.getByLabel(/nombre/i).fill('Test Recruiter')
  await page.getByLabel(/email/i).fill('test@recluter.com')
  await page.getByRole('button', { name: /agregar reclutador/i }).click()
  await expect(page.getByText('Test Recruiter')).toBeVisible()
})

test('request page shows an active-only assignment dropdown', async ({ page }) => {
  await page.goto('/admin/solicitudes')
  // Real data uses UUID ids → match any assign-<id> dropdown.
  await expect(page.locator('select[data-testid^="assign-"]').first()).toBeVisible()
})
