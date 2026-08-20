import jwt from 'jsonwebtoken'

const SECRET = process.env.CLERK_SECRET_KEY || 'fallback-secret'

export interface TestimonialTokenPayload {
  companyId: string
  jobRequestId: string
  authorName: string
  authorRole: string
  companyName: string
}

export function generateTestimonialToken(payload: TestimonialTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyTestimonialToken(token: string): TestimonialTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TestimonialTokenPayload
  } catch {
    return null
  }
}
