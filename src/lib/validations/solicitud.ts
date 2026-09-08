import { z } from 'zod'

export const solicitudSchema = z.object({
  // Step 1: Company
  companyName: z.string().min(1, 'El nombre de la empresa es requerido'),
  industry: z.string().min(1, 'La industria es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  contactName: z.string().min(1, 'La persona de contacto es requerida'),
  contactRole: z.string().min(1, 'El cargo es requerido'),
  contactEmail: z.string().email('Email inválido'),

  // Step 2: Position
  positionTitle: z.string().min(1, 'El nombre del cargo es requerido'),
  positionsCount: z.number().min(1, 'Debe ser al menos 1'),
  area: z.string().min(1, 'El área es requerida'),
  experienceLevel: z.string().min(1, 'El nivel de experiencia es requerido'),
  positionType: z.string().min(1, 'El tipo de posición es requerido'),
  workMode: z.string().min(1, 'La modalidad es requerida'),
  positionLocation: z.string().optional(),
  startDate: z.string().optional(),

  // Step 3: Profile
  minExperience: z.number().min(0),
  englishLevel: z.string().min(1, 'El nivel de inglés es requerido'),
  education: z.string().optional(),
  certifications: z.string().optional(),
  technicalSkills: z.string().min(1, 'Los skills técnicos son requeridos'),
  softSkills: z.string().optional(),
  mandatoryRequirements: z.string().optional(),
  desirableRequirements: z.string().optional(),

  // Step 4: Conditions
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().default('USD'),
  contractType: z.string().optional(),
  schedule: z.string().optional(),
  timezone: z.string().optional(),
  benefits: z.string().optional(),
  additionalInfo: z.string().optional(),

  // Step 5: Selection
  candidatesCount: z.number().min(1),
  deadline: z.string().min(1, 'La fecha límite es requerida').refine((v) => {
    const min = new Date()
    min.setHours(0, 0, 0, 0)
    min.setDate(min.getDate() + 30)
    const d = new Date(v + 'T00:00:00')
    return !Number.isNaN(d.getTime()) && d >= min
  }, 'La fecha límite debe ser al menos 30 días desde hoy'),
  interviewCount: z.number().min(1),
  technicalTests: z.string().optional(),
  processRequirements: z.string().optional(),
})

export type SolicitudInput = z.infer<typeof solicitudSchema>

// ── Per-step schemas ──────────────────────────────────────────────────────────
// Each wizard step validates only its own fields before allowing "Next".
// These are derived from `solicitudSchema` so the full-request contract stays
// the source of truth while the UI can gate step-by-step.

export const solicitudStepSchemas = {
  1: z.object({
    companyName: solicitudSchema.shape.companyName,
    industry: solicitudSchema.shape.industry,
    location: solicitudSchema.shape.location,
    contactName: solicitudSchema.shape.contactName,
    contactRole: solicitudSchema.shape.contactRole,
    contactEmail: solicitudSchema.shape.contactEmail,
  }),
  2: z.object({
    positionTitle: solicitudSchema.shape.positionTitle,
    positionsCount: solicitudSchema.shape.positionsCount,
    area: solicitudSchema.shape.area,
    experienceLevel: solicitudSchema.shape.experienceLevel,
    positionType: solicitudSchema.shape.positionType,
    workMode: solicitudSchema.shape.workMode,
    positionLocation: solicitudSchema.shape.positionLocation,
    startDate: solicitudSchema.shape.startDate,
  }),
  3: z.object({
    minExperience: solicitudSchema.shape.minExperience,
    englishLevel: solicitudSchema.shape.englishLevel,
    education: solicitudSchema.shape.education,
    certifications: solicitudSchema.shape.certifications,
    technicalSkills: solicitudSchema.shape.technicalSkills,
    softSkills: solicitudSchema.shape.softSkills,
    mandatoryRequirements: solicitudSchema.shape.mandatoryRequirements,
    desirableRequirements: solicitudSchema.shape.desirableRequirements,
  }),
  4: z.object({
    salaryMin: solicitudSchema.shape.salaryMin,
    salaryMax: solicitudSchema.shape.salaryMax,
    currency: solicitudSchema.shape.currency,
    contractType: solicitudSchema.shape.contractType,
    schedule: solicitudSchema.shape.schedule,
    timezone: solicitudSchema.shape.timezone,
    benefits: solicitudSchema.shape.benefits,
    additionalInfo: solicitudSchema.shape.additionalInfo,
  }),
  5: z.object({
    candidatesCount: solicitudSchema.shape.candidatesCount,
    deadline: solicitudSchema.shape.deadline,
    interviewCount: solicitudSchema.shape.interviewCount,
    technicalTests: solicitudSchema.shape.technicalTests,
    processRequirements: solicitudSchema.shape.processRequirements,
  }),
} as const

export type SolicitudStep = keyof typeof solicitudStepSchemas
