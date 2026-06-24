# Reliability Requirements

## Document Control

| Field | Value |
|---|---|
| Document title | Reliability Requirements |
| Codex prompt ID | P00-14 |
| Complete Breakdown work package | P00-17 |
| Issue ID | P00-NFR-001 |
| Owner role | Architecture Lead + Operations Lead + Clinical Safety Lead |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Required reviewers | Architecture Lead; Operations Lead; Security Lead; Privacy/DPO; Clinical Safety Lead; QA Lead; Finance/Payments Owner |
| Approval authority | Architecture + Operations + Clinical Safety + Security owners |
| Related decisions | REQ-NFR-001 through REQ-NFR-050 |
| Related open questions | OQ-00-492 through OQ-00-591 |
| Change control | Any reliability target, recovery target, timeout, retry, retention, or dependency policy requires owner approval. |

This document defines implementation requirements, not completed controls. No browser tooling has been installed in Phase 0. No security certification is implied. No accessibility conformance claim is implied. No availability or performance commitment is effective until approved. Numeric targets remain approval-controlled.

## Reliability Objectives

Protect clinical continuity, emergency escalation, payment correctness, disclosure privacy, laboratory result safety, pharmacy fulfilment integrity, audit durability, and operational recovery under partial failure.

## Service Classes

| Class | Examples | Reliability posture | Target status |
|---|---|---|---|
| Safety critical | Emergency escalation, critical-result handling, break-glass review | Degrade safely; no payment or marketplace dependency | TARGET-REQUIRES-APPROVAL |
| Clinical record critical | Clinical notes, prescriptions, results, referrals, safety-netting | No silent loss; amendment/version integrity | TARGET-REQUIRES-APPROVAL |
| Financial integrity | Payment verification, ledger posting, refunds, payouts, reconciliation | Idempotent, auditable, reconciled | TARGET-REQUIRES-APPROVAL |
| Privacy critical | Provider disclosure, auth, tenant/patient isolation, browser artifacts | Deny by default under uncertainty | TARGET-REQUIRES-APPROVAL |
| Operational support | Notifications, queues, partner integrations, support tools | Owner queue and retry policy | TARGET-REQUIRES-APPROVAL |

## Reliability Requirements Matrix

