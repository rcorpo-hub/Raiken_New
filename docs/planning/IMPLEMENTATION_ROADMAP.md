# Implementation roadmap and approval gates

Status: planning complete; implementation awaits explicit owner approval. Folder: `C:/Users/igl21/Local Sites/raiken-corp/Raiken_new_website`. No future application directory, source file, migration, Git repository, dependency or deployment was created.

## Delivery principles

Keep the old PHP site operational until parity/UAT pass. Build vertical workflows with real persistence, permissions and error handling, not only visual screens. Validate the complex purchaser form early, then expand to all forms and operational modules. No feature is silently dropped; archive/defer decisions have owners and continuity paths. Production/data/infrastructure actions require separately scoped release authority.

## Phases

| Phase | Work and concrete deliverables | Dependencies | Exit gate / owner |
|---|---|---|---|
| 0 — scope and evidence | Approve database transition, folder, public/admin scope; fresh source/export and media manifest; confirm support version, form/rule inventory, provider/region/retention decisions; baseline current URLs | Planning package and owner decisions | Named business/technical/infrastructure owners; signed scope/continuity register; no credential values in documents |
| 1 — secure foundation | Approved private repository, compatible Next/TS/pnpm baseline, synthetic Supabase dev/staging, base schema/RLS, staff invite/MFA, server/client boundaries, CI/preview and secret exclusions | Phase 0; resource/setup permission | Protected preview works; direct RLS/role tests pass; no production credentials/data in previews |
| 2 — public design and CMS slice | Brand/token approval, shared navigation/footer/contact, home/services/team/blog, block CMS/revisions/SEO/redirect baseline | Phase 1; source content/brand decisions | Owner can edit/publish approved content; representative pages accessible/mobile; source-route coverage recorded |
| 3 — complete form pilot | Contact 697 plus purchaser 5116; importer/version schema, rule/repeat/step/calculation engine, native renderer, signatures, direct uploads/quarantine/scanning, encrypted storage, admin review/export, outbox mail | Phase 1; wording/routing/key/scanner/mail decisions; Phase 2 shell can proceed alongside | Full pilot branch/negative/concurrency/privacy tests; receipt/save/download/captured mail proven with synthetic data; owner business validation |
| 4 — full form parity/history | Remaining definitions in complexity groups, vendor 5121, trusts/finance/tax/rental/calculators, unplaced-form decisions; legacy import/archive and attachment mapping | Proven phase 3 engine and fresh source | Every final-baseline form accounted for; unsupported behaviour resolved; historical count/hash/disposition and file audit pass |
| 5 — customer and appointment operations | Customer relationships/duplicates, services/staff/availability/DST, holds/bookings/cancel/reschedule/reminders, preferences-request workflow and payment references | Phase 1 data/RBAC; phase 3 intake/outbox | No overlap under concurrent load; customer identity review; source booking/history parity; no invented online payment scope |
| 6 — support/marketing/reporting/admin completion | Actual source support adapter, tickets/notes/assignment/requester access as approved, newsletter consent/suppression, reports, users/roles/media/audit/settings | Confirmed source version, phase 1 permissions, shared customer/file/mail modules | No private-note/cross-customer leak; support continuity; owner performs routine admin work without code |
| 7 — restricted migration rehearsal and UAT | Approved source staging import, row/file/checksum reconciliation, whole-site route/SEO/accessibility/performance/security tests, sender verification and restore drill | Phases 2-6 and approved data handling | Zero unresolved critical migration/security issues; business acceptance, rollback plan and measured RTO/RPO sign-off |
| 8 — authorised production cutover | Fresh backups, write fence/drain/final delta, staged production build, approved DNS/web-only cutover, controlled live mail and synthetic smoke checks | Phase 7; hosting/DNS/release owner authority | One writer; reconciled final baseline; correct persistence/routing/privacy; monitoring staffed |
| 9 — stabilisation and legacy retirement | Monitor intake/jobs/delivery/404s, resolve issues, reconcile stragglers, periodic restore and permission reviews; archive legacy on retention schedule | Stable phase 8 and agreed rollback window | Owner signs operational handover and retirement; preserve required history/files/backups |

Phases 2 and 3 can progress as independent workstreams after foundation; phases 5 and 6 share dependencies but can be planned separately. This is sequencing guidance, not authorisation to spawn agents or implement concurrently now.

## Initial approved implementation slice

After approval, start with phase-0 decision closure and phase-1 foundation, then a small end-to-end contact form and complex purchaser pilot. The pilot must include admin permissions, persistence, private upload, receipt and captured notification. A styled purchaser page without those behaviours is not a completed pilot.

Do not migrate production records or change routing as part of initial scaffolding. During development, use synthetic customers and office test destinations. Keep the existing WordPress site and its plugin files outside the new Git/deployment root.

## Backlog grouping for forms

1. Contact/request forms: 697, 618, 1255, 1472, 3874, 5251, 8431, with dialer/external actions separately confirmed.
2. Current purchaser/vendor: 5116 and 5121, then business decisions for 4197/4206/3561 historical definitions.
3. Individual/company/trust applications: 627, 704, 713, 716, 719, 995, 1055.
4. Property/finance/rental/calculation: 724, 727, 732, 2549, 3283, 3992.
5. Tax/trust/signature/GST variants: 3057, 3127, 3202, 3211, 3235, 3957.

This grouping includes all 31 published local definitions. Do not publish an archived/unplaced form solely because it appeared in an export. Existing legal/eligibility/calculation wording needs owner confirmation independent of implementation parity.

## Estimates and responsibility

This is a multi-module business application and data migration, not a one-page frontend rewrite. No dependable calendar estimate is possible before fresh-source reconciliation, support/portal scope, form-rule sign-off and provider/security decisions. Estimate each phase after those gates using the pilot's measured effort; do not promise an unverified fixed number of days.

Business owner: form/legal wording, contact/routing, customer identity decisions, retention, UAT and go-live. Technical owner: implementation, tests, data transforms, security/rollback evidence. Infrastructure owner: accounts/regions/cost, mail domain, backups, hosting/DNS and release access. Qualified reviewer: privacy/retention/signature/tax-rule obligations as needed.

## Completion definition

The project is ready for launch only when the final source baseline is reconciled; public and administrative workflows pass the acceptance plan; file/RLS/privacy controls are verified; mail delivery works through the actual approved sender; restore and rollback are rehearsed; and a named authorised person approves the exact production release. Design documents or old local PHP tests alone do not meet that definition.
