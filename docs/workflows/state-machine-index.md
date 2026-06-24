# NelyoHealth State-Machine Index

## Document Control

| Field | Value |
|---|---|
| Codex prompt ID | P00-07 |
| Complete Breakdown work package | P00-09 |
| Issue ID | P00-WFL-001 |
| Owner role | Architecture lead + product operations |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |

## State-Machine Conventions

| Term | Meaning |
|---|---|
| State | One conceptual lifecycle value for the workflow instance. |
| Command | Explicit action attempting a transition. |
| Transition | Legal state movement after guards pass. |
| Guard | Required condition checked before side effects. |
| Side effect | Controlled state, audit, event, notification, projection, or partner action effect. |
| Event | Minimized domain/integration/operational fact; not a command. |
| Audit event | Append-only accountability evidence or atomic audit intent. |
| Timeout | Approval-gated policy or NO-AUTOMATIC-TIMEOUT; no numeric values in P00-07. |
| Retry | Reattempt behavior with idempotency. |
| Idempotency | Duplicate-safe processing scope and result. |
| Compensation | Explicit corrective workflow action; never history deletion. |
| Reconciliation | Review path for contradictory states. |
| Terminal state | Historical final state; reopening requires explicit command or linked replacement. |
| Reopening | Audited command with reason, authorization, destination, and version increment. |
| Process manager | Conceptual cross-workflow coordination, not an implementation engine. |
| Exception state | Workflow-owned unresolved or error state with operations owner. |

## Index

