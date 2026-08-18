import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function Contact() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Contacto</h2>
        <p className="text-center text-slate-600 mb-8">¿Tenés preguntas? Escribinos</p>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Tu nombre" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" />
          </div>
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" placeholder="Tu mensaje..." rows={4} />
          </div>
          <Button type="submit" className="w-full">
            Enviar mensaje
          </Button>
        </form>
      </div>
    </section>
  )
}
