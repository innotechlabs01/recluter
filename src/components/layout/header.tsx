'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/shared/logo'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { Button } from '@/components/ui/button'

export function Header() {
  const t = useTranslations('nav')

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/como-funciona" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {t('howItWorks')}
          </Link>
          <Link href="/beneficios" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {t('benefits')}
          </Link>
          <Link href="/faq" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {t('faq')}
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {t('contact')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">{t('login')}</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">{t('requestPersonnel')}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