| Requirement ID | Requirement | Rationale | Affected capability | Affected actor | Data classification | Threat or failure addressed | Measurement | Target status | Test layer | Test environment | Evidence artifact | Owner | Approval status | Related decision | Related open question | Implementation phase | Pilot gate effect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REL-NFR-001 | RTO and RPO are defined by service class but numeric values require approval. | Avoid invented commitments | All services | All | All | Disaster recovery ambiguity | Approved target matrix | TARGET-REQUIRES-APPROVAL | DR rehearsal | Staging | DR report | Architecture | REQUIRES_APPROVAL | REQ-NFR-002 | OQ-00-513; OQ-00-514 | P00-15/P01 | RELEASE-GATE |
| REL-NFR-002 | Emergency escalation degrades safely when video, messaging, maps, payments, coverage, matching, notifications, analytics, or nonessential integrations fail. | Locked emergency rule | Emergency | Patient, clinician, support | CLINICAL-DATA | Dependency outage | Rehearsal pass/fail | BLOCKING-REQUIREMENT | Resilience rehearsal | Staging/manual | Emergency drill | Clinical + Ops | APPROVED boundary | REQ-NFR-017 | OQ-00-526 | P01 | PILOT-GATE |
| REL-NFR-003 | Clinical drafts are not silently lost during connection loss, refresh, failed upload, device switch, or server failure. | Clinical safety | Intake/notes/prescriptions/orders/referrals | Patient, clinician | CLINICAL-DATA | Lost draft | Recovery evidence | BLOCKING-REQUIREMENT | E2E + integration | Local/staging | Draft recovery report | Clinical + Engineering | APPROVED boundary | REQ-NFR-015 | OQ-00-518 | P01 | PILOT-GATE |
| REL-NFR-004 | Uploads support resumable or safe restart behavior, checksum/integrity, duplicate detection, malware scan state, quarantine, finalization, cleanup, and audit. | Avoid corrupted clinical files | Uploads | Patient, clinician, provider | CLINICAL-DATA | Partial upload | Upload state tests | MEASUREMENT-DEFINED | Integration/E2E | Local/staging | Upload report | Engineering + Security | REQUIRES_APPROVAL | REQ-NFR-010 | OQ-00-519 | P01 | PILOT-GATE |
| REL-NFR-005 | Payment, webhook, ledger, refund, payout, notification, and disclosure transitions are idempotent and handle duplicate/out-of-order callbacks. | Prevent duplicate effects | Finance/workflows | Patient, finance, provider | PAYMENT-DATA | Duplicate callback | Idempotency test | AUTOMATED-VERIFICATION-REQUIRED | Integration | Local/staging | Callback report | Finance + Engineering | APPROVED boundary | REQ-NFR-012 | OQ-00-515; OQ-00-516 | P01 | PILOT-GATE |
| REL-NFR-006 | Retry/backoff policy distinguishes retryable/nonretryable failures, jitter, dead-letter/quarantine, owner, communication, and no duplicate order/payment/result/notification. | Safe recovery | External deps | All | OPERATIONAL-DATA | Retry storm/duplicate | Queue/retry evidence | TARGET-REQUIRES-APPROVAL | Resilience | Integration/staging | Retry report | Operations + Engineering | REQUIRES_APPROVAL | REQ-NFR-016 | OQ-00-515; OQ-00-517 | P00-15/P01 | RELEASE-GATE |
| REL-NFR-007 | Transactional integrity uses outbox or equivalent for state plus audit intent around payment/ledger, stock reservation, prescription finalization, result verification, consent change, provider disclosure, provider suspension, payout, and refund. | Audit and consistency | Workflows | All | AUDIT-DATA | Partial write | Atomicity tests | AUTOMATED-VERIFICATION-REQUIRED | Integration | Local/staging | Outbox evidence | Architecture | PROPOSED | REQ-NFR-014 | OQ-00-516 | P01 | PILOT-GATE |
| REL-NFR-008 | Backups are encrypted and restoration is rehearsed with data integrity, legal hold, deletion/restriction reapplication, key recovery, and audit. | Recoverability | Data stores | Operations | All | Backup failure | Restore test pass/fail | TARGET-REQUIRES-APPROVAL | Restore rehearsal | Staging/DR | Restore report | Architecture + Ops | REQUIRES_APPROVAL | REQ-NFR-014 | OQ-00-520; OQ-00-521 | P00-15/P01 | RELEASE-GATE |
| REL-NFR-009 | Deployments require health/readiness checks, migration safety, compatibility, controlled rollout, rollback, queue/event/contract compatibility, emergency feature disablement, and no partial deployment that weakens privacy controls. | Safe release | Deployment | All | CODE; CONFIG | Bad deployment | Release evidence | RELEASE-GATE | Release rehearsal | CI/staging | Deployment report | Engineering | REQUIRES_APPROVAL | REQ-NFR-016 | OQ-00-525 | P01 | RELEASE-GATE |
| REL-NFR-010 | Observability tracks metrics, structured logs, traces, alerts, correlation IDs, workflow/order/encounter IDs, dependency health, queue depth/age, error rate, reconciliation exceptions, critical-result backlog, emergency failures, and disclosure leak/denial signals with data minimization. | Detect incidents | Observability | Ops/security | AUDIT-DATA | Undetected failure | Dashboards/alerts | CONTINUOUS-MONITORING | Observability tests | Staging | Alert evidence | Ops + Security | REQUIRES_APPROVAL | REQ-NFR-011 | OQ-00-511 | P00-15/P01 | PILOT-GATE |
| REL-NFR-011 | Degraded dependency behavior is explicit for video, messaging, maps, payments, delivery, laboratory integration, notification, object storage, queue, credential registry, and database outage. | Safe fallback | External deps | All | All | Dependency outage | Rehearsal matrix | MANUAL-VERIFICATION-REQUIRED | Rehearsal | Staging/manual | Dependency drill | Operations | REQUIRES_APPROVAL | REQ-NFR-016 | OQ-00-523; OQ-00-526 | P00-15/P01 | PILOT-GATE |
| REL-NFR-012 | Provider-detail disclosure denies or review-gates under payment, reconciliation, cache, server, or authorization uncertainty. | Privacy safety | Marketplace | Patient | PROVIDER-IDENTITY-LOCATION-DATA | Unsafe optimistic reveal | Negative tests | BLOCKING-REQUIREMENT | API/E2E/browser | Local/staging | Privacy report | Security + Privacy | APPROVED boundary | REQ-NFR-045 | OQ-00-548 | P01 | PILOT-GATE |
| REL-NFR-013 | Critical-result and emergency queues have owner, escalation, backlog, and manual fallback rules without numeric targets until approved. | Clinical safety | Clinical ops | Patient, clinician | CLINICAL-DATA | Backlog | Queue age/backlog evidence | TARGET-REQUIRES-APPROVAL | Ops rehearsal | Staging/manual | Queue drill | Clinical + Ops | REQUIRES_APPROVAL | REQ-NFR-017 | OQ-00-526 | P00-15/P01 | PILOT-GATE |
| REL-NFR-014 | Routine recovery must use commands and workflows, not direct database editing. | Integrity | Ops recovery | Operators | All | Silent mutation | Audit check | BLOCKING-REQUIREMENT | Manual ops rehearsal | Staging/manual | Ops audit | Operations + Security | APPROVED boundary | REQ-NFR-004 | OQ-00-509 | P01 | PILOT-GATE |
| REL-NFR-015 | Low-bandwidth and interrupted-network states must show clear, accessible, non-misleading status and safe retry/cancel choices. | User safety | Web UX | Patient, clinician | All | Confusing partial failure | Browser test | AUTOMATED-VERIFICATION-REQUIRED | Playwright + manual | Local/staging | Browser evidence | QA + Accessibility | REQUIRES_APPROVAL | REQ-NFR-023 | OQ-00-541 | P01 | PILOT-GATE |

## Dependency Degradation

Video unavailable: offer audio fallback or reschedule/manual path; do not mark encounter completed automatically. Messaging unavailable: preserve notification intent and route critical failures. Maps unavailable: do not expose alternative provider locations; after authorized disclosure provide accessible text alternatives. Payment unavailable: do not show false success or create OrderFundingSecured; emergency continues. Delivery unavailable: preserve medicine-order state. Laboratory integration unavailable: preserve diagnostic order and critical-result fallback.

## Reliability Rehearsals

Future rehearsals cover database, payment, video, map, SMS, email, delivery, laboratory, queue backlog, object storage, failed deployment, backup restore, credential registry, critical-result downtime, and emergency partial-system failure. No cadence or numeric target is approved in P00-14.

