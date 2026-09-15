import { redirect } from 'next/navigation'
import { getResolvedRole } from '@/lib/role-server'
import { roleDashboardPath } from '@/lib/role'
import { auth } from '@clerk/nextjs/server'
import OnboardingCards from './onboarding-cards'

export const metadata = {
  title: 'Completá tu registro | Recluter',
}

export default async function OnboardingPage() {
  // E2E bypass: skip Clerk auth check
  if (process.env.E2E_BYPASS_CLERK === '1') {
    return <OnboardingCards />
  }

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const role = await getResolvedRole(userId)
  if (role) redirect(roleDashboardPath(role))

  return <OnboardingCards />
}
