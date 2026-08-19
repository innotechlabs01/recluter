CREATE TYPE "public"."application_status" AS ENUM('suggested', 'reviewed', 'shortlisted', 'interviewed', 'selected', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."candidate_status" AS ENUM('available', 'interviewing', 'hired', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."company_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."job_request_status" AS ENUM('received', 'reviewing', 'info_pending', 'searching', 'evaluating', 'candidates_sent', 'interview', 'selected', 'hired', 'closed', 'paused', 'cancelled', 'new_search_required');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"candidate_id" uuid,
	"status" "application_status" DEFAULT 'suggested',
	"sent_at" timestamp,
	"reviewed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"resource" text,
	"resource_id" uuid,
	"details" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "candidate_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"experience_years" integer,
	"education" jsonb,
	"certifications" jsonb,
	"skills" jsonb,
	"languages" jsonb,
	"english_level" text,
	"resume_url" text,
	"availability" text,
	"preferred_work" text,
	"salary_expected" numeric,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"clerk_user_id" text,
	"status" "candidate_status" DEFAULT 'available',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "candidates_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_org_id" text NOT NULL,
	"name" text NOT NULL,
	"industry" text,
	"location" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"billing_info" jsonb,
	"status" "company_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "companies_clerk_org_id_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "job_request_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"step_number" integer NOT NULL,
	"step_name" text NOT NULL,
	"data" jsonb,
	"is_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"title" text NOT NULL,
	"status" "job_request_status" DEFAULT 'received',
	"priority" "priority" DEFAULT 'medium',
	"recruiter_id" uuid,
	"positions_count" integer DEFAULT 1,
	"salary_min" numeric,
	"salary_max" numeric,
	"currency" text DEFAULT 'USD',
	"work_mode" "work_mode",
	"location" text,
	"start_date" timestamp,
	"deadline" timestamp,
	"additional_info" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text DEFAULT 'info',
	"title" text NOT NULL,
	"message" text,
	"read" boolean DEFAULT false,
	"link" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "process_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"event_type" text NOT NULL,
	"description" text,
	"actor_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recruiters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"specialties" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" jsonb,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_request_steps" ADD CONSTRAINT "job_request_steps_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "process_events" ADD CONSTRAINT "process_events_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;