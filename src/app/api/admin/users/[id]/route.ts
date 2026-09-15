import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { getResolvedRole, invalidateRoleCache } from '@/lib/role-server'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function requireAdmin() {
  const { userId } = await resolveAuth()
  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const role = await getResolvedRole(userId)
  if (role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { userId }
}

// DELETE /api/admin/users/[id] — Remove a user role
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if ('error' in admin) return admin.error

  const { id } = await params

  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.id, id))
    .limit(1)

  if (existing.length === 0) {
    return NextResponse.json({ error: 'User role not found' }, { status: 404 })
  }

  await db.delete(userRoles).where(eq(userRoles.id, id))

  invalidateRoleCache(existing[0].clerkUserId)

  return NextResponse.json({ success: true })
}

// PATCH /api/admin/users/[id] — Update a user role status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if ('error' in admin) return admin.error

  const { id } = await params
  const body = await request.json()

  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.id, id))
    .limit(1)

  if (existing.length === 0) {
    return NextResponse.json({ error: 'User role not found' }, { status: 404 })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() }

  if (body.role && ['company', 'candidate', 'admin', 'recruiter'].includes(body.role)) {
    updates.role = body.role
  }
  if (body.status && ['pending', 'approved', 'rejected'].includes(body.status)) {
    updates.status = body.status
  }

  await db.update(userRoles).set(updates).where(eq(userRoles.id, id))

  invalidateRoleCache(existing[0].clerkUserId)

  return NextResponse.json({ success: true })
}
