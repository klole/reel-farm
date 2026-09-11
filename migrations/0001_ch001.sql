CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  scope TEXT,
  password TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT account_provider_account_unique UNIQUE(provider_id, account_id)
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton_key TEXT NOT NULL UNIQUE,
  owner_user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT project_workspace_name_unique UNIQUE(workspace_id, name)
);

CREATE TABLE IF NOT EXISTS draft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES project(id) ON DELETE CASCADE,
  head_revision_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS draft_revision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES draft(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  document JSONB NOT NULL,
  content_hash TEXT NOT NULL,
  canonicalization_version TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT draft_revision_number_unique UNIQUE(draft_id, revision_number),
  CONSTRAINT draft_revision_hash_unique UNIQUE(draft_id, content_hash)
);

ALTER TABLE draft DROP CONSTRAINT IF EXISTS draft_head_revision_fk;
ALTER TABLE draft ADD CONSTRAINT draft_head_revision_fk FOREIGN KEY(head_revision_id) REFERENCES draft_revision(id) ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS asset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'upload',
  uploaded_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rights_assertion BOOLEAN NOT NULL,
  original_hash TEXT NOT NULL,
  derivative_hash TEXT NOT NULL,
  mime TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  original_bytes INTEGER NOT NULL,
  derivative_bytes INTEGER NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  derivative_key TEXT NOT NULL UNIQUE,
  thumbnail_key TEXT NOT NULL UNIQUE,
  acceptance_state TEXT NOT NULL DEFAULT 'accepted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS render_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  draft_id UUID NOT NULL REFERENCES draft(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES draft_revision(id) ON DELETE RESTRICT,
  client_request_id TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_code TEXT,
  error_message TEXT,
  lease_token TEXT,
  lease_expires_at TIMESTAMPTZ,
  renderer_build_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  CONSTRAINT render_request_identity_unique UNIQUE(draft_id, client_request_id)
);

CREATE TABLE IF NOT EXISTS render_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  render_request_id UUID NOT NULL UNIQUE REFERENCES render_request(id) ON DELETE CASCADE,
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lease_token TEXT,
  lease_expires_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS render_artifact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  render_request_id UUID NOT NULL UNIQUE REFERENCES render_request(id) ON DELETE CASCADE,
  revision_id UUID NOT NULL REFERENCES draft_revision(id) ON DELETE RESTRICT,
  revision_hash TEXT NOT NULL,
  renderer_build_id TEXT NOT NULL,
  font_set_hash TEXT NOT NULL,
  canvas_width INTEGER NOT NULL,
  canvas_height INTEGER NOT NULL,
  images JSONB NOT NULL,
  manifest JSONB NOT NULL,
  zip_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS worker_heartbeat (
  worker_name TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  build_id TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS save_mutation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES draft(id) ON DELETE CASCADE,
  actor_user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  mutation_id TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  revision_id UUID NOT NULL REFERENCES draft_revision(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT save_mutation_identity_unique UNIQUE(draft_id, actor_user_id, mutation_id)
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
