# Cross-Workflow Invariants

## Document Control

| Field | Value |
|---|---|
| Codex prompt ID | P00-07 |
| Complete Breakdown work package | P00-09 |
| Issue ID | P00-WFL-001 |
| Owner role | Architecture lead + security lead + clinical lead |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |

## Invariants

| Invariant ID | Invariant | Required control | Approval status |
|---|---|---|---|
| INV-WFL-001 | PATIENT IDENTITY: No workflow creates duplicate Patient due to account activation, membership, sponsorship, employer/HMO coverage, guardian verification, provider/funding change, or recovery. | Identity and patient guards preserve one longitudinal Patient. | APPROVED |
| INV-WFL-002 | PAYER AND CLINICAL ACCESS: Payment, sponsorship, coverage, claims, refunds, or plan administration do not grant clinical access automatically. | Transition-specific authorization and access-intent checks. | APPROVED |
| INV-WFL-003 | EMERGENCY INDEPENDENCE: Emergency escalation is not blocked by payment, refund, coverage, authorization, appointment, registration, sponsor/employer/HMO approval, or provider-detail protection. | Emergency commands bypass commercial blockers. | APPROVED |
| INV-WFL-004 | STOCK CANNOT BE SOLD TWICE: Atomic reservation prevents two active reservations consuming same final unit; release/consume are idempotent. | StockReservation guards and reconciliation. | PROPOSED |
| INV-WFL-005 | PAYMENT ORDER INVENTORY CONSISTENCY: Payment/order/inventory contradictions enter exception or reconciliation. | Cross-workflow contradiction matrix. | PROPOSED |
| INV-WFL-006 | PROVIDER DETAIL PROTECTION: Before approved successful-payment event only providerDisplayName and approved non-identifying fields may be returned. | Server-side sanitized projection. | APPROVED |
| INV-WFL-007 | NO GENERIC PAYMENT UNLOCK: Generic payment state or client success screen does not grant provider-detail access. | Exact-order disclosure decision. | APPROVED |
| INV-WFL-008 | DENY-BY-DEFAULT PAYMENT CONDITIONS: Created/requires-action/processing/pending/abandoned/failed/cancelled/expired/unverified/wrongly-bound/reconciliation payments do not unlock details. | Disclosure policy denies by default. | APPROVED |
| INV-WFL-009 | REFUND REVERSAL CHARGEBACK: No workflow invents disclosure effect of refund, reversal, or chargeback. | P00-08/P00-13 approval required. | REQUIRES_APPROVAL |
| INV-WFL-010 | SIGNED RECORD INTEGRITY: Finalized notes, prescriptions, results, and referral summaries never return silently to draft. | Amend, replace, correct, supersede. | APPROVED |
| INV-WFL-011 | CRITICAL RESULTS: Verified critical result requires notification, acknowledgement, escalation, failed-contact handling, resolution, and audit. | Diagnostic-result workflow. | REQUIRES_CLINICAL_REVIEW |
| INV-WFL-012 | PROVIDER CREDENTIAL GATING: Unverified/expired/suspended/revoked practitioner/facility cannot receive new work; historical records remain. | Credential guard on assignment. | PROPOSED |
| INV-WFL-013 | CONSENT AND DELEGATION: Withdrawal/expiry/revocation affects future access but does not delete history or grant payer access. | Consent workflow and authorization guard. | PROPOSED |
| INV-WFL-014 | APPOINTMENT ENCOUNTER SEPARATION: Appointment and Encounter lifecycle are distinct; video presence alone is not authoritative. | Separate workflows and projections. | PROPOSED |
| INV-WFL-015 | PRESCRIPTION PHARMACY SEPARATION: Prescription is clinical authorization; PharmacyOrder is fulfilment; replacement/cancellation triggers explicit order review. | Cross-workflow commands. | PROPOSED |
| INV-WFL-016 | DIAGNOSTIC ORDER RESULT SEPARATION: DiagnosticResult requires valid DiagnosticOrder or governed import/correction path. | Diagnostics guards. | PROPOSED |
| INV-WFL-017 | LAB RESULT DOES NOT AUTO-PRESCRIBE: DiagnosticResult never automatically creates medicine purchase. | Clinician Prescription command required. | APPROVED |
| INV-WFL-018 | DELIVERY DATA MINIMIZATION: Delivery receives only minimum pickup/destination/recipient/handover/handling data; no unnecessary diagnosis or consultation content. | Delivery projection. | PROPOSED |
| INV-WFL-019 | NO DIRECT DATABASE REMEDIATION: No workflow exception is resolved by direct production database editing. | Operations use commands only. | APPROVED |
| INV-WFL-020 | AUDIT AND TRANSITION ATOMICITY: Sensitive state change and audit/outbox intent must not diverge silently. | Atomic intent pattern. | PROPOSED |
| INV-WFL-021 | IDEMPOTENT CALLBACKS: Payment, refund, payout, delivery, HMO, lab, and pharmacy callbacks are authenticated later and idempotent. | Callback idempotency policy. | PROPOSED |
| INV-WFL-022 | OUT-OF-ORDER EVENTS: Out-of-order events cannot regress authoritative state. | Version/order guards. | PROPOSED |
| INV-WFL-023 | TERMINAL HISTORY: Terminal workflow remains historically visible and attributable. | Append-only transition history. | PROPOSED |
| INV-WFL-024 | NOTIFICATION MINIMIZATION: Notifications do not expose unnecessary diagnosis, medicine, lab result, clinical note, or protected provider location. | Notification projection policy. | PROPOSED |
| INV-WFL-025 | TENANT AND PATIENT ISOLATION: A command for one patient, tenant, order, or provider cannot transition another. | Transition guards. | APPROVED |

