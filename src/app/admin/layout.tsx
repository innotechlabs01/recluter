'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Empresas', href: '/admin/empresas', icon: '🏢' },
  { name: 'Solicitudes', href: '/admin/solicitudes', icon: '📋' },
  { name: 'Candidatos', href: '/admin/candidatos', icon: '👥' },
  { name: 'Reclutadores', href: '/admin/reclutadores', icon: '🎯' },
  { name: 'Historial', href: '/admin/historial', icon: '📅' },
  { name: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
        <div className="p-4">
          <Logo variant="light" />
          <span className="text-xs text-slate-400 mt-1 block">Administrador</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === item.href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            )}>
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
