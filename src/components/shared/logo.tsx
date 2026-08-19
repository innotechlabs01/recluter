import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'light'
}

export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className={cn('text-xl font-bold', variant === 'light' ? 'text-white' : 'text-slate-900')}>
        Recluter
      </span>
      <span className="w-2 h-2 rounded-full bg-blue-600" />
    </Link>
  )
}
