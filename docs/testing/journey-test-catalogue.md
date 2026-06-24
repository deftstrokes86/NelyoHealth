# NelyoHealth Journey Test Catalogue

## Document control

| Field | Value |
|---|---|
| Prompt | P00-05 |
| Complete Breakdown package | P00-06 User journeys and service blueprints |
| Source precedence | 1. `NelyoHealth_Phase_0_Complete_Breakdown.md`; 2. `NelyoHealth_Phase_0_Codex_Prompt_Pack.md`; 3. `NelyoHealth_Build_Implementation_Map_for_Codex.md`; 4. Generated Phase 0 artifacts |
| Status | PROPOSED |
| Scope | Test catalogue and browser-validation design only. No test tooling is installed or configured by this document. |
| Data rule | Synthetic data only. No production personal data, PHI, credentials, provider location data, or live payment instruments may be used. |

## Test objectives

- Convert the P00-05 journeys into reviewable test obligations without implementing tests.
- Preserve the one longitudinal patient identity rule across registration, sponsorship, employer, HMO, guardian, account recovery, and offboarding journeys.
- Prove payer status never grants clinical-record access.
- Prove pre-payment pharmacy and laboratory details are absent from client-facing and telemetry channels, not merely hidden visually.
- Prove post-payment disclosure is tied to the exact selected authorized order, actor, patient, provider, and tenant after the final successful-payment event defined later in P00-13.
- Prove emergency escalation is independent of payment, registration, plan authorization, marketplace comparison, and provider-detail obscuration.
- Prove finalized clinical records use amendments or versioning and are never silently overwritten.
- Define both interactive IDE browser validation and deterministic Playwright E2E coverage for Phase 1 implementation.

## Test execution types

| Type | Meaning | Phase 0 position |
|---|---|---|
| INTERACTIVE-IDE-BROWSER | Codex-operated browser inspection of the implemented app from the IDE. | Required strategy; execution deferred to implementation phase. |
| PLAYWRIGHT-E2E | Deterministic automated browser tests committed to the repository. | Required strategy; tooling deferred to implementation phase. |
| API-CONTRACT | Contract-level checks for allowed and prohibited request/response fields. | Specification only in P00-05. |
| INTEGRATION | Multi-service journey checks across identity, payment, provider, and operations boundaries. | Specification only in P00-05. |
| SECURITY-PRIVACY | Access, tenant isolation, data-minimization, and disclosure-boundary checks. | Specification only in P00-05. |
| ACCESSIBILITY | Keyboard, focus, screen-reader, and responsive-layout checks. | Specification only in P00-05; detailed strategy in P00-14. |
| MANUAL-OPERATIONS | Human escalation, queue, and support-process rehearsal. | Specification only in P00-05. |
| CLINICAL-REHEARSAL | Clinician-led review of care, escalation, result, referral, and incident paths. | Specification only in P00-05; approval deferred to clinical owners. |

## Scenario schema

Each downstream test scenario must record:

- Scenario ID.
- Journey ID.
- Scope label: `PILOT` or `DESIGN-NOW-IMPLEMENT-LATER`.
- Execution type.
- Synthetic actors and records.
- Preconditions.
- Steps.
- Expected result.
- Locked requirement covered.
- Evidence artifact expected.
- Approval owner where human, clinical, legal, financial, or operational judgment is required.

## Journey scenario matrix

