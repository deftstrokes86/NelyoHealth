# Phase 4 Requirements Traceability

## Status

`P04-ISS-001` scaffold implementation and synthetic evidence capture are completed for the authorization, consent, guardianship, and audit foundation baseline.

Phase 4 remains in-progress overall, but the first execution issue now has deterministic API and cross-viewport browser evidence mapped to each gate below.

## Requirement map

| Requirement ID | Requirement | Source | Primary implementation | Supporting implementation | Status |
|---|---|---|---|---|---|
| P04-REQ-001 | Policy inputs include actor, role, organization, patient, relationship, purpose, consent, encounter, emergency status, and time context | Implementation map Phase 4 | apps/api/src/authorization-policy.ts | apps/api/src/authorization-policy-handlers.ts, apps/api/src/runtime-routes.ts | COMPLETED-DETERMINISTIC-POLICY-INPUT-SCAFFOLD |
| P04-REQ-002 | Relationship model supports guardian, household, sponsor, caregiver delegation, emergency contact, and clinical proxy semantics | Implementation map Phase 4 | apps/api/src/authorization-policy.ts | apps/api/src/authorization-policy-handlers.ts, apps/api/src/authorization-policy-handlers.test.ts | COMPLETED-RELATIONSHIP-CONTEXT-GUARD-SCAFFOLD |
| P04-REQ-003 | Consent is granular, revocable, and version-aware in decision scaffolds | Implementation map Phase 4 | apps/api/src/authorization-policy-handlers.ts | apps/api/src/authorization-policy-handlers.test.ts, tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-REVOCATION-FAIL-CLOSED-SCAFFOLD |
| P04-REQ-004 | Sensitive actions produce append-only audit intent events with bounded metadata | Implementation map Phase 4 | apps/api/src/authorization-policy.ts | apps/api/src/authorization-policy-handlers.ts, apps/api/src/authorization-policy-handlers.test.ts | COMPLETED-APPEND-ONLY-AUDIT-INTENT-SCAFFOLD |
| P04-REQ-005 | Break-glass decision path requires explicit reason and audit tags | Implementation map Phase 4 | apps/api/src/authorization-policy-handlers.ts | apps/api/src/authorization-policy-handlers.test.ts, tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-BREAK-GLASS-CHALLENGE-SCAFFOLD |
| P04-REQ-006 | Browser validation covers role/context switching, revoked consent, revoked relationship, stale session, and manipulated identifier failure paths | Implementation map Phase 4 | tests/e2e/authorization-policy-journeys.spec.ts | tests/accessibility/authorization-policy-journeys.a11y.spec.ts, scripts/browser-smoke-server.mjs, playwright.step4.config.ts | COMPLETED-CROSS-VIEWPORT-EVIDENCE-CAPTURED |

## Exit-gate map

| Gate ID | Exit gate | Evidence source | Status |
|---|---|---|---|
| P04-EG-001 | Every protected endpoint has policy tests | apps/api/src/authorization-policy-handlers.test.ts and apps/api/src/runtime-routes.test.ts policy and reason-code envelope assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-002 | Sponsor payment access does not grant clinical access | apps/api/src/authorization-policy-handlers.test.ts sponsor denial + tests/e2e/authorization-policy-journeys.spec.ts sponsor denial browser assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-003 | Guardian access can be restricted and revoked | apps/api/src/authorization-policy-handlers.test.ts consent/relationship revocation + tests/e2e/authorization-policy-journeys.spec.ts immediate denial assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-004 | Break-glass access is time-limited and audited | apps/api/src/authorization-policy-handlers.test.ts break-glass challenge + tests/e2e/authorization-policy-journeys.spec.ts break-glass reason/window assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-005 | Audit events cannot be edited through the application | apps/api/src/authorization-policy-handlers.test.ts audit append-only denial + tests/e2e/authorization-policy-journeys.spec.ts audit mutation-denial assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-006 | Administrators cannot silently impersonate patients | apps/api/src/authorization-policy-handlers.test.ts admin impersonation denial + tests/e2e/authorization-policy-journeys.spec.ts impersonation denial assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-007 | Browser tests verify access loss immediately after consent or relationship revocation | playwright.step4.config.ts desktop/tablet/mobile projects with tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-CROSS-VIEWPORT |

## Deterministic evidence artifacts

- API unit tests command: `node node_modules/vitest/vitest.mjs run apps/api/src/authorization-policy.test.ts apps/api/src/authorization-policy-handlers.test.ts apps/api/src/runtime-routes.test.ts`
- API unit tests result: `3 passed files, 16 passed tests (1.39s)`
- Browser tests command: `node node_modules/@playwright/test/cli.js test -c playwright.step4.config.ts`
- Browser tests result: `9 passed (10.6s)`
- Browser report output folder: `playwright-report/step4`

## Initial evidence artifacts

- docs/exec-plans/P04-phase-4-kickoff-scope.md
- docs/exec-plans/P04-ISS-001-authorization-consent-guardianship-audit-foundation.md

## Residual conditions

- Full pnpm repository-level verification commands remain subject to lockfile minimum-release-age policy constraints in this environment (`electron-to-chromium@1.5.384` minimum-age violation).
- `P04-ISS-001` evidence is synthetic scaffold evidence and does not claim production policy enforcement or external domain approval closure.
