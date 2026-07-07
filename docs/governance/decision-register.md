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

## P00-03 conceptual decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-GOV-001 | `Person`, `UserAccount`, `Patient`, and `Practitioner` are distinct concepts; one `Person` may be associated with one or more `UserAccount` records over time for the same underlying person. | APPROVED | Source docs + governance baseline | P00-03 | Uses concept definitions in locked decisions and P00-04 funding prompt outputs. |
| REQ-GOV-002 | A `Person` may exist before account creation and remain accountless while conceptually modeled in accountless-support scenarios. | PROPOSED | Product + Clinical + Security | P00-03 | Requires identity discovery criteria and activation workflow. |
| REQ-GOV-003 | During account activation, existing continuity identities are linked rather than creating a new patient identity; duplicates are not created by default. | REQUIRES_APPROVAL | Product + Security + Clinical | P00-03 | Requires identity proofing, merge authority, and audit policy definition. |
| REQ-GOV-004 | One patient continuity identity is preserved across organizations, coverage arrangements, and role/member context changes. | APPROVED | Source docs + governance baseline | P00-03 | Mirrors REQ-LOCK-001. |
| REQ-GOV-005 | Role and relationship are separate from membership and coverage; one concept does not imply the others by default. | PROPOSED | Product + Clinical + Security | P00-03 | Requires explicit matrix and relationship bindings in downstream prompts. |
| REQ-GOV-006 | A person may hold multiple roles and memberships with explicit boundaries; membership context is visible and explicit. | PROPOSED | Product + Operations | P00-03 | Requires tenant-switch controls and workflow-level context signalling. |
| REQ-GOV-007 | There is exactly one active organization context for a workflow task, and context switches require explicit intent by the actor. | PROPOSED | Security + Architecture | P00-03 | Requires tenant-switch controls and audit capture. |
| REQ-GOV-008 | No privilege carries across context switches without explicit re-authorization in the next context. | PROPOSED | Security + Architecture | P00-03 | Mirrors REQ-LOCK-008 and cross-tenant safeguards. |
| REQ-GOV-009 | Offboarding immediately removes active organization or role access for that context and does not silently re-enable access through other roles. | PROPOSED | Security | P00-03 | Requires session invalidation and role revocation workflow. |
| REQ-GOV-010 | Clinical records, prescriptions, and audit events remain attributable to historical authorized actors after staff offboarding. | PROPOSED | Clinical + Security | P00-03 | Requires append-only audit and continuity safeguards. |
| REQ-GOV-011 | Personal patient access continuity is preserved when coverage, sponsor, or organization relationships change or end. | PROPOSED | Product + Clinical | P00-03 | Requires continuity policy in journeys, workflows, and state handling. |
| REQ-GOV-012 | Organization or admin role alone does not grant unrestricted patient-clinical access. | APPROVED | Source docs + clinical governance | P00-03 | Mirrors REQ-LOCK-004 and locked payer-separation rules. |
| REQ-GOV-013 | Support-access privileges are purpose-bound, capability-limited, and revocable; support does not receive unrestricted clinical data access. | PROPOSED | Product + Security + Clinical | P00-03 | Requires support-role policy and exception model. |
| REQ-GOV-014 | Break-glass access is exceptional, clinically justified, time-bound, reasoned, and audited. | REQUIRES_APPROVAL | Clinical lead + Security owner | P00-03 | Requires clinical and security policy before approved implementation. |
| REQ-GOV-015 | Relationship capabilities are granular by function (paying, scheduling, joining, logistics, updates) and not an all-or-nothing bundle. | PROPOSED | Product + Clinical + Security | P00-03 | Requires downstream matrix and journey updates in later prompts. |
| REQ-GOV-016 | Cross-tenant collaboration for a patient uses minimum necessary access and does not imply tenant-wide data sharing. | PROPOSED | Security + Architecture | P00-03 | Requires explicit cross-tenant interaction contract. |
| REQ-GOV-017 | Facility, branch, and organization scopes are distinct; facility-level membership is not global patient authority. | PROPOSED | Architecture + Security | P00-03 | Requires facility-context policy and practitioner mapping. |
| REQ-GOV-018 | Account linking and merge operations require explicit policy and cannot be automatic on name/email similarity only. | REQUIRES_APPROVAL | Product + Clinical + Security | P00-03 | Requires duplicate-identity governance and audit evidence. |

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
| REQ-SCOPE-016 | Native payment-related disclosures and client fields before payment are restricted to approved non-identifying fields only; all protected channels are blocked. | SUPERSEDED | Product + Security + Clinical | P00-02 / P00-08 / P00-14 | Canonicalized into REQ-LOCK-003 through REQ-LOCK-005 and REQ-GOV decisions. |
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

## P00-04 funding and coverage decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-COV-001 | Self-pay is the default funding model where the patient or patient-authorized delegate selects and confirms payment for their own care transaction. | PROPOSED | Product owner + Finance owner + Clinical lead | P00-04 | Requires explicit source selection flow and order-level authorization event. |
| REQ-COV-002 | A family umbrella is a funding-and-administration construct, not a separate clinical record owner or a substitute for patient identity. | REQUIRES_APPROVAL | Product owner + Privacy counsel + Clinical lead | P00-04 | Clarified at implementation boundary for account linking and legal continuity. |
| REQ-COV-003 | Adult family-plan members retain independent person/patient continuity and explicit membership acceptance/revocation controls. | PROPOSED | Product owner + Clinical lead + Privacy counsel | P00-04 | Must be compatible with account linking and consent lifecycle decisions. |
| REQ-COV-004 | Family-plan administrators can configure funding and approvals only within the plan scope and are not automatically entitled to clinical records. | REQUIRES_APPROVAL | Product owner + Clinical lead + Privacy counsel | P00-04 | Explicit matrix for allowed clinical fields required by privacy and consent decisions. |
| REQ-COV-005 | Family payer authority is funding-first and includes explicit per-transaction, per-member, and aggregate spending controls. | REQUIRES_APPROVAL | Finance owner + Product owner + Security lead | P00-04 | Source selection, limits, and approval modes must be recorded for audit and dispute resolution. |
| REQ-COV-006 | Diaspora sponsorship requires explicit beneficiary association and invitation/acceptance controls before funding is active. | REQUIRES_APPROVAL | Product owner + Finance owner + Legal counsel | P00-04 | Cross-border sponsorship and verification policies must be defined in dedicated legal/funding decisions. |
| REQ-COV-007 | Diaspora sponsor approval modes (no-limit, per-transaction, service-category, monthly/annual budget) are policy-selected per sponsor and transaction class. | REQUIRES_APPROVAL | Product owner + Finance owner + Legal counsel | P00-04 | Each active mode must be auditable and explicitly communicated in sponsor tooling. |
| REQ-COV-008 | Sponsor revocation stops future funding and requires explicit continuation/reopen policy for active pending orders. | REQUIRES_APPROVAL | Product owner + Clinical lead + Security lead | P00-04 | Active order handling must avoid silent continuation and must be visible in audit history. |
| REQ-COV-009 | Employer coverage is a time-bound benefit relationship that supports eligible care only during active employment and valid coverage periods. | REQUIRES_APPROVAL | Finance owner + Product owner + Legal counsel | P00-04 | Coverage window and eligibility mapping must align with compliance and employment records. |
| REQ-COV-010 | HMO coverage is time-bound and claim-governed and does not create insurer-like ownership of the patient record. | REQUIRES_APPROVAL | Finance owner + Clinical lead + Legal counsel | P00-04 | HMO behavior remains in deferred runtime mode until explicit HMO integration policy is approved. |
| REQ-COV-011 | Coverage and funding relationships must carry explicit effective and expiry periods and cannot be retroactively activated without a recorded exception. | REQUIRES_APPROVAL | Product owner + Clinical lead + Security lead | P00-04 | Exception handling must be defined for active orders at boundary transitions. |
| REQ-COV-012 | Patient or authorized actor must explicitly select a funding source unless a documented emergency or equivalent policy exception applies. | REQUIRES_APPROVAL | Product owner + Clinical lead + Security lead | P00-04 | Emergency exception decision must be reviewed against clinical safety and policy controls. |
| REQ-COV-013 | The platform must not silently switch funding sources or fallback when a selected source is declined, exhausted, or rejected. | PROPOSED | Product owner + Finance owner | P00-04 | Required re-selection or explicit authorization for alternate source use. |
| REQ-COV-014 | Overlapping funding sources are resolved by documented priority and actor-driven selection policy. | REQUIRES_APPROVAL | Product owner + Finance owner + Security lead | P00-04 | Priority rules must be testable and conflict-free before implementation. |
| REQ-COV-015 | Split-payment allocations require per-source authorization and must capture split proportions before capture/payment actions. | REQUIRES_APPROVAL | Finance owner + Security lead | P00-04 | Allocation events must map to allocation IDs and order context. |
| REQ-COV-016 | Copay and patient shortfall are computed and exposed only in payment/finance context, and never replace missing clinical authorization. | REQUIRES_APPROVAL | Finance owner + Clinical lead + Privacy counsel | P00-04 | Distinct from treatment-eligibility and clinical visibility decisions. |
| REQ-COV-017 | Refunds return to original funding source(s), except where a written legal or contractual exception is approved. | REQUIRES_APPROVAL | Finance owner + Legal counsel | P00-13 | Must align with chargeback/reversal governance in `P00-13`. |
| REQ-COV-018 | Coverage termination/offboarding preserves patient continuity and does not delete person or clinical records. | APPROVED | Source docs + product governance | P00-04 | Supersedes any implementation shortcut that would reassign ownership. |
| REQ-COV-019 | Expired coverage during active care preserves completed historical continuity and triggers explicit follow-up closure policies for incomplete workflows. | REQUIRES_APPROVAL | Clinical lead + Operations lead + Finance owner | P00-04 | Requires explicit exception states for in-flight care workflows. |
| REQ-COV-020 | Payer visibility is purpose-specific and separated from clinical access by design. | APPROVED | Source docs + privacy/security | P00-00 / P00-04 | Reuse approved payer/actor visibility boundaries from locked policy matrix. |
| REQ-COV-021 | Employer reporting is aggregate, minimized, and cannot expose individual clinical records without explicit legal basis. | REQUIRES_APPROVAL | Product owner + Privacy counsel | P00-04 | Reporting model must be approved before support dashboards are operationalized. |
| REQ-COV-022 | HMO claim and coverage visibility is constrained to eligibility, authorization, claim, appeal, and remittance details. | REQUIRES_APPROVAL | Clinical lead + Privacy counsel + Finance owner | P00-04 | Requires minimum-necessary information design in privacy and clinical models. |
| REQ-COV-023 | Family and diaspora pilot coverage is limited to explicitly scoped adult-beneficiary flows unless a later prompt expands it with approvals. | REQUIRES_APPROVAL | Product owner + Clinical lead + Privacy counsel | P00-02 / P00-04 | Requires explicit pilot-scope acceptance before implementation of additional cohorts. |
| REQ-COV-024 | Employer and HMO runtime execution is deferred and documented as design-only in this prompt sequence. | PROPOSED | Product owner + Engineering lead | P00-02 / P00-04 | Explicitly re-evaluate before implementation-stage scheduling. |
| REQ-COV-025 | Emergency financing and registration steps must never block emergency escalation workflow activation. | APPROVED | Source docs + Clinical lead + Operations lead | P00-09 | Reinforces lock `REQ-LOCK-010` and emergency routing invariants. |
| REQ-COV-026 | Provider-detail disclosure behavior is actor- and order-anchored and is not affected by payer type. | APPROVED | Source docs + Security lead + Product owner | P00-04 / P00-08 | Same checks as `REQ-LOCK-006` and `REQ-LOCK-007` apply. |
| REQ-COV-027 | No funding pathway may create a duplicate patient identity for the same person. | APPROVED | Source docs + Product owner + Clinical lead | P00-04 | Consistent with `REQ-LOCK-001`; duplicate prevention is mandatory across payer transitions. |
| REQ-COV-028 | Funding-context transitions and refunds preserve order-level continuity and do not transfer authorization across unrelated orders. | REQUIRES_APPROVAL | Finance owner + Security lead + Product owner | P00-13 | Requires explicit idempotent allocation/reversal mapping for shared order state. |

## P00-05 journey and blueprint decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-JRN-001 | Every documented journey must identify completion, cancellation, expiry, and reopening conditions or explicitly point to the later workflow prompt that will define them. | PROPOSED | Product owner + Operations lead | P00-05 / P00-07 | P00-07 must convert conceptual closures into formal state transitions. |
| REQ-JRN-002 | Every material exception must have a functional owner and an audit trail expectation before implementation planning. | PROPOSED | Operations lead + Security lead | P00-05 / P00-15 | P00-15 must assign service targets and operational queue ownership. |
| REQ-JRN-003 | P00-05 journey steps are conceptual journey language, not final workflow state names, database enums, timeout values, retry rules, or event contracts. | PROPOSED | Architecture lead + Engineering lead | P00-07 | Workflow naming, guards, retries, and event contracts remain deferred to P00-07. |
| REQ-JRN-004 | Routine operational resolution may not require direct production database editing; missing operational tooling must become a product/operations remediation item. | APPROVED | Source docs + Operations lead | P00-05 / P00-15 | Direct database editing remains prohibited except for separately governed break-glass or remediation procedures not defined in P00-05. |
| REQ-JRN-005 | Frontend hiding, conditional rendering, CSS masking, or hidden DOM removal is not a substitute for server-side pre-payment provider-detail filtering. | APPROVED | Source docs + Security lead + QA lead | P00-08 / P00-14 | Reinforces REQ-LOCK-003 through REQ-LOCK-005. |
| REQ-JRN-006 | Pre-payment provider matching and post-payment provider-detail retrieval are separate conceptual operations with separate authorization and disclosure checks. | APPROVED | Source docs + Architecture lead + Security lead | P00-08 / P00-13 | Reinforces REQ-LOCK-006 through REQ-LOCK-009. |
| REQ-JRN-007 | Deferred journeys are designed and test-catalogued in P00-05 but are not active pilot runtime functionality. | PROPOSED | Product owner + Clinical lead | P00-02 / P00-05 | Runtime activation requires later implementation scope approval. |
| REQ-JRN-008 | Notifications in all journeys must use minimum-necessary content and must not include protected clinical or provider-location data unless explicitly authorized. | PROPOSED | Privacy counsel + Security lead | P00-11 / P00-14 | Final notification policy remains deferred to privacy and non-functional prompts. |
| REQ-JRN-009 | Journey-level browser and privacy tests must use synthetic data only. | APPROVED | Source docs + QA lead + Security lead | P00-14 | Reinforces REQ-LOCK-012 and REQ-LOCK-013. |
| REQ-JRN-010 | User-facing journey validation requires both interactive IDE browser inspection and deterministic Playwright E2E coverage when the implemented surface exists. | APPROVED | Source docs + Engineering lead + QA lead | P00-14 | Tooling remains deferred; this is a coverage requirement only. |
| REQ-JRN-011 | Emergency safety actions precede payment, sponsor, HMO, registration, marketplace, and provider-detail-disclosure resolution in all affected journeys. | APPROVED | Source docs + Clinical lead + Operations lead | P00-09 | Reinforces REQ-LOCK-010 and REQ-COV-025. |
| REQ-JRN-012 | P00-05 `JRN-*`, `BP-JRN-*`, `EXC-*`, and `T-JRN-*` identifiers are traceability handles only and must not be treated as implementation IDs or database keys. | PROPOSED | Architecture lead + QA lead | P00-06 / P00-17 | P00-06 and P00-17 must preserve traceability without creating implementation coupling. |