| Workflow ID | Workflow name | File | Owning bounded context | Canonical entity | Scope | Initial state | Terminal states | Primary owner | Escalation owner | Related journeys | Related workflows | Approval status | Open-question count |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WFL-001 | Identity verification | [identity-verification.md](./identity-verification.md) | Identity and Access | IdentityVerification | PILOT | DRAFT | VERIFIED, REJECTED, EXPIRED, CANCELLED, INVALIDATED | Identity operations | Security lead | JRN-001,JRN-017 | See dependency map | PROPOSED | 3 |
| WFL-002 | Guardian verification | [guardian-verification.md](./guardian-verification.md) | Patients and Relationships | GuardianRelationship | DESIGN-NOW-IMPLEMENT-LATER | DRAFT | VERIFIED, REJECTED, REVOKED, EXPIRED | Privacy operations | Clinical lead + privacy counsel | JRN-003,JRN-018 | See dependency map | PROPOSED | 2 |
| WFL-003 | Practitioner credential review | [practitioner-credential-review.md](./practitioner-credential-review.md) | Credentialing | PractitionerCredential | PILOT | DRAFT | VERIFIED, REJECTED, EXPIRED, REVOKED, WITHDRAWN | Credentialing operations | Clinical lead + security lead | JRN-007,JRN-020 | See dependency map | PROPOSED | 3 |
| WFL-004 | Facility credential review | [facility-credential-review.md](./facility-credential-review.md) | Credentialing | FacilityCredential | PILOT | DRAFT | VERIFIED, REJECTED, EXPIRED, REVOKED, WITHDRAWN | Credentialing operations | Operations lead + security lead | JRN-012,JRN-013,JRN-020 | See dependency map | PROPOSED | 3 |
| WFL-005 | Appointment | [appointment.md](./appointment.md) | Scheduling | Appointment | PILOT | DRAFT | FULFILLED, CANCELLED, NO_SHOW, EXPIRED, RESCHEDULED | Scheduling operations | Operations lead | JRN-001,JRN-010,JRN-011 | See dependency map | PROPOSED | 3 |
| WFL-006 | Encounter | [encounter.md](./encounter.md) | Consultations and Encounters | Encounter | PILOT | PLANNED | COMPLETED, CANCELLED | Clinical operations | Clinical lead | JRN-001,JRN-008,JRN-009,JRN-010,JRN-011 | See dependency map | PROPOSED | 2 |
| WFL-007 | Prescription | [prescription.md](./prescription.md) | Prescriptions | Prescription | PILOT | DRAFT | FULLY_DISPENSED, CANCELLED, EXPIRED, REPLACED | Clinical prescriber | Clinical lead | JRN-008 | See dependency map | PROPOSED | 4 |
| WFL-008 | Pharmacy quote | [pharmacy-quote.md](./pharmacy-quote.md) | Marketplace and Matching | PharmacyQuote | PILOT | REQUESTED | EXPIRED, WITHDRAWN, SUPERSEDED, CANCELLED | Marketplace operations | Security lead + pharmacy operations | JRN-008,JRN-015 | See dependency map | PROPOSED | 4 |
| WFL-009 | Stock reservation | [stock-reservation.md](./stock-reservation.md) | Pharmacy Fulfilment | StockReservation | PILOT | REQUESTED | RELEASED, EXPIRED, FAILED, CANCELLED | Pharmacy operations | Pharmacy operations lead | JRN-008,JRN-012,JRN-015 | See dependency map | PROPOSED | 4 |
| WFL-010 | Pharmacy order | [pharmacy-order.md](./pharmacy-order.md) | Pharmacy Fulfilment | PharmacyOrder | PILOT | CREATED | ACCEPTED, REJECTED, COMPLETED, CANCELLED | Pharmacy operations | Pharmacy operations lead + clinical lead | JRN-008,JRN-012,JRN-015 | See dependency map | PROPOSED | 4 |
| WFL-011 | Delivery | [delivery.md](./delivery.md) | Pharmacy Fulfilment | Delivery | PILOT | REQUESTED | DELIVERED, FAILED, RETURNED, CANCELLED | Delivery operations | Operations lead + pharmacy operations | JRN-008,JRN-012,JRN-015 | See dependency map | PROPOSED | 2 |
| WFL-012 | Diagnostic order | [diagnostic-order.md](./diagnostic-order.md) | Diagnostics | DiagnosticOrder | PILOT | DRAFT | COMPLETED, CANCELLED, EXPIRED, REPLACED | Ordering clinician | Clinical lead | JRN-009,JRN-013 | See dependency map | PROPOSED | 3 |
| WFL-013 | Laboratory appointment | [laboratory-appointment.md](./laboratory-appointment.md) | Laboratory Operations | LaboratoryAppointment | PILOT | REQUESTED | COMPLETED, CANCELLED, NO_SHOW, EXPIRED, RESCHEDULED | Lab operations | Laboratory operations lead | JRN-009,JRN-013,JRN-015 | See dependency map | PROPOSED | 3 |
| WFL-014 | Specimen | [specimen.md](./specimen.md) | Laboratory Operations | Specimen | PILOT | EXPECTED | ACCEPTED, REJECTED, LOST, CANCELLED | Lab operations | Laboratory operations lead + clinical lead | JRN-009,JRN-013 | See dependency map | PROPOSED | 3 |
| WFL-015 | Diagnostic result | [diagnostic-result.md](./diagnostic-result.md) | Diagnostics | DiagnosticResult | PILOT | DRAFT | VERIFIED, RELEASED, CORRECTED, SUPERSEDED, CANCELLED | Laboratory clinical reviewer | Clinical lead + laboratory operations | JRN-009,JRN-013,JRN-016 | See dependency map | PROPOSED | 4 |
| WFL-016 | Referral | [referral.md](./referral.md) | Referrals | Referral | PILOT | DRAFT | ACCEPTED, COMPLETED, DECLINED, CANCELLED, EXPIRED, NO_SHOW | Clinical referral owner | Clinical lead + referral operations | JRN-010,JRN-011 | See dependency map | PROPOSED | 2 |
| WFL-017 | Home-care visit | [home-care-visit.md](./home-care-visit.md) | Home Care | HomeCareVisit | DESIGN-NOW-IMPLEMENT-LATER | REQUESTED | APPROVED, REJECTED, COMPLETED, CLOSED, MISSED, CANCELLED | Home-care operations | Clinical lead + operations lead | JRN-014 | See dependency map | PROPOSED | 1 |
| WFL-018 | Payment intent | [payment-intent.md](./payment-intent.md) | Payments and Ledger | PaymentIntent | PILOT | CREATED | SETTLED, FAILED, CANCELLED, EXPIRED | Finance operations | Finance owner + security lead | JRN-008,JRN-009,JRN-015 | See dependency map | PROPOSED | 4 |
| WFL-019 | Refund | [refund.md](./refund.md) | Payments and Ledger | Refund | PILOT | REQUESTED | APPROVED, REJECTED, COMPLETED, FAILED, CANCELLED | Finance operations | Finance owner + legal counsel | JRN-015 | See dependency map | PROPOSED | 5 |
| WFL-020 | Payout | [payout.md](./payout.md) | Payments and Ledger | Payout | PILOT | CREATED | APPROVED, COMPLETED, FAILED, REVERSED, CANCELLED | Finance operations | Finance owner | JRN-012,JRN-013,JRN-020 | See dependency map | PROPOSED | 1 |
| WFL-021 | Prior authorization | [prior-authorization.md](./prior-authorization.md) | Plans and Coverage | PriorAuthorization | DESIGN-NOW-IMPLEMENT-LATER | DRAFT | APPROVED, DENIED, EXPIRED, CANCELLED, OVERTURNED, UPHELD | Coverage operations | Clinical lead + finance owner | JRN-006 | See dependency map | PROPOSED | 2 |
| WFL-022 | Claim | [claim.md](./claim.md) | Claims | Claim | DESIGN-NOW-IMPLEMENT-LATER | DRAFT | APPROVED, DENIED, REOPENED, REMITTED, CLOSED, CANCELLED | Claims operations | Finance owner + legal counsel | JRN-006,JRN-019 | See dependency map | PROPOSED | 2 |
| WFL-023 | Consent | [consent.md](./consent.md) | Consent and Audit | ConsentGrant | PILOT | DRAFT | GRANTED, DECLINED, WITHDRAWN, EXPIRED, SUPERSEDED, INVALIDATED | Privacy operations | Privacy counsel + security lead | JRN-001,JRN-003,JRN-018 | See dependency map | PROPOSED | 4 |
| WFL-024 | Complaint | [complaint.md](./complaint.md) | Support and Operations | Complaint | PILOT | OPENED | RESOLVED, CLOSED, REOPENED | Support operations | Operations lead | JRN-016 | See dependency map | PROPOSED | 2 |
| WFL-025 | Clinical incident | [clinical-incident.md](./clinical-incident.md) | Support and Operations | ClinicalIncident | PILOT | REPORTED | CONTAINED, CLOSED, REOPENED | Clinical safety owner | Clinical lead | JRN-016,JRN-011,JRN-013 | See dependency map | PROPOSED | 2 |

