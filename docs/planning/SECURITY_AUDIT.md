# Security assessment and target controls

Date: 2026-11-02. Scope: local custom code, selected vendor integration handlers, static export, prior reports and representative public UI. No penetration testing, active exploit, private production access or new security certification was performed.

## Existing assessment

| ID / priority | Evidence and finding | Consequence / planning action |
|---|---|---|
| S01 / high deployment risk | VERIFIED local `app/public/database.sql` and `local-xdebuginfo.php` exist. HTTP exposure not tested | Never copy public SQL, diagnostic PHP, configuration or customer exports into new Git/Vercel/public assets. Owner must inspect production exposure separately |
| S02 / high | DOCUMENTED prior unsigned access to a historical Super Forms file; current new-file code stores outside web root | Classify/migrate legacy uploads to private storage; new protections do not retroactively protect static old files |
| S03 / high | VERIFIED Simple Estimator `dt_estimator_mail` reads posted recipient/subject/HTML and is registered for anonymous AJAX; no nonce/recipient allowlist visible in that handler | Static mail-abuse/input risk if endpoint active; production exposure untested. Future endpoint must own recipient/pricing configuration. No fix authorised in this planning task |
| S04 / medium-high | VERIFIED export/code drift and SupportCandy schema mismatch | Cannot infer production security from installed code or old snapshot. Fresh export and effective-runtime settings required |
| S05 / high maintenance | DOCUMENTED historical production PHP 7.4.34; actual current runtime unknown | Supported runtime upgrade remains an old-site operation needing separate approval; new Next runtime has its own support lifecycle |
| S06 / medium | VERIFIED theme `hide_plugins` hides ManageWP Worker from the plugin list; MU loader exists | Integration inventory must include hidden/MU/drop-in components; not evidence of malicious use |
| S07 / medium | VERIFIED local form capture defaults; DOCUMENTED production purchaser mail non-delivery | Loss of notification visibility; require explicit queue/status monitoring and delivery receipts |
| S08 / high privacy | VERIFIED types of tax/finance/identity data; installed session-recording integration, runtime unknown | Sensitive routes must exclude recording/analytics payloads and public indexing; encrypt protected answers and restrict exports |
| S09 / unknown vendor risk | Many installed plugins and old versions, including duplicate Super Forms and old WPBakery; no vulnerability database scan performed | Do not claim specific CVEs or a clean site. Maintain supported old-site components separately while migration proceeds |

### Controls directly verified in Raiken Forms 2.0.4 code

`rkf_submit` checks method, production HTTPS, origin, cookie-bound expiring HMAC token, WordPress nonce, honeypot, rate limits, request shape and payload size. Server validation enforces known choices, required rules, hidden-branch exclusion, date/email/numeric formats and recomputed formulas. Prepared queries and WordPress APIs handle database writes; output escaping and CSV formula-prefix handling exist. `unserialize` disallows class construction.

Entries use private non-public post types, exclude REST/search, and enforce administrator capabilities. Action nonces guard admin changes/downloads/exports. Files receive random names, content/size validation, restricted paths and guarded attachment responses. Mail bodies contain a reference/protected link rather than submitted sensitive content. Session cookie flags include HttpOnly, SameSite and Secure on HTTPS. Requests are deduplicated using atomic option keys.

These verified controls do not constitute complete production security. DOCUMENTED earlier local results list 81 targeted security checks, 245 storage regressions and unchanged fingerprints for 2,118 historical entries. They were not rerun here and do not verify the new planned system.

## Proposed security boundary

