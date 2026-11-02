# CLAUDE.md — Repository Guidance

## Project Summary
RCorpo Website & Application Platform — Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth/Storage.

## Common Commands
- Package Manager: `pnpm` (Node.js 24.x)
- Install: `pnpm install`
- Dev Server: `pnpm dev`
- Build: `pnpm build`
- Type Check: `pnpm typecheck`
- Lint: `pnpm lint`
- Tests: `pnpm test` (Vitest)
- End-to-End: `pnpm test:e2e` (Playwright)

## Core Guidelines
- Read `docs/planning/` before modifying schema, form engines, or data structures.
- Use synthetic test fixtures; never commit real customer data or production credentials.
- Retain existing canonical URLs and branch contact definitions.

