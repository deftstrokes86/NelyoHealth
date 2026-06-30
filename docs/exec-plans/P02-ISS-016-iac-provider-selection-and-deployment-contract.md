# P02-ISS-016 IaC Provider Selection and Deployment Contract Execution Plan

## Objective

Execute `P02-ISS-016 - IaC provider selection and deployment contract` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Record the provider-neutral deployment contract, the cloud/IaC human-decision gate, and the minimum environment and deployment expectations required before any later deployment workflow implementation can proceed.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED.
- P02-ISS-001 through P02-ISS-015 are already completed.
- P02-ISS-016 is the next backlog issue.
- Pilot launch remains PILOT-NO-GO.
- Manual Git and GitHub writes remain human-only.

The repository already contains the Phase 2 environment strategy and a draft environment/deployment baseline. No cloud provider has been selected, and no live IaC implementation exists.

## Scope

- Refine the environment and deployment baseline into the canonical provider-neutral deployment contract for Phase 2.
- Record the remaining cloud/IaC human-decision gate without inventing an approval that does not exist.
- Update governance records so the pending provider decision is explicit.
- Preserve the OpenTofu preference, Pulumi candidate status, and Terraform review-required posture from ADR-P02-005.
- Preserve all existing locked requirements.

## Non-goals

- No cloud provider selection.
- No IaC skeleton files.
- No Terraform, OpenTofu, or Pulumi configuration.
- No cloud account, secret, DNS, TLS, CDN, WAF, managed database, queue, object storage, or monitoring resource creation.
- No deployment workflow, release workflow, environment promotion automation, or staging deployment.
- No production data, production secrets, production deploy, package publication, tag, release, PR, commit, or push.

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
- Local, development, staging, production, and partner sandbox boundaries remain separate.
- Provider details and other protected data remain subject to locked disclosure rules.
- Git and GitHub writes remain human-only.
- No production deploy or cloud mutation by Codex.

## Files affected

Created:

- `docs/exec-plans/P02-ISS-016-iac-provider-selection-and-deployment-contract.md`

Updated:

- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/governance/human-gated-decisions.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`
- `docs/governance/phase-2-requirements-traceability.md`

## Dependency changes

No dependencies are installed or changed by P02-ISS-016.

The issue records the deployment contract and unresolved provider gate only. Later deployment work must revalidate provider choice, IaC tool choice, and environment controls before any installation or provisioning.

## Architecture impact

- Confirms that Phase 2 deployment remains provider-neutral until human decision evidence exists.
- Confirms OpenTofu as the preferred IaC candidate, Pulumi as a candidate, and Terraform as review-required.
- Confirms deployment expectations for local, development, and staging environments without creating live resources.

## Data-model impact

None. No schema, migration, seed, fixture, or database artifact is created.

## API impact

None. No API route, DTO, controller, OpenAPI artifact, typed client, or application code is created.

## UI impact

None. No browser surface, route, app shell, component, visual baseline, or content surface is created.

## Privacy and security

- No secret material is created, copied, or committed.
- No production, development, or staging resource is provisioned.
- No provider-specific operational detail is recorded beyond the existing approved candidate posture.
- No PHI, payment credential, auth secret, or protected provider detail is introduced.

## Browser scenarios

No browser surface changes in this issue. Deterministic and interactive browser validation are not applicable for P02-ISS-016.

## Tests

Issue-specific evidence:

- Markdown link and status review.
- `git diff --check`.
- `git status --short`.

No unit, integration, contract, browser, accessibility, or visual tests are created because this issue updates deployment-contract documentation and governance only.

## Milestones

1. Read the Phase 2 backlog, ADR, environment strategy, and baseline docs.
2. Refine the provider-neutral deployment contract.
3. Record the remaining cloud/IaC human-decision gate.
4. Update governance and traceability records.
5. Run validation and review diff/status.

## Validation commands

Required commands for this issue:

```bash
git status --short
git diff --check
```

## Rollback

Rollback is documentation-only:

- Remove the deployment-contract updates from `docs/engineering/environment-and-deployment-baseline.md`.
- Revert the related governance updates.
- Remove this execution plan if the issue is not accepted.
- No runtime rollback, database rollback, container cleanup, object deletion, or deployment rollback is required because no runtime implementation exists.

## Risks

- A later human cloud decision may require a different IaC tool or a more specific deployment contract.
- Deployment requirements could expand once a provider is selected.
- Overstating readiness would violate the no-live-provider and no-deploy boundaries.

## Decisions

Decisions are recorded in:

- `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md`
- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/governance/human-gated-decisions.md`
- `docs/governance/decision-register.md`

## Completion evidence

- Provider-neutral deployment contract baseline recorded.
- Human cloud/IaC gate kept explicit.
- Governance and traceability updated.