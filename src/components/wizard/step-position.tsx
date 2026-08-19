import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function StepPosition() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Posición requerida
        </h3>
        <p className="text-sm text-slate-600">
          Detalles del puesto que necesitas cubrir
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="positionName">Nombre del cargo *</Label>
          <Input id="positionName" placeholder="Ej: Desarrollador Senior" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="positionCount">Cantidad de personas *</Label>
          <Input
            id="positionCount"
            type="number"
            placeholder="1"
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label>Área *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Tecnología</SelectItem>
              <SelectItem value="sales">Ventas</SelectItem>
              <SelectItem value="admin">Administración</SelectItem>
              <SelectItem value="support">Soporte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nivel de experiencia *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid-level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de posición *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fulltime">Tiempo completo</SelectItem>
              <SelectItem value="parttime">Medio tiempo</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Modalidad de trabajo *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remoto</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
              <SelectItem value="onsite">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="positionLocation">Ubicación</Label>
          <Input id="positionLocation" placeholder="Ciudad, País" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="positionStartDate">Fecha estimada de inicio</Label>
          <Input id="positionStartDate" type="date" />
        </div>
      </div>
    </div>
  )
}
