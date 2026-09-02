export type Role = 'company' | 'candidate' | 'admin'

const VALID_ROLES = new Set<Role>(['company', 'candidate', 'admin'])

export interface RoleUser {
  unsafeMetadata?: {
    role?: unknown
  }
}

/**
 * Resolves a role from a Clerk-style user object (server-side).
 *
 * Reads `user.unsafeMetadata.role` — NOT the JWT/middleware cookie — so the
 * resolved role reflects the persisted Clerk metadata, the single source of
 * truth on the server. Returns `null` when the user is missing or the role
 * is unset/invalid so the caller can fall back to role selection.
 */
export function resolveRole(user: RoleUser | null | undefined): Role | null {
  if (!user) return null

  const role = user.unsafeMetadata?.role
  if (typeof role !== 'string') return null
  if (!VALID_ROLES.has(role as Role)) return null

  return role as Role
}

/**
 * Maps a resolved role to its dashboard path. `null` falls back to role
 * selection.
 */
export function roleDashboardPath(role: Role | null): string {
  switch (role) {
    case 'company':
      return '/empresa/dashboard'
    case 'candidate':
      return '/candidato/dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/role-selection'
  }
}
