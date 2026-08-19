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
          <Input id="salaryMin" type="number" placeholder="1000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Rango salarial máximo</Label>
          <Input id="salaryMax" type="number" placeholder="3000" />
        </div>
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select defaultValue="usd">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="cop">COP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de contratación</Label>
          <Select>
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
          <Input id="schedule" placeholder="Ej: 9:00 AM - 6:00 PM" />
        </div>
        <div className="space-y-2">
          <Label>Zona horaria</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cet">CET (Europa)</SelectItem>
              <SelectItem value="est">EST (East Coast)</SelectItem>
              <SelectItem value="cst">CST (Central)</SelectItem>
              <SelectItem value="pst">PST (West Coast)</SelectItem>
              <SelectItem value="cot">COT (Colombia)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="benefits">Beneficios</Label>
          <Textarea
            id="benefits"
            placeholder="Ej: Seguro médico, vacaciones pagas, bono anual"
            rows={3}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="additionalInfo">Información adicional</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Cualquier otro requisito no contemplado"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
