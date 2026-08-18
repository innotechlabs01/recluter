import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type HistoryStatus = 'hired' | 'closed' | 'cancelled'

interface HistoryItem {
  id: string
  title: string
  date: string
  closed: string
  status: HistoryStatus
  time: string
}

const history: HistoryItem[] = [
  { id: '1', title: 'Desarrollador Frontend', date: '01 Jul 2026', closed: '15 Jul 2026', status: 'hired', time: '14 días' },
  { id: '2', title: 'Project Manager', date: '10 Jun 2026', closed: '28 Jun 2026', status: 'closed', time: '18 días' },
  { id: '3', title: 'DevOps Engineer', date: '01 May 2026', closed: '20 May 2026', status: 'hired', time: '19 días' },
  { id: '4', title: 'QA Tester', date: '15 Abr 2026', closed: '30 Abr 2026', status: 'cancelled', time: '15 días' },
]

const statusColors: Record<HistoryStatus, string> = {
  hired: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels = {
  hired: 'Contratado',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
}

export default function HistorialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Historial</h1>
        <p className="text-slate-600">Todos tus procesos anteriores</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Cargo</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Fecha solicitud</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Fecha cierre</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Tiempo</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-medium text-slate-900">{item.title}</td>
                <td className="p-4 text-sm text-slate-600">{item.date}</td>
                <td className="p-4 text-sm text-slate-600">{item.closed}</td>
                <td className="p-4 text-sm text-slate-600">{item.time}</td>
                <td className="p-4">
                  <Badge className={cn(statusColors[item.status])}>{statusLabels[item.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
