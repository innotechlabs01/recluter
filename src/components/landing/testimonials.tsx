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

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    authorName: 'Sarah Johnson',
    authorRole: 'CTO',
    companyName: 'TechCo',
    quote: 'Recluter nos ayudó a encontrar 3 desarrolladores senior en menos de 2 semanas. El proceso fue transparente y sin sorpresas.',
    rating: 5,
  },
  {
    id: '2',
    authorName: 'Michael Chen',
    authorRole: 'VP Engineering',
    companyName: 'GlobalInc',
    quote: 'La calidad del talento colombiano es excepcional. Ahora tenemos un equipo completo de 8 personas trabajando desde Colombia.',
    rating: 5,
  },
  {
    id: '3',
    authorName: 'Laura Martínez',
    authorRole: 'HR Director',
    companyName: 'InnovateLab',
    quote: 'Lo que más me gustó es que solo cobran cuando contratás. Sin riesgo, sin costos ocultos. Totalmente recomendado.',
    rating: 5,
  },
]

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)

  useEffect(() => {
    fetch('/api/testimonials?status=approved&limit=6')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setTestimonials(data)
      })
      .catch(() => {
        // Keep fallback testimonials
      })
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
      </div>
    </section>
  )
}
