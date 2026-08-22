'use client'

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs'

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseClerkProvider
      afterSignOutUrl="/"
    >
      {children}
    </BaseClerkProvider>
  )
}
