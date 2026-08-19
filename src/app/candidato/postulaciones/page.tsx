import { Badge } from '@/components/ui/badge'

const applications = [
  { company: 'Acme Corp', title: 'Desarrollador Senior', date: '18 Ago', status: 'reviewed' },
  { company: 'TechCo', title: 'Account Manager', date: '15 Ago', status: 'shortlisted' },
  { company: 'GlobalInc', title: 'Designer UX', date: '20 Ago', status: 'suggested' },
]

const statusColors: Record<string, string> = {
  suggested: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-slate-100 text-slate-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  interviewed: 'bg-purple-100 text-purple-700',
}

const statusLabels: Record<string, string> = {
  suggested: 'Enviada',
  reviewed: 'Revisada',
  shortlisted: 'Preseleccionado',
  interviewed: 'Entrevistado',
}

export default function PostulacionesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mis postulaciones</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Empresa</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Cargo</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Fecha</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{app.company}</td>
                <td className="p-4 text-sm text-slate-600">{app.title}</td>
                <td className="p-4 text-sm text-slate-600">{app.date}</td>
                <td className="p-4"><Badge className={statusColors[app.status]}>{statusLabels[app.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
