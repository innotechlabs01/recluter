'use client'

import { cn } from '@/lib/utils'

const steps = [
  { num: 1, label: 'Empresa' },
  { num: 2, label: 'Posición' },
  { num: 3, label: 'Perfil' },
  { num: 4, label: 'Condiciones' },
  { num: 5, label: 'Proceso' },
  { num: 6, label: 'Resumen' },
]

interface StepperProps {
  currentStep: number
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step.num <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              )}
            >
              {step.num}
            </div>
            <span
              className={cn(
                'text-sm',
                step.num <= currentStep
                  ? 'text-blue-600 font-medium'
                  : 'text-slate-500'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-0.5 bg-slate-200 mx-1" />
          )}
        </div>
      ))}
    </div>
  )
}
