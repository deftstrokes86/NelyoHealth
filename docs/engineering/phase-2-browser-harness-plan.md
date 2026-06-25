# Phase 2 Browser Harness Plan

## Purpose

Define the Phase 2 browser harness required for application skeleton validation. This plan extends Phase 1 deterministic browser and Codex browser work without creating tests in P02-PLAN-001.

## Harness goals

- Start the application skeleton and local dependencies.
- Reset and seed synthetic data deterministically.
- Sign in synthetically for each app surface.
- Navigate representative local routes for patient, provider, organization, admin, and mobile shell.
- Fail on unexpected console errors and failed network requests.
- Retain traces, screenshots, and videos according to artifact policy.
- Run accessibility checks and route-level privacy assertions.
- Allow Codex to inspect local routes through the project-scoped browser path and Playwright CLI fallback.

## Playwright projects

P02-ISS-014 must define Chromium projects for each app and viewport class:

| App | Desktop | Tablet | Mobile |
|---|---|---|---|
| patient-web | Required | Required | Required |
| provider-web | Required | Required | Required |
| organization-web | Required | Required | Required |
| admin-web | Required | Required | Required |
| mobile shell web preview | Required if Expo web preview exists | Required if Expo web preview exists | Required |

Firefox and WebKit remain deferred unless a later issue explicitly expands browser coverage.

## Auth storage states

- Auth states must be generated from synthetic login/setup flows.
- Auth files must live under ignored test artifact paths.
- Auth state must be per role and per app where behavior differs.
- Auth state must not include real cookies, production tokens, personal browser profile data, provider secrets, or real user data.
- Storage-state generation must be a Playwright setup project or equivalent deterministic precondition.

## Synthetic data builders

P02-ISS-014 depends on P02-ISS-004 seed/reset behavior. Builders must support:

- Synthetic person/user/role records enough to sign in to each shell.
- Synthetic organization and admin context labels.
- Synthetic document object for signed URL upload test.
- Synthetic queue job for worker test.
- No clinical records, prescriptions, provider matching, payment capture, claims, real provider identities, real patient identities, or production-like PHI.

## Test architecture

| Layer | Required artifacts |
|---|---|
| API helpers | Health/readiness, seed/reset, synthetic auth, signed URL setup, queue job setup |
| Page/screen objects | App shell navigation, route visit, sign-in state assertion, shell readiness |
| Fixtures | Per-app base URL, storage state, request context, console/network collectors |
| Assertions | No unexpected console errors, no failed requests, no protected provider fields, no secret-looking values |
| Reports | HTML report, traces, screenshots on failure, videos on retry/failure, machine-readable summary |

## Privacy assertions

Every route-level browser test must assert that protected pre-payment provider detail classes do not appear in:

- Response bodies.
- HTML and hydration payloads.
- DOM and hidden DOM.
- Accessibility snapshot.
- Local storage, session storage, IndexedDB, service-worker caches where applicable.
- Console output.
- Browser trace/network artifacts.

Phase 2 shells should have no provider matching data at all. The assertions are still required so the harness is ready before later product phases.

## Accessibility and visual checks

- Run axe-based smoke checks on each shell route.
- Preserve Phase 1 design token and visual-contract expectations.
- Add screenshot baselines only after controlled baseline environment approval.
- Respect reduced-motion preferences in any skeleton animation.

## Sharding, retries, and artifacts

- CI must support Playwright sharding once the suite grows.
- Retries are allowed only with retained traces and no silent pass masking.
- Trace mode should retain failure and retry evidence.
- Videos should be retained on failure or first retry, not on every successful run by default.
- Artifact paths must stay ignored unless a later evidence-publication policy is approved.

## Codex browser inspection

P02-ISS-014 must preserve:

- Project-scoped Playwright MCP use for trusted local routes.
- Playwright CLI fallback if MCP becomes unavailable.
- Local/test/staging origin allow-list.
- No personal browser profile.
- No production origin.
- Console and network failure summaries in task evidence.

## Exit criteria

The browser harness is Phase 2 complete only when:

- It can start required local apps and dependencies.
- It can reset/seed synthetic state.
- It can generate synthetic auth storage states.
- It can navigate all app shells across required viewport classes.
- It fails on console/network regressions.
- It keeps traces/screenshots/videos under governed artifacts.
- It performs route-level privacy assertions.
- Codex can inspect local routes and report browser failures.

