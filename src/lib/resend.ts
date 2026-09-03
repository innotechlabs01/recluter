import { Resend } from 'resend'

// Lazy + null-safe: instantiating Resend at module load time throws during
// build (page-data collection) when RESEND_API_KEY is missing (e.g. Vercel
// Preview deployments where the var is only set for Production).
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
