import { StatCard } from '@/components/dashboard/stat-card'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrativo</h1>
        <p className="text-slate-600">Vista global de la plataforma</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard value={12} label="Empresas registradas" color="blue" />
        <StatCard value={28} label="Solicitudes activas" color="green" />
        <StatCard value={156} label="Candidatos en pool" color="yellow" />
        <StatCard value={8} label="Reclutadores activos" color="blue" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Solicitudes recientes</h2>
          <div className="space-y-3">
            {['Desarrollador Senior - Acme Corp', 'Account Manager - TechCo', 'Designer UX - GlobalInc'].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item}</span>
                <span className="text-xs text-slate-500">Hace {i + 1} día</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Métricas</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Tiempo promedio de contratación:</span><span className="font-medium">18 días</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Tasa de éxito:</span><span className="font-medium">85%</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Solicitudes este mes:</span><span className="font-medium">28</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
