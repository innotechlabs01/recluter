import { Timeline } from '@/components/dashboard/timeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProcessDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Desarrollador Senior</h1>
          <p className="text-slate-600">Reclutador: María García</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">Búsqueda activa</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Timeline del proceso</h2>
          <Timeline />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen</h2>
          <div className="bg-white p-4 rounded-lg border space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Posiciones:</span><span className="font-medium">1</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Salario:</span><span className="font-medium">$2,000 - $3,000 USD</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Modalidad:</span><span className="font-medium">Remoto</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Candidatos:</span><span className="font-medium">5 encontrados</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Enviados:</span><span className="font-medium">3 al cliente</span></div>
          </div>
          <Link href="/empresa/candidatos" className="block mt-4">
            <Button variant="outline" className="w-full">Ver candidatos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
