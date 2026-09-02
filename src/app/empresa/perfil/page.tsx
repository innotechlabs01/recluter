'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { empresaProfileSchema, type EmpresaProfileInput } from '@/lib/validations/profile'

export default function EmpresaPerfilPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpresaProfileInput>({
    resolver: zodResolver(empresaProfileSchema),
    defaultValues: {
      name: '',
      industry: '',
      location: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
  })

  const onSubmit = async (values: EmpresaProfileInput) => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/empresa/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil actualizado' })
      } else {
        setMessage({ type: 'error', text: 'No se pudo guardar el perfil. Intentá de nuevo.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar el perfil' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Perfil de la empresa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información de la empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la empresa</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industria</Label>
                <Input id="industry" {...register('industry')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" {...register('location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contacto principal</Label>
                <Input id="contactName" {...register('contactName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contacto</Label>
                <Input id="contactEmail" {...register('contactEmail')} />
                {errors.contactEmail && (
                  <p className="text-xs text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono</Label>
                <Input id="contactPhone" {...register('contactPhone')} />
              </div>
            </div>

            {message && (
              <p
                className={`text-sm p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'text-green-700 bg-green-50'
                    : 'text-red-700 bg-red-50'
                }`}
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
