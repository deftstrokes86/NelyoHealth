# NelyoHealth MVP Scope (P00-02)

## Document control

- Document: MVP Scope and Pilot Boundary
- Codex prompt ID: P00-02
- Complete Breakdown work package: P00-03
- Issue ID: P00-PRD-002
- Owner role: Product + Clinical + Engineering
- Review state: PROPOSED
- Required reviewers: Product owner, Clinical lead, Privacy counsel, Security lead, Engineering lead
- Last updated: 2026-06-23
- Related locked decisions: REQ-LOCK-001 to REQ-LOCK-013
- Related open questions: OQ-00-20 to OQ-00-33

## Purpose

This document defines exactly what is allowed in the first pilot and what is not. Codex should treat every row as a hard scope gate for implementation planning. The pilot is web-delivery-first, adult-only, location-limited, and medically bounded.

## Pilot product statement

The first pilot is an adult outpatient telehealth and logistics orchestrator delivered through responsive web applications (patient web, doctor web, and operations/admin web) in one controlled Nigerian market area. It provides verified doctors, selected pharmacists, and selected laboratories for paid consultation, prescription fulfilment, diagnostic result workflows, referrals, and close support exception handling. Family-plan payers and diaspora sponsors can fund services for eligible adult patients, but payer status does not grant automatic clinical record access. Pre-payment provider discovery remains constrained to approved non-identifying commercial disclosure.

## Scope label definitions

- `PILOT` - Required for the first pilot execution.
- `POST-PILOT` - Excluded from pilot execution but can be implemented once pilot safety and approvals allow.
- `DESIGN-NOW-IMPLEMENT-LATER` - Must be represented in architecture and policy now, but not implemented in pilot.
- `OUT-OF-SCOPE` - Not planned for immediate product roadmaps covered by this Phase 0 boundary.
- `BLOCKED-PENDING-REVIEW` - Requires explicit external review or unresolved legal/clinical/security decision.

## Complete capability scope matrix

