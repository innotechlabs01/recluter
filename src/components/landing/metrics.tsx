export function Metrics() {
  const metrics = [
    { value: '500+', label: 'Candidatos contratados' },
    { value: '48h', label: 'Tiempo promedio de respuesta' },
    { value: '95%', label: 'Tasa de satisfacción' },
    { value: '50+', label: 'Empresas activas' },
  ]

  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-blue-100">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
