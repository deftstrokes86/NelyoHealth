# P02-ISS-017 Development Deploy and Staging Promotion Path Execution Plan

## Objective

Execute `P02-ISS-017 - Development deploy and staging promotion path` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Implement human-merge-to-development deployment and version promotion to staging after the P02-ISS-016 deployment-contract baseline is in place and the required human cloud/IaC decision is available.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED.
- P02-ISS-001 through P02-ISS-016 are completed or accepted.
- P02-ISS-017 is the next backlog issue.
- Pilot launch remains PILOT-NO-GO.
- Manual Git and GitHub writes remain human-only.

The repository already contains the environment strategy, the provider-neutral deployment contract baseline, and the human-gated cloud/IaC decision trail. This issue is where deployment workflow and release promotion are introduced for the first time.

## Scope

- Add the development deployment workflow that triggers after a human merge to main.
- Add the staging promotion workflow for versioned artifacts or immutable image references.
- Define the release documentation and runbook content needed to operate those paths safely.
- Preserve synthetic-only, no-production-data-downward, and human-only Git/GitHub rules.
- Keep deployment and promotion adapter-owned and environment-scoped.

## Non-goals

- No cloud provider selection.
- No IaC provider selection.
- No live cloud provisioning beyond the approved human-gated path.
- No production promotion.
- No emergency, clinical, payment, provider-detail, pharmacy, or laboratory feature work.
- No direct production data copying or live partner integration.
- No Codex GitHub writes.

## Source documents

- `AGENTS.md`
- `docs/AGENTS.md`
- `docs/engineering/phase-2-issue-backlog.md`
- `docs/STATUS.md`
- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md`
- `docs/governance/human-gated-decisions.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`
- `docs/governance/phase-2-requirements-traceability.md`

## Locked rules

- Production data must never be copied downward.
- Development deployment may only follow a human merge to main.
- Staging promotion uses a versioned artifact or immutable image reference.
- Staging promotion requires migration plan, rollback plan, dependency readiness, and smoke/browser evidence.
- Git and GitHub writes remain human-only.
- No production deploy or cloud mutation by Codex.

## Files affected

Created:

- `docs/exec-plans/P02-ISS-017-development-deploy-and-staging-promotion-path.md`

Updated:

- `docs/STATUS.md`
- `docs/governance/human-gated-decisions.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`
- `docs/governance/phase-2-requirements-traceability.md`

## Dependency changes

No dependencies are installed or changed by P02-ISS-017.

The issue depends on the deployment-contract baseline from P02-ISS-016 and the typed environment boundary from P02-ISS-015. Later deployment workflow work must revalidate environment-specific configuration and promotion controls before any install or provisioning.

## Architecture impact

- Introduces the Phase 2 deployment workflow boundary between human merge, development deployment, and staging promotion.
- Keeps deployment and promotion provider-neutral until the cloud/IaC decision is exercised through the approved path.
- Makes release artifacts, migration gates, and smoke evidence part of the deployment lifecycle.

## Data-model impact

None. No schema, migration, seed, fixture, or database artifact is created by this planning execution plan.

## API impact

None. No API route, DTO, controller, OpenAPI artifact, typed client, or application code is created by this planning execution plan.

## UI impact

None. No browser surface, route, app shell, component, visual baseline, or content surface is created by this planning execution plan.

## Privacy and security

- No real secrets are created or committed.
- No production data is copied downward.
- No provider-specific deployment detail is exposed beyond the approved human-gated contract baseline.
- Release and promotion logs must avoid PHI, payment credentials, auth secrets, and protected provider details.

## Browser scenarios

No browser surface changes in this issue plan. Browser evidence will be part of the release and promotion validation once the workflow exists.

## Tests

Issue-specific evidence:

- Documentation review.
- Release workflow and promotion-path validation in later implementation.
- Status and traceability review.

No unit, integration, contract, browser, accessibility, or visual tests are created by this execution-plan document itself.

## Milestones

1. Read the backlog, environment strategy, and deployment contract baseline.
2. Define the development deployment workflow.
3. Define the staging promotion workflow and runbook.
4. Record the governance updates and traceability links.
5. Validate the documentation and status transition.

## Validation commands

Required commands for this issue plan:

```bash
git status --short
git diff --check
```

## Rollback

Rollback is documentation-only:

- Remove the deployment workflow and promotion-path planning updates.
- Revert related governance changes.
- Remove this execution plan if the issue is not accepted.
- No runtime rollback, database rollback, container cleanup, object deletion, or deployment rollback is required because no runtime implementation exists yet.

## Risks

- The actual deployment workflow may need provider-specific implementation details once a cloud decision is approved.
- Staging promotion may depend on release artifact and migration decisions that are not yet implemented.
- Overstating deployability before the workflow exists would violate the human-gated deployment boundary.

## Decisions

Decisions are recorded in:

- `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md`
- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/governance/human-gated-decisions.md`
- `docs/governance/decision-register.md`

## Completion evidence

- Deployment workflow issue plan recorded.
- Development and staging promotion boundary made explicit.
- Governance and traceability updated for the next implementation step.