import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CandidatoDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, Juan</h1>
        <p className="text-slate-600">Resumen de tus procesos de postulación</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value={3} label="Postulaciones activas" color="blue" />
        <StatCard value={1} label="Entrevistas pendientes" color="yellow" />
        <StatCard value={2} label="Oportunidades disponibles" color="green" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Próximas entrevistas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div><span className="font-medium">Acme Corp</span> — Desarrollador Senior</div>
                <span className="text-slate-500">25 Ago 10:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Últimas actualizaciones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm"><span className="font-medium text-green-600">CV revisado</span> — Acme Corp revisó tu perfil</div>
              <div className="text-sm"><span className="font-medium text-blue-600">Postulación enviada</span> — TechCo — Account Manager</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
