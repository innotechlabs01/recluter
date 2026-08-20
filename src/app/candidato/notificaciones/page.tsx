'use client'

import { useTranslations } from 'next-intl'

const notifications = [
  { title: 'CV revisado', message: 'Acme Corp revisó tu perfil para la posición de Desarrollador Senior', time: 'Hace 2 horas', read: false },
  { title: 'Entrevista programada', message: 'Tu entrevista con Acme Corp está confirmada para el 25 de Agosto', time: 'Hace 1 día', read: true },
  { title: 'Postulación recibida', message: 'TechCo recibió tu postulación para Account Manager', time: 'Hace 3 días', read: true },
]

export default function NotificacionesPage() {
  const t = useTranslations('candidato.notifications')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <div key={i} className={`bg-white p-4 rounded-lg border ${!notif.read ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-slate-900">{notif.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
              </div>
              <span className="text-xs text-slate-500">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
