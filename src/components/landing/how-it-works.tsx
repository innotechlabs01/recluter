const steps = [
  { num: '1', title: 'Creás tu solicitud', description: 'Completá el wizard con los requisitos del puesto' },
  { num: '2', title: 'Nosotros buscamos', description: 'Nuestro equipo de reclutamiento busca candidatos' },
  { num: '3', title: 'Recibís candidatos', description: 'Evaluá perfiles y CVs de candidatos preseleccionados' },
  { num: '4', title: 'Contratás al mejor', description: 'Elegí y contratá al candidato ideal para tu empresa' },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Cómo Funciona</h2>
        <p className="text-center text-slate-600 mb-12">En 4 simples pasos tenés al talento que necesitás</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">{step.num}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
