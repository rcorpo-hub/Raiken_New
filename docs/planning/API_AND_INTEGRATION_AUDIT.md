# API and integration audit

Status: planning only. Current observations refer to local code/static data unless explicitly marked public. No notification, booking, download-of-customer-data or production mutation was triggered.

## Existing entry points

| Entry point | Evidence / current behaviour | Authentication and data | Replacement contract |
|---|---|---|---|
| WordPress pages, shortcodes, theme templates | VERIFIED: `page.php`, WPBakery/DesignThemes; no standalone custom PHP application framework | Public pages; WP administrator editing | Next server-rendered routes and structured CMS |
| `[super_form]`, `[raiken_form]` | VERIFIED: `raiken-forms.php` registers handlers at init; takeover setting or absent original handler selects replacement | Public form metadata; original numeric IDs | Native form renderer; legacy ID-to-form mapping |
| `/forms-embed/{slug}/` | VERIFIED: rewrite rule, `rkf_standalone`; same-origin framing, no-cache, production HTTPS | Session cookie, nonce, signed token | Optional `/forms-embed/[slug]` using the same form engine and public schema projection |
| POST `/wp-admin/admin-post.php`, action `rkf_submit` | VERIFIED: session/token/origin/schema/file/rate checks; transaction and duplicate lock | Anonymous or authenticated applicant; private persisted entry | POST `/api/forms/[slug]/sessions`, POST `/api/forms/[slug]/submissions` |
| Actions `rkf_save_form`, `rkf_settings` | VERIFIED: capability and action-nonce guards | `manage_options` administrator | Permissioned admin mutations with CSRF/session validation |
| Actions `rkf_download`, `rkf_export` | VERIFIED: guarded downloads/export, path checks and CSV handling | Administrator only; sensitive output | Authorised short-lived download grants and asynchronous export jobs |
| Bookly frontend actions | VERIFIED: booking shortcode/frontend code; REST/API availability not established | Availability, booking/customer/provider references | Availability/hold/confirm/cancel/reschedule routes; existing tokens invalidated/reissued |
| SupportCandy AJAX/actions | VERIFIED: current-user, ticket, thread, guest-OTP and assignment modules; source schema mismatch | Requester and support administrator permissions, custom-field visibility | Ticket/requester access routes with explicit ownership, internal-note separation |
| Simple Estimator `dt_estimator_mail` / `dt_update_woo_cart` AJAX | VERIFIED: public hook registration and email handler; no published shortcode placement established | Current mail handler uses posted recipient/content values | Rebuild only if used; server-owned recipients/pricing, validated payload and abuse protection |
| WordPress REST `/wp-json/`, cron, XML-RPC | VERIFIED core files; exact enabled runtime endpoints not enumerated | Core/plugin-controlled auth and job semantics | No automatic proxy of the entire WordPress API; replace required contracts individually |

Raiken Forms uses WordPress admin-post handlers, not a custom registered REST endpoint. An anonymous AJAX hook alone does not establish a vulnerability; the handler's authorisation must be checked. Vendor endpoint names are not an exhaustive runtime route inventory.

## Integration register

| Integration | Current evidence | Preserve / replace / decision |
|---|---|---|
| WP Mail SMTP / mail provider | Installed 3.4.0; plugin calls `wp_mail`; purchaser failure reported | REQUIRES ACCESS to actual error/status/route. Choose verified SMTP/API transport, authenticated sender and delivery webhooks; do not assume copying WP settings configures Next |
| Bookly email/SMS/calendars/meetings | Tables and columns exist for notifications, Google/Outlook/Apple and meetings | UNKNOWN which credentials/features are enabled. Preserve booking continuity, separately approve calendar/SMS adapters and reauthorisation |
| Newsletter/AcyMailing/Sendinblue history | Current Newsletter code, old Acy tables, historical mailer log name | No live subscription provider established. Preserve consent/suppression before provider selection |
| Google Site Kit | Installed 1.190.0, historical export metadata | Current Analytics/Search Console linkage UNKNOWN; recreate only approved properties and consent behaviour |
| Smartlook | Installed 2.1.1; enabled production recording UNKNOWN | Disable replay on tax/identity/admin flows; do not copy recording scripts blindly |
| Maps/phone/SMS/WhatsApp | VERIFIED public links | Keep verified contact destinations; links are not proof of an API connection |
| Zoom, Google Meet, Webex, Skype | VERIFIED menu/contact link evidence | Review obsolete targets and public meeting details with owner; no automatic calendar integration assumed |
| External software `accounts.rcorpo.com` | VERIFIED public Software navigation | Separate app/repository; preserve link, no assumed shared login/password migration |
| Conveyancing subdomain / loan partner | VERIFIED redirect/content links | Keep external destination unless separately authorised to rebuild |
| Remote assistance download | VERIFIED menu metadata points to an installer | Owner must approve continued use/current source; do not download or execute it for planning |
| Wordfence/SiteGround/ManageWP | Installed code/export metadata; current hosting settings not accessed | Replace needed operational controls; remote-management rights must be explicit |
| Payment/PDF/address autocomplete/dialer/Zapier | Legacy settings/fields or installed capability, not confirmed live contracts | Do not invent active features. Owner must confirm usage, supported API, account ownership and parity |

