# Phase 4 Requirements Traceability

## Status

`P04-ISS-001` scaffold implementation and synthetic evidence capture are completed for the authorization, consent, guardianship, and audit foundation baseline.

All defined Phase 4 exit gates now have deterministic API and cross-viewport browser evidence mapped below for this execution scope.

## Canonical Step Reconciliation

The implementation map defines full Phase 4 capability outcomes. `P04-ISS-001` delivers only the first bounded foundation increment.

| Canonical step (implementation map) | P04-ISS-001 coverage status | Notes |
|---|---|---|
| 1. Authorization model (RBAC + ABAC + ReBAC with full policy inputs) | COMPLETED-OPERATIONAL-EVIDENCE | Role, attribute, and relationship-aware policy decisions are implemented with deterministic deny-by-default behavior, route-envelope integration, endpoint coverage, and cross-viewport fail-closed browser evidence. |
| 2. Relationship model entities and lifecycle metadata | COMPLETED-OPERATIONAL-EVIDENCE | Guardian, household, sponsor, caregiver delegation, emergency contact, and clinical proxy models are implemented with lifecycle metadata and persistence-backed workflow transitions validated through integration and authorization-effect tests. |
| 3. Granular consent with full domain coverage, versioning, and revocation | COMPLETED-OPERATIONAL-EVIDENCE | Granular consent domains, versioned transitions, stale-version rejection, revocation handling, workflow services, integration checks, and browser validation are implemented with immediate authorization effect evidence. |
| 4. Sensitive-event audit capture (full metadata set) | COMPLETED-OPERATIONAL-EVIDENCE | Append-only audit event workflows now capture full metadata (actor, subject, organization, action, resource, purpose, timestamp, request ID, prior/new state, IP/device, and break-glass usage), reject mutation attempts at application boundary routes, and enforce amendment/versioning-only correction paths. |
| 5. Break-glass controls (reason, TTL, compliance notification, review, patient visibility) | COMPLETED-OPERATIONAL-EVIDENCE | Operational break-glass workflows now enforce reason and short-lived TTL, emit compliance notifications on activation, support post-event review completion, and expose patient-visible access history through application routes with deterministic API and browser evidence. |
| 6. Browser validation across role boundaries and failure paths | COMPLETED-OPERATIONAL-EVIDENCE | Browser validation now includes a full role-separation matrix (payer, sponsor, employer, HMO, guardian, caregiver, clinician, support, and admin), manipulated identifier checks, stale-session checks, revoked consent/relationship checks, and back-navigation-after-revocation checks across critical protected routes with cross-viewport and accessibility evidence. |
| 7. Full Phase 4 exit-gate completion | COMPLETED-EXIT-GATE-EVIDENCE | All Phase 4 exit gates listed in this traceability set are mapped to deterministic API/browser evidence with completed statuses. |

## Requirement map

| Requirement ID | Requirement | Source | Primary implementation | Supporting implementation | Status |
|---|---|---|---|---|---|
| P04-REQ-001 | Policy inputs include actor, role, organization, patient, relationship, purpose, consent, encounter, emergency status, and time context | Implementation map Phase 4 | apps/api/src/authorization-policy.ts | apps/api/src/authorization-policy-handlers.ts, apps/api/src/runtime-routes.ts, apps/api/src/authorization-policy-endpoint-coverage.test.ts, tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-OPERATIONAL-POLICY-MODEL |
| P04-REQ-002 | Relationship model supports guardian, household, sponsor, caregiver delegation, emergency contact, and clinical proxy semantics | Implementation map Phase 4 | apps/api/src/relationship-model.ts | apps/api/src/relationship-model.test.ts, apps/api/src/relationship-workflows.ts, apps/api/src/relationship-workflows.test.ts, apps/api/src/relationship-workflows.integration.test.ts | COMPLETED-OPERATIONAL-RELATIONSHIP-MODEL |
| P04-REQ-003 | Consent is granular, revocable, and version-aware in decision flows | Implementation map Phase 4 | apps/api/src/granular-consent.ts | apps/api/src/granular-consent.test.ts, apps/api/src/granular-consent-workflows.ts, apps/api/src/granular-consent-workflows.test.ts, apps/api/src/granular-consent-workflows.integration.test.ts, apps/api/src/authorization-policy-handlers.test.ts, tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-OPERATIONAL-GRANULAR-CONSENT |
| P04-REQ-004 | Sensitive actions produce append-only audit events with full metadata and amendment/versioning enforcement | Implementation map Phase 4 | apps/api/src/audit-event-workflows.ts | apps/api/src/runtime-routes.ts, apps/api/src/runtime-routes.test.ts, apps/api/src/audit-event-workflows.test.ts, apps/api/src/audit-event-workflows.integration.test.ts | COMPLETED-OPERATIONAL-APPEND-ONLY-AUDIT |
| P04-REQ-005 | Break-glass controls require reason, short-lived TTL, compliance notification, post-event review, and patient-visible access history | Implementation map Phase 4 | apps/api/src/break-glass-workflows.ts | apps/api/src/break-glass-workflows.test.ts, apps/api/src/break-glass-workflows.integration.test.ts, apps/api/src/runtime-routes.ts, apps/api/src/runtime-routes.test.ts, tests/e2e/authorization-policy-journeys.spec.ts | COMPLETED-OPERATIONAL-BREAK-GLASS-CONTROLS |
| P04-REQ-006 | Browser validation covers full role/context switching matrix, revoked consent, revoked relationship, stale session, manipulated identifier failure paths, and back-navigation-after-revocation | Implementation map Phase 4 | tests/e2e/authorization-policy-journeys.spec.ts | tests/accessibility/authorization-policy-journeys.a11y.spec.ts, scripts/browser-smoke-server.mjs, playwright.step4.config.ts | COMPLETED-ROLE-MATRIX-AND-FAIL-CLOSED-EVIDENCE |

