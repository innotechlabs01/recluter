'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { contactSchema, type ContactInput } from '@/lib/validations/profile'

export function Contact() {
  const t = useTranslations('landing.contact')
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  // Client-side success stub — no backend submission yet.
  const onSubmit = (values: ContactInput) => {
    // values validated by zod resolver; simulate a successful submission.
    void values
    setSubmitted(true)
  }

  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">{t('title')}</h2>
        <p className="text-center text-slate-600 mb-8">{t('subtitle')}</p>

        {submitted ? (
          <div
            className="text-center p-6 rounded-lg bg-green-50"
            data-testid="contact-success"
          >
            <p className="text-green-700 font-medium">
              ¡Gracias por tu mensaje! Te vamos a contactar a la brevedad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input id="name" placeholder={t('name')} {...register('name')} />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" placeholder={t('email')} {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="message">{t('message')}</Label>
              <Textarea
                id="message"
                placeholder={t('message')}
                rows={4}
                {...register('message')}
              />
              {errors.message && (
                <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {t('send')}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
