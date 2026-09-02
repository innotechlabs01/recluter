import { test, expect } from './fixtures'
import { setRoleCookie } from './fixtures'

test.beforeEach(async ({ page }) => {
  await setRoleCookie(page, 'company')
})

test('wizard gates the Next button until the current step validates', async ({
  page,
}) => {
  await page.goto('/empresa/solicitar/1')
  // Advancing without a valid step should stay on step 1 and show an error.
  await page.getByRole('button', { name: /siguiente|next|continuar/i }).click()
  await expect(page).toHaveURL(/solicitar\/1/)
})

test('a completed step advances to step 2', async ({ page }) => {
  await page.goto('/empresa/solicitar/1')
  // Minimal fill to satisfy step-1 schema, then advance.
  await page.getByLabel(/nombre/i).first().fill('Acme Corp')
  await page.getByRole('button', { name: /siguiente|next|continuar/i }).click()
  await expect(page).toHaveURL(/solicitar\/2/)
})