1. Public visitors can read published content and an allowlisted form definition. They cannot query submissions, customers, appointments with identity data, support messages, internal rules, audit events or private storage.
2. Privileged UI is under `/admin`, but route naming and hiding buttons are not controls. Every server mutation/read verifies an authenticated identity, permission, current role/branch membership and, for sensitive actions, MFA assurance.
3. Supabase RLS is enabled on every exposed application table. Anonymous access is default-deny except explicit public projections. Ordinary admin access uses the caller's JWT and RLS. A dedicated server-only privileged client is reserved for public intake, workers and restricted administration that needs bypass; it must apply explicit checks because its secret bypasses RLS. [Supabase key guidance](https://supabase.com/docs/guides/getting-started/api-keys).
4. Role assignment comes from protected database records, never editable signup metadata. Self-service public signup is disabled unless an approved support/customer portal needs it. Staff accounts are invited; users cannot self-promote.
5. Session verification follows the current Supabase SSR flow, with validated claims and refreshed cookies. Do not use an unverified server `getSession()` result as identity proof. Role revocation is enforced on subsequent protected operations; logout/revocation and high-risk step-up are tested. [SSR guidance](https://supabase.com/docs/guides/auth/server-side/nextjs).

## Threat/control/test mapping

| Threat | Target requirement | Test evidence required |
|---|---|---|
| SQL injection | Parameterised database calls; allowlisted filter/sort identifiers; typed RPCs; no raw user SQL | Injection strings stored/rejected as data; no query shape change |
| XSS | React escaped text; sanitised allowlisted rich-text blocks; no arbitrary HTML/JS in builder; restrictive CSP | Stored/reflected payloads in form labels, answers, CMS and support replies |
| CSRF | Same-origin checks for cookie-auth mutations; appropriate anti-CSRF token/Server Action protections; secure cookies | Missing token, foreign origin and cross-site form requests denied |
| IDOR | Resource lookup scoped by current admin permission/branch and parent record; opaque IDs insufficient alone | Change submission/file/customer/ticket IDs and prove denied |
| Role escalation | Protected RBAC tables/functions; no role claims from editable user metadata; server/RLS checks | Normal/content account cannot grant roles or read tax data |
| Session theft | HTTPS, secure cookie handling, bounded sessions, MFA and revocation; no tokens in URLs/logs | Expired/replayed/revoked session and auth callback/redirect tests |
| Spam/denial | Shared persistent rate counters, server-issued sessions, quotas, challenge escalation, bounded JSON/rules/repeats | Concurrent limits; IP-proxy handling; costly upload rejection before scans |
| Formula injection | Declarative arithmetic/rule AST; no eval; bounded recursion/cycles rejected | Executable expressions, circular rules, overflow and CPU limits |
| File attacks | Quarantine, content inspection, malware scan, decompression limits, filename normalisation and no execution | Disguised scripts, polyglots, macros, archive bombs, malformed images |
| Storage escape | Generated object paths; file-session-version linkage; no upsert/reassignment | Another session cannot complete, attach, list or overwrite objects |
| Data exfiltration | Admin scopes and MFA, export permission/reason, audit, encrypted answers and expiring export artifacts | Role matrix, denied bulk dumps, safe CSV and link expiry |
| Sensitive logging | Structured allowlisted logs; no answers/documents/credentials/cookies in errors or analytics | Automated trace/bundle/log inspection with seeded sensitive markers |
| SSRF/webhooks | Approved destinations only; signed webhook input; no generic URL fetch/import feature | Private-network/destination rejection, replay and forged signature tests |
| Cache leak | Public content only cacheable; sessions/admin/personal APIs private no-store | Two-user/cache simulation, preview isolation, no shared auth responses |

## Data and document protection

Proposed sensitive form answers and raw legacy records use authenticated envelope encryption, with a key reference and encrypted bytes stored in the database. The key-management provider and operational ownership require approval before implementation. A separate non-sensitive summary supports counts without decrypting answers. Generic customer contact columns remain restricted by RLS; high-risk identifiers stay in encrypted details. Do not use emails/TFNs in object names, analytics properties, queue bodies or logs.

Public marketing media and sensitive documents use separate buckets. Quarantine uploads cannot be downloaded by applicants or admins until inspection succeeds. Storage policies enforce the same parent-record permission as database reads. New signed download links have a short application-selected lifetime, suggested 60 seconds, and are bearer capabilities while valid. Deleting a database row does not automatically delete a storage object; retention/deletion workers must reconcile both. [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

Malware scanning is a separate worker capability; file signatures alone are insufficient. Quarantined files can remain associated with a received submission while scanning, but the admin sees a pending/blocked state and cannot download them. A receipt must state received rather than implying documents were verified. Scanning outages trigger alerts and never mark files clean automatically.

## Secrets and environments

Required names/purposes, never values:

| Item | Placement and restriction |
|---|---|
| Supabase project URL / publishable key | Browser-compatible public configuration; RLS still required |
| Supabase secret key / legacy service-role key | Server-only protected environment; no `NEXT_PUBLIC_` prefix, client imports, repository, previews of untrusted code or logs |
| Migration database connection | Protected migration runner/owner-managed secret; no application bundle or routine AI context |
| Mail transport credentials / webhook verification secret | Server/worker only; separate staging capture and production sender |
| Encryption key reference / KMS identity | Protected server integration; key material never stored alongside ciphertext or in this package |
| Job authentication, challenge validation, export-signing credentials | Server-only scoped secrets; separate by environment |
| GitHub/Vercel/Supabase management authorisation | Owner-controlled OAuth/scoped credentials; not runtime app credentials |

Development and previews use synthetic data and separate Supabase resources; real-data staging requires explicit restricted handling. Preview builds never receive production secrets. CI protects secret-bearing steps from arbitrary PR code. Public assets are allowlisted; `.sql`, backups, dumps, `.env`, WordPress configs, traces and auth-state exports must be blocked from Git and deployment artifacts.

## Operational release gates

RLS and storage-denial tests must pass directly against APIs, not only through the UI. Restore both database and object backups in a rehearsal. Review all privileged functions, triggers, grants and SECURITY DEFINER search paths. Log access/exports/role changes without recording answers. Require MFA for sensitive administrators, scheduled access reviews and a documented incident owner. Retention periods, consent wording, tax/identity requirements and regional processing decisions require qualified owner review; no legal compliance guarantee is made here.
