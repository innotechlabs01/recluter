'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const currentPath = pathname
    if (currentPath.startsWith('/en')) {
      router.push(currentPath.replace('/en', '/es') || '/')
    } else {
      router.push('/en' + currentPath)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale}>
      {pathname.startsWith('/en') ? 'ES' : 'EN'}
    </Button>
  )
}
