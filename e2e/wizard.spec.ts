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
  // Exact name: /siguiente/i alone also matches the Next.js dev-tools button.
  await page.getByRole('button', { name: 'Siguiente →' }).click()
  await expect(page).toHaveURL(/solicitar\/1/)
})

test('a completed step advances to step 2', async ({ page }) => {
  await page.goto('/empresa/solicitar/1')
  // Fill every required step-1 field so validation passes, then advance.
  await page.getByLabel(/nombre de la empresa/i).fill('Acme Corp')
  await page.getByLabel(/industria/i).fill('Tech')
  await page.getByLabel(/ubicaci.n/i).fill('Montevideo, UY')
  await page.getByLabel(/persona de contacto/i).fill('Ana Gomez')
  await page.getByLabel(/cargo/i).fill('HR Manager')
  await page.getByLabel(/email corporativo/i).fill('ana@acme.com')
  await page.getByRole('button', { name: 'Siguiente →' }).click()
  await expect(page).toHaveURL(/solicitar\/2/)
})
