# Protected administration specification

Status: proposed; no dashboard or accounts created. The owner should be able to operate routine business workflows without editing code or using an AI assistant.

## Access model

Use `/admin` within the Next application with a separate layout/navigation and verified Supabase Auth session. Require MFA for sensitive administration. Roles are collections of explicit permissions, with branch scopes where appropriate. Content editors do not receive submission/customer/analytics access. Existing WordPress role assignments are reviewed, not blindly imported.

Proposed roles: owner, administrator, forms administrator, booking administrator, support administrator and content editor. Module administrators are authorised administrators for their module only. Reports remain restricted to explicitly authorised administrators. An optional customer/requester portal is a separate access model and is not granted any `/admin` access.

| Capability | Owner | Administrator | Forms admin | Booking admin | Support admin | Content editor |
|---|---|---|---|---|---|---|
| Grant roles / manage privileged settings | Yes | Only delegated subset | No | No | No | No |
| Content/media editing | Yes | By grant | No default | No default | No default | Yes |
| Draft forms / field rules | Yes | By grant | Yes | No | No | No |
| Publish forms / change notification routes | Yes | By grant | Separate publish/routing grant | No | No | No |
| Read tax/identity submissions | Yes within policy | Explicit sensitive-data grant | Separate grant, not implied by building forms | No | No | No |
| Export submissions / download documents | Separate audited permission | Separate audited permission | Separate grant | Booking documents only if authorised | Ticket attachments only if authorised | Public media only |
| Customer/appointment management | Yes | By grant | No default | Booking scope | Requester contacts within tickets only | No |
| Support replies/internal notes | Yes | By grant | No | No | Assigned ticket scope | No |
| Reports/audit | Explicit permission | Explicit permission | Forms reports by grant | Booking reports by grant | Support reports by grant | No |

Enforce this matrix in server services and RLS/storage rules, including direct HTTP requests. Disabled buttons alone are insufficient. Owner does not bypass legal holds or audited deletion rules.

## Module requirements

| Module | Functionality and UI components | Database dependencies | API/service needs | Permission |
|---|---|---|---|---|
| Dashboard | Received/review-pending counts, upcoming appointments, open tickets, failed mail/scans; dated cards and accessible compact charts; no raw answers | `daily_metrics`, safe submission/appointment/ticket aggregates, job state | Scoped aggregate endpoint with date/branch filters and explicit metric definitions | `reports.read` plus permitted modules/branches |
| Content management | Page/post list, block editor, SEO form, draft preview, revision compare, schedule/publish/archive | content items/revisions, bindings, navigation, redirects | Optimistic edits, preview tokens, publish transaction/cache invalidation | `content.edit`, separate `content.publish` |
| Form builder | Search/clone/imported forms, stable field keys, palette, sections/steps, accessible reorder, rules/choice editor, preview | forms/versions/field projection/bindings | Validate draft, rule dependency analysis, clone/new draft, compare/publish | `forms.edit`, `forms.publish` separately |
| Field management | Labels/hints/type/options/required/validation/classification, repeat groups, dependency warnings | form version schema/field projection | Validate field-type transitions and reference impacts | `forms.edit`; published schema immutable |
| Submission management | Filtered cursor table, reference/status/form/version/date/branch, decrypted detail, review notes, upload scan status, assignment if approved | submissions/reviews/files/consent/audit | Sensitive read with MFA/audit, status transition, export job | `submissions.read/review/export`, branch scope |
| Customer management | Person/company/trust records, contacts, related entities, source history, duplicate review and merge preview | customers/contacts/relationships/private details/mappings | Scoped search, update, merge transaction with preserved source links | `customers.read/manage`; private-details grant separate |
| Appointments | Day/week/list calendar, branch/staff/service filters, availability/holidays, holds, create/cancel/reschedule, audit and reminders | services/staff/availability/appointments/attendees/payment refs | Transactional scheduling RPCs, timezone display, conflict errors | `bookings.read/manage`; staff contact limited |
| Appointment requests | Preferred-time requests, contacted/booked/closed states, conversion to real booking after slot confirmation | appointment requests/submissions/appointments | Resolve request, create booking through same conflict-safe service | `bookings.manage`; access only request fields needed |
| Support | Ticket queues, category/priority/status, assignment rules, thread timeline, distinct public reply/internal note, verified requester identity, attachments | tickets/lookups/messages/assignments/rules/files | Ticket commands, separate note/reply, notify on permitted events | `support.read/manage`, assignment/branch scope |
| Analytics/reports | Defined conversion/volume/response/booking/mail metrics, accessible table alternatives, controlled exports | daily metrics and scoped operational summaries | Date range bounds, aggregate API, scheduled report jobs | `reports.read/export`; no raw-answer analytics |
| Users | Invite/resend invite, active/suspended state, MFA status, revoke access; no display of passwords | auth users/profiles, audit | Server-only invitation/disable/revoke with target validation | `users.manage`; sensitive grant confirmation |
| Roles/permissions | Role catalogue, permission/branch grants, effective-access preview, grant/revoke history | roles/permissions/assignments/branch access | Protected role-change transaction; prevent self-escalation/last-owner lockout | Owner or narrowly delegated `roles.manage` |
| Media | Public asset library, alt text, usage references, replacements/version history; private-doc access separate | file objects/content references/storage | Signed public-media upload intent, scan/publish, safe replacement | `media.manage`; cannot browse identity docs |
| Notifications | Routing rules, template previews, captured/queued/accepted/delivered/failed log, approved test destination, retry status | rules/jobs/events | Validate route, send explicit synthetic test, guarded retry only when appropriate | `notifications.manage`; test send is deliberate action |
| Audit logs | Filter actor/action/entity/time, protected export, access/download/role/publish history; no answer payload | append-only audit events | Bounded query and audited export | `audit.read/export` |
| Settings | Public branch contacts, consent text, retention policies, capture mode, approved integrations and readiness; credential status only | branches/settings/rules, environment validation | Allowlisted settings commands; no arbitrary env editing | `settings.manage`; production mail enable separate |

