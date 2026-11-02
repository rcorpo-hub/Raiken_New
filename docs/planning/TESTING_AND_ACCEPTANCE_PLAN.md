# Testing and measurable acceptance plan

Status: future acceptance criteria, not completed tests. The new application does not exist yet. Existing WordPress test artifacts are historical DOCUMENTED evidence only; their 132 form checks, 245 native-storage checks and 81 targeted security checks are not results for Next.js/Supabase and are not independent certifications.

## Tools and environments

- **PROPOSED Vitest** for pure rules/calculation/validation/conversion tests; component tests where they verify meaningful interactions. [Official guide](https://vitest.dev/guide/).
- **PROPOSED Playwright** for browser/API flows across Chromium, Firefox and WebKit, including mobile viewport tests and protected previews. [Official guide](https://playwright.dev/docs/intro).
- **PROPOSED SQL/pgTAP plus integration tests** against disposable Supabase/PostgreSQL for RLS, grants, FKs, transactions, booking and idempotency. HTTP tests must use anonymous and actual role JWTs, not only a privileged key.
- **PROPOSED axe-based checks and manual review** for accessibility; Lighthouse/real browser measurements for performance; bounded authorised load tests for concurrency. Automated tools alone do not prove accessibility or security.
- Use synthetic/redacted fixtures in CI/previews. Real-source rehearsal requires an isolated approved environment; do not publish its traces, screenshots, answer payloads or database exports as CI artifacts.

## Release acceptance matrix

| Area | Minimum test cases | Measurable acceptance / evidence |
|---|---|---|
| Public content/SEO | Every final-baseline public page/post, nested path, anchor, canonical, metadata, link and important media | 100% manifest paths accounted for as preserved/approved redirect/approved retirement; no raw builder shortcode; zero unapproved broken critical links or redirect loops |
| Navigation/responsive | Desktop/mobile menu, contact actions, external software/conveyancing links, popup dismissal | All primary tasks operable at 360/390/768/1280/1440 widths and 200% zoom; no blocked fields/actions or unintended horizontal scroll |
| Form definition import | All published forms, unplaced forms, source/target key/type/options/defaults/rules/wording/routing/version | All 31 local definitions accounted for, plus every additional definition in fresh baseline; 100% differences reviewed; unsupported features explicitly blocked/approved |
| Form validation | Valid and invalid fixture per form; required/format/enum/mask/date bounds; malformed arrays/nesting; oversized payload | Every invalid case rejected server-side with safe field error; every valid golden fixture persists expected typed values; no hidden-branch answer accepted |
| Rules/repeats/steps | Each rule operator and conditional edge, boundary repeat counts, nested groups, step back/forward, key cross-branch combinations | Full rule-edge coverage plus pairwise/known-dependent combinations; no missing visible required field, stale hidden values or duplicate repeat keys |
| Calculations | Source golden examples and owner-approved current values; currency rounding, negatives, empty values, tampered client totals, circular/executable expressions | Server result matches approved decimal calculation; cycles/code rejected; formula version recorded; matching obsolete source alone is insufficient |
| Sessions/CSRF/spam | Missing/forged/expired/cross-form tokens, foreign Origin, cookie/nonce mismatch, invalid challenge, rate/size limits | No persistence on denied request; 400/403/409/422/429 as appropriate; no raw exception/secret; persistent counters work across concurrent instances |
| Idempotency | Same request retried sequentially/concurrently; different payload with same key; failure after object upload/before commit | One accepted business record/reference; conflicting reuse rejected; no duplicated outbox jobs; failed transaction leaves no accepted partial record |
| Signature | Draw/type/clear/blank/corrupt/oversized PNG, consent/version evidence | Both accessible methods work; blank/corrupt rejected; original evidence protected and tied to submitted version |
| Upload/private access | Real allowed test files, renamed scripts, macro/ZIP bombs, oversized images, path traversal, session swapping, overwrite and signed-link expiry | Unscanned/rejected files never readable as clean; anonymous/other session cannot list/read/attach/overwrite; allowed 10MB test upload works by direct storage route |
| Storage/DB consistency | Object upload without submit, submit without clean scan, scan failure, orphan cleanup, deleted/missing legacy files | Every intent/object/link has a reconciled state; missing historical files visible as missing; no false download success; cleanup respects legal hold |
| Persistence/review/export | Read correct form version, review transition, encrypted answer round-trip, CSV injection, large filtered export | No accepted request before durable commit; exports contain only scoped selected records; encryption decrypt/rotation/recovery tests pass; artifacts private and expire |
| Notifications/SMTP | Each enabled office/client route and branch, invalid recipient, capture mode, provider reject, retry, duplicate webhook, bounce/delivery event | Submission survives email failure; no wrong recipient; no answers/documents/signatures in mail; captured/accepted/delivered distinct; approved inbox tests verify delivery |
| Authentication/MFA | Invite/reset, callback redirect allowlist, sign-in/out, refresh, MFA, suspension and revoked roles | Unauthenticated denied; content user has no sensitive access; revoked role denied on next protected operation; no open redirect/session cache leak |
| Authorisation/RLS | Every private table/view/RPC/storage path with anonymous, low-privilege, wrong-branch and correct admin identities | 100% permission matrix scenarios pass; zero unauthorised row/file/export/aggregate access; no self-assigned role; service-key paths tested independently |
| Customers | Shared email, duplicate source identities, person/company/trust links, reviewed merge and history | No automatic person merge; all source mappings retained; intended histories visible only in allowed scope |
| Real appointments | Source durations/statuses, availability/breaks/holidays/buffers, held/confirmed overlap, reschedule/cancel, DST in Adelaide and branches | At least 20 simultaneous attempts for one slot produce at most one active capacity-one reservation; no confirmed overlap; correct UTC/local round-trip |
| Appointment requests | Preferred times saved and manually resolved | Request does not reserve a calendar slot; conversion uses same conflict-safe booking service; status/audit preserved |
| Support | Ticket import, requester identity, thread order, attachment visibility, assignment rules, customer reply/internal note, close/reopen | All imported ticket/thread IDs reconcile; no private note shown to requester; no cross-requester ticket access; no contact fallback presented as ticket parity |
| CMS/form admin | Draft/edit/preview/publish/rollback, concurrent edit conflict, reserved paths, malicious rich text, unsupported field | Published version immutable; stale edit conflicts; content editor cannot change roles/routing/sensitive fields; no script execution |
| Analytics | Defined counts vs source/target fixtures, branch/timezone/date filters, mail/request vs confirmed metrics | Exact expected fixture totals; no private-answer telemetry; only authorised admins can read reports; insufficient data shown honestly |
| Migration | Repeat import, interruptions/resume, deleted/updated old rows, orphan FKs, bytes/encoding/serialization, source duplicates | 100% source rows/files have disposition; no duplicate business records on rerun; all raw-archive hashes match; zero unresolved critical discrepancy |
| Backups/recovery | Database+objects+keys restoration into isolated environment; job replay/capture control | Measured RPO/RTO meet approved objectives; all major record types and permitted files accessible; no historical live mail replay |
| Release/rollback | Wrong environment/commit, preview secret leak, failed gate, compatible frontend rollback, final delta/write fence | Only approved tested production build promoted; zero split writers in rehearsal; new records retained during rollback |

## Security tests in detail

Test direct Supabase REST/RPC and Storage calls, not only routes that can hide an overly permissive policy. Check table grants, security-invoker views, SECURITY DEFINER execution/search_path, update-column restrictions and role-policy recursion. Try ID substitution for customer, submission, file, ticket, export and branch. Verify privileged server endpoints perform explicit resource checks even though their database client bypasses RLS.

Seed harmless SQL/XSS/formula markers in all editable labels, rich text, support messages and answers. Inspect rendered UI, exports, notification payloads, telemetry and logs. Scan generated client bundles/build artifacts for privileged secrets and excluded source material. Do not test exploits on production without a separately authorised scope.

## Performance and accessibility budgets

Proposed launch targets, to validate on representative staging infrastructure and adjust only with recorded approval:

- Public key pages: Lighthouse mobile median of three controlled runs >=90 performance and >=95 accessibility; manual checks still required. Lab scores are not a field-performance guarantee.
- Target field Core Web Vitals at the 75th percentile after enough real traffic: LCP <=2.5s, INP <=200ms, CLS <=0.1. Instrument only privacy-safe metrics. [Core Web Vitals reference](https://web.dev/articles/vitals).
- Intake API p95 <=2s excluding direct file transfer, malware scanning and provider email; admin filtered list p95 <=1s for a representative imported dataset. Record region/load/cold-start conditions.
- Initial load model for tests: 20 simultaneous form users and 10 administrators with realistic multi-step forms/uploads; refine after traffic evidence. Rate-limit challenges must not masquerade as server failures.
- Public/admin critical flows: zero serious/critical automated accessibility findings, keyboard completion and manual screen-reader review. Target WCAG 2.2 AA, with focus, labels, errors, reflow, contrast and touch-target checks. [W3C standard](https://www.w3.org/TR/WCAG22/).

## Test data and evidence management

Build one fixture catalogue by feature/form ID and version. Include purchaser/vendor counts, trusts/trustees/beneficiaries, finance repeats, rental arithmetic, tax dates, signatures, allowed documents and source damaged serialization. Fixtures must be fabricated or carefully redacted, not copied from real applicants. Preserve exact expected outputs for calculations and migrated records where handling is approved.

Each evidence report records commit, schema version, environment, source manifest/hash, date, cases passed/failed, links to protected logs and reviewer. Avoid claiming a test passed merely because a script exists. Flaky reruns retain the original failure; unresolved critical failures block release.

## Sign-off

Technical owner signs functionality/security/migration checks; business owner signs form wording/rules/routing, customer/booking/support parity and content; infrastructure owner signs backups/secrets/domains/monitoring. Production tests that send mail/create records use explicit approved synthetic destinations/data and are recorded for cleanup. Launch requires all critical gates green and documented acceptance of remaining non-critical issues.
