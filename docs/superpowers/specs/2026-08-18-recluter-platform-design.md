# Recluter Platform — Design Document

## Overview

A recruitment platform connecting US companies with Colombian talent. Companies submit job requests through a guided wizard, our team finds candidates, and companies track the entire process transparently.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14+ (App Router) | Server Components, Server Actions, Vercel-native |
| UI | shadcn/ui + Tailwind CSS v4 | Professional, fast, customizable |
| Auth | Clerk (Organizations) | Multi-tenancy, roles, invitations built-in |
| Database | Supabase (PostgreSQL) + Drizzle ORM | Managed Postgres, RLS, Storage, Edge Functions |
| Email | Supabase Edge Functions | Integrated with auth and storage |
| i18n | next-intl | ES/EN from day one |
| Deployment | Vercel (dev/qa/prd branches) | Preview deploys, environment separation |

## Architecture

### Project Structure (Monolith Modular)

```
src/app/
├── (marketing)/          # Landing page
├── (auth)/               # Clerk auth flows
├── (empresa)/            # Company portal
├── (candidato)/          # Candidate portal
├── (admin)/              # Admin portal
└── api/                  # Server Actions & API routes
```

Each portal is a route group with its own layout, sidebar, and navigation. They share components, database, and auth.

### Multi-tenancy

- **Clerk Organizations** = Companies
- **Roles**: `company_admin`, `company_member`, `recruiter`, `admin`, `candidate`
- **RLS on Supabase**: Every query filters by `organization_id`
- **Middleware**: Route protection by role

### Database Schema

**Core entities:**
- `companies` — maps to Clerk Organization
- `job_requests` — each hiring request
- `job_request_steps` — wizard progress (6 steps, JSONB data)
- `candidates` — candidate records
- `candidate_profiles` — professional info, skills, CV
- `applications` — candidate linked to job request
- `process_events` — timeline of each request
- `recruiters` — internal recruitment team
- `notifications` — in-app notifications
- `audit_logs` — security audit trail
- `system_config` — configurable SLA, times, etc.

**Relationship:**
```
Company → Job Request → Application → Candidate
                    → Process Event
```

## User Portals

### 1. Landing Page
- Hero with CTA
- How it works (4 steps)
- Types of personnel
- Benefits
- FAQ
- Payment conditions (commission per hire)
- Contact form
- Footer with terms/privacy

### 2. Company Portal
- **Dashboard**: Active processes, candidates received, interviews pending
- **Job Request Wizard** (6 steps):
  1. Company info (reusable)
  2. Position details
  3. Candidate profile
  4. Work conditions
  5. Selection process
  6. Review & submit
- **My Processes**: Track all requests with timeline
- **Candidates**: View candidates per request
- **History**: Past processes

### 3. Candidate Portal
- **Dashboard**: Summary of processes
- **My Profile**: Professional info, CV
- **Opportunities**: Available positions
- **Applications**: Track applications
- **Interviews**: Calendar
- **Documents**: CV and required docs
- **Notifications**: Updates

### 4. Admin Portal
- **Dashboard**: Global stats (companies, requests, candidates, avg time)
- **Companies**: CRUD + user management
- **Requests**: All requests, assign recruiters
- **Candidates**: Global candidate pool
- **Recruiters**: Team management
- **History**: All processes

## Process Pipeline

```
Received → Reviewing → Searching → Evaluating → Sent → Interview → Selected → Hired → Closed
```

Additional states: Info Pending, Paused, Cancelled, New Search Required

## Email Notifications

| Event | Recipient | Template |
|-------|-----------|----------|
| Request created | Company | Confirmation + timeline |
| Request approved | Company | Search started |
| Candidates sent | Company | Candidate summaries |
| Interview scheduled | Company + Candidate | Date, time, participants |
| Process closed | Company | Summary + metrics |

## Payment Model

- **Commission per hire** — company pays only when they hire a candidate
- **Payment methods**: Wire transfer, PayPal
- **Platform role**: Informational only (no payment processing in MVP)
- Admin manages payment status manually

## Security

- Clerk auth with MFA support
- Row Level Security on all Supabase tables
- Backend validation (never trust frontend)
- Audit logs for all mutations
- Private file URLs via Supabase Storage
- Rate limiting on API routes

## MVP Scope

### Phase 1: Foundation
- Project setup (Next.js, Supabase, Drizzle, Clerk, shadcn, i18n)
- Database schema + migrations
- Auth + roles + multi-tenancy
- Middleware + route protection

### Phase 2: Landing + Auth
- Landing page (all sections)
- Login/Register flow
- Role-based routing

### Phase 3: Company Portal
- Dashboard
- Job request wizard (6 steps)
- Process tracking with timeline
- Candidate view

### Phase 4: Admin Portal
- Dashboard
- Company management
- Request management
- Recruiter assignment

### Phase 5: Candidate Portal
- Dashboard
- Profile management
- Opportunities
- Applications

### Phase 6: Notifications + Email
- Email templates
- In-app notifications
- Supabase Edge Functions

## Open Design Decisions

1. **Wizard data persistence**: Save each step independently (JSONB in `job_request_steps`) or single JSON blob in `job_request`? → **Recommendation**: JSONB per step for flexibility
2. **File uploads**: Supabase Storage with private URLs, access controlled by RLS
3. **Real-time updates**: Supabase Realtime for notifications (optional, can add later)
4. **Analytics**: Basic stats in admin dashboard, can add Mixpanel/PostHog later