## Contradiction Matrix

| Workflow A | State | Workflow B | Contradictory state | Required response |
|---|---|---|---|---|
| Stock reservation | CONSUMED | Pharmacy order | CANCELLED before dispensing | Reconciliation or compensation |
| Payment intent | CAPTURED or equivalent | Service order | Missing | Finance/operations exception |
| Pharmacy order | COMPLETED | Delivery | Never created where delivery required | Fulfilment exception |
| Diagnostic result | RELEASED | Result verification | Not verified | Security/clinical incident |
| Practitioner credential | SUSPENDED | Appointment | Newly confirmed | Credential exception |
| Consent | WITHDRAWN | Access session | New protected access granted | Security/privacy incident |
| Provider disclosure | ELIGIBLE | Payment | Unverified or wrong order | Security/privacy incident |

## Cross-Workflow Orchestration Candidates

| Orchestration | Trigger | Participating state machines | Correlation identifier | Success condition | Failure condition | Compensation | Operations owner | Audit requirement | Privacy implications |
|---|---|---|---|---|---|---|---|---|---|
| Registration and identity verification | Account activation/recovery | WFL-001, WFL-023 | person/account correlation | Verified identity linked to one Person/Patient | Rejected, expired, duplicate, wrong person | Cancel activation or request more evidence | Identity operations | Identity audit | Sensitive personal data minimized |
| Appointment and funding confirmation | Booking request | WFL-005, WFL-018, WFL-023 | appointment/order correlation | Appointment confirmed or emergency bypass | Payment/funding unresolved | Release slot or route emergency | Scheduling operations | Booking/payment audit | No payer clinical access |
| Appointment to encounter | Check-in/start | WFL-005, WFL-006 | appointment/encounter correlation | Encounter started/completed | No-show/cancel/interruption | Reschedule or close | Clinical operations | Encounter audit | Clinical data protected |
| Encounter to disposition | Clinician disposition | WFL-006, WFL-007, WFL-012, WFL-016 | encounter correlation | Disposition recorded | Incomplete encounter | Follow-up or incident | Clinical operations | Clinical audit | Minimum necessary |
| Prescription to fulfilment | Prescription issued | WFL-007,WFL-008,WFL-009,WFL-010,WFL-011 | prescription/service-order correlation | Delivered/collected or safe closure | No quote/stock/payment/order/delivery failure | Rematch, refund, replacement, release stock | Pharmacy operations | Prescription/fulfilment audit | Provider details protected pre-payment |
| Diagnostic order to reviewed result | Diagnostic order issued | WFL-012,WFL-013,WFL-014,WFL-015 | diagnostic-order correlation | Clinician-reviewed result closure | No lab/specimen/result failure | Recollect, correct, escalate | Lab operations + clinical | Diagnostic audit | No automatic prescription |
| Routine referral to outcome | Referral issued | WFL-016,WFL-005,WFL-006 | referral correlation | Outcome returned/closed | Rejected/no-show/expired | Alternate referral or follow-up | Referral operations | Referral audit | Minimum referral packet |
| Emergency escalation | Red flag or clinician action | WFL-006,WFL-015,WFL-025 | emergency correlation | Safety handoff documented | Failed contact/facility unavailable | Escalate clinical operations | Clinical lead | Emergency audit | Not blocked by commercial state |
| Credential suspension reassignment | Suspension/expiry | WFL-003,WFL-004,WFL-005,WFL-006,WFL-010,WFL-013 | credential/work correlation | New work blocked and active work reviewed | Unsafe active work remains | Reassign/cancel/escalate | Credentialing operations | Credential audit | Historical records preserved |
| Payment to provider disclosure eligibility | Verified payment fact | WFL-018,WFL-008,WFL-013 | service-order/payment correlation | Disclosure decision established only if exact scope passes | Wrong order/actor/patient/tenant/payment exception | Deny and incident if attempted | Security + finance | Disclosure audit | No protected provider leak |
| Refund and reconciliation | Refund request or mismatch | WFL-019,WFL-018,WFL-010,WFL-020 | payment/refund correlation | Financial closure | Refund failure/chargeback unresolved | Reconciliation case | Finance operations | Finance audit | Disclosure effect unresolved |
| Complaint and incident escalation | Complaint/incident raised | WFL-024,WFL-025 | case correlation | Resolved/closed with evidence | Severity unresolved or unsafe | Escalate clinical/privacy/security | Support operations | Case audit | Redacted support view |
| Consent withdrawal and future-access revocation | Withdrawal/revocation | WFL-023 plus sensitive workflows | consent/actor correlation | Future access denied where policy requires | Active sessions/projections conflict | Revoke access, open incident | Privacy operations | Consent audit | Historical records retained |
## Provider-Disclosure Negative Guards