## P00-06 domain terminology and data decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-DOM-001 | Person, UserAccount, and Patient are distinct canonical terms; one cared-for Person has one longitudinal Patient identity and account activation/recovery must not silently create duplicates. | APPROVED | Source docs + product governance | P00-06 | Directly restates REQ-LOCK-001 and P00-06 locked rules. |
| REQ-DOM-002 | `Member` is not a standalone canonical implementation term; every use must be qualified as OrganizationMember, FacilityMember, FamilyPlanMember, CoverageMember, HMOMember, or PlanMember. | APPROVED | Source docs + architecture | P00-06 | Business UI may use member only when surrounding context qualifies it. |
| REQ-DOM-003 | Appointment, Encounter, and Consultation are distinct: appointment schedules time, encounter owns care lifecycle, and consultation is the clinical interaction modality or segment. | PROPOSED | Product + clinical + architecture | P00-07 | P00-07 must define final workflow states without collapsing these terms. |
| REQ-DOM-004 | ClinicalRecord and ClinicalNote are distinct; finalized clinical notes are items within the longitudinal clinical record and must be amended/versioned, not silently overwritten. | APPROVED | Source docs + clinical governance | P00-06 | Directly restates REQ-LOCK-011 for terminology. |
| REQ-DOM-005 | Quote, Reservation, ServiceOrder, and Fulfilment are distinct lifecycle concepts and must not be represented as one generic Order. | PROPOSED | Product + architecture + operations | P00-07 | P00-07 must define transitions without generic order conflation. |
| REQ-DOM-006 | PaymentIntent, Payment, and LedgerEntry are distinct; a generic payment-success flag does not create provider-detail access. | APPROVED | Source docs + finance/security | P00-13 | Final successful-payment event remains REQUIRES_APPROVAL in P00-13. |
| REQ-DOM-007 | Consent, Delegation, and Authorization are distinct; consent and delegation may inform access, but authorization decides a specific action in context. | PROPOSED | Privacy counsel + security lead | P00-11 | Requires privacy/security approval before implementation. |
| REQ-DOM-008 | Data classification supports multiple simultaneous tags and strictest-rule precedence, with field-level restrictions overriding document-level defaults. | PROPOSED | Security lead + privacy counsel | P00-14 | Requires privacy/security review. |
| REQ-DOM-009 | Provider identity and location data is a separate handling concern from general provider, facility, or payment data. | APPROVED | Source docs + security | P00-08 | Directly supports REQ-LOCK-003 through REQ-LOCK-005. |
| REQ-DOM-010 | `providerDisplayName` is an explicit field-level pre-payment allowance; it does not permit address, branch, distance, coordinates, contact, map, or derivable metadata. | APPROVED | Source docs + security/privacy | P00-08 | Directly restates locked disclosure rule. |
| REQ-DOM-011 | Lower environments, fixtures, browser traces, screenshots, and test data must be synthetic-only unless a later approved policy is more restrictive. | APPROVED | Source docs + QA/security | P00-14 | Directly restates locked browser-testing synthetic-data rule. |
| REQ-DOM-012 | Analytics is derived, minimized, and non-authoritative; analytics must not become a transactional source of truth or grant operational access. | APPROVED | Source docs + privacy/security | P00-15 | Directly restates P00-06 locked analytics rule. |

## P00-06 architecture decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-ARC-001 | Initial architecture is a modular monolith, not a microservice topology. | APPROVED | Source docs + architecture | P00-06 | Directly restates P00-06 locked architectural rule. |
| REQ-ARC-002 | Bounded contexts are logical ownership, terminology, dependency, and data-authority boundaries inside one deployable backend. | PROPOSED | Architecture lead | P00-17 | Implementation structure remains later-phase work. |
| REQ-ARC-003 | Every major entity has one owning bounded context; other contexts use references, redacted projections, rebuildable read models, or derived aggregates. | APPROVED | Source docs + architecture | P00-06 | Directly restates one-source-of-truth rule. |
| REQ-ARC-004 | Read models are derived and rebuildable unless a later approved design explicitly defines different retention and authority. | PROPOSED | Architecture + security | P00-14/P00-17 | Requires security/privacy review. |
| REQ-ARC-005 | Cross-context access to sensitive data uses redacted projections and purpose-specific views instead of shared private-table access. | PROPOSED | Architecture + security + privacy | P00-14 | Requires implementation security design. |
| REQ-ARC-006 | External vendors are accessed through ports and adapters. | APPROVED | Source docs + architecture | P00-06 | Directly restates vendor-independence rule. |
| REQ-ARC-007 | Domain types must not contain vendor-specific names, SDK types, or provider enums. | APPROVED | Source docs + architecture | P00-06 | Directly restates vendor-independence rule. |
| REQ-ARC-008 | A transactional outbox or equivalent atomic intent pattern is the conceptual default for sensitive changes that must emit audit or cross-context intent. | PROPOSED | Architecture + security | P00-14/P01 | Conceptual only; no implementation technology selected. |
| REQ-ARC-009 | Notifications, analytics, search, reporting, partner callbacks, and support projections may be eventually consistent. | PROPOSED | Architecture + operations | P00-15/P00-17 | P00-07/P00-15 must define acceptable staleness where needed. |
| REQ-ARC-010 | Ledger movements require atomic balanced entries for one financial movement. | PROPOSED | Finance + architecture | P00-13 | Finance approval required for final ledger policy. |
| REQ-ARC-011 | Finalized clinical-record versioning requires atomic version creation plus immutable reference update. | APPROVED | Source docs + clinical governance | P00-06 | Directly supports REQ-LOCK-011. |
| REQ-ARC-012 | Each context produces audit intent for sensitive actions while Consent and Audit owns the canonical append-only audit store. | PROPOSED | Security + architecture | P00-14 | Requires audit retention and implementation policy. |
| REQ-ARC-013 | Pre-payment provider-view sanitization happens server-side before data crosses the server-to-client boundary. | APPROVED | Source docs + security | P00-08 | Directly restates REQ-LOCK-005. |
| REQ-ARC-014 | InternalProviderMatchingCandidate, PrePaymentProviderOfferView, and AuthorizedPostPaymentFulfilmentView are separate conceptual projections. | APPROVED | Source docs + architecture | P00-06 | Names may be refined, boundaries remain locked. |
| REQ-ARC-015 | Post-payment provider-detail authorization is exact-order, selected-provider, actor, patient, tenant, and server-authorization scoped. | APPROVED | Source docs + security | P00-08/P00-13 | Final payment event remains REQUIRES_APPROVAL. |
| REQ-ARC-016 | Analytics is downstream-only and does not feed operational authority. | APPROVED | Source docs + privacy/security | P00-15 | Directly restates locked analytics rule. |
| REQ-ARC-017 | Support and Operations cannot directly edit another context's storage for routine resolution. | APPROVED | Source docs + operations | P00-15 | Directly follows EXC-054/P00-05 rule. |
| REQ-ARC-018 | Context interfaces and read models are required for cross-context access; private-table access is not an architectural assumption. | PROPOSED | Architecture + engineering | P01 | Implementation interface design deferred. |

## P00-07 workflow state-machine decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-WFL-001 | Every workflow instance has one authoritative current lifecycle state, a version/equivalent concurrency concept, and append-only transition history. | PROPOSED | Architecture lead + engineering lead | P00-07 | Implementation must reject loose Boolean lifecycle modeling. |
| REQ-WFL-002 | Workflow transitions are attempted only through explicit conceptual commands. | PROPOSED | Architecture lead | P00-07 | Direct status-field mutation is prohibited. |
| REQ-WFL-003 | Lifecycle state must remain separate from orthogonal attributes such as disposition, severity, criticality, funding source, credential status, external status, and user-visible label. | PROPOSED | Architecture + product + clinical | P00-07 | Downstream implementation must preserve dimensional separation. |
| REQ-WFL-004 | Authorization is transition-specific and must evaluate actor, tenant, patient/order/entity, assignment, purpose, consent/delegation, credential, and funding/order relationship where applicable. | APPROVED | Source docs + security | P00-07 | Restates locked payer/clinical and tenant/patient isolation rules. |
| REQ-WFL-005 | Guards must pass before any state change, event, notification, external call, or side effect. | PROPOSED | Architecture + security | P00-07 | Sensitive changes also require audit/outbox intent. |
| REQ-WFL-006 | State version or equivalent optimistic-concurrency control is required for workflow commands. | PROPOSED | Architecture + engineering | P00-14/P01 | Implementation mechanism deferred. |
| REQ-WFL-007 | Transition history is append-only and must not be deleted or rewritten during compensation. | APPROVED | Source docs + governance | P00-07 | Supports clinical/audit integrity rules. |
| REQ-WFL-008 | Every nonterminal state has a current owner and escalation owner. | PROPOSED | Operations lead | P00-15 | P00-15 must approve operational ownership and queue targets. |
| REQ-WFL-009 | Every nonterminal state has a timeout/review policy or explicit NO-AUTOMATIC-TIMEOUT handling. | PROPOSED | Operations lead + clinical/finance owners where applicable | P00-15 | Numeric values remain unapproved. |
| REQ-WFL-010 | P00-07 does not invent numeric timeouts, retry counts, clinical thresholds, regulatory periods, or service-level targets. | APPROVED | Source docs + execution governance | P00-07 | Values remain owner-approved in later prompts. |
| REQ-WFL-011 | Terminal workflow reopening requires an explicit Reopen command, permitted actor, reason, audit entry, version increment, and defined destination or linked replacement. | PROPOSED | Architecture + operations | P00-07 | Some terminal states may require linked replacement rather than reopening. |
| REQ-WFL-012 | External callbacks must be idempotent and authenticated by later implementation policy. | PROPOSED | Security + architecture | P00-14/P01 | Authentication implementation deferred. |
| REQ-WFL-013 | Out-of-order events or callbacks must not regress authoritative workflow state. | PROPOSED | Architecture + security | P00-07 | Contradictions route to exception/reconciliation. |
| REQ-WFL-014 | Operations may not directly edit workflow state or another context's private storage for routine recovery. | APPROVED | Source docs + operations governance | P00-07 | Restates P00-05/P00-06 direct-edit prohibition. |
| REQ-WFL-015 | Contradictory cross-workflow states create an explicit exception, incident, or reconciliation path. | PROPOSED | Architecture + operations | P00-07 | Contradiction matrix defines baseline responses. |
| REQ-WFL-016 | Stock reservation against internally authoritative inventory is atomic and duplicate consume/release commands are idempotent. | PROPOSED | Pharmacy operations + architecture | P00-10 | Inventory policy and partial fulfilment remain approval-gated. |
| REQ-WFL-017 | Payment, order, inventory, payout, and refund workflows must not silently contradict one another. | PROPOSED | Finance + operations | P00-13/P00-15 | Reconciliation policy required. |
| REQ-WFL-018 | Provider-detail disclosure is a separate exact-order, selected-provider, actor, patient, tenant, server-authorized decision and is not owned by payment state alone. | APPROVED | Source docs + security | P00-08/P00-13 | Final successful-payment event remains unresolved. |
| REQ-WFL-019 | Emergency escalation bypasses commercial, funding, booking, registration, coverage, authorization, and pharmacy/lab disclosure blockers. | APPROVED | Source docs + clinical governance | P00-09 | Restates locked emergency rule. |
| REQ-WFL-020 | Finalized clinical records, prescriptions, diagnostic results, and referral summaries never return silently to draft. | APPROVED | Source docs + clinical governance | P00-07 | Corrections use amendment, replacement, corrected version, or supersession. |
| REQ-WFL-021 | Critical result workflows require acknowledgement, escalation, failed-contact handling, resolution, and audit, with exact intervals pending clinical approval. | REQUIRES_CLINICAL_REVIEW | Clinical lead + lab operations | P00-09/P00-10 | Numeric clinical intervals not approved. |
| REQ-WFL-022 | Credential status gates new provider work while preserving historical signed records and audit. | PROPOSED | Credentialing + clinical + security | P00-07/P00-15 | Active-work reassignment policy remains approval-gated. |
| REQ-WFL-023 | Workflow notifications use minimum-necessary content and must not expose protected clinical, payment, credential, or pre-payment provider-location data. | APPROVED | Source docs + privacy/security | P00-14 | Restates notification minimization requirements. |
| REQ-WFL-024 | Browser-visible status is derived from server-authoritative workflow state, not URL parameters, local flags, hidden DOM, stale cache, or client payment screens. | APPROVED | Source docs + security/QA | P00-14 | Required for future browser tests. |
| REQ-WFL-025 | Future state-machine tests must cover legal transitions, illegal transitions, unauthorized/wrong-tenant/wrong-patient commands, stale versions, duplicates, callbacks, timeouts, compensation, audit, notifications, and browser back/refresh behavior using synthetic data. | APPROVED | Source docs + QA/security | P00-14 | Test implementation deferred. |
## P00-08 provider-detail disclosure decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-PRV-001 | Separate pre-payment MarketplaceQuoteView and post-payment AuthorizedFulfilmentLocationView resources are required. | APPROVED | Source docs + Architecture lead + Security lead | P00-08 / P00-10 | Implements locked server-side separation rule. |
| REQ-PRV-002 | Provider disclosure serialization uses server-side allow-lists before any client-facing payload is created. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Frontend hiding is not a control. |
| REQ-PRV-003 | Patient-facing pre-payment responses must never contain a full provider, facility, branch, or location object. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Contract regression tests required. |
| REQ-PRV-004 | providerDisplayName is the only pre-payment provider identity field. | APPROVED | Source docs + Product owner + Security lead | P00-08 / P00-10 | Restates locked rule. |
| REQ-PRV-005 | providerDisplayName must pass display-safe validation and locality/branch wording requires approval where ambiguous. | APPROVED | Security lead + Privacy counsel | P00-08 / P00-12 | Legal-name locality case remains open. |
| REQ-PRV-006 | Opaque selection token is required for pre-payment quote selection. | APPROVED | Security lead + Architecture lead | P00-08 / P00-10 | No token format selected. |
| REQ-PRV-007 | Opaque selection token is not authorization, payment evidence, or provider-detail unlock evidence. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Must be enforced server-side. |
| REQ-PRV-008 | Post-payment provider-detail retrieval is order-based, not provider-ID-based. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | No raw provider ID retrieval endpoint. |
| REQ-PRV-009 | Provider-detail authorization is exact-order scoped. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | One order cannot unlock another. |
| REQ-PRV-010 | Provider-detail authorization is exact selected-provider scoped. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Replacement requires fresh decision. |
| REQ-PRV-011 | Actor, patient, and tenant binding are required for protected retrieval. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Wrong context denied. |
| REQ-PRV-012 | Authorization is recomputed on each protected retrieval. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | No permanent entitlement. |
| REQ-PRV-013 | Generic payment success, browser success routes, and client-side paid flags do not unlock details. | APPROVED | Source docs + Finance owner + Security lead | P00-08 / P00-13 | Final event deferred. |
| REQ-PRV-014 | Final financial evidence for disclosure remains deferred to P00-13. | REQUIRES_APPROVAL | Finance owner + Legal counsel + Security lead | P00-13 / P00-16 | Do not treat capture, settlement, transfer, guarantee, or coverage as approved yet. |
| REQ-PRV-015 | No provider-specific map is permitted before payment authorization. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | No map pin, coordinates, route, distance, or provider bounds. |
| REQ-PRV-016 | Map requests occur only after authorization and only for the selected order/provider. | APPROVED | Source docs + Security lead | P00-08 / P00-10 | Vendor choice deferred. |
| REQ-PRV-017 | Protected post-payment responses require private non-shared no-store handling. | APPROVED | Security lead + Architecture lead | P00-08 / P00-14 | Framework API deferred. |
| REQ-PRV-018 | Protected provider details are prohibited in local storage, URLs, route params, stale client state, and service-worker caches. | APPROVED | Security lead + QA lead | P00-08 / P00-14 | Browser tests required. |
| REQ-PRV-019 | Telemetry, analytics, logs, traces, screenshots, videos, session replay, and error reports use minimized allow-lists. | APPROVED | Security lead + Privacy counsel | P00-08 / P00-14 | Retention policy deferred. |
| REQ-PRV-020 | Error responses must not enumerate providers, locations, or internal identifiers. | APPROVED | Security lead | P00-08 / P00-10 | Status code policy deferred. |
| REQ-PRV-021 | Support and administrator access is purpose-specific, order-specific, and audited; no universal provider-detail browsing. | APPROVED | Security lead + Operations lead | P00-08 / P00-15 | Break-glass policy deferred. |
| REQ-PRV-022 | Provider replacement requires disclosure recomputation and privacy-safe user notice. | APPROVED | Security lead + Operations lead | P00-08 / P00-10 | Financial adjustment deferred. |
| REQ-PRV-023 | Refund, reversal, and chargeback require future-access recomputation and cannot create initial eligibility. | REQUIRES_APPROVAL | Finance owner + Legal counsel + Security lead | P00-13 / P00-16 | Exact future retrieval rule deferred. |
| REQ-PRV-024 | MarketplaceQuoteView field expansion requires privacy, security, contract, data-classification, negative-test, and traceability review. | APPROVED | Security lead + Privacy counsel + Architecture lead | P00-08 / P00-10 | ADR supersession rule applies. |
| REQ-PRV-025 | Disclosure audit records allowed and denied access with minimized payloads. | APPROVED | Security lead + Privacy counsel | P00-08 / P00-14 | Audit retention deferred. |
| REQ-PRV-026 | Search and indexing restrictions apply to authenticated disclosure pages and payloads. | APPROVED | Security lead + Privacy counsel | P00-08 / P00-14 | robots.txt is not security control. |
| REQ-PRV-027 | Provider-disclosure testing uses synthetic data and synthetic artifacts only. | APPROVED | Source docs + QA lead + Security lead | P00-08 / P00-14 | No real provider or patient data. |
| REQ-PRV-028 | Future implementation requires both interactive IDE browser inspection and deterministic Playwright coverage for provider disclosure. | APPROVED | Source docs + QA lead + Engineering lead | P00-14 / P01 | No browser tooling installed in P00-08. |

