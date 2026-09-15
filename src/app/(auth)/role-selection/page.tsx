import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Redirigiendo | Recluter',
}

// This route has been replaced by /onboarding.
// Redirect any legacy bookmarks or links.
export default function RoleSelectionPage() {
  redirect('/onboarding')
}
