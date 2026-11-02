# Existing database audit

Date: 2026-11-02. Static source: `app/sql/local.sql`, 243,721,603 bytes. VERIFIED means export evidence, not a query of production. No database connection or migration was made.

## Prefixes and age

The selected configuration uses `servmask_prefix_`. The dump contains 224 CREATE TABLE statements: 212 selected-prefix tables and 12 additional `wp_` core tables. The second set has its own small posts/users/options dataset and must be excluded from the principal import unless separately identified. IDs are unique only within their source namespace.

Raiken Forms in the dump is version 1.0.2, with 31 `rkf_forms`, 3 `rkf_entries`, 2 `rkf_files`, 6 `rkf_mail` records, and no `_rkf_entry` markers in core postmeta. Current local plugin files are 2.0.4 and use existing WordPress tables. This discrepancy establishes snapshot age relative to the code; it does not establish an exact export timestamp or production state.

## Source entities and record counts

| Source table/entity | Verified exported count | Important keys/data | Migration treatment |
|---|---:|---|---|
| `posts` | 6,467 | ID, post_type/status, post_parent, content, dates, slug | Classify by type and namespace |
| `postmeta` | 25,858 | meta_id, post_id, meta_key/value; PHP serialization | Decode offline without PHP object construction; preserve raw bytes |
| Published pages/posts | 35 / 2 | Parent-derived paths, page-builder content, SEO meta | Structured content blocks and URL manifest |
| Published `super_form` | 31 | `_super_elements`, `_super_form_settings` | Versioned forms; merge later `_rkf_*` changes with owner review |
| `super_form:backup` | 1,285 | Historical form definitions | Archive/version mapping; no automatic publication |
| `super_contact_entry` | 2,118 | 14 read / 2,104 unread; original form IDs in parent/meta | Encrypted submissions with original status and source IDs |
| WordPress attachments | 2,113 | `_wp_attached_file`, metadata/derivatives | Asset manifest; do not equate attachment count to upload files |
| `users` / `usermeta` | 6 / 206 | User identity, password hashes, capabilities, sessions | Invite approved admins; preserve legacy association, no session migration |
| `bookly_appointments` | 517 | id, staff_id, service_id, location_id, start_date/end_date, provider references | Appointment record plus source archive |
| `bookly_customer_appointments` | 515 | customer_id, appointment_id, payment_id, status, persons, custom_fields | Attendees/booking links; audit missing links |
| `bookly_customers` | 406 | id, wp_user_id, names/email/phone, custom data | Customers/contact records with dedup review |
| `bookly_services` / `bookly_staff` | 5 / 5 | durations, buffers, capacity, visibility, external credentials | Service/resource records; do not copy credentials |
| `bookly_staff_schedule_items` / `bookly_staff_services` | 35 / 21 | staff/day/time and offered services | Availability/service assignments |
| `bookly_payments` | 8 | type, monetary totals, currency/settings, status, parent refs | Legacy payment ledger; no payment capture triggered |
| `bookly_notifications` | 96 | type, timing, recipients/templates/settings | Classify enabled rules, not all templates as active |
| `wpsc_ticket` / `wpsc_ticketmeta` | 167 / 553 | ticket ID/status/category/priority, requester, assignment/meta | Tickets and typed custom metadata |
| `wpsc_ticket_thread` posts | 413 | content, authors, dates, relationship metadata | Customer replies/internal notes after relationship verification |
| `newsletter` | 1 | status, subscription/list flags, consent-related logs | Consent and suppression ledger |
| `acym_user` | 283 | active, confirmed, source, lists, history | Historical marketing data; consent is not inferred |
| `cf_forms` / `cf_form_entries` | 30 / 1 | Caldera form_id/config and entry values | Legacy archive/review; avoid duplicate form creation |
| `redirection_items` | 2 | source URL, status, action/code/target | Preserve known redirects |
| `wpmailsmtp_emails_log` | 22 | delivery/debug records; may contain personal data | Operational archive only if required; do not import old credentials or send historical mail |

Family inventory: 42 Bookly tables, 22 AcyMailing tables, 14 Revolution Slider tables, 10 Kirki tables, 9 Caldera tables, 7 Newsletter tables, 7 WPForms tables, 7 WP Mail SMTP tables, 7 Yoast tables, 4 earlier Raiken tables, 3 legacy support tables, security/cache/commerce/core tables. A table's existence does not establish active functionality. Complete table classification is a migration deliverable; transient/cache/security-session tables should normally be excluded with a ledger entry.

## Existing relationships and schema cautions

- WordPress `posts.ID` relates to `postmeta.post_id`; `posts.post_parent` is overloaded and varies by post type. Do not assume every contact-entry parent is correct without checking `hidden_form_id`.
- WordPress uses numeric keys and weak application-enforced relationships. Build an orphan report before introducing strict foreign keys in PostgreSQL.
- Bookly appointments join service/staff; customer appointments join appointment/customer/payment. Different appointment/link counts are not proof of corruption: audit standalone/imported appointments and group links individually.
- Bookly status distribution in links: approved 468, cancelled 37, pending 10. Preserve source values separately from the target status mapping.
- Source services are Tax Return (30 minutes), Tax Return (For Two Person) (60 minutes), GST Return (30), Consulting (Advise) (30), Verification of Indentity (VOI) (30). All have capacity 1 and price 0.00 in this snapshot. Do not assume production pricing is zero. All eight payment rows are `local:pending` in this snapshot.
- Appointment start dates range from 2019-02-03 through 2026-10-19 in the available rows. Date ranges are not an assurance that future production bookings are included.
- Global WordPress timezone is `Australia/Adelaide`; five staff timezone values are NULL. Determine Bookly's effective source-time semantics before UTC conversion. Brisbane and Perth branches need their own IANA zones; a fixed Australian offset is incorrect during DST.
- Legacy ticket status IDs 50, 51, 52, 53 occur 114, 2, 1, 50 times respectively. Resolve their names/settings from the actual source; do not invent status meaning from numbers.
- Current SupportCandy installation code expects `psmsc_tickets`, customers, threads, attachments and agents. Those schemas are absent from this dump. Import adapters must identify the actual source format before choosing joins.
- SQL uses MySQL types, indexes, enum values, possible zero dates, charset/collation declarations and serialized strings. It cannot be executed as a Supabase/PostgreSQL migration.

## Sensitive data handling

Forms include tax, identity, birth date, signatures, finance and property information. Do not print answers, emails, tokens, password hashes or attachment paths into public reports or CI output. Keep a protected source archive and redacted fixtures. Marketing contacts, appointment customers, form applicants and WordPress users are distinct identities until linkage is reviewed. A shared email is not an automatic merge key for people or trusts.

DOCUMENTED earlier local history results: 1,798 entries decoded normally; 320 were recovered for viewing after serialized-length repair; zero unreadable in that specific report. Raw stored originals were reported unchanged. Recovery must retain the original bytes/hash and record the decoder version; never treat repaired content as a silently rewritten original.

## Pre-migration evidence required

Obtain a fresh owner-authorised export, all upload/private-file manifests, effective plugin versions/settings, enabled booking/notification rules and relevant source custom-field definitions. Produce counts by entity/status/form/branch/date, orphan lists, missing-file lists, SHA-256 manifests and a source-prefix register. Protect any real-source staging copy; use synthetic data for normal development and previews.

The target schema and import dependency order are in [DATABASE_SCHEMA_DESIGN.md](DATABASE_SCHEMA_DESIGN.md). No proposed foreign key, index, encryption step or RLS policy has been applied or tested yet.