## P00-09 clinical scope, safety, emergency, referral, and critical-result decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-CLN-001 | Adult outpatient pilot clinical boundary remains limited to adults aged 18 and above unless later approved. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-002 | Clinical rules require qualified clinical approval before becoming effective. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-003 | Human clinicians retain diagnostic and prescribing authority. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-004 | Telemedicine suitability is continuously reassessed. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-005 | Emergency and urgent cases leave ordinary booking. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-006 | Current-location handling is required for emergency escalation. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-007 | Identity confirmation is required before consultation. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-008 | Minimum clinical intake is required where clinically relevant. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-009 | Remote-examination limitations must be documented and acted upon. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-010 | Video and audio clinical boundaries require approval. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-011 | Background blur and face-visibility policy require clinical approval. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-012 | No recording occurs by default. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-013 | Consultation participants require consent or another approved basis. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-014 | Consultation documentation requirements are explicit. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-015 | Signed clinical-note finalization uses amendment or versioning. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-016 | Disconnection does not equal completion. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-017 | Safety netting is mandatory where clinically applicable. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-018 | Follow-up owner is required for open clinical loops. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-019 | Prescribing remains clinician-controlled. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-020 | A laboratory result cannot automatically create a prescription or medication purchase. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-021 | Routine, priority, urgent, and emergency referral categories are distinct. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-022 | Referral tracking is closed-loop. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-023 | Emergency escalation is independent of payment. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-024 | Emergency content is approved configuration. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-025 | Transfer summaries use minimum necessary data. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-026 | Receiving-facility contact and failed-contact tracking are required. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-027 | Critical-result rules are versioned clinical configuration. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-028 | Critical-result acknowledgment is explicit and distinct from notification. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-029 | Failed critical-result contact requires escalation. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-030 | Corrected critical results require re-evaluation and renotification. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-031 | Clinical incident governance is required. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-032 | Downtime safety behavior is required. | REQUIRES_APPROVAL | Clinical Lead + relevant owner | P00-09 / P00-17 | Clinical protocols remain DRAFT-PENDING-CLINICAL-APPROVAL and NOT EFFECTIVE UNTIL APPROVED. |
| REQ-CLN-033 | Accessibility and connectivity are clinical safety concerns. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-034 | No clinical thresholds, emergency numbers, attempt counts, intervals, or response times are invented in P00-09. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |
| REQ-CLN-035 | Clinical change control and rollback are required. | APPROVED | Clinical Lead + relevant owner | P00-09 / P00-17 | Directly restates locked safety requirement for planning; operational wording remains approval-gated. |


## P00-10 prescription, pharmacy, laboratory, result-release, and delivery decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-FUL-001 | Prescription issuance requires an authorized clinician with a valid credential and a clinical assessment; NelyoHealth does not autonomously prescribe. | APPROVED | Clinical Lead | P00-10 / P00-17 | Restates P00-09 clinical authority and P00-10 clinician-authorization requirements. |
| REQ-FUL-002 | Prescription required-field policy is drafted as proposed content only and requires clinical, pharmacy, legal, and regulatory approval before implementation. | REQUIRES_APPROVAL | Clinical Lead + Regulatory Reviewer | P00-10 / P00-12 | No final legal mandatory-field conclusion is approved in P00-10. |
| REQ-FUL-003 | Issued prescriptions are immutable finalized clinical records and are not edited in place. | APPROVED | Clinical Lead | P00-10 / P00-17 | Restates REQ-LOCK-011 for prescriptions. |
| REQ-FUL-004 | Prescription amendment, cancellation, and replacement preserve prior versions and link affected pharmacy orders to review. | APPROVED | Clinical Lead + Pharmacy Operations Lead | P00-10 / P00-17 | Operational notification rules remain privacy-approved policy. |
| REQ-FUL-005 | Prescription expiry, refill authorization, refill limits, and partial-refill behavior remain approval-gated. | REQUIRES_APPROVAL | Clinical Lead + Pharmacy Operations Lead | P00-10 / P00-12 | No duration or refill count is approved. |
| REQ-FUL-006 | Generic or brand substitution requires explicit prescriber permission where applicable, pharmacist documentation, patient communication where required, and no silent substitution. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Clinical Lead + Legal Counsel | P00-10 / P00-12 | Final substitution categories require pharmacy, clinical, legal, and regulatory approval. |
| REQ-FUL-007 | Restricted online medicine categories are blocked, manual-review, post-pilot, or regulatory-approval gated unless explicitly approved. | REQUIRES_APPROVAL | Clinical Lead + Pharmacy Operations Lead + Legal Counsel | P00-10 / P00-12 | No controlled, dangerous, cold-chain, compounded, high-risk, or cross-border category is permitted by P00-10. |
| REQ-FUL-008 | Pharmacist clarification does not edit the clinical prescription; the prescription changes only through authorized prescriber amendment, replacement, or cancellation. | APPROVED | Clinical Lead + Pharmacy Operations Lead | P00-10 / P00-17 | Restates finalized-record integrity and pharmacist-boundary rules. |
| REQ-FUL-009 | Partial fulfilment requires explicit approved policy, quantity tracking, patient approval where required, refund/price-adjustment handoff, and no over-dispensing. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Finance Owner | P00-10 / P00-13 | Final partial-fulfilment policy remains unapproved. |
| REQ-FUL-010 | Pharmacy search starts at 4 km and expands only server-side through controlled policy stages. | PROPOSED | Operations Lead + Security Lead | P00-10 / P00-15 | Expansion stages and service-area controls remain approval-gated. |
| REQ-FUL-011 | Pharmacy matching criteria and internal ranking remain server-side and are not exposed to the patient-facing client. | APPROVED | Security Lead + Pharmacy Operations Lead | P00-10 / P00-14 | Reinforces provider-disclosure contract and ranking minimization. |
| REQ-FUL-012 | Pharmacy quote validity and stock-freshness requirements must record issuer, version, source, timestamp, freshness/confidence status, withdrawal, supersession, and audit. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Finance Owner | P00-10 / P00-15 | No quote-expiry or stock-freshness interval is approved. |
| REQ-FUL-013 | Stock reservation must be atomic against authoritative availability and prevent two patients from consuming the same final unit. | PROPOSED | Pharmacy Operations Lead + Architecture Lead | P00-10 / P00-14 | Implementation mechanism deferred. |
| REQ-FUL-014 | Stock reservation or an approved firm confirmation must occur before payment capture. | REQUIRES_APPROVAL | Finance Owner + Pharmacy Operations Lead | P00-10 / P00-13 | Exact payment authorization, pharmacist acceptance, capture, and disclosure ordering remains finance and operations approval-gated. |
| REQ-FUL-015 | Final payment, coverage, acceptance, capture, settlement, and provider-detail disclosure sequencing remains approval-gated for P00-13. | REQUIRES_APPROVAL | Finance Owner + Security Lead + Operations Lead | P00-13 | P00-10 does not approve the successful-payment unlock event. |
| REQ-FUL-016 | Pharmacist acceptance is required before dispensing; rejection or clarification routes to explicit hold, cancellation, replacement, refund, or operations handling. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Clinical Lead | P00-10 / P00-15 | Exact queue targets and escalation timings remain unapproved. |
| REQ-FUL-017 | Dispensing confirmation records exact order, prescription, quantity, substitution/partial status where applicable, timestamp, handover mode, audit, and duplicate-dispensing prevention. | REQUIRES_APPROVAL | Pharmacy Operations Lead | P00-10 / P00-12 | Batch and expiry field requirements remain approval-gated. |
| REQ-FUL-018 | Provider-detail disclosure for pharmacy and laboratory is exact-order, selected-provider, actor, patient, tenant, and server-decision bound. | APPROVED | Security Lead | P00-10 / P00-13 | Restates REQ-LOCK-006 through REQ-LOCK-009 and P00-08. |
| REQ-FUL-019 | Collection requires authorized collector/recipient verification, post-authorization instructions, handover proof, failed-collection handling, safe return review, and privacy-safe communication. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Privacy Counsel | P00-10 / P00-15 | Collection no-show and return-to-stock rules remain open. |
| REQ-FUL-020 | Medicine delivery uses minimum-necessary courier data and excludes diagnosis, consultation notes, full prescription, laboratory result, sponsor, HMO, employer, family-plan, and unrelated records. | APPROVED | Privacy Counsel + Security Lead + Operations Lead | P00-10 / P00-14 | Restates locked payer/clinical separation and delivery minimization. |
| REQ-FUL-021 | Medicine delivery requires tamper, handling, handover, pickup, recipient-verification, proof, incident, and audit evidence appropriate to the approved delivery method. | REQUIRES_APPROVAL | Operations Lead + Pharmacy Operations Lead | P00-10 / P00-15 | Packaging and tamper standards remain approval-gated. |
| REQ-FUL-022 | Delivery proof is order-specific, time-stamped, actor-attributed, auditable, protected, and idempotent; no mandatory proof method is selected in P00-10. | REQUIRES_APPROVAL | Operations Lead + Security Lead | P00-10 / P00-15 | OTP/signature/scan choices remain unapproved. |
| REQ-FUL-023 | Failed delivery and return require explicit recovery, chain-of-custody, package-integrity review, refund/replacement handoff, patient communication, and audit. | REQUIRES_APPROVAL | Operations Lead + Pharmacy Operations Lead | P00-10 / P00-15 | Attempt counts, redelivery policy, and return-to-stock eligibility remain open. |
| REQ-FUL-024 | Cold-chain and special-handling fulfilment remains blocked or approval-gated; P00-10 does not approve temperature ranges, sensors, packaging, excursions, or handover intervals. | REQUIRES_APPROVAL | Pharmacy Operations Lead + Clinical Lead + Legal Counsel + Regulatory Reviewer | P00-10 / P00-12 | Unsupported cold-chain orders are blocked or manual-review only. |
| REQ-FUL-025 | Diagnostic orders require authorized clinician direction, valid credential, clinical assessment, correct patient, clinical reason, test/panel, priority, specimen/preparation requirements, signature/equivalent, and audit. | REQUIRES_APPROVAL | Clinical Lead + Laboratory Operations Lead | P00-10 / P00-12 | Final diagnostic mandatory fields remain approval-gated. |
| REQ-FUL-026 | Test catalogue entries are versioned, approved, effective-dated, suspendable, retireable, and tied to specimen, preparation, method, reference, criticality, and capability requirements. | REQUIRES_APPROVAL | Laboratory Clinical Owner + Laboratory Operations Lead | P00-10 / P00-12 | No test catalogue is approved in P00-10. |
| REQ-FUL-027 | Laboratory search starts at 4 km and expands only server-side through controlled policy stages. | PROPOSED | Laboratory Operations Lead + Security Lead | P00-10 / P00-15 | Expansion stages remain approval-gated. |
| REQ-FUL-028 | Laboratory pre-payment offers expose providerDisplayName only as provider identity plus approved non-identifying price/workflow information and opaque selection token. | APPROVED | Security Lead + Product Owner | P00-10 / P00-14 | Restates locked disclosure and P00-08 contract. |
| REQ-FUL-029 | Specimen identity and chain of custody require correct patient, order, item, label/identifier, collector, collection time, specimen type, transport/receipt/accession, acceptance or rejection, and audit. | REQUIRES_APPROVAL | Laboratory Operations Lead | P00-10 / P00-12 | Label standard and chain-of-custody depth remain approval-gated. |
| REQ-FUL-030 | Specimen rejection and recollection require reason, communication, ownership, payment/refund question handling, incident review, and audit; P00-10 does not assign recollection costs. | REQUIRES_APPROVAL | Laboratory Operations Lead + Finance Owner | P00-10 / P00-13 | Cost responsibility remains open. |
| REQ-FUL-031 | Result verification requires patient-order-specimen association, authorized verifier, facility eligibility, quality checks, units, reference context, version, signature/equivalent, criticality assessment, and audit. | REQUIRES_APPROVAL | Laboratory Clinical Owner | P00-10 / P00-12 | Final verification mechanism and result fields remain approval-gated. |
| REQ-FUL-032 | A structured result plus signed human-readable representation is required where structured data is needed; a PDF alone is not the canonical structured result. | REQUIRES_APPROVAL | Laboratory Clinical Owner + Architecture Lead | P00-10 / P00-14 | Structured format and signed-result mechanism remain open. |
| REQ-FUL-033 | Corrected results preserve prior verified versions, record correction reason, create new version, require authorized verification and signature, reassess criticality, renotify where required, and never silently overwrite. | APPROVED | Laboratory Clinical Owner + Clinical Lead | P00-10 / P00-17 | Restates REQ-LOCK-011 for diagnostic results. |
| REQ-FUL-034 | Critical-result handling depends on P00-09 protocol; verification, upload, or release is not closure. | APPROVED | Clinical Lead + Laboratory Clinical Owner | P00-10 / P00-17 | Closure requires notification, acknowledgment, escalation, action, follow-up, resolution, and audit. |
| REQ-FUL-035 | Clinician review of results is explicit and is not inferred from verification, release, patient viewing, or notification. | APPROVED | Clinical Lead | P00-10 / P00-17 | Treatment changes require qualified clinician authorization. |
| REQ-FUL-036 | A laboratory result cannot automatically create a prescription, start pharmacy search, purchase medication, change treatment, or close the diagnostic loop. | APPROVED | Clinical Lead | P00-10 / P00-17 | Restates REQ-CLN-020 and P00-10 result-to-treatment boundary. |
| REQ-FUL-037 | Diagnostic-loop closure requires follow-up evidence, including verification, release, clinician review, patient communication, critical-result acknowledgment where applicable, clinical action, corrected-result handling, resolution, and audit. | REQUIRES_APPROVAL | Clinical Lead + Laboratory Clinical Owner | P00-10 / P00-15 | Exact operations targets remain open. |
| REQ-FUL-038 | Pharmacy, laboratory, delivery, result, or prescription exceptions must not be resolved by direct production database editing. | APPROVED | Operations Lead + Architecture Lead | P00-10 / P00-17 | Recovery uses approved workflows, commands, reviews, amendments, cancellations, refunds, or reconciliation. |
| REQ-FUL-039 | Provider suspension routes active pharmacy or laboratory work to explicit review, reassignment, cancellation, patient-safety handling, or refund/reconciliation where applicable, and blocks new work. | PROPOSED | Credentialing Lead + Operations Lead | P00-10 / P00-15 | Final active-work reassignment policy remains approval-gated. |
| REQ-FUL-040 | Final financial evidence for provider-detail disclosure remains deferred to P00-13 and is not approved by P00-10. | REQUIRES_APPROVAL | Finance Owner + Security Lead | P00-13 | No capture, settlement, authorization, coverage, refund, reversal, chargeback, or client success state is approved as the unlock event. |

