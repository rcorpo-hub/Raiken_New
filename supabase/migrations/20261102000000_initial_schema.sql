-- ============================================================================
-- RCorpo Platform Initial Schema Migration
-- Designed for Supabase PostgreSQL
-- IDEMPOTENT: Safe to run repeatedly without duplicate errors or data loss.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. HELPER FUNCTIONS FOR TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. IDENTITY & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  last_admin_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  name text NOT NULL,
  is_sensitive_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  code text PRIMARY KEY,
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id text REFERENCES roles(id) ON DELETE CASCADE,
  permission_code text REFERENCES permissions(code) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_code)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role_id text REFERENCES roles(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- 4. BRANCHES & ACCESS
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'Australia/Adelaide',
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  public_contacts jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_branch_access (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, branch_id)
);

CREATE TABLE IF NOT EXISTS application_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'restricted')),
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. CONTENT & NAVIGATION (CMS)
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'page' CHECK (kind IN ('page', 'post', 'service', 'popup')),
  path text UNIQUE NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_revision_id uuid,
  published_at timestamptz DEFAULT now(),
  parent_id uuid REFERENCES content_items(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_id, revision)
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu text NOT NULL DEFAULT 'main' CHECK (menu IN ('main', 'footer', 'topbar')),
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content_items(id) ON DELETE SET NULL,
  external_url text,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path text UNIQUE NOT NULL,
  target text NOT NULL,
  http_status smallint NOT NULL DEFAULT 301 CHECK (http_status IN (301, 302, 307, 308)),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. FORMS & ENGINE
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  current_version_id uuid,
  owner_branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS form_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  version integer NOT NULL,
  schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  schema_hash text NOT NULL,
  state text NOT NULL DEFAULT 'published' CHECK (state IN ('draft', 'published', 'archived')),
  is_partial_legacy boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  published_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, version)
);

CREATE TABLE IF NOT EXISTS form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_version_id uuid NOT NULL REFERENCES form_versions(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  field_type text NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  classification text NOT NULL DEFAULT 'standard',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (form_version_id, field_key)
);

CREATE TABLE IF NOT EXISTS form_bindings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content_items(id) ON DELETE SET NULL,
  path text NOT NULL,
  placement text NOT NULL DEFAULT 'page',
  active boolean NOT NULL DEFAULT true,
  UNIQUE (path, placement)
);

CREATE TABLE IF NOT EXISTS form_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_version_id uuid NOT NULL REFERENCES form_versions(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  csrf_binding_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  state text NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'submitted', 'expired', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. CUSTOMERS & CRM
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'person' CHECK (kind IN ('person', 'company', 'trust')),
  display_name text NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'merged', 'inactive')),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  merged_into_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('email', 'phone', 'mobile', 'address')),
  value text NOT NULL,
  normalised_value text NOT NULL,
  verified_at timestamptz,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  to_customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  relationship_type text NOT NULL,
  valid_from date,
  valid_to date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_relationship CHECK (from_customer_id <> to_customer_id)
);

-- 8. SUBMISSIONS & REVIEWS
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE RESTRICT,
  form_version_id uuid NOT NULL REFERENCES form_versions(id) ON DELETE RESTRICT,
  form_session_id uuid REFERENCES form_sessions(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'under_review', 'action_required', 'processed', 'archived')),
  answers_ciphertext bytea,
  answers_json jsonb,
  encryption_key_ref text,
  encryption_meta jsonb,
  safe_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  legacy_status text,
  retention_until date,
  legal_hold boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submission_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status_from text,
  status_to text,
  note_ciphertext bytea,
  note_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. IDEMPOTENCY & RATE LIMITING
CREATE TABLE IF NOT EXISTS idempotency_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL,
  subject_hash text NOT NULL,
  request_key text NOT NULL,
  payload_hash text NOT NULL,
  result_type text,
  result_id uuid,
  state text NOT NULL DEFAULT 'completed' CHECK (state IN ('processing', 'completed', 'failed')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scope, subject_hash, request_key)
);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key_hash text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (key_hash, window_start)
);

