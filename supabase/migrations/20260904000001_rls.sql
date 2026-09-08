-- RLS: enable on all app tables. Server APIs use service_role (bypass RLS).
-- anon: read public jobs + approved testimonials. authenticated: broad
-- read/write (Clerk IDs live in app layer; fine-grained ownership stays in
-- API handlers). No FOR UPDATE regressions: policies are PERMISSIVE.
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_requests" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_request_steps" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "candidates" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "candidate_profiles" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "process_events" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "recruiters" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "interviews" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "system_config" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_threads" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
--> statement-breakpoint
DROP POLICY IF EXISTS "public_jobs_read" ON "job_requests";
CREATE POLICY "public_jobs_read" ON "job_requests"
  FOR SELECT TO anon USING ("is_public" = true);
--> statement-breakpoint
DROP POLICY IF EXISTS "approved_testimonials_read" ON "testimonials";
CREATE POLICY "approved_testimonials_read" ON "testimonials"
  FOR SELECT TO anon USING ("status" = 'approved');
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "companies";
CREATE POLICY "authenticated_all" ON "companies"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "job_requests";
CREATE POLICY "authenticated_all" ON "job_requests"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "job_request_steps";
CREATE POLICY "authenticated_all" ON "job_request_steps"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "candidates";
CREATE POLICY "authenticated_all" ON "candidates"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "candidate_profiles";
CREATE POLICY "authenticated_all" ON "candidate_profiles"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "applications";
CREATE POLICY "authenticated_all" ON "applications"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "process_events";
CREATE POLICY "authenticated_all" ON "process_events"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "recruiters";
CREATE POLICY "authenticated_all" ON "recruiters"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "notifications";
CREATE POLICY "authenticated_all" ON "notifications"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "audit_logs";
CREATE POLICY "authenticated_all" ON "audit_logs"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "interviews";
CREATE POLICY "authenticated_all" ON "interviews"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "documents";
CREATE POLICY "authenticated_all" ON "documents"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "system_config";
CREATE POLICY "authenticated_all" ON "system_config"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "chat_threads";
CREATE POLICY "authenticated_all" ON "chat_threads"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "chat_messages";
CREATE POLICY "authenticated_all" ON "chat_messages"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_all" ON "testimonials";
CREATE POLICY "authenticated_all" ON "testimonials"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
