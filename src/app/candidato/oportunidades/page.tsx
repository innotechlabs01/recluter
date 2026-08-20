'use client'


import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const opportunities = [
  { company: 'Acme Corp', title: 'Desarrollador Senior', salary: '$2,500 - $3,500 USD', mode: 'Remoto', skills: ['React', 'Node.js'] },
  { company: 'TechCo', title: 'Account Manager', salary: '$2,000 - $3,000 USD', mode: 'Híbrido', skills: ['Ventas', 'CRM'] },
]

export default function OportunidadesPage() {
  const t = useTranslations('candidato.opportunities')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp, i) => (
          <Card key={i} className="hover:border-blue-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                <Badge variant="secondary">{opp.mode}</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-1">{opp.company}</p>
              <p className="text-sm text-green-600 font-medium mb-3">{opp.salary}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {opp.skills.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
              </div>
              <Button size="sm" className="w-full">{t('apply')}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
