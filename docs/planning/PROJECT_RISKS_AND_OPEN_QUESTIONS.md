# Risks, unknowns and owner decisions

Date: 2026-11-02. This register separates evidence from decisions. The planning package can be reviewed without supplying credentials or allowing production access.

## Decisions before implementation or live data

| ID | Decision needed | Recommended default | Gate |
|---|---|---|---|
| D01 | Approve the requested Supabase migration despite earlier same-WordPress-database preference | New PostgreSQL schema for the future site, with old WordPress preserved and controlled import; no direct browser/MySQL connection | Before application/database implementation |
| D02 | Launch scope: full business replacement or staged public-site release | Full parity plan; stage modules only if legacy continuity is explicit; no silent form/support/booking removal | Phase 0 |
| D03 | Which form source is authoritative; which six unplaced definitions remain used | Fresh production/source export plus owner-reviewed Super/Raiken diff; archive only with recorded approval | Form importer/publishing |
| D04 | Support module and requester access | Preserve actual tickets/messages and restore a real support workflow if required; verify legacy vs modern source first | Support implementation |
| D05 | Booking/timezone/payment/calendar scope | Preserve real Bookly bookings and separate preferences requests; Australia/Adelaide source semantics reviewed; no new online charges without approval | Scheduling design freeze |
| D06 | Branding/menu/content direction | Preserve recognisable logo/contacts/URLs; approve cyan/neutral refreshed public design and calm admin UI | Public implementation |
| D07 | Email sender/transport/recipients and marketing provider | Verified approved business-domain sender, capture in non-production, delivered/bounce tracking; separate Auth mail | Before live notification tests |
| D08 | Key management, scanning and processing region | Managed key ownership/recovery, real malware scanning, approved Australian-region strategy where available; no live TFN/ID collection before proof | Sensitive-data implementation/live collection |
| D09 | Retention, erasure, legal holds, signature and current tax/property rules | Owner/qualified adviser approves per-data schedule and wording; do not invent statutory periods or treat old calculations as current law | Live data and migration disposition |
| D10 | Budget, platform plans, monitoring and recovery objectives | Separate environments; proposed business-data RPO <=15m and RTO <=4h only if funded and proven | Infrastructure selection |
| D11 | Who can provide source exports, DNS/hosting changes and production sign-off | Named authorised operator; user need not paste credentials into chat | Final migration/cutover |
| D12 | External software/conveyancing/partner/meeting links | Keep external sites external; review obsolete meeting/download destinations; separate project for SSO/rebuild | Navigation/integration acceptance |

## Material risks

| Risk | Evidence label / impact | Mitigation and owner |
|---|---|---|
| Old snapshot used as final truth | VERIFIED code 2.0.4 vs dump 1.0.2 and old tables; missing later entries/edits | Fresh baseline and final delta/hash reconciliation; technical/data owner |
| Conflicting support versions | VERIFIED installed v3 `psmsc_*` installer vs legacy `wpsc_*` export | Source-format detection and explicit thread/assignment mapping; do not auto-upgrade source |
| Production purchaser email failure | DOCUMENTED owner report; exact capture/SMTP/routing cause UNKNOWN | Current WordPress admin/mail-log diagnosis is a separate task; target outbox/delivery evidence required; business/mail owner |
| Exposed historical uploads | DOCUMENTED previous local direct-file result; new-file protection does not secure old objects | Private classification/migration, hosting review, anonymous-access tests; infrastructure owner |
| Public SQL/diagnostics accidentally deployed | VERIFIED local public-directory files; public reachability UNKNOWN | Strict Git/build allowlist and artifact scan; never copy old public directory as new assets |
| Incomplete form parity | VERIFIED complex financial/property/repeated sections and backup variants | Pilot 5116 then full schema/rule fixtures and per-form business approval |
| Unknown legal/tax rules | UNKNOWN current statutory/eligibility/retention/signature requirements | Qualified owner review; migration parity is not current legal correctness |
| Wrong entity merge | INFERRED risk from separate booking/form/ticket identities | Reviewed dedup/relationships; keep legacy IDs and merge history |
| Lost booking timezone/status history | VERIFIED NULL staff timezone and global Adelaide setting; active production semantics require access | Reconcile effective source timezone/DST; preserve originals and block ambiguous active imports |
| Unrecognised integration | VERIFIED provider columns/old tables; enabled production configuration UNKNOWN | Owner integration inventory, reauthorisation and sandbox tests before replacement |
| RLS bypass through server secret | VERIFIED platform behaviour; target design risk | Server-only privileged modules, explicit checks, restricted account use, direct negative tests |
| Upload token overpromised as revocable | VERIFIED Supabase provider lifetime; signing bypasses further auth for object | No upsert, quotas, quarantine, session finalisation checks, cleanup and no auto-accept stale uploads |
| Data/object/email partial failure | INFERRED from separate systems | Intent/outbox/state machine, idempotent workers, dead-letter/reconciliation and observable errors |
| Split writes during DNS migration | INFERRED cutover risk, hosting access not supplied | Old-handler write fence/drain/final delta, one writer and rehearsed rollback |
| Restoring DB without documents/keys | VERIFIED backup scope; target operational risk | Separate encrypted object backups/key recovery and full restore exercise |
| Scope/cost underestimated | VERIFIED number/complexity of modules/data | Phase gates/pilot-based estimates; vendor/plan/budget decisions before commitments |
| Secret/customer data in AI/CI/Git | Target workflow risk | Synthetic previews, directory boundary, scoped MCP, secret/artifact scan and protected jobs |
| Old PHP site degrades during rebuild | DOCUMENTED old runtime/plugins; no full vendor CVE review | Keep legacy maintenance a separate authorised workstream until retirement |

