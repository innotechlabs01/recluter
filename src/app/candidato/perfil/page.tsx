import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
      <Card>
        <CardHeader><CardTitle>Información personal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nombre</Label><Input defaultValue="Juan" /></div>
            <div className="space-y-2"><Label>Apellido</Label><Input defaultValue="Pérez" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="juan@email.com" /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input defaultValue="+57 300 123 4567" /></div>
          </div>
          <div className="space-y-2"><Label>Experiencia profesional</Label><Textarea rows={4} placeholder="Describí tu experiencia..." /></div>
          <div className="space-y-2"><Label>Habilidades</Label><Input placeholder="React, Node.js, TypeScript..." /></div>
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>
    </div>
  )
}
