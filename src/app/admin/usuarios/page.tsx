'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

interface UserRole {
  id: string
  clerkUserId: string
  role: string
  status: string
  assignedBy: string | null
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  recruiter: 'Reclutador',
  company: 'Empresa',
  candidate: 'Candidato',
}

const STATUS_LABELS: Record<string, string> = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
}

const STATUS_COLORS: Record<string, string> = {
  approved: 'text-green-600 bg-green-50',
  pending: 'text-yellow-600 bg-yellow-50',
  rejected: 'text-red-600 bg-red-50',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ clerkUserId: '', role: 'recruiter' })

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('fetch failed')
      setUsers(await res.json())
    } catch {
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al crear usuario')
        return
      }
      setNewUser({ clerkUserId: '', role: 'recruiter' })
      await fetchUsers()
    } catch {
      setError('Error de red')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este rol de usuario?')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) await fetchUsers()
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
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <p className="text-slate-600">Administrar roles y permisos de usuarios</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle>Asignar Rol a Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="clerkUserId">Clerk User ID</Label>
              <Input
                id="clerkUserId"
                value={newUser.clerkUserId}
                onChange={(e) => setNewUser({ ...newUser, clerkUserId: e.target.value })}
                placeholder="user_xxxxxxxxxxxx"
                required
              />
            </div>
            <div className="w-48">
              <Label>Rol</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => v && setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter">Reclutador</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                  <SelectItem value="candidate">Candidato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Asignar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users list */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No hay usuarios registrados.</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {user.clerkUserId}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[user.status] || ''}`}
                      >
                        {STATUS_LABELS[user.status] || user.status}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
