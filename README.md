# NelyoHealth

NelyoHealth is in Phase 1 foundation work. The repository currently contains a reproducible TypeScript monorepo baseline, a synthetic local browser smoke surface, deterministic Playwright smoke tests, and documentation for Codex browser use.

This repository does not yet contain a NelyoHealth product application. It implements no patient, provider, clinical, pharmacy, laboratory, payment, HMO, employer, family, guardian, sponsor, authentication, RBAC, database, API, or infrastructure feature.

## Status

- Phase 0 gate: `PHASE-0-CONDITIONAL-PASS`
- Phase 1 entry: `PHASE-1-GO-WITH-CONDITIONS`
- Pilot launch: `PILOT-NO-GO`
- Current bounded task: `P01-FND-001`
- Phase 2: not started

## Prerequisites

Use the pinned runtime and package manager:

- Node.js `24.18.0`
- pnpm `11.9.0`

The Node version is recorded in `.node-version`. The pnpm version is pinned in `package.json` through `packageManager` and `engines.pnpm`.

If pnpm is not already available on the host, use a package-manager shim without installing globally:

```bash
npm exec --yes pnpm@11.9.0 -- install
```

## Install

```bash
pnpm install
```

Use frozen installation in CI and verification contexts:

```bash
pnpm install --frozen-lockfile
```

## Development smoke server

The only runnable workspace package in this issue is the synthetic browser smoke surface.

```bash
pnpm dev
```

By default it binds to `127.0.0.1:4173`. Override with local-only environment variables when needed:

```bash
SMOKE_HOST=127.0.0.1 SMOKE_PORT=4173 pnpm dev
```

The smoke page is tooling evidence only. It is not a NelyoHealth product page and contains no patient, provider, clinical, financial, organization, or production data.

## Quality commands

```bash
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm verify
```

## Playwright commands

```bash
pnpm test:e2e
pnpm test:browser
pnpm test:browser:headed
pnpm test:browser:ui
pnpm test:a11y
```

Install the required Chromium browser for the deterministic smoke tests:

```bash
pnpm exec playwright install chromium
```

## Browser artifacts

Browser artifacts are controlled under ignored paths:

- `.artifacts/playwright/`
- `.artifacts/playwright-mcp/`
- `.artifacts/screenshots/`
- `.artifacts/traces/`
- `.artifacts/videos/`
- `.artifacts/network/`
- `test-results/`
- `playwright-report/`
- `.auth/`

Do not commit browser authentication state, traces, screenshots, videos, downloads, storage snapshots, or production-like browser artifacts.

## Codex browser setup

Project-scoped Codex configuration is in `.codex/config.toml`. Codex only loads project-scoped configuration after the project is trusted. The configured Playwright MCP server uses an exact pinned package version and an isolated Chromium context.

The project configuration does not use production URLs, persistent personal profiles, secrets, extension mode, or authentication state.

## Synthetic-data rule

All local tests and browser checks use synthetic data only. Do not enter real patient, provider, clinical, financial, organization, production, or credential data into the smoke page, browser tools, tests, logs, screenshots, traces, or reports.

## No production use

This foundation is not deployable product software. It exists to prove reproducible install, command execution, local browser interaction, deterministic browser testing, accessibility smoke checks, CI shape, and artifact hygiene.

## Troubleshooting

- If `pnpm` is missing, use `npm exec --yes pnpm@11.9.0 -- <command>`.
- If Playwright reports that Chromium is missing, run `pnpm exec playwright install chromium`.
- If the Codex project-scoped MCP server is not visible, trust or reload the project in Codex and re-open MCP settings.
- If a smoke test fails due to an external request, inspect the failing URL and confirm the smoke surface has no external asset references.
- If a browser artifact contains anything other than synthetic smoke data, delete the artifact and treat it as a privacy-boundary defect.

## Next bounded task

The next task may address design-foundation implementation only after orchestration acceptance. Motion, UI UX Pro Max, design-token implementation, content-registry implementation, app shells, and product features are not implemented in `P01-FND-001`.
