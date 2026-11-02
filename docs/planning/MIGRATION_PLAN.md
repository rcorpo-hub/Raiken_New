# WordPress/PHP to Next.js migration plan

Status: future work only. The current site remains operational until the replacement passes acceptance. No export was imported, no production database was connected, and no hosting/DNS change was made during planning.

## Preconditions and source of truth

The saved local SQL is an earlier Raiken 1.0.2 snapshot, while current code is 2.0.4. It cannot be treated as the final production baseline. The owner or authorised administrator must provide a fresh export and file manifest through a protected process. If production access remains unavailable, continue development on synthetic data and supplied exports; do not label the final import verified.

Create a migration ledger keyed by source system, namespace, table and ID. Each source row/file is transformed, archived, quarantined or excluded with an approved reason. Store original bytes/hash in a restricted archive when necessary. Import runs have immutable manifests, adapter versions, checkpoints and reconciliation totals. Never use numeric WordPress IDs alone to deduplicate across source prefixes or earlier Raiken tables.

## Workstreams

| Stream | Extract | Transform / preserve | Validation and continuity |
|---|---|---|---|
| Content | Pages/posts/revisions/terms/menus/headers/footers/popups, metadata, theme blocks and inline scripts | Convert WPBakery/DesignThemes/slider shortcodes to approved blocks; remove executable source JS; preserve text/headings/CTA/alt/SEO and publication state | Compare each published route and key rendered section; unresolved shortcode => migration issue; old site remains authoritative until approved |
| Public media | Attachment records plus file tree/derivatives | Hash/name/size/type/usage manifest; dedupe by verified hash only; preserve alt/captions and references | Every referenced asset resolves; classify private vs public before upload; do not copy entire uploads tree as public |
| Forms | Published definitions/backups, `_super_*`, current `_rkf_*`, bindings, popup triggers, settings | Per-form schema/version mapping, stable keys, exact options/required/rules/repeats/calculations/consent/routing; distinguish old and live purchaser/vendor variants | All 31 definitions accounted for; owner approves archive/unplaced decisions; unsupported feature is a blocker, never silently omitted |
| Historical submissions | Contact-entry posts/raw metadata plus newer native Raiken records and earlier `rkf_entries` | Preserve original form/status/date/reference and raw data; safely decode serialized strings; flag partial historical schema; encrypt answers/archive | Source count = migrated + quarantined + approved excluded; compare raw hash and decoded golden samples; rerun imports without duplicates |
| Documents/signatures | Legacy file/base64 references and private-file metadata/manifests | Resolve locally/approved source; content/hash/size/scan; move into private storage, preserve filename/display meaning; retain missing references explicitly | No public private documents, all existing references mapped or reported missing; never fetch arbitrary URLs from untrusted record content |
| Customers | Bookly customers, form applicant identities, ticket requesters, WP associations | Maintain source identities; reviewed contact/relationship mapping; no automatic person merge on email | Duplicate/orphan report, shared-address test, history linkage and admin-scope check |
| Booking | Services/staff/service mappings/availability/breaks/holidays, appointments, customer links, payments, notification settings | Preserve durations/buffers/status/capacity, distinguish preferred-time requests; source timestamps converted only after semantics approval | Counts/status/date distributions, future schedule comparison, concurrent booking/DST/cancel tests; keep Bookly route until full parity |
| Support | Identify actual legacy `wpsc_*` + thread-post or modern `psmsc_*` source; settings/attachments/assignments | Preserve requester, thread ordering, public/internal message visibility, statuses/categories/priorities/rules | Every message/ticket attachment reconciled; internal notes never public; current contact fallback is not parity |
| Authentication | Approved user list, role assignments and source links | Invite/reset verified users in Supabase; review privileges; no direct WP password-hash/session/OTP import | Role/MFA/login/revocation tests; existing external software accounts remain separate |
| Newsletter | Newsletter and Acy source statuses, lists, consent/unsubscribe/suppression records | Suppression wins; service enquiries do not create marketing consent; uncertain consent => no send | Opt-in/unsubscribe history and dedup reviewed; no historical campaign or notification replay |
| SEO/URLs | Actual page parents, post permalink pattern, Yoast originals, Redirection rules, external links and sitemap | Preserve canonical paths, titles/descriptions/social metadata; maintain exact approved redirects, avoid broad catch-all redirects | Crawl path/status/canonical/headings/assets, sitemap comparison, no private/indexed preview pages |
| Integrations | Enabled transport/calendar/meeting/analytics/payment/autocomplete/dialer usage and account ownership | Approved replacement adapters; reauthorise providers; never copy old secrets into source code | Sandbox/capture before controlled production verification; unresolved dependency keeps legacy workflow available |
| Operations | Legacy mail/log/security/cache/plugin tables | Archive only approved business evidence; exclude transient caches, tokens and irrelevant vendor internals with ledger reasons | No sensitive snapshots in Git/deployments; restore rehearsal covers both DB and object data |

## Form migration procedure

