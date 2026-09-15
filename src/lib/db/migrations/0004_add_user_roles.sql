CREATE TYPE "public"."user_role_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"role" text NOT NULL,
	"status" "user_role_status" DEFAULT 'approved',
	"assigned_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_roles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
