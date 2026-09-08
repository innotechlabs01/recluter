'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PublicApplyForm({ jobId, shareToken }: { jobId: string; shareToken: string }) {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setMessage('No se pudo enviar la postulación')
        return
      }
      // Persist pending job so registration can auto-apply + auto-role candidato.
      document.cookie = `pending_job_token=${shareToken}; path=/; max-age=86400; samesite=lax`
      try {
        localStorage.setItem('pending_job_token', shareToken)
      } catch {
        // Ignore storage errors (private mode).
      }
      setMessage('Postulación enviada. Creá tu cuenta para seguir el estado.')
      router.push(`/sign-up?job=${jobId}`)
    } catch {
      setMessage('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-lg border space-y-3">
      <h2 className="font-semibold text-slate-900">Postularse</h2>
      <div className="grid grid-cols-1 gap-2">
        <Input
          placeholder="Nombre"
          aria-label="Nombre"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <Input
          placeholder="Apellido"
          aria-label="Apellido"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <Input
          placeholder="Email"
          aria-label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar postulación'}
      </Button>
      <p className="text-xs text-slate-500">
        Al registrarte como candidato quedás con auto-rol candidato y tu postulación se asocia a esta oferta.
      </p>
    </form>
  )
}
