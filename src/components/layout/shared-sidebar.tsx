'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  UserPlus,
  Briefcase,
  Users,
  History,
  Settings,
  Bell,
  LogOut,
  Building2,
  FileText,
  UserSearch,
  Calendar,
  BriefcaseIcon,
  Search,
  Star,
  FolderOpen,
} from 'lucide-react'

interface SidebarProps {
  role: 'empresa' | 'admin' | 'candidato'
  user?: {
    name: string
    email: string
    initials: string
  }
  notificationCount?: number
}

export function SharedSidebar({ role, user, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navigationConfig = {
    empresa: {
      label: t('dashboard'),
      items: [
        { name: t('dashboard'), href: '/empresa/dashboard', icon: LayoutDashboard },
        { name: t('requestPersonnel'), href: '/empresa/solicitar/1', icon: UserPlus },
        { name: t('history'), href: '/empresa/procesos', icon: Briefcase },
        { name: t('candidates'), href: '/empresa/candidatos', icon: Users },
        { name: t('history'), href: '/empresa/historial', icon: History },
      ],
      bottomItems: [
        { name: t('settings'), href: '/empresa/perfil', icon: Settings },
        { name: t('notifications'), href: '/empresa/notificaciones', icon: Bell },
      ],
    },
    admin: {
      label: t('dashboard'),
      items: [
        { name: t('dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('candidates'), href: '/admin/empresas', icon: Building2 },
        { name: t('jobs'), href: '/admin/solicitudes', icon: FileText },
        { name: t('candidates'), href: '/admin/candidatos', icon: Users },
        { name: t('candidates'), href: '/admin/reclutadores', icon: UserSearch },
        { name: t('history'), href: '/admin/historial', icon: History },
      ],
      bottomItems: [
        { name: t('settings'), href: '/admin/configuracion', icon: Settings },
      ],
    },
    candidato: {
      label: t('dashboard'),
      items: [
        { name: t('dashboard'), href: '/candidato/dashboard', icon: LayoutDashboard },
        { name: t('profile'), href: '/candidato/perfil', icon: Users },
        { name: t('jobs'), href: '/candidato/oportunidades', icon: BriefcaseIcon },
        { name: t('jobs'), href: '/candidato/postulaciones', icon: FileText },
        { name: t('jobs'), href: '/candidato/entrevistas', icon: Calendar },
        { name: t('jobs'), href: '/candidato/documentos', icon: FolderOpen },
      ],
      bottomItems: [
        { name: t('notifications'), href: '/candidato/notificaciones', icon: Bell },
      ],
    },
  }

  const config = navigationConfig[role]

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Logo variant="light" />
        <span className="text-xs text-slate-400 mt-2 block uppercase tracking-wider">{config.label}</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {config.items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-800">
        {config.bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
            {item.name === t('notifications') && notificationCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </Link>
        ))}

        {user && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-600 text-white text-sm">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <button className="text-slate-400 hover:text-white">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
