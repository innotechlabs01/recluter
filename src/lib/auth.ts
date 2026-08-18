import { auth, currentUser } from '@clerk/nextjs/server'

export async function getAuthUser() {
  const { userId, orgId, orgRole } = await auth()
  return { userId, orgId, orgRole }
}

export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

export function isAdmin(orgRole: string | null) {
  return orgRole === 'org:admin'
}

export function isCompanyAdmin(orgRole: string | null) {
  return orgRole === 'org:admin'
}