## P00-11 privacy, consent, guardianship, delegation, and data-governance decisions

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-DAT-001 | Consent is not a blanket lawful basis for all processing activities. | APPROVED | Privacy Counsel + Legal Counsel | P00-11 / P00-12 | Restates P00-11 locked rule; final lawful bases require P00-12 review. |
| REQ-DAT-002 | Processing purposes require separate basis review with purpose, data categories, subjects, actors, recipients, and approval status. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel | P00-11 / P00-12 | No final lawful basis is approved in P00-11. |
| REQ-DAT-003 | Consent is purpose-specific, versioned, evidenced, scoped, withdrawable where applicable, and audited. | REQUIRES_APPROVAL | Privacy Counsel | P00-11 / P00-12 | Legal review controls final wording and enforceability. |
| REQ-DAT-004 | Optional consents are separate from required service notices and must not be bundled or preselected. | REQUIRES_APPROVAL | Privacy Counsel + Product Owner | P00-11 / P00-14 | UX and legal review required. |
| REQ-DAT-005 | Consent withdrawal affects future processing according to approved policy. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Propagation, processor notice, cache/token behavior require implementation design. |
| REQ-DAT-006 | Consent withdrawal does not automatically erase historical clinical, financial, or audit records. | APPROVED | Privacy Counsel + Clinical Lead | P00-11 / P00-12 | Restates finalized-record integrity and audit-retention constraints. |
| REQ-DAT-007 | Person, UserAccount, Patient, Guardian, ClinicalProxy, Caregiver, Sponsor, and Payer remain distinct concepts. | APPROVED | Product Owner + Privacy Counsel + Security Lead | P00-11 | Restates locked identity and authority separation. |
| REQ-DAT-008 | Family membership or family-plan administration is not guardianship or clinical access. | APPROVED | Privacy Counsel + Product Owner | P00-11 | Restates payer/clinical separation. |
| REQ-DAT-009 | Sponsorship is not clinical authority and does not grant clinical records, consultation participation, or unrelated provider details. | APPROVED | Privacy Counsel + Product Owner | P00-11 | Restates sponsor boundary. |
| REQ-DAT-010 | Employer reporting is aggregate, minimized, and re-identification reviewed; no individual employee clinical records are disclosed to employer administrators. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel + Product Owner | P00-11 / P00-12 | No aggregation threshold is approved. |
| REQ-DAT-011 | HMO visibility is purpose-specific, minimum necessary, authorized, audited, and separate from unrestricted clinical-record access. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel + Finance Owner | P00-11 / P00-12 | Contract/legal requirements remain pending. |
| REQ-DAT-012 | Platform, support, security, finance, organization, technical, and administrator roles do not have universal clinical access. | APPROVED | Security Lead + Privacy Counsel | P00-11 | Restates no universal administrator access. |
| REQ-DAT-013 | Guardian authority requires evidence and verification before activation. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel + Clinical Lead | P00-11 / P00-12 | Final evidence sufficiency remains legal-review controlled. |
| REQ-DAT-014 | Multiple guardians, restrictions, suspension, disputes, temporary controls, appeal, and audit are supported conceptually. | REQUIRES_APPROVAL | Privacy Counsel + Clinical Lead | P00-11 / P00-12 | Final dispute rules require legal/clinical review. |
| REQ-DAT-015 | Minor assent is modeled separately from guardian authority and adult consent. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel + Clinical Lead | P00-11 / P00-12 | No final age threshold is approved. |
| REQ-DAT-016 | Age-of-majority transition preserves the same Person, Patient, and clinical record. | APPROVED | Privacy Counsel + Clinical Lead | P00-11 | Restates one longitudinal patient identity. |
| REQ-DAT-017 | Adult delegation is granular by capability and not universal. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Final access implementation deferred. |
| REQ-DAT-018 | ClinicalProxy and Caregiver remain distinct; neither automatically proves the other. | APPROVED | Privacy Counsel + Clinical Lead | P00-11 | Restates authority separation. |
| REQ-DAT-019 | Delegation is revocable, auditable, scope-bound, and does not delete historical records. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Revocation propagation requires implementation design. |
| REQ-DAT-020 | Break-glass is exceptional and is not routine administration or support. | APPROVED | Security Lead + Privacy Counsel + Clinical Lead | P00-11 | Restates locked break-glass restriction. |
| REQ-DAT-021 | Break-glass requires reason, approved purpose, patient context, tenant context, scope, configured duration/review boundary, audit, and review. | REQUIRES_APPROVAL | Security Lead + Privacy Counsel + Clinical Lead | P00-11 / P00-14 | No numeric duration is approved. |
| REQ-DAT-022 | Break-glass does not bypass provider-detail marketplace disclosure rules. | APPROVED | Security Lead + Privacy Counsel | P00-11 | Restates provider-detail protection. |
| REQ-DAT-023 | Data-subject requests require identity and authority verification before search or disclosure. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-12 | Final identity-proofing requirements remain open. |
| REQ-DAT-024 | Clinical corrections use amendment, correction, supersession, or versioning rather than silent overwrite. | APPROVED | Clinical Lead + Privacy Counsel | P00-11 | Restates REQ-LOCK-011. |
| REQ-DAT-025 | Retention periods remain legal, clinical, finance, security, and contractual review controlled. | REQUIRES_APPROVAL | Legal Counsel + Privacy Counsel | P00-11 / P00-12 | No statutory period is approved. |
| REQ-DAT-026 | Ending employer, HMO, sponsor, family, guardian, provider, or account relationships does not delete patient clinical history. | APPROVED | Privacy Counsel + Clinical Lead | P00-11 | Restates continuity and record integrity. |
| REQ-DAT-027 | Cross-border data flows require explicit registration and legal/privacy/security review. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel + Security Lead | P00-11 / P00-12 | No transfer mechanism is approved. |
| REQ-DAT-028 | Diaspora payment does not create cross-border clinical access. | APPROVED | Privacy Counsel + Finance Owner | P00-11 | Restates sponsor/payment separation. |
| REQ-DAT-029 | Subprocessors require due diligence before pilot or production approval. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead + Legal Counsel | P00-11 / P00-12 | No vendor is approved. |
| REQ-DAT-030 | New subprocessors, countries, purposes, data categories, retention, incidents, contracts, acquisition, architecture changes, AI/model use, or session replay activation require material-change review. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Material-change process deferred. |
| REQ-DAT-031 | Analytics receives minimized, de-identified, or approved aggregate data only and is not a source of truth. | REQUIRES_APPROVAL | Privacy Counsel + Analytics Owner | P00-11 / P00-14 | Analytics basis and dimensions remain open. |
| REQ-DAT-032 | Session replay is disabled by default or approval-gated on sensitive surfaces; P00-11 does not approve session replay. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Any activation requires material-change review. |
| REQ-DAT-033 | Logs and telemetry use explicit allow-lists, redaction, tokenization where appropriate, minimum identifiers, restricted access, and controlled retention. | REQUIRES_APPROVAL | Security Lead + Privacy Counsel | P00-11 / P00-14 | Technical enforcement deferred. |
| REQ-DAT-034 | Notifications use minimum-necessary content and avoid sensitive details in subject lines, SMS, push, and lock-screen previews. | REQUIRES_APPROVAL | Privacy Counsel + Notifications Owner | P00-11 / P00-14 | Channel-specific content requires approval. |
| REQ-DAT-035 | Protected pre-payment pharmacy and laboratory details remain absent from unauthorized analytics, support tools, logs, notifications, browser artifacts, maps, exports, and cross-border flows. | APPROVED | Security Lead + Privacy Counsel | P00-11 | Restates locked provider-detail disclosure rule. |
| REQ-DAT-036 | Production data is prohibited in lower environments, browser validation artifacts, screenshots, traces, videos, training, and test fixtures. | APPROVED | Security Lead + QA Lead + Privacy Counsel | P00-11 / P00-14 | Restates synthetic-only locked test rule. |
| REQ-DAT-037 | Privacy incidents have defined detection, containment, evidence, privacy, security, clinical, legal, operations, notification, corrective-action, closure, and reopening ownership. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead + Legal Counsel | P00-11 / P00-12 | No breach deadline is approved. |
| REQ-DAT-038 | Breach notification decisions require legal and privacy review. | REQUIRES_APPROVAL | Legal Counsel + Privacy Counsel | P00-11 / P00-12 | No trigger or deadline is approved. |
| REQ-DAT-039 | Data exports require authorization, minimization, secure delivery, expiry, redaction, and audit. | REQUIRES_APPROVAL | Privacy Counsel + Security Lead | P00-11 / P00-14 | Format and delivery controls remain open. |
| REQ-DAT-040 | Privacy requirements require future browser and API negative tests using synthetic data. | APPROVED | QA Lead + Security Lead + Privacy Counsel | P00-11 / P00-14 | Browser tooling remains deferred; no tooling installed in P00-11. |

## P00-12 regulatory decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-REG-001 | Official-source hierarchy controls P00-12 evidence. | APPROVED | Legal Counsel + Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-002 | Search snippets are not authoritative evidence when complete official source access is available. | APPROVED | Legal Counsel + Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-003 | Every obligation requires at least one official source ID or is marked access-limited without binding effect. | APPROVED | Legal Counsel + Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-004 | Every source records date checked and source status. | APPROVED | Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-005 | Draft, archived, repealed, superseded, inaccessible, and status-unverified sources are labelled. | APPROVED | Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-006 | Legal conclusions require qualified Nigerian counsel. | APPROVED | Legal Counsel | P00-12 | Legal-advice boundary. |
| REQ-REG-007 | Regulator clarification is required where source wording is ambiguous or launch-impacting. | APPROVED | Legal Counsel + domain owner | P00-12 | Governance rule. |
| REQ-REG-008 | Product locks are not silently changed by Codex when official sources create legal questions. | APPROVED | Product Owner + Legal Counsel | P00-12 | Preserves locked requirements. |
| REQ-REG-009 | Legal conflicts create explicit launch gates and open questions. | APPROVED | Legal Counsel + Product Owner | P00-12 | Governance rule. |
| REQ-REG-010 | State-level requirements remain unresolved until pilot geography is selected. | APPROVED | Legal Counsel + Operations Lead | P00-12 | Source limitation. |
| REQ-REG-011 | Partner licences do not automatically license NelyoHealth. | APPROVED | Legal Counsel | P00-12 | Research-governance and licensing boundary. |
| REQ-REG-012 | Professional credentials and facility licences are separate evidence classes. | APPROVED | Credential Review Lead + Legal Counsel | P00-12 | Licensing matrix rule. |
| REQ-REG-013 | NelyoHealth must not represent itself as HMO or insurer without approval. | APPROVED | Legal Counsel + Finance Owner | P00-12 | Representation boundary. |
| REQ-REG-014 | NelyoHealth must not represent itself as PSP, bank, mobile-money operator, remittance operator, or stored-value issuer without approval. | APPROVED | Legal Counsel + Finance Owner | P00-12 | Representation boundary. |
| REQ-REG-015 | NelyoHealth must not represent itself as pharmacy or laboratory without approval. | APPROVED | Legal Counsel + Pharmacy/Lab Owners | P00-12 | Representation boundary. |
| REQ-REG-016 | Electronic-pharmacy aggregator status requires formal legal/regulatory review. | REQUIRES_APPROVAL | Legal Counsel + Pharmacy Operations Lead | P00-12 / external review | REG-Q-002. |
| REQ-REG-017 | PCN platform-display conflict requires formal resolution before pharmacy pilot. | REQUIRES_APPROVAL | Legal Counsel + Pharmacy Operations Lead | P00-12 / external review | REG-Q-005; REG-OBL-015. |
| REQ-REG-018 | Laboratory public-disclosure rules require separate MLSCN/legal review and are not inferred from PCN pharmacy rules. | REQUIRES_APPROVAL | Legal Counsel + Laboratory Operations Lead | P00-12 / external review | REG-Q-007. |
| REQ-REG-019 | Medical-practice and telemedicine duties require MDCN/legal review. | REQUIRES_APPROVAL | Legal Counsel + Clinical Lead | P00-12 / external review | REG-Q-001; REG-Q-012. |
| REQ-REG-020 | Data-protection registration, DPO, DPIA, breach, transfer, processor, and annual-compliance duties require applicability mapping. | REQUIRES_APPROVAL | Privacy Counsel + Legal Counsel | P00-12 / external review | REG-Q-021 through REG-Q-026. |
| REQ-REG-021 | All provider types require source-backed credential verification before assignment. | REQUIRES_APPROVAL | Credential Review Lead + Legal Counsel | P00-12 / P00-14 | REG-LIC rows. |
| REQ-REG-022 | Every regulator-facing integration requires identified owner and source-backed obligation. | PROPOSED | Architecture Owner + Compliance Lead | P00-12 / P00-14 | REG-MON and REG-Q-037. |
| REQ-REG-023 | Regulatory monitoring is continuous and source-verified. | PROPOSED | Compliance Lead | P00-12 / P00-17 | Monitoring design. |
| REQ-REG-024 | Legal advice and official-source records are recorded separately. | APPROVED | Legal Counsel + Compliance Lead | P00-12 | Research-governance rule. |
| REQ-REG-025 | No compliance claim may be made from incomplete research. | APPROVED | Legal Counsel + Product Owner | P00-12 | Compliance-claim boundary. |
| REQ-REG-026 | Regulatory launch blockers must be reflected in product scope before implementation. | PROPOSED | Product Owner + Legal Counsel | P00-12 / P00-17 | Launch-gate control. |
| REQ-REG-027 | Contract dependencies must link to obligations and legal questions. | PROPOSED | Legal Counsel | P00-12 / P00-13 | Contract register rule. |
| REQ-REG-028 | Regulatory changes require legal, product, engineering, operations, contract, clinical/privacy, and test impact review. | PROPOSED | Compliance Lead | P00-12 / P00-17 | Monitoring rule. |

