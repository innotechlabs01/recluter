import { test, expect, setRoleCookie, completeOnboarding } from './fixtures'

test.describe('onboarding flow', () => {
  test('unauthenticated user visiting a protected route is redirected to onboarding', async ({
    page,
  }) => {
    await page.goto('/empresa/dashboard')
    await expect(page).toHaveURL(/onboarding|sign-in/)
  })

  test('onboarding page shows the two role options', async ({ page }) => {
    await page.goto('/onboarding')
    await expect(page.getByText('Soy empresa')).toBeVisible()
    await expect(page.getByText('Busco oportunidades')).toBeVisible()
  })

  test('clicking "Soy empresa" navigates to the empresa form', async ({
    page,
  }) => {
    await page.goto('/onboarding')
    await page.getByText('Soy empresa').click()
    await expect(page).toHaveURL(/onboarding\/empresa/)
    await expect(
      page.getByRole('heading', { name: /crear empresa/i }),
    ).toBeVisible()
  })

  test('clicking "Busco oportunidades" navigates to the candidato form', async ({
    page,
  }) => {
    await page.goto('/onboarding')
    await page.getByText('Busco oportunidades').click()
    await expect(page).toHaveURL(/onboarding\/candidato/)
    await expect(
      page.getByRole('heading', { name: /completar perfil/i }),
    ).toBeVisible()
  })

  test('empresa onboarding completes and redirects to empresa dashboard', async ({
    page,
  }) => {
    await completeOnboarding(page, 'company')
    await expect(page).toHaveURL(/empresa\/dashboard/)
  })

  test('candidato onboarding completes and redirects to candidato dashboard', async ({
    page,
  }) => {
    await completeOnboarding(page, 'candidate')
    await expect(page).toHaveURL(/candidato\/dashboard/)
  })

  test('user with an existing role is redirected away from onboarding', async ({
    page,
  }) => {
    await setRoleCookie(page, 'company')
    await page.goto('/onboarding')
    // Middleware should redirect a company user to their dashboard
    await expect(page).toHaveURL(/empresa\/dashboard|sign-in/)
  })

  test('/role-selection redirects to /onboarding', async ({ page }) => {
    await page.goto('/role-selection')
    await expect(page).toHaveURL(/onboarding/)
  })
})
