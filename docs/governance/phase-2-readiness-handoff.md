# Phase 2 Readiness Handoff

## Readiness statement

PHASE-2-GO-WITH-CONDITIONS

Phase 2 may begin only after external orchestration explicitly starts it. This document does not execute Phase 2 and does not approve production infrastructure.

## Canonical Phase 2 title and scope

The implementation map identifies Phase 2 as Platform and infrastructure foundation. Permitted Phase 2 work is limited to bounded platform/infrastructure foundation tasks authorized by the next external prompt.

## Files Phase 2 must read first

- README.md
- CONTRIBUTING.md
- SECURITY.md
- SUPPORT.md
- GOVERNANCE.md
- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- .github/workflows/ci.yml
- .github/workflows/release-readiness.yml
- docs/STATUS.md
- docs/governance/phase-0-completion-report.md
- docs/governance/phase-0-gate-review.md
- docs/governance/phase-1-readiness-handoff.md
- docs/governance/phase-1-requirements-traceability.md
- docs/governance/phase-1-gate-review.md
- docs/governance/phase-1-completion-report.md
- docs/governance/decision-register.md
- docs/governance/risk-register.md
- docs/governance/dependency-register.md
- docs/governance/unresolved-blocker-register.md
- docs/adr/ADR-index.md
- docs/adr/ADR-0003-codex-browser-validation.md
- docs/adr/ADR-0004-design-motion-and-content-governance.md
- docs/adr/ADR-0005-modular-monolith-first.md
- docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md
- docs/engineering/toolchain.md
- docs/engineering/browser-tooling.md
- docs/engineering/browser-cli-fallback.md
- docs/engineering/repository-collaboration.md
- docs/engineering/github-repository-controls.md
- docs/engineering/dependency-governance.md
- docs/engineering/versioning-and-release.md
- docs/engineering/supply-chain-inventory.md
- docs/engineering/ui-ux-pro-max-installation.md

## Locked requirements repeated

- One person has one longitudinal patient identity.
- Paying for care does not grant clinical-record access.
- Pre-payment pharmacy/laboratory responses may expose only approved providerDisplayName and approved non-identifying commercial information.
- Protected provider details must not reach the client before successful payment.
- Post-payment disclosure is scoped to the selected authorized paid order only.
- Failed, canceled, incomplete, refunded, stale, or cross-order access must not unlock provider details except as governed by approved policy.
- Emergency escalation is independent of payment, registration, authorization, marketplace comparison, provider-detail obscuration, and booking workflows.
- Signed clinical records are amended or versioned, never silently overwritten.
- Sponsors, employers, family-plan administrators, HMOs, and guardians receive only explicitly granted permissions.
- Browser testing uses interactive browser access and deterministic Playwright tests with synthetic data only.

## Current blockers and conditions

- GitHub branch protection/rulesets, required checks, CODEOWNERS enforcement, Dependency Review, and private vulnerability reporting require repository administrator verification.
- UI UX Pro Max external license/commercial review remains pending before broader redistribution or commercial reliance.
- Clinical, legal, privacy, payment, pharmacy, laboratory, HMO, employer, sponsor, guardian, emergency, and pilot domain approvals from Phase 0 remain unresolved unless separately approved.

## Permitted Phase 2 work

- Bounded platform/infrastructure foundation only after the Phase 2 prompt starts.
- Local, test, or staging-origin planning and tooling that preserves synthetic-data restrictions.
- Repository-governed infrastructure documentation, configuration, and validation when explicitly authorized.
- Browser, accessibility, dependency, and release-readiness checks required by the Phase 2 prompt.

## Prohibited Phase 2 work until explicitly approved

- Production deployment, production secrets, production databases, production origins, public releases, npm publication, container publication, clinical workflows, patient portals, pharmacy/lab matching, payment integration, auth/RBAC/ABAC, or use of real patient/provider/clinical/payment/organization data.

## First bounded Phase 2 milestone

The first Phase 2 milestone must be supplied by external orchestration. It should be a narrow platform/infrastructure foundation task with no product feature, production data, or production release behavior.

## Required evidence in Phase 2

- `pnpm repository:verify`
- Relevant deterministic Playwright tests
- Interactive browser evidence when UI or browser tooling is affected
- Accessibility evidence where UI is affected
- Dependency and license evidence for new tools
- Governance register updates
- Confirmation that pilot remains PILOT-NO-GO

## Pilot boundary

Pilot remains PILOT-NO-GO. Phase 2 readiness is not pilot readiness.
