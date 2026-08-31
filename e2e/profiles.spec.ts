import { test, expect } from './fixtures'
import { setRoleCookie } from './fixtures'

test.describe('candidate profile', () => {
  test.beforeEach(async ({ page }) => {
    await setRoleCookie(page, 'candidate')
  })

  test('renders the candidate profile form', async ({ page }) => {
    await page.goto('/candidato/perfil')
    await expect(page.getByRole('heading', { name: /mi perfil/i })).toBeVisible()
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
    await expect(page.getByLabel(/habilidades/i)).toBeVisible()
  })

  test('submits the form and shows a success confirmation (res.ok path)', async ({
    page,
  }) => {
    await page.goto('/candidato/perfil')
    await page.getByLabel(/nombre/i).fill('Juan')
    await page.getByLabel(/apellido/i).fill('Perez')
    await page.getByLabel(/experiencia/i).fill('5 años en desarrollo web')
    await page.getByLabel(/habilidades/i).fill('React, TypeScript')
    await page.getByRole('button', { name: /guardar cambios/i }).click()
    await expect(page.getByTestId('profile-message')).toBeVisible()
  })
})

test.describe('empresa profile', () => {
  test.beforeEach(async ({ page }) => {
    await setRoleCookie(page, 'company')
  })

  test('renders the empresa profile form', async ({ page }) => {
    await page.goto('/empresa/perfil')
    await expect(page.getByRole('heading', { name: /perfil de la empresa/i })).toBeVisible()
    await expect(page.getByLabel(/nombre de la empresa/i)).toBeVisible()
  })

  test('rejects an invalid contact email (zod validation)', async ({ page }) => {
    await page.goto('/empresa/perfil')
    await page.getByLabel(/nombre de la empresa/i).fill('Acme')
    await page.getByLabel(/email de contacto/i).fill('not-an-email')
    await page.getByRole('button', { name: /guardar cambios/i }).click()
    await expect(page.getByText(/email inválido/i)).toBeVisible()
  })
})
