import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock calls are hoisted — declared at top level with a mutable mock object
// so each test can adjust return values.
const mockLimit = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: mockLimit,
  },
}))

describe('getResolvedRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns role from user_roles table when row exists', async () => {
    mockLimit.mockResolvedValueOnce([{ role: 'company', status: 'approved' }])

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_123')
    expect(role).toBe('company')
  })

  it('returns null when no row exists', async () => {
    mockLimit.mockResolvedValueOnce([])

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_unknown')
    expect(role).toBeNull()
  })

  it('returns null when status is pending', async () => {
    // Defense-in-depth: even if a non-approved row leaks through the WHERE
    // clause (e.g. a race condition), the implementation must reject it.
    mockLimit.mockResolvedValueOnce([{ role: 'company', status: 'pending' }])

    const { getResolvedRole } = await import('@/lib/role-server')
    const role = await getResolvedRole('clerk_user_123')
    expect(role).toBeNull()
  })

  it('invalidates cache so next call hits DB', async () => {
    mockLimit
      .mockResolvedValueOnce([{ role: 'company', status: 'approved' }])
      .mockResolvedValueOnce([{ role: 'candidate', status: 'approved' }])

    const { getResolvedRole, invalidateRoleCache } = await import('@/lib/role-server')

    // First call — hits DB
    const role1 = await getResolvedRole('clerk_user_123')
    expect(role1).toBe('company')

    // Second call — served from cache (no extra DB call)
    const role2 = await getResolvedRole('clerk_user_123')
    expect(role2).toBe('company')

    // Invalidate, then next call hits DB again
    invalidateRoleCache('clerk_user_123')
    const role3 = await getResolvedRole('clerk_user_123')
    expect(role3).toBe('candidate')
  })
})
