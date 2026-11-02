# Infrastructure, deployment and operations plan

Status: design only. No Git configuration, workflow, resource, secret, environment, domain or deployment was changed.

## Environments

| Environment | App deployment | Database/storage/auth | Email / data |
|---|---|---|---|
| Local development | New Next app on developer machine after approval | Local Supabase or dedicated synthetic dev project, not WordPress production | Synthetic records, capture-only mail |
| PR preview | Protected Vercel deployment per reviewed branch | Synthetic isolated branch/project or shared dev with strict test namespaces and reset discipline | No production credentials; no real customer documents; outbound capture |
| Staging/UAT | Stable protected staging deployment | Separate Supabase staging project/approved branch | Synthetic UAT by default; restricted real-source rehearsal only with explicit data-handling approval |
| Production | Gated Vercel production deployment | Dedicated production Supabase project with region/backup/permissions reviewed | Approved sender and live jobs enabled only through release gate |

Verify the selected Supabase branch strategy's database/storage/auth isolation; do not assume a database branch automatically includes safe cloned objects, production credentials or identity-provider configuration. Real-data staging and ordinary public previews must remain distinct.

Choose an approved region near Australian users/database after residency and latency review. Vercel app, database, storage processing, email/scanning/error providers and backups all affect the processing geography. The brief does not supply a budget, region commitment, account plan or SLA; none is asserted.

## Repository and branching

Create a new private repository rooted only at `Raiken_new_website` after implementation approval. Use protected `main`, short-lived feature/fix branches and required review/checks. Create release tags/changelog for deployed commits. Do not commit WordPress source dumps, old credentials, private uploads, generated exports, `.env` files or test authentication traces.

Use pnpm with a reviewed exact package-manager version, committed lockfile and frozen installation in CI. Select a supported Node major explicitly; proposed baseline is Node 24.x, which is supported in the current [Vercel runtime table](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), rather than relying on a changing platform default. Minor/patch runtime versions may be platform-managed.

## Build and release pipeline

Default recommendation: Vercel Git integration for branch builds/previews; GitHub checks for tests/security; Vercel Deployment Checks and protected owner approval for production. Verify plan support before relying on a gate. GitHub branch protection alone does not necessarily prevent Vercel from assigning a production domain to an untested deployment.

1. PR builds execute only with non-production configuration and safe fixtures. Run lint/typecheck/unit/integration/RLS tests, dependency/secret checks and browser tests against the verified preview.
2. Owner reviews the exact commit and database changes; authorised person merges.
3. Additive production migrations execute in a separately approved protected job against the verified production project. Do not use migration commands from an arbitrary preview job. Verify compatibility with current and rollback application versions.
4. Build the intended production deployment. Required checks must include the reviewed commit's tests, a successful migration-readiness result and an authorised release approval status. Hold production-domain assignment until all pass.
5. Verify team/project/environment/commit/deployment origin before sending any automation bypass credential. Use a scoped cookie for browser tests rather than attaching a raw bypass secret to all third-party requests.
6. Release only the tested production build. Record commit, migration version, deployment ID, checks and approver. Watch intake, queues and errors immediately after release.

If the account cannot enforce these native gates, use a reviewed CLI pipeline: production-configured build -> staged production deployment without domain assignment -> protected smoke checks -> authorised promotion. Prevent the native Git production path from simultaneously promoting outside that pipeline. Do not operate both release paths without one clearly authoritative gate.