- Before the approved successful-payment event, pharmacy and laboratory discovery responses sent to the patient-facing client expose only `providerDisplayName` and explicitly approved non-identifying commercial information.
- Before the approved successful-payment event, protected provider details must not reach the client through HTML, API responses, browser state, hydration payloads, storage, cache, source output, network requests, map-provider requests, analytics, error reporting, logs, accessibility trees, hidden DOM, image metadata, screenshots, traces, or test fixtures.
- Protected provider details include address, address components, coordinates, approximate or exact distance, branch identity, map position or map pin, directions, contact details, photographs, external links, pickup instructions, collection instructions, internal identifying metadata, and metadata from which provider identity or location could be derived.
- Payment failure, payment cancellation, incomplete authorization, authorization without the approved success event, unverified payment, wrong-order payment, wrong-patient payment, wrong-tenant payment, refund, reversal, chargeback, or reconciliation exception does not unlock provider details.
- Provider-detail disclosure is order-scoped, patient-scoped, tenant-scoped, actor-scoped, and selected-provider-scoped; one paid order must not unlock details for another provider, quotation, patient, tenant, or order.
- The approval-gated `ProviderDetailDisclosureEligibilityEstablished` fact remains a separate server-authorized decision. Generic payment state, client success screens, browser navigation, cached responses, direct URL access, guessed internal identifiers, and support projections must not create disclosure eligibility.
## P00-09 Clinical Safety Invariants

- `INV-CLN-001`: Emergency escalation is independent of payment, funding, sponsor approval, HMO/employer authorization, ordinary registration, marketplace comparison, and pharmacy/laboratory provider-detail obscuration.
- `INV-CLN-002`: NelyoHealth does not autonomously diagnose, prescribe, order tests, interpret results for action, determine that emergency is absent, or decide remote care is sufficient.
- `INV-CLN-003`: Telemedicine suitability is continuous and may redirect to in-person assessment, urgent escalation, emergency escalation, diagnostics, or follow-up.
- `INV-CLN-004`: Finalized clinical notes, prescriptions, diagnostic results, referral summaries, and safety-event documentation use amendments, corrections, replacements, or supersession with provenance.
- `INV-CLN-005`: Critical-result notification, acknowledgment, failed-contact handling, escalation, resolution, audit, and incident review where applicable are separate closure requirements.
- `INV-CLN-006`: Accessibility, low bandwidth, failed upload, reconnect, and inability to communicate safely are clinical safety concerns, not only usability concerns.

## P00-10 Fulfilment Invariants