## Exit-gate map

| Gate ID | Exit gate | Evidence source | Status |
|---|---|---|---|
| P04-EG-001 | Every protected endpoint has policy tests | apps/api/src/authorization-policy-handlers.test.ts, apps/api/src/runtime-routes.test.ts, and apps/api/src/granular-consent.test.ts policy and reason-code envelope assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-002 | Sponsor payment access does not grant clinical access | apps/api/src/authorization-policy-handlers.test.ts sponsor denial + tests/e2e/authorization-policy-journeys.spec.ts sponsor denial browser assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-003 | Guardian access can be restricted and revoked | apps/api/src/authorization-policy-handlers.test.ts consent/relationship revocation + tests/e2e/authorization-policy-journeys.spec.ts immediate denial assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-004 | Break-glass access is time-limited and audited | apps/api/src/break-glass-workflows.test.ts and apps/api/src/break-glass-workflows.integration.test.ts TTL expiry + compliance notification assertions, apps/api/src/runtime-routes.test.ts boundary expiry rejection, tests/e2e/authorization-policy-journeys.spec.ts operational break-glass browser assertions | COMPLETED-END-TO-END-OPERATIONAL-EVIDENCE |
| P04-EG-005 | Audit events cannot be edited through the application | apps/api/src/runtime-routes.test.ts mutation-attempt route rejection + apps/api/src/audit-event-workflows.test.ts append-only mutation rejection + tests/e2e/authorization-policy-journeys.spec.ts audit mutation-denial and amendment/versioning assertions | COMPLETED-APPLICATION-BOUNDARY-IMMUTABILITY |
| P04-EG-006 | Administrators cannot silently impersonate patients | apps/api/src/authorization-policy-handlers.test.ts admin impersonation denial + tests/e2e/authorization-policy-journeys.spec.ts impersonation denial assertions | COMPLETED-SYNTHETIC-EVIDENCE |
| P04-EG-007 | Browser tests verify access loss immediately after consent or relationship revocation | playwright.step4.config.ts desktop/tablet/mobile projects with tests/e2e/authorization-policy-journeys.spec.ts expanded cross-route revocation and back-navigation assertions | COMPLETED-CROSS-VIEWPORT-AND-ROUTE-MATRIX |

## Browser evidence summary

| Protected route | Manipulated identifier | Stale session | Revoked consent | Revoked relationship | Back-navigation after revocation | Evidence tests |
|---|---|---|---|---|---|---|
| /api/authorization-policy | denied: manipulated-identifier-detected | denied: stale-session | denied: consent-revoked | denied: relationship-revoked | denied: revocation-persisted-on-back-navigation | tests/e2e/authorization-policy-journeys.spec.ts role and fail-closed matrix |
| /api/disclosure-eligibility | denied: manipulated-identifier-detected | denied: stale-session | denied: consent-revoked | denied: relationship-revoked | denied: revocation-persisted-on-back-navigation | tests/e2e/authorization-policy-journeys.spec.ts cross-route fail-closed matrix + tests/accessibility/authorization-policy-journeys.a11y.spec.ts stale-session check |
| /api/tenant-protected-resource | denied: manipulated-identifier-detected | denied: stale-session | denied: consent-revoked | denied: relationship-revoked | denied: revocation-persisted-on-back-navigation | tests/e2e/authorization-policy-journeys.spec.ts cross-route fail-closed matrix + tests/accessibility/authorization-policy-journeys.a11y.spec.ts back-navigation revocation check |

## Deterministic evidence artifacts

- API unit tests command: `node node_modules/vitest/vitest.mjs run apps/api/src/break-glass-workflows.test.ts apps/api/src/break-glass-workflows.integration.test.ts apps/api/src/runtime-routes.test.ts apps/api/src/authorization-policy-handlers.test.ts`
- API unit tests result: `4 passed files, 43 passed tests (0.75s)`
- Browser tests command: `node node_modules/@playwright/test/cli.js test -c playwright.step4.config.ts`
- Browser tests result: `24 passed (18.6s)`
- Browser report output folder: `playwright-report/step4`

## Initial evidence artifacts

- docs/exec-plans/P04-phase-4-kickoff-scope.md
- docs/exec-plans/P04-ISS-001-authorization-consent-guardianship-audit-foundation.md

## Residual conditions

- Full pnpm repository-level verification commands remain subject to lockfile minimum-release-age policy constraints in this environment (`electron-to-chromium@1.5.384` minimum-age violation).
- `P04-ISS-001` evidence is synthetic scaffold evidence and does not claim production policy enforcement or external domain approval closure.

## Phase transition signoff

- Phase 4 closure decision: APPROVED
- Signoff authority: Stephen Igwebuike
- Signoff date: 2026-07-02
- Transition status: READY-FOR-PHASE-5-KICKOFF
