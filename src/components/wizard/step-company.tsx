import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function StepCompany() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Información de la empresa
        </h3>
        <p className="text-sm text-slate-600">
          Datos básicos de la empresa para la solicitud
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la empresa *</Label>
          <Input id="companyName" placeholder="Ej: Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industria *</Label>
          <Input id="industry" placeholder="Seleccionar industria" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input id="location" placeholder="Ciudad, País" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Persona de contacto *</Label>
          <Input id="contactName" placeholder="Nombre completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactRole">Cargo *</Label>
          <Input id="contactRole" placeholder="Ej: CEO, HR Manager" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email corporativo *</Label>
          <Input id="contactEmail" type="email" placeholder="email@empresa.com" />
        </div>
      </div>
    </div>
  )
}
