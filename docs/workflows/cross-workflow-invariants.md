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
