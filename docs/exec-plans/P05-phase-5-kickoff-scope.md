# P05 Phase 5 Kickoff Scope

## Objective

Start Phase 5 with a bounded, evidence-first design-system and application-shell foundation that is web-first and mobile-forward compatible.

## Phase title

Phase 5: Design system and application shells.

## Kickoff scope statement

Phase 5 starts with shared UI foundation contracts, shell layout scaffolds, and deterministic browser/a11y validation of component and shell states. The kickoff prioritizes web surfaces first while preserving clean mobile extension paths through shared token and component boundaries.

## In-scope for kickoff

- Define Phase 5 first execution issue (`P05-ISS-001`) with evidence-first acceptance criteria.
- Establish shared design-system token and component boundary scaffolds in existing package boundaries.
- Define four shell foundations (patient, provider, HMO/employer, admin/operations) with role-aware navigation placeholders.
- Add deterministic shell-state contracts for loading, empty, error, unauthorized, offline, and reduced-motion behavior.
- Add representative browser validation matrix expectations for mobile (~390 px), tablet (~768 px), and desktop (~1440 px).
- Keep synthetic-only test and artifact policy.

## Explicit out-of-scope for kickoff

- No production domain business logic implementation inside shared UI components.
- No production content rollout or marketing/site copy approval claims.
- No final visual-brand lock beyond scoped design-system foundations.
- No pilot activation change (pilot remains no-go).

## Deferred items (Phase 5 later increments)

- Full shell-page expansion and route-complete navigation trees.
- Full visual-regression snapshot baseline for all dynamic pages.
- Advanced bandwidth optimization and resumable upload/video fallback runtime integration.
- Full cross-application theming and white-label controls.

## Evidence-first acceptance for kickoff

Kickoff is complete when all of the following are true:

1. `P05-ISS-001` execution issue plan exists in `docs/exec-plans/`.
2. Acceptance criteria include deterministic unit/integration and browser evidence.
3. Non-goals and rollback strategy are explicitly documented.
4. Source documents and locked rules are enumerated.
5. STATUS and change-log are updated to point to `P05-ISS-001` as the active execution step.

## Locked rules carried forward

- One person has one longitudinal patient identity.
- Payer role never implies clinical-record access.
- Finalized clinical records are amended/versioned, never silently overwritten.
- Synthetic-only test data and artifact safety remain mandatory.
- Web-first implementation remains the default while preserving mobile-forward compatibility.

## Initial validation commands

```bash
git status --short
git diff --check
node ./node_modules/@playwright/test/cli.js test --config playwright.step4.config.ts
```

## Next action

Execute `P05-ISS-001` with design-token/component boundary scaffolds, shell-state scaffolds, and cross-viewport browser+a11y evidence.
