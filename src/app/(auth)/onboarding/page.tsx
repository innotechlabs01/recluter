import { redirect } from 'next/navigation'
import { getResolvedRole } from '@/lib/role-server'
import { roleDashboardPath } from '@/lib/role'
import { auth } from '@clerk/nextjs/server'
import OnboardingCards from './onboarding-cards'

export const metadata = {
  title: 'Completá tu registro | Recluter',
}

export default async function OnboardingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const role = await getResolvedRole(userId)
  if (role) redirect(roleDashboardPath(role))

  return <OnboardingCards />
}