-- 10. FILES & UPLOADS
CREATE TABLE IF NOT EXISTS file_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  object_key text NOT NULL,
  original_name text NOT NULL,
  declared_mime text NOT NULL,
  verified_mime text,
  bytes bigint CHECK (bytes >= 0),
  sha256 text,
  scan_status text NOT NULL DEFAULT 'clean' CHECK (scan_status IN ('pending', 'clean', 'infected', 'rejected', 'missing')),
  scan_engine text,
  scanned_at timestamptz,
  retention_until date,
  legal_hold boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket, object_key)
);

CREATE TABLE IF NOT EXISTS upload_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES form_sessions(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES file_objects(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  repeat_path text[],
  max_bytes bigint NOT NULL DEFAULT 10485760,
  expires_at timestamptz NOT NULL,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'completed', 'expired', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submission_files (
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES file_objects(id) ON DELETE RESTRICT,
  field_key text NOT NULL,
  repeat_path text[],
  purpose text NOT NULL DEFAULT 'attachment',
  PRIMARY KEY (submission_id, file_id)
);

-- 11. NOTIFICATIONS & OUTBOX
CREATE TABLE IF NOT EXISTS notification_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key text UNIQUE NOT NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE SET NULL,
  appointment_id uuid,
  ticket_id uuid,
  channel text NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'webhook')),
  recipient_ciphertext bytea,
  recipient_email text,
  payload_ciphertext bytea,
  payload_json jsonb,
  state text NOT NULL DEFAULT 'queued' CHECK (state IN ('queued', 'leased', 'sent', 'captured', 'failed', 'dead_letter')),
  attempt_count integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  lease_owner text,
  lease_until timestamptz,
  provider_message_id text,
  last_error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES notification_jobs(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('accepted', 'delivered', 'bounced', 'complained', 'rejected')),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  safe_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (provider, provider_event_id)
);

-- 12. SCHEDULING (SERVICES, APPOINTMENTS, REQUESTS)
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_seconds integer NOT NULL DEFAULT 1800 CHECK (duration_seconds > 0),
  buffer_before_seconds integer NOT NULL DEFAULT 0 CHECK (buffer_before_seconds >= 0),
  buffer_after_seconds integer NOT NULL DEFAULT 0 CHECK (buffer_after_seconds >= 0),
  price numeric(14,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  currency char(3) NOT NULL DEFAULT 'AUD',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  timezone text NOT NULL DEFAULT 'Australia/Adelaide',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  staff_id uuid NOT NULL REFERENCES staff_resources(id) ON DELETE RESTRICT,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  blocked_start_at timestamptz NOT NULL,
  blocked_end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('held', 'pending', 'confirmed', 'cancelled', 'completed', 'expired')),
  hold_expires_at timestamptz,
  capability_token_hash text,
  source_timezone text NOT NULL DEFAULT 'Australia/Adelaide',
  legacy_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_appointment_times CHECK (start_at < end_at AND blocked_start_at <= start_at AND blocked_end_at >= end_at)
);

CREATE TABLE IF NOT EXISTS appointment_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  persons integer NOT NULL DEFAULT 1 CHECK (persons > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'closed')),
  resolved_appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 13. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS ticket_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_closed boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS ticket_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS ticket_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  status_id uuid NOT NULL REFERENCES ticket_statuses(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES ticket_categories(id) ON DELETE SET NULL,
  priority_id uuid REFERENCES ticket_priorities(id) ON DELETE SET NULL,
  subject text NOT NULL,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  author_customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  visibility text NOT NULL DEFAULT 'customer' CHECK (visibility IN ('customer', 'internal')),
  body text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

-- 14. NEWSLETTER & AUDIT
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  normalised_email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'suppressed')),
  source text NOT NULL DEFAULT 'website',
  confirmed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  branch_id uuid,
  request_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  safe_metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- 15. INDEXES (IDEMPOTENT)
