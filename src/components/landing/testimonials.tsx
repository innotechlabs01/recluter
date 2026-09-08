'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  authorName: string
  authorRole: string
  companyName: string
  quote: string
  rating: number
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/testimonials?status=approved&limit=6')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los testimonios')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setTestimonials(data as Testimonial[])
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Empresas que ya confiaron en nosotros
        </p>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border animate-pulse h-48" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-slate-500">Todavía no hay testimonios aprobados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {testimonial.authorName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.authorName}</p>
                    <p className="text-sm text-slate-500">
                      {testimonial.authorRole}, {testimonial.companyName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
