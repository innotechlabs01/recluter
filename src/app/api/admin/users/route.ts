import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { invalidateRoleCache } from '@/lib/role-server'
import { VALID_ROLES } from '@/lib/role'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/admin/users — List all users with their roles
export async function GET() {
  const admin = await requireAdmin()
  if ('error' in admin) return admin.error

  const users = await db
    .select()
    .from(userRoles)
    .orderBy(desc(userRoles.createdAt))

  return NextResponse.json(users)
}

// POST /api/admin/users — Create or update a user role
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if ('error' in admin) return admin.error

  const body = await request.json()
  const { clerkUserId, role } = body

  if (!clerkUserId || typeof clerkUserId !== 'string') {
    return NextResponse.json({ error: 'clerkUserId is required' }, { status: 400 })
  }

  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
      { status: 400 }
    )
  }

  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, clerkUserId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(userRoles)
      .set({
        role,
        status: 'approved',
        assignedBy: admin.userId,
        updatedAt: new Date(),
      })
      .where(eq(userRoles.clerkUserId, clerkUserId))
  } else {
    await db.insert(userRoles).values({
      clerkUserId,
      role,
      status: 'approved',
      assignedBy: admin.userId,
    })
  }

  invalidateRoleCache(clerkUserId)

  return NextResponse.json({ success: true })
}
