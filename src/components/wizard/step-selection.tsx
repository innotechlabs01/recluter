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

export function StepSelection() {
  const { data, updateData } = useWizardStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Proceso de selección
        </h3>
        <p className="text-sm text-slate-600">
          Definí cómo querés que sea el proceso
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="candidatesCount">
            Cantidad de candidatos a recibir *
          </Label>
          <Input
            id="candidatesCount"
            type="number"
            placeholder="5"
            min="1"
            value={data.candidatesCount}
            onChange={(e) => updateData({ candidatesCount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Fecha límite</Label>
          <Input 
            id="deadline" 
            type="date"
            value={data.deadline}
            onChange={(e) => updateData({ deadline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interviewCount">Número de entrevistas</Label>
          <Input
            id="interviewCount"
            type="number"
            placeholder="2"
            min="1"
            value={data.interviewCount}
            onChange={(e) => updateData({ interviewCount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>¿Se requieren pruebas técnicas?</Label>
          <Select 
            value={data.technicalTests} 
            onValueChange={(value) => value && updateData({ technicalTests: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="processRequirements">
            Requisitos adicionales del proceso
          </Label>
          <Textarea
            id="processRequirements"
            placeholder="Ej: Prueba de código, presentación con el equipo, prueba de inglés"
            rows={3}
            value={data.processRequirements}
            onChange={(e) => updateData({ processRequirements: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
