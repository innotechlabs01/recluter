import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import {
  candidateProfileSchema,
  empresaProfileSchema,
  testimonialSchema,
  contactSchema,
} from '../../src/lib/validations/profile.ts'
import {
  solicitudSchema,
  solicitudStepSchemas,
} from '../../src/lib/validations/solicitud.ts'

test('candidateProfileSchema accepts valid fields', () => {
  const res = candidateProfileSchema.safeParse({
    firstName: 'Ana',
    lastName: 'García',
    phone: '+57 300 000 0000',
    experience: '5 años',
    skills: 'React, Node',
  })
  assert.equal(res.success, true)
})

test('candidateProfileSchema rejects empty required first/last name', () => {
  const res = candidateProfileSchema.safeParse({ firstName: '', lastName: '' })
  assert.equal(res.success, false)
  if (!res.success) {
    const flattened = res.error.flatten().fieldErrors
    assert.ok(flattened.firstName)
    assert.ok(flattened.lastName)
  }
})

test('empresaProfileSchema accepts valid fields', () => {
  const res = empresaProfileSchema.safeParse({
    name: 'Acme Corp',
    contactEmail: 'contacto@acme.com',
  })
  assert.equal(res.success, true)
})

test('empresaProfileSchema accepts empty contact email (optional field)', () => {
  const res = empresaProfileSchema.safeParse({ name: 'Acme Corp', contactEmail: '' })
  assert.equal(res.success, true)
})

test('empresaProfileSchema rejects invalid email', () => {
  const res = empresaProfileSchema.safeParse({ name: 'Acme Corp', contactEmail: 'nope' })
  assert.equal(res.success, false)
})

test('testimonialSchema accepts valid quote and rating', () => {
  const res = testimonialSchema.safeParse({
    quote: 'Excelente servicio, muy recomendable',
    rating: 5,
  })
  assert.equal(res.success, true)
})

test('testimonialSchema rejects quote over 500 chars', () => {
  const res = testimonialSchema.safeParse({
    quote: 'a'.repeat(501),
    rating: 5,
  })
  assert.equal(res.success, false)
  if (!res.success) {
    assert.ok(res.error.flatten().fieldErrors.quote)
  }
})

test('testimonialSchema accepts exactly 500 chars', () => {
  const res = testimonialSchema.safeParse({
    quote: 'a'.repeat(500),
    rating: 5,
  })
  assert.equal(res.success, true)
})

test('testimonialSchema rejects quote under 10 chars', () => {
  const res = testimonialSchema.safeParse({ quote: 'muy corto', rating: 5 })
  assert.equal(res.success, false)
})

test('testimonialSchema rejects rating out of range', () => {
  assert.equal(testimonialSchema.safeParse({ quote: 'Un texto de prueba válido', rating: 0 }).success, false)
  assert.equal(testimonialSchema.safeParse({ quote: 'Un texto de prueba válido', rating: 6 }).success, false)
})

test('contactSchema accepts valid contact', () => {
  const res = contactSchema.safeParse({
    name: 'Juan',
    email: 'juan@example.com',
    message: 'Quiero contratar talento',
  })
  assert.equal(res.success, true)
})

test('contactSchema rejects empty name/email/message', () => {
  const res = contactSchema.safeParse({ name: '', email: '', message: '' })
  assert.equal(res.success, false)
  if (!res.success) {
    const flat = res.error.flatten().fieldErrors
    assert.ok(flat.name)
    assert.ok(flat.email)
    assert.ok(flat.message)
  }
})

// ── Wizard per-step schemas ───────────────────────────────────────────────────

test('solicitudSchema validates the complete wizard payload', () => {
  const res = solicitudSchema.safeParse({
    companyName: 'Acme Corp',
    industry: 'Tech',
    location: 'Medellín',
    contactName: 'Ana',
    contactRole: 'HR',
    contactEmail: 'ana@acme.com',
    positionTitle: 'Desarrollador Senior',
    positionsCount: 2,
    area: 'tech',
    experienceLevel: 'senior',
    positionType: 'fulltime',
    workMode: 'remote',
    minExperience: 3,
    englishLevel: 'advanced',
    technicalSkills: 'React, Node',
    candidatesCount: 5,
    interviewCount: 2,
  })
  assert.equal(res.success, true)
})

test('solicitud step 1 rejects empty company fields', () => {
  const res = solicitudStepSchemas[1].safeParse({
    companyName: '',
    industry: '',
    location: '',
    contactName: '',
    contactRole: '',
    contactEmail: 'not-an-email',
  })
  assert.equal(res.success, false)
})

test('solicitud step 1 accepts complete company fields', () => {
  const res = solicitudStepSchemas[1].safeParse({
    companyName: 'Acme Corp',
    industry: 'Tech',
    location: 'Medellín',
    contactName: 'Ana',
    contactRole: 'HR',
    contactEmail: 'ana@acme.com',
  })
  assert.equal(res.success, true)
})

test('solicitud step 2 rejects missing position title', () => {
  const res = solicitudStepSchemas[2].safeParse({
    positionTitle: '',
    positionsCount: 1,
    area: 'tech',
    experienceLevel: 'senior',
    positionType: 'fulltime',
    workMode: 'remote',
  })
  assert.equal(res.success, false)
})

test('solicitud step 3 accepts valid profile fields', () => {
  const res = solicitudStepSchemas[3].safeParse({
    minExperience: 3,
    englishLevel: 'advanced',
    technicalSkills: 'React',
  })
  assert.equal(res.success, true)
})

test('solicitud step 5 accepts valid selection fields', () => {
  const res = solicitudStepSchemas[5].safeParse({
    candidatesCount: 5,
    interviewCount: 2,
  })
  assert.equal(res.success, true)
})
