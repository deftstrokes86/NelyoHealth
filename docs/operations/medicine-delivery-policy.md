# Medicine Delivery Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Medicine Delivery Policy |
| Codex prompt ID | P00-10 |
| Complete Breakdown work package | P00-13 |
| Issue ID | P00-FUL-001 |
| Owner role | Operations Lead + Pharmacy Operations Lead |
| Status | DRAFT-PENDING-APPROVAL |
| Clinical status | DRAFT-PENDING-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Operations Lead, Pharmacy Operations Lead, Clinical Lead/Medical Director, Privacy Counsel, Security Lead, Legal Counsel, Regulatory Reviewer |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Related decisions | REQ-FUL-020 through REQ-FUL-024, REQ-LOCK-002, REQ-LOCK-010 |
| Related open questions | OQ-00-230 through OQ-00-242 |
| Related journeys | JRN-004, JRN-020 |
| Related workflows | WFL-010 Pharmacy order, WFL-011 Delivery, WFL-019 Refund |

Delivery rules are not effective until approved by operations, pharmacy, privacy, security, and legal reviewers. Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13. This policy does not replace qualified professional judgment, pharmacist duties, or emergency escalation rules.

## Scope

This draft covers pharmacy-to-patient medicine delivery, approved collection alternatives, delivery-partner role, rideshare or logistics deep-linking after authorization, handover, chain of custody, proof, failed delivery, return, incidents, and disputes.

It does not select a delivery, logistics, rideshare, map, or payment provider. It does not approve cold-chain delivery, temperature ranges, packaging specifications, attempt counts, or delivery tracking retention periods.

## Delivery Actor Roles

Patient or authorized recipient, pharmacy staff, delivery participant, delivery organization, platform operations, pharmacy operations, support, compliance, and clinical escalation owner each act only inside their approved scope.

## Policy Rules

