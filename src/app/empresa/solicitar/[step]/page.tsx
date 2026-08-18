'use client'

import { useParams, useRouter } from 'next/navigation'
import { Stepper } from '@/components/wizard/stepper'
import { StepCompany } from '@/components/wizard/step-company'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function WizardStepPage() {
  const params = useParams()
  const router = useRouter()
  const step = Number(params.step)

  const steps: Record<number, { component: React.ComponentType; title: string }> = {
    1: { component: StepCompany, title: 'Información de la empresa' },
  }

  const current = steps[step] || {
    component: () => (
      <div className="text-center py-12 text-slate-500">
        Paso {step} — Próximamente
      </div>
    ),
    title: `Paso ${step}`,
  }
  const CurrentStepComponent = current.component

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Nueva solicitud de personal
        </h1>
        <p className="text-slate-600">
          Paso {step} de 6 — {current.title}
        </p>
      </div>

      <Stepper currentStep={step} />

      <Card className="p-6">
        <CurrentStepComponent />
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() =>
            step > 1
              ? router.push(`/empresa/solicitar/${step - 1}`)
              : router.push('/empresa/dashboard')
          }
        >
          {step > 1 ? '← Atrás' : 'Cancelar'}
        </Button>
        <Button
          onClick={() =>
            step < 6
              ? router.push(`/empresa/solicitar/${step + 1}`)
              : alert('Solicitud enviada!')
          }
        >
          {step < 6 ? 'Siguiente →' : 'Enviar solicitud'}
        </Button>
      </div>
    </div>
  )
}
