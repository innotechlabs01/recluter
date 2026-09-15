import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted by vitest) ──────────────────────────────────────────────────

const mockRequireAdmin = vi.fn()
vi.mock('@/lib/admin-auth', () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) }),
    delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
  },
}))

const mockInvalidateRoleCache = vi.fn()
vi.mock('@/lib/role-server', () => ({
  invalidateRoleCache: (...args: unknown[]) => mockInvalidateRoleCache(...args),
}))

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('GET /api/admin/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    })

    const { GET } = await import('@/app/api/admin/users/route')
    const res = await GET()

    expect(res).toBeDefined()
    expect(res!.status).toBe(401)
    const body = await res!.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 403 when user is not admin', async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 }),
    })

    const { GET } = await import('@/app/api/admin/users/route')
    const res = await GET()

    expect(res).toBeDefined()
    expect(res!.status).toBe(403)
  })

  it('returns list of users when admin', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const mockUsers = [
      { id: '1', clerkUserId: 'user_a', role: 'recruiter', status: 'approved' },
      { id: '2', clerkUserId: 'user_b', role: 'company', status: 'pending' },
    ]

    const mod = await import('@/app/api/admin/users/route')
    const { db } = await import('@/lib/db')
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(mockUsers),
      }),
    })

    const res = await mod.GET()

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    const body = await res!.json()
    expect(body).toEqual(mockUsers)
  })
})

describe('POST /api/admin/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    })

    const { POST } = await import('@/app/api/admin/users/route')
    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ clerkUserId: 'user_1', role: 'recruiter' }),
    })
    const res = await POST(req)

    expect(res).toBeDefined()
    expect(res!.status).toBe(401)
  })

  it('returns 400 when clerkUserId is missing', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { POST } = await import('@/app/api/admin/users/route')
    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ role: 'recruiter' }),
    })
    const res = await POST(req)

    expect(res).toBeDefined()
    expect(res!.status).toBe(400)
    const body = await res!.json()
    expect(body.error).toBe('clerkUserId is required')
  })

  it('returns 400 when role is invalid', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { POST } = await import('@/app/api/admin/users/route')
    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ clerkUserId: 'user_1', role: 'superuser' }),
    })
    const res = await POST(req)

    expect(res).toBeDefined()
    expect(res!.status).toBe(400)
    const body = await res!.json()
    expect(body.error).toContain('Invalid role')
  })

  it('creates a new user role when valid', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { POST } = await import('@/app/api/admin/users/route')
    const { db } = await import('@/lib/db')

    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    })
    ;(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    })

    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ clerkUserId: 'user_new', role: 'recruiter' }),
    })
    const res = await POST(req)

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    const body = await res!.json()
    expect(body.success).toBe(true)
    expect(mockInvalidateRoleCache).toHaveBeenCalledWith('user_new')
  })

  it('updates an existing user role (upsert)', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { POST } = await import('@/app/api/admin/users/route')
    const { db } = await import('@/lib/db')

    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ clerkUserId: 'user_existing' }]),
        }),
      }),
    })
    const mockSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
      set: mockSet,
    })

    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ clerkUserId: 'user_existing', role: 'admin' }),
    })
    const res = await POST(req)

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    expect(mockInvalidateRoleCache).toHaveBeenCalledWith('user_existing')
  })
})
