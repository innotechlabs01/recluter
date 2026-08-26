'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'

export async function setUserRole(role: 'company' | 'candidate') {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Not authenticated')
  }

  // 1. Store role in cookie so middleware can read it (JWT doesn't include unsafeMetadata by default)
  const cookieStore = await cookies()
  cookieStore.set('user_role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  // 2. Also update Clerk metadata for persistence
  const client = await clerkClient()
  await client.users.updateUser(userId, {
    unsafeMetadata: { role },
  })

  return { success: true }
}
