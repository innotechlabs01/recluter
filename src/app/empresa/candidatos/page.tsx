import { CandidateCard } from '@/components/dashboard/candidate-card'

const candidates = [
  { name: 'Juan Pérez', experience: '8 años de experiencia', skills: ['React', 'Node.js', 'TypeScript'], status: 'shortlisted' as const },
  { name: 'María López', experience: '6 años de experiencia', skills: ['Python', 'ML', 'AWS'], status: 'interviewed' as const },
  { name: 'Carlos Rodríguez', experience: '10 años de experiencia', skills: ['Java', 'Spring', 'AWS'], status: 'selected' as const },
  { name: 'Ana García', experience: '5 años de experiencia', skills: ['React', 'Vue', 'CSS'], status: 'reviewed' as const },
]

export default function CandidatosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Candidatos</h1>
        <p className="text-slate-600">Candidatos asociados a tus procesos de selección</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.name} {...candidate} />
        ))}
      </div>
    </div>
  )
}
