import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/header'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-slate-900 text-slate-400 py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 Recluter. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}
