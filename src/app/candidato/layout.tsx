'use client'

import { SharedSidebar } from '@/components/layout/shared-sidebar'
import { useUser } from '@clerk/nextjs'

export default function CandidatoLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SharedSidebar
        role="candidato"
        user={{
          name: user?.fullName || 'Candidato',
          email: user?.emailAddresses?.[0]?.emailAddress || '',
          initials: user?.firstName?.[0] || 'C',
        }}
        notificationCount={2}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
