'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'


const candidates = [
  { name: 'Juan Pérez', email: 'juan@email.com', specialty: 'Desarrollo Full Stack', experience: '5 años', status: 'available', rating: 4.5 },
  { name: 'Laura Sánchez', email: 'laura@email.com', specialty: 'Marketing Digital', experience: '3 años', status: 'in_process', rating: 4.2 },
  { name: 'Pedro Ruiz', email: 'pedro@email.com', specialty: 'Diseño UX/UI', experience: '4 años', status: 'available', rating: 4.8 },
  { name: 'María López', email: 'maria@email.com', specialty: 'Ventas B2B', experience: '6 años', status: 'hired', rating: 4.0 },
]

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  in_process: 'bg-blue-100 text-blue-700',
  hired: 'bg-slate-100 text-slate-700',
}

export default function CandidatosPage() {
  const t = useTranslations('admin.candidates')

  const statusLabels: Record<string, string> = {
    available: t('available'),
    in_process: t('inProcess'),
    hired: t('hired'),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('name')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('email')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('specialty')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('experience')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('rating')}</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.email} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-medium text-slate-900">{candidate.name}</td>
                <td className="p-4 text-sm text-slate-600">{candidate.email}</td>
                <td className="p-4 text-sm text-slate-600">{candidate.specialty}</td>
                <td className="p-4 text-sm text-slate-600">{candidate.experience}</td>
                <td className="p-4 text-sm text-slate-600">{candidate.rating} ⭐</td>
                <td className="p-4"><Badge className={statusColors[candidate.status]}>{statusLabels[candidate.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
