export function Payment() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Condiciones de Pago</h2>
        <p className="text-center text-slate-600 mb-8">Modelo de negocio transparente y sin sorpresas</p>
        <div className="bg-white p-8 rounded-lg border">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Comisión por contratación exitosa</h3>
          <p className="text-slate-600 mb-6">
            Nuestro modelo es simple: solo cobramos cuando contratás al candidato. Sin costos fijos, sin sorpresas.
          </p>
          <p className="font-medium text-slate-900 mb-2">Medios de pago aceptados:</p>
          <div className="flex gap-6 text-slate-600">
            <span>💳 Transferencia bancaria</span>
            <span>🅿️ PayPal</span>
          </div>
        </div>
      </div>
    </section>
  )
}
