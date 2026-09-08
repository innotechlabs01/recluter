'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Notification {
  id: string
  title: string
  message: string | null
  createdAt: string | null
  read: boolean | null
}

export default function NotificacionesPage() {
  const t = useTranslations('candidato.notifications')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/notifications')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las notificaciones')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setNotifications(data as Notification[])
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

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      {notifications.length === 0 ? (
        <p className="text-slate-500">No tenés notificaciones.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`bg-white p-4 rounded-lg border ${!notif.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900">{notif.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('es-AR') : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
