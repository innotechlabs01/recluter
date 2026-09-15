import { NextResponse } from 'next/server'
import { resolveAuth } from '@/lib/test-auth'
import { getResolvedRole } from '@/lib/role-server'

/**
 * Verifies the current user has admin role.
 * Returns `{ userId }` on success, or `{ error: NextResponse }` on failure.
 */
export async function requireAdmin() {
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
