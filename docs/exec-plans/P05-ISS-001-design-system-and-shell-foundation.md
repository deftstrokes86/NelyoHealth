# P05-ISS-001 Design System and Shell Foundation

## Objective

Execute the first Phase 5 issue as an evidence-first foundation for shared design-system primitives and application-shell state scaffolds, without claiming production-complete UI rollout.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS with locked invariants preserved.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- Phase 2: Completed with controlled workflow evidence.
- Phase 3: Step 1 through Step 6 completed with synthetic cross-viewport evidence.
- Phase 4: CLOSED-WITH-EVIDENCE with recorded owner signoff.
- Phase 5 kickoff scope: started by `docs/exec-plans/P05-phase-5-kickoff-scope.md`.
- Pilot launch remains PILOT-NO-GO.
- Repository-changing Git and GitHub writes remain human-only.

## Scope

- Add shared design-system token scaffolds for typography, spacing, colors, and state surfaces.
- Add shared component boundary scaffolds for controls, cards, dialogs, tables, badges, notifications, and loading states.
- Add application-shell foundation scaffolds for patient, provider, HMO/employer, and admin/operations surfaces.
- Add shell-state coverage for loading, empty, error, unauthorized, offline, and reduced-motion behavior.
- Add deterministic browser validation coverage for representative mobile/tablet/desktop widths.
- Add accessibility checks for keyboard/focus/labels/contrast/reduced-motion across shell foundations.

## Non-goals

- No production domain business logic embedded in shared UI components.
- No final brand/content approval claims.
- No complete route tree delivery for all shell pages.
- No pilot scope activation changes.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md
- docs/governance/phase-4-requirements-traceability.md
- docs/exec-plans/P05-phase-5-kickoff-scope.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5 section)
- docs/design/
- docs/testing/

## Locked rules

- Shared components must not embed domain-specific business logic.
- Browser validation must include mobile, tablet, and desktop evidence.
- Accessibility and reduced-motion checks remain mandatory for user-facing shell work.
- Synthetic-only data and artifacts for all tests and browser validation.

## Files expected to be affected

Planned create/update targets:

- packages/ui-foundation/ (update)
- apps/patient-web/ (update)
- apps/provider-web/ (update)
- apps/organization-web/ (update)
- apps/admin-web/ (update)
- tests/e2e/ (update/new)
- tests/accessibility/ (update/new)
- docs/governance/phase-5-requirements-traceability.md (update)
- docs/STATUS.md (update)
- docs/governance/change-log.md (update)

Final file list may be reduced by implementation choices if acceptance criteria are still met.

## Dependency changes

No new dependency is authorized by default for P05-ISS-001.

If a dependency becomes necessary, exact version pinning plus governance review is required before adoption.

## Architecture impact

- Extends shared UI foundation boundaries while preserving modular-monolith package discipline.
- Keeps design-system and shell behavior deterministic and test-first.

## Data-model impact

- No mandatory schema migration in this issue plan.

## API impact

- No new production API contract is required by this foundational UI issue.

## UI and browser impact

- Browser validation must inspect shell foundations at representative widths around 390 px, 768 px, and 1440 px.
- Browser evidence must include hover, focus, active, disabled, loading, empty, validation-error, server-error, offline, unauthorized, and reduced-motion states where applicable.
- Accessibility checks must include keyboard and focus management assertions.

## Privacy and security

- UI state handling must not leak protected metadata in error/unauthorized/offline surfaces.
- Browser artifacts must remain synthetic and in ignored paths only.

## Acceptance criteria

1. Shared token/component boundaries exist with strict TypeScript typing.
2. Four shell foundations exist for patient, provider, HMO/employer, and admin/operations.
3. Shell states (loading/empty/error/unauthorized/offline/reduced-motion) are implemented and testable.
4. Browser validation covers representative mobile/tablet/desktop widths for shared shell foundations.
5. Accessibility checks pass for the affected shell states and shared components.
6. Governance documents are updated with evidence references and residual conditions.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/@playwright/test/cli.js test --config playwright.step4.config.ts
```

Issue-specific test commands will be added once implementation files are created.

## Rollback

- Revert new shell/design-system scaffold files and related test wiring.
- Revert documentation updates.
- Preserve change-log evidence of attempted execution and reason for rollback.

## Risks

- Over-claiming production UI readiness from shell scaffolds.
- Incomplete state coverage across all shell surfaces.
- Browser validation flakiness if dynamic regions are over-snapshotted.

## Decisions trail

- docs/governance/decision-register.md
- docs/governance/change-log.md
- docs/governance/phase-4-requirements-traceability.md
- docs/governance/phase-5-requirements-traceability.md

## Completion evidence

P05-ISS-001 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