Promoting a preview can rebuild with production configuration; the tested preview is not automatically the same artifact/configuration as production. Prefer staging a production deployment and testing that build. Promotion and instant rollback behaviour must be verified against current platform settings. [Promoting deployments](https://vercel.com/docs/deployments/promoting-a-deployment), [Deployment Checks](https://vercel.com/docs/deployment-checks).

## Environment configuration catalogue

Names below are proposed; values must be entered directly by the authorised owner/operator. No real credential is requested or generated here.

| Configuration | Scope |
|---|---|
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Only genuinely public configuration; validate origin/environment |
| Supabase server secret / legacy service-role key | Server-only, environment-specific, forbidden in public-prefixed variables/client bundles |
| Migration connection URL and management credentials | Protected migration runner only; not ordinary app/previews |
| Email transport credentials, verified sender/domain, webhook secret | Production server/worker; separate staging capture adapter |
| Encryption key reference and key-service identity | Server/worker; rotation/recovery runbook and access control |
| Malware scanning endpoint/auth, worker/job auth, challenge secret | Server/worker only; narrow destinations/permissions |
| Production mail enable flag / `APP_ENV` | Server config; capture forced outside production; deployments cannot silently turn capture off |
| Observability ingest/auth and public telemetry identifiers | Redaction first; only identifiers designed for browser exposure may be public |
| Vercel/GitHub/Supabase automation authorisation | Owner-managed protected workflow identities; not shared runtime client configuration |

Validate required configuration at build/startup as appropriate without printing values. Keep production secrets out of untrusted PR builds. Runtime secret rotation requires planned redeployment/config reload, testing and revocation of old credentials. Changing an environment variable does not necessarily change an already built deployment.

## Workers, storage and mail

Do not use Vercel local files as persistent storage. Public uploads are object-specific direct uploads to Supabase quarantine; Function handlers receive small JSON. Scan/export/mail work is stored in a database job/outbox with leases, backoff, attempt limits and dead-letter review. A scheduled trusted worker processes bounded batches and reports queue age/failure; no in-process cron timer is assumed to survive deployment.

Migration jobs run in an approved bounded runner, not a visitor request. Large exports are generated as private objects. The chosen scanner/key/mail provider must be real and verified before enabling live intake; no fake success fallback is allowed.

SMTP/API notifications and Supabase Auth invitation/reset mail are separate configurations. Verify both senders/deliverability. Preserve existing domain MX and authentication TXT records during web cutover. A working WordPress SMTP plugin does not configure Next.js mail transport automatically.

## Monitoring and alerts

| Signal | Proposed alert / response |
|---|---|
| Intake persistence errors | Immediate alert on synthetic probe failure or repeated 5xx; preserve request IDs, no answers |
| Notification queue | Oldest queued job >5 minutes or terminal failures -> operations alert; accepted vs delivered tracked |
| Scan queue | Pending beyond approved threshold, scanner unavailable or infected document -> restricted admin alert |
| Booking conflicts/errors | Monitor expected conflicts separately from technical errors and confirmed overlaps |
| Auth/authorisation | Repeated suspicious attempts, unusual exports/role changes, MFA failure spikes |
| Routing/SEO | Important route 404/redirect loop, sitemap failure, missing public assets |
| Database/storage | Connection/storage quotas, failed backups, restore failures and object inconsistencies |

Choose alert recipients/destination with owner approval. Error tracking must scrub cookies/tokens/answer bodies and private filenames. Routine analytics captures allowlisted page/action events, never tax identifiers or form answers. Uptime probes use public health and synthetic paths without reading real customer records.

## Backup and recovery

Proposed production objectives for approval: RPO at most 15 minutes for business records and RTO at most 4 hours for service restoration. These are requirements, not achieved guarantees; select a paid backup/PITR and object-backup design that can meet them, then measure a restore drill. If budget cannot meet them, document the revised accepted objectives.

Database and storage-object backups require separate coverage. Supabase database backups do not include Storage object contents. Keep protected off-site manifests/object backups, encryption-key recovery procedures, reviewed schema history and configuration inventories. A database snapshot without decryptable keys and corresponding documents is not a complete restore. [Supabase backup scope](https://supabase.com/docs/guides/platform/backups).

Run a prelaunch full restore and periodic drills, suggested quarterly or after major storage/schema changes. Test roles/RLS, all major record types, file downloads, jobs and sender capture on restored systems. Never send old queued/captured mail automatically during a restore.

## DNS cutover and rollback

Owner/hosting/DNS operator authority is REQUIRES ACCESS; WordPress login alone is insufficient. Preserve original origin/backups, external software/conveyancing subdomains, MX/TXT and certificate configuration. Follow the single-writer final-delta/fence procedure in [MIGRATION_PLAN.md](MIGRATION_PLAN.md). DNS cache propagation means both origins may receive requests; protect against split writes at intake endpoints.

Application rollback reassigns the previous compatible deployment; it does not revert Supabase records, object changes, email events or schema. Data rollback requires a separate reconciliation plan after new writes. Keep additive schema compatibility through the rollback window and never restore the old source database wholesale after collecting new target records.