CREATE INDEX IF NOT EXISTS idx_content_status_kind ON content_items(status, kind, published_at);
CREATE INDEX IF NOT EXISTS idx_submissions_form_date ON submissions(form_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_branch_status ON submissions(branch_id, status, received_at);
CREATE INDEX IF NOT EXISTS idx_submissions_customer ON submissions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_lookup ON customer_contacts(kind, normalised_value);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_start ON appointments(staff_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_branch_status ON appointments(branch_id, status, start_at);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_state_attempt ON notification_jobs(state, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_audit_events_occurred ON audit_events(occurred_at DESC);

-- 16. SEED ESSENTIAL DATA (ON CONFLICT DO NOTHING)
-- Branches
INSERT INTO branches (code, name, timezone, address, public_contacts, active)
VALUES 
  ('ADE', 'Adelaide (Head Office)', 'Australia/Adelaide', '{"street": "Level 1, 100 King William St", "city": "Adelaide", "state": "SA", "postcode": "5000"}'::jsonb, '{"phone": "+61 8 8123 4567", "email": "adelaide@rcorpo.com"}'::jsonb, true),
  ('BNE', 'Brisbane', 'Australia/Brisbane', '{"street": "Level 5, 200 Queen St", "city": "Brisbane", "state": "QLD", "postcode": "4000"}'::jsonb, '{"phone": "+61 7 3123 4567", "email": "brisbane@rcorpo.com"}'::jsonb, true),
  ('PER', 'Perth', 'Australia/Perth', '{"street": "Level 3, 50 St Georges Tce", "city": "Perth", "state": "WA", "postcode": "6000"}'::jsonb, '{"phone": "+61 8 9123 4567", "email": "perth@rcorpo.com"}'::jsonb, true)
ON CONFLICT (code) DO NOTHING;

-- Roles & Permissions
INSERT INTO roles (id, name, is_sensitive_admin)
VALUES 
  ('admin', 'Super Administrator', true),
  ('staff', 'Staff Member', false),
  ('support_agent', 'Support Agent', false),
  ('bookly_admin', 'Booking Administrator', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO permissions (code, description)
VALUES 
  ('forms.publish', 'Ability to publish form schema versions'),
  ('submissions.read', 'Ability to view and review submissions'),
  ('submissions.export', 'Ability to trigger bulk exports of submissions'),
  ('bookings.manage', 'Ability to manage services, availability and bookings'),
  ('support.manage', 'Ability to manage tickets and post internal notes'),
  ('content.publish', 'Ability to edit and publish CMS content')
ON CONFLICT (code) DO NOTHING;

-- Ticket Statuses & Priorities
INSERT INTO ticket_statuses (code, label, position, is_closed)
VALUES
  ('open', 'Open', 10, false),
  ('in_progress', 'In Progress', 20, false),
  ('waiting_customer', 'Waiting on Customer', 30, false),
  ('resolved', 'Resolved', 40, true),
  ('closed', 'Closed', 50, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO ticket_priorities (code, label, position)
VALUES
  ('low', 'Low', 10),
  ('medium', 'Medium', 20),
  ('high', 'High', 30),
  ('urgent', 'Urgent', 40)
ON CONFLICT (code) DO NOTHING;

-- Core Services
INSERT INTO services (name, duration_seconds, price, currency, active)
VALUES
  ('Accounting Consultation', 3600, 0.00, 'AUD', true),
  ('Conveyancing Consultation', 1800, 0.00, 'AUD', true),
  ('Taxation & TFN Advisory', 1800, 0.00, 'AUD', true),
  ('IT Services Estimate & Consultation', 1800, 0.00, 'AUD', true),
  ('Mortgage & Finance Consultation', 3600, 0.00, 'AUD', true)
ON CONFLICT DO NOTHING;

-- Seed Published Forms (Contact Us & Purchaser Form)
INSERT INTO forms (slug, title, status)
VALUES 
  ('contact-us', 'Contact Us Form (697)', 'published'),
  ('i-am-purchaser', 'New Client Purchaser Form (5116)', 'published'),
  ('i-am-vendor', 'New Client Vendor Form (5121)', 'published'),
  ('appointment-booking-form', 'Appointment Booking Form (5251)', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Seed Form Bindings
DO $$
DECLARE
  v_contact_id uuid;
  v_purchaser_id uuid;
  v_vendor_id uuid;
  v_appointment_id uuid;
BEGIN
  SELECT id INTO v_contact_id FROM forms WHERE slug = 'contact-us';
  SELECT id INTO v_purchaser_id FROM forms WHERE slug = 'i-am-purchaser';
  SELECT id INTO v_vendor_id FROM forms WHERE slug = 'i-am-vendor';
  SELECT id INTO v_appointment_id FROM forms WHERE slug = 'appointment-booking-form';

  IF v_contact_id IS NOT NULL THEN
    INSERT INTO form_bindings (form_id, path, placement, active)
    VALUES (v_contact_id, '/', 'footer_enquiry', true)
    ON CONFLICT (path, placement) DO NOTHING;
  END IF;

  IF v_purchaser_id IS NOT NULL THEN
    INSERT INTO form_bindings (form_id, path, placement, active)
    VALUES (v_purchaser_id, '/nc/i-am-purchaser', 'page', true)
    ON CONFLICT (path, placement) DO NOTHING;
  END IF;

  IF v_vendor_id IS NOT NULL THEN
    INSERT INTO form_bindings (form_id, path, placement, active)
    VALUES (v_vendor_id, '/nc/i-am-vendor', 'page', true)
    ON CONFLICT (path, placement) DO NOTHING;
  END IF;

  IF v_appointment_id IS NOT NULL THEN
    INSERT INTO form_bindings (form_id, path, placement, active)
    VALUES (v_appointment_id, '/appointment-booking-form', 'page', true)
    ON CONFLICT (path, placement) DO NOTHING;
  END IF;
END $$;

-- 17. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies:
-- 1. Public can read active branches
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'branches' AND policyname = 'Public can view active branches') THEN
    CREATE POLICY "Public can view active branches" ON branches FOR SELECT USING (active = true);
  END IF;
END $$;

-- 2. Public can read published content items
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_items' AND policyname = 'Public can view published content items') THEN
    CREATE POLICY "Public can view published content items" ON content_items FOR SELECT USING (status = 'published');
  END IF;
END $$;

-- 3. Public can read enabled navigation items
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'navigation_items' AND policyname = 'Public can view enabled navigation items') THEN
    CREATE POLICY "Public can view enabled navigation items" ON navigation_items FOR SELECT USING (enabled = true);
  END IF;
END $$;

-- 4. Public can read published forms and versions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forms' AND policyname = 'Public can view published forms') THEN
    CREATE POLICY "Public can view published forms" ON forms FOR SELECT USING (status = 'published');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'form_versions' AND policyname = 'Public can view published form versions') THEN
    CREATE POLICY "Public can view published form versions" ON form_versions FOR SELECT USING (state = 'published');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'form_fields' AND policyname = 'Public can view form fields for published versions') THEN
    CREATE POLICY "Public can view form fields for published versions" ON form_fields FOR SELECT USING (
      EXISTS (SELECT 1 FROM form_versions fv WHERE fv.id = form_fields.form_version_id AND fv.state = 'published')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'form_bindings' AND policyname = 'Public can view active form bindings') THEN
    CREATE POLICY "Public can view active form bindings" ON form_bindings FOR SELECT USING (active = true);
  END IF;
END $$;

-- 5. Public can view active services
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Public can view active services') THEN
    CREATE POLICY "Public can view active services" ON services FOR SELECT USING (active = true);
  END IF;
END $$;

-- 6. Public can subscribe to newsletter
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscriptions' AND policyname = 'Public can subscribe to newsletter') THEN
    CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 7. Service role bypasses RLS automatically; Authenticated staff with roles can access management tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Authenticated staff can view submissions') THEN
    CREATE POLICY "Authenticated staff can view submissions" ON submissions FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid())
    );
  END IF;
END $$;

-- ============================================================================
-- End of Initial Schema Migration
-- ============================================================================
