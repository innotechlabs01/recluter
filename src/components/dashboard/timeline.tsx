const events = [
  { date: '18 Ago 10:30', title: 'Solicitud creada', description: 'Solicitud de Desarrollador Senior recibida', type: 'created' },
  { date: '19 Ago 09:00', title: 'Solicitud aprobada', description: 'Requisitos validados por equipo administrativo', type: 'approved' },
  { date: '19 Ago 14:30', title: 'Asignada a María García', description: 'Reclutador asignado', type: 'assigned' },
  { date: '20 Ago 11:00', title: 'Búsqueda iniciada', description: 'Se comenzó la búsqueda en bases de datos', type: 'searching' },
  { date: '23 Ago 16:00', title: '5 candidatos encontrados', description: 'Primer lote de candidatos preseleccionados', type: 'candidates' },
  { date: '24 Ago 10:00', title: 'Candidatos enviados', description: '5 candidatos presentados al cliente', type: 'sent' },
]

const dotColors: Record<string, string> = {
  created: 'bg-slate-400',
  approved: 'bg-green-500',
  assigned: 'bg-blue-500',
  searching: 'bg-blue-500',
  candidates: 'bg-yellow-500',
  sent: 'bg-green-500',
}

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
      <div className="space-y-6">
        {events.map((event, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className={`w-8 h-8 rounded-full ${dotColors[event.type]} flex items-center justify-center z-10`}>
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="flex-1 pb-6">
              <div className="text-xs text-slate-500 mb-1">{event.date}</div>
              <h4 className="font-medium text-slate-900">{event.title}</h4>
              <p className="text-sm text-slate-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