## Form creation and publishing workflow

1. Create a form or clone an existing version. Show original legacy ID, current version and all page bindings.
2. Add fields from an allowlist; choose stable keys, visible labels, instructions and data classification. Sensitive identifiers default to protected storage.
3. Build conditional/repeat/calculation rules with named fields/operators, not code. Show missing references, cycles, unbounded repeats and unreachable required fields immediately.
4. Configure receipt wording, internal routes and client confirmation from approved server-owned destinations. Public preview never displays recipients or secrets.
5. Preview desktop/mobile and generate synthetic branch cases. Show a version diff, including removed fields/routing/consent changes. Require a reason for changes to published behaviour.
6. Publisher approves; one transaction freezes the version/hash, field projection, bindings and audit event. In-flight authorised sessions retain their pinned version unless explicitly revoked.
7. A rollback publishes/selects a previously approved version for new sessions. Existing submissions retain their actual version. It never rewrites historical answers.

## Collection and review workflow

Visitor opens form -> short-lived session -> controlled uploads -> server validation -> encrypted persistence/outbox transaction -> durable reference receipt. Review queue shows pending scans and notification state independently. Administrator opens the record after MFA/permission/branch check, receives the correct version/consent labels, reviews answers, downloads clean files with audit and marks status. A corrupt/missing historical file displays a precise status, never an empty successful download.

Statuses proposed for submissions: received, needs_review, in_progress, completed, rejected, archived. These are business review statuses, separate from source read/unread and file/email statuses. Preserve the original status in legacy metadata.

Exports run asynchronously with allowlisted fields, filter scope and an export reason. Recheck permission both at generation and download. CSV escapes formula-triggering values; artifacts expire and never become public media. Bulk deletion is not included in the initial interface; retention/erasure has review, legal-hold and audit steps.

## Business workflows

- Customer merge: present candidate matches and affected links, choose a survivor, record rationale, preserve original IDs/mapping and merge history. Do not delete a source identity merely because email matches.
- Booking: select service/branch/staff, show timezone, query availability, hold slot, validate customer, atomically confirm. Conflict returns a fresh-choice prompt. Manual bookings use the same rules. Cancel/reschedule preserves the original event history.
- Support: create/import ticket, verify requester, apply deterministic assignment, publish customer-visible replies separately from private notes, preserve attachments and timestamps, close/reopen through defined transitions. Guest email access cannot reveal other requesters' tickets.
- Analytics: choose a date range/timezone/branch, show metric definition and update time, compare aggregates and drill only into permitted records. Restrict tiny cohorts if reporting could reveal private information.

## Interaction and error requirements

Use server pagination/filtering, labelled controls, visible keyboard focus, optimistic revision checks and confirmation for consequential actions. Preserve filter state in safe URL parameters; never put names/answers/tokens in URLs. Distinguish no records, filtered-empty, denied, expired session, conflict, offline, validation and service outage states. A network retry must not duplicate a submission/appointment/message. Do not claim an email was delivered when it was only queued or accepted.

## Acceptance gates

An owner can create/publish/rollback a form, update approved content, review a synthetic submission, access a permitted clean file, manage a booking/request/ticket, invite a limited administrator and inspect notification failures without source edits. Every action has permission/negative tests; sensitive access and changes produce audit events. Module tests and measurable thresholds are in [TESTING_AND_ACCEPTANCE_PLAN.md](TESTING_AND_ACCEPTANCE_PLAN.md).
