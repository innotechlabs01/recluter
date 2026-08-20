import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para encontrar tu talento ideal?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Comenzá hoy mismo y recibí candidatos calificados en menos de 48 horas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Crear cuenta gratis
            </Button>
          </a>
          <a href="#contacto">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Hablar con ventas
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
