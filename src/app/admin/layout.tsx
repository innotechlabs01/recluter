'use client'

import { SharedSidebar } from '@/components/layout/shared-sidebar'
import { useUser } from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { useMessages } from 'next-intl'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const messages = useMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen bg-slate-50">
        <SharedSidebar
          role="admin"
          user={{
            name: user?.fullName || 'Admin',
            email: user?.emailAddresses?.[0]?.emailAddress || '',
            initials: user?.firstName?.[0] || 'A',
          }}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </NextIntlClientProvider>
  )
}
