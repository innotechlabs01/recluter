import { SharedSidebar } from '@/components/layout/shared-sidebar'

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SharedSidebar
        role="empresa"
        user={{
          name: 'Acme Corp',
          email: 'admin@acme.com',
          initials: 'AC',
        }}
        notificationCount={3}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
