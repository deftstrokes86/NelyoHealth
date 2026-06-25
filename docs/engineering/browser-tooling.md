# P01-FND-001 Browser Tooling

## Document Control

| Field | Value |
|---|---|
| Status | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE |
| Phase | P01-FND-001 |
| Owner | Engineering / QA / Security |
| Date checked | 2026-06-25 |

## Scope

This task implements a synthetic browser tooling foundation only. It does not create product pages, app shells, routes, authentication, provider discovery, marketplace flows, payments, clinical workflows, database schemas, or production infrastructure.

## Project-scoped Codex browser configuration

The project configuration is `.codex/config.toml`. Codex loads it only after the repository is trusted. The configured MCP server uses:

- `@playwright/mcp@0.0.76`
- Chromium
- Isolated context
- Controlled output directory `.artifacts/playwright-mcp`
- Prompted approval mode for tools
- No secrets
- No production URLs
- No personal browser profile
- No extension mode
- No persistent authentication state

The current project configuration uses verified Playwright MCP 0.0.76 flags for a Chromium-based Chrome browser, isolated context, localhost/127.0.0.1 host allow-list, local smoke-page origin allow-list, service-worker blocking, controlled output directory, file output mode, omitted image responses, warning-level console capture, and bounded action/navigation timeouts. Playwright MCP documents that origin allow-lists are not a security boundary and do not affect redirects, so deterministic tests and task instructions remain part of the control.

## Deterministic Playwright Test setup

`playwright.config.ts` starts `tools/browser-smoke/server.mjs` and runs Chromium projects for:

- Desktop
- Tablet
- Mobile

Configured evidence capture:

- Screenshots on failure only
- Trace on first retry
- Video retained on failure
- HTML report under ignored artifacts
- Test results under ignored artifacts
- No production base URL
- No authentication state
- No external request by default

## Synthetic smoke surface

The smoke surface includes:

- One page heading
- Semantic navigation
- One interactive button
- A live status region
- A labelled form field
- Accessible validation error
- Dialog focus behavior
- Same-origin asynchronous request
- Loading, success, and handled error states
- Responsive desktop/tablet/mobile layout
- Visible keyboard focus
- Reduced-motion support
- No external network dependency
- No patient, provider, clinical, financial, organization, or production data

## Browser assertion helpers

The test helpers fail on:

- Browser console errors
- Page exceptions
- Failed first-party requests
- External requests
- Protected sentinel text
- Unexpected localStorage or sessionStorage keys
- Unexpected IndexedDB databases
- Service-worker registrations
- Horizontal viewport overflow

## Accessibility smoke boundary

The automated `@axe-core/playwright` scan is a smoke check only. It does not establish WCAG conformance. Manual accessibility review remains required before release.

## Artifact policy

Ignored artifact paths:

- `.playwright-cli/`
- `.artifacts/playwright/`
- `.artifacts/playwright-cli/`
- `.artifacts/playwright-mcp/`
- `.artifacts/screenshots/`
- `.artifacts/traces/`
- `.artifacts/videos/`
- `.artifacts/network/`
- `test-results/`
- `playwright-report/`
- `.auth/`

Artifacts must use synthetic data only and must not be committed unless a later reviewed process explicitly attaches sanitized evidence.

## P01-FND-001R Playwright CLI fallback

P01-FND-001R adds `@playwright/cli@0.1.14` as the approved temporary interactive browser fallback for Codex IDE terminal operation while the Playwright MCP path remains upstream blocked by `codex/sandbox-state-meta: missing field sandboxPolicy`.

The fallback is documented in `docs/engineering/browser-cli-fallback.md` and exposed through these root scripts:

- `pnpm browser:cli:help`
- `pnpm browser:cli:install`
- `pnpm browser:cli:open`
- `pnpm browser:cli:close`
- `pnpm browser:cli:cleanup`

The fallback uses the named synthetic session `nelyohealth-smoke` and the existing local smoke URL `http://127.0.0.1:4173`. It does not use personal browser profiles, extension mode, CDP attach to a personal browser, production origins, real data, global packages, or undocumented sandbox changes.

P01-FND-001R verified:

- Exact CLI version `0.1.14`.
- CLI Chromium browser installation.
- Headed local smoke page open through the named session.
- Accessibility snapshot, heading, navigation, live-region interaction, form validation, dialog focus, same-origin request, console, storage, IndexedDB, service-worker, viewport, keyboard, reduced-motion, screenshot, and trace checks.
- Only `127.0.0.1:4173` network requests.
- Browser session cleanup with `playwright-cli list` returning no browsers.

This fallback satisfies the interactive browser layer for P01-FND-001 closure. It does not mark Playwright MCP operational. `BLK-P01-FND-001` remains open as `NONBLOCKING-TRACKED` pending a successful project-scoped Playwright MCP smoke verification after a relevant Codex or Playwright MCP update.
