import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  decimal,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core'

// ── Enums ──────────────────────────────────────────────────────────────────────

export const companyStatusEnum = pgEnum('company_status', [
  'active',
  'inactive',
  'suspended',
])

export const jobRequestStatusEnum = pgEnum('job_request_status', [
  'received',
  'reviewing',
  'info_pending',
  'searching',
  'evaluating',
  'candidates_sent',
  'interview',
  'selected',
  'hired',
  'closed',
  'paused',
  'cancelled',
  'new_search_required',
])

export const candidateStatusEnum = pgEnum('candidate_status', [
  'available',
  'interviewing',
  'hired',
  'unavailable',
])

export const applicationStatusEnum = pgEnum('application_status', [
  'suggested',
  'reviewed',
  'shortlisted',
  'interviewed',
  'selected',
  'rejected',
])

export const priorityEnum = pgEnum('priority', [
  'low',
  'medium',
  'high',
  'urgent',
])

export const workModeEnum = pgEnum('work_mode', [
  'remote',
  'hybrid',
  'onsite',
])

// ── Companies (maps to Clerk Organization) ─────────────────────────────────────

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  name: text('name').notNull(),
  industry: text('industry'),
  location: text('location'),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  billingInfo: jsonb('billing_info'),
  status: companyStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ── Job Requests ───────────────────────────────────────────────────────────────

export const jobRequests = pgTable('job_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id),
  title: text('title').notNull(),
  status: jobRequestStatusEnum('status').default('received'),
  priority: priorityEnum('priority').default('medium'),
  recruiterId: uuid('recruiter_id'),
  positionsCount: integer('positions_count').default(1),
  salaryMin: decimal('salary_min'),
  salaryMax: decimal('salary_max'),
  currency: text('currency').default('USD'),
  workMode: workModeEnum('work_mode'),
  location: text('location'),
  startDate: timestamp('start_date'),
  deadline: timestamp('deadline'),
  additionalInfo: jsonb('additional_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ── Job Request Steps (wizard data) ────────────────────────────────────────────

export const jobRequestSteps = pgTable('job_request_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  stepNumber: integer('step_number').notNull(),
  stepName: text('step_name').notNull(),
  data: jsonb('data'),
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Candidates ─────────────────────────────────────────────────────────────────

export const candidates = pgTable('candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  clerkUserId: text('clerk_user_id'),
  status: candidateStatusEnum('status').default('available'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Candidate Profiles ─────────────────────────────────────────────────────────

export const candidateProfiles = pgTable('candidate_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  experienceYears: integer('experience_years'),
  education: jsonb('education'),
  certifications: jsonb('certifications'),
  skills: jsonb('skills'),
  languages: jsonb('languages'),
  englishLevel: text('english_level'),
  resumeUrl: text('resume_url'),
  availability: text('availability'),
  preferredWork: text('preferred_work'),
  salaryExpected: decimal('salary_expected'),
  bio: text('bio'),
})

// ── Applications ───────────────────────────────────────────────────────────────

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  status: applicationStatusEnum('status').default('suggested'),
  sentAt: timestamp('sent_at'),
  reviewedAt: timestamp('reviewed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Process Events (timeline) ──────────────────────────────────────────────────

export const processEvents = pgTable('process_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  eventType: text('event_type').notNull(),
  description: text('description'),
  actorId: text('actor_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Recruiters ─────────────────────────────────────────────────────────────────

export const recruiters = pgTable('recruiters', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  specialties: jsonb('specialties'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Notifications ──────────────────────────────────────────────────────────────

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  type: text('type').default('info'),
  title: text('title').notNull(),
  message: text('message'),
  read: boolean('read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Audit Logs ─────────────────────────────────────────────────────────────────

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  action: text('action').notNull(),
  resource: text('resource'),
  resourceId: uuid('resource_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Interviews ────────────────────────────────────────────────────────────────

export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  scheduledAt: timestamp('scheduled_at'),
  duration: integer('duration'), // minutes
  type: text('type'), // virtual, presential
  meetingLink: text('meeting_link'),
  status: text('status').default('scheduled'), // scheduled, completed, cancelled
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Documents ──────────────────────────────────────────────────────────────────

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  candidateId: uuid('candidate_id').references(() => candidates.id),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  type: text('type'), // resume, certificate, id
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})

// ── System Config ──────────────────────────────────────────────────────────────

export const systemConfig = pgTable('system_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  value: jsonb('value'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ── Testimonials ────────────────────────────────────────────────────────────────

export const testimonialStatusEnum = pgEnum('testimonial_status', [
  'pending',
  'approved',
  'rejected',
])

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id),
  jobRequestId: uuid('job_request_id').references(() => jobRequests.id),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  companyName: text('company_name').notNull(),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull(),
  status: testimonialStatusEnum('status').default('pending'),
  token: text('token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
})
