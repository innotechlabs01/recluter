'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'

/**
 * Persists the selected portal role, keeping the `user_role` cookie and the
 * Clerk `unsafeMetadata.role` in sync (both are the single source of truth on
 * their respective layers).
 *
 * Admin passthrough: an admin's metadata role is authoritative and must never
 * be downgraded by the public role-selection flow, so an admin is passed
 * through unchanged.
 */
export async function setUserRole(role: 'company' | 'candidate') {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Not authenticated')
  }

  const client = await clerkClient()

  // Pass through admins — never downgrade an admin via role selection.
  const user = await client.users.getUser(userId)
  const current = user.unsafeMetadata?.role
  if (current === 'admin') {
    return { success: true, passthrough: true }
  }

  // 1. Update persisted Clerk metadata (server-side source of truth).
  await client.users.updateUser(userId, {
    unsafeMetadata: { role },
  })

  // 2. Mirror into the cookie so middleware can read it (JWT doesn't include
  //    unsafeMetadata by default).
  const cookieStore = await cookies()
  cookieStore.set('user_role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return { success: true, passthrough: false }
}
