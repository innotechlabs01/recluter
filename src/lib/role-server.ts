import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { resolveRole, type Role } from './role'

// Simple in-memory cache (60s TTL) — avoids a DB round-trip on every request.
const roleCache = new Map<string, { role: Role | null; expiresAt: number }>()
const CACHE_TTL_MS = 60_000

/**
 * Resolves the current user's role from the database.
 * Queries the `user_roles` table filtered by clerkUserId AND status = 'approved'.
 * Uses in-memory cache to avoid DB hit per request.
 * Returns null when user has no approved role.
 */
export async function getResolvedRole(clerkUserId: string): Promise<Role | null> {
  const now = Date.now()
  const cached = roleCache.get(clerkUserId)
  if (cached && cached.expiresAt > now) {
    return cached.role
  }

  const rows = await db
    .select({ role: userRoles.role, status: userRoles.status })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.clerkUserId, clerkUserId),
        eq(userRoles.status, 'approved')
      )
    )
    .limit(1)

  // Reuse resolveRole for validation — it checks the role string against the
  // whitelist so we never leak an unrecognised value.
  // Defense-in-depth: also verify status in JS in case a non-approved row
  // leaks through the WHERE clause (e.g. a race condition or mock).
  const role = rows.length > 0 && rows[0].status === 'approved'
    ? resolveRole({ unsafeMetadata: { role: rows[0].role } })
    : null

  roleCache.set(clerkUserId, { role, expiresAt: now + CACHE_TTL_MS })
  return role
}

/**
 * Invalidates the cached role for a user (call after role assignment or
 * revocation so the next request picks up the new state).
 */
export function invalidateRoleCache(clerkUserId: string): void {
  roleCache.delete(clerkUserId)
}
