-- supabase/migrations/20260914_seed_existing_user_roles.sql
-- This is a reference script. Actual seeding must be done via Clerk API
-- because unsafeMetadata is not in the database.

-- After running the Clerk migration script, verify:
-- SELECT clerk_user_id, role, status FROM user_roles;
