# P02-ISS-014 Phase 2 Browser Harness Expansion

## Status

COMPLETED with per-app Chromium matrix, synthetic auth state generation, and route-level privacy/a11y evidence.

## Objective

Expand the browser harness so each current web shell can be exercised per app and viewport with deterministic synthetic state, privacy checks, and accessibility coverage.

## Scope delivered

- Added a dedicated Playwright harness config for ISS-014.
- Added per-app Chromium projects for patient, provider, organization, and admin shells across desktop, tablet, and mobile viewports.
- Added deterministic synthetic auth-state generation under ignored artifact paths.
- Added smoke tests that assert per-app shell headings, storage-state loading, privacy boundaries, and browser guard failures.
- Added accessibility smoke tests with axe validation for each shell project.
- Added convenience root scripts for ISS-014 browser and a11y runs.

## Files

- playwright.iss014.config.ts
- tests/helpers/iss014-browser-harness.ts
- tests/helpers/iss014-global-setup.mjs
- tests/e2e/iss014-web-shells.spec.ts
- tests/accessibility/iss014-web-shells.a11y.spec.ts
- package.json

## Validation

```bash
pnpm playwright test -c playwright.iss014.config.ts tests/e2e/iss014-web-shells.spec.ts
pnpm playwright test -c playwright.iss014.config.ts tests/accessibility/iss014-web-shells.a11y.spec.ts
```

Expected evidence:

- each web shell is reachable in desktop, tablet, and mobile Chromium projects;
- synthetic auth state files are generated under ignored artifact paths;
- route-level privacy assertions still pass;
- axe-based accessibility smoke passes for every shell project.

## Rollback

- Remove the ISS-014 Playwright config, helpers, and test suites.
- Revert the root script additions.
- Keep the Phase 1 and ISS-012 browser coverage intact.
