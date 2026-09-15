CREATE TYPE user_role_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('company','candidate','admin','recruiter')),
  status user_role_status DEFAULT 'approved',
  assigned_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_roles_clerk_user_id ON user_roles(clerk_user_id);
