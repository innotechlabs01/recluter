'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Building2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OnboardingCards() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Completá tu registro</h1>
        <p className="text-slate-500 mt-2">¿Cómo querés usar la plataforma?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          className="cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
          onClick={() => router.push('/onboarding/empresa')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Soy empresa</h3>
                <p className="text-slate-500 mt-1">Necesito contratar personal para mi equipo</p>
                <p className="text-sm text-blue-600 mt-3 font-medium">
                  Crear mi empresa →
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group"
          onClick={() => router.push('/onboarding/candidato')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Busco oportunidades laborales</h3>
                <p className="text-slate-500 mt-1">Quiero encontrar trabajo en empresas de Estados Unidos</p>
                <p className="text-sm text-green-600 mt-3 font-medium">
                  Completar mi perfil →
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-slate-500">
        Podés cambiar tu perfil más adelante desde la configuración
      </p>
    </div>
  )
}
