import { redirect } from 'next/navigation'
import RoleSelectionCards from './role-selection-cards'
import { getResolvedRole } from '@/lib/role-server'
import { roleDashboardPath } from '@/lib/role'

export const metadata = {
  title: 'Elegí tu rol | Recluter',
}

// Server component: resolves the persisted Clerk role BEFORE rendering role
// selection, so a user who already chose a role skips selection entirely.
export default async function RoleSelectionPage() {
  const role = await getResolvedRole()

  if (role) {
    redirect(roleDashboardPath(role))
  }

  return <RoleSelectionCards />
}
