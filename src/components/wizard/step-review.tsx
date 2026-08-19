export function StepReview() {
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
            <span className="font-medium text-slate-700">Cargo:</span>{' '}
            <span className="text-slate-600">—</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Cantidad:</span>{' '}
            <span className="text-slate-600">—</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">
              Experiencia:
            </span>{' '}
            <span className="text-slate-600">—</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Salario:</span>{' '}
            <span className="text-slate-600">—</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">
              Modalidad:
            </span>{' '}
            <span className="text-slate-600">—</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Horario:</span>{' '}
            <span className="text-slate-600">—</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Los datos se mostrarán aquí una vez completados los pasos
          anteriores.
        </p>
      </div>
    </div>
  )
}
