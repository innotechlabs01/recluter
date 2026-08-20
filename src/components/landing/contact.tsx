'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function Contact() {
  const t = useTranslations('landing.contact')

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-8">{t('subtitle')}</p>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" placeholder={t('name')} />
          </div>
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" placeholder={t('email')} />
          </div>
          <div>
            <Label htmlFor="message">{t('message')}</Label>
            <Textarea id="message" placeholder={t('message')} rows={4} />
          </div>
          <Button type="submit" className="w-full">
            {t('send')}
          </Button>
        </form>
      </div>
    </section>
  )
}
