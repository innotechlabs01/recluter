'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const notifications = [
  { title: 'Solicitud recibida', message: 'Tu solicitud de Desarrollador Senior fue recibida', time: 'Hace 2 horas', read: false },
  { title: 'Candidatos enviados', message: 'María García envió 3 candidatos para tu revisión', time: 'Hace 1 día', read: true },
  { title: 'Entrevista programada', message: 'Entrevista con Juan Pérez confirmada para mañana', time: 'Hace 2 días', read: true },
]

export default function EmpresaNotificacionesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <Card key={i} className={!notif.read ? 'border-l-4 border-l-blue-500' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900">{notif.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.read && <Badge className="bg-blue-100 text-blue-700">Nuevo</Badge>}
                  <span className="text-xs text-slate-500">{notif.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
