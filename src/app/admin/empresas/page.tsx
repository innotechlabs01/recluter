import { Badge } from '@/components/ui/badge'

const companies = [
  { name: 'Acme Corp', industry: 'Tecnología', location: 'New York, US', users: 5, requests: 8, status: 'active' },
  { name: 'TechCo', industry: 'SaaS', location: 'San Francisco, US', users: 3, requests: 5, status: 'active' },
  { name: 'GlobalInc', industry: 'Consultoría', location: 'Miami, US', users: 8, requests: 12, status: 'active' },
]

export default function EmpresasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
        <p className="text-slate-600">Gestión de empresas registradas</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Empresa</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Industria</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Ubicación</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Usuarios</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Solicitudes</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.name} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-medium text-slate-900">{company.name}</td>
                <td className="p-4 text-sm text-slate-600">{company.industry}</td>
                <td className="p-4 text-sm text-slate-600">{company.location}</td>
                <td className="p-4 text-sm text-slate-600">{company.users}</td>
                <td className="p-4 text-sm text-slate-600">{company.requests}</td>
                <td className="p-4"><Badge className="bg-green-100 text-green-700">Activa</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
