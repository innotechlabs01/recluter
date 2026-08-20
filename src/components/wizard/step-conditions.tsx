'use client'

import { useWizardStore } from '@/hooks/use-wizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function StepConditions() {
  const { data, updateData } = useWizardStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Condiciones laborales
        </h3>
        <p className="text-sm text-slate-600">
          Definí las condiciones de la posición
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Rango salarial mínimo</Label>
          <Input 
            id="salaryMin" 
            type="number" 
            placeholder="1000"
            value={data.salaryMin || ''}
            onChange={(e) => updateData({ salaryMin: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Rango salarial máximo</Label>
          <Input 
            id="salaryMax" 
            type="number" 
            placeholder="3000"
            value={data.salaryMax || ''}
            onChange={(e) => updateData({ salaryMax: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select 
            value={data.currency} 
            onValueChange={(value) => value && updateData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="COP">COP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de contratación</Label>
          <Select 
            value={data.contractType} 
            onValueChange={(value) => value && updateData({ contractType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nomina">Nómina directa</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule">Horario</Label>
          <Input 
            id="schedule" 
            placeholder="Ej: 9:00 AM - 6:00 PM"
            value={data.schedule}
            onChange={(e) => updateData({ schedule: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Zona horaria</Label>
          <Select 
            value={data.timezone} 
            onValueChange={(value) => value && updateData({ timezone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CET">CET (Europa)</SelectItem>
              <SelectItem value="EST">EST (East Coast)</SelectItem>
              <SelectItem value="CST">CST (Central)</SelectItem>
              <SelectItem value="PST">PST (West Coast)</SelectItem>
              <SelectItem value="COT">COT (Colombia)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="benefits">Beneficios</Label>
          <Textarea
            id="benefits"
            placeholder="Ej: Seguro médico, vacaciones pagas, bono anual"
            rows={3}
            value={data.benefits}
            onChange={(e) => updateData({ benefits: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="additionalInfo">Información adicional</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Cualquier otro requisito no contemplado"
            rows={3}
            value={data.additionalInfo}
            onChange={(e) => updateData({ additionalInfo: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
