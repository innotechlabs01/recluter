import { Header } from '@/components/layout/header'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Recluter. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
