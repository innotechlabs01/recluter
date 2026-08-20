export function TrustLogos() {
  return (
    <section className="py-12 bg-white border-b">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider font-medium">
          Empresas que confían en nosotros
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {['Acme Corp', 'TechCo', 'GlobalInc', 'InnovateLab', 'StartupX'].map((name) => (
            <div key={name} className="text-2xl font-bold text-slate-400">{name}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
