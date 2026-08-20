'use client'


import { useTranslations } from 'next-intl'

const candidates = [
  { name: 'Juan Pérez', experience: '8 años de experiencia', skills: ['React', 'Node.js', 'TypeScript'], status: 'shortlisted' as const },
  { name: 'María López', experience: '6 años de experiencia', skills: ['Python', 'ML', 'AWS'], status: 'interviewed' as const },
  { name: 'Carlos Rodríguez', experience: '10 años de experiencia', skills: ['Java', 'Spring', 'AWS'], status: 'selected' as const },
  { name: 'Ana García', experience: '5 años de experiencia', skills: ['React', 'Vue', 'CSS'], status: 'reviewed' as const },
]

export default function CandidatosPage() {
  const t = useTranslations('empresa.candidates')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.name} className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
            <p className="text-sm text-slate-600">{candidate.experience}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
