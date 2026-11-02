# Proposed application folder structure

Planning only: none of the application files or subdirectories below has been created. Existing location: `C:/Users/igl21/Local Sites/raiken-corp/Raiken_new_website`. Do not create a second `rcorp_New` directory. The 17 current Markdown documents can move into `docs/planning/` during an approved implementation task; they are stored at the designated root for this planning phase.

```text
Raiken_new_website/
  docs/
    planning/                 # These 17 approved planning documents
    decisions/                # Architecture/business decisions and approvals
    operations/               # Release, rollback, restore, incident runbooks
    migration/                # Redacted mappings and reconciliation reports only
  src/
    app/
      (public)/
        layout.tsx
        page.tsx
        blog/...
        appointment/...
        appointment-booking-form/...
        support/...
        nc/i-am-purchaser/...
        nc/i-am-vendor/...
        [...path]/page.tsx      # Allowlisted published content/form bindings
      (auth)/auth/
        sign-in/...
        callback/route.ts
        verify-mfa/...
      (admin)/admin/
        layout.tsx
        page.tsx
        content/...
        forms/[id]/...
        submissions/[id]/...
        customers/[id]/...
        appointments/...
        appointment-requests/...
        support/[id]/...
        reports/...
        media/...
        users/...
        roles/...
        audit/...
        settings/...
      forms-embed/[slug]/page.tsx
      api/
        forms/[slug]/sessions/route.ts
        forms/[slug]/submissions/route.ts
        uploads/intents/route.ts
        uploads/[id]/complete/route.ts
        appointments/availability/route.ts
        appointments/holds/route.ts
        appointments/confirm/route.ts
        appointments/[id]/cancel/route.ts
        appointments/[id]/reschedule/route.ts
        appointment-requests/route.ts
        admin/forms/...
        admin/submissions/...
        admin/customers/...
        admin/support/...
        admin/exports/route.ts
        admin/files/[id]/download/route.ts
        webhooks/email/route.ts
        internal/jobs/route.ts
      sitemap.ts
      robots.ts
      error.tsx
      not-found.tsx
    modules/
      content/                # Block schemas, CMS services, publication/revision
      forms/
        schema/               # Versioned declarative types and allowlists
        rules/                # Rule dependency graph and safe arithmetic
        renderer/             # Accessible fields, steps, repeats and signatures
        builder/              # Admin draft editor and preview
        server/               # Authoritative validation/publish/intake services
        migration/            # Mapping logic; no live source data
      submissions/            # Read/review/export, encrypted answers
      customers/              # Contacts, associations and reviewed merges
      appointments/           # Availability, holds, scheduling and requests
      support/                # Tickets, messages, notes and requester scopes
      notifications/          # Templates, routing, outbox and delivery events
      files/                  # Intents, quarantine, scanning and downloads
      analytics/              # Authorised aggregates; no raw-answer tracking
      identity/               # Staff invitations, roles, permissions, MFA gates
      audit/                  # Append-only event interfaces
    components/
      ui/                     # Reviewed shadcn/Radix component source
      public/                 # Header, footer, navigation, content blocks
      admin/                  # Shell, tables, filters and permission affordances
      feedback/               # Loading, empty, denied, retry and error states
    lib/
      supabase/
        browser.ts            # Publishable key only
        server.ts             # Verified caller session; RLS applies
        privileged.ts         # server-only; narrowly imported by intake/jobs
        proxy.ts              # Session refresh helper for selected Next version
      auth/                   # requireIdentity/requirePermission/resource scope
      validation/             # Shared input schemas and size/range bounds
      security/               # CSRF, headers, tokens and persistent rate limits
      encryption/             # Envelope/key-service boundary; server-only
      observability/          # Redaction, request IDs and alert interfaces
      config/                 # Validated environment configuration
    types/
      database.generated.ts
    styles/
      globals.css
      tokens.css
    proxy.ts                  # Framework-version-matched session helper only
  supabase/
    migrations/               # Reviewed SQL migrations only after approval
    tests/                    # RLS, grants and transaction tests
    functions/                # Bounded scanner/mail/export worker if selected
    seed.sql                  # Synthetic fixtures only
  scripts/
    migration/                # Dry-run ETL, checkpoints and manifests
    verification/             # Link, secret, artifact and reconciliation checks
  tests/
    unit/
    integration/
    e2e/
    accessibility/
    fixtures/                 # Synthetic/redacted and explicitly classified
  public/                     # Approved public marketing assets only
  .github/workflows/          # CI/release workflows after explicit setup approval
  CLAUDE.md                   # Repository boundaries and development workflow
  AGENTS.md                   # Agent constraints and docs-routing rules
  .gitignore
  .env.example                # Names/descriptions only; never real credentials
  package.json
  pnpm-lock.yaml
  next.config.ts
  tsconfig.json
  eslint.config.mjs
  playwright.config.ts
```

Route groups in parentheses do not change URL paths. Catch-all routing must reject reserved prefixes and must not expose database slugs for admin-only records. A future requester portal may add `/portal`, but it is not an assumed launch requirement.

## Module contracts

- UI components call module services; domain rules must not be duplicated inside page files.
- HTTP handlers validate transport input, derive the caller, call services and return safe results. Services implement business rules and transactions; repositories enforce scope.
- Public schemas/types cannot import privileged clients, encryption keys or recipient settings. Use `server-only` boundaries and a build/test check for accidental client imports.
- Form rules/calculation code can be shared with the browser; authoritative schemas/settings and final acceptance remain server-owned.
- SQL migrations are the single schema history. Generated types reflect the reviewed schema, not a second hand-maintained definition.
- Worker code uses persisted jobs/leases; no private document or raw export is stored inside `public/` or committed fixtures.

## Repository boundary

Initialise a future private Git repository inside the new folder only after approval. Do not initialise Git at the enclosing WordPress site root. Exclude `../app`, `../conf`, `../logs`, `../.diagnostics`, SQL, backup ZIPs, WordPress credentials, private uploads and browser traces. A new build/deployment root must be exactly this new application directory. The existing `wp-content/package.json` is export metadata and must not be reused as the application manifest.
