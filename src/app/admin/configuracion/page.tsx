'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Recruiter {
  id: string
  name: string
  email: string
  maxConcurrent?: number | null
}

export default function AdminConfigPage() {
  const t = useTranslations('admin.settings')
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/recruiters')
      .then((res) => (res.ok ? res.json() : []))
      .then(setRecruiters)
  }, [])

  const save = async (r: Recruiter) => {
    setSaving(r.id)
    await fetch(`/api/admin/recruiters/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxConcurrent: r.maxConcurrent }),
    })
    setSaving(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <p className="text-slate-600">{t('subtitle')}</p>
      <div className="bg-white rounded-lg border divide-y">
        {recruiters.map((r) => (
          <div key={r.id} className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-slate-900">{r.name}</p>
              <p className="text-sm text-slate-500">{r.email}</p>
            </div>
            <label className="text-sm text-slate-600">Capacidad máx.</label>
            <Input
              type="number"
              min={1}
              className="w-24"
              value={r.maxConcurrent ?? 5}
              onChange={(e) =>
                setRecruiters((prev) =>
                  prev.map((x) => (x.id === r.id ? { ...x, maxConcurrent: Number(e.target.value) } : x))
                )
              }
            />
            <Button size="sm" disabled={saving === r.id} onClick={() => save(r)}>
              Guardar
            </Button>
          </div>
        ))}
        {recruiters.length === 0 && <p className="p-4 text-sm text-slate-500">Sin reclutadores.</p>}
      </div>
    </div>
  )
}
