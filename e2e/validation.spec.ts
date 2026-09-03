import { test, expect } from './fixtures'

// These assertions verify zod constraints surfaced in the UI. They exercise
// the schema behaviour regardless of DB reachability.

test('contact form validates required fields and shows a success stub', async ({
  page,
}) => {
  await page.goto('/#contacto')
  // Client-side success stub (decision #6) — no backend involved.
  await page.getByLabel(/nombre/i).fill('Ana')
  await page.getByLabel(/email/i).fill('ana@example.com')
  await page.getByLabel(/mensaje/i).fill('Quiero contratar personal')
  await page.getByRole('button', { name: /enviar/i }).click()
  await expect(page.getByTestId('contact-success')).toBeVisible()
})

test('contact form rejects a submission with a blank message', async ({ page }) => {
  await page.goto('/#contacto')
  await page.getByLabel(/nombre/i).fill('Ana')
  await page.getByLabel(/email/i).fill('ana@example.com')
  await page.getByRole('button', { name: /enviar/i }).click()
  await expect(page.getByText(/mensaje es requerido/i)).toBeVisible()
})

test('testimonials reject a quote over 500 characters', async ({ page }) => {
  // Build a token for a synthetic request so the page renders the form.
  const payload = btoa(
    JSON.stringify({
      authorName: 'Ana',
      authorRole: 'HR',
      companyName: 'Acme',
      jobRequestId: '00000000-0000-0000-0000-000000000000',
    })
  )
  const token = `header.${payload}.sig`
  await page.goto(`/testimonio?token=${token}`)
  await page.getByText(/¿cómo fue tu experiencia/i).click()
  const textarea = page.getByPlaceholder(/contanos sobre tu experiencia/i)
  await textarea.fill('a'.repeat(501))
  // The UI caps input at 500 characters.
  expect((await textarea.inputValue()).length).toBeLessThanOrEqual(500)
})
