# Repository Governance

## Source precedence

1. Locked NelyoHealth requirements.
2. Phase 0 gate and Phase 1 handoff.
3. Accepted ADRs.
4. Decision register.
5. Accepted P01-FND-001 and P01-FND-002 implementations.
6. Current official GitHub, pnpm, and Changesets documentation.
7. New P01-FND-003 governance proposals.

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

## Autonomous-agent governance

No AGENTS.md, nested AGENTS.md, `.agent/PLANS.md`, autonomous-agent orchestration, or unsupported agent-governance file is created by P01-FND-003.