| Capability | Scope label | Pilot behavior | Deferred behavior | Reason | Required approval | Related prompt / work package |
|---|---|---|---|---|---|---|
| Identity and authentication | PILOT | Longitudinal patient, clinician, and operations identity creation, login, session control, tenant-aware context, and least-privilege roles for pilot actor set. | Production-grade passwordless or hardware-backed identity flows, cross-system identity federation, and self-service role switching. | Required first-principles for every pilot workflow. | REQ-SCOPE-001, REQ-LOCK-001 | P00-02 / P00-03 |
| Patient profile | PILOT | Patient core profile, contact preferences, and consent-linked profile controls required to execute care, payment, and disclosure routes. | Full profile portability and external profile synchronization. | Patient profile is required for safe workflow continuity and patient-facing communications. | REQ-SCOPE-001, REQ-SCOPE-013 | P00-02 / P00-03 |
| Adult patient onboarding | PILOT | Register and activate adult patients for all clinical and support flows in the controlled market. | Additional identity bootstrap automation and bulk migration tooling. | Pilot is adult-first and web-delivery-first. | REQ-SCOPE-002, REQ-SCOPE-013 | P00-02 / P00-03 |
| Minor records | DESIGN-NOW-IMPLEMENT-LATER | Data model and schema placeholders for minor-related lifecycle and records separation. | Clinical activation, guardian controls in production, age transitions, and minor UI journeys. | Legal and clinical risk requires explicit review before any minor treatment workflow ships. | REQ-SCOPE-003 | P00-02 / P00-03 |
| Guardians | DESIGN-NOW-IMPLEMENT-LATER | Guardian concept and delegated permissions represented in policy and future access model. | Production guardian invitation, revocation, age transfer, and dispute workflows. | Design must preserve payer-clinical separation before guardian implementation. | REQ-SCOPE-003, REQ-LOCK-002 | P00-02 / P00-03 |
| Adult delegated care | DESIGN-NOW-IMPLEMENT-LATER | Care proxy concept represented in participant model for later expansion with consent and proxy guardrails. | Production delegation with auditability and revocation. | Avoiding silent proxy semantics before clinical safety review. | REQ-SCOPE-003 | P00-02 / P00-03 |
| Family plans | PILOT | Family payer administration for adult dependents and beneficiary invitation, spending controls, receipts, and sponsor views limited to permitted fields. | Full enterprise family governance, cross-family analytics, and bulk invoicing. | Family financing is a core pilot objective while preserving clinical access separation. | REQ-SCOPE-010, REQ-LOCK-002 | P00-02 / P00-05 |
| Diaspora sponsorship | PILOT | Sponsor identity, contribution authorization, and payment workflow for approved adult beneficiaries in the controlled market. | Cross-border clinician/fulfilment operations and sponsor-to-clinician direct record access. | Explicit requirement for pilot sponsor funding path. | REQ-SCOPE-010, REQ-LOCK-002 | P00-02 / P00-05 |
| Employer tenants | DESIGN-NOW-IMPLEMENT-LATER | Tenant model represented in governance, authorization intent, and reporting taxonomy. | Live employer onboarding, payroll-linked activation, claims adjudication, and reporting. | B2B employer arrangements are deferred by design. | REQ-SCOPE-011 | P00-02 / P00-04 |
| HMO tenants | DESIGN-NOW-IMPLEMENT-LATER | HMO/benefits tenant concepts defined in architecture and policy for continuity. | Live HMO enrollment, eligibility adjudication, and remittance flows. | Out-of-scope for pilot to avoid benefit-processing debt. | REQ-SCOPE-011 | P00-02 / P00-04 |
| Enterprise SSO | DESIGN-NOW-IMPLEMENT-LATER | Identity concepts aligned for future provider and enterprise onboarding. | SSO runtime implementation for employer/HMO and enterprise operators. | Explicitly deferred by approval policy and architecture timing. | REQ-SCOPE-011, REQ-SCOPE-018 | P00-02 / P00-04 |
| SCIM | DESIGN-NOW-IMPLEMENT-LATER | Data model references only; no production SCIM service in pilot. | Full SCIM protocol support and automated lifecycle operations. | Requires enterprise readiness and security review. | REQ-SCOPE-011 | P00-02 / P00-04 |
| Eligibility | BLOCKED-PENDING-REVIEW | Policy and decision model documented for later completion. | Authoritative live eligibility checks and expiry automation. | Coverage eligibility is unresolved for pilot launch and cannot ship without approvals. | REQ-SCOPE-011, OQ-00-22 \| P00-02 / P00-04 |
| Benefits | BLOCKED-PENDING-REVIEW | Benefit-type catalog and entitlement taxonomy documented. | Live benefit application, deduction logic, and approval sequencing. | Needs legal and operational validation before activation. | REQ-SCOPE-011, OQ-00-22 \| P00-02 / P00-04 |
| Claims | BLOCKED-PENDING-REVIEW | Claims domain boundaries and event intent captured for future prompt. | Claims submission, adjudication, and payout dispute workflows. | P00-02 is not a commercial adjudication phase. | REQ-SCOPE-011 | P00-02 / P00-13 |
| Prior authorization | BLOCKED-PENDING-REVIEW | Reference model and bypass behavior documented for non-pilot architecture. | Production prior-auth service and exception handling. | Requires legal and payer workflow approvals. | REQ-SCOPE-011, OQ-00-07 | P00-02 / P00-13 |
| Doctor onboarding | PILOT | Manual or semi-manual onboarding of selected doctors with verified credentials and assignment constraints. | Self-service provider onboarding and fully automated onboarding tooling. | Pilot requires a limited verified provider network only. | REQ-SCOPE-018, OQ-00-28 | P00-02 / P00-03 |
| Pharmacy onboarding | PILOT | Controlled onboarding of selected pharmacies with contractual and credential checks. | Open self-service pharmacy onboarding, dynamic inventory onboarding API, and full marketplace parity. | Limited network is required for safety and quality control. | REQ-SCOPE-006, REQ-SCOPE-007, OQ-00-26 | P00-02 / P00-03 |
| Laboratory onboarding | PILOT | Controlled onboarding of selected laboratories and verification of sample and result flow constraints. | Open marketplace onboarding and automated credential attestation. | Laboratory quality and logistics are high-risk; pilot remains bounded. | REQ-SCOPE-008, OQ-00-12 | P00-02 / P00-03 |
| Hospital onboarding | OUT-OF-SCOPE | Referral facilities referenced as known external entities where agreements exist. | Full hospital onboarding and managed workflows. | Not part of first pilot implementation. | REQ-SCOPE-018 | P00-02 / P00-06 |
| Home-care agency onboarding | DESIGN-NOW-IMPLEMENT-LATER | Home-care concept and data model prepared for future extension. | Live home-care agency onboarding, worker verification, and assignment. | Pilot does not include home-care fulfilment. | REQ-SCOPE-012 | P00-02 / P00-06 |
| Credential verification | PILOT | Manual or semi-automated verification workflow for selected clinic, pharmacy, and lab partners. | Full digital verification automation and continuous monitoring. | A bounded pilot needs explicit controls to preserve safety and trust. | REQ-SCOPE-018, REQ-SCOPE-006 | P00-02 / P00-03 |
| Scheduling | PILOT | Patient booking, rescheduling, clinician acceptance, and slot management for routine adult consultation and follow-up. | Complex multi-party scheduling (group/multi-provider) and advanced resource optimization. | Required core interaction in first pilot. | REQ-SCOPE-004, REQ-SCOPE-005 | P00-02 / P00-03 |
| Intake | PILOT | Pre-consultation intake that enforces age, scope, and payer-boundary constraints. | Complex chronic care intake modules and external triage automation. | Keeps pilot workflows safe and reviewable. | REQ-SCOPE-002, REQ-SCOPE-004 | P00-02 / P00-03 |
| Triage | PILOT | Clinical triage with emergency bypass and escalation handling. | Automated AI-led triage and advanced escalation prioritization. | Required for safety and emergency protection. | REQ-LOCK-010 | P00-02 / P00-09 |
| Video consultation | PILOT | Scheduled consultation with encrypted video where supported. | Broadcast-style and multi-party clinical sessions. | Primary consultation channel in pilot. | REQ-SCOPE-004, REQ-SCOPE-005 | P00-02 / P00-03 |
| Audio fallback | PILOT | Audio backup if bandwidth or device limits prevent video. | Voicemail-first or offline tele-consult. | Accessibility and completion support. | REQ-SCOPE-004 | P00-02 / P00-03 |
| Clinical notes | PILOT | Signed clinical notes, amendment/versioning, and continuity notes within encounter boundary. | Public or shareable note export and full note portability. | Must align with locked signed-record amendment rule. | REQ-LOCK-011 | P00-02 / P00-11 |
| Prescriptions | PILOT | Doctor-directed electronic prescriptions for routine outpatient medicines. | Broad prescribing workflows, long-duration regimens, and high-risk medication classes. | Core care loop for pharmacy fulfilment. | REQ-SCOPE-006, REQ-LOCK-011 | P00-02 / P00-10 |
| Pharmacy matching | PILOT | Quote-based matching to selected verified pharmacies using allowed metadata only. | Open marketplace bidding and multi-hop pricing engines. | Required to test discovery-lock-pay-delivery loops. | REQ-LOCK-003, REQ-SCOPE-006 | P00-02 / P00-10 |
| Pharmacy payment | PILOT | Payment state transitions and order binding for pharmacy fulfillment flows. | Alternate payment channels and partial split flows. | Pilot requires strict order-scoped unlock semantics. | REQ-SCOPE-015, REQ-LOCK-007, REQ-LOCK-009 | P00-02 / P00-13 |
| Medicine delivery | PILOT | Controlled delivery/collection routing for selected routine medicines with delivery confirmation. | Multi-courier optimization and same-day delivery across wide geographies. | Delivery is bounded to pilot feasibility and logistics. | REQ-SCOPE-006, OQ-00-22 | P00-02 / P00-10 |
| Laboratory ordering | PILOT | Doctor-ordered routine laboratory tests in approved catalogue scope. | Unbounded test ordering, home sampling workflows, and direct-to-consumer flows. | Directly supports closed-loop pilot diagnostics. | REQ-SCOPE-008, OQ-00-27 | P00-02 / P00-10 |
| Laboratory matching | PILOT | Match routine tests to selected verified laboratories and available turn-around policy. | Dynamic provider routing and advanced lab-to-lab forwarding. | Maintains pilot quality and turnaround control. | REQ-SCOPE-008 | P00-02 / P00-10 |
| Laboratory payment | PILOT | Order-level payment states and settlement linkage for diagnostics. | Deferred partial payment models and installment logic. | Pilot requires strict alignment with payment unlock policy. | REQ-SCOPE-015, REQ-LOCK-007 | P00-02 / P00-13 |
| Result upload | PILOT | Encrypted result upload/review workflow with restricted release path for authorized clinician/authorized payer separation. | Large-scale data pipelines and patient-facing direct lab dashboards. | Directly needed for result-driven follow-up in pilot. | REQ-SCOPE-008, REQ-LOCK-011 | P00-02 / P00-10 |
| Result verification | PILOT | Clinician acknowledgment and critical-result escalation path before closure. | Automated result interpretation and AI triage. | Clinical safety requires manual validation in pilot. | REQ-LOCK-011, REQ-LOCK-010 | P00-02 / P00-09 |
| Critical-result handling | PILOT | Escalation, acknowledgement, and closure requirements for critical findings. | Full critical result workflow with specialist escalation matrix. | Must be explicitly tested before wider rollout. | REQ-LOCK-011, OQ-00-11 | P00-02 / P00-09 |
| Routine referrals | PILOT | Referral creation, instructions, facility selection, and follow-up reminders where provider capacity exists. | Inpatient transfer automation and claim-based referral billing. | Essential continuity function for safe care escalation. | REQ-SCOPE-007, REQ-LOCK-010 | P00-02 / P00-11 |
| Emergency escalation | PILOT | Emergency escalation path bypasses payment/comparison/registration blockers and provides directed next-step safety guidance. | Full ambulance dispatch and integrated emergency transport management. | Non-negotiable safety baseline for pilot. | REQ-LOCK-010 | P00-02 / P00-09 |
| Home care | DESIGN-NOW-IMPLEMENT-LATER | Model and schema prepared for future care workflows. | Live home-care scheduling, delivery, and medication administration. | Home-care is deferred to preserve pilot scope. | REQ-SCOPE-012 | P00-02 / P00-06 |
| Payments | PILOT | Family/sponsor or patient-initiated payments with internal ledger capture and receipt model. | Credit-line top-up products and wallet transfer products. | Payment is required for order completion and unlock semantics. | REQ-SCOPE-015 | P00-02 / P00-13 |
| Ledger | PILOT | Internal double-entry event logging for paid, refund, and reconciliation workflows with audit traceability. | Full enterprise finance integration and advanced settlement workflows. | Required for payment integrity and dispute evidence. | REQ-SCOPE-011, REQ-PAY-001 | P00-02 / P00-13 |
| Wallet presentation | BLOCKED-PENDING-REVIEW | Internal wallet concepts remain documented with no external stored-value claims. | User-facing wallet balances or pre-paid card-style features. | Open question on wallet custody and regulatory treatment. | OQ-00-21, OQ-00-09 | P00-02 / P00-13 |
| Refunds | PILOT | Captured refund initiation, reversal states, and pilot-safe closure criteria. | Multi-party refunds and disputed chargebacks. | Must coordinate with unlock rules and event model. | REQ-PAY-004, REQ-LOCK-009 | P00-02 / P00-13 |
| Reconciliation | PILOT | Internal reconciliation snapshots tied to licensed payment methods and settlement events. | Full enterprise-level finance reporting and GL-grade integration. | Required before expansion and operational trust. | REQ-SCOPE-011, REQ-PAY-001 | P00-02 / P00-13 |
| Provider settlement | PILOT | Settlement records for selected providers and manual payout confirmation. | Automated payouts and contract-invoice automation. | Bounded to selected providers in pilot. | REQ-SCOPE-015, REQ-SCOPE-006 | P00-02 / P00-13 |
| Notifications | PILOT | Notification events for order status, payment state, critical safety signals, and consent-safe instructions. | Rich communications platform and push campaigns. | Must avoid protected data in notifications and logs. | REQ-LOCK-002, REQ-LOCK-005 | P00-02 / P00-15 |
| Admin operations | PILOT | Controlled operations portal for queue handling, exceptions, provider suspension, and support handoff. | Full enterprise operations product with automation and RBAC mesh. | Prevents direct database access dependency. | REQ-SCOPE-013, OQ-00-10 | P00-02 / P00-17 |
| Audit | PILOT | Immutable audit trail for access, disclosures, payment states, and critical events. | Advanced SIEM integration and external audit export service. | Audit visibility is non-negotiable for safety and compliance. | REQ-LOCK-001, REQ-LOCK-007 | P00-02 / P00-15 |
| Consent | PILOT | Pilot consent prompts and policy references for patient funding and communication. | Complex revocation, legacy consent migration, and cross-tenant legal workflows. | Consent boundaries are required for safe pilot operations. | REQ-LOCK-002, REQ-SCOPE-003 | P00-02 / P00-11 |
| Accessibility | PILOT | WCAG 2.2 AA target in web channels, keyboard support, and focus-visible behavior. | Accessibility parity for native applications and specialized modalities. | Regulatory and safety baseline for pilot usability. | REQ-SCOPE-017, OQ-00-19 | P00-02 / P00-14 |
| Browser testing | PILOT | Coverage for happy paths and adverse paths in synthetic-data web journeys for pilot scopes. | Full deterministic matrix with automated regression across browser states. | Browser verification is mandatory for user-facing flows. | REQ-LOCK-012, REQ-SCOPE-018 | P00-02 / P00-14 |
| Native mobile | POST-PILOT | No native implementation in this pilot while web stabilization is in progress. | Stable native apps after web completion and pilot sign-off. | Deferred to protect controlled rollout and test scope. | REQ-SCOPE-014 | P00-02 / P00-15 |
| Localization | POST-PILOT | English-first interface and content with localized-ready structure. | Full language localization and legal-language parity. | Controlled launch avoids legal and operational translation debt. | REQ-SCOPE-017 | P00-02 / P00-14 |
| Analytics | OUT-OF-SCOPE | Event model for privacy-safe system monitoring defined for future iteration. | Full operational and product analytics surfaces in later releases. | Exposed analytics without governance and retention controls is unsafe. | OQ-00-19, OQ-00-13 | P00-02 / P00-15 |
| External partner APIs | DESIGN-NOW-IMPLEMENT-LATER | API contract skeleton for future integrator access with strict auth patterns. | Production API versioning, partner onboarding, and contract governance. | External API scope is beyond pilot reliability goals. | REQ-SCOPE-011, OQ-00-17 | P00-02 / P00-18 |
| Healthcare interoperability | OUT-OF-SCOPE | Terminology and conceptual mapping documented, no production interoperability stack in pilot. | Full interoperability implementation and compliance artifacts. | Premature interoperability could distort pilot focus and increase compliance risk. | OQ-00-32 | P00-02 / P00-08 |
| Fraud review | OUT-OF-SCOPE | Fraud categories and indicators defined for later phase design. | Live fraud scoring, enforcement, and appeals workflow. | Fraud control requires larger operational telemetry footprint. | OQ-00-17 | P00-02 / P00-16 |

