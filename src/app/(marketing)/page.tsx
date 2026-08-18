import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Encuentra al talento que tu empresa necesita
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Recluter conecta empresas con profesionales calificados de manera rápida y eficiente.
          Simplifica tu proceso de reclutamiento con nuestra plataforma inteligente.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/sign-up">
            <Button size="lg">Solicitar personal</Button>
          </Link>
          <Link href="/como-funciona">
            <Button variant="outline" size="lg">Cómo funciona</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
