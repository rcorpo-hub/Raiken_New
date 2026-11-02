# Public and administrator UI/UX specification

Status: proposed direction only. No screens, components or design assets were built. Existing design observations use local theme/content evidence and read-only public browser inspection on 2026-11-02.

## Existing design observations

VERIFIED public homepage: Raikan Corporation logo, cyan-to-purple navigation band, branch contact header for Adelaide/Brisbane/Perth, service cards, contact section with enquiry iframe, sticky phone/email/WhatsApp/meeting launcher and a large welcome popup. Navigation includes Forms, Appointment and an external Software link. Public `/support/` displayed a Contact us iframe rather than a ticket portal during review. `/appointment/` initially displayed its Bookly loading state; a successful booking was not tested.

VERIFIED local theme: many jQuery plugins, sliders, parallax, popup and theme option hooks are loaded from the theme framework. The migration must preserve useful content and brand recognition while replacing those runtime dependencies. Existing font settings and exact breakpoint behaviour were not exhaustively measured. Do not claim a full accessibility/performance audit has been completed.

## Preserve, improve, redesign

| Preserve | Improve | Redesign with owner review |
|---|---|---|
| Approved logo, recognisable cyan accent, branch contacts, service names, canonical form URLs, form legal wording, clear Appointment/Forms entry points | Navigation labels, form readability, mobile spacing, consistent validation, visible states, footer accuracy, accessible contact links | Welcome popup/hero treatment, page-builder layouts, admin interface, ticket portal and calendar interactions |

Retain a restrained cyan-to-violet brand accent where useful, with neutral surfaces for long forms and administration. Avoid a visual overhaul that changes field meaning or hides required legal content. Archive a source screenshot/content comparison for each migrated page during implementation.

## Proposed design system

| Area | Specification |
|---|---|
| Tokens | Semantic background/surface/text/muted/border/brand/success/warning/error/focus tokens; light public/admin baseline; dark mode optional later |
| Colour | Candidate brand cyan around `#087CAA`, violet accent around `#7938CF`, dark neutral text around `#242C39`; these are proposals, not extracted exact brand colours. Validate contrast before adopting |
| Typography | Self-host a licensed readable sans family after owner approval; system fallback; body 16px baseline, line height about 1.5; headings scaled modestly; avoid decorative typography in tax/identity forms |
| Spacing/layout | 4/8px spacing rhythm, shared container widths, clear section headings; forms around 720-960px usable content width, broader only for paired fields/tables |
| Components | shadcn component source using a consistently selected Radix foundation, with project-owned tokens; buttons, fields, dialogs, date/calendar controls, tables, alerts, tabs, drawers and navigation |
| Icons | Lucide named imports; visible labels or accessible names for meaningful actions; icons never the only indicator of status |
| Motion | CSS for simple states; Motion for a limited set of panel/step transitions; respect reduced-motion preferences; no entrance animation blocking form input |
| Responsive | Start mobile; test 360/390/768/1280/1440 widths. Pair short fields on wide screens; single column on small screens; persistent actions must not cover controls/errors |

## Public information architecture

Primary navigation: Services, Forms, Appointments, Team, Information/Blog, Contact, with clearly marked external Software/Conveyancing destinations. Owner approves exact labels/menu structure. A Forms directory groups individual/company/trust/tax/property/conveyancing applications and explains the purpose of each. Preserve direct legacy URLs even if the new directory is added.

Homepage: concise service proposition, key services, branch/contact information and clear forms/appointment CTAs. If the welcome popup remains, give it an obvious close control, focus management and sensible repeat frequency; do not block every visit. Keep contact launcher reachable without taking over the mobile viewport. Present physical locations and timezones consistently.

Do not put confidential family/trust details into public page copy or search previews. Existing public form-page titles require owner review before improving them; business-specific trust forms may need access gating rather than just a cosmetic rename.

## Form experience

1. Show form purpose, expected information, secure-document handling and estimated steps. Do not invent a completion-time estimate before measuring representative flows.
2. Each field has a persistent label, associated help text, correct input type/autocomplete and a visible required marker explained once. Do not rely on placeholders as labels.
3. Steps show meaningful section names and progress. Validate the current visible step; preserve values moving back. On final submit, server errors link back to fields/steps.
4. Conditional sections appear without losing keyboard context. When a branch becomes hidden, clearly follow the documented rule for clearing excluded values; server applies the same logic.
5. Repeated people/assets/debts have numbered headings, add/remove controls and an accessible keyboard reorder alternative where needed. Confirm removal when filled values would be lost.
6. Date of birth uses an accessible typed/date control suited to older dates, not a month-by-month-only picker. Phone/address/number fields explain accepted formats; date display and stored date are unambiguous.
7. Uploads show permitted formats, limits, individual progress, retry/removal and scan state. State that received documents may still be verified. Never show a public identity-document URL.
8. Signature provides draw and type alternatives, clear consent wording, clear/reset and no false claim of independent e-sign verification.
9. Submission button shows processing with a safe retry path. Receipt displays a reference and next action; it does not echo private answers or promise inbox delivery.

Long tax/financial forms should favour readable grouped sections, instructions and a review summary. Do not add save-and-resume using browser storage without a separate sensitive-data decision. Tax totals and stamp-duty/eligibility rules require owner/business validation of current rules; matching an old calculation is not proof of current correctness.

## Protected admin experience

Use a compact sidebar/top bar with role-appropriate modules, environment indicator outside production, branch scope, global record/reference search only where authorised, and clear current form/content version. Admin styling is deliberately calmer than marketing pages.

Submission detail uses labelled sections matching the submitted version, visible status/version/date/branch, a document scan panel and a separate internal review timeline. Customer detail shows approved relationships and source history. Booking calendar supports a list alternative. Ticket composer makes Customer reply and Internal note visually and textually distinct; it must not default a private note into a public message.

Tables use server pagination, bounded filters, sortable approved columns, persistent filter summary, empty states and accessible row actions. Sensitive values stay masked unless needed; export is a deliberate permissioned workflow. Avoid loading every answer or document thumbnail just to render a list.

Charts show their metric definition, timezone, range and last refresh, plus an equivalent table. Do not mix appointment requests with confirmed bookings, or accepted mail with delivered mail. Aggregate errors should remain visible instead of rendering plausible zero counts.

## Accessibility and resilience

Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) with automated checks plus keyboard/screen-reader/manual review. Design for visible focus, logical landmarks/headings, sufficient contrast, labels/help/error associations, non-colour status cues, reduced motion and zoom/reflow. Use generous touch targets, suggested 44px for primary controls, without claiming this alone proves conformance.

States required: loading, initial empty, filtered empty, unavailable form, expired session, permission denied, field error, conflict/stale edit, offline, upload interrupted, scan pending/rejected, server unavailable and durable receipt. Errors explain the recovery action in ordinary language and include a support reference. Route transitions/step changes restore sensible focus. Test common mobile keyboards, browser autofill and long translated/client-entered text.

Public marketing performance targets and form/admin interaction criteria are in [TESTING_AND_ACCEPTANCE_PLAN.md](TESTING_AND_ACCEPTANCE_PLAN.md). Brand colour/font/menu approval is a phase-0/phase-2 decision; no pixel-perfect redesign is assumed from this planning task.