## End-to-end pilot journeys

- Adult patient onboarding to completed consultation
- Consultation to prescription to medication delivery
- Consultation to laboratory order to clinician-reviewed result
- Consultation to routine hospital referral
- Emergency escalation
- Family payer funding an adult family member
- Diaspora sponsor funding an adult beneficiary
- Failed payment and refund handling
- Provider or credential suspension and fallback support handling
- Support handling operational exceptions and manual handoffs
- Failed laboratory result turnaround and reroute with follow-up

## Architecture-only capabilities (design now, not pilot implementation)

- Minor activation flow implementation
- Adult delegated care production controls
- Employer and HMO runtime operations
- Home-care coordination and visit management
- Cross-tenant enterprise SSO and SCIM
- Prior authorization engine and claims adjudication
- Broad language localization platform
- Native mobile application architectures
- External partner API production operations

## Explicit pilot exclusions

See [docs/product/non-goals.md](./non-goals.md) for detailed exclusions and controls.

## Approval requirements

### Required for production implementation decision before pilot start

- Geography and launch region boundaries `REQ-SCOPE-001` (Clinical, Product, Legal)
- Adult cohort policy and age boundary `REQ-SCOPE-002` (Clinical, Legal)
- Family and diaspora funding rules `REQ-SCOPE-010` (Clinical, Privacy, Legal)
- Pharmacy/medicine restrictions and exact medication catalogue `REQ-SCOPE-006` / `REQ-SCOPE-007` (Clinical, Pharmacy, Security)
- Laboratory scope and exact test catalogue `REQ-SCOPE-008` / `REQ-SCOPE-009` (Clinical, Operations, Legal)
- Emergency escalation boundary and override behavior `REQ-LOCK-010` (Clinical, Operations)
- Payment methods and payment provider selection `REQ-SCOPE-015` / `REQ-PAY-001` (Finance, Security, Legal)
- Controlled provider network size and selection `REQ-SCOPE-018` (Clinical, Operations)
- Browser support policy and test policy baseline `REQ-SCOPE-013`, OQ-00-19, OQ-00-32 (Engineering, Accessibility, QA)