| Scenario ID | Journey | Scope | Execution type | Scenario | Expected result and locked coverage | Evidence |
|---|---|---|---|---|---|---|
| T-JRN-001-01 | JRN-001 | PILOT | PLAYWRIGHT-E2E | Adult patient registers, authenticates, onboards, books consultation, completes consultation, and receives closure summary. | One longitudinal patient identity is preserved and no duplicate patient record is created. | Browser trace, synthetic audit record, journey closure evidence. |
| T-JRN-001-02 | JRN-001 | PILOT | SECURITY-PRIVACY | Matching logic detects an existing person/patient during activation. | Account links to existing continuity identity or enters reviewed exception; no duplicate patient is silently created. | Identity-match decision record and exception queue item. |
| T-JRN-001-03 | JRN-001 | PILOT | ACCESSIBILITY | Registration, login, onboarding, booking, consultation join, and summary screens are keyboard and focus navigable. | Core patient journey remains operable without pointer interaction across desktop, tablet, and mobile layouts. | Accessibility report, screenshots, focus-order notes. |
| T-JRN-001-04 | JRN-001 | PILOT | INTERACTIVE-IDE-BROWSER | Codex manually inspects registration-to-consultation happy path using synthetic data. | Interactive browser access validates implemented route behavior without production data. | IDE browser notes and screenshots with synthetic identifiers only. |
| T-JRN-001-05 | JRN-001 | PILOT | API-CONTRACT | Unauthenticated, wrong-account, and wrong-tenant attempts access onboarding or consultation artifacts. | Access denied; payer or unrelated role cannot access clinical records. | API response samples and denied audit events. |
| T-JRN-002-01 | JRN-002 | PILOT | PLAYWRIGHT-E2E | Family administrator creates family plan and invites adult member. | Invite acceptance preserves independent adult patient identity and does not create clinical-access rights for payer. | Browser trace and membership audit. |
| T-JRN-002-02 | JRN-002 | PILOT | SECURITY-PRIVACY | Family invite is sent to or claimed by the wrong person. | Invite is revoked or quarantined; no clinical record or membership transfer occurs. | Exception record EXC-005 and notification audit. |
| T-JRN-002-03 | JRN-002 | PILOT | API-CONTRACT | Family payer funds a member order and requests member clinical notes. | Funding authority does not grant clinical-record access. | Denied response and payer-visibility matrix evidence. |
| T-JRN-003-01 | JRN-003 | DESIGN-NOW-IMPLEMENT-LATER | MANUAL-OPERATIONS | Guardian submits evidence for minor registration. | Evidence workflow is modeled but not active pilot functionality; minor clinical activation remains deferred. | Design rehearsal notes and approval dependency. |
| T-JRN-003-02 | JRN-003 | DESIGN-NOW-IMPLEMENT-LATER | SECURITY-PRIVACY | Guardian evidence is rejected, disputed, or expires. | Guardian authority is not granted; minor patient identity is not duplicated or exposed. | Exception record EXC-007 or EXC-008. |
| T-JRN-004-01 | JRN-004 | PILOT | PLAYWRIGHT-E2E | Diaspora sponsor invites and funds an adult beneficiary. | Beneficiary acceptance is explicit; sponsor funding does not grant clinical-record access. | Browser trace, sponsor audit, beneficiary consent evidence. |
| T-JRN-004-02 | JRN-004 | PILOT | SECURITY-PRIVACY | Sponsor attempts to view beneficiary consultation details. | Access denied unless separately authorized by approved clinical access policy. | Denied response and audit event. |
| T-JRN-004-03 | JRN-004 | PILOT | INTEGRATION | Sponsor approval times out or is revoked during pending order. | Order enters safe pause, cancellation, or reauthorization path without emergency blocking. | Order event log and exception queue. |
| T-JRN-005-01 | JRN-005 | DESIGN-NOW-IMPLEMENT-LATER | API-CONTRACT | Employer roster enrolment and employee activation are modeled. | Employer benefits do not create employer clinical-record access. | Design contract and visibility matrix check. |
| T-JRN-005-02 | JRN-005 | DESIGN-NOW-IMPLEMENT-LATER | SECURITY-PRIVACY | Employee is offboarded while patient continuity remains active. | Organization access is revoked, but patient continuity and personal access are preserved. | Offboarding audit and continuity note. |
| T-JRN-006-01 | JRN-006 | DESIGN-NOW-IMPLEMENT-LATER | API-CONTRACT | HMO beneficiary eligibility and authorization are modeled. | HMO visibility is limited to eligibility, authorization, claim, appeal, and remittance fields. | Contract sample and denied clinical-record fields. |
| T-JRN-006-02 | JRN-006 | DESIGN-NOW-IMPLEMENT-LATER | INTEGRATION | HMO eligibility is unavailable, denied, or expired. | Routine care enters fallback or authorization failure path; emergency escalation remains unblocked. | Eligibility failure event and emergency bypass evidence. |
| T-JRN-007-01 | JRN-007 | PILOT | MANUAL-OPERATIONS | Doctor onboarding and credential verification complete. | Only verified practitioner role is activated; verification record is auditable. | Credential checklist and approval record. |
| T-JRN-007-02 | JRN-007 | PILOT | SECURITY-PRIVACY | Credential cannot be verified or expires. | Provider access is not activated or is suspended without deleting clinical history. | EXC-009 or EXC-010 event. |
| T-JRN-007-03 | JRN-007 | PILOT | API-CONTRACT | Provider attempts access outside assigned tenant, encounter, or role context. | Access denied by tenant, role, and encounter constraints. | Denied response and audit event. |
| T-JRN-008-01 | JRN-008 | PILOT | PLAYWRIGHT-E2E | Consultation produces prescription, server-side pharmacy matching starts at 4 km, and patient views pre-payment options. | Patient client receives only `providerDisplayName` plus approved non-identifying commercial/workflow fields. | Browser trace, response capture, no prohibited fields. |
| T-JRN-008-02 | JRN-008 | PILOT | API-CONTRACT | Inspect pharmacy pre-payment HTML, API, hydration payload, JS state, browser storage, cache, hidden DOM, accessibility tree, map requests, analytics, logs, screenshots, traces, and fixtures. | No address, address component, coordinate, distance, branch, map pin, direction, contact, photo, link, pickup instruction, internal ID, or derivable metadata reaches client channels. | Negative field matrix. |
| T-JRN-008-03 | JRN-008 | PILOT | INTEGRATION | Successful payment event occurs for the selected prescription order. | Approved pharmacy details disclose only for exact selected provider, order, patient, actor, and tenant. | Payment event, authorization check, post-payment disclosure response. |
| T-JRN-008-04 | JRN-008 | PILOT | SECURITY-PRIVACY | Failed, cancelled, pending, expired, authorization-only, wrong-order, or wrong-patient payment tries to unlock details. | Disclosure remains denied by default. | Denied events and no protected field leakage. |
| T-JRN-008-05 | JRN-008 | PILOT | ACCESSIBILITY | Pharmacy selection, payment, and post-payment detail view are keyboard/focus accessible and responsive. | Accessibility does not require hidden protected provider details before payment. | Accessibility report and viewport screenshots. |
| T-JRN-009-01 | JRN-009 | PILOT | PLAYWRIGHT-E2E | Consultation produces lab order, server-side lab matching starts at 4 km, and patient views pre-payment options. | Patient client receives only `providerDisplayName` plus approved non-identifying commercial/workflow fields. | Browser trace and pre-payment response capture. |
| T-JRN-009-02 | JRN-009 | PILOT | API-CONTRACT | Inspect lab pre-payment HTML, API, hydration payload, JS state, browser storage, cache, hidden DOM, accessibility tree, map requests, analytics, logs, screenshots, traces, and fixtures. | No address, coordinate, distance, branch, collection instruction, contact, map, internal ID, or derivable metadata reaches client channels. | Negative field matrix. |
| T-JRN-009-03 | JRN-009 | PILOT | INTEGRATION | Successful payment event occurs for the selected laboratory order. | Approved laboratory details disclose only for exact selected provider, order, patient, actor, and tenant. | Payment event and post-payment disclosure response. |
| T-JRN-009-04 | JRN-009 | PILOT | CLINICAL-REHEARSAL | Laboratory result returns and clinician reviews before patient-facing clinical interpretation. | Result release and treatment changes require clinician review where required by policy. | Clinical review log. |
| T-JRN-009-05 | JRN-009 | PILOT | SECURITY-PRIVACY | Incorrect or corrected lab result is processed. | Finalized result is amended/versioned, never silently overwritten. | Result version history and amendment audit. |
| T-JRN-010-01 | JRN-010 | PILOT | CLINICAL-REHEARSAL | Clinician creates routine hospital or specialist referral. | Referral uses minimum necessary clinical data and records closure/reopening owner. | Referral note and handoff evidence. |
| T-JRN-010-02 | JRN-010 | PILOT | MANUAL-OPERATIONS | Referral facility rejects or cannot accept referral. | Patient receives safe fallback instructions and operational owner is assigned. | EXC-041 record and follow-up task. |
| T-JRN-010-03 | JRN-010 | PILOT | SECURITY-PRIVACY | Referral recipient or payer requests excess clinical data. | Minimum-necessary disclosure controls deny excess records. | Denied field report. |
| T-JRN-011-01 | JRN-011 | PILOT | CLINICAL-REHEARSAL | Patient triggers urgent or emergency escalation from consultation or support. | Escalation is not blocked by payment, registration, plan authorization, marketplace comparison, or provider-detail obscuration. | Emergency handoff record and clinical review. |
| T-JRN-011-02 | JRN-011 | PILOT | PLAYWRIGHT-E2E | Emergency path is accessed while payment is failed or pending. | Emergency guidance remains available and finance moves to later follow-up. | Browser trace and finance follow-up item. |
| T-JRN-011-03 | JRN-011 | PILOT | INTERACTIVE-IDE-BROWSER | Codex manually inspects emergency escalation route using synthetic data. | Emergency route is visible and operational independent of routine booking flow. | IDE browser notes. |
| T-JRN-011-04 | JRN-011 | PILOT | ACCESSIBILITY | Emergency escalation UI is keyboard/focus accessible on mobile, tablet, and desktop. | Accessibility defects do not block emergency activation. | Accessibility report and screenshots. |
| T-JRN-011-05 | JRN-011 | PILOT | MANUAL-OPERATIONS | Emergency location unavailable or receiving facility cannot be contacted. | Human escalation owner follows approved fallback script; unresolved clinical policy remains tracked. | EXC-043 or EXC-044 event. |
| T-JRN-012-01 | JRN-012 | PILOT | MANUAL-OPERATIONS | Pharmacy completes onboarding, inventory update, order acceptance, dispensing, and handover. | Human operations are auditable and do not require direct production DB edits. | Pharmacy operations checklist. |
| T-JRN-012-02 | JRN-012 | PILOT | INTEGRATION | Pharmacy stock mismatch or reservation expiry occurs. | Order moves to approved rematch, cancellation, or refund path without leaking alternative provider details. | EXC-027 or EXC-028 record. |
| T-JRN-012-03 | JRN-012 | PILOT | SECURITY-PRIVACY | Pharmacy staff attempts to view unrelated patient/order details. | Access is restricted to authorized order context only. | Denied access audit. |
| T-JRN-013-01 | JRN-013 | PILOT | MANUAL-OPERATIONS | Laboratory onboarding, booking, specimen collection, result release, and correction are rehearsed. | Result release and correction paths are auditable and versioned. | Lab operations checklist. |
| T-JRN-013-02 | JRN-013 | PILOT | CLINICAL-REHEARSAL | Invalid specimen, specimen identity mismatch, delayed result, or critical result occurs. | Critical-result and correction paths have owners and closure records. | EXC-034 through EXC-040 evidence. |
| T-JRN-013-03 | JRN-013 | PILOT | SECURITY-PRIVACY | Lab accesses unrelated patient/order or returns protected collection details pre-payment. | Access denied or protected fields absent before payment. | Denied response and negative field report. |
| T-JRN-014-01 | JRN-014 | DESIGN-NOW-IMPLEMENT-LATER | MANUAL-OPERATIONS | Home-care request to recurring visit is modeled. | Home-care remains deferred and requires clinical/operations approval before activation. | Design rehearsal notes. |
| T-JRN-014-02 | JRN-014 | DESIGN-NOW-IMPLEMENT-LATER | SECURITY-PRIVACY | Home-care location and household details are requested by unauthorized actor. | Access denied; deferred design does not leak home location data. | Denied response and privacy review item. |
| T-JRN-015-01 | JRN-015 | PILOT | PLAYWRIGHT-E2E | Payment fails during pharmacy or lab order. | Provider details remain locked; emergency escalation remains available if needed. | Browser trace and denied disclosure response. |
| T-JRN-015-02 | JRN-015 | PILOT | API-CONTRACT | Payment is cancelled, abandoned, expired, pending, authorization-only, unverified, or bound to wrong actor/order/patient/tenant. | Disclosure remains denied by default. | Negative payment-state matrix. |
| T-JRN-015-03 | JRN-015 | PILOT | INTEGRATION | Refund, reversal, or chargeback occurs after disclosure. | Behavior follows P00-13 approved policy; until approved, scenario remains expected-fail/gated. | Open-question link to OQ-00-02 through OQ-00-04. |
| T-JRN-015-04 | JRN-015 | PILOT | SECURITY-PRIVACY | User guesses internal order/provider identifiers or directly opens disclosure URL. | Access denied; no alternate provider or another order is unlocked. | Denied response and security audit. |
| T-JRN-015-05 | JRN-015 | PILOT | INTERACTIVE-IDE-BROWSER | Codex inspects failed-payment and back-button behavior in browser. | Back navigation, cache, and recovery routes do not reveal stale protected provider details. | IDE browser notes, cache inspection, screenshots. |
| T-JRN-016-01 | JRN-016 | PILOT | MANUAL-OPERATIONS | Complaint is submitted and routed. | Complaint has owner, severity, closure, and reopening conditions. | Support case record. |
| T-JRN-016-02 | JRN-016 | PILOT | CLINICAL-REHEARSAL | Clinical incident is reported. | Incident enters clinical safety review and does not alter signed records silently. | Incident record and amendment/version evidence. |
| T-JRN-016-03 | JRN-016 | PILOT | SECURITY-PRIVACY | Privacy incident or unauthorized clinical-record access attempt is reported. | Incident is escalated to privacy/security owner and evidence is preserved. | EXC-046 or EXC-051 record. |
| T-JRN-016-04 | JRN-016 | PILOT | MANUAL-OPERATIONS | Operational backlog or provider outage affects patient journey. | Owner and communication path are assigned; unsafe direct DB editing is prohibited. | EXC-052 or EXC-053 record. |
| T-JRN-016-05 | JRN-016 | PILOT | MANUAL-OPERATIONS | Operator requests direct production database editing to resolve a stuck journey. | Request is denied and escalated to product/operations remediation with audit evidence, not silent data mutation. | EXC-054 record and OQ-00-88 link. |
| T-JRN-017-01 | JRN-017 | PILOT | PLAYWRIGHT-E2E | Patient recovers account after lost phone. | Recovery preserves existing patient identity and does not create duplicate patient record. | Browser trace and identity-proofing audit. |
| T-JRN-017-02 | JRN-017 | PILOT | SECURITY-PRIVACY | Attacker attempts account recovery for another patient. | Recovery denied and security review triggered. | Denied audit and alert. |
| T-JRN-017-03 | JRN-017 | PILOT | API-CONTRACT | Old session or lost device tries to access clinical records after recovery. | Previous session is revoked according to approved session policy; clinical data remains protected. | Session invalidation evidence. |
| T-JRN-017-04 | JRN-017 | PILOT | ACCESSIBILITY | Account-recovery flow is keyboard/focus accessible and usable on mobile. | Security controls remain accessible without weakening identity proofing. | Accessibility report. |
| T-JRN-017-05 | JRN-017 | PILOT | INTERACTIVE-IDE-BROWSER | Codex manually inspects lost-phone recovery using synthetic account. | Interactive browser confirms continuity and no duplicate identity. | IDE browser notes. |
| T-JRN-018-01 | JRN-018 | DESIGN-NOW-IMPLEMENT-LATER | MANUAL-OPERATIONS | Guardian revocation, suspension, or dispute is modeled. | Guardian privileges are suspended or revoked without deleting minor continuity records. | Design rehearsal and EXC-008 link. |
| T-JRN-018-02 | JRN-018 | DESIGN-NOW-IMPLEMENT-LATER | SECURITY-PRIVACY | Disputed guardian attempts access during review. | Access is denied or restricted per approved policy; audit is retained. | Denied response and dispute audit. |
| T-JRN-019-01 | JRN-019 | DESIGN-NOW-IMPLEMENT-LATER | MANUAL-OPERATIONS | Employer offboards employee. | Employee patient continuity and personal access remain preserved. | Offboarding design record. |
| T-JRN-019-02 | JRN-019 | DESIGN-NOW-IMPLEMENT-LATER | SECURITY-PRIVACY | Employer requests former employee clinical or service detail after offboarding. | Access denied except explicitly approved minimum financial/claims records. | Denied response and visibility matrix evidence. |
| T-JRN-020-01 | JRN-020 | PILOT | MANUAL-OPERATIONS | Provider credential expiry is detected before new assignment. | Provider is blocked from new work until reverified. | Credential expiry event. |
| T-JRN-020-02 | JRN-020 | PILOT | INTEGRATION | Provider is suspended during active appointment or order. | Active work is reassigned, paused, or escalated without deleting historical clinical attribution. | EXC-011 record and reassignment evidence. |
| T-JRN-020-03 | JRN-020 | PILOT | SECURITY-PRIVACY | Suspended provider attempts access after revocation. | Access denied immediately for active privileged actions. | Denied audit. |
| T-JRN-020-04 | JRN-020 | PILOT | CLINICAL-REHEARSAL | Clinical owner reviews care continuity after provider suspension. | Patient handoff preserves safety and signed records. | Clinical review record. |
| T-JRN-020-05 | JRN-020 | PILOT | PLAYWRIGHT-E2E | Browser flow confirms suspended provider cannot access dashboard tasks. | Deterministic browser test proves revocation behavior using synthetic provider. | Browser trace and screenshot. |

