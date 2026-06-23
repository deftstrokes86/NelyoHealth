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

## P00-02 pilot-boundary scope decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-SCOPE-001 | Launch geography is one controlled Nigerian service area, with one approved pilot zone and a verified provider subset; the exact geographic scope is pending formal approval. | REQUIRES_APPROVAL | Product owner + Clinical lead + Legal counsel | P00-02 / P00-12 | Geographic launch approval and registry checks are mandatory before implementation. |
| REQ-SCOPE-002 | Adult patients aged 18+ are the default clinical cohort for active pilot service delivery. | PROPOSED | Clinical lead + Product owner | P00-02 | Minor design remains separate and non-production in this issue. |
| REQ-SCOPE-003 | Minor clinical activation is DESIGN-NOW-IMPLEMENT-LATER only and requires explicit consent/proxy workflow ownership before production use. | PROPOSED | Clinical lead + Legal counsel + Privacy counsel | P00-02 / P00-03 | Requires separate guardian verification and proxy expiry model. |
| REQ-SCOPE-004 | Consultation channels in the pilot are scheduled video, audio fallback, secure encounter-linked messaging, and follow-up; asynchronous standalone consultation is not included. | PROPOSED | Product + Clinical | P00-02 | Must preserve encounter continuity and post-consultation closure checks. |
| REQ-SCOPE-005 | Pilot clinical scope starts with primary-care/general-practice consultation only; specialist and mental-health expansion is deferred. | PROPOSED | Clinical lead | P00-02 / P00-03 | Expansion requires approved specialist policy and referral pathway. |
| REQ-SCOPE-006 | Pharmacy scope includes electronically prescribed non-controlled outpatient medicines through verified pharmacy workflow, stock reservation, and closed-loop delivery/collection. | PROPOSED | Product + Operations + Security | P00-02 | Controlled and high-risk medicine categories remain out of pilot scope. |
| REQ-SCOPE-007 | Exact medication catalogue is BLOCKED-PENDING-REVIEW in implementation planning pending clinical and regulatory review. | REQUIRES_APPROVAL | Clinical lead + Pharmacy operations + Legal counsel | P00-02 | No catalogue finalization without signed approval matrix. |
| REQ-SCOPE-008 | Laboratory scope includes verified routine outpatient tests ordered by clinicians, sample collection, result release, and critical-result escalation. | PROPOSED | Clinical lead + Operations | P00-02 | Excludes direct-to-consumer and specialist-only diagnostics. |
| REQ-SCOPE-009 | Exact lab catalogue is BLOCKED-PENDING-REVIEW until clinical, logistics, and legal review completes. | REQUIRES_APPROVAL | Clinical lead + Legal counsel + Operations | P00-02 | Must include unavailable-test handling and critical result closure behavior. |
| REQ-SCOPE-010 | Family and diaspora capabilities in pilot include beneficiary invitation/acceptance, payment authorization, receipts, and spending controls without automatic clinical access. | PROPOSED | Product + Legal + Clinical | P00-02 | Clinical roles remain distinct from financial roles. |
| REQ-SCOPE-011 | Employer and HMO scope in pilot is DESIGN-NOW-IMPLEMENT-LATER as architecture and model definitions only. | PROPOSED | Product + Finance + Legal | P00-02 / P00-04 | No production employer/HMO benefit processing before dedicated prompt coverage. |
| REQ-SCOPE-012 | Home-care features are DESIGN-NOW-IMPLEMENT-LATER and excluded from pilot implementation; only architecture implications may be documented. | PROPOSED | Operations + Clinical lead + Product | P00-02 | Implementation depends on safety model and partner readiness. |
| REQ-SCOPE-013 | Initial supported channels are responsive patient web, doctor/provider web, and operations/admin web; all must support desktop, tablet, and mobile layouts. | PROPOSED | Engineering + QA + Product | P00-02 | Must preserve responsive behavior and accessible interaction in all channels. |
| REQ-SCOPE-014 | Native mobile clients are POST-PILOT. | PROPOSED | Product + Engineering | P00-02 | Native clients remain shells only in early architecture planning. |
| REQ-SCOPE-015 | Final payment methods in the pilot remain BLOCKED-PENDING-REVIEW until explicit payment policy approval. | REQUIRES_APPROVAL | Finance owner + Legal counsel | P00-02 / P00-13 | Method set to be explicitly approved in payment-state prompt. |
| REQ-SCOPE-016 | Native payment-related disclosures and client fields before payment are restricted to approved non-identifying fields only; all protected channels are blocked. | APPROVED | Product + Security + Clinical | P00-02 / P00-08 / P00-14 | Enforced by REQ-LOCK-003 through REQ-LOCK-005. |
| REQ-SCOPE-017 | English-first release language is the pilot standard. | PROPOSED | Product owner + Legal counsel | P00-02 / P00-14 | Additional languages require legal, clinical, and operational approvals. |
| REQ-SCOPE-018 | The pilot provider network is controlled and limited to verified providers, pharmacies, and laboratories within approved launch boundaries. | PROPOSED | Product + Operations + Clinical lead | P00-02 | Expansion requires explicit evidence and operational readiness. |
| REQ-SCOPE-019 | Pilot payment-provider dependency is on a licensed provider; no unapproved stored-value custody. | REQUIRES_APPROVAL | Finance owner + Legal counsel + Security lead | P00-02 / P00-13 | Payment provider selection and contractual terms are pending approval. |
| REQ-SCOPE-020 | Pilot accessibility target is WCAG 2.2 AA with keyboard and focus support for core and failure flows. | PROPOSED | QA lead + Clinical lead + Security lead | P00-02 / P00-14 | Required for browser and accessibility release-readiness checks. |
| REQ-SCOPE-021 | Pilot geography radius and boundary policy is pending formal approval before provider matching in production pilot mode. | REQUIRES_APPROVAL | Clinical lead + Operations lead + Legal counsel | P00-02 | Define service-region geometry, enforcement rules, and out-of-region behavior before launch. |
| REQ-SCOPE-022 | Patient age boundary for pilot participation remains unresolved pending legal and clinical sign-off on transition rules. | REQUIRES_APPROVAL | Clinical lead + Legal counsel + Privacy counsel | P00-02 | Finalize lower and upper age boundaries and transition governance for deferred cohorts. |
| REQ-SCOPE-023 | Clinical inclusion and exclusion criteria for pilot care conditions are pending explicit approval. | REQUIRES_APPROVAL | Clinical lead + Operations lead | P00-02 | Publish approved condition matrix and exclusion handling before implementation starts. |
| REQ-SCOPE-024 | Doctor and clinical-specialty scope is pending final clinical governance approval. | REQUIRES_APPROVAL | Clinical lead + Product owner | P00-02 | Publish included and excluded specialties and referral handoff for each excluded class. |
| REQ-SCOPE-025 | Initial medication catalogue and high-risk medicine policy is blocked until clinical and legal review. | REQUIRES_APPROVAL | Clinical lead + Pharmacy operations + Legal counsel | P00-02; P00-10 | Approve exact allowed and blocked classes before fulfillment goes live. |
| REQ-SCOPE-026 | Initial laboratory test catalogue is pending clinical and lab operations approval. | REQUIRES_APPROVAL | Clinical lead + Laboratory operations + Operations lead | P00-02; P00-10 | Approve the test list and unsupported-test path before pilot testing. |
| REQ-SCOPE-027 | Pilot provider network size and mix by role is pending operations governance approval. | REQUIRES_APPROVAL | Operations lead + Clinical lead + Security lead | P00-02; P00-03 | Confirm minimum and maximum counts and failover strategy before scaling launch. |
| REQ-SCOPE-028 | Pilot service and operations support coverage is pending a final operations model approval. | REQUIRES_APPROVAL | Product owner + Operations lead + Clinical lead | P00-02; P00-17 | Approve staffing, coverage windows, and escalation path before rollout. |
| REQ-SCOPE-029 | Emergency escalation operations are pending full clinical and operational review before launch. | REQUIRES_APPROVAL | Clinical lead + Operations lead | P00-02; P00-09 | Approve operational script, contact path, and incident logging flow before launch. |
| REQ-SCOPE-030 | Browser support policy for pilot is pending explicit browser coverage and evidence obligations. | REQUIRES_APPROVAL | QA lead + Engineering lead + Product owner | P00-02; P00-14 | Confirm supported browser policy, viewport matrix, and required pass criteria. |
| REQ-SCOPE-031 | Pilot success thresholds remain blocked pending quantified acceptance agreement. | REQUIRES_APPROVAL | Product owner + QA lead + Clinical lead | P00-02; P00-15 | Approve numeric success thresholds and measurement method before expansion and next prompt decisions. |

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