## P00-13 finance decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-FIN-002 | PaymentIntent, PaymentAuthorization, PaymentCapture, Settlement, Refund, Reversal, and Chargeback are distinct concepts and workflows. | PROPOSED | Finance/Payments Owner + Architecture Lead | P00-13 / P00-17 | docs/finance/payment-state-model.md |
| REQ-FIN-003 | Payment-provider states map through adapters and do not become canonical state without verification. | PROPOSED | Finance/Payments Owner + Engineering Lead | P00-13 / P00-14 | docs/finance/payment-state-model.md |
| REQ-FIN-004 | External callbacks require authentication, signature verification, replay validation, provider re-verification, and audit before use. | APPROVED | Security Lead + Finance/Payments Owner | P00-13 / P00-14 | Locked untrusted-callback rule and docs/finance/payment-state-model.md |
| REQ-FIN-005 | Duplicate callbacks are idempotent and cannot create duplicate payments, refunds, ledger entries, payouts, or OrderFundingSecured events. | APPROVED | Security Lead + Finance/Payments Owner | P00-13 / P00-14 | Locked idempotency rule and docs/finance/payment-state-model.md |
| REQ-FIN-006 | Out-of-order callbacks cannot regress authoritative payment, refund, payout, ledger, or disclosure-related state. | PROPOSED | Engineering Lead + Finance/Payments Owner | P00-13 / P00-14 | docs/finance/payment-state-model.md |
| REQ-FIN-007 | One authoritative internal payment state is maintained per payment intent/attempt while external provider state remains adapter evidence. | PROPOSED | Finance/Payments Owner + Architecture Lead | P00-13 | docs/finance/payment-state-model.md |
| REQ-FIN-008 | Every displayed financial balance derives from ledger entries and licensed-provider facts. | APPROVED | Finance/Payments Owner + Accounting Reviewer | P00-13 | Locked financial rule and docs/finance/ledger-principles.md |
| REQ-FIN-009 | The operational ledger uses double-entry balancing per currency. | PROPOSED | Finance/Payments Owner + Accounting Reviewer | P00-13 / external accounting review | docs/finance/ledger-principles.md |
| REQ-FIN-010 | Posted ledger entries are immutable. | PROPOSED | Finance/Payments Owner + Accounting Reviewer | P00-13 | docs/finance/ledger-principles.md |
| REQ-FIN-011 | Ledger corrections use reversal or adjustment entries, never silent overwrite or direct edit. | PROPOSED | Finance/Payments Owner + Accounting Reviewer | P00-13 | docs/finance/ledger-principles.md |
| REQ-FIN-012 | Ledger balancing occurs per currency and cross-currency treatment requires approved FX entries. | REQUIRES_APPROVAL | Finance/Payments Owner + Accounting/Tax Reviewer | P00-13 / external review | docs/finance/ledger-principles.md |
| REQ-FIN-013 | Budget, benefit, balance, payable, and refund are distinct and must not be conflated. | APPROVED | Finance/Payments Owner + Product Owner | P00-13 | Locked budget-is-not-money rule and docs/finance/ledger-principles.md |
| REQ-FIN-014 | Wallet is only a possible UI term pending product, legal, regulatory, and finance approval. | REQUIRES_APPROVAL | Product Owner + Legal Counsel + Finance/Payments Owner | P00-13 / external review | docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md |
| REQ-FIN-015 | No unapproved customer-fund custody, stored value, PSP, bank, PSB, MMO, IMTO, HMO, or insurer representation is allowed. | APPROVED | Legal Counsel + Finance/Payments Owner | P00-13 | P00-12 obligations and docs/finance/funds-flow.md |
| REQ-FIN-016 | No general-purpose wallet behavior, cash-out, P2P transfer, interest, credit, or general-purpose spending is approved in Phase 0. | APPROVED | Product Owner + Legal Counsel + Finance/Payments Owner | P00-13 | docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md |
| REQ-FIN-032 | OrderFundingSecured requires verified capture or approved equivalent plus balanced ledger posting. | PROPOSED | Finance/Payments Owner + Accounting Reviewer | P00-13 / external review | docs/finance/payment-state-model.md |
| REQ-FIN-033 | Authorization alone does not qualify for the pilot OrderFundingSecured rule. | APPROVED | Finance/Payments Owner + Security Lead | P00-13 | docs/finance/payment-state-model.md |
| REQ-FIN-034 | Settlement is not proposed as the ordinary patient-facing unlock point because it may lag capture/receipt. | PROPOSED | Finance/Payments Owner | P00-13 / external review | docs/finance/payment-state-model.md |
| REQ-FIN-035 | OrderFundingSecured does not directly expose provider details. | APPROVED | Security Lead + Finance/Payments Owner | P00-13 | Locked provider disclosure rule and docs/finance/payment-state-model.md |
| REQ-FIN-036 | ProviderDetailDisclosureDecision remains separately authoritative for provider-detail access. | APPROVED | Security Lead + Architecture Lead | P00-13 | docs/contracts/provider-disclosure-contract.md |
| REQ-FIN-037 | One order payment cannot unlock another order, provider, patient, or tenant. | APPROVED | Security Lead + Finance/Payments Owner | P00-13 | Locked provider disclosure rule |
| REQ-FIN-038 | Refund, reversal, and chargeback never create initial provider-detail eligibility. | APPROVED | Finance/Payments Owner + Security Lead | P00-13 | Locked financial/disclosure rule and docs/finance/refund-and-dispute-policy.md |
| REQ-FIN-039 | Future retrieval after refund, reversal, or chargeback is recomputed and remains approval-gated where ambiguous. | REQUIRES_APPROVAL | Finance/Payments Owner + Legal Counsel + Security Lead | P00-13 / external review | docs/finance/refund-and-dispute-policy.md |
| REQ-FIN-040 | Provider replacement requires fresh funding/disclosure review where applicable. | APPROVED | Security Lead + Pharmacy/Lab Operations | P00-13 | docs/finance/refund-and-dispute-policy.md |
| REQ-FIN-041 | Client success state, redirect, browser route, or unverified webhook cannot unlock provider details. | APPROVED | Security Lead + Finance/Payments Owner | P00-13 | Locked disclosure rule and docs/finance/payment-state-model.md |
| REQ-FIN-042 | Manual finance corrections require approval, evidence, reversal/adjustment entries, and audit. | PROPOSED | Finance/Payments Owner + Accounting Reviewer | P00-13 | docs/finance/ledger-principles.md |
| REQ-FIN-043 | Finance operations cannot edit posted records directly. | PROPOSED | Finance/Payments Owner + Security Lead | P00-13 | docs/finance/ledger-principles.md |
| REQ-FIN-044 | Financial role separation is required for high-risk adjustment, refund, payout, and destination-change controls. | PROPOSED | Finance/Payments Owner + Security Lead | P00-13 / P00-14 | docs/finance/ledger-principles.md |
| REQ-FIN-045 | Cross-border currency and FX presentation require legal, tax, accounting, finance, and payment-provider approval. | REQUIRES_APPROVAL | Finance/Payments Owner + Legal/Tax Reviewer | P00-13 / external review | docs/finance/funds-flow.md |
| REQ-FIN-046 | Every financial exception has an owner, reconciliation path, and closure evidence. | PROPOSED | Finance/Payments Owner + Operations Lead | P00-13 / P00-15 | docs/finance/funds-flow.md |
| REQ-FIN-017 | Funding source selection is explicit and no silent fallback between patient, sponsor, family, employer, or HMO sources is allowed. | APPROVED | Finance/Payments Owner + Product Owner | P00-13 | Locked financial rule and docs/finance/funds-flow.md |
| REQ-FIN-018 | Split payment requires per-source authorization and every required allocation secured before the order is considered funded. | PROPOSED | Finance/Payments Owner | P00-13 | docs/finance/funds-flow.md |
| REQ-FIN-019 | Refunds use original-source allocation unless a specific approved exception exists. | APPROVED | Finance/Payments Owner + Legal Counsel | P00-13 | Locked financial rule and docs/finance/refund-and-dispute-policy.md |
| REQ-FIN-020 | Split refunds follow the original funding allocation or an approved line-specific method. | REQUIRES_APPROVAL | Finance/Payments Owner + Legal Counsel | P00-13 / external review | docs/finance/refund-and-dispute-policy.md |
| REQ-FIN-021 | Stock reservation or approved firm confirmation precedes payment capture for pharmacy orders. | APPROVED | Pharmacy Operations + Finance/Payments Owner | P00-13 | Locked financial rule and docs/finance/funds-flow.md |
| REQ-FIN-022 | Capture requires a valid reservation, lab hold, or approved operational acceptance dependency for provider-specific orders. | PROPOSED | Finance/Payments Owner + Pharmacy/Lab Operations | P00-13 | docs/finance/payment-state-model.md |
| REQ-FIN-023 | Provider payables are milestone based and require contract, finance, accounting, and operations approval. | REQUIRES_APPROVAL | Finance/Payments Owner + Provider Operations | P00-13 / external review | docs/finance/provider-settlement-policy.md |
| REQ-FIN-024 | Provider payout is distinct from provider payable. | PROPOSED | Finance/Payments Owner | P00-13 | docs/finance/provider-settlement-policy.md |
| REQ-FIN-025 | Payout destination changes require enhanced verification, notification, audit, and fraud review. | PROPOSED | Finance/Payments Owner + Security Lead | P00-13 / P00-14 | docs/finance/provider-settlement-policy.md |
| REQ-FIN-026 | Reconciliation exceptions block sensitive financial conclusions and disclosure-affecting facts until resolved. | PROPOSED | Finance/Payments Owner + Security Lead | P00-13 | docs/finance/payment-state-model.md |
| REQ-FIN-027 | Claims, remittance, provider payable, and payout are distinct. | PROPOSED | Finance/Payments Owner + HMO/Employer Operations | P00-13 | docs/finance/claims-and-remittance-boundary.md |
| REQ-FIN-028 | Eligibility does not equal payment. | APPROVED | Finance/Payments Owner + Legal Counsel | P00-13 | docs/finance/claims-and-remittance-boundary.md |
| REQ-FIN-029 | Prior authorization does not automatically equal payment. | APPROVED | Finance/Payments Owner + Legal Counsel | P00-13 | docs/finance/claims-and-remittance-boundary.md |
| REQ-FIN-030 | NelyoHealth does not assume insurance risk without explicit legal, commercial, and regulatory approval. | APPROVED | Legal Counsel + Finance/Payments Owner | P00-13 | P00-12 obligations and docs/finance/claims-and-remittance-boundary.md |
| REQ-FIN-031 | OrderFundingSecured is the proposed finance event/fact for disclosure-policy input. | PROPOSED | Finance/Payments Owner + Security Lead + Architecture Lead | P00-13 / P00-17 | docs/finance/payment-state-model.md |

## P00-14 non-functional requirements and browser-validation decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-NFR-001 | Non-functional requirements must be measurable and traceable to future verification evidence. | PROPOSED | Architecture + QA | P00-14 | docs/testing/test-strategy.md |
| REQ-NFR-002 | Numeric availability, latency, throughput, RTO, RPO, retention, retry, timeout, and performance targets require explicit approval before implementation commitments. | REQUIRES_APPROVAL | Architecture + Operations + Product | P00-14 / P00-15 | docs/non-functional/performance-requirements.md |
| REQ-NFR-003 | Privileged access requires stronger controls including MFA or an approved equivalent control before implementation. | REQUIRES_APPROVAL | Security | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-004 | Access control defaults to least privilege and deny-by-default unless an explicit authorization grant applies. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-005 | Patient, actor, order, and tenant isolation are required for all sensitive workflows. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-006 | No universal administrative role may bypass clinical, financial, tenant, or provider-disclosure controls by default. | PROPOSED | Security | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-007 | Sensitive data requires encryption in transit and at rest using approved mechanisms. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-008 | Secrets require managed storage, rotation, least privilege, and no repository exposure. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-009 | Sessions and device trust require secure lifecycle controls and revocation behavior. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-010 | Uploads require type, size, malware, metadata, storage, and access controls before clinical use. | PROPOSED | Security + Operations | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-011 | Logs and telemetry must be PHI-safe and must not receive protected provider details before payment. | APPROVED | Source docs + Security + Privacy | P00-14 | docs/testing/privacy-boundary-tests.md |
| REQ-NFR-012 | Webhooks and external callbacks require signature verification, replay protection, idempotency, and auditability. | PROPOSED | Security + Architecture | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-013 | Dependency, secret, and vulnerability scanning are required before production release. | PROPOSED | Security + Engineering | P00-14 / Phase 1 | docs/non-functional/security-requirements.md |
| REQ-NFR-014 | Backup and restore verification requires approved recovery objectives before implementation commitments. | REQUIRES_APPROVAL | Operations + Architecture | P00-14 / P00-15 | docs/non-functional/reliability-requirements.md |
| REQ-NFR-015 | Clinical drafts must not be lost silently during browser, network, upload, or dependency failures. | APPROVED | Source docs + Clinical Safety | P00-14 | docs/non-functional/reliability-requirements.md |
| REQ-NFR-016 | User-facing services must degrade safely when dependencies fail. | PROPOSED | Operations + Architecture | P00-14 / Phase 1 | docs/non-functional/reliability-requirements.md |
| REQ-NFR-017 | Emergency paths must degrade safely and must not be blocked by ordinary marketplace, payment, or registration workflows. | APPROVED | Source docs + Clinical Safety | P00-14 | docs/non-functional/reliability-requirements.md |
| REQ-NFR-018 | WCAG 2.2 AA is the target for user-facing accessibility, subject to formal accessibility review and approval. | REQUIRES_APPROVAL | Accessibility + Product | P00-14 / P00-17 | docs/non-functional/accessibility-requirements.md |
| REQ-NFR-019 | Accessibility evidence requires automated checks and manual review; automation alone is not conformance. | PROPOSED | Accessibility + QA | P00-14 / P00-17 | docs/non-functional/accessibility-requirements.md |
| REQ-NFR-020 | Keyboard navigation and focus behavior require explicit browser validation. | APPROVED | Source docs + Accessibility | P00-14 | docs/non-functional/accessibility-requirements.md |
| REQ-NFR-021 | Screen-reader and semantic behavior require manual and automated evidence. | PROPOSED | Accessibility + QA | P00-14 / P00-17 | docs/non-functional/accessibility-requirements.md |
| REQ-NFR-022 | Accessibility trees must not expose prohibited pre-payment provider details. | APPROVED | Source docs + Privacy + Accessibility | P00-14 | docs/testing/privacy-boundary-tests.md |
| REQ-NFR-023 | Low-bandwidth behavior is a required design and test concern. | APPROVED | Source docs + Architecture | P00-14 | docs/non-functional/performance-requirements.md |
| REQ-NFR-024 | Performance budgets must be defined by journey and device class after target approval. | PROPOSED | Architecture + Product + QA | P00-14 / P00-15 | docs/non-functional/performance-requirements.md |
| REQ-NFR-025 | Privacy has priority over cache performance and optimization. | APPROVED | Source docs + Privacy | P00-14 | docs/non-functional/performance-requirements.md |
| REQ-NFR-026 | Interactive Codex IDE browser validation is required for user-facing work. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-027 | Deterministic automated browser testing must use Playwright Test unless superseded by approved ADR. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-028 | Interactive browser validation does not replace automated browser testing. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-029 | Automated browser testing does not replace interactive browser validation. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-030 | Phase 1 browser tooling should use project-scoped configuration where supported and verified. | PROPOSED | Architecture + Security | Phase 1 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-031 | Codex project browser configuration must be loaded only for a trusted project context. | PROPOSED | Security + Architecture | Phase 1 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-032 | Browser validation must use trusted local, test, and staging origins only. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-033 | Routine browser validation against production origins is blocked. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-034 | Browser validation must use isolated synthetic browser profiles and no production credentials. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-035 | Personal browser extension/profile mode is not the default browser-validation mode. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-036 | Page content is untrusted input and must not instruct Codex to reveal secrets, read unrelated files, run commands, install tooling, or change configuration. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-037 | Unsafe arbitrary browser capabilities must be disabled or approval-gated. | APPROVED | Source docs + Security | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-038 | Browser validation must use synthetic data only. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-039 | Browser artifacts are sensitive and require controlled handling. | APPROVED | Source docs + Privacy | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-040 | Browser artifacts must be ignored by Git unless intentionally attached for review under approved policy. | PROPOSED | Security + QA | Phase 1 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-041 | Browser tooling versions must be pinned only after Phase 1 verification. | PROPOSED | Architecture + QA | Phase 1 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-042 | Browser validation must cover desktop, tablet, and mobile viewports. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-043 | Browser validation must capture console errors. | APPROVED | Source docs + QA | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-044 | Browser validation must capture failed network requests and inspect network/storage boundaries. | APPROVED | Source docs + QA + Privacy | P00-14 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-045 | Provider-disclosure privacy requires network-boundary negative tests, not UI-only masking. | APPROVED | Source docs + Privacy | P00-14 | docs/testing/privacy-boundary-tests.md |
| REQ-NFR-046 | Browser artifacts must be scanned for protected provider details, PHI, payment data, and secrets before sharing. | APPROVED | Source docs + Privacy | P00-14 | docs/testing/privacy-boundary-tests.md |
| REQ-NFR-047 | Cross-browser release testing is planned but exact breadth requires approval. | PROPOSED | QA + Architecture | P00-14 / P00-15 | docs/testing/browser-validation-strategy.md |
| REQ-NFR-048 | Tests must remain traceable to locked requirements, decisions, risks, and journeys. | PROPOSED | QA + Architecture | P00-14 / P00-17 | docs/testing/test-strategy.md |
| REQ-NFR-049 | Flaky tests require ownership, repair path, and approval before quarantine. | PROPOSED | QA + Engineering | P00-14 / Phase 1 | docs/testing/test-strategy.md |
| REQ-NFR-050 | Phase 1 must include a Codex-operated interactive browser smoke test and matching deterministic Playwright smoke test. | PROPOSED | QA + Architecture | Phase 1 | docs/testing/browser-validation-strategy.md |

