import { Badge } from '@/components/ui/badge'

const requests = [
  { id: '1', company: 'Acme Corp', title: 'Desarrollador Senior', date: '18 Ago', recruiter: 'María García', status: 'searching', candidates: 5 },
  { id: '2', company: 'TechCo', title: 'Account Manager', date: '15 Ago', recruiter: 'Carlos López', status: 'candidates_sent', candidates: 3 },
  { id: '3', company: 'GlobalInc', title: 'Designer UX', date: '20 Ago', recruiter: null, status: 'reviewing', candidates: 0 },
]

const statusColors: Record<string, string> = {
  reviewing: 'bg-yellow-100 text-yellow-700',
  searching: 'bg-blue-100 text-blue-700',
  candidates_sent: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  reviewing: 'En revisión',
  searching: 'Búsqueda activa',
  candidates_sent: 'Candidatos enviados',
}

export default function SolicitudesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
        <p className="text-slate-600">Todas las solicitudes de las empresas</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Empresa</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Cargo</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Fecha</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Reclutador</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Candidatos</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-medium text-slate-900">{req.company}</td>
                <td className="p-4 text-sm text-slate-600">{req.title}</td>
                <td className="p-4 text-sm text-slate-600">{req.date}</td>
                <td className="p-4 text-sm text-slate-600">{req.recruiter || 'Sin asignar'}</td>
                <td className="p-4 text-sm text-slate-600">{req.candidates}</td>
                <td className="p-4"><Badge className={statusColors[req.status]}>{statusLabels[req.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
