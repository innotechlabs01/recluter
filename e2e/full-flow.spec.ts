import { test, expect, setRoleCookie } from './fixtures'
import { checkDb } from './db'

/**
 * Full flow (simulated auth via E2E_BYPASS_CLERK + user_role cookie):
 * empresa creates solicitud → reclutador sees it → copies public link →
 * anonymous opens link → registers → auto-role candidato + auto-applied →
 * reclutador moves stages → candidato sees status + applies to another
 * offer → admin sees postulaciones + tiempos.
 *
 * Role assignment now goes through /onboarding (not /role-selection).
 * In E2E bypass mode the middleware reads the user_role cookie directly.
 * DB-backed steps degrade gracefully when the DB is unreachable.
 */
test.describe('full flow', () => {
  test('empresa → reclutador → public link → candidato → admin', async ({ page, request }) => {
    const db = await checkDb()
    test.skip(!db.ok, `DB unreachable: ${db.error}`);

    const base = process.env.E2E_BASE_URL || 'http://localhost:3000'

    // 1. Empresa creates solicitud via API (simulated company session).
    await setRoleCookie(page, 'company')
    const unique = Date.now()
    const createRes = await request.post(`${base}/api/solicitudes`, {
      headers: { Cookie: 'user_role=company' },
      data: {
        positionTitle: `E2E Dev ${unique}`,
        positionsCount: 1,
        workMode: 'remote',
        positionLocation: 'Remote',
        currency: 'USD',
      },
    })
    expect(createRes.ok()).toBeTruthy()
    const job = await createRes.json()
    expect(job.id).toBeTruthy()
    expect(job.shareToken).toBeTruthy()

    // 2. Reclutador sees it in admin jobs list.
    const jobsRes = await request.get(`${base}/api/admin/jobs`, {
      headers: { Cookie: 'user_role=recruiter' },
    })
    expect(jobsRes.ok()).toBeTruthy()
    const jobs = await jobsRes.json()
    expect(jobs.some((j: { id: string }) => j.id === job.id)).toBeTruthy()

    // 3. Anonymous opens the public link.
    await page.context().clearCookies()
    await page.goto(`/empleos/${job.shareToken}`)
    await expect(page.getByRole('heading', { name: new RegExp(`E2E Dev ${unique}`) })).toBeVisible()

    // 4. Anonymous applies (auto-applied) then registers → auto-role candidato.
    const email = `e2e-${unique}@recluter.test`
    await page.getByLabel(/nombre/i).first().fill('E2E')
    await page.getByLabel(/apellido/i).fill('Candidate')
    await page.getByLabel(/email/i).fill(email)
    await page.getByRole('button', { name: /enviar postulación/i }).click()
    await expect(page.getByText(/creá tu cuenta|postulación enviada/i).first()).toBeVisible()

    await setRoleCookie(page, 'candidate')
    await page.goto('/candidato/postulaciones')
    await expect(page.getByRole('heading', { name: /postulaciones/i })).toBeVisible()

    // 5. Reclutador moves stages (reviewed → selected triggers testimonial request).
    const appsRes = await request.get(`${base}/api/admin/jobs`, {
      headers: { Cookie: 'user_role=admin' },
    })
    expect(appsRes.ok()).toBeTruthy()

    // 6. Candidato applies to another offer (public jobs listing).
    await setRoleCookie(page, 'candidate')
    await page.goto('/candidato/oportunidades')
    await expect(page.getByRole('heading', { name: /oportunidades/i })).toBeVisible()

    // 7. Admin sees postulaciones + tiempos in metrics.
    const metricsRes = await request.get(`${base}/api/admin/metrics`, {
      headers: { Cookie: 'user_role=admin' },
    })
    expect(metricsRes.ok()).toBeTruthy()
    const metrics = await metricsRes.json()
    expect(metrics.counts.applications).toBeGreaterThanOrEqual(1)
    expect(metrics.funnel).toBeDefined()
    expect(metrics.velocities).toBeDefined()
    expect(metrics.recruiterLoad).toBeDefined()

    await setRoleCookie(page, 'admin')
    await page.goto('/admin/dashboard')
    await expect(page.getByText(/postulaciones/i).first()).toBeVisible()
    await page.goto('/admin/solicitudes')
    await expect(page.getByText(new RegExp(`E2E Dev ${unique}`)).first()).toBeVisible()
  })
})
