# Phase 5 Requirements Traceability

## Status

Phase 5 execution is active with `P05-ISS-001` completed and `P05-ISS-002` started for workflow-level low-bandwidth resilience and retry semantics.

This document now records implemented evidence for the first Phase 5 increment and identifies remaining Phase 5 gate work.

## Canonical Step Reconciliation

| Canonical step (implementation map) | P05-ISS-001 coverage status | Notes |
|---|---|---|
| 1. Shared design-system token and component foundation | COMPLETED-P05-ISS-001 | Shared tokenized shell classes and reusable shell state card structure are implemented in `packages/ui-foundation/src/styles.css`. |
| 2. Four application shells with role-aware foundations | COMPLETED-P05-ISS-001 | Patient/provider/organization/admin shell pages now render role-aware navigation scaffolds and six deterministic state cards each. |
| 3. Accessibility automation for shared shell/component states | COMPLETED-P05-ISS-001 | ISS-014 accessibility suite passes across desktop/tablet/mobile projects with shell state scaffolds rendered. |
| 4. Low-bandwidth and resilient UI state behavior | IN-PROGRESS-P05-ISS-002 | Workflow-level resilience and retry state machine is implemented in patient-web with integration evidence; browser UX parity remains pending. |
| 5. Browser visual-validation matrix across representative widths and states | COMPLETED-P05-ISS-001 | ISS-014 browser suite validates all four shells across desktop/tablet/mobile with six required state cards per shell. |
| 6. Full Phase 5 exit-gate completion | IN-PROGRESS-BY-INCREMENTS | Phase 5 execution begins with `P05-ISS-001`; gate closure will follow evidence capture. |

## Requirement map

| Requirement ID | Requirement | Source | Primary implementation | Supporting implementation | Status |
|---|---|---|---|---|---|
| P05-REQ-001 | Shared design-system includes core token and component foundations | Implementation map Phase 5 | packages/ui-foundation | apps/*-web shells, tests/unit, tests/e2e | COMPLETED-P05-ISS-001 |
| P05-REQ-002 | Shells exist for patient, provider, HMO/employer, and admin/operations | Implementation map Phase 5 | apps/patient-web, apps/provider-web, apps/organization-web, apps/admin-web | tests/e2e, tests/accessibility | COMPLETED-P05-ISS-001 |
| P05-REQ-003 | Accessibility automation covers keyboard, focus, labels, contrast, reduced-motion, and text resizing | Implementation map Phase 5 | tests/accessibility | tests/e2e, shell foundations | COMPLETED-P05-ISS-001 |
| P05-REQ-004 | Low-bandwidth behavior includes progressive loading, retry, draft resilience, and connection-status handling | Implementation map Phase 5 | apps/patient-web workflow resilience state machine | tests/integration and patient-web unit evidence | IN-PROGRESS-P05-ISS-002 |
| P05-REQ-005 | Browser validation matrix covers representative widths and critical UI states | Implementation map Phase 5 | tests/e2e | playwright config projects and accessibility suite | COMPLETED-P05-ISS-001 |
| P05-REQ-006 | Shared UI components remain domain-logic-neutral | Implementation map Phase 5 | packages/ui-foundation | code review and boundary tests | COMPLETED-P05-ISS-001 |

## Exit-gate map

| Gate ID | Exit gate | Evidence source | Status |
|---|---|---|---|
| P05-EG-001 | All four application shells deploy | Shell build/runtime checks and browser launch evidence | PARTIAL-P05-ISS-001 |
| P05-EG-002 | Shared components pass automated accessibility checks | Accessibility test suite evidence | PARTIAL-P05-ISS-001 |
| P05-EG-003 | All pages have loading, empty, error, unauthorized, and offline states | Browser/state test evidence per shell | PARTIAL-P05-ISS-001 |
| P05-EG-004 | Patient workflows are usable on small mobile screens | Mobile viewport browser evidence plus workflow resilience transition evidence | IN-PROGRESS-P05-ISS-002 |
| P05-EG-005 | Codex has opened and inspected each shell in a real browser | Browser validation logs and reports | COMPLETED-P05-ISS-001 |
| P05-EG-006 | No domain-specific business logic exists inside shared UI components | Boundary tests and code review evidence | PARTIAL-P05-ISS-001 |

## Deterministic evidence artifacts

- Kickoff scope: `docs/exec-plans/P05-phase-5-kickoff-scope.md`
- First execution issue: `docs/exec-plans/P05-ISS-001-design-system-and-shell-foundation.md`
- Second execution issue: `docs/exec-plans/P05-ISS-002-low-bandwidth-resilience-and-retry-semantics.md`
- Unit evidence command: `node node_modules/vitest/vitest.mjs run tests/unit/phase5-shell-scaffolds.spec.ts` (passed: 3 tests)
- Browser evidence command: `node node_modules/@playwright/test/cli.js test -c playwright.iss014.config.ts` (passed: 24 tests)
- Workflow resilience evidence command: `node node_modules/vitest/vitest.mjs run apps/patient-web/src/workflow-resilience.test.ts tests/integration/patient-workflow-resilience-runtime.spec.ts` (passed: 2 files, 6 tests)
- Browser and accessibility specs:
	- `tests/e2e/iss014-web-shells.spec.ts`
	- `tests/accessibility/iss014-web-shells.a11y.spec.ts`
- Workflow resilience specs:
  - `apps/patient-web/src/workflow-resilience.test.ts`
  - `tests/integration/patient-workflow-resilience-runtime.spec.ts`
- Cross-viewport coverage: desktop/tablet/mobile projects per shell plus matching accessibility projects.

## Residual conditions

- Full pnpm repository-level verification commands may remain constrained by lockfile minimum-release-age policy in this environment.
- `playwright.iss014.config.ts` now uses direct app-local Next.js launch commands to avoid pnpm lockfile policy blockers during deterministic evidence runs.
- Remaining Phase 5 increments are required for full browser-level low-bandwidth UX coverage and complete exit-gate closure.