## Access/evidence gaps

| Needed evidence | Current state | Safe way to close gap |
|---|---|---|
| Fresh production database/form/content export and capture settings | REQUIRES ACCESS; no production DB connected | Owner-controlled encrypted export/administrator report, with secrets handled outside AI context |
| Current uploads/private documents and exact historical references | REQUIRES ACCESS; local file manifest may be incomplete | Protected file/hash manifest and restricted transfer by authorised operator |
| SMTP error/delivery and purchaser routing | REQUIRES ACCESS; public rendering cannot identify cause | Redacted notification status, transport test/error and form settings from WordPress admin; never send SMTP password |
| Active Bookly services/availability/calendars/notifications/payment usage | REQUIRES ACCESS; snapshot only | Admin export/config inventory and owner workflow examples |
| Actual SupportCandy source format and requester behaviour | REQUIRES ACCESS; local code/export disagree and public fallback observed | Owner export/version/settings; approved synthetic access test later |
| Auth account/role ownership and desired portal | UNKNOWN | Approved staff/role list and explicit portal decision, no password values |
| DNS/hosting/backup/restore rights | REQUIRES ACCESS; WordPress login insufficient | Named domain/hosting operator; scheduled authorised cutover, no credentials in plan |
| Supabase/GitHub/Vercel accounts, billing, region and plan capabilities | UNKNOWN; not connected/provisioned | Owner confirms resources/permissions after architecture approval |
| Traffic/volume/concurrency and service targets | UNKNOWN | Redacted analytics/operational counts; revise assumed load/recovery budgets |
| Approved content/brand/legal/retention/consent text | UNKNOWN where not supplied | Owner/qualified reviewer signs content/business-rule decisions |

## Assumptions explicitly not treated as facts

- Installed plugins may be inactive; snapshot `active_plugins` may differ from current production.
- A table or provider credential column does not prove the corresponding integration is active.
- A public page displaying a form does not prove persistence, private file handling or email delivery.
- Existing reports describe prior local test runs, not tests run during planning or proof of production security.
- All 5,350 upload files are not public marketing assets; many are derivatives or customer records.
- Source published/private status is not the target authorisation policy.
- WordPress password hashes, tickets, customer records and external software accounts are not one interchangeable user system.
- Provider capabilities/versions/limits may change before implementation; recheck official documentation and actual account features at the relevant phase.

## Approval request boundary

Approve the architecture/scope and clarify the phase-0 decisions before application work starts. Initial implementation approval should specify the synthetic foundation/pilot; production data import, secret setup, deployment and DNS remain later explicit release decisions. If production evidence cannot be provided, development can continue on synthetic fixtures, but production reconciliation and launch cannot be truthfully marked complete.
