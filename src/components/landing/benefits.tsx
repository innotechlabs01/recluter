const benefits = [
  { icon: '✅', title: 'Talento verificado', description: 'Candidatos preseleccionados y evaluados por nuestro equipo' },
  { icon: '✅', title: 'Proceso transparente', description: 'Seguimiento en tiempo real de cada paso del proceso' },
  { icon: '✅', title: 'Sin riesgo', description: 'Solo cobramos cuando contratás al candidato' },
  { icon: '✅', title: 'Talento colombiano', description: 'Profesionales altamente calificados en Latinoamérica' },
]

export function Benefits() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">¿Por qué elegirnos?</h2>
        <p className="text-center text-slate-600 mb-12">Ventajas de trabajar con nuestro equipo de reclutamiento</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <span className="text-2xl">{benefit.icon}</span>
              <h3 className="font-semibold text-slate-900 mt-4 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
