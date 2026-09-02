'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Recruiter = {
  id: string
  name: string
  email: string
  specialties: string[] | null
  isActive: boolean
  createdAt: string
}

export default function ReclutadoresPage() {
  const t = useTranslations('admin.recruiters')

  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [specialties, setSpecialties] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/admin/recruiters')
      if (!res.ok) throw new Error('fetch failed')
      setRecruiters((await res.json()) as Recruiter[])
    } catch {
      setError('No se pudieron cargar los reclutadores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/admin/recruiters')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.json()
      })
      .then((data) => setRecruiters(data as Recruiter[]))
      .catch(() => setError('No se pudieron cargar los reclutadores'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/recruiters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          specialties: specialties
            ? specialties.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
        }),
      })
      if (res.ok) {
        setName('')
        setEmail('')
        setSpecialties('')
        await load()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (recruiter: Recruiter) => {
    await fetch(`/api/admin/recruiters/${recruiter.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !recruiter.isActive }),
    })
    await load()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/recruiters/${id}`, { method: 'DELETE' })
    await load()
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-24 bg-slate-200 rounded-lg" />
        <div className="h-48 bg-slate-200 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg border space-y-4"
        data-testid="recruiter-form"
      >
        <h2 className="font-semibold text-slate-900">Nuevo reclutador</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialties">Especialidades (separadas por coma)</Label>
            <Input id="specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Agregar reclutador'}
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {recruiters.length === 0 && !error ? (
        <p className="text-sm text-slate-500">Todavía no hay reclutadores.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recruiters.map((recruiter) => (
            <div
              key={recruiter.id}
              className="bg-white p-6 rounded-lg border"
              data-testid="recruiter-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {recruiter.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{recruiter.name}</h3>
                  <p className="text-xs text-slate-500">{recruiter.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('specialty')}:</span>
                  <span>{recruiter.specialties?.join(', ') || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estado:</span>
                  <span
                    className={
                      recruiter.isActive ? 'text-green-600' : 'text-slate-400'
                    }
                  >
                    {recruiter.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant={recruiter.isActive ? 'secondary' : 'default'}
                  size="sm"
                  onClick={() => handleToggle(recruiter)}
                >
                  {recruiter.isActive ? 'Desactivar' : 'Activar'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(recruiter.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
