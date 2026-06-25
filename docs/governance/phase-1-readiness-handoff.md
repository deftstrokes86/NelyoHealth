# Phase 1 Readiness Handoff

## Document Control

| Field | Value |
|---|---|
| Status | FINAL-PHASE-0-REVIEW-DRAFT |
| Codex prompt ID | P00-17 |
| Complete Breakdown work package | P00-20 |
| Issue ID | P00-GATE-001 |
| Version | 0.1 final review draft |
| Owner | Phase 0 governance owner |
| Required reviewers | External orchestration, founder/product, clinical, legal/regulatory, privacy, security, finance, operations, accessibility, design, content, engineering, and QA/test owners |
| Approval authority | External orchestration and named domain approvers |
| Effective date | PENDING-EXTERNAL-ORCHESTRATION-ACCEPTANCE |
| Related decisions | REQ-GATE-001 through REQ-GATE-015 |
| Related open questions | Open-question register through current Phase 0 state |
| Review and change-control requirements | Any post-P00-17 change to verdicts, blocker class, approval status, Phase 1 permissions, or pilot readiness requires external orchestration review. |

This document records Codex's evidence-based review. It does not constitute legal, clinical, privacy, security, financial, regulatory, or accessibility approval. External approvals remain valid only when evidence is present. Phase 1 must not be treated as started. Pilot launch must not be treated as approved.


## Purpose

Provide the minimum context a fresh Codex Phase 1 thread must consume without treating Phase 1 as started.

## Required Source Set

| File | Requirement |
|---|---|
| NelyoHealth_Build_Implementation_Map_for_Codex.md | Must be read before related Phase 1 work. |
| NelyoHealth_Phase_0_Complete_Breakdown.md | Must be read before related Phase 1 work. |
| docs/governance/phase-0-completion-report.md | Must be read before related Phase 1 work. |
| docs/governance/phase-0-gate-review.md | Must be read before related Phase 1 work. |
| docs/governance/phase-1-readiness-handoff.md | Must be read before related Phase 1 work. |
| docs/STATUS.md | Must be read before related Phase 1 work. |
| docs/governance/decision-register.md | Must be read before related Phase 1 work. |
| docs/governance/open-questions.md | Must be read before related Phase 1 work. |
| docs/governance/risk-register.md | Must be read before related Phase 1 work. |
| docs/governance/dependency-register.md | Must be read before related Phase 1 work. |
| docs/governance/approval-register.md | Must be read before related Phase 1 work. |
| docs/governance/unresolved-blocker-register.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-index.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0001-provider-detail-release-after-payment.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0003-codex-browser-validation.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0004-design-motion-and-content-governance.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0005-modular-monolith-first.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0006-person-and-longitudinal-patient-identity.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0007-payer-and-clinical-access-separation.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0008-finalized-clinical-record-amendments.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0009-video-platform-decision-deferred.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md | Must be read before related Phase 1 work. |
| docs/adr/ADR-0011-order-funding-secured-and-disclosure-separation.md | Must be read before related Phase 1 work. |
| docs/architecture/domain-boundaries.md | Must be read before related Phase 1 work. |
| docs/architecture/context-map.md | Must be read before related Phase 1 work. |
| docs/architecture/source-of-truth-matrix.md | Must be read before related Phase 1 work. |
| docs/non-functional/security-requirements.md | Must be read before related Phase 1 work. |
| docs/non-functional/reliability-requirements.md | Must be read before related Phase 1 work. |
| docs/non-functional/accessibility-requirements.md | Must be read before related Phase 1 work. |
| docs/testing/browser-validation-strategy.md | Must be read before related Phase 1 work. |
| docs/design/design-system-specification.md | Must be read before related Phase 1 work. |
| docs/design/design-tokens.md | Must be read before related Phase 1 work. |
| docs/design/motion-system.md | Must be read before related Phase 1 work. |
| docs/content/content-model.md | Must be read before related Phase 1 work. |
| docs/content/page-section-content-matrix.md | Must be read before related Phase 1 work. |
| docs/testing/test-strategy.md | Must be read before related Phase 1 work. |

## Locked Requirements for Phase 1

