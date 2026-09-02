import { currentUser } from '@clerk/nextjs/server'
import { resolveRole, type Role } from './role'

/**
 * Server helper that resolves the current user's role via Clerk's
 * `currentUser()`. Returns `null` when the user has no valid role yet.
 *
 * Kept in its own module (separate from the pure `role.ts`) so the pure
 * resolver stays unit-testable without loading Clerk's server runtime.
 */
export async function getResolvedRole(): Promise<Role | null> {
  const user = await currentUser()
  return resolveRole(user)
}