| Rule ID | Rule | Source requirement | Owning document | Owning role | Approval status | Related journey | Related workflow | Related exception | Future test | Related open question or configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| DLV-POL-001 | Delivery creation requires exact PharmacyOrder, selected pharmacy, delivery eligibility, dispensing or readiness state, authorized delivery address, authorized recipient, minimum handling requirements, approved delivery method, provider details already authorized for the order, and no unresolved cancellation or suspension. | P00-10 delivery preconditions | Medicine Delivery Policy | Operations Lead + Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-010; WFL-011 | EXC-038 | TST-DLV-004 | OQ-00-230 |
| DLV-POL-002 | Courier or delivery participant receives only delivery task identifier, pickup location after authorization, destination, recipient first name or approved display identifier, contact mechanism, verification method, handling category, handover instructions, and delivery window where approved. | P00-10 minimum courier data | Medicine Delivery Policy | Privacy Counsel + Security Lead | APPROVED | JRN-004 | WFL-011 | EXC-052 | TST-DLV-001 | OQ-00-240 |
| DLV-POL-003 | Delivery participants must not receive diagnosis, consultation note, full prescription, laboratory result, sponsor details, HMO details, employer details, family-plan details, unrelated patient history, or unrelated provider records. | P00-10 delivery minimization | Medicine Delivery Policy | Privacy Counsel + Security Lead | APPROVED | JRN-004 | WFL-011 | EXC-052 | TST-DLV-001; TST-DLV-012 | OQ-00-240 |
| DLV-POL-004 | Pharmacy handover requires courier identity or assignment verification, order verification, package count, tamper-status evidence, handling evidence where approved, pickup timestamp, handover actor, proof, and audit. | P00-10 pharmacy handover | Medicine Delivery Policy | Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-002; TST-DLV-004 | OQ-00-236 |
| DLV-POL-005 | Packaging requirements are conceptual only: tamper evidence, privacy-preserving labels, damage protection, handling instructions, no unnecessary medicine information on external packaging, special handling only under approved process, and incident reporting. No packaging specification is approved in P00-10. | P00-10 packaging | Medicine Delivery Policy | Pharmacy Operations Lead + Legal Counsel | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-003 | OQ-00-237 |
| DLV-POL-006 | Cold-chain delivery is not ordinary pilot fulfilment unless separately approved; unsupported cold-chain orders are blocked or routed to manual review, and suspected excursions require containment and pharmacy review. No temperature range, sensor, package, or handover limit is approved. | P00-10 cold chain | Medicine Delivery Policy | Pharmacy Operations Lead + Operations Lead + Regulatory Reviewer | REQUIRES_APPROVAL | JRN-004 | WFL-010; WFL-011 | EXC-039 | TST-DLV-013 | OQ-00-238; OQ-00-239 |
| DLV-POL-007 | Delivery tracking includes status updates, minimum-necessary location tracking, patient/pharmacy/operations visibility, retention policy, no unnecessary continuous tracking after completion, privacy/security review, and no general analytics exposure. | P00-10 tracking | Medicine Delivery Policy | Operations Lead + Privacy Counsel + Security Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-052 | TST-DLV-006 | OQ-00-240 |
| DLV-POL-008 | Proof of delivery may conceptually use OTP, signature, authorized recipient confirmation, pharmacy or courier scan, or another approved method, but no mandatory method is selected in P00-10. Proof is order-specific, time-stamped, actor-attributed, auditable, protected, and idempotent. | P00-10 proof | Medicine Delivery Policy | Operations Lead + Security Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-005 | OQ-00-232 |
| DLV-POL-009 | Rideshare or route deep links may be created only after approved provider-location disclosure, only for the selected order, with minimum route information, no clinical or medication details, no alternative-provider location data, and stale-route invalidation on provider replacement. | P00-10 rideshare/deep-link rule | Medicine Delivery Policy | Security Lead + Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011; WFL-010 | EXC-052 | TST-DLV-010; TST-DLV-011; TST-DLV-012 | OQ-00-231 |
| DLV-POL-010 | NelyoHealth does not guarantee driver availability or transport; rideshare may support patient travel or an approved logistics workflow only after authorization and without selecting a vendor in P00-10. | P00-10 vendor non-selection | Medicine Delivery Policy | Operations Lead + Legal Counsel | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-010 | OQ-00-230; OQ-00-231 |
| DLV-POL-011 | Failed-delivery handling must cover recipient unavailable, wrong address, wrong recipient, failed verification, package damaged, tamper concern, handling concern, courier failure, partner outage, patient refusal, unsafe location, repeated failure, return, and patient-safety impact. No attempt counts are approved. | P00-10 failed delivery | Medicine Delivery Policy | Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-007; TST-DLV-008 | OQ-00-233; OQ-00-234; OQ-00-241 |
| DLV-POL-012 | Return to pharmacy requires return eligibility, chain of custody, package integrity, storage review, disposal where required, refund or replacement handoff, audit, and patient communication; return-to-available-stock remains approval-gated. | P00-10 return | Medicine Delivery Policy | Pharmacy Operations Lead + Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011; WFL-019 | EXC-038 | TST-DLV-009 | OQ-00-235 |
| DLV-POL-013 | Delivery incidents include privacy incident, security incident, clinical incident, medication incident, provider conduct review, logistics dispute, and refund review. | P00-10 delivery incident | Medicine Delivery Policy | Operations Lead + Compliance Lead | REQUIRES_APPROVAL | JRN-020 | WFL-011; WFL-025 | EXC-038; EXC-052 | TST-DLV-007 through TST-DLV-009 | OQ-00-242 |
| DLV-POL-014 | Delivery is not closed solely because a courier callback says delivered; closure requires approved proof, reconciliation, and audit. | P00-10 closure | Medicine Delivery Policy | Operations Lead + Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-011 | EXC-038 | TST-DLV-005 | OQ-00-232 |
| DLV-POL-015 | Emergency safety action is never blocked by delivery availability, delivery failure, courier outage, provider-detail protection, payment state, sponsor approval, or HMO authorization. | REQ-LOCK-010 | Medicine Delivery Policy | Clinical Lead + Operations Lead | APPROVED | JRN-001; JRN-009 | WFL-006; WFL-011; WFL-016 | EXC-001 | TST-DLV-007 | OQ-00-030 |
| DLV-POL-016 | Future delivery tests use synthetic patients, addresses, pharmacies, couriers, route links, proof artifacts, delivery failures, returns, and incidents only. | Locked testing rule | Medicine Delivery Policy | QA Lead + Security Lead | APPROVED | JRN-004 | WFL-011 | EXC-052 | TST-DLV-001 through TST-DLV-013 | P00-14 browser strategy |

## Future Delivery Tests

Synthetic tests must cover courier minimum data, handover proof, tamper evidence, pickup, recipient verification, wrong recipient, failed delivery, redelivery, return, rideshare deep link after authorization, no clinical data in route link, provider replacement invalidating stale route, and cold-chain order blocking when unsupported.

## Common Policy Status Statements

- Status: DRAFT-PENDING-APPROVAL.
- Clinical rules are not effective until approved by the designated clinical authority.
- Pharmacy rules are not effective until approved by pharmacy operations, clinical governance, legal, and regulatory reviewers.
- Laboratory rules are not effective until approved by laboratory operations, clinical governance, legal, and regulatory reviewers.
- Delivery rules are not effective until approved by operations, pharmacy, privacy, security, and legal reviewers.
- Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13.
- This document does not replace qualified professional judgment.
- Effective date: NOT EFFECTIVE UNTIL APPROVED.
- Version and change-control: every approved change requires a version increment, change reason, reviewer record, approval state, and preservation of previous versions.
- Required reviewers are listed in Document Control.
- Related decisions and open questions are listed in Document Control and the rule traceability tables.
