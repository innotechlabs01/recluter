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

describe('DELETE /api/admin/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    })

    const { DELETE } = await import('@/app/api/admin/users/[id]/route')
    const res = await DELETE(new Request('http://localhost/api/admin/users/123'), {
      params: Promise.resolve({ id: '123' }),
    })

    expect(res).toBeDefined()
    expect(res!.status).toBe(401)
  })

  it('returns 404 when user role not found', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { DELETE } = await import('@/app/api/admin/users/[id]/route')
    const { db } = await import('@/lib/db')
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    })

    const res = await DELETE(new Request('http://localhost/api/admin/users/999'), {
      params: Promise.resolve({ id: '999' }),
    })

    expect(res).toBeDefined()
    expect(res!.status).toBe(404)
    const body = await res!.json()
    expect(body.error).toBe('User role not found')
  })

  it('deletes and invalidates cache when found', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { DELETE } = await import('@/app/api/admin/users/[id]/route')
    const { db } = await import('@/lib/db')
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: '123', clerkUserId: 'user_abc' }]),
        }),
      }),
    })
    ;(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    })

    const res = await DELETE(new Request('http://localhost/api/admin/users/123'), {
      params: Promise.resolve({ id: '123' }),
    })

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    const body = await res!.json()
    expect(body.success).toBe(true)
    expect(mockInvalidateRoleCache).toHaveBeenCalledWith('user_abc')
  })
})

describe('PATCH /api/admin/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('returns 401 when not authenticated', async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    })

    const { PATCH } = await import('@/app/api/admin/users/[id]/route')
    const req = new Request('http://localhost/api/admin/users/123', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: '123' }) })

    expect(res).toBeDefined()
    expect(res!.status).toBe(401)
  })

  it('returns 404 when user role not found', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { PATCH } = await import('@/app/api/admin/users/[id]/route')
    const { db } = await import('@/lib/db')
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    })

    const req = new Request('http://localhost/api/admin/users/999', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: '999' }) })

    expect(res).toBeDefined()
    expect(res!.status).toBe(404)
  })

  it('updates role and invalidates cache when valid', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { PATCH } = await import('@/app/api/admin/users/[id]/route')
    const { db } = await import('@/lib/db')
    const mockSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet })
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: '123', clerkUserId: 'user_abc' }]),
        }),
      }),
    })

    const req = new Request('http://localhost/api/admin/users/123', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'admin', status: 'approved' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: '123' }) })

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    const body = await res!.json()
    expect(body.success).toBe(true)
    expect(mockInvalidateRoleCache).toHaveBeenCalledWith('user_abc')
    expect(mockSet).toHaveBeenCalled()
  })

  it('ignores invalid role values in PATCH', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ userId: 'admin_123' })

    const { PATCH } = await import('@/app/api/admin/users/[id]/route')
    const { db } = await import('@/lib/db')
    const mockSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet })
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: '123', clerkUserId: 'user_abc' }]),
        }),
      }),
    })

    const req = new Request('http://localhost/api/admin/users/123', {
      method: 'PATCH',
      body: JSON.stringify({ role: 'superuser' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: '123' }) })

    expect(res).toBeDefined()
    expect(res!.status).toBe(200)
    // The updates object should NOT contain the invalid role
    const setArg = mockSet.mock.calls[0][0]
    expect(setArg).not.toHaveProperty('role')
  })
})
