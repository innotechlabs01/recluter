'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Search } from 'lucide-react'

export default function RoleSelectionPage() {
  const { user } = useUser()
  const router = useRouter()

  const selectRole = async (role: 'company' | 'candidate') => {
    await user?.update({ unsafeMetadata: { role } })
    if (role === 'company') {
      router.push('/empresa/dashboard')
    } else {
      router.push('/candidato/dashboard')
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Bienvenido a Recluter</h1>
        <p className="text-slate-500 mt-2">¿Cómo querés usar la plataforma?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card 
          className="cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
          onClick={() => selectRole('company')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Soy empresa</h3>
                <p className="text-slate-500 mt-1">Necesito contratar personal para mi equipo</p>
                <p className="text-sm text-blue-600 mt-3 font-medium">Crear solicitud de personal →</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group"
          onClick={() => selectRole('candidate')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Busco oportunidades laborales</h3>
                <p className="text-slate-500 mt-1">Quiero encontrar trabajo en empresas de Estados Unidos</p>
                <p className="text-sm text-green-600 mt-3 font-medium">Explorar oportunidades →</p>
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