## Proposed API contract catalogue

All names below describe future work. The API returns stable error codes and a request/reference ID, never SQL errors or secret configuration. Public definitions exclude email destinations, private calculation inputs, admin-only fields and integration credentials.

| Method / route | Request and response | Permission / invariants |
|---|---|---|
| GET `/api/forms/[slug]` | Published public form schema, immutable version/hash | Published only; safe cache of public schema, not applicant session |
| POST `/api/forms/[slug]/sessions` | Version, challenge result -> session ID and signed opaque token | Origin/CSRF strategy, rate/quotas, short expiry; cannot select arbitrary form version |
| POST `/api/uploads/intents` | Session, declared name/type/size/field -> object-specific signed upload token | Token proves form session; paths generated server-side, no upsert, bucket quotas; object goes to quarantine |
| POST `/api/uploads/[id]/complete` | Intent ID -> queued scan status | Session owns intent; verify actual object size/type/checksum; client cannot assert clean |
| POST `/api/forms/[slug]/submissions` | Version/token, answer JSON, upload IDs, idempotency key -> opaque receipt | Server rule validation/calculation; uploads tied to session/form; atomic submission/outbox; no answer echo |
| GET `/api/appointments/availability` | Service, branch, date window -> public slots | Strict bounded range; no customer or internal calendar data |
| POST `/api/appointments/holds` | Chosen slot/session -> expiring hold | Atomic conflict check, rate limit, authoritative duration and buffers |
| POST `/api/appointments/confirm` | Hold, validated contact, idempotency key -> receipt | Single confirmation, database conflict protection; email is asynchronous |
| POST cancel/reschedule route | Signed scoped capability or authenticated admin request | Expiry, booking ownership, recheck conflicts; no raw Bookly token reuse |
| POST `/api/appointment-requests` | Form-backed preferred times -> request receipt | Does not create a confirmed slot |
| Admin form/content/customer/booking/ticket routes | Versioned mutations, filters, cursor pagination | Verified admin identity, required permission, MFA and branch scope on every operation |
| POST `/api/admin/exports` | Allowlisted fields/filter/purpose -> job ID | Explicit export permission and audit; private object, expiration, no public CSV |
| POST `/api/admin/files/[id]/download` | File ID -> protected download or short-lived signed URL | Record access, scan state, permission, parent-record scope; audit |
| POST `/api/webhooks/email` | Provider event/signature -> acknowledged event ID | Verify raw-body signature/time; dedupe; no untrusted arbitrary status changes |
| POST `/api/internal/jobs` | Small job trigger -> accepted count | Machine auth; atomic claims, bounded batch, retries; no open cron URL |

Use Server Actions for suitable internal UI mutations and Route Handlers for explicit public/webhook contracts; both must call the same application services and enforce authorisation. There is no need for a second Express server at the proposed scale.

## Notification and upload contracts

Email transport must record queued, captured, accepted, delivered, bounced and failed separately. A `wp_mail()` success or provider acceptance is not inbox delivery. Capture mode is always enabled in non-production; turning it off must not replay old captured messages. Templates contain receipt information and authenticated admin links; no tax answers/documents/signatures. Notification routes map validated branch/office IDs to server-configured recipients.

Files go directly from the browser to Supabase quarantine using an authorised upload token. The Next endpoint receives metadata and IDs, not large document bodies. This avoids the documented Vercel Function 4.5 MB payload cap. Signed upload URLs currently have a two-hour provider lifetime; a short application session does not revoke an already issued storage capability. Use no-overwrite paths, quotas, completion checks and timed cleanup. [Vercel limits](https://vercel.com/docs/functions/limitations), [Supabase signed upload URL](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl).

Production transport/provider decisions, webhook secrets and external calendar credentials require later owner-controlled setup. Nothing was provisioned in this task.
