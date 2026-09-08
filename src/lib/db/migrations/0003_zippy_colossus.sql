CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"sender_id" text,
	"sender_role" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_request_id" uuid,
	"application_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "is_public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "job_requests" ADD COLUMN "assigned_at" timestamp;--> statement-breakpoint
ALTER TABLE "recruiters" ADD COLUMN "max_concurrent" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_candidate_unique" UNIQUE("job_request_id","candidate_id");--> statement-breakpoint
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_share_token_unique" UNIQUE("share_token");