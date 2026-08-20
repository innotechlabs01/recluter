export function TrustLogos() {
  const logos = [
    { name: 'Acme Corp', width: 'w-28' },
    { name: 'TechCo', width: 'w-24' },
    { name: 'GlobalInc', width: 'w-32' },
    { name: 'InnovateLab', width: 'w-36' },
    { name: 'StartupX', width: 'w-28' },
  ]

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-slate-400 mb-6 uppercase tracking-widest font-medium">
          Empresas que confían en nosotros
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`${logo.width} h-10 flex items-center justify-center text-xl font-bold text-slate-300 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
