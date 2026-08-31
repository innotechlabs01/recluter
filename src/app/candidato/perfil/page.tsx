'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { candidateProfileSchema, type CandidateProfileInput } from '@/lib/validations/profile'

export default function PerfilPage() {
  const { user, isLoaded } = useUser()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
      experience: '',
      skills: '',
    },
  })

  const onSubmit = async (values: CandidateProfileInput) => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/candidato/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil guardado correctamente' })
      } else {
        setMessage({ type: 'error', text: 'No se pudo guardar el perfil. Intentá de nuevo.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar el perfil' })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-64 bg-slate-200 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.emailAddresses?.[0]?.emailAddress || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" {...register('phone')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experiencia profesional</Label>
              <Textarea
                id="experience"
                rows={4}
                placeholder="Describí tu experiencia..."
                {...register('experience')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades</Label>
              <Input
                id="skills"
                placeholder="Ej: React, Node.js, TypeScript..."
                {...register('skills')}
              />
            </div>

            {message && (
              <p
                className={`text-sm p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'text-green-700 bg-green-50'
                    : 'text-red-700 bg-red-50'
                }`}
                data-testid="profile-message"
              >
                {message.text}
              </p>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