1. Choose purchaser copy 5116 as complex pilot and contact 697 as a simple transport baseline. Validate every branch and actual recipient routing; do not assume the older 4197 definition is the live purchaser form.
2. Export authoritative metadata without executing PHP objects. Preserve original ID and checksum. If Raiken-specific edits differ from original Super Forms, present a diff for owner selection; do not blindly let an old backup override the live variant.
3. Convert to the versioned safe schema. Compare field names/types/options/defaults/required masks/visibility/repeat bounds/formulas/signatures/uploads/redirects/wording. Build an exceptions ledger for unsupported behaviour.
4. Render and test synthetic valid/invalid/branch fixtures. Check accepted encrypted payload against expected typed answers and source calculations.
5. Verify actual storage, downloads and captured notifications. Only after acceptance migrate the remaining forms in complexity groups.
6. Freeze accepted form versions before final import. Historical entries can refer to explicit partial legacy versions when the exact old form definition is unknowable; expose this limitation in admin.

## Data conversion safeguards

MySQL dumps are parsed offline and transformed; never execute them in PostgreSQL. Treat zero/invalid dates, nulls, encoding, serialized-length errors, duplicate keys, lost attachment paths and orphan foreign keys as explicit issues. Preserve original timezone/date strings in the archive. Global snapshot timezone is Australia/Adelaide, but staff values are NULL; investigate effective Bookly semantics before converting stored appointment times. Preserve birth dates as `date`, not timezone-shifted instants.

Do not import WordPress salts, user sessions, password reset tokens, plugin licences, provider OAuth credentials, SMTP passwords or public meeting secrets into the target data model. Public configuration is allowlisted. Raw archives are encrypted and inaccessible to public/ordinary content editors.

## Rehearsal and validation stages

1. Synthetic development: validate adapters using generated/redacted fixtures, including damaged serialized strings and missing files.
2. Restricted real-data rehearsal, only after explicit handling approval: import source snapshot to an isolated staging environment, no live email, no public previews with customer data.
3. Reconcile counts/hashes/links/status/date distributions and source-to-target spot checks. All critical discrepancies are resolved or have approved quarantine/continuity disposition.
4. Restore test: rebuild a fresh staging database and objects from backups, reconnect application, verify permissions and an example of every major entity. Record actual time and losses against proposed RTO/RPO.
5. Owner UAT: form/booking/support/customer/admin workflows, then formal release checklist with named approver and exact source manifest/commit.

## Cutover: one writer at a time

Prefer a full rehearsal followed by an approved short write-freeze and final delta, rather than untested two-way synchronisation. Public old pages can remain available while write entry points display a clear temporary pause/redirect; never claim a paused form was received. Establish how old cached form pages and in-flight requests are blocked, finished or redirected at the old handler before the switch.

1. Verify production DB/file backups and restoration path; identify DNS/hosting operator and rollback owner. Current user has not provided that infrastructure access.
2. Lower only appropriate web-record TTLs in a separately approved change; leave MX/TXT/email/subdomain records intact.
3. Publish a maintenance/write fence for forms, booking, support, CMS/admin and background changes on the old source. Drain in-flight submissions/jobs and record high-water marks. If any writer cannot be fenced or observed, postpone the cutover.
4. Export/reconcile final deltas, including updates/deletions and files, not only new numeric IDs. Import idempotently and reconcile final manifests. Do not assume an ID watermark detects edited old records.
5. Validate the staged production deployment with production configuration and non-sending probes. Confirm real mail sender/private storage/monitoring/readiness through an authorised operator.
6. Switch approved web DNS/routing to Vercel; preserve external software/conveyancing subdomains. Keep the old origin protected and write-fenced through DNS propagation. Old cached intake must not remain a second independent writer.
7. Enable new intake, controlled production email and background workers in the agreed sequence. Run one explicitly approved synthetic production smoke test per critical workflow and check persistence, recipient and private downloads. Do not use real client data for tests.
8. Monitor errors, intake counts, queue age, delivery events, bookings, support activity and missing routes. Keep old files/database/backups recoverable throughout the agreed rollback period.

## Rollback

Before any new production writes, DNS/routing can return to the old site using the rehearsed switch procedure. After accepting new records in Supabase, pause new writes and reconcile their submissions/files/bookings/tickets before re-enabling old writes. Do not restore the old database wholesale and lose new records, and do not assume a Vercel frontend rollback reverses schema/data.

Use rollback-compatible additive migrations. If old WordPress cannot represent newly collected fields/workflows, maintain a protected read-only target ledger and an agreed operational queue; do not silently discard data. Keep mail jobs idempotent and never replay migrated captured or historical messages during rollback. Document actor, timestamps, manifests, affected references and customer communication responsibility.

Suggested rollback triggers pending owner approval: confirmed sensitive-data exposure; inability to persist intake; wrong-recipient delivery; sustained critical API errors; double booking; unresolved final reconciliation. Missing non-critical visual polish alone should not force a data rollback. End the old system only after the owner signs off on data, operational history, retention, redirects and a completed restore rehearsal.
