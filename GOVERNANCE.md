# Repository Governance

## Source precedence

1. Locked NelyoHealth requirements.
2. Current explicit owner decisions, including human-only Git and GitHub writes.
3. Phase 0 and Phase 1 gate documents.
4. Accepted ADRs.
5. Decision register.
6. Build implementation map.
7. Current repository implementation.

## Decision register

Material decisions must be recorded in `docs/governance/decision-register.md` with owner, status, evidence, and review trigger. Do not fabricate clinical, legal, regulatory, privacy, finance, commercial, or operational approvals.

## ADR process

Architecture-significant changes require an ADR or an explicit register entry linking to an existing ADR. ADR changes must preserve locked requirements and identify reversibility, dependencies, risks, and test evidence.

## Risk and dependency governance

Risks and dependencies are tracked in governance registers. Repository files may document required GitHub settings, dependency reviews, and license reviews, but they do not prove those external controls are active.

## Approval boundaries

Repository maintainers may approve bounded documentation and tooling changes. Domain owners must approve clinical, legal, regulatory, privacy, security, payment, pharmacy, laboratory, HMO, employer, sponsor, guardian, accessibility, and commercial-risk decisions.

## Phase gates

Phase 1 foundation completion is separate from Phase 2 entry and pilot readiness. Phase 2 may not begin without external orchestration. Pilot launch remains PILOT-NO-GO until a later explicit gate approves it.

## Architecture-change process

Architecture changes require source review, ADR/register updates, dependency review, security/privacy review, browser/accessibility impact review where relevant, and traceability updates.

## Third-party dependency review

New dependencies require documented purpose, exact version, primary-source verification, security review, license classification, transitive-impact review, and owner. Runtime, clinical, payment, identity, analytics, infrastructure, or external-service dependencies require domain review.

## Release authority

Release readiness is not release authorization. No script may tag, publish, push, deploy, create a GitHub release, publish npm packages, or alter GitHub settings automatically during Phase 1.

## Repository instruction governance

`AGENTS.md` files are repository instructions only. They do not create autonomous agents, subagents, agent teams, routing systems, or background execution. `.agent/PLANS.md` is an execution-plan convention, not an autonomous-agent configuration.

## Manual Git and GitHub authority

The human owner retains exclusive authority for staging, committing, pushing, branch creation, pull-request creation, merging, tagging, releases, deployments, package publication, and GitHub settings. Codex may inspect Git state and produce a suggested commit message only.

The current founder-owned personal repository is explicitly accepted for this founder-led stage. GitHub organization creation is deferred until team growth, ownership transfer, production-governance needs, or managed permissions justify it.