## Coverage Matrix

| Workflow ID | Journeys | Exceptions | Owning context | Source-of-truth entity | Draft events | Planned implementation phase | Planned test layer |
|---|---|---|---|---|---|---|---|
| WFL-001 | JRN-001,JRN-017 | EXC-001,EXC-002,EXC-003,EXC-004 | Identity and Access | IdentityVerification | EVT-001,EVT-002,EVT-003,EVT-004,EVT-005 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-002 | JRN-003,JRN-018 | EXC-007,EXC-008 | Patients and Relationships | GuardianRelationship | EVT-016,EVT-017,EVT-018 | Deferred implementation after explicit approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-003 | JRN-007,JRN-020 | EXC-009,EXC-010,EXC-011 | Credentialing | PractitionerCredential | EVT-008,EVT-009,EVT-010,EVT-011 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-004 | JRN-012,JRN-013,JRN-020 | EXC-011,EXC-032,EXC-053 | Credentialing | FacilityCredential | EVT-012,EVT-013 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-005 | JRN-001,JRN-010,JRN-011 | EXC-012,EXC-013,EXC-014 | Scheduling | Appointment | EVT-021,EVT-022,EVT-023 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-006 | JRN-001,JRN-008,JRN-009,JRN-010,JRN-011 | EXC-015,EXC-016 | Consultations and Encounters | Encounter | EVT-024,EVT-025,EVT-026,EVT-027,EVT-030 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-007 | JRN-008 | EXC-027,EXC-028,EXC-029 | Prescriptions | Prescription | EVT-031,EVT-032,EVT-033 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-008 | JRN-008,JRN-015 | EXC-027,EXC-028,EXC-047,EXC-048 | Marketplace and Matching | PharmacyQuote | EVT-034,EVT-035,EVT-036,EVT-073 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-009 | JRN-008,JRN-012,JRN-015 | EXC-027,EXC-028 | Pharmacy Fulfilment | StockReservation | EVT-037,EVT-038,EVT-039 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-010 | JRN-008,JRN-012,JRN-015 | EXC-027,EXC-029,EXC-030,EXC-031 | Pharmacy Fulfilment | PharmacyOrder | EVT-040,EVT-041,EVT-042,EVT-043 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-011 | JRN-008,JRN-012,JRN-015 | EXC-030,EXC-031 | Pharmacy Fulfilment | Delivery | EVT-044,EVT-045,EVT-046 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-012 | JRN-009,JRN-013 | EXC-032,EXC-033 | Diagnostics | DiagnosticOrder | EVT-047 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-013 | JRN-009,JRN-013,JRN-015 | EXC-032,EXC-033,EXC-047,EXC-048 | Laboratory Operations | LaboratoryAppointment | EVT-048 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-014 | JRN-009,JRN-013 | EXC-034,EXC-035 | Laboratory Operations | Specimen | EVT-049,EVT-050 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-015 | JRN-009,JRN-013,JRN-016 | EXC-036,EXC-037,EXC-038,EXC-039,EXC-040 | Diagnostics | DiagnosticResult | EVT-051,EVT-052,EVT-053,EVT-054 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-016 | JRN-010,JRN-011 | EXC-041,EXC-042,EXC-044 | Referrals | Referral | EVT-055,EVT-056,EVT-057 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-017 | JRN-014 | EXC-050,EXC-052 | Home Care | HomeCareVisit | EVT-058,EVT-059,EVT-060 | Deferred implementation after explicit approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-018 | JRN-008,JRN-009,JRN-015 | EXC-017,EXC-018,EXC-019,EXC-020 | Payments and Ledger | PaymentIntent | EVT-065,EVT-066,EVT-067,EVT-068,EVT-073 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-019 | JRN-015 | EXC-021,EXC-022 | Payments and Ledger | Refund | EVT-069,EVT-070,EVT-071 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-020 | JRN-012,JRN-013,JRN-020 | EXC-011,EXC-053 | Payments and Ledger | Payout | EVT-072 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-021 | JRN-006 | EXC-026 | Plans and Coverage | PriorAuthorization | EVT-062,EVT-063,EVT-064 | Deferred implementation after explicit approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-022 | JRN-006,JRN-019 | EXC-026 | Claims | Claim | EVT-072 | Deferred implementation after explicit approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-023 | JRN-001,JRN-003,JRN-018 | EXC-008,EXC-046,EXC-051 | Consent and Audit | ConsentGrant | EVT-074,EVT-075,EVT-076,EVT-077 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-024 | JRN-016 | EXC-049,EXC-050,EXC-051,EXC-052 | Support and Operations | Complaint | EVT-078,EVT-079 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |
| WFL-025 | JRN-016,JRN-011,JRN-013 | EXC-039,EXC-040,EXC-050 | Support and Operations | ClinicalIncident | EVT-080,EVT-081,EVT-082 | Phase 1 pilot implementation after Phase 0 approval | Unit/domain transition tests, API/integration tests, Playwright where user-facing, synthetic data only |

