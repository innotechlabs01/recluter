'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale}>
      {locale === 'es' ? 'EN' : 'ES'}
    </Button>
  )
}