## Mandatory browser scenarios

The Phase 1 browser implementation plan must include:

- Interactive IDE browser smoke test for registration, authentication, onboarding, appointment booking, payment, consultation, pharmacy matching, laboratory matching, emergency escalation, account recovery, and provider suspension.
- Deterministic Playwright E2E tests for the same smoke path where the product surface exists.
- Desktop, tablet, and mobile viewports.
- Console-error capture.
- Failed-network-request capture.
- Screenshots on failure.
- Traces on failure.
- Video on configured failures or retries.
- Keyboard and focus assertions.
- Accessibility checks.
- Synthetic users, orders, prescriptions, labs, providers, payers, sponsors, and tenants only.
- Trusted local, test, and staging origins only.
- Browser artifacts ignored by default unless intentionally attached to review evidence.

## Provider-disclosure negative tests

Pre-payment pharmacy and laboratory matching tests must prove prohibited details are absent from all of these surfaces:

- HTML.
- API responses.
- GraphQL responses, if GraphQL is later used.
- JavaScript state.
- Hydration payloads.
- Browser storage.
- Source output.
- Network requests.
- Map-provider requests.
- Analytics events.
- Error-reporting events.
- Logs.
- Cache entries.
- Accessibility trees.
- Hidden DOM elements.
- Image metadata.
- Test fixtures.
- Screenshots.
- Browser traces.

