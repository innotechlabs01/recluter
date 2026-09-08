import jwt from 'jsonwebtoken'

function getSecret(): string {
  const secret = process.env.CLERK_SECRET_KEY
  if (!secret) {
    throw new Error('CLERK_SECRET_KEY is not set. Copy .env.example to .env.local and fill it in.')
  }
  return secret
}

export interface TestimonialTokenPayload {
  companyId: string
  jobRequestId: string
  authorName: string
  authorRole: string
  companyName: string
}

export function generateTestimonialToken(payload: TestimonialTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyTestimonialToken(token: string): TestimonialTokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TestimonialTokenPayload
  } catch {
    return null
  }
}
