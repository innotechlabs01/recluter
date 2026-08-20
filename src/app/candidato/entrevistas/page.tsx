'use client'


import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const interviews = [
  { company: 'Acme Corp', title: 'Desarrollador Senior', date: '25 Ago 2026', time: '10:00 AM', type: 'Virtual', status: 'upcoming' },
  { company: 'TechCo', title: 'Account Manager', date: '28 Ago 2026', time: '2:00 PM', type: 'Presencial', status: 'upcoming' },
]

export default function EntrevistasPage() {
  const t = useTranslations('candidato.interviews')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900">{interview.title}</h3>
                <Badge className="bg-blue-100 text-blue-700">
                  {interview.type === 'Virtual' ? t('virtual') : t('presential')}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-1">{interview.company}</p>
              <div className="flex gap-4 text-sm text-slate-500 mt-3">
                <span>📅 {interview.date}</span>
                <span>🕐 {interview.time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
