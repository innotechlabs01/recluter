'use client'

import { useWizardStore } from '@/hooks/use-wizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function StepCompany() {
  const { data, updateData } = useWizardStore()

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
          <Input 
            id="companyName" 
            placeholder="Ej: Acme Corp"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industria *</Label>
          <Input 
            id="industry" 
            placeholder="Seleccionar industria"
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input 
            id="location" 
            placeholder="Ciudad, País"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Persona de contacto *</Label>
          <Input 
            id="contactName" 
            placeholder="Nombre completo"
            value={data.contactName}
            onChange={(e) => updateData({ contactName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactRole">Cargo *</Label>
          <Input 
            id="contactRole" 
            placeholder="Ej: CEO, HR Manager"
            value={data.contactRole}
            onChange={(e) => updateData({ contactRole: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email corporativo *</Label>
          <Input 
            id="contactEmail" 
            type="email" 
            placeholder="email@empresa.com"
            value={data.contactEmail}
            onChange={(e) => updateData({ contactEmail: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
