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
  deadline: z.string().optional(),
  interviewCount: z.number().min(1),
  technicalTests: z.string().optional(),
  processRequirements: z.string().optional(),
})

export type SolicitudInput = z.infer<typeof solicitudSchema>
