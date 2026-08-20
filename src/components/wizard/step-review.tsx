'use client'

import { useWizardStore } from '@/hooks/use-wizard'

export function StepReview() {
  const { data } = useWizardStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Revisión y confirmación
        </h3>
        <p className="text-sm text-slate-600">
          Revisá la información antes de enviar la solicitud
        </p>
      </div>
      <div className="bg-slate-50 p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-700">Empresa:</span>{' '}
            <span className="text-slate-600">{data.companyName || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Industria:</span>{' '}
            <span className="text-slate-600">{data.industry || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Cargo:</span>{' '}
            <span className="text-slate-600">{data.positionTitle || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Cantidad:</span>{' '}
            <span className="text-slate-600">{data.positionsCount || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Experiencia:</span>{' '}
            <span className="text-slate-600">{data.experienceLevel || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Modalidad:</span>{' '}
            <span className="text-slate-600">{data.workMode || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Salario:</span>{' '}
            <span className="text-slate-600">
              {data.salaryMin && data.salaryMax
                ? `$${data.salaryMin} - $${data.salaryMax} ${data.currency}`
                : '—'}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Horario:</span>{' '}
            <span className="text-slate-600">{data.schedule || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Skills:</span>{' '}
            <span className="text-slate-600">{data.technicalSkills || '—'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Inglés:</span>{' '}
            <span className="text-slate-600">{data.englishLevel || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
