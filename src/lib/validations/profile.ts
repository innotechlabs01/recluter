import { z } from 'zod'

// ── Candidate profile ─────────────────────────────────────────────────────────

export const candidateProfileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
})

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>

// ── Empresa profile ───────────────────────────────────────────────────────────

export const empresaProfileSchema = z.object({
  name: z.string().min(1, 'El nombre de la empresa es requerido'),
  industry: z.string().optional(),
  location: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email('Email inválido').or(z.literal('')),
  contactPhone: z.string().optional(),
})

export type EmpresaProfileInput = z.infer<typeof empresaProfileSchema>

// ── Testimonial ───────────────────────────────────────────────────────────────
// quote is coerced to string to tolerate numeric/other inputs from the form.

export const testimonialSchema = z.object({
  quote: z
    .string()
    .min(10, 'El testimonio debe tener al menos 10 caracteres')
    .max(500, 'El testimonio no puede superar los 500 caracteres'),
  rating: z.coerce.number().int().min(1, 'Seleccioná una calificación').max(5),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>

// ── Landing contact ───────────────────────────────────────────────────────────
// Client-side success stub; no persistence table exists yet.

export const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  message: z.string().min(1, 'El mensaje es requerido'),
})

export type ContactInput = z.infer<typeof contactSchema>
