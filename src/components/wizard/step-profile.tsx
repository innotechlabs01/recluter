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

export function StepProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Perfil del candidato
        </h3>
        <p className="text-sm text-slate-600">
          Definí las características que debe tener la persona
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minExperience">
            Experiencia mínima (años) *
          </Label>
          <Input
            id="minExperience"
            type="number"
            placeholder="3"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Nivel de inglés *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Básico</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
              <SelectItem value="native">Nativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="education">Formación académica</Label>
          <Input
            id="education"
            placeholder="Ej: Licenciatura en Sistemas, Ingeniería de Software"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="certifications">Certificaciones</Label>
          <Input
            id="certifications"
            placeholder="Ej: AWS Certified, PMP, Scrum Master"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="techSkills">Conocimientos técnicos *</Label>
          <Textarea
            id="techSkills"
            placeholder="Ej: React, Node.js, PostgreSQL, TypeScript, Git"
            rows={3}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="softSkills">Habilidades blandas</Label>
          <Textarea
            id="softSkills"
            placeholder="Ej: Comunicación, trabajo en equipo, liderazgo"
            rows={2}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mandatoryReqs">Requisitos obligatorios</Label>
          <Textarea
            id="mandatoryReqs"
            placeholder="Requisitos que el candidato DEBE cumplir"
            rows={2}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="desirableReqs">Requisitos deseables</Label>
          <Textarea
            id="desirableReqs"
            placeholder="Requisitos que serían un plus"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}
