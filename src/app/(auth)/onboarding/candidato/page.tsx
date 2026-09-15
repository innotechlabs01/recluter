'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from '@/app/actions/complete-onboarding'

export default function CandidatoOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!firstName || !lastName) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // TODO: Create candidate record in DB (Task 5)
    // For now, just assign the role
    const result = await completeOnboarding('candidate')
    if (result.success) {
      router.push('/candidato/dashboard')
    } else {
      setError('Error al completar el registro')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Completar perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Completar registro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
