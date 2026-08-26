'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Search } from 'lucide-react'
import { setUserRole } from '@/app/actions/set-role'

export default function RoleSelectionPage() {
  const { isLoaded } = useUser()
  const [loading, setLoading] = useState(false)

  const selectRole = async (role: 'company' | 'candidate') => {
    if (loading || !isLoaded) return
    setLoading(true)
    try {
      // Server Action: stores role in cookie + updates Clerk metadata
      await setUserRole(role)
      // Full page navigation — middleware reads the cookie and redirects correctly
      window.location.href = role === 'company' ? '/empresa/dashboard' : '/candidato/dashboard'
    } catch (err) {
      console.error('[RoleSelection] Error:', err)
      setLoading(false)
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
          className={`cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group ${loading ? 'opacity-50 pointer-events-none' : ''}`}
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
                <p className="text-sm text-blue-600 mt-3 font-medium">
                  {loading ? 'Configurando...' : 'Crear solicitud de personal →'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group ${loading ? 'opacity-50 pointer-events-none' : ''}`}
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
                <p className="text-sm text-green-600 mt-3 font-medium">
                  {loading ? 'Configurando...' : 'Explorar oportunidades →'}
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
