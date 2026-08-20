'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface TokenData {
  authorName: string
  authorRole: string
  companyName: string
  jobRequestId: string
}

export default function TestimonioPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [quote, setQuote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [testimonialId, setTestimonialId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Token no válido')
      return
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setTokenData({
        authorName: payload.authorName,
        authorRole: payload.authorRole,
        companyName: payload.companyName,
        jobRequestId: payload.jobRequestId,
      })

      // Fetch testimonial ID by token
      fetch(`/api/testimonials?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) setTestimonialId(data[0].id)
        })
    } catch {
      setError('Token no válido')
    }
  }, [token])

  const handleSubmit = async () => {
    if (rating === 0 || quote.length < 10) {
      setError('Por favor completá todos los campos')
      return
    }
    if (!testimonialId) {
      setError('Testimonial no encontrado')
      return
    }

    setLoading(true)
    setError('')

    try {
      await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, rating }),
      })
      setSubmitted(true)
    } catch {
      setError('Error al enviar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias!</h1>
          <p className="text-slate-600">
            Tu testimonio fue enviado y será revisado antes de publicarse.
          </p>
        </div>
      </div>
    )
  }

  if (error && !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Token no válido</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-lg mx-auto p-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">Testimonio</Badge>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ¿Cómo fue tu experiencia?
          </h1>
          <p className="text-slate-600">
            {tokenData?.companyName} — Tu opinión nos ayuda a mejorar
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {tokenData?.authorName?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-900">{tokenData?.authorName}</p>
              <p className="text-sm text-slate-500">{tokenData?.authorRole}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tu testimonio
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Contanos sobre tu experiencia con Recluter..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Mínimo 10 caracteres ({quote.length}/500)
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || quote.length < 10}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Enviar testimonio'}
          </Button>
        </div>
      </div>
    </div>
  )
}
