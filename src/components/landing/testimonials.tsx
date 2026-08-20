export function Testimonials() {
  const testimonials = [
    {
      quote: "Recluter nos ayudó a encontrar 3 desarrolladores senior en menos de 2 semanas. El proceso fue transparente y sin sorpresas.",
      author: "Sarah Johnson",
      role: "CTO, TechCo",
      company: "TechCo"
    },
    {
      quote: "La calidad del talento colombiano es excepcional. Ahora tenemos un equipo completo de 8 personas trabajando desde Colombia.",
      author: "Michael Chen",
      role: "VP Engineering, GlobalInc",
      company: "GlobalInc"
    },
    {
      quote: "Lo que más me gustó es que solo cobran cuando contratás. Sin riesgo, sin costos ocultos. Totalmente recomendado.",
      author: "Laura Martínez",
      role: "HR Director, InnovateLab",
      company: "InnovateLab"
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Lo que dicen nuestros clientes</h2>
        <p className="text-center text-slate-600 mb-12">Empresas que ya confiaron en nosotros</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
