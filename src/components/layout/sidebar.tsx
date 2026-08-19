'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/empresa/dashboard', icon: '📊' },
  { name: 'Buscar personal', href: '/empresa/solicitar/1', icon: '➕' },
  { name: 'Mis procesos', href: '/empresa/procesos', icon: '📋' },
  { name: 'Candidatos', href: '/empresa/candidatos', icon: '👥' },
  { name: 'Historial', href: '/empresa/historial', icon: '📅' },
]

const bottomNav = [
  { name: 'Mi perfil', href: '/empresa/perfil', icon: '⚙️' },
  { name: 'Notificaciones', href: '/empresa/notificaciones', icon: '🔔' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-4">
        <Logo variant="light" />
        <span className="text-xs text-slate-400 mt-1 block">Empresa</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 space-y-1 border-t border-slate-800">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
