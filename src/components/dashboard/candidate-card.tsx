import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CandidateCardProps {
  name: string
  experience: string
  skills: string[]
  status: 'suggested' | 'reviewed' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected'
  id?: string
  email?: string
  firstName?: string
  lastName?: string
}

const statusColors = {
  suggested: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-slate-100 text-slate-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  interviewed: 'bg-purple-100 text-purple-700',
  selected: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const statusLabels = {
  suggested: 'Sugerido',
  reviewed: 'Revisado',
  shortlisted: 'Preseleccionado',
  interviewed: 'Entrevistado',
  selected: 'Seleccionado',
  rejected: 'Rechazado',
}

// Accepts real DB shapes: callers may pass firstName/lastName/email/id from
// /api/candidatos or /api/solicitudes/[id]/applications instead of a
// preformatted name. Falls back to `name` for backwards compatibility.
export function CandidateCard({
  name,
  experience,
  skills,
  status,
  email,
  firstName,
  lastName,
}: CandidateCardProps) {
  const displayName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : name
  const safeSkills = Array.isArray(skills) ? skills : []

  return (
    <Card className="hover:border-blue-300 transition-colors cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">{displayName}</h3>
            <p className="text-sm text-slate-600 mt-1">{experience}</p>
            {email && <p className="text-sm text-slate-500">{email}</p>}
            <div className="flex flex-wrap gap-1 mt-2">
              {safeSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
          <Badge className={cn(statusColors[status])}>{statusLabels[status]}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
