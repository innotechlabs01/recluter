const faqs = [
  { q: '¿Cuánto tiempo toma encontrar candidatos?', a: 'El tiempo promedio es de 2-4 semanas dependiendo de la complejidad del puesto.' },
  { q: '¿Cuánto cuesta el servicio?', a: 'Trabajamos con comisión por contratación exitosa. Solo cobramos cuando contratás al candidato.' },
  { q: '¿Cómo funciona la contratación con talento en Colombia?', a: 'Nos encargamos de la búsqueda, preselección y evaluación. Vos solo elegís y contratás.' },
  { q: '¿Puedo cancelar si no estoy satisfecho?', a: 'Sí, podés cancelar en cualquier momento. Solo cobramos si contratás.' },
]

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
