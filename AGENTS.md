# AGENTS.md — Development Invariants & Guidelines

## Gravitas Runtime Enforcement
All automated operations in this repository follow the 6 Gravitas Invariants:
1. **Ground before mutating**: Inspect target files, imports, tests, and callers before editing.
2. **Stay in declared scope**: Only modify declared files and directories. Never alter the legacy WordPress installation at `../`.
3. **Completion needs evidence**: Every task or feature must be validated by executed tests, linter passes, or build verifications.
4. **Never exact-retry a failure**: Change context, diagnosis, or strategy before re-attempting a failed step.
5. **Satisfy the contract**: Acceptance criteria from `docs/planning/TESTING_AND_ACCEPTANCE_PLAN.md` gate completion.
6. **Say what you can't verify**: Explicitly note unverified items or synthetic constraints.

## Architecture & Code Boundaries
- **Framework**: Next.js App Router (TypeScript, Tailwind CSS, pnpm).
- **Public vs. Protected**:
  - `(public)` routes: Public pages, server-rendered content, client form components.
  - `(admin)` routes: Role-gated administration dashboard with Supabase Auth & MFA.
  - `api/`: Route handlers validating input via Zod schemas and calling domain services.
  - `modules/`: Encapsulated business domain services (forms, submissions, customers, appointments, support).
  - `lib/`: Shared utilities (Supabase clients, encryption, security, validation).
- **Server Boundaries**:
  - `lib/supabase/privileged.ts` and `lib/encryption/*` are `server-only`. Never import into client components.
- **Planning Reference**:
  - All 17 authoritative planning documents are located in `docs/planning/`. Always consult these documents before introducing architectural changes.

