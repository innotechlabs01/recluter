interface TestimonialRequestEmailProps {
  authorName: string
  companyName: string
  token: string
}

export function TestimonialRequestEmail({
  authorName,
  companyName,
  token,
}: TestimonialRequestEmailProps) {
  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://reclutersystem.vercel.app'}/testimonio?token=${token}`

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, color: '#1e293b', marginBottom: 8 }}>
          ¡Felicitaciones, {authorName}! 🎉
        </h1>
        <p style={{ fontSize: 16, color: '#64748b' }}>
          {companyName} acaba de hacer una contratación exitosa con Recluter
        </p>
      </div>

      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, margin: 0 }}>
          Nos encantaría conocer tu experiencia. Tu testimonio ayuda a otras empresas a confiar en nuestro proceso de reclutamiento.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <a
          href={formUrl}
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Dejar mi testimonio
        </a>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>
        Solo toma 1 minuto. Tu testimonio será revisado antes de publicarse.
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />

      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
        Recluter — Plataforma de Reclutamiento
      </p>
    </div>
  )
}
