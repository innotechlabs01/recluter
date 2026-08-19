import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'yellow'
}

const colorMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
}

export function StatCard({ value, label, color = 'blue' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={cn('text-3xl font-bold', colorMap[color])}>{value}</div>
        <div className="text-sm text-slate-600 mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}
