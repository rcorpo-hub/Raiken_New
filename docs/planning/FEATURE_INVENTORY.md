# Feature inventory and parity contract

Status: planning only. Evidence labels and E01-E10 refer to [PROJECT_AUDIT.md](PROJECT_AUDIT.md). Installed code, an export record and a working production feature are different kinds of evidence.

## Module register

Complexity: L = small bounded migration; M = multiple related workflows; H = substantial business rules/data; VH = major engine or reconciliation work. All future behaviour below is PROPOSED.

| ID / feature and purpose | Current implementation and related files | Source data / API or integration | Roles and rules | Complexity / target implementation | Required tests |
|---|---|---|---|---|---|
| F01 public pages and services | VERIFIED E02/E04: WPBakery/DesignThemes content in page posts; theme `page.php`, framework and page templates | `posts`, `postmeta`, taxonomy; WordPress content APIs | Visitor reads published content; owner edits | H: approved block CMS and Next server rendering; convert shortcodes, not execute them | Every source path, heading, CTA, link and publication state |
| F02 navigation, headers, footer, branch details | VERIFIED: 36 menu items; 2 header/2 footer posts; three cities visible publicly | Menu metadata/options; maps, phone, email links | Visitor navigates; editor changes approved links | M: shared layouts with managed navigation and branch records | Nested menus, keyboard operation, mobile, external-link allowlist |
| F03 blog/search/categories | VERIFIED: 2 published posts; theme blog/search/archive templates | `posts`, terms, relationships, Yoast metadata | Public published-only search; editor drafts | M: CMS posts, indexed title/body search; retain date-based post URLs | Dates, authors, canonical paths, archive/search results |
| F04 sliders and welcome/estimate popups | VERIFIED: Slider Revolution and Popups code; two published popup posts; welcome overlay seen | `revslider_*`, popup posts/meta; IT estimate form 1472 | Visitor; owner controls activation and frequency | M: editable hero/banner/popup blocks; no arbitrary script in CMS | Dismissal, focus trap, mobile, reduced motion; preserve CTA meaning |
| F05 contact and application forms | VERIFIED E03/E04: 31 definitions; iframe route and shortcode takeover | Form posts/meta; `admin-post.php?action=rkf_submit` | Anonymous submissions; administrators manage; IDs must remain traceable | VH: versioned schema engine and native React renderer; complete register below | Field/rule/option/required parity for all forms |
| F06 conditional/repeating/multistep fields | VERIFIED: `schema.php`, `forms.js`; show/hide, derived values, repeated groups | `_super_elements`, `_rkf_schema`; typed rule data | Hidden branches excluded; repeat limits apply; server recalculates | VH: shared declarative rule interpreter; no JavaScript/PHP evaluation | Every rule operator/branch plus representative combinations, repeats and server/client equivalence |
| F07 calculators | VERIFIED: quote, rent and questionnaire calculations; `rkf_math`, `rkf_derive` | Schema formulas; server handler | Client totals are untrusted; historical totals preserved | H: safe expression AST with decimal money rules and versioned formulas | Golden examples, boundary values, rounding and tampering |
| F08 drawn/typed signatures | VERIFIED: canvas/type alternative and PNG handling; `forms.js`, `submissions.php` | Answers/private-file metadata; historical base64/URLs | Consent text and form version retained; signature alone is not legal identity verification | H: accessible signature capture with consent evidence and protected storage | Both input methods, blank/oversized/corrupt signature, timestamp/version |
| F09 identity/contract uploads | VERIFIED: allowlist, content checks, private new-file storage | Upload files, `_rkf_private_file`, legacy file references | Random paths; admin-only downloads; historical permissions differ | H: private quarantine, scan, immutable object paths and permissioned downloads | Type spoofing, path traversal, large files, orphan cleanup, denied public access |
| F10 new/historical entries and export | VERIFIED E03; DOCUMENTED previous history review | `super_contact_entry`, `_super_contact_entry_data`, `_rkf_*`; earlier `rkf_*` tables | Admin reads/exports; original bytes remain preserved | H: submissions plus encrypted legacy archive, import IDs and review status | Counts/hashes, field-by-field examples, CSV formula protection, large export jobs |
| F11 notification routing/confirmation | VERIFIED code: `rkf_notify`, `wp_mail`, receipt/link emails; DOCUMENTED purchaser failure | Form settings, mail postmeta, WP Mail SMTP logs; external mail provider | Capture defaults; valid recipient list; submission success does not prove inbox delivery | H: transactional outbox, configured route IDs, retries, delivery/bounce webhooks | Office and client routes, every branch, captured vs delivered states, retry/dedup |
| F12 owner form editor | VERIFIED `admin.php`: labels/hints/choices/required and settings; not a complete drag/drop builder | `_rkf_schema`, `_rkf_settings` | `manage_options` and action nonce | H: draft/version/publish builder, rule editor and rollback | Permission, invalid rules, stale edits, immutable published version |
| F13 real-time appointment booking | VERIFIED Bookly tables and shortcode on `/appointment/`; public page initially showed loader | `bookly_services`, staff, appointments, customer appointments, schedules | Availability, service duration, staff, status, time zone; no booking made during review | H: slot search/holds/atomic confirmation, or retain Bookly until parity approved | Concurrency, DST, holidays, buffers, cancel/reschedule, reminders |
| F14 appointment preferences/request form | VERIFIED form 5251 and `/appointment-booking-form/` | Form entry storage, email | Preferences request is not a reserved Bookly slot | M: distinct appointment-request record and human confirmation workflow | Request saved, receipt sent, no accidental calendar reservation |
| F15 booking customer management | VERIFIED 406 Bookly customers plus separate form/ticket identities | `bookly_customers`, links to WP users; no verified unified CRM | Avoid merging households/shared addresses blindly | H: customer records, contacts, relationships and reviewed identity linking | Duplicates, shared email, customer history, access scopes |
| F16 booking payments | VERIFIED 8 Bookly `local:pending` payment rows; five service prices zero in snapshot | `bookly_payments`; gateway/calendar columns exist | No evidence of completed online charges; preserve records | M/H: payment-reference ledger; enable new checkout only after explicit business approval | Amount/currency/status preservation, no duplicate collection |
| F17 support tickets/messages/assignment | VERIFIED legacy 167 tickets/413 thread posts; installed v3 uses different tables; current public contact fallback | `wpsc_ticket`, `wpsc_ticketmeta`, thread posts, agent-rule add-on; possible `psmsc_*` in fresh export | Internal note vs customer reply, status/category/priority, assigned administrators | H: ticket admin and verified requester access; preserve full history | Thread ordering, ownership, internal-note isolation, assignment and notification |
| F18 newsletter/marketing consent | VERIFIED Newsletter code and snapshot row; 283 historical AcyMailing users | `newsletter*`, `acym_*`; old Sendinblue log name observed | Newsletter consent is separate from service-form consent; unsubscribes preserved | M: subscriber/consent/suppression ledger; marketing service only after provider decision | Opt-in, unsubscribe, suppression wins, duplicate handling |
| F19 sticky communications/virtual meeting | VERIFIED public links and menu metadata | Phone/SMS/WhatsApp/Maps; Zoom/Meet/Skype/Webex; remote-assistance download link | External services; no confirmed API integration or SSO | L/M: approved managed links, accessible contact launcher | Correct target, no obsolete download/meeting credentials exposed |
| F20 external software and partner sites | VERIFIED links to `accounts.rcorpo.com`, `conveyancing.rcorpo.com`, `ezeeloan.com.au` | External origins; repositories not available | Their accounts and data are outside this repository | L: preserve links; rebuild or SSO would require separate scope | Navigation, redirects, availability; no invented account migration |
| F21 SEO/redirects/sitemaps | VERIFIED Yoast and Redirection records | Yoast metadata/indexables; `/engage` and conveyancing redirect | Preserve canonical public URLs and approved external redirects | H: Next metadata, sitemap/robots, explicit redirect manifest | URL coverage, status/canonical, no loops or private indexing |
| F22 authentication/permissions | VERIFIED WP users/capabilities; admin guards; support/Bookly roles | `users`, `usermeta`, session/auth cookies | Existing role names cannot become automatic broad access | H: invitation-based Supabase Auth, MFA and permission grants | Revocation, role escalation, direct API/RLS and cross-record denial |
| F23 analytics/reporting | VERIFIED installed Site Kit/Smartlook and submission/mail counters; actual production tracking unknown | Analytics settings/scripts and plugin logs | Sensitive answers/files must never enter session replay | M: admin aggregates, consent-aware public analytics, allowlisted events | PII leak checks, aggregate correctness and permission denial |
| F24 media management | VERIFIED upload tree and attachment posts | 2,113 attachments; 5,350 files/derivatives | Marketing assets public; identity documents private even if same old directory | H: asset manifest and public/private classification | Hashes, alt text, embedded images, denied private URLs |
| F25 security/cache/maintenance/remote management | VERIFIED installed Wordfence, SiteGround, caches, ManageWP loader; theme hides Worker in plugin list | Options/log tables; `.htaccess`, `advanced-cache.php`, `object-cache.php` | Hosting controls not portable to Next | M: platform controls, monitoring, visible integration register | Secrets/bundle scan, cache isolation, WAF/rate-limit/error-state checks |
| F26 Simple Estimator/Woo templates | VERIFIED estimator AJAX code and theme compatibility; no estimator shortcode found in published page inventory | `dt_estimator_mail`, `dt_update_woo_cart`; WC tables | Installed capability does not establish active commerce | M/H only if owner confirms usage; preserve evidence/archive otherwise | Authoritative pricing and receiver validation if rebuilt |
| F27 legacy data and unused plugins | VERIFIED Caldera/AcyMailing/WooCommerce remnants and two Super Forms copies | `cf_*`, `acym_*`, WC families, form backup posts | No silent deletion; export/archive with signed disposition | M: migration ledger records retained, transformed, archived or excluded with reason | Zero unclassified source entities and no duplicate imports |

