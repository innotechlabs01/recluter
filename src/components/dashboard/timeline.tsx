export interface ProcessEventItem {
  id: string
  eventType: string
  description?: string | null
  createdAt?: string | null
}

const dotColors: Record<string, string> = {
  created: 'bg-slate-400',
  approved: 'bg-green-500',
  assigned: 'bg-blue-500',
  searching: 'bg-blue-500',
  candidates: 'bg-yellow-500',
  candidates_sent: 'bg-green-500',
  sent: 'bg-green-500',
}

export function Timeline({ events = [] }: { events?: ProcessEventItem[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">Todavía no hay eventos en este proceso.</p>
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4 relative">
            <div className={`w-8 h-8 rounded-full ${dotColors[event.eventType] ?? 'bg-slate-400'} flex items-center justify-center z-10`}>
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="flex-1 pb-6">
              <div className="text-xs text-slate-500 mb-1">
                {event.createdAt ? new Date(event.createdAt).toLocaleString('es-AR') : event.eventType}
              </div>
              <h4 className="font-medium text-slate-900">{event.eventType}</h4>
              <p className="text-sm text-slate-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
