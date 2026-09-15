'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { invalidateRoleCache } from '@/lib/role-server'
import { cookies } from 'next/headers'

export async function completeOnboarding(role: 'company' | 'candidate') {
  const cookieStore = await cookies()

  // E2E bypass
  if (process.env.E2E_BYPASS_CLERK === '1') {
    cookieStore.set('user_role', role, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
    return { success: true }
  }

  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  // Check if user already has a role (prevent double-assignment)
  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.clerkUserId, userId))
    .limit(1)

  if (existing.length > 0) {
    return { success: true, alreadyAssigned: true }
  }

  // Insert role into DB
  await db.insert(userRoles).values({
    clerkUserId: userId,
    role,
    status: 'approved',
  })

  // Update Clerk metadata for backward compatibility
  const client = await clerkClient()
  await client.users.updateUser(userId, {
    unsafeMetadata: { role },
  })

  // Sync cookie for middleware (DB is primary, cookie is fallback for edge cases)
  cookieStore.set('user_role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  // Invalidate cache
  invalidateRoleCache(userId)

  return { success: true }
}
