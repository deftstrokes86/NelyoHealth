# P02-ISS-012 Next.js Web Application Shells

## Status

COMPLETED with deterministic synthetic shell and browser smoke evidence.

## Objective

Create patient, provider, organization, and admin Next.js shells with shared design foundation imports and typed client wiring.

## Scope delivered

- Converted `apps/patient-web`, `apps/provider-web`, `apps/organization-web`, and `apps/admin-web` into Next.js 16 shell runtimes.
- Added app router shell pages and layout files for each web app with synthetic-only content.
- Added typed API client shell wiring via `@nelyohealth/api-client` in each web app shell module.
- Added unit topology expectations for web shell runtime markers and Next.js scripts/dependencies.
- Added dedicated ISS-012 Playwright smoke and accessibility suites against all four Next.js shells.
- Preserved locked privacy constraints by asserting no protected sentinels in shell routes/artifacts.

## Files

- apps/patient-web/package.json
- apps/patient-web/tsconfig.json
- apps/patient-web/next-env.d.ts
- apps/patient-web/next.config.mjs
- apps/patient-web/app/layout.tsx
- apps/patient-web/app/page.tsx
- apps/patient-web/src/shell.ts
- apps/patient-web/src/index.ts
- apps/patient-web/README.md
- apps/provider-web/package.json
- apps/provider-web/tsconfig.json
- apps/provider-web/next-env.d.ts
- apps/provider-web/next.config.mjs
- apps/provider-web/app/layout.tsx
- apps/provider-web/app/page.tsx
- apps/provider-web/src/shell.ts
- apps/provider-web/src/index.ts
- apps/provider-web/README.md
- apps/organization-web/package.json
- apps/organization-web/tsconfig.json
- apps/organization-web/next-env.d.ts
- apps/organization-web/next.config.mjs
- apps/organization-web/app/layout.tsx
- apps/organization-web/app/page.tsx
- apps/organization-web/src/shell.ts
- apps/organization-web/src/index.ts
- apps/organization-web/README.md
- apps/admin-web/package.json
- apps/admin-web/tsconfig.json
- apps/admin-web/next-env.d.ts
- apps/admin-web/next.config.mjs
- apps/admin-web/app/layout.tsx
- apps/admin-web/app/page.tsx
- apps/admin-web/src/shell.ts
- apps/admin-web/src/index.ts
- apps/admin-web/README.md
- tests/unit/workspace-topology.spec.ts
- tests/e2e/iss012-web-shells.spec.ts
- tests/accessibility/iss012-web-shells.a11y.spec.ts
- playwright.iss012.config.ts

## Validation

```bash
pnpm install
pnpm --filter @nelyohealth/patient-web typecheck
pnpm --filter @nelyohealth/provider-web typecheck
pnpm --filter @nelyohealth/organization-web typecheck
pnpm --filter @nelyohealth/admin-web typecheck
pnpm --filter @nelyohealth/patient-web build
pnpm --filter @nelyohealth/provider-web build
pnpm --filter @nelyohealth/organization-web build
pnpm --filter @nelyohealth/admin-web build
pnpm vitest run tests/unit/workspace-topology.spec.ts
pnpm playwright test -c playwright.iss012.config.ts tests/e2e/iss012-web-shells.spec.ts
pnpm playwright test -c playwright.iss012.config.ts tests/accessibility/iss012-web-shells.a11y.spec.ts
```

Expected evidence:

- all four web app shells build and typecheck with Next.js 16;
- browser smoke and accessibility smoke pass for each shell;
- no protected provider details appear in shell routes or test artifacts.

## Rollback

- Revert ISS-012 web shell package/runtime changes and restore boundary-only web app manifests.
- Revert ISS-012 Playwright configuration and tests.
- Revert topology test expectations to boundary-only web app assertions.
