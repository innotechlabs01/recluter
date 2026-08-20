import { Logo } from '@/components/shared/logo'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Logo variant="light" />
          <h1 className="text-4xl font-bold mt-8 mb-4">
            Encontrá el talento perfecto
          </h1>
          <p className="text-xl text-blue-100">
            Conectamos empresas con profesionales calificados en Colombia
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-blue-100">
              <span className="text-green-400">✓</span> Talento verificado
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <span className="text-green-400">✓</span> Sin costos fijos
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <span className="text-green-400">✓</span> Proceso transparente
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
    </NextIntlClientProvider>
  )
}
