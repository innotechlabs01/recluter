'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

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
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">¿Cómo querés usar la plataforma?</h1>
        <p className="text-slate-600 mt-2">Seleccioná tu perfil para continuar</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => selectRole('company')}
          className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900">Soy empresa</h3>
          <p className="text-sm text-slate-600">Necesito contratar personal</p>
        </button>
        <button
          onClick={() => selectRole('candidate')}
          className="w-full p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900">Busco oportunidades laborales</h3>
          <p className="text-sm text-slate-600">Quiero encontrar trabajo</p>
        </button>
      </div>
    </div>
  )
}