## P00-14 revision design, motion, UI UX Pro Max, and content decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-NFR-051 | Visual quality is a release requirement for major user-facing surfaces. | REQUIRES_APPROVAL | Product Owner + Design Owner | P00-14 / P00-14A | docs/design/experience-quality-requirements.md |
| REQ-NFR-052 | All portals and dashboards must use one coherent design language. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14 / P00-14A | docs/design/experience-quality-requirements.md |
| REQ-NFR-053 | Design tokens are the canonical source for visual system values after P00-14A approval. | REQUIRES_APPROVAL | Design Owner + Architecture Owner | P00-14A | docs/adr/ADR-0004-design-motion-and-content-governance.md |
| REQ-NFR-054 | Arbitrary visual values require review and must not become the default implementation pattern. | REQUIRES_APPROVAL | Design Owner + Frontend Owner | P00-14A / Phase 1 | docs/design/experience-quality-requirements.md |
| REQ-NFR-055 | Every major UI state must be intentionally designed. | REQUIRES_APPROVAL | Design Owner + QA Owner | P00-14A / Phase 1 | docs/design/experience-quality-requirements.md |
| REQ-NFR-056 | Motion for React is the planned motion library. | REQUIRES_APPROVAL | Architecture Owner + Design Owner | P00-14 / Phase 1 | docs/design/motion-requirements.md |
| REQ-NFR-057 | Motion behavior must use centralized motion tokens after P00-14A defines them. | REQUIRES_APPROVAL | Design Owner + Architecture Owner | P00-14A / Phase 1 | docs/design/motion-requirements.md |
| REQ-NFR-058 | Motion must respect reduced-motion preferences. | REQUIRES_APPROVAL | Accessibility Reviewer + Design Owner | P00-14 / Phase 1 | docs/design/motion-requirements.md |
| REQ-NFR-059 | Motion cannot delay safety, urgent, or emergency actions. | APPROVED | Source docs + Clinical Safety Owner | P00-14 | docs/design/motion-requirements.md |
| REQ-NFR-060 | Motion cannot communicate required information by itself. | REQUIRES_APPROVAL | Accessibility Reviewer + Content Owner | P00-14 / Phase 1 | docs/design/motion-requirements.md |
| REQ-NFR-061 | UI UX Pro Max is an advisory third-party design skill, not an authority. | REQUIRES_APPROVAL | Design Owner + Security Owner | P00-14 | docs/design/ui-ux-pro-max-governance.md |
| REQ-NFR-062 | UI UX Pro Max requires reviewed project-local installation before use. | REQUIRES_APPROVAL | Security Owner + Architecture Owner | Phase 1 | docs/design/ui-ux-pro-max-governance.md |
| REQ-NFR-063 | UI UX Pro Max version or commit must be pinned before use. | REQUIRES_APPROVAL | Security Owner | Phase 1 | docs/design/ui-ux-pro-max-governance.md |
| REQ-NFR-064 | UI UX Pro Max requires pre-implementation design pass and post-implementation browser review pass. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | docs/design/ui-ux-pro-max-governance.md |
| REQ-NFR-065 | Skill output cannot approve clinical, legal, privacy, accessibility, regulatory, or financial copy. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14 / Phase 1 | docs/design/ui-ux-pro-max-governance.md |
| REQ-NFR-066 | Every page must have a stable Page ID and page contract. | REQUIRES_APPROVAL | Content Owner + Product Owner | P00-14A / Phase 1 | docs/content/content-alignment-requirements.md |
| REQ-NFR-067 | Every governed section must have a stable Section ID and section contract. | REQUIRES_APPROVAL | Content Owner + Design Owner | P00-14A / Phase 1 | docs/content/content-alignment-requirements.md |
| REQ-NFR-068 | Every CTA must declare its actual action and required authorization. | REQUIRES_APPROVAL | Product Owner + Content Owner | P00-14A / Phase 1 | docs/content/content-alignment-requirements.md |
| REQ-NFR-069 | Content classes must have explicit approval owners. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A | docs/content/content-alignment-requirements.md |
| REQ-NFR-070 | Only approved content may ship. | REQUIRES_APPROVAL | Content Owner + Product Owner | Phase 1 | docs/content/content-alignment-requirements.md |
| REQ-NFR-071 | State-specific content is required for major sections. | REQUIRES_APPROVAL | Content Owner + QA Owner | P00-14A / Phase 1 | docs/content/content-alignment-requirements.md |
| REQ-NFR-072 | Role, patient, and tenant content must be isolated. | APPROVED | Source docs + Privacy Owner | P00-14 | docs/content/content-alignment-requirements.md |
| REQ-NFR-073 | Content-to-component alignment must be automatically validated before release. | REQUIRES_APPROVAL | QA Owner + Content Owner | Phase 1 | docs/testing/design-content-validation-strategy.md |
| REQ-NFR-074 | Major pages require real-browser visual review. | REQUIRES_APPROVAL | Design Owner + QA Owner | Phase 1 | docs/testing/design-content-validation-strategy.md |
| REQ-NFR-075 | Reduced-motion behavior must be tested. | REQUIRES_APPROVAL | Accessibility Reviewer + QA Owner | Phase 1 | docs/testing/design-content-validation-strategy.md |
| REQ-NFR-076 | Visual tests do not replace human design review. | REQUIRES_APPROVAL | Design Owner + QA Owner | Phase 1 | docs/testing/design-content-validation-strategy.md |
| REQ-NFR-077 | Human review does not replace automated validation. | REQUIRES_APPROVAL | QA Owner + Design Owner | Phase 1 | docs/testing/design-content-validation-strategy.md |
| REQ-NFR-078 | P00-14A must complete and be accepted before P00-15 begins. | REQUIRES_APPROVAL | External Orchestration + Execution Lead | P00-14 | docs/exec-plans/P00-product-clinical-regulatory-foundation.md |

## P00-14A design and content decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-DES-001 | One visual system across portals. | APPROVED | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-002 | Proposed experience character. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-003 | Selected proposed visual direction VIS-DIR-002 Warm Care Grid. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-004 | Semantic design tokens. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-005 | Accessible color-pair validation. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-006 | Proposed typography and licensing review. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-007 | Responsive mobile-first layout. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-008 | Complete page-state design. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-009 | Role-appropriate dashboard density. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-010 | Domain-specific component library. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-011 | Explicit responsive content priority. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-012 | No generic template acceptance. | APPROVED | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-013 | Motion for React direction. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-014 | Central motion tokens. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-015 | Motion profiles. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-016 | Reduced-motion alternatives. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-017 | Immediate emergency presentation. | APPROVED | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-018 | Protected data removed before exit animation. | APPROVED | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-019 | Human design review. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-DES-020 | Controlled visual-regression baselines. | REQUIRES_APPROVAL | Design Owner + Product Owner | P00-14A / Phase 1 | P00-14A design artifacts |
| REQ-CNT-001 | Stable page and section IDs. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-002 | Page contracts. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-003 | Section contracts. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-004 | Content-to-component contracts. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-005 | CTA action contracts. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-006 | Content classes and approval owners. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-007 | Approved-content-only release rule. | APPROVED | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-008 | State-specific content. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-009 | Clinical content governance. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-010 | Emergency content governance. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-011 | Financial content governance. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-012 | Provider-disclosure content governance. | APPROVED | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-013 | Role patient and tenant content isolation. | APPROVED | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-014 | Content versioning. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-015 | Superseded-content removal. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-016 | Public website claim controls. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-017 | Repository-based content registry recommendation. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-018 | Browser design and content review. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-019 | UI UX Pro Max two-pass use. | REQUIRES_APPROVAL | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |
| REQ-CNT-020 | UI UX Pro Max remains advisory. | APPROVED | Content Owner + Domain Owners | P00-14A / Phase 1 | P00-14A content artifacts |

## P00-15 operational metric, queue, analytics, and pilot-gate decisions

| Decision ID | Decision | Status | Source | Owner | Approval impact |
|---|---|---|---|---|---|
| REQ-OPS-001 | Closed-loop metrics take precedence over vanity metrics | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-002 | Every metric has a versioned formula | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-003 | Every metric has an authoritative source | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-004 | Analytics events do not override authoritative workflow state | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-005 | Metrics do not authorize sensitive actions | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-006 | Safety metrics override growth metrics | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-007 | Clinical activity is not optimized for platform revenue | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-008 | Every critical queue has an owner | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-009 | Every queue item exposes age and next action | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-010 | No ownerless queue is allowed | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-011 | No routine database editing is permitted | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-012 | SLOs remain proposed until approved | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-013 | SLAs are separate contractual commitments | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-014 | Safety and privacy guardrails are not ordinary error budgets | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-015 | Pilot continuation and expansion are separate decisions | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-016 | Pilot stop conditions are explicit | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-017 | Pilot resumption requires evidence and approval | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-018 | Analytics is downstream and non-authoritative | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-019 | Analytics uses minimum-necessary data | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-020 | Employer and HMO analytics are aggregate and minimized | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-021 | Small-cell and re-identification controls require approval | REQUIRES_APPROVAL | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-022 | Provider location is prohibited from pre-payment analytics | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-023 | Browser analytics cannot authorize payment or disclosure | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-024 | Product analytics cannot contain raw clinical records | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-025 | Clinical-quality analytics is separately restricted | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-026 | Synthetic data is used outside production | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-027 | Analytics events require versioning and data lineage | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-028 | Data-quality status accompanies important metrics | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-029 | Operational dashboards are role-specific | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-030 | Operational dashboards do not create clinical access | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-031 | Emergency and critical-result queues have priority | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-032 | Queue ageing is visible | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-033 | Queue response targets require approval | REQUIRES_APPROVAL | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-034 | On-call and escalation ownership is required | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-035 | Design, content, and accessibility quality are pilot readiness criteria | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-036 | Browser release-gate results are operational readiness evidence | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-037 | Unapproved content blocks release where safety, privacy, finance, or law is affected | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-038 | CTA action mismatches are operational defects | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-039 | Provider-disclosure privacy failures can stop or pause the pilot | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-040 | No critical workflow may depend on engineering or database intervention | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-041 | Metrics require future automated validation | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-042 | Metric dashboards require accessibility review | APPROVED | P00-15 / P00-18 | Operations owner with domain approvers | Direct restatement of accepted locked or operational rule. |
| REQ-OPS-043 | Metric exports require privacy review | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-044 | Pilot expansion requires evidence, not calendar progress | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |
| REQ-OPS-045 | Stop-condition decisions require audit and communication | PROPOSED | P00-15 / P00-18 | Operations owner with domain approvers | Operational proposal or approval-controlled threshold/policy; external approval required before production reliance. |

## P00-16 risk, dependency, assumption, and ADR decisions

