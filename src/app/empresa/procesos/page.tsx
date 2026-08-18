import { ProcessList } from '@/components/dashboard/process-list'

export default function ProcesosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis procesos</h1>
        <p className="text-slate-600">Seguimiento de todas tus solicitudes de personal</p>
      </div>
      <ProcessList />
    </div>
  )
}
