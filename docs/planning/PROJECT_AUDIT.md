# RCorpo migration: project audit and planning index

Date: 2026-11-02. Status: planning only; implementation not authorised.

The owner designated `C:/Users/igl21/Local Sites/raiken-corp/Raiken_new_website` for this work. That existing directory contains this planning package only. The brief's proposed name `rcorp_New` is superseded by this explicit directory choice. No application, dependency installation, database migration, Git operation, infrastructure provisioning or deployment was performed.

## Evidence classification

- **VERIFIED**: directly observed in the specified local file, static SQL snapshot or public page during this review. This label does not imply production runtime verification.
- **DOCUMENTED**: reported in an existing project artifact or by the owner; not rerun or independently verified during this review.
- **INFERRED**: reasonable interpretation requiring confirmation.
- **UNKNOWN**: not established by available evidence.
- **REQUIRES ACCESS**: needs a fresh export, authorised administrator inspection or infrastructure evidence. Credentials must not be pasted into this package.
- **PROPOSED**: a future design choice, not an existing feature or completed change.

## Executive assessment

**VERIFIED:** This is a WordPress application with PHP theme/plugin rendering, a MySQL-compatible database, a WPBakery/DesignThemes frontend, Bookly scheduling and a custom Raiken Forms replacement. It is not a small collection of PHP contact forms. Customer records, support messages, appointment histories, uploaded identity documents and content must be preserved or explicitly dispositioned.

**PROPOSED:** Build one Next.js App Router application using TypeScript, with a public site and separately protected `/admin` experience, Supabase PostgreSQL/Auth/Storage, GitHub review workflows and Vercel deployment. Use business modules inside one application rather than starting with microservices. Replace WordPress layout shortcodes with structured content blocks; migrate form behaviour to a versioned form engine. Use native React forms on the new site and retain optional iframe routes only where external/legacy embedding is required.

**Approval boundary:** Supabase is a new PostgreSQL database with new tables. This differs from the earlier WordPress plugin requirement to reuse existing WordPress tables. The original WordPress database remains intact; approval of a plan is not permission to migrate production data.

## Source register

Paths below are relative to `C:/Users/igl21/Local Sites/raiken-corp` unless noted.

| ID | Source inspected | Scope and limitations |
|---|---|---|
| E01 | `app/public/wp-includes/version.php` | Local WordPress file reports 7.1.4; no assertion about current production core |
| E02 | `app/public/wp-content/themes/rcorpo/` | Theme header 1.2; functions, asset loading, templates and integration hooks inspected |
| E03 | `app/public/wp-content/plugins/raiken-forms/` | Current local plugin 2.0.4; importer, schema engine, iframe renderer, submission/storage/admin/legacy code |
| E04 | `app/sql/local.sql` | 243,721,603-byte static export; 224 table definitions; counts are export counts, not live production counts |
| E05 | `app/public/wp-content/package.json` | WordPress export metadata, not a Node application manifest; records historical production PHP 7.4.34 and WordPress 7.1.3 |
| E06 | Plugin headers; Bookly frontend; SupportCandy installation and agent-rule code; Simple Estimator handler | Installed capability and integration evidence; not proof that all plugins are active in production |
| E07 | `.deliverables/Raiken Forms 2.0.4 Installation.md`, `.deliverables/Raiken Forms 2.0.1 Local Security Review.md`, `.diagnostics/*test-results.json`, history verification | Existing implementation history and previous local results; tests were not rerun for this planning task |
| E08 | `app/public/wp-content/uploads/`, `app/raiken-forms-private/` | File names, counts and sizes inspected; customer document contents were not opened |
| E09 | Public `https://rcorpo.com/`, `/support/`, `/appointment/`; earlier purchaser inspection | Read-only browser observation; no customer form submission, account access or privileged operation |
| E10 | Original `final-patch` inventory and prior location report | Reference history only; nested paths rechecked against E04 rather than copying the old flat-slug report |

## Local architecture and inventory

| Area | Verified observation |
|---|---|
| Runtime | Local configuration declares `WP_ENVIRONMENT_TYPE=local`; Apache/MySQL/PHP configuration directories exist |
| Theme | RCorpo 1.2; WPBakery 6.0.5, DesignThemes 1.1, Ultimate Addons 3.19.0, Kirki 6.4.0, Slider Revolution 6.8.1 installed |
| Forms | Raiken Forms 2.0.4 local code; Super Forms 6.3.323 and duplicate 6.0.6 directories, calculator/signature add-ons retained |
| Scheduling | Bookly 28.7 and Bookly Pro 10.7 installed |
| Support | SupportCandy 3.5.4 and Assign Agent Rules 2.0.4 installed |
| Notifications | WP Mail SMTP Pro 3.4.0 installed; active production delivery unknown |
| Content | Export contains 35 published pages, 2 published posts, 2 headers, 2 footers, 2 published popups and 36 published menu items |
| Forms/history | 31 published Super Forms definitions, 1,285 form backup posts, 2,118 historical contact entries |
| Booking records | 517 appointments, 515 customer-appointment links, 406 customers, 5 services, 5 staff, 8 payment records |
| Support records | 167 legacy tickets, 553 ticket metadata rows, 413 published ticket-thread posts |
| Other histories | 283 AcyMailing users, 1 Newsletter subscriber, 30 legacy Caldera form rows, 1 Caldera entry |
| Accounts | 6 users under the selected prefix; role assignments include administrator, support agent and Bookly administrator; users may have multiple roles |
| Files | 5,350 upload files totalling 728,889,887 bytes, including derivatives and customer documents; 2,113 attachment posts; file count is not unique-media count |