| Decision ID | Decision | Status | Source | Owner | Approval impact |
|---|---|---|---|---|---|
| REQ-RSK-001 | Risk scoring uses a qualitative ordinal model | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-002 | Risk scores are prioritization aids, not statistical forecasts | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-003 | Inherent and residual risk are tracked separately | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-004 | Every material risk has a primary owner | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-005 | Every material risk has a backup or escalation authority | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-006 | Every material risk has an early-warning signal | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-007 | Every material risk has mitigation and contingency | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-008 | Every material risk has a review trigger | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-009 | Risk acceptance requires authorized human approval | REQUIRES_APPROVAL | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-010 | Codex cannot accept risk | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-011 | Top-ten risks are ranked from the register | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-012 | Launch blockers are explicit | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-013 | Capability blockers and expansion blockers are distinct | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-014 | Dependencies have owners and required evidence | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-015 | Internal, human, regulatory, provider, vendor, and contract dependencies are distinct | REQUIRES_APPROVAL | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-016 | Phase 1 and pilot-launch critical paths are separate | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-017 | Assumptions require evidence and validation ownership | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-018 | Architecture-changing assumptions are identified | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-019 | Locked requirements are not assumptions | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-020 | ADRs are the canonical architecture-decision record | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-021 | ADR history is preserved | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-022 | ADR supersession is explicit | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-023 | Modular monolith is the initial architecture | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-024 | One Person and one longitudinal Patient identity | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-025 | Payer and clinical-access authority remain separate | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-026 | Finalized clinical records use amendments or versions | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-027 | Video-platform selection remains deferred | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-028 | Production PHI is excluded from general product analytics and session replay | APPROVED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-029 | OrderFundingSecured is proposed and separate from disclosure authorization | REQUIRES_APPROVAL | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-030 | Vendor and tool selection requires due diligence | REQUIRES_APPROVAL | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-031 | UI UX Pro Max requires supply-chain review | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-032 | Motion and browser tooling require version pinning | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-033 | Regulatory conflicts create launch gates | REQUIRES_APPROVAL | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-034 | Risk links to metrics, queues, stop conditions, and tests | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |
| REQ-RSK-035 | P00-17 must review all critical and high residual risks | PROPOSED | P00-16 / P00-19 | Governance owner with domain approvers | Direct locked-rule restatement if APPROVED; otherwise requires external approval before production reliance. |

## P00-17 gate-governance decisions

| Decision ID | Decision | Status | Source | Owner | Approval impact |
|---|---|---|---|---|---|
| REQ-GATE-001 | Phase 0 uses separate documentation, Phase 1, and pilot gates | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-002 | Missing pilot approvals do not automatically block repository foundation work | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-003 | Phase 1 work is restricted by capability blockers | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-004 | Pilot launch requires explicit external approvals | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-005 | Every locked requirement requires detailed traceability | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-006 | Every requirement family requires coverage evidence | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-007 | No external approval may be inferred from Codex completion | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-008 | Deterministic governance defects may be corrected during P00-17 | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-009 | Substantive policy conflicts remain externally decided | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-010 | Phase 1 may not use real patient or provider data | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-011 | Phase 1 browser tooling uses synthetic data | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-012 | Blocked capabilities may receive abstractions but not live operation | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-013 | Phase 1 and pilot readiness remain separate | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-014 | Gate verdicts require evidence and conditions | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |
| REQ-GATE-015 | Phase 0 completion report is the canonical handoff summary | APPROVED | P00-17 / P00-20 | Phase 0 governance owner | Explicit P00-17 governance rule; external orchestration acceptance still required for gate adoption. |


## P01-FND-001 implementation decisions

| Decision ID | Decision | Status | Evidence | Owner | Review trigger |
|---|---|---|---|---|
| REQ-FND-001 | Use Node.js 24.18.0 as the repository runtime pin. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | .node-version, package.json, CI. | Architecture owner | Node LTS change or tool incompatibility. |
| REQ-FND-002 | Use pnpm 11.9.0 with pnpm workspaces. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | packageManager, engines, pnpm-lock.yaml, pnpm-workspace.yaml. | Architecture owner | Package-manager upgrade. |
| REQ-FND-003 | Use Turborepo 2.10.0 for task orchestration only. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | turbo.json and build validation. | Architecture owner | New workspace package or task class. |
| REQ-FND-004 | Use strict TypeScript with no product domain implementation. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | tsconfig.base.json and typecheck. | Engineering owner | App framework or domain package creation. |
| REQ-FND-005 | Use ESLint flat config and Prettier for foundation quality checks. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | eslint.config.mjs and format/lint validation. | Engineering owner | Rule or formatter upgrade. |
| REQ-FND-006 | Use Vitest for foundation unit/integration tests. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | Unit and integration test validation. | QA owner | Test runner replacement. |
| REQ-FND-007 | Use Playwright Test 1.61.1 with Chromium desktop/tablet/mobile projects for deterministic browser smoke. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | test:e2e and test:browser pass. | QA / Architecture owner | Browser matrix expansion. |
| REQ-FND-008 | Use @axe-core/playwright 4.12.1 for accessibility smoke checks. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | test:a11y pass. | Accessibility / QA owner | Accessibility tooling upgrade. |
| REQ-FND-009 | Configure @playwright/mcp 0.0.76 project-scoped for Codex IDE browser integration. | PARTIAL-BLOCKED-PENDING-RUNTIME-VERIFICATION | .codex/config.toml exists; current session node_repl browser-control call failed with sandboxPolicy metadata error. | Architecture / Security owner | Codex IDE reload, MCP compatibility correction, or Playwright MCP upgrade. |
| REQ-FND-010 | Keep Motion and UI UX Pro Max deferred. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | No Motion or UI UX Pro Max dependencies installed. | Design / Architecture owner | P01-FND-002 or later design-foundation task. |
| REQ-FND-011 | Do not create AGENTS.md, .agent/PLANS.md, or .agents/skills in this task. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | Forbidden-path validation. | External orchestration | Future explicit orchestration change. |
| REQ-FND-012 | Do not select an application framework in P01-FND-001. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | No Next.js, NestJS, React, app shell, API, database, auth, payment, or provider dependency installed. | Architecture owner | Application-shell task. |
| REQ-FND-013 | Use `@playwright/cli@0.1.14` as the temporary interactive Codex IDE terminal browser fallback while Playwright MCP remains upstream blocked. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | package.json, pnpm-lock.yaml, browser CLI validation sequence, docs/engineering/browser-cli-fallback.md. | Architecture / QA / Security owner | Relevant Codex app, IDE, browser plugin, bundled CLI, Playwright CLI, or Playwright MCP update. |
| REQ-FND-014 | Keep Playwright MCP configured but not operationally approved until project-scoped MCP smoke verification succeeds. | NONBLOCKING-TRACKED | `.codex/config.toml` preserved; `BLK-P01-FND-001` remains open for MCP path. | Architecture / Security owner | Codex/browser bridge compatibility correction or Playwright MCP update. |
| REQ-FND-015 | Restrict the CLI fallback to named synthetic local sessions and trusted local/test/staging origins only. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | `browser:cli:*` scripts use `nelyohealth-smoke` and `http://127.0.0.1:4173`; validation used synthetic smoke page only. | Security / QA owner | Any origin, data, browser mode, or artifact-policy change. |
| REQ-FND-016 | Browser CLI artifacts must remain ignored and must be inspected for secrets, production data, personal cookies, auth state, and real patient/provider/clinical/financial data before sharing. | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | `.gitignore`, docs/engineering/browser-cli-fallback.md, artifact scan. | Security / Privacy / QA owner | Artifact retention or evidence-sharing process change. |


## P01-FND-002 foundation decisions - 2026-06-25T03:29:17.292Z
- Decision: Use React 19.2.7, React DOM 19.2.7, Motion 12.41.0, Vite 8.1.0, @vitejs/plugin-react 6.0.3, Zod 4.4.3, @testing-library/react 16.3.2, and jsdom 29.1.1 for the foundation layer.
- Status: Accepted for P01-FND-002 implementation; production adoption remains subject to later architecture review.
- Decision: Vendor UI UX Pro Max v2.6.5 as a governed advisory subset only.
- Status: Accepted with license-review condition.

## P01-FND-003 decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P01-FND-003-001 | Use @changesets/cli 2.31.0 as the exact local Changesets dependency. | APPROVED-FOR-FOUNDATION | Engineering/architecture owner | npm registry metadata checked 2026-06-25; package.json |
| DEC-P01-FND-003-002 | Keep release readiness read-only with no publish, tag, deploy, or production release command. | APPROVED-FOR-FOUNDATION | Engineering/release owner | .github/workflows/release-readiness.yml; tools/checks/release-readiness.mjs |
| DEC-P01-FND-003-003 | Use @deftstrokes86 as CODEOWNERS default because the personal GitHub remote owner is evidenced locally. | APPROVED-FOR-FOUNDATION | Repository owner | git remote origin URL |
| DEC-P01-FND-003-004 | Do not add Dependency Review as a required workflow until GitHub support is verified. | PENDING-ADMIN-VERIFICATION | Repository administrator/security owner | gh unavailable locally; .github/dependency-review-config.yml prepared |
| DEC-P01-FND-003-005 | Treat UI UX Pro Max as separately governed advisory-only material pending external license/commercial review. | REQUIRES-EXTERNAL-REVIEW | Legal/commercial owner | THIRD_PARTY_NOTICES.md; tools/vendor/ui-ux-pro-max/UPSTREAM.json |

## P01-FND-003 expanded governance decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P01-FND-003-006 | Contribution standards are repository-controlled through CONTRIBUTING.md. | APPROVED-FOR-FOUNDATION | Repository owner | CONTRIBUTING.md |
| DEC-P01-FND-003-007 | Pull requests require cross-domain impact review. | APPROVED-FOR-FOUNDATION | Repository owner | .github/pull_request_template.md |
| DEC-P01-FND-003-008 | Issues and PR artifacts must not include real sensitive data. | APPROVED-FOR-FOUNDATION | Privacy/security owner | Issue forms and PR template |
| DEC-P01-FND-003-009 | Security reports use private channels; public vulnerability issues are not supported. | APPROVED-FOR-FOUNDATION | Security owner | SECURITY.md |
| DEC-P01-FND-003-010 | CODEOWNERS requires verified GitHub identities. | APPROVED-FOR-FOUNDATION | Repository administrator | .github/CODEOWNERS; git remote evidence |
| DEC-P01-FND-003-011 | Repository settings are not inferred from files. | APPROVED-FOR-FOUNDATION | Repository administrator | github-repository-controls.md |
| DEC-P01-FND-003-012 | External dependencies use exact versions. | APPROVED-FOR-FOUNDATION | Engineering/security owner | package-policy.mjs; dependency-policy.json |
| DEC-P01-FND-003-013 | Unpinned Git dependencies are prohibited. | APPROVED-FOR-FOUNDATION | Engineering/security owner | package-policy.mjs |
| DEC-P01-FND-003-014 | GitHub Actions require immutable SHA pinning. | APPROVED-FOR-FOUNDATION | Security/CI owner | github-actions-pinning.mjs |
| DEC-P01-FND-003-015 | Dependabot does not auto-merge. | APPROVED-FOR-FOUNDATION | Repository administrator | .github/dependabot.yml |
| DEC-P01-FND-003-016 | Dependency changes require human review. | APPROVED-FOR-FOUNDATION | Engineering/security owner | CONTRIBUTING.md; dependency-governance.md |
| DEC-P01-FND-003-017 | Unknown or ambiguous licences require review. | APPROVED-FOR-FOUNDATION | Legal/commercial owner | dependency-policy.json; dependency-license-policy.mjs |
| DEC-P01-FND-003-018 | Vendored code requires source, licence, commit, and integrity evidence. | APPROVED-FOR-FOUNDATION | Engineering/legal owner | tools/vendor/ui-ux-pro-max/UPSTREAM.json |
| DEC-P01-FND-003-019 | UI UX Pro Max public redistribution is blocked pending licence review. | REQUIRES-EXTERNAL-REVIEW | Legal/commercial owner | THIRD_PARTY_NOTICES.md |
| DEC-P01-FND-003-020 | Changesets governs private package versions and changelogs. | APPROVED-FOR-FOUNDATION | Release owner | .changeset/config.json |
| DEC-P01-FND-003-021 | Private package tags are not automatic. | APPROVED-FOR-FOUNDATION | Release owner | .changeset/config.json |
| DEC-P01-FND-003-022 | No package publishing is enabled. | APPROVED-FOR-FOUNDATION | Release owner | package.json; workflows |
| DEC-P01-FND-003-023 | Release readiness is separate from release authorization. | APPROVED-FOR-FOUNDATION | Release owner | versioning-and-release.md |
| DEC-P01-FND-003-024 | Releases require human approval. | APPROVED-FOR-FOUNDATION | Release owner | GOVERNANCE.md |
| DEC-P01-FND-003-025 | Phase 1 and Phase 2 gates are separate. | APPROVED-FOR-FOUNDATION | Execution owner | phase-1-gate-review.md |
| DEC-P01-FND-003-026 | Phase 2 and pilot readiness are separate. | APPROVED-FOR-FOUNDATION | Execution owner | phase-2-readiness-handoff.md |

## P01-FND-004 decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P01-FND-004-001 | `AGENTS.md` files are repository guidance, not autonomous-agent orchestration. | APPROVED-FOR-FOUNDATION | Repository owner | AGENTS.md; phase-1-map-amendments.md |
| DEC-P01-FND-004-002 | Nested `AGENTS.md` files provide directory-specific rules without creating subagents, teams, routing, or background execution. | APPROVED-FOR-FOUNDATION | Repository owner | docs/AGENTS.md; packages/AGENTS.md; tests/AGENTS.md; tools/AGENTS.md; .github/AGENTS.md; infra/AGENTS.md |
| DEC-P01-FND-004-003 | `.agent/PLANS.md` is an execution-plan convention, not an autonomous-agent configuration. | APPROVED-FOR-FOUNDATION | Execution owner | .agent/PLANS.md |
| DEC-P01-FND-004-004 | Repository browser validation is represented as a Codex Skill, not an autonomous agent. | APPROVED-FOR-FOUNDATION | QA/security owner | .agents/skills/nelyo-browser-validation/SKILL.md |
| DEC-P01-FND-004-005 | Repository-changing Git and GitHub writes remain human-only; owner-requested workflow dispatch and rerun are allowed for controlled evidence runs. | LOCKED-WITH-WORKFLOW-DISPATCH-EXCEPTION | Repository owner | AGENTS.md; manual-git-and-github-workflow.md; manual-git.rules |
| DEC-P01-FND-004-006 | Codex may inspect Git state and may execute owner-requested workflow dispatch/rerun operations, but must not mutate Git history, repository settings, releases, tags, pull requests, deployments, or package publication. | LOCKED-WITH-WORKFLOW-DISPATCH-EXCEPTION | Repository owner | AGENTS.md; CONTRIBUTING.md; GOVERNANCE.md |
| DEC-P01-FND-004-007 | No automated PR, merge, tag, release, package publication, or deployment path is introduced in Phase 1. | APPROVED-FOR-FOUNDATION | Release owner | package.json; workflows; manual-git-and-github-workflow.md |
| DEC-P01-FND-004-008 | The founder-owned personal GitHub repository is accepted for the current founder-led stage. | APPROVED-FOR-FOUNDATION | Repository owner | phase-1-map-amendments.md; github-repository-controls.md |
| DEC-P01-FND-004-009 | GitHub organization creation is deferred until team growth, ownership transfer, production-governance needs, or managed permissions justify it. | APPROVED-FOR-FOUNDATION | Repository owner | phase-1-map-amendments.md |
| DEC-P01-FND-004-010 | Branch protection or rulesets are manually configured by the repository owner and must not be claimed active without evidence. | EXTERNAL-MANUAL-ACTION-PENDING | Repository administrator | github-manual-ruleset-checklist.md |
| DEC-P01-FND-004-011 | Required status checks block invalid merges but do not automate merging. | APPROVED-FOR-FOUNDATION | Repository administrator | github-manual-ruleset-checklist.md |
| DEC-P01-FND-004-012 | CODEOWNERS remains informative until an independent qualified reviewer exists; code-owner enforcement can be added then. | APPROVED-FOR-FOUNDATION | Repository administrator | github-repository-controls.md |
| DEC-P01-FND-004-013 | Project-scoped Playwright MCP is verified for local synthetic smoke with the existing `.codex/config.toml` configuration and no sandbox weakening. | APPROVED-FOR-FOUNDATION | Architecture/security owner | browser-tooling.md; P01-FND-004 MCP smoke |
| DEC-P01-FND-004-014 | Playwright CLI remains the verified interactive browser fallback while MCP is blocked. | APPROVED-FOR-FOUNDATION | QA/security owner | browser-cli-fallback.md; nelyo-browser-validation skill |
| DEC-P01-FND-004-015 | Visual testing is implemented for the synthetic foundation as a deterministic visual-contract suite, not final product design approval. | APPROVED-FOR-FOUNDATION | QA/design owner | tests/visual/design-foundation.visual.spec.ts; package.json |
| DEC-P01-FND-004-016 | Database command interfaces are present but phase-gated until Phase 2; they intentionally fail and create nothing in Phase 1. | APPROVED-FOR-FOUNDATION | Engineering owner | tools/checks/phase-gated-database-command.mjs; package.json |
| DEC-P01-FND-004-017 | Phase 1 map deviations are explicit amendments, not accidental omissions. | APPROVED-FOR-FOUNDATION | Execution owner | phase-1-map-amendments.md |

