import { StatCard } from '@/components/dashboard/stat-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EmpresaDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, Acme Corp</h1>
        <p className="text-slate-600">Resumen de tus procesos de reclutamiento</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value={3} label="Procesos activos" color="blue" />
        <StatCard value={12} label="Candidatos recibidos" color="green" />
        <StatCard value={2} label="Entrevistas pendientes" color="yellow" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Procesos activos</h2>
          <Link href="/empresa/solicitar/1">
            <Button>+ Buscar personal</Button>
          </Link>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="font-medium">Desarrollador Senior</div>
          <div className="text-sm text-slate-600">Búsqueda activa • María García</div>
          <div className="text-xs text-blue-600 mt-1">En progreso</div>
        </div>
      </div>
    </div>
  )
}
