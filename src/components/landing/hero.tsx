import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-slate-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Encontramos el talento perfecto para tu empresa en Colombia
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Conectamos empresas de Estados Unidos con profesionales calificados colombianos.
          Proceso transparente, rápido y sin riesgo hasta contratar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto">
              Solicitar personal
            </Button>
          </Link>
          <Link href="/como-funciona">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Cómo funciona
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
