'use client'

import { useParams, useRouter } from 'next/navigation'
import { Stepper } from '@/components/wizard/stepper'
import { StepCompany } from '@/components/wizard/step-company'
import { StepPosition } from '@/components/wizard/step-position'
import { StepProfile } from '@/components/wizard/step-profile'
import { StepConditions } from '@/components/wizard/step-conditions'
import { StepSelection } from '@/components/wizard/step-selection'
import { StepReview } from '@/components/wizard/step-review'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const steps: Record<number, { component: React.ComponentType; title: string }> = {
  1: { component: StepCompany, title: 'Información de la empresa' },
  2: { component: StepPosition, title: 'Posición requerida' },
  3: { component: StepProfile, title: 'Perfil del candidato' },
  4: { component: StepConditions, title: 'Condiciones laborales' },
  5: { component: StepSelection, title: 'Proceso de selección' },
  6: { component: StepReview, title: 'Revisión y confirmación' },
}

export default function WizardStepPage() {
  const params = useParams()
  const router = useRouter()
  const step = Number(params.step)
  const current = steps[step] || steps[1]
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
