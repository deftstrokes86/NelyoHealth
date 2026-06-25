# P01-FND-003 Repository Collaboration, Release, and Dependency Governance

## Objective

Create the repository collaboration, release-readiness, and dependency-governance foundation without beginning Phase 2 and without implementing product application features.

## Source precedence

1. Locked NelyoHealth requirements.
2. Phase 0 and Phase 1 handoff artifacts.
3. ADRs and governance decisions.
4. Accepted P01-FND-001 and P01-FND-002 outputs.
5. Official GitHub, pnpm, npm, and Changesets documentation verified on 2026-06-25.
6. P01-FND-003 implementation proposals.

## Implemented scope

- Community files: CONTRIBUTING, SECURITY, SUPPORT, GOVERNANCE, CHANGELOG, pull request template, issue forms, and CODEOWNERS.
- GitHub configuration: Dependabot, dependency-review config, release-note config, pinned CI updates, read-only release-readiness workflow.
- Dependency governance: exact package policy, license check, dependency inventory, pnpm audit/outdated scripts, and policy config.
- Changesets: exact local @changesets/cli 2.31.0 dependency, private-package config, and policy check.
- Phase 1 closure artifacts: requirements traceability, gate review, completion report, and Phase 2 readiness handoff.

## Explicit non-scope

No application shell, auth, RBAC, ABAC, database, API, payment, video, clinical, pharmacy, laboratory, HMO, employer, guardian, sponsor, matching, fulfilment, production release, production infrastructure, real data, or pilot-launch work is implemented.

## External-admin pending items

- GitHub branch protection or repository rulesets.
- Required status checks.
- Enforced CODEOWNERS review.
- Private vulnerability reporting settings.
- Dependency Review workflow activation, because GitHub support could not be verified locally without gh.
- Repository labels/projects, which were not assumed.

## Runtime note

Local implementation observed Node v25.8.1 while the repository pins Node 24.18.0. The exact pnpm version used was 11.9.0.
