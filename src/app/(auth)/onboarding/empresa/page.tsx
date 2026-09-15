'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from '@/app/actions/complete-onboarding'

export default function EmpresaOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const industry = formData.get('industry') as string

    if (!name || !industry) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // TODO: Create company record in DB (Task 5)
    // For now, just assign the role
    const result = await completeOnboarding('company')
    if (result.success) {
      router.push('/empresa/dashboard')
    } else {
      setError('Error al completar el registro')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Crear empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la empresa</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="industry">Industria</Label>
            <Input id="industry" name="industry" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear empresa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
