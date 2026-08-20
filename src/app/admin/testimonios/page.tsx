'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Trash2, Star } from 'lucide-react'

interface Testimonial {
  id: string
  authorName: string
  authorRole: string
  companyName: string
  quote: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function AdminTestimoniosPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setTestimonials(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchTestimonials()
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    fetchTestimonials()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Testimonios</h1>
        <p className="text-slate-600">Gestiona los testimonios de tus clientes</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-slate-500">No hay testimonios ainda</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 text-sm font-medium text-slate-600">Autor</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Empresa</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Rating</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Testimonio</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{t.authorName}</p>
                    <p className="text-xs text-slate-500">{t.authorRole}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{t.companyName}</td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                    {t.quote || <span className="italic text-slate-400">Sin testimonio</span>}
                  </td>
                  <td className="p-4">
                    <Badge className={statusColors[t.status]}>{t.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {t.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(t.id, 'approved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(t.id, 'rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTestimonial(t.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
