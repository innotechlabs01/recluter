import { test, expect } from './fixtures'

test('landing page loads and renders the contact section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 2, name: /contact/i })).toBeVisible()
})
