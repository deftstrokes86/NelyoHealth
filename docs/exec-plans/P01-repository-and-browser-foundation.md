# P01-FND-001 Repository, Toolchain, CI, and Codex Browser Foundation

## Objective

Create the smallest reproducible TypeScript monorepo foundation that proves installability, root quality commands, CI shape, deterministic Playwright browser tests, accessibility smoke checks, controlled browser artifacts, and Codex IDE browser readiness without implementing product features.

## Phase 0 gate conditions

- Phase 0 documentation gate: `PHASE-0-CONDITIONAL-PASS`
- Phase 1 entry gate: `PHASE-1-GO-WITH-CONDITIONS`
- Pilot launch: `PILOT-NO-GO`
- External orchestration accepted bounded foundation work for this issue.

## Scope

- TypeScript monorepo baseline
- pnpm workspaces
- Turborepo task runner
- ESLint, Prettier, TypeScript, Vitest
- Playwright Test with Chromium desktop/tablet/mobile smoke projects
- `@axe-core/playwright` accessibility smoke checks
- Project-scoped Codex Playwright MCP configuration
- Synthetic local smoke server and page
- Basic secret-pattern scan
- CI workflow
- Required engineering and governance documentation

## Non-goals

No product application, app framework, clinical feature, provider feature, marketplace feature, payment feature, auth/RBAC, database, migration, ORM model, API endpoint, service, queue, job, infrastructure, production credential, production origin, Motion install, UI UX Pro Max install, `AGENTS.md`, `.agent/PLANS.md`, or `.agents/skills` is included.

## Files created

See the final P01-FND-001 response and document register for the authoritative file list.

## Tool versions

Tool versions are recorded in `docs/engineering/toolchain.md` and pinned in `package.json`, `.node-version`, `.codex/config.toml`, CI, and the lockfile.

## Architecture decisions

- Use TypeScript monorepo foundation with pnpm workspaces.
- Use Turborepo only for repository task orchestration.
- Keep the only runnable package as `@nelyohealth/browser-smoke`.
- Use Node built-in HTTP capabilities for the smoke server.
- Use Playwright Test for deterministic browser validation.
- Use `@axe-core/playwright` for accessibility smoke evidence.
- Use project-scoped Codex MCP configuration for interactive browser setup.
- Keep Phase 0 locked requirements visible through docs and README rather than implementing domain code.

## Security constraints

- Synthetic data only.
- No production origin.
- No secrets.
- No personal browser profile.
- No persistent authentication state.
- No external request by default.
- Artifacts under ignored paths.
- Page content treated as untrusted.

## Browser setup

The smoke server binds to `127.0.0.1` by default and uses a configurable local port. Playwright starts it automatically for deterministic tests.

## Deterministic test setup

- Unit tests validate synthetic data guardrails.
- Integration tests validate the smoke server and same-origin endpoint.
- Browser tests validate interactive behavior, focus, storage, viewport overflow, console/network failures, external requests, and protected sentinels.
- Accessibility tests validate landmark/form/dialog/live-region basics and run axe smoke checks.

## CI setup

The CI workflow checks out the repo, installs exact pnpm, uses the pinned Node version, installs with frozen lockfile, installs Chromium, and runs format, lint, typecheck, unit, integration, browser, accessibility, build, and basic secret scan steps.

## Validation evidence

Validation command outcomes are recorded in the final P01-FND-001 response and the P01 status/change-log update after execution.

## Known limitations

- The host environment initially exposed Node `25.8.1`, which is not the selected repository LTS.
- `pnpm` and `corepack` were not present on the host PATH before this task.
- Firefox and WebKit execution are deferred.
- Automated axe smoke checks do not establish WCAG conformance.
- Playwright MCP localhost-only enforcement is documented and operationally restricted; the committed MCP args use only the verified minimal project-scoped package invocation.
- P01-FND-001R adds an approved official Playwright CLI fallback for interactive Codex IDE terminal browser operation while the MCP path remains upstream blocked.

## Rollback

Remove the created root toolchain files, `.codex/config.toml`, `.github/workflows/ci.yml`, `tests/`, `tools/browser-smoke/`, `tools/checks/`, `docs/engineering/`, this execution plan, and the P01 governance/status additions. Do not delete Phase 0 artifacts.

## Risks

- Local host runtime divergence from pinned Node LTS can cause package-manager differences.
- MCP server availability may require Codex IDE reload or project trust action.
- Browser artifacts can contain sensitive data in future tasks if synthetic-only rules are not enforced.
- CI action tags are commit-pinned; periodic security review is required.

## Dependencies

- External orchestration acceptance for P01-FND-001.
- Codex project trust before project-scoped configuration is loaded.
- Playwright Chromium installation for deterministic tests.
- Future browser-matrix expansion for Firefox/WebKit.
- Future design-foundation task for Motion, UI UX Pro Max, design tokens, and content registry implementation.
- Re-verification of project-scoped Playwright MCP after a relevant Codex app, IDE, browser plugin, bundled CLI, or Playwright MCP update.

## Acceptance checklist

- [x] Dependency install completed.
- [x] Frozen-lockfile install completed.
- [x] Format check completed.
- [x] Lint completed.
- [x] Typecheck completed.
- [x] Unit tests completed.
- [x] Integration tests completed.
- [x] Browser smoke tests completed.
- [x] Accessibility smoke tests completed.
- [x] Build completed.
- [x] Verify completed.
- [x] Interactive Codex IDE browser MCP check attempted; upstream blocker recorded.
- [x] Interactive Codex IDE terminal browser check completed through the approved Playwright CLI fallback.
- [x] No forbidden product/domain/framework files created.
- [x] Status and governance updated.

## Next bounded issue

P01-FND-002 is not started. The next bounded issue may address design-foundation implementation only after orchestration review accepts this foundation task.
## P01-FND-001 validation result

Deterministic foundation checks passed locally with the expected host-runtime warning that this machine runs Node v25.8.1 while the repository pins Node 24.18.0. The original interactive Codex IDE browser MCP verification was blocked in the current session by a Node-backed browser-control MCP error: `codex/sandbox-state-meta: missing field sandboxPolicy`. Before P01-FND-001R, the task result was therefore PARTIAL.

## P01-FND-001R closure update

P01-FND-001R preserves the existing `.codex/config.toml` Playwright MCP configuration and records the MCP failure as an upstream nonblocking tracked blocker. The remediation adds `@playwright/cli@0.1.14` as a local dev dependency and exposes root scripts for a named synthetic browser session:

- `browser:cli:help`
- `browser:cli:install`
- `browser:cli:open`
- `browser:cli:close`
- `browser:cli:cleanup`

Interactive browser operation was verified from the Codex IDE terminal against `http://127.0.0.1:4173` using the named `nelyohealth-smoke` session. Evidence covered page open, accessibility snapshot, heading/navigation, live-region button interaction, invalid and valid form states, dialog focus, same-origin request/response, no external requests, console checks, local/session storage checks, IndexedDB checks, service-worker checks, desktop/tablet/mobile snapshots, keyboard focus, reduced motion, screenshot capture, trace capture, browser close, server stop, and no remaining CLI browser session.

The P01-FND-001 result is updated from PARTIAL to COMPLETED pending orchestration acceptance. Playwright MCP remains `UPSTREAM-BLOCKED-NONBLOCKING-TRACKED`. P01-FND-002 is not started. Phase 2 is not started. Pilot remains `PILOT-NO-GO`.