The export uses `servmask_prefix_` as the selected WordPress prefix. Twelve additional `wp_` core tables contain a separate small dataset. Keep the namespaces distinct; do not merge their users or posts by matching numeric IDs.

## Material discrepancies

1. **VERIFIED:** E04 records Raiken Forms 1.0.2, four earlier `rkf_*` tables and no native `_rkf_entry` markers. Current E03 is 2.0.4 using core WordPress tables. The saved dump is an earlier snapshot; a current export is required before developing the final import adapter.
2. **VERIFIED:** Installed SupportCandy creates `psmsc_*` tables, but E04 contains legacy `wpsc_*` tables and thread posts. Do not run an upgrade merely to make the source match; support both export formats after confirming the real source.
3. **VERIFIED public observation:** `/support/` displayed a Contact us iframe during inspection. E03 has a fallback for an unregistered SupportCandy shortcode. This is not proof of a functioning support portal.
4. **DOCUMENTED:** The owner reported purchaser notification non-delivery. Public form rendering cannot establish whether production email capture, SMTP or recipients caused it. Treat notification delivery as an unresolved production acceptance item.
5. **VERIFIED:** Earlier flat-slug location reporting omitted page parents. Purchaser/vendor URLs are `/nc/i-am-purchaser/` and `/nc/i-am-vendor/`; IT subpages are children of `/it-services/`.
6. **VERIFIED:** A SQL dump and diagnostic PHP file exist under the local public web directory. Internet exposure was not tested. They must never be included in the future repository or deployment.

## Package navigation

| Document | Main decision or deliverable |
|---|---|
| [FEATURE_INVENTORY.md](FEATURE_INVENTORY.md) | Features, all 31 form IDs, source pages, business behaviour and parity tests |
| [DATABASE_AUDIT.md](DATABASE_AUDIT.md) | Source tables, counts, formats and reconciliation gaps |
| [API_AND_INTEGRATION_AUDIT.md](API_AND_INTEGRATION_AUDIT.md) | Current handlers, third parties and proposed API contracts |
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | Existing controls/findings and target security requirements |
| [TARGET_ARCHITECTURE.md](TARGET_ARCHITECTURE.md) | Public/admin/backend/storage/notification architecture |
| [PROPOSED_FOLDER_STRUCTURE.md](PROPOSED_FOLDER_STRUCTURE.md) | Future files and module boundaries; not created |
| [DATABASE_SCHEMA_DESIGN.md](DATABASE_SCHEMA_DESIGN.md) | PostgreSQL tables, relationships, RLS and ER diagram |
| [ADMIN_DASHBOARD_SPECIFICATION.md](ADMIN_DASHBOARD_SPECIFICATION.md) | Modules, permissions and owner workflows |
| [UI_UX_SPECIFICATION.md](UI_UX_SPECIFICATION.md) | Public/admin design and interaction requirements |
| [MIGRATION_PLAN.md](MIGRATION_PLAN.md) | Extract/transform/reconcile/cutover/rollback |
| [MCP_AND_CLAUDE_WORKFLOW.md](MCP_AND_CLAUDE_WORKFLOW.md) | Restricted integrations, branches, review and release authority |
| [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) | Environments, CI, monitoring, backups and DNS |
| [TESTING_AND_ACCEPTANCE_PLAN.md](TESTING_AND_ACCEPTANCE_PLAN.md) | Measurable release criteria and test evidence |
| [DEPENDENCY_SELECTION.md](DEPENDENCY_SELECTION.md) | Stable baseline, alternatives and compatibility gates |
| [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) | Sequenced implementation with exit gates |
| [PROJECT_RISKS_AND_OPEN_QUESTIONS.md](PROJECT_RISKS_AND_OPEN_QUESTIONS.md) | Required decisions, unavailable evidence and ownership |

## Review limits and next gate

This audit inspected local application boundaries, custom form code, feature-bearing plugin code, export schemas/aggregates, existing reports and representative public pages. It is not a line-by-line audit of every vendor file, a penetration test, a complete live crawl, or a verification of production configuration. No production database, Supabase project, GitHub repository, hosting console or private SMTP log was accessed.

Next action after owner approval: close phase-0 decisions and obtain a fresh source export through an authorised owner-controlled process. Implementation must wait for explicit approval.