## All published Super Forms definitions

Paths below are VERIFIED in the selected snapshot, with parent paths reconstructed. A source shortcode is not proof the live feature currently submits correctly. Each row needs a source-to-target schema comparison and acceptance fixture; H/VH rows need branch/repeat/upload/signature fixtures.

| Original ID | Source title | Published placement / disposition | Complexity |
|---:|---|---|---|
| 618 | Document Request Form | No direct published placement found; retain definition pending owner decision | M |
| 627 | New Individual Client Form | `/new-individual-client-form/` | H |
| 697 | Contact us | `/` enquiry; SupportCandy fallback may also use it | M |
| 704 | New Individual TFN Application | `/new-individual-tax-file-number-application/` | H |
| 713 | New Individual ABN Application | `/new-individual-abn-application/` | H |
| 716 | New Company Client Form | `/new-company-client-form/` | H |
| 719 | Family To New Trust Client Form | `/new-trust-client-form/` | H |
| 724 | Residential Property | `/residential-property/` | H |
| 727 | Form For Vendor (Sales) | `/form-for-vendor-sales/` | H |
| 732 | Buyer Form | `/buyer-form/` | H |
| 995 | New Company Registration | `/new-company-registration/` | H |
| 1055 | New Trust Registration | `/new-trust-registration/` | H |
| 1255 | Call Now | `/call-now/`; dialer/external action requires confirmation | M |
| 1472 | IT Services Estimate | Published popup post 1475, `spucpt`; exact trigger pages not verified | M |
| 2549 | New Client Questionnaire Form | `/new-client-questionnaire-form/`; nested repeated finance sections | VH |
| 3057 | Tax declaration Form | `/tax-declaration-form/` | H |
| 3127 | Digital Signature | `/digital-signature/`; DOCUMENTED restored basic form, not proven original design | M |
| 3202 | Shiva Family Trust | `/shiva-family-trust/` | H |
| 3211 | Shree Ashapuri Unit Trust | `/shree-ashapuri-unit-trust/` | H |
| 3235 | Rideshare / Taxi GST | `/rideshare-taxi-gst/` | H |
| 3283 | Rental Property Summery | `/rental-property-summary/`; retain source spelling only as legacy metadata | H |
| 3561 | New Client Conveyancing Form | Old revision reference; `/nc/` now contains purchaser/vendor links | VH |
| 3874 | Conveyancing Services Page Contact Form | No direct published placement found | M |
| 3957 | Paarthav Family Trust | `/paarthav-family-trust/` | H |
| 3992 | Quote Calculator | `/quote-calculator/` | H |
| 4197 | New Client Purchaser Form | Historical revision references; current purchaser page uses 5116 | VH |
| 4206 | New Client Vendor Form | Historical revision references; current vendor page uses 5121 | VH |
| 5116 | New Client Purchaser Form (Copy) | `/nc/i-am-purchaser/`; first complex migration pilot | H |
| 5121 | New Client Vendor Form (Copy) | `/nc/i-am-vendor/` | H |
| 5251 | Appointment Booking Form | `/appointment-booking-form/`; preferences request | M |
| 8431 | Conveyancing Services Page Contact Form (Copy) | No direct published placement found | M |

There are 24 distinct published page/form placements plus popup placement 1472. Six definitions have no direct published page/custom-content shortcode, including three with revision references. Backup/revision records are historical, not new active forms.

## Other public content paths

VERIFIED E04: `/blog/`, `/appointment/`, `/newsletter/`, `/it-services/`, `/it-services/web-development/`, `/it-services/custom-software/`, `/it-services/mobile-app/`, `/it-services/cloud-and-server/`, `/nc/`, `/support/`, `/team/`. Preserve `/` anchors such as `#contact` and page metadata. Post date URLs must be derived from actual post dates and the source permalink setting.

Two enabled source redirects: `/engage` to `/nc`, and `/conveyancing-services/` to `https://conveyancing.rcorpo.com/`. The earlier crawl's 404 result is DOCUMENTED historical evidence, not a reason to discard the redirect now found in the export.

## Parity decisions required

Confirm which unplaced forms are still business-critical, whether the support requester portal must be restored at launch, which old meeting/download links remain approved, whether external sites remain external, and whether any live payment/PDF/autocomplete integrations exist outside this snapshot. A feature can be archived or deferred only with a recorded owner decision and a continuity route. The full form engine and CRM should not be promised as a simple visual redesign.