One real person has one longitudinal patient identity; Person, UserAccount, and Patient remain distinct; Payer status does not grant clinical access; Family administration does not grant clinical access; Sponsorship does not grant clinical access; Employer administration does not grant employee clinical access; HMO administration does not grant unrestricted clinical access; Before payment providerDisplayName is the only pharmacy/laboratory identity field exposed to the patient client; Protected provider details are removed before serialization; Post-payment disclosure is exact-order, selected-provider, actor, patient, tenant, and server-authorized; OrderFundingSecured does not itself disclose provider details; ProviderDetailDisclosureDecision remains the access authority; Payment for one order cannot unlock another; Failed, pending, cancelled, expired, unverified, or incorrectly bound payment cannot unlock details; Refund, reversal, and chargeback never create initial eligibility; Emergency escalation is independent of payment and marketplace flow; Finalized clinical records are amended or versioned; Clinical decisions remain clinician-controlled; Laboratory results do not automatically prescribe or purchase medicine; Stock reservation precedes capture; Ledger entries are double-entry and immutable after posting; Interactive Codex browser inspection is required; Deterministic Playwright testing is required; Synthetic browser and lower-environment data only; Motion respects reduced motion; UI UX Pro Max remains advisory and reviewed; Page, section, CTA, and content contracts are required; No routine production database editing; Analytics is downstream and non-authoritative; Production PHI is excluded from general product analytics and session replay.

## Work-Permission Matrix

| Work area | Permitted | Permitted with conditions | Prohibited | Blocking dependency | Required evidence | Approval owner |
|---|---|---|---|---|---|---|
| Repository foundation | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-001 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Monorepo setup | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-002 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| TypeScript and package-manager baseline | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-003 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| CI quality gates | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-004 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Static analysis | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-005 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Synthetic-data tooling | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-006 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Local development environment | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-007 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Development and staging skeletons | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-008 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Secrets-management integration boundary | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-009 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Modular-monolith module skeleton | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-010 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Shared design-token implementation | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-011 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Content-schema implementation | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-012 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Motion installation and governed primitives | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-013 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| UI UX Pro Max reviewed project-local installation | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-014 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Project-scoped Codex browser setup | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-015 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Playwright Test setup | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-016 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Browser smoke page | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-017 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Synthetic authentication fixtures | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-018 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Initial application shells | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-019 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Observability skeleton | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-020 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Feature flags | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-021 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Documentation automation | Yes | No live data; synthetic only; one reviewable change set; update governance where architecture changes | No real data or production operation | DEP-022 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Live clinical operation | No | No, until pilot/capability approvals exist | Yes | DEP-023 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Live pharmacy/lab operation | No | No, until pilot/capability approvals exist | Yes | DEP-024 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Live payment custody | No | No, until pilot/capability approvals exist | Yes | DEP-025 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |
| Pilot launch | No | No, until pilot/capability approvals exist | Yes | DEP-026 | Task diff, tests where applicable, browser evidence where applicable, and governance update | Engineering/architecture owner plus relevant domain owner |

## First Phase 1 Milestone

Repository, CI, browser, design, content, synthetic-data, and architecture foundation. This milestone is not executed by P00-17.

## Initial Phase 1 Task Sequence

| Step | Inputs | Outputs | Dependencies | Browser validation | Tests | Stop condition | Commit checkpoint |
|---:|---|---|---|---|---|---|---|
| 1 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Repository preflight and runtime decisions | DEP-001; BLK-001 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 2 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Monorepo foundation | DEP-002; BLK-002 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 3 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for CI and quality gates | DEP-003; BLK-003 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 4 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Local infrastructure baseline | DEP-004; BLK-004 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 5 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Project-scoped Codex browser setup | DEP-005; BLK-005 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 6 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Playwright Test setup | DEP-006; BLK-006 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 7 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Synthetic smoke application | DEP-007; BLK-007 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 8 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Motion setup | DEP-008; BLK-008 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 9 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for UI UX Pro Max review and project-local installation | DEP-009; BLK-009 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 10 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Design tokens and UI foundation | DEP-010; BLK-010 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 11 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Content registry schema | DEP-011; BLK-011 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 12 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Modular-monolith module skeleton | DEP-012; BLK-012 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 13 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Security and observability baseline | DEP-013; BLK-013 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |
| 14 | Phase 0 handoff, relevant ADRs, blockers, and source docs | Reviewable Phase 1 foundation change set for Phase 1 foundation verification | DEP-014; BLK-014 | Required where browser surface/tooling is affected; synthetic only | Deterministic tests where created; no real data | Stop after task; no automatic next prompt | Commit/checkpoint after review |

## Context-Carry Rules

Phase 1 must re-read locked decisions, relevant ADRs, current blockers, risk/dependency/approval registers, avoid inventing approvals, use one reviewable change set per task, update STATUS and decision/change records when architecture changes, stop at task boundaries, and keep Phase 1 readiness separate from pilot readiness.

## First Phase 1 Prompt Readiness

READY-TO-DRAFT-PHASE-1-PROMPT. Do not draft or execute the Phase 1 implementation prompt in P00-17.
