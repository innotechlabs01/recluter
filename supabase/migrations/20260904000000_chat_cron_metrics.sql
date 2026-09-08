-- Delta: chat threads/messages, publishing columns, recruiter capacity,
-- interviews, documents, testimonials.
-- Applies on top of 20260819000000_initial_schema.sql.
--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "is_public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_share_token_unique" UNIQUE("share_token");--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "assigned_at" timestamp;--> statement-breakpoint
ALTER TABLE "recruiters" ADD COLUMN "max_concurrent" integer DEFAULT 5;--> statement-breakpoint
CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"candidate_id" uuid,
	"scheduled_at" timestamp,
	"duration" integer,
	"type" text,
	"meeting_link" text,
	"status" text DEFAULT 'scheduled',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"type" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"application_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"sender_id" text,
	"sender_role" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"job_request_id" uuid,
	"author_name" text NOT NULL,
	"author_role" text,
	"company_name" text NOT NULL,
	"quote" text NOT NULL,
	"rating" integer NOT NULL,
	"status" "testimonial_status" DEFAULT 'pending',
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	CONSTRAINT "testimonials_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;