The test oracle is absence from the client-facing payload and supporting artifact, not CSS hiding or conditional rendering.

## Post-payment disclosure tests

Post-payment disclosure tests must prove:

- The releasing event is the final successful-payment event approved in P00-13.
- Disclosure is bound to the selected order.
- Disclosure is bound to the selected provider.
- Disclosure is bound to the authorized actor.
- Disclosure is bound to the patient.
- Disclosure is bound to the tenant.
- One order does not unlock any other order.
- One provider selection does not unlock another matching provider.
- One patient cannot access another patient's provider details.
- Payment failure, cancellation, incomplete authorization, expiry, wrong binding, or direct URL access does not unlock details.
- Refund, reversal, and chargeback behavior follows the approved P00-13 policy; until that policy is approved, these tests remain gated.

## Emergency tests

Emergency journey tests must prove:

- Emergency escalation is available before or after payment.
- Emergency escalation is available during failed, pending, cancelled, or unavailable payment.
- Emergency escalation is available without marketplace comparison.
- Emergency escalation is available without ordinary registration completion where emergency policy allows minimal intake.
- Emergency escalation is available despite unavailable plan authorization, HMO eligibility, sponsor approval, or provider-detail obscuration.
- Emergency guidance does not expose protected pharmacy or laboratory location details.
- Failed emergency facility contact and unavailable patient location routes have human owners and documented fallback steps.

## Accessibility and connectivity tests

Each implemented pilot journey must include:

- Keyboard navigation for all critical controls.
- Visible focus order and focus recovery after modal or error transitions.
- Mobile, tablet, and desktop layout coverage.
- Screen-reader compatible labels for action, error, payment, and emergency controls.
- Low-bandwidth and failed-network behavior for registration, consultation join, payment, provider matching, lab result review, emergency escalation, and account recovery.
- Confirmation that accessibility trees do not contain protected pre-payment provider details.

## Synthetic data rules

- Synthetic patient names, phone numbers, emails, dates, addresses, payments, provider names, pharmacy names, laboratory names, prescriptions, results, incident records, and tenant identifiers only.
- Synthetic provider names may use realistic display-name patterns, but test fixtures must not contain real provider addresses, coordinates, phone numbers, branch identifiers, maps, or pickup/collection instructions before payment.
- No production screenshots, logs, traces, browser storage dumps, analytics payloads, or error events may be used.
- Synthetic records must include adverse paths: duplicate identity, wrong payer, wrong tenant, failed payment, cancelled payment, expired authorization, refund, reversal, emergency, critical result, provider suspension, and privacy incident.
