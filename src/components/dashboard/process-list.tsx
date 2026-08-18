import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const processes = [
  { id: '1', title: 'Desarrollador Senior', status: 'searching', recruiter: 'María García', date: '18 Ago 2026', candidates: 5 },
  { id: '2', title: 'Account Manager', status: 'candidates_sent', recruiter: 'Carlos López', date: '15 Ago 2026', candidates: 3 },
  { id: '3', title: 'Designer UX', status: 'reviewing', recruiter: null, date: '20 Ago 2026', candidates: 0 },
]

const statusColors: Record<string, string> = {
  received: 'bg-slate-100 text-slate-700',
  reviewing: 'bg-yellow-100 text-yellow-700',
  searching: 'bg-blue-100 text-blue-700',
  candidates_sent: 'bg-green-100 text-green-700',
  interview: 'bg-purple-100 text-purple-700',
  hired: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-500',
}

const statusLabels: Record<string, string> = {
  received: 'Recibida',
  reviewing: 'En revisión',
  searching: 'Búsqueda activa',
  candidates_sent: 'Candidatos enviados',
  interview: 'Entrevista',
  hired: 'Contratado',
  closed: 'Cerrada',
}

export function ProcessList() {
  return (
    <div className="space-y-4">
      {processes.map((process) => (
        <Link key={process.id} href={`/empresa/procesos/${process.id}`}>
          <div className="bg-white p-4 rounded-lg border hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{process.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {process.recruiter ? `Reclutador: ${process.recruiter}` : 'Sin reclutador asignado'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Solicitud: {process.date}</p>
              </div>
              <div className="flex items-center gap-3">
                {process.candidates > 0 && (
                  <span className="text-sm text-slate-600">{process.candidates} candidatos</span>
                )}
                <Badge className={statusColors[process.status]}>{statusLabels[process.status]}</Badge>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
