CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
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
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_job_request_id_job_requests_id_fk" FOREIGN KEY ("job_request_id") REFERENCES "public"."job_requests"("id") ON DELETE no action ON UPDATE no action;