## State-Machine Dependency Map

- Identity verification before sensitive account activation.
- Credential verification before new provider work.
- Appointment before encounter.
- Encounter before signed prescription or diagnostic order.
- Prescription before pharmacy fulfilment.
- Pharmacy quote before provider selection.
- Stock reservation before inventory consumption.
- Exact pharmacy order before delivery.
- Diagnostic order before laboratory appointment and specimen.
- Accepted specimen before verified result.
- Verified result before release.
- Critical result before acknowledgment and escalation closure.
- Referral before attendance and outcome.
- Funding evidence before paid fulfilment actions.
- Payment state as input, not owner, of provider-detail disclosure eligibility.
- Refund as financial compensation workflow.
- Consent as authorization input.
- Complaint and incident workflows as oversight, not direct business-state mutation.

## Workflow Status Projection Rules

- Dashboards may aggregate workflow states but do not become sources of truth.
- Search indexes and analytics are derived and may be stale.
- Sensitive actions must query authoritative state.
- Provider-detail disclosure may never rely only on a stale projection.
- Browser status is derived from server-authoritative state, never from URL, cache, hidden DOM, or local flags.

## Implementation Handoff Rules

- Centralize transition logic.
- Reject direct state mutation.
- Test allowed and illegal transitions.
- Enforce optimistic concurrency or equivalent control.
- Persist transition reason and actor.
- Persist audit/outbox intent atomically where required.
- Avoid vendor-specific state names in domain code.
- Keep external provider status mappings inside adapters.