## P02-PLAN-001 planning decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-PLAN-001 | Phase 2 implementation is decomposed into exactly 18 ordered implementation issues P02-ISS-001 through P02-ISS-018. | ACCEPTED | Execution/platform owner | docs/engineering/phase-2-issue-backlog.md; P02-ISS-001 execution prompt |
| DEC-P02-PLAN-002 | Future application topology is `apps/api`, `apps/worker`, `apps/patient-web`, `apps/provider-web`, `apps/organization-web`, `apps/admin-web`, and `apps/mobile`. | ACCEPTED | Engineering/architecture owner | docs/engineering/phase-2-application-topology.md; P02-ISS-001 execution prompt |
| DEC-P02-PLAN-003 | Phase 2 keeps modular-monolith-first backend boundaries, REST, generated OpenAPI, and generated typed client as required conventions. | ACCEPTED | Engineering/architecture owner | ADR-0005; docs/governance/phase-2-requirements-traceability.md; P02-ISS-001 execution prompt |
| DEC-P02-PLAN-004 | Cloud provider and IaC tool are not selected in P02-PLAN-001; P02-ISS-016 must record human-reviewed provider/IaC approval before deployment implementation. | LOCKED-FOR-P02-PLAN-001 | Platform/release owner | docs/engineering/phase-2-technology-evaluation.md |
| DEC-P02-PLAN-005 | Redis, queue, object storage, observability, communications, feature flags, secrets, and error reporting must stay behind adapter boundaries. | ACCEPTED | Engineering/security owner | docs/engineering/phase-2-technology-evaluation.md; docs/engineering/phase-2-application-topology.md; P02-ISS-001 execution prompt |
| DEC-P02-PLAN-006 | Local, development, staging, production, and partner sandbox boundaries must prohibit production data copied downward. | LOCKED | Privacy/security/platform owners | docs/engineering/phase-2-environment-strategy.md |
| DEC-P02-PLAN-007 | Browser harness work must include per-app Chromium projects, synthetic auth states, reset/seed support, privacy assertions, console/network failure checks, and retained failure artifacts. | ACCEPTED | QA/security owner | docs/engineering/phase-2-browser-harness-plan.md; P02-ISS-001 execution prompt |

## P02-ISS-001 decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-001-001 | P02-ISS-001 is accepted as a docs/ADR/dependency-decision issue only; no package installation or runtime implementation is authorized by this issue. | ACCEPTED | Execution/platform owner | P02-ISS-002 execution prompt; docs/exec-plans/P02-ISS-001-phase-2-adr-and-dependency-decision-pack.md |
| DEC-P02-ISS-001-002 | Use NestJS 11, Next.js 16, Expo SDK 56/React Native 0.85.3, Nest OpenAPI, and openapi-typescript/openapi-fetch as the Phase 2 application framework and contract stack. | ACCEPTED-FOR-PHASE-2-FOUNDATION | Engineering/architecture owner | ADR-P02-001; docs/engineering/phase-2-dependency-decision-pack.md |
| DEC-P02-ISS-001-003 | Use PostgreSQL 18.4, PostGIS 3.6.4, Drizzle ORM, Drizzle Kit, and node-postgres for the Phase 2 database foundation. | ACCEPTED-FOR-PHASE-2-DATABASE-FOUNDATION | Platform/data owner | ADR-P02-002; docs/engineering/phase-2-dependency-decision-pack.md |
| DEC-P02-ISS-001-004 | Use a Valkey-compatible Redis protocol local service with BullMQ and ioredis behind adapters for Phase 2 queue/cache work; Redis OSS 8 production reliance remains legal/commercial-review required. | ACCEPTED-FOR-PHASE-2-LOCAL; PRODUCTION-REVIEW-REQUIRED | Engineering/security owner | ADR-P02-003; Redis and Valkey official source review |
| DEC-P02-ISS-001-005 | Use an S3-compatible object-storage port and AWS SDK v3 presigning packages behind adapters; local emulator selection remains legal/commercial-review required. | ACCEPTED-FOR-PORT-AND-SDK; LOCAL-EMULATOR-REVIEW-REQUIRED | Platform/data owner | ADR-P02-004; AWS SDK, LocalStack, and MinIO official source review |
| DEC-P02-ISS-001-006 | Prefer OpenTofu as the IaC candidate for P02-ISS-016, keep Pulumi as a candidate, and keep Terraform review-required; no cloud provider is selected. | PARTIAL-DECISION; HUMAN-CLOUD-DECISION-REQUIRED | Platform/release owner | ADR-P02-005; OpenTofu, Pulumi, and Terraform official source review |
| DEC-P02-ISS-001-007 | Use OpenTelemetry explicit instrumentation and Pino for Phase 2 observability boundaries; no hosted error-reporting vendor is selected. | ACCEPTED-FOR-PHASE-2-OBSERVABILITY-FOUNDATION | Engineering/security owner | ADR-P02-006; OpenTelemetry and npm metadata review |
| DEC-P02-ISS-001-008 | Use OpenFeature core/server/NestJS packages for future provider-neutral feature flag adapter shells. | ACCEPTED-FOR-PHASE-2-ADAPTER-SHELLS | Engineering/security owner | docs/engineering/phase-2-dependency-decision-pack.md; OpenFeature official docs |
| DEC-P02-ISS-001-009 | Use Testcontainers Node packages conditionally for isolated local dependency tests, subject to Docker runtime availability and emulator licensing for LocalStack. | ACCEPTED-CONDITIONAL-FOR-TESTING | QA/platform owner | docs/engineering/phase-2-dependency-decision-pack.md; Testcontainers official docs |

## P02-ISS-002 decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-002-001 | P02-ISS-002 creates the approved `apps/*` and shared package workspace topology as boundary-only private packages. | ACCEPTED | Execution/platform owner | P02-ISS-003 execution prompt; docs/exec-plans/P02-ISS-002-workspace-topology-and-package-boundaries.md; docs/engineering/phase-2-application-topology.md |
| DEC-P02-ISS-002-002 | P02-ISS-002 does not install framework/runtime dependencies; NestJS, Next.js, Expo, database, queue, storage, observability, and adapter dependencies remain assigned to later issues. | ACCEPTED-FOR-P02-ISS-002-SCOPE | Engineering/architecture owner | package.json; pnpm-lock.yaml; docs/engineering/phase-2-dependency-decision-pack.md |
| DEC-P02-ISS-002-003 | `apps/*` package manifests are now included in workspace and package-policy validation. | ACCEPTED | Engineering/security owner | P02-ISS-003 execution prompt; pnpm-workspace.yaml; tools/checks/package-policy.mjs; tests/unit/workspace-topology.spec.ts |
| DEC-P02-ISS-002-004 | New app/package boundary modules expose only topology metadata and must not be treated as runtime implementation evidence. | ACCEPTED | Engineering/architecture owner | P02-ISS-003 execution prompt; apps/*/src/index.ts; packages/api-client/src/index.ts; packages/config/src/index.ts; packages/domain/src/index.ts; packages/observability/src/index.ts; packages/platform-adapters/src/index.ts; packages/testing-factories/src/index.ts |
| DEC-P02-ISS-002-005 | P02-ISS-003 and later implementation issues remain not started after P02-ISS-002. | SUPERSEDED-BY-P02-ISS-003-AUTHORIZATION | Execution/platform owner | P02-ISS-003 execution prompt |

## P02-ISS-003 decisions - 2026-06-25

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-003-001 | Create a local-only Docker Compose harness under `infra/local/` for PostgreSQL/PostGIS, Valkey, Moto Server, and OpenTelemetry Collector Contrib. | IMPLEMENTED-STATIC; RUNTIME-EVIDENCE-BLOCKED | Platform/engineering owner | infra/local/compose.yaml; tools/local-infra/local-infra.mjs |
| DEC-P02-ISS-003-002 | Use exact tag and digest-pinned images for every local infrastructure service and reject floating image tags. | IMPLEMENTED-STATIC | Engineering/security owner | infra/local/compose.yaml; tests/unit/local-infrastructure-harness.spec.ts |
| DEC-P02-ISS-003-003 | Use Moto Server 5.2.2 as the local S3-compatible emulator because it is Apache-2.0 and avoids LocalStack auth-token uncertainty and MinIO AGPL/commercial posture for this local mock scope. | IMPLEMENTED-STATIC; PRODUCTION-PROVIDER-DEFERRED | Platform/data owner | docs/engineering/phase-2-local-infrastructure-harness.md; ADR-P02-004 remains authoritative for production/provider boundary |
| DEC-P02-ISS-003-004 | Keep Docker-dependent start/stop/health commands explicit and fail when Docker Compose is unavailable rather than weakening validation. | IMPLEMENTED | Engineering/QA owner | tools/local-infra/local-infra.mjs; tests/unit/local-infrastructure-harness.spec.ts |
| DEC-P02-ISS-003-005 | Add `infra:verify` to repository verification as a static local infrastructure check only; live container start/stop remains manual/runtime evidence. | IMPLEMENTED | Engineering/QA owner | package.json; docs/exec-plans/P02-ISS-003-local-infrastructure-harness.md |

## P02-ISS-016 decisions - 2026-06-30

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-016-001 | Record the provider-neutral deployment contract in the environment and deployment baseline while leaving cloud provider selection unresolved. | ACCEPTED; HUMAN-CLOUD-DECISION-PENDING | Platform/release owner | docs/engineering/environment-and-deployment-baseline.md; docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md |
| DEC-P02-ISS-016-002 | Keep OpenTofu preferred, Pulumi a candidate, and Terraform review-required until human approval exists for the actual IaC path. | ACCEPTED; HUMAN-DECISION-GATED | Platform/release owner | docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md; docs/engineering/phase-2-environment-strategy.md |
| DEC-P02-ISS-016-003 | Finalized human cloud/provider decision for Phase 2 foundation: Supabase is the required primary platform; Hostinger shared hosting is the selected web-hosting surface; API and worker runtime use Supabase Edge Functions plus scheduled jobs; signed URLs use Supabase Storage; Redis-compatible queue/cache uses managed Redis-compatible service; observability baseline is platform logs plus structured app logs; deployment/IaC execution is documented manual steps for current phase. | ACCEPTED-FOR-PHASE-2-FOUNDATION | Platform/release owner | docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md; docs/engineering/environment-and-deployment-baseline.md |

## P02-ISS-017 decisions - 2026-06-30

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-017-001 | Record the deployment workflow as human-merge-to-development followed by versioned staging promotion. | PARTIAL-IMPLEMENTATION-ARTIFACTS-RECORDED | Platform/release owner | .github/workflows/deploy-development.yml; .github/workflows/promote-staging.yml; docs/runbooks/development-deploy-and-staging-promotion.md |
| DEC-P02-ISS-017-002 | Keep staging promotion gated on migration plan, rollback plan, dependency readiness, and smoke/browser evidence. | PARTIAL-IMPLEMENTATION-EVIDENCE-PENDING | Platform/release owner | docs/engineering/phase-2-environment-strategy.md; docs/engineering/environment-and-deployment-baseline.md; docs/runbooks/development-deploy-and-staging-promotion.md |

## P02-ISS-018 decisions - 2026-06-30

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P02-ISS-018-001 | Use P02-ISS-018 to rehearse and evidence all Phase 2 exit gates before claiming Phase 2 completion. | STARTED-PLAN-RECORDED | Platform/release owner | docs/exec-plans/P02-ISS-018-phase-2-exit-gate-rehearsal-and-rollback-evidence.md; docs/engineering/phase-2-issue-backlog.md |
| DEC-P02-ISS-018-002 | Keep Phase 2 completion blocked until controlled evidence exists for deployment, promotion, migration safety, browser validation, route inspection, signed URL, queue/DLQ, and observability gates. | EVIDENCE-PENDING | Platform/release owner | docs/governance/phase-2-requirements-traceability.md; docs/runbooks/development-deploy-and-staging-promotion.md |

## P05-MKT scope authorization - 2026-07-07

| Decision ID | Decision | Status | Owner | Evidence |
|---|---|---|---|---|
| DEC-P05-MKT-001 | Authorize a P05-MKT-* parallel track inside Phase 5 covering full public marketing surface (home redesign, segment pages, trust/privacy/accessibility/FAQ/contact/legal/emergency, auth chrome, DESIGN-NOW-IMPLEMENT-LATER scope-caveat pages). This explicitly overrides the "Homepage redesign: explicitly out of scope" line in docs/design/phase-5-reusable-design-system-foundation.md so the marketing surface can ship alongside the shell foundation. | APPROVED | Product/Design owner | docs/exec-plans/P05-MKT-001..006; docs/governance/phase-5-requirements-traceability.md; docs/governance/change-log.md 2026-07-07 |
| DEC-P05-MKT-002 | Anchor the marketing visual language to VIS-DIR-002 "Warm Care Grid" (recommended in docs/design/brand-and-visual-direction.md) and enforce the anti-pattern list (no glassmorphism, no neon gradients, no decorative medical symbols, no emoji as icons, no color-only status, no stock imagery implying unverified providers). | APPROVED | Design owner | docs/design/brand-and-visual-direction.md; docs/design/marketing-visual-language.md (P05-MKT-001 deliverable) |
| DEC-P05-MKT-003 | Use a bespoke illustration system for hero/story media across all marketing pages. Do not introduce photography until a Content/Design Owner photography approval decision is recorded. | APPROVED | Design owner | docs/design/marketing-visual-language.md (P05-MKT-001 deliverable) |
| DEC-P05-MKT-004 | All marketing copy is authored as `packages/content-registry` entries with `status: "draft"` and enforced by a voice/tone lint that blocks the banned-claim list in docs/content/public-website-content-blueprint.md ("best doctors", "guaranteed", "fully licensed", "nationwide service", "instant results", "cheapest care", "complete privacy", "zero risk"). No inline strings in marketing pages. | APPROVED | Content owner | docs/exec-plans/P05-MKT-003-content-registry-marketing-entries.md |
| DEC-P05-MKT-005 | P05-ISS-003 (design-system primitives expansion) is a hard prerequisite for P05-MKT-002 (marketing component library). Marketing components must sit on top of typed primitives, not inline styles. | APPROVED | Design/Engineering owner | docs/exec-plans/P05-ISS-003-design-system-primitives-expansion.md |