| Invariant ID | Invariant | Related workflows | Source |
|---|---|---|---|
| INV-FUL-001 | Clinical authorization, commercial quotation, provider selection, stock reservation, payment/coverage evidence, provider acceptance, dispensing, delivery/collection, laboratory processing, result verification, release, clinician review, follow-up, and closure are distinct facts. | WFL-007 through WFL-015; WFL-018; WFL-019 | REQ-FUL-001 through REQ-FUL-040 |
| INV-FUL-002 | A prescription is not pharmacy fulfilment, payment, delivery, stock guarantee, provider disclosure, or pharmacist acceptance. | WFL-007; WFL-008; WFL-009; WFL-010; WFL-011 | FUL-REQ-002 |
| INV-FUL-003 | A laboratory result never automatically creates a prescription, starts pharmacy search, purchases medication, changes treatment, selects a hospital/pharmacy, or closes the diagnostic loop. | WFL-015; WFL-007; WFL-010; WFL-016 | FUL-REQ-004; REQ-FUL-036 |
| INV-FUL-004 | Pharmacy and laboratory pre-payment offers expose only `providerDisplayName` plus approved non-identifying commercial/workflow fields; protected provider details are removed server-side before serialization. | WFL-008; WFL-013 | FUL-REQ-007; REQ-FUL-018 |
| INV-FUL-005 | Stock reservation or approved firm confirmation is required before payment capture, but reservation alone does not unlock provider details. | WFL-009; WFL-018 | FUL-REQ-012; REQ-FUL-014 |
| INV-FUL-006 | Emergency safety action is independent of pharmacy, laboratory, stock, quote, payment, coverage, sponsor/HMO authorization, provider-detail protection, and delivery availability. | WFL-006; WFL-010; WFL-011; WFL-012; WFL-015; WFL-016; WFL-018 | FUL-REQ-020 |
| INV-FUL-007 | Signed prescriptions and verified results preserve history by amendment, replacement, correction, cancellation, supersession, and versioning, never silent overwrite. | WFL-007; WFL-015 | FUL-REQ-005 |
| INV-FUL-008 | Routine recovery uses commands, queues, reviews, amendments, replacements, cancellations, refunds, or reconciliation, never direct production database editing. | All fulfilment workflows | FUL-REQ-021 |
## P00-11 Privacy and Data-Governance Invariants

- Privacy, consent, guardian, delegation, DSR, retention, cross-border, subprocessor, notification, and break-glass rules are draft controls pending privacy, legal, security, clinical, operations, finance, architecture, and regulatory approval.
- A payer, sponsor, employer, HMO, guardian, family-plan administrator, or caregiver receives only explicitly granted permissions and never receives clinical-record access merely because they pay for care.
- Pre-payment pharmacy/laboratory provider discovery remains schema-level restricted: patient-facing clients may receive only approved provider display name and non-identifying commercial information; no address, coordinate, distance, branch, contact, map, direction, instruction, internal identifier, metadata, analytics, log, cache, storage, or trace data may expose protected details before the approved disclosure event.
- Post-payment provider-detail disclosure is tied only to the selected authorized paid order and must not unlock other orders, quotations, providers, patients, or family/sponsor/HMO/employer views.
- Emergency escalation is never blocked by payment, registration, plan authorization, marketplace comparison, provider-detail obscuration, or routine booking workflows.
- Finalized clinical records, prescriptions, verified laboratory results, incident records, ledger records, consent evidence, and audit records are corrected by amendment/versioning rather than silent overwrite.
- Data-subject-rights, retention, deletion, restriction, and legal-hold workflows must preserve auditability and must not delete records required for approved clinical, legal, financial, security, or safety purposes without approved authority.

## P00-13 Finance Invariants

| Invariant ID | Invariant | Related workflows | Source |
|---|---|---|---|
| INV-FIN-001 | Payment does not grant clinical-record access. | WFL-018 through WFL-022; all clinical workflows | REQ-FIN-035; REQ-LOCK-002 |
| INV-FIN-002 | `OrderFundingSecured` is PROPOSED and never directly exposes provider details. | WFL-018; WFL-008; WFL-013 | REQ-FIN-031; REQ-FIN-035 |
| INV-FIN-003 | `ProviderDetailDisclosureDecision` remains separately authoritative and exact-order, selected-provider, actor, patient, and tenant scoped. | WFL-018; WFL-010; WFL-013 | REQ-FIN-036; REQ-FIN-037 |
| INV-FIN-004 | Authorization-only, client success, unverified callback, failed, pending, cancelled, expired, wrong-binding, reconciliation exception, refund, reversal, or chargeback state cannot create initial disclosure eligibility. | WFL-018; WFL-019 | REQ-FIN-033; REQ-FIN-038; REQ-FIN-041 |
| INV-FIN-005 | Stock reservation, lab hold, or approved operational acceptance dependency precedes capture for provider-specific orders where required. | WFL-009; WFL-010; WFL-013; WFL-018 | REQ-FIN-021; REQ-FIN-022 |
| INV-FIN-006 | Refund, reversal, and chargeback recompute future provider-detail retrieval and never create initial eligibility. | WFL-019; WFL-010; WFL-013 | REQ-FIN-038; REQ-FIN-039 |
| INV-FIN-007 | Claim, eligibility, prior authorization, remittance, provider payable, and payout are distinct and must not silently substitute for payment. | WFL-020; WFL-021; WFL-022 | REQ-FIN-027 through REQ-FIN-030 |
| INV-FIN-008 | Every displayed financial balance is ledger-derived; budgets and benefit limits are not cash balances. | WFL-018; WFL-021; WFL-022 | REQ-FIN-008; REQ-FIN-013 |
