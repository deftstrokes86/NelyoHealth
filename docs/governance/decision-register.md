# Phase 0 Decision Register

## Decision status legend

- `APPROVED`: explicitly approved and usable for downstream decisions.
- `PROPOSED`: planning default pending owner approval.
- `REQUIRES_LEGAL_REVIEW`: legal interpretation required before approval.
- `REQUIRES_CLINICAL_REVIEW`: clinical review required before approval.
- `REQUIRES_APPROVAL`: explicit approval still required before use in implementation.
- `SUPERSEDED`: replaced by a later decision.

## Locked base decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-LOCK-001 | One person has one longitudinal patient identity across plans, families, sponsors, employers, HMOs, guardians, and organizational relationships. | APPROVED | Source docs + product governance | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-002 | Paying for care does not grant automatic access to clinical records. | APPROVED | Source docs + governance baseline | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md, NelyoHealth_Phase_0_Codex_Prompt_Pack.md |
| REQ-LOCK-003 | Before successful payment, patient-facing client disclosure is limited to `providerDisplayName` and non-identifying commercial fields explicitly approved by source rules (for example `quoteId`, `totalAmount`, `currency`, `quoteExpiry`, `availabilityConfirmation`, `estimatedFulfilmentOrTurnaroundWindow`, `serviceOrOrderSummary`). | APPROVED | Source docs + clinical/product governance | P00-00 / P00-08 | NelyoHealth_Phase_0_Complete_Breakdown.md, NelyoHealth_Phase_0_Codex_Prompt_Pack.md |
| REQ-LOCK-004 | Before successful payment, patient-facing client may not receive, store, infer, render, cache, serialize, log, or expose provider/lab details other than the allow-list in REQ-LOCK-003. Prohibited detail classes include address, address components, coordinates, approximate or precise distance, branch identifier, map position, map pin, directions, contact information, photographs, external links, pickup instructions, collection instructions, internal provider identifiers, branch/patient-identifying metadata, and any data that permits provider or branch inference. | APPROVED | Source docs + privacy/security | P00-00 / P00-08 | NelyoHealth_Phase_0_Codex_Prompt_Pack.md, P00-08 contract scope |
| REQ-LOCK-005 | The prohibition in REQ-LOCK-004 applies to all client-facing and non-client channels, including API responses, HTML, hydration payloads, JavaScript state, browser storage, browser caches, hidden DOM, accessibility trees, map-provider requests, analytics events, error reporting, logs, cache stores, browser traces, screenshots, test fixtures, and serialized source output. | APPROVED | Source docs + engineering + QA | P00-00 / P00-14 | P00-08 disclosure scope, P00-14 browser-test planning |
| REQ-LOCK-006 | Protected pre-payment provider or laboratory data is released only for the exact selected pharmacy or laboratory that is tied to the exact paid order. | APPROVED | Source docs + architecture + security | P00-00 / P00-08 | NelyoHealth_Phase_0_Complete_Breakdown.md, P00-08 contract requirements |
| REQ-LOCK-007 | Provider detail release requires all of the following checks: matching authorized actor, selected order context, selected provider context, matching patient context, matching tenant context, and positive server-side authorization for that order. | APPROVED | Source docs + architecture + security | P00-00 / P00-08 | NelyoHealth_Phase_0_Complete_Breakdown.md, P00-08 contract requirements |
| REQ-LOCK-008 | Payment for one order does not unlock provider details for another order, quotation, pharmacy, laboratory, patient, tenant, or any unselected matching provider. | APPROVED | Source docs + governance | P00-00 / P00-08 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-009 | Provider detail disclosure is denied while payment state is Created, Initiated, Pending, Awaiting action, Abandoned, Failed, Cancelled, Expired, Unverified, bound to wrong order, bound to wrong actor, bound to wrong patient, or bound to wrong tenant. | APPROVED | Source docs + finance + security | P00-00 | P00-00 locked disclosure policy, P00-13 design constraints |
| REQ-LOCK-010 | Emergency escalation cannot be blocked by payment, marketplace comparison, registration, or routine booking logic. | APPROVED | Source docs + clinical + operations | P00-00 / P00-09 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-011 | Signed clinical records are corrected by amendment/versioning only and are never silently overwritten. | APPROVED | Source docs + clinical governance | P00-00 / P00-13 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-012 | Codex interactive IDE browser validation and deterministic automated Playwright tests are both mandatory for user-facing work; both must use synthetic data only. | APPROVED | Source docs + engineering | P00-00 / P00-14 | NelyoHealth_Phase_0_Codex_Prompt_Pack.md |
| REQ-LOCK-013 | Browser testing controls are non-production validation assets; they must not expose production PHI and must be implemented outside clinical record delivery paths. | APPROVED | Source docs + QA + privacy | P00-00 / P00-14 | NelyoHealth_Phase_0_Codex_Prompt_Pack.md |

## P00-13 pending implementation decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-PAY-001 | Final server-verified successful-payment unlock state for provider-detail release (capture, settlement, or other approved final event). | REQUIRES_APPROVAL | Finance + security + engineering | P00-13 | Final decision must be approved by finance owner and security owner with explicit event definition and webhook semantics |
| REQ-PAY-002 | Refund behavior after provider details have been disclosed and how disclosure is revoked or retained in each refund state. | REQUIRES_APPROVAL | Finance + clinical + legal | P00-13 | Approved refund policy required before release to implementation |
| REQ-PAY-003 | Reversal behavior after provider details have been disclosed and state restoration required. | REQUIRES_APPROVAL | Finance + security | P00-13 | Approved reversal policy and audit trail required |
| REQ-PAY-004 | Chargeback behavior after provider details have been disclosed and whether re-locking occurs. | REQUIRES_APPROVAL | Finance + legal | P00-13 | Approved chargeback policy and re-locking boundary required |

## Decisions blocked pending external review

| Decision ID | Decision text | Required approval | Priority | Target phase |
|---|---|---|---|---|
| REQ-LEGAL-001 | Minimum permitted pre-payment disclosures for Nigerian launches by provider type after legal review. | Legal counsel + privacy counsel | High | P00-12 / P00-08 |
| REQ-LEGAL-002 | Scope of telemedicine licensing and emergency obligations for launch geography. | Legal/corporate counsel | High | P00-12 |
| REQ-LEGAL-003 | Whether launch posture requires specific marketplace/healthcare operator registrations. | Legal counsel | High | P00-12 |
| REQ-CLIN-001 | Signed clinical red-flag list and telemedicine exclusion boundaries for pilot. | Clinical lead | High | P00-09 |
| REQ-FIN-001 | Refund ownership and payout/claim timing across mixed/family/diaspora payment. | Finance owner + legal | High | P00-13 |
