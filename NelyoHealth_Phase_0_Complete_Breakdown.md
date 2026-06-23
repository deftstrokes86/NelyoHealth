# NelyoHealth Phase 0: Complete Product, Clinical, Regulatory, and Delivery Foundation

**Project:** NelyoHealth  
**Phase:** 0  
**Status:** Build-ready planning specification  
**Primary user:** Founder and implementation team using Codex in the IDE  
**Date:** 23 June 2026

## 1. Phase objective

Phase 0 converts the NelyoHealth concept into an implementation contract. It removes ambiguous terminology, freezes critical product rules, defines safe clinical boundaries, records regulatory questions, and gives every later engineering task a traceable source of truth.

Phase 0 produces documentation and decisions. It does not build production application features.

The phase is complete only when an engineer or Codex can answer all of the following without inventing product behaviour:

1. Who is acting?
2. On whose behalf are they acting?
3. Which organization, plan, or relationship is involved?
4. What may they see or do?
5. What care workflow is active?
6. Which state transitions are legal?
7. What happens when the ordinary path fails?
8. What is recorded, audited, retained, or disclosed?
9. Which rule is a product decision, clinical rule, legal requirement, or unresolved question?
10. What must be tested before the implementation is accepted?

## 2. Locked decisions

These decisions are not open to reinterpretation by Codex.

### 2.1 Patient-centered record

- The patient is the central subject of care.
- One person has one longitudinal patient identity, even when the person is covered by several plans or organizations.
- Family, diaspora, employer, HMO, guardian, and caregiver arrangements are relationships around the patient. They do not create separate clinical records.

### 2.2 Payer and clinical-access separation

- Paying for care does not automatically grant access to clinical records.
- A family-plan owner, diaspora sponsor, employer, or organization administrator may receive payment and fulfilment information within their authority.
- Diagnosis, consultation notes, prescriptions, laboratory results, and other clinical records require a separate lawful access basis and authorization decision.

### 2.3 Pharmacy and laboratory disclosure rule

Before successful payment, the patient may see the pharmacy or laboratory **name**. All other provider identity and location details stay obscured.

The pre-payment provider identity contract permits only:

```text
providerDisplayName
```

Commercial or workflow data that is not a provider identity detail may be shown when needed to let the patient decide whether to pay, for example:

```text
quoteId
totalAmount
currency
quoteExpiry
availabilityConfirmation
estimatedFulfilmentOrTurnaroundWindow
serviceOrOrderSummary
```

The following fields must not be sent to the patient client before successful payment:

```text
address
address components
branch identifier
precise or approximate coordinates
map pin
precise or approximate distance
telephone number
email address
contact person
website or external link
photographs
landmarks
directions
pickup instructions
collection instructions
fulfilment instructions
courier pickup location
internal facility identifier that can be resolved publicly
metadata from which the location or contact details can be derived
```

Implementation consequences:

- Do not return a complete provider object and hide fields with CSS.
- Do not place protected values in HTML, React state, serialized server components, browser storage, analytics, logs, source maps, network payloads, GraphQL caches, or map-provider requests.
- Before payment, a map may show the search area or number of available matches. It must not show provider-specific pins that reveal locations.
- After successful payment, the selected provider's approved details may be released only through the authorized order or booking.
- A failed, cancelled, expired, reversed, abandoned, or merely authorized payment does not unlock the details unless the payment policy expressly defines authorization as the successful payment event. The recommended default is capture or confirmed settlement.
- Payment by one patient or sponsor does not unlock details for another user.
- An organization administrator does not gain access merely because the organization funded the transaction.
- Backend policy, response DTOs, database query projections, and tests must enforce the rule.

### 2.4 Emergency care

- Emergency escalation is not blocked by ordinary payment, shopping, comparison, or registration steps.
- NelyoHealth must not present telemedicine as a replacement for emergency care.
- The emergency protocol must state the human and technical steps when an emergency is suspected.

### 2.5 Clinical integrity

- Signed clinical records are amended, not silently overwritten.
- The platform does not autonomously diagnose patients.
- Clinical decision-support warnings do not silently replace clinician judgment.
- Recording of consultations is off by default.

### 2.6 Auditability

- Sensitive access, consent, clinical, credential, payment, order, claim, and administrative events are auditable.
- Administrative control does not mean unrestricted invisible access to clinical records.

### 2.7 Browser validation

- Codex must be able to inspect and exercise user-facing features in a real browser from the IDE.
- Interactive browser validation and deterministic Playwright tests are separate requirements. One does not replace the other.
- Browser testing uses synthetic data only.

## 3. Proposed initial operating assumptions

These are recommended defaults for planning. Record them as `PROPOSED` until the founder approves them in the decision register.

| Decision | Proposed default | Status |
|---|---|---|
| Pilot geography | One Lagos service area, expanded only after operations are stable | PROPOSED |
| Patient age for first clinical pilot | Adults aged 18 and above | PROPOSED |
| Minor support | Relationship and consent model designed now, clinical activation after guardian and clinical review | PROPOSED |
| Consultation scope | Scheduled and priority outpatient primary-care consultations | PROPOSED |
| Excluded first-pilot care | Emergency treatment, inpatient care, complex chronic-care management, mental-health crisis care, controlled-drug fulfilment | PROPOSED |
| Primary language | English, with localization-ready content architecture | PROPOSED |
| Initial clients | Responsive patient web, provider web, operations/admin web | PROPOSED |
| Native mobile | Deferred until web workflows stabilize | PROPOSED |
| Pharmacy pilot | Small verified network with manual or controlled inventory updates | PROPOSED |
| Laboratory pilot | Small verified network and a limited test catalogue | PROPOSED |
| B2B pilot | One employer and one HMO or benefits partner after the B2C vertical slice works | PROPOSED |
| Home care | Designed in Phase 0, implemented after core consultation and fulfilment loops | PROPOSED |
| Wallet | User-facing balance backed by a double-entry internal ledger and licensed payment provider | PROPOSED |

## 4. Human approval roles

Codex drafts and checks consistency. It is not the approval authority for clinical, regulatory, privacy, or commercial decisions.

| Role | Required responsibility |
|---|---|
| Founder/Product Owner | Product scope, business model, priorities, locked decisions |
| Clinical Lead or Medical Director | Clinical scope, triage, escalation, prescribing, result handling, patient-safety rules |
| Nigerian Legal/Regulatory Counsel | Corporate posture, pharmacy, laboratory, telemedicine, HMO, contracts, disclosures |
| Data Protection Officer or Privacy Counsel | Data mapping, lawful bases, consent, minors, DPIA, retention, breach and cross-border rules |
| Finance/Payments Owner | Funds flow, ledger, reconciliation, refunds, settlement, sponsor payments |
| Operations Lead | Provider onboarding, delivery, support, incident, referral, exception queues |
| Engineering Owner | Architecture feasibility, testability, traceability, non-functional requirements |
| Security Owner | Threat model, access model, secrets, logging, incident response |

A single person may fill several roles early, but each approval must identify the capacity in which the person approved it.

## 5. Phase 0 workstream index

| ID | Workstream | Primary output |
|---|---|---|
| P00-01 | Document control and decision system | Phase plan, status file, decision and question registers |
| P00-02 | Product charter and business model | Product charter and value proposition |
| P00-03 | MVP and pilot boundary | Scope, non-goals, service catalogue boundary |
| P00-04 | Actors, personas, relationships, and tenancy | Actor catalogue, permissions intent, relationship model |
| P00-05 | Plans, sponsorship, coverage, and funding | Family, diaspora, employer, HMO model |
| P00-06 | User journeys and service blueprints | End-to-end journeys and operational handoffs |
| P00-07 | Domain glossary and data classification | Canonical terminology and information classes |
| P00-08 | Conceptual domain model and boundaries | Context map, entities, ownership, integration boundaries |
| P00-09 | Workflow state machines | Legal transitions, guards, side effects, failure states |
| P00-10 | Pharmacy and laboratory disclosure contract | Pre-payment and post-payment API/privacy specification |
| P00-11 | Clinical scope and safety model | Telemedicine suitability, triage, safety-netting |
| P00-12 | Emergency, urgent, referral, and critical-result protocols | Escalation and closed-loop protocols |
| P00-13 | Prescription, laboratory, pharmacy, and delivery policies | Clinical and operational order policies |
| P00-14 | Privacy, consent, guardianship, and data governance | Data map, consent matrix, guardian and delegation rules |
| P00-15 | Regulatory obligations and source register | Obligations, evidence, owner, status, legal questions |
| P00-16 | Payments, ledger, claims, and commercial rules | Funds-flow and financial-state specification |
| P00-17 | Non-functional requirements and browser-test strategy | Security, reliability, accessibility, browser QA |
| P00-18 | Metrics, service levels, and operational readiness | KPI catalogue, SLIs/SLOs, exception ownership |
| P00-19 | Risks, assumptions, dependencies, and ADRs | Risk register and architecture decisions |
| P00-20 | Traceability, review, and phase gate | Requirements matrix and Phase 0 completion report |

# 6. Detailed workstreams

## P00-01: Document control and decision system

### Purpose

Create the governance structure that keeps product decisions, assumptions, legal questions, and changes visible.

### Tasks

1. Create the Phase 0 execution plan.
2. Create a document register with owner, status, reviewer, version, and last-reviewed date.
3. Create a decision register with these statuses:
   - `PROPOSED`
   - `APPROVED`
   - `REJECTED`
   - `SUPERSEDED`
   - `REQUIRES_LEGAL_REVIEW`
   - `REQUIRES_CLINICAL_REVIEW`
4. Create an open-question register.
5. Create an assumptions register.
6. Create a change log for locked product rules.
7. Create a document naming and heading convention.
8. Create a traceability identifier format, for example `REQ-PHARMACY-PRIVACY-001`.
9. Record that unresolved legal or clinical matters may be documented but may not be represented as approved requirements.

### Artifacts

```text
docs/STATUS.md
docs/exec-plans/P00-product-clinical-regulatory-foundation.md
docs/governance/document-register.md
docs/governance/decision-register.md
docs/governance/open-questions.md
docs/governance/assumptions-register.md
docs/governance/change-log.md
docs/governance/traceability-conventions.md
```

### Acceptance criteria

- Every Phase 0 artifact has a named owner and review state.
- Locked decisions are marked `APPROVED` and cannot be silently changed.
- Open questions have an owner and target resolution phase.
- Legal and clinical conclusions are distinguished from product proposals.
- `docs/STATUS.md` shows current work, completed work, blockers, and next task.

## P00-02: Product charter and business model

### Purpose

Define what NelyoHealth is, what market problem it solves, and how B2C and B2B layers relate to patient care.

### Tasks

1. Write the product vision.
2. Write the problem statement for Nigerian patients, families, diaspora sponsors, employers, HMOs, and providers.
3. Define the central product thesis:
   - individual care workflow at the core
   - sponsorship and coverage layers around the patient
   - closed-loop fulfilment instead of video consultation alone
4. Define customer groups and economic buyers.
5. Define value propositions for each customer group.
6. Define the platform's role:
   - technology platform
   - care orchestration
   - marketplace/aggregator where applicable
   - administrative and payment coordination
7. State what NelyoHealth does not claim to be without additional licensing, including insurer or emergency medical service.
8. Define revenue hypotheses without freezing pricing:
   - consultation commission or platform fee
   - provider subscription or service fee
   - employer/HMO contract fee
   - fulfilment fee
   - care coordination fee
9. Define product principles.
10. Define success and failure conditions for the first pilot.

### Artifacts

```text
docs/product/product-charter.md
docs/product/value-propositions.md
docs/product/business-model-hypotheses.md
docs/product/product-principles.md
```

### Acceptance criteria

- The charter describes one coherent platform, not disconnected portals.
- B2C and B2B models use the same patient and care concepts.
- The document separates customer, user, payer, beneficiary, and provider.
- Regulatory positioning is stated as a question or reviewed decision, not marketing language.

## P00-03: MVP and pilot boundary

### Purpose

Prevent a nationwide, multi-specialty, multi-provider launch from becoming the implicit first release.

### Tasks

1. Define first-pilot geography.
2. Define supported patient ages.
3. Define consultation types.
4. Define clinical inclusion and exclusion criteria.
5. Define provider categories included in the pilot.
6. Define initial pharmacy medication categories.
7. Define prohibited or deferred categories.
8. Define initial laboratory test catalogue.
9. Define payment methods.
10. Define family and diaspora features included in the pilot.
11. Define B2B features that are architecture-only versus pilot-ready.
12. Define home-care features that are design-only versus implementation scope.
13. Define supported devices and browsers.
14. Define explicit non-goals.
15. Define expansion criteria.

### Required scope matrix

For each capability, use one status:

```text
PILOT
POST-PILOT
DESIGN-NOW-IMPLEMENT-LATER
OUT-OF-SCOPE
BLOCKED-PENDING-REVIEW
```

### Artifacts

```text
docs/product/mvp-scope.md
docs/product/pilot-operating-boundary.md
docs/product/service-catalogue-boundary.md
docs/product/non-goals.md
docs/product/expansion-gates.md
```

### Acceptance criteria

- Every major feature in the master implementation map has a scope status.
- The first-pilot clinical scope is reviewable by a clinical lead.
- Deferred work is not described as already supported.
- Expansion gates are measurable rather than calendar-based.

## P00-04: Actors, personas, relationships, and tenancy

### Purpose

Define who uses the platform and why the same person may hold several roles and relationships.

### Actor catalogue

At minimum define:

- Patient
- Prospective patient
- Minor patient
- Adult dependent
- Guardian
- Clinical proxy
- Delegated caregiver
- Family-plan administrator
- Diaspora sponsor
- Doctor
- Pharmacist
- Laboratory scientist
- Nurse
- Home-care worker
- Hospital/referral coordinator
- HMO administrator
- HMO claims operator
- Employer benefits administrator
- Employer finance operator
- Provider organization administrator
- Platform support operator
- Platform finance operator
- Credential reviewer
- Compliance officer
- Clinical supervisor
- Security administrator
- Platform administrator
- Auditor

### Tasks

1. Define actor goals, fears, constraints, and main journeys.
2. Distinguish role from relationship.
3. Distinguish person from account.
4. Distinguish organization membership from patient relationship.
5. Define organization and facility tenancy concepts.
6. Define whether an actor can operate in several organizations.
7. Define context switching requirements.
8. Define access intent, without prematurely coding RBAC tables.
9. Define accountless patient cases, including minors and imported beneficiaries.
10. Define staff offboarding consequences.
11. Define patient identity continuity after employer or HMO coverage ends.
12. Define support-access and administrative-access principles.

### Artifacts

```text
docs/product/personas.md
docs/product/actor-catalogue.md
docs/product/relationship-model.md
docs/architecture/tenancy-concept.md
docs/security/access-intent-matrix.md
```

### Acceptance criteria

- Every actor has a purpose and least-privilege access intent.
- Payer, sponsor, guardian, caregiver, and clinician are not conflated.
- A person can have several roles without duplicate person or patient records.
- Organization membership ending does not delete the patient's clinical identity.

## P00-05: Plans, sponsorship, coverage, and funding

### Purpose

Define how individual, family, diaspora, employer, and HMO arrangements attach to a patient.

### Tasks

1. Define an individual self-pay arrangement.
2. Define a family umbrella and its membership lifecycle.
3. Define family-plan administrative authority.
4. Define diaspora sponsorship, beneficiary acceptance, limits, and revocation.
5. Define employer-funded benefits.
6. Define HMO coverage, eligibility, networks, limits, copayments, and prior authorization.
7. Define overlap and priority when several sources can pay.
8. Define who chooses a funding source for a transaction.
9. Define partial coverage and split payment.
10. Define refunds to the original funding source.
11. Define what each payer can see.
12. Define coverage termination and continuity of clinical access.
13. Define plan and coverage effective dates.
14. Define sponsor approval modes:
    - no approval below limit
    - approval per transaction
    - allowed service categories
    - monthly or annual budget
15. Define audit and notification requirements.

### Artifacts

```text
docs/product/funding-and-coverage-model.md
docs/product/family-plan-rules.md
docs/product/diaspora-plan-rules.md
docs/product/employer-benefit-rules.md
docs/product/hmo-coverage-rules.md
docs/security/payer-visibility-matrix.md
```

### Acceptance criteria

- Funding authority and clinical access are separate.
- Coverage priority and partial-payment rules are explicit.
- Refund ownership is explicit.
- Loss of coverage does not remove the patient record.

## P00-06: User journeys and service blueprints

### Purpose

Describe the end-to-end user experience and the backstage operations required to make it work.

### Required journeys

1. Individual patient registration to completed consultation.
2. Family-plan creation and member invitation.
3. Guardian registration of a minor.
4. Diaspora sponsor inviting and funding a beneficiary.
5. Employer roster enrollment and employee activation.
6. HMO beneficiary eligibility and authorization.
7. Doctor onboarding and credential verification.
8. Consultation to prescription to pharmacy delivery.
9. Consultation to laboratory test to result review.
10. Consultation to routine hospital referral.
11. Emergency escalation.
12. Pharmacy onboarding, inventory, acceptance, dispensing, and handover.
13. Laboratory onboarding, booking, specimen collection, result release, and correction.
14. Home-care request to completed recurring visit.
15. Refund and failed-payment resolution.
16. Complaint, clinical incident, and support escalation.
17. Account recovery and lost-phone scenario.
18. Guardian revocation or dispute.
19. Employer offboarding.
20. Provider credential expiry or suspension.

### For each journey document

- Trigger
- Preconditions
- Primary actor
- Secondary actors
- Main flow
- Alternative flows
- Failure flows
- Data created
- Data disclosed
- Consent or authorization checks
- Payment points
- Human operations
- Notifications
- Audit events
- Completion condition
- Reopening condition
- Browser-test scenarios for later phases

### Artifacts

```text
docs/product/user-journeys.md
docs/product/service-blueprints.md
docs/product/exception-journeys.md
docs/testing/journey-test-catalogue.md
```

### Acceptance criteria

- Journeys include backstage operational work, not UI steps alone.
- Every journey has failure and recovery paths.
- Every disclosure of clinical or provider data identifies an access decision.
- Every open care loop has a defined closure condition.

## P00-07: Domain glossary and data classification

### Purpose

Create one vocabulary for product, clinical, operations, API, and database work.

### Required terms

Define at least:

```text
Person
UserAccount
Patient
PatientProfile
Member
Beneficiary
Dependent
Guardian
ClinicalProxy
Caregiver
Sponsor
Payer
Organization
Tenant
Facility
Practitioner
PractitionerRole
Plan
BenefitPackage
Coverage
Eligibility
PriorAuthorization
Appointment
Encounter
Consultation
ClinicalNote
Prescription
PrescriptionItem
DiagnosticOrder
DiagnosticResult
Referral
Quote
Reservation
ServiceOrder
Fulfilment
Delivery
Invoice
PaymentIntent
Payment
Refund
LedgerAccount
LedgerEntry
Claim
Remittance
ConsentGrant
Delegation
AuditEvent
ClinicalIncident
Complaint
```

### Data classification

Define classes such as:

- Public
- Internal
- Confidential
- Sensitive personal data
- Protected clinical data
- Authentication secrets
- Payment data
- Provider credential data
- Regulatory evidence
- De-identified or aggregated data

For each class define handling, logging, analytics, notification, export, and retention expectations.

### Artifacts

```text
docs/glossary.md
docs/data/data-classification.md
docs/data/data-handling-matrix.md
```

### Acceptance criteria

- Terms do not have circular definitions.
- Synonyms are identified and one canonical term is selected.
- Person, account, patient, member, and beneficiary are distinct.
- Provider identity data and protected clinical data are classified separately.
- The pre-payment pharmacy/laboratory rule is reflected in the handling matrix.

## P00-08: Conceptual domain model and boundaries

### Purpose

Define ownership and dependencies before database schemas or services are created.

### Candidate bounded contexts

- Identity and access
- Organizations and facilities
- Patients and relationships
- Clinical records
- Scheduling
- Consultations
- Prescriptions
- Diagnostics
- Marketplace and matching
- Pharmacy fulfilment
- Laboratory operations
- Referrals
- Home care
- Plans and coverage
- Claims
- Payments and ledger
- Consent and audit
- Credentialing
- Notifications
- Support and operations
- Analytics
- Integrations

### Tasks

1. Draw a context map.
2. Define the source of truth for each major entity.
3. Define allowed dependencies.
4. Define which context may publish which events.
5. Define external adapters.
6. Identify data that must not be duplicated.
7. Identify read models that may contain redacted projections.
8. Define transaction boundaries.
9. Define where eventual consistency is acceptable.
10. Define invariants that require a single transaction.
11. Define the provider-disclosure projection boundary.
12. Define audit-event ownership.

### Artifacts

```text
docs/architecture/domain-boundaries.md
docs/architecture/context-map.md
docs/architecture/conceptual-domain-model.md
docs/architecture/source-of-truth-matrix.md
docs/architecture/event-catalogue-draft.md
```

### Acceptance criteria

- Every major entity has one source of truth.
- The marketplace cannot bypass payment authorization to expose provider details.
- External vendor concepts do not leak into the domain model.
- The model supports a modular monolith without forcing premature microservices.

## P00-09: Workflow state machines

### Purpose

Make every long-running process explicit, testable, and recoverable.

### Required state machines

- Identity verification
- Guardian verification
- Practitioner credential review
- Facility credential review
- Appointment
- Encounter
- Prescription
- Pharmacy quote
- Stock reservation
- Pharmacy order
- Delivery
- Diagnostic order
- Laboratory appointment
- Specimen
- Diagnostic result
- Referral
- Home-care visit
- Payment intent
- Refund
- Payout
- Prior authorization
- Claim
- Consent
- Complaint
- Clinical incident

### Every state machine must define

1. States.
2. Initial state.
3. Terminal states.
4. Allowed transitions.
5. Actor or system permitted to transition.
6. Guard conditions.
7. Side effects.
8. Events emitted.
9. Notifications.
10. Audit records.
11. Timeouts and expiries.
12. Retry behaviour.
13. Idempotency requirements.
14. Compensation or reversal.
15. Manual operations path.
16. Illegal transitions.

### Artifacts

```text
docs/workflows/*.md
docs/workflows/state-machine-index.md
docs/workflows/cross-workflow-invariants.md
```

### Acceptance criteria

- No workflow relies on a loose list of booleans.
- Payment, order, and inventory states cannot contradict one another without an exception state.
- Every nonterminal state has an owner and timeout policy.
- Illegal transitions are documented for later tests.

## P00-10: Pharmacy and laboratory disclosure contract

### Purpose

Turn the locked obscurity rule into an unambiguous backend, frontend, authorization, and browser-test requirement.

### Required decisions

1. Define the successful-payment event that unlocks details.
2. Define whether a captured payment, confirmed transfer, HMO authorization, employer guarantee, or approved sponsored transaction counts as paid.
3. Define the exact pre-payment quote schema.
4. Define the exact post-payment fulfilment schema.
5. Define who may retrieve the post-payment schema.
6. Define the unlock duration.
7. Define behaviour after refund, reversal, cancellation, or chargeback.
8. Define behaviour when a provider changes after payment.
9. Define masked map behaviour.
10. Define logs and analytics redaction.
11. Define support and administrator access.
12. Define API error responses that do not leak protected details.
13. Define cache-control requirements.
14. Define search-engine and indexing restrictions.
15. Define test fixtures and negative test cases.

### Recommended API separation

```text
Pre-payment resource:
MarketplaceQuoteView

Post-payment resource:
AuthorizedFulfilmentLocationView
```

The pre-payment type must not inherit from, spread, serialize, or map directly from the full provider type.

### Required threat cases

- Inspecting network responses
- Viewing page source
- Inspecting serialized server state
- Reading browser storage
- Guessing a provider or facility ID
- Calling the post-payment endpoint directly
- Changing order IDs
- Using another patient account
- Using a sponsor account
- Using an employer or HMO administrator account
- Replaying a payment webhook
- Faking a client-side paid flag
- Accessing cached data after logout
- Reading error messages
- Using map-tile or geocoding requests to infer coordinates
- Reading analytics or session-replay payloads

### Artifacts

```text
docs/product/provider-discovery-privacy.md
docs/contracts/provider-disclosure-contract.md
docs/security/provider-disclosure-threat-model.md
docs/testing/provider-disclosure-test-matrix.md
docs/adr/ADR-0001-provider-detail-release-after-payment.md
```

### Acceptance criteria

- The rule is defined as data minimization, not visual hiding.
- Pre-payment and post-payment schemas are separate.
- Unlock authorization is tied to the paid order and actor.
- Map behaviour cannot reveal provider location before payment.
- Failure, reversal, and refund behaviour are explicit.
- Negative browser and API scenarios are listed.

## P00-11: Clinical scope and safety model

### Purpose

Define when NelyoHealth telemedicine is suitable and how clinical uncertainty is handled.

### Tasks

1. Define supported consultation categories.
2. Define excluded symptoms or conditions for the pilot.
3. Define emergency red flags.
4. Define urgent red flags.
5. Define patient-location capture requirements.
6. Define identity confirmation before consultation.
7. Define minimum clinical intake.
8. Define limitations of remote examination.
9. Define when video is required versus audio fallback.
10. Define background blur and face visibility rules.
11. Define consultation-participant consent.
12. Define clinician response and lateness expectations.
13. Define safety-netting content.
14. Define follow-up responsibilities.
15. Define incomplete or disconnected consultation handling.
16. Define prescribing limitations.
17. Define clinical documentation and signature requirements.
18. Define amendment rules.
19. Define clinical incident categories.
20. Define clinical governance review cadence.

### Artifacts

```text
docs/clinical/clinical-scope.md
docs/clinical/clinical-safety-model.md
docs/clinical/telemedicine-suitability.md
docs/clinical/consultation-standard.md
docs/clinical/safety-netting-standard.md
docs/clinical/clinical-incident-policy.md
```

### Acceptance criteria

- A clinical reviewer can determine what the pilot will and will not treat.
- Emergency and urgent cases are not described as normal bookings.
- Audio fallback has clinical boundaries.
- Signed notes and amendments are defined.
- The system is not assigned diagnostic authority.

## P00-12: Emergency, urgent, referral, and critical-result protocols

### Purpose

Close the safety loop when online care is insufficient.

### Tasks

1. Define emergency detection inputs.
2. Define on-screen emergency messaging.
3. Define local emergency numbers and facility routing as configurable content.
4. Define patient location and emergency-contact use.
5. Define clinician actions.
6. Define operations escalation.
7. Define transfer-summary content.
8. Define receiving-facility contact attempts.
9. Define non-emergency referral priorities.
10. Define acceptance, attendance, outcome, and closure.
11. Define failed-contact escalation.
12. Define critical laboratory-result thresholds as configured clinical data, not hard-coded guesses.
13. Define critical-result acknowledgment.
14. Define unacknowledged-result escalation.
15. Define audit and incident review.
16. Define downtime behaviour.

### Artifacts

```text
docs/clinical/emergency-protocol.md
docs/clinical/urgent-care-protocol.md
docs/clinical/referral-standard.md
docs/clinical/critical-result-protocol.md
docs/runbooks/emergency-escalation-draft.md
docs/runbooks/critical-result-draft.md
```

### Acceptance criteria

- Payment does not block emergency escalation.
- Every urgent or critical loop has acknowledgment and closure.
- Configurable clinical thresholds require named clinical ownership.
- Downtime and failed-contact routes exist.

## P00-13: Prescription, laboratory, pharmacy, and delivery policies

### Purpose

Define the clinical and operational rules behind post-consultation fulfilment.

### Prescription policy

Define:

- Required prescription fields
- Digital signature and attribution
- Versioning and cancellation
- Refill policy
- Substitution policy
- Allergy and duplicate-therapy warnings
- Restricted or prohibited online fulfilment categories
- Pharmacist clarification
- Partial fulfilment
- Expiry

### Pharmacy policy

Define:

- Search radius expansion
- Matching criteria
- Quote validity
- Stock freshness
- Stock reservation
- Pharmacist acceptance
- Payment authorization and capture sequence
- Dispensing confirmation
- Failed stock and refund handling
- Provider-detail disclosure rule

### Delivery policy

Define:

- Delivery provider role
- Handover proof
- Tamper evidence
- Cold-chain handling
- Minimal courier data
- OTP or signature
- Failed delivery
- Return to pharmacy
- Dispute and incident flow

### Laboratory policy

Define:

- Test catalogue
- Order content
- Matching criteria
- Preparation instructions
- Booking and home collection
- Specimen identity
- Result verification
- Structured values and signed document
- Correction and amendment
- Critical-result handling
- Clinician review before treatment changes
- Provider-detail disclosure rule

### Artifacts

```text
docs/clinical/prescription-policy.md
docs/operations/pharmacy-fulfilment-policy.md
docs/operations/medicine-delivery-policy.md
docs/clinical/laboratory-ordering-policy.md
docs/clinical/result-release-policy.md
```

### Acceptance criteria

- Inventory is reserved before the agreed payment capture point.
- A result cannot silently trigger a new medication order without clinician authorization.
- Delivery has proof and recovery paths.
- Provider details remain protected before payment.

## P00-14: Privacy, consent, guardianship, and data governance

### Purpose

Define why data is processed, who can access it, how authority is proven, and how data is retained.

### Tasks

1. Create a data-flow map.
2. Create a record of processing activities draft.
3. Identify sensitive and clinical data.
4. Define lawful-basis questions for each processing purpose.
5. Define consent types and versions.
6. Define consent withdrawal.
7. Define guardian evidence and verification.
8. Define multiple guardians and disputes.
9. Define minor assent where appropriate.
10. Define age-of-majority transition.
11. Define adult patient delegation.
12. Define sponsor and family access.
13. Define employer and HMO visibility.
14. Define break-glass access.
15. Define data-subject request workflows.
16. Define retention categories.
17. Define deletion versus legal/clinical retention.
18. Define cross-border processing and diaspora payment data flows.
19. Define subprocessor due diligence.
20. Define breach response and notification ownership.
21. Define analytics, session replay, and support-tool restrictions.
22. Define notification content rules.

### Artifacts

```text
docs/privacy/data-flow-map.md
docs/privacy/processing-activities-draft.md
docs/privacy/consent-matrix.md
docs/privacy/guardian-and-delegation-policy.md
docs/privacy/retention-schedule-draft.md
docs/privacy/data-subject-rights-workflows.md
docs/privacy/cross-border-data-register.md
docs/privacy/subprocessor-register-draft.md
docs/security/break-glass-policy.md
docs/privacy/notification-data-policy.md
```

### Acceptance criteria

- Consent is not used as a blanket answer for every processing purpose.
- Guardian, sponsor, payer, and caregiver authorities are distinct.
- Employer analytics cannot expose individual clinical data.
- Retention and deletion conflicts are visible for legal review.
- Pharmacy and laboratory protected fields are absent from unauthorized analytics and support tooling.

## P00-15: Regulatory obligations and source register

### Purpose

Create a living register of obligations and unresolved legal questions based on official sources.

### Official-source areas to review

- Nigeria Data Protection Act 2023
- Nigeria Data Protection Act General Application and Implementation Directive 2025
- Pharmacy Council of Nigeria Act 2022
- Electronic Pharmacy Regulations 2026
- National Electronic Pharmacy Platform requirements
- Pharmacy premises and pharmacist registration/licensing rules
- Medical and Dental Council of Nigeria registration and professional standards
- Medical Laboratory Science Council of Nigeria practitioner and facility requirements
- National Health Insurance Authority Act 2022
- HMO and healthcare-provider accreditation requirements
- Central Bank of Nigeria payment-service and stored-value frameworks
- Federal and state healthcare-facility licensing requirements
- Consumer protection, advertising, electronic transactions, tax, employment, and contract rules as counsel identifies
- Current Nigeria digital-health policies and applicable interoperability requirements

### Register fields

```text
Obligation ID
Topic
Requirement summary
Applicability
Source title
Issuing authority
Source date
Date verified
Exact section or page
Evidence excerpt or paraphrase
Product impact
Engineering impact
Operations impact
Owner
Review status
Legal advice reference
Open questions
Target resolution date
```

### Mandatory legal questions

1. What entity and licences are required for NelyoHealth's telemedicine operations?
2. Does NelyoHealth qualify as an electronic-pharmacy aggregator, and what registration and platform-integration duties follow?
3. Is the locked pre-payment pharmacy and laboratory disclosure design permitted, and what minimum disclosures must still be made?
4. Which pharmacy details must be public on NelyoHealth's platform or provider pages, independent of transaction matching?
5. What laboratory-facility and practitioner verification is required?
6. Which clinical-provider contracts and indemnities are required?
7. When does a family, diaspora, employer, or HMO arrangement become regulated insurance or health financing?
8. What payment and wallet design avoids unlicensed custody or stored-value activity?
9. What data-controller classification, registration, reporting, DPO, audit, and DPIA obligations apply?
10. What rules govern children, guardians, incapable adults, and age verification?
11. What cross-border data and diaspora-payment conditions apply?
12. What record-retention periods apply to clinical, pharmacy, laboratory, payment, claims, and audit records?
13. What emergency, referral, advertising, and patient-complaint duties apply?
14. What state-level facility or telemedicine requirements apply in the pilot location?

### Artifacts

```text
docs/compliance/official-source-register.md
docs/compliance/obligations-register.md
docs/compliance/legal-question-log.md
docs/compliance/licence-and-registration-matrix.md
docs/compliance/contract-register-draft.md
docs/compliance/regulatory-change-monitoring.md
```

### Acceptance criteria

- Official sources and legal advice are distinguished.
- Every obligation has a source, owner, and applicability status.
- The provider-detail disclosure rule has an explicit legal-review item.
- Codex does not label unresolved interpretations as compliant.
- The register records when each source was last verified.

## P00-16: Payments, ledger, claims, and commercial rules

### Purpose

Define money movement before payment-provider code or wallet screens are built.

### Tasks

1. Draw funds-flow diagrams for:
   - self-pay consultation
   - family-funded care
   - diaspora-funded care
   - employer-funded care
   - HMO-covered care
   - pharmacy order
   - laboratory order
   - refund
   - provider payout
   - chargeback or dispute
2. Define payment authorization, capture, settlement, and failure.
3. Define the successful-payment event used by provider-detail release.
4. Define ledger accounts and double-entry principles.
5. Define sponsor balance semantics.
6. Define split payment and partial coverage.
7. Define fees, commissions, taxes, and provider payable.
8. Define refund ownership and timing.
9. Define reconciliation.
10. Define provider payout holds and corrections.
11. Define claim and remittance boundaries.
12. Define currency display and diaspora-payment settlement.
13. Define idempotency and webhook replay requirements.
14. Define financial audit and role separation.

### Artifacts

```text
docs/finance/funds-flow.md
docs/finance/payment-state-model.md
docs/finance/ledger-principles.md
docs/finance/refund-and-dispute-policy.md
docs/finance/provider-settlement-policy.md
docs/finance/claims-and-remittance-boundary.md
docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md
```

### Acceptance criteria

- Every displayed balance can be derived from ledger entries.
- Payment state and provider-detail release state cannot diverge silently.
- Refund recipients are explicit.
- NelyoHealth does not assume unreviewed custody or insurance risk.

## P00-17: Non-functional requirements and browser-test strategy

### Purpose

Define how secure, reliable, accessible, observable, and testable the platform must be.

### Security requirements

- MFA for privileged roles
- Least privilege
- Tenant and relationship isolation
- Encryption in transit and at rest
- Secret management
- Session and device management
- Signed uploads and malware scanning
- Immutable audit trail
- PHI-safe logs
- Rate limiting
- Idempotency
- Secure webhooks
- Backup and restoration
- Vulnerability and dependency scanning

### Reliability requirements

- Target availability by service class
- Recovery point and recovery time objectives
- Retry, timeout, and dead-letter behaviour
- Graceful degradation for video, SMS, maps, payments, and delivery
- Resumable uploads
- Low-bandwidth operation
- No lost clinical drafts

### Accessibility requirements

- WCAG 2.2 AA target
- Keyboard navigation
- Focus management
- Screen-reader support
- Contrast
- text resizing
- reduced motion
- accessible validation
- captions or transcription workflow
- large touch targets

### Browser strategy

Define two layers:

1. **Interactive IDE validation**
   - Codex uses a Playwright browser integration from the IDE.
   - Codex opens the changed route, clicks through the flow, inspects console and network failures, changes viewport size, and captures evidence.
2. **Deterministic automated tests**
   - Playwright Test runs locally and in CI.
   - Tests cover stable user journeys, privacy boundaries, authorization, accessibility, and visual regressions where useful.

### IDE browser-access decision

Phase 1 must configure a project-scoped browser tool for Codex. The preferred path is Playwright through MCP or the supported Playwright skill/CLI, with the following controls:

- Only trusted local, test, or staging origins are allowed by default.
- Synthetic accounts and fixtures are used.
- No production secrets or patient data are entered.
- Browser artifacts are ignored by Git unless intentionally attached to test reports.
- Tool packages are pinned after initial verification.
- Browser tools are treated as untrusted-input surfaces because page content may attempt prompt injection.

### Pharmacy/laboratory browser tests

Later implementation phases must verify that pre-payment protected details are absent from:

- rendered text
- DOM attributes
- page source
- serialized server data
- API and GraphQL responses
- browser storage
- JavaScript variables and client caches
- analytics calls
- session replay payloads
- console logs
- errors
- map requests

### Artifacts

```text
docs/non-functional/security-requirements.md
docs/non-functional/reliability-requirements.md
docs/non-functional/accessibility-requirements.md
docs/non-functional/performance-requirements.md
docs/testing/test-strategy.md
docs/testing/browser-validation-strategy.md
docs/testing/privacy-boundary-tests.md
docs/adr/ADR-0003-codex-browser-validation.md
```

### Acceptance criteria

- Every later feature has a defined browser-validation expectation.
- Interactive checks do not replace automated tests.
- Protected provider details have network-level negative tests.
- Browser tooling is restricted to synthetic and trusted environments.
- Accessibility and low-bandwidth behaviour are first-class requirements.

## P00-18: Metrics, service levels, and operational readiness

### Purpose

Define how the team will know whether care and fulfilment loops actually work.

### Metrics catalogue

Define at least:

- Registration completion
- Identity verification completion
- Appointment booking conversion
- Payment success and failure
- Consultation connection success
- Video-to-audio fallback
- Clinician lateness
- No-show rate
- Prescription completion
- Pharmacy quote coverage
- Reservation expiry
- Order acceptance
- Delivery success
- Laboratory booking and turnaround
- Result release
- Critical-result acknowledgment
- Referral acceptance and attendance
- Refund completion
- Claim acceptance and denial
- Support response
- Incident count and severity
- Accessibility defects
- Privacy or authorization violations

### Tasks

1. Define metric formulas.
2. Define event sources.
3. Define dimensions and prohibited dimensions.
4. Define service-level indicators.
5. Define proposed service-level objectives.
6. Define operational dashboards.
7. Define exception queues and ageing.
8. Define on-call and escalation ownership.
9. Define pilot stop conditions.
10. Define data-minimization rules for analytics.

### Artifacts

```text
docs/operations/metric-catalogue.md
docs/operations/sli-slo-draft.md
docs/operations/exception-queue-catalogue.md
docs/operations/pilot-stop-conditions.md
docs/data/analytics-data-policy.md
```

### Acceptance criteria

- Metrics measure closed loops, not page views alone.
- Every critical exception has an owner.
- Pilot stop conditions are explicit.
- Analytics cannot reveal pre-payment provider location or unauthorized clinical details.

## P00-19: Risks, assumptions, dependencies, and ADRs

### Purpose

Expose what could invalidate the plan before code makes reversal expensive.

### Required risk categories

- Clinical safety
- Privacy and security
- Provider licensing
- Pharmacy regulation
- Laboratory quality
- HMO and insurance posture
- Payment licensing and custody
- Inventory accuracy
- Delivery reliability
- Emergency escalation
- Patient identity duplication
- Guardian disputes
- Sponsor privacy
- Provider-detail disclosure legality
- Fraud and abuse
- Low connectivity
- Vendor dependence
- Operational staffing
- Support capacity
- Scope expansion

### Risk fields

```text
Risk ID
Description
Cause
Consequence
Likelihood
Impact
Early warning
Mitigation
Contingency
Owner
Status
Review date
```

### Initial ADRs

At minimum draft:

- Modular monolith first
- One person and one longitudinal patient identity
- Payer access separated from clinical access
- Provider details released only after successful payment
- Wallet represented by a double-entry ledger backed by licensed payment services
- Signed clinical records use amendments
- Managed video provider versus self-hosting decision deferred until evaluation
- Browser testing through Playwright-based tooling
- No production PHI in analytics or session replay

### Artifacts

```text
docs/governance/risk-register.md
docs/governance/dependency-register.md
docs/governance/assumptions-register.md
docs/adr/*.md
```

### Acceptance criteria

- High-impact risks have owners and mitigations.
- Assumptions that could change architecture are visible.
- ADRs state context, decision, alternatives, consequences, and review trigger.

## P00-20: Traceability, review, and phase gate

### Purpose

Prove that Phase 0 is coherent and ready to control implementation.

### Tasks

1. Assign requirement IDs.
2. Map product requirements to:
   - journey
   - state machine
   - data class
   - access rule
   - clinical rule
   - regulatory item
   - planned implementation phase
   - planned test
3. Run consistency review across all documents.
4. Search for conflicting definitions.
5. Search for unresolved `TODO`, `TBD`, and placeholder text.
6. Confirm all unresolved items have owners.
7. Run independent reviews:
   - product coherence
   - clinical safety
   - privacy/security
   - regulatory completeness
   - financial logic
   - engineering feasibility
   - browser-test completeness
8. Produce a Phase 0 completion report.
9. Record approvals and conditions.
10. Freeze a Phase 0 baseline tag or document version.

### Artifacts

```text
docs/governance/requirements-traceability-matrix.md
docs/reviews/phase-0-product-review.md
docs/reviews/phase-0-clinical-review.md
docs/reviews/phase-0-privacy-security-review.md
docs/reviews/phase-0-regulatory-review.md
docs/reviews/phase-0-engineering-review.md
docs/reviews/phase-0-testability-review.md
docs/exec-plans/P00-completion-report.md
```

### Exit gate

Phase 0 passes only when:

- MVP scope and non-goals are explicit.
- Actors, relationships, organizations, plans, and access intent are unambiguous.
- Principal journeys include failures and operational handoffs.
- Canonical terminology is approved.
- Domain boundaries and sources of truth are documented.
- State machines exist for every long-running process.
- The pharmacy and laboratory disclosure rule is an API, authorization, mapping, caching, logging, and browser-test invariant.
- Clinical scope, telemedicine suitability, emergency escalation, referrals, and critical results are reviewed.
- Privacy, consent, guardian, delegation, retention, and cross-border questions are documented.
- Financial flows and the payment event that unlocks provider details are explicit.
- Regulatory obligations have sources, owners, and review status.
- Non-functional and browser-testing requirements are measurable.
- High-risk assumptions have owners and mitigations.
- The traceability matrix maps requirements to later phases and tests.
- Human approvers have signed or conditionally approved the baseline.

# 7. Phase 0 deliverable tree

```text
docs/
├── STATUS.md
├── SPEC.md
├── glossary.md
├── adr/
├── architecture/
│   ├── conceptual-domain-model.md
│   ├── context-map.md
│   ├── domain-boundaries.md
│   ├── event-catalogue-draft.md
│   ├── source-of-truth-matrix.md
│   └── tenancy-concept.md
├── clinical/
│   ├── clinical-incident-policy.md
│   ├── clinical-safety-model.md
│   ├── clinical-scope.md
│   ├── consultation-standard.md
│   ├── critical-result-protocol.md
│   ├── emergency-protocol.md
│   ├── laboratory-ordering-policy.md
│   ├── prescription-policy.md
│   ├── referral-standard.md
│   ├── result-release-policy.md
│   ├── safety-netting-standard.md
│   ├── telemedicine-suitability.md
│   └── urgent-care-protocol.md
├── compliance/
│   ├── contract-register-draft.md
│   ├── legal-question-log.md
│   ├── licence-and-registration-matrix.md
│   ├── obligations-register.md
│   ├── official-source-register.md
│   └── regulatory-change-monitoring.md
├── contracts/
│   └── provider-disclosure-contract.md
├── data/
│   ├── analytics-data-policy.md
│   ├── data-classification.md
│   └── data-handling-matrix.md
├── exec-plans/
│   ├── P00-product-clinical-regulatory-foundation.md
│   └── P00-completion-report.md
├── finance/
│   ├── claims-and-remittance-boundary.md
│   ├── funds-flow.md
│   ├── ledger-principles.md
│   ├── payment-state-model.md
│   ├── provider-settlement-policy.md
│   └── refund-and-dispute-policy.md
├── governance/
│   ├── assumptions-register.md
│   ├── change-log.md
│   ├── decision-register.md
│   ├── dependency-register.md
│   ├── document-register.md
│   ├── open-questions.md
│   ├── requirements-traceability-matrix.md
│   ├── risk-register.md
│   └── traceability-conventions.md
├── non-functional/
│   ├── accessibility-requirements.md
│   ├── performance-requirements.md
│   ├── reliability-requirements.md
│   └── security-requirements.md
├── operations/
│   ├── exception-queue-catalogue.md
│   ├── medicine-delivery-policy.md
│   ├── metric-catalogue.md
│   ├── pharmacy-fulfilment-policy.md
│   ├── pilot-stop-conditions.md
│   └── sli-slo-draft.md
├── privacy/
│   ├── consent-matrix.md
│   ├── cross-border-data-register.md
│   ├── data-flow-map.md
│   ├── data-subject-rights-workflows.md
│   ├── guardian-and-delegation-policy.md
│   ├── notification-data-policy.md
│   ├── processing-activities-draft.md
│   ├── retention-schedule-draft.md
│   └── subprocessor-register-draft.md
├── product/
│   ├── actor-catalogue.md
│   ├── business-model-hypotheses.md
│   ├── diaspora-plan-rules.md
│   ├── employer-benefit-rules.md
│   ├── exception-journeys.md
│   ├── expansion-gates.md
│   ├── family-plan-rules.md
│   ├── funding-and-coverage-model.md
│   ├── hmo-coverage-rules.md
│   ├── mvp-scope.md
│   ├── non-goals.md
│   ├── personas.md
│   ├── pilot-operating-boundary.md
│   ├── product-charter.md
│   ├── product-principles.md
│   ├── provider-discovery-privacy.md
│   ├── relationship-model.md
│   ├── service-blueprints.md
│   ├── service-catalogue-boundary.md
│   ├── user-journeys.md
│   ├── value-propositions.md
│   └── payer-visibility-matrix.md
├── reviews/
├── runbooks/
├── security/
│   ├── access-intent-matrix.md
│   ├── break-glass-policy.md
│   └── provider-disclosure-threat-model.md
├── testing/
│   ├── browser-validation-strategy.md
│   ├── journey-test-catalogue.md
│   ├── privacy-boundary-tests.md
│   ├── provider-disclosure-test-matrix.md
│   └── test-strategy.md
└── workflows/
    ├── state-machine-index.md
    ├── cross-workflow-invariants.md
    └── *.md
```

# 8. Phase 0 issue backlog

| Issue ID | Title | Depends on |
|---|---|---|
| P00-FND-001 | Initialize Phase 0 governance and execution plan | None |
| P00-PRD-001 | Draft product charter and principles | P00-FND-001 |
| P00-PRD-002 | Define MVP and pilot operating boundary | P00-PRD-001 |
| P00-IAM-001 | Define actors, roles, relationships, and tenancy intent | P00-PRD-001 |
| P00-COV-001 | Define family, diaspora, employer, and HMO funding models | P00-IAM-001 |
| P00-JRN-001 | Draft user journeys and service blueprints | P00-PRD-002, P00-IAM-001 |
| P00-DOM-001 | Create glossary and data classification | P00-IAM-001 |
| P00-ARC-001 | Define conceptual domains and sources of truth | P00-DOM-001 |
| P00-WFL-001 | Specify workflow state machines | P00-JRN-001, P00-ARC-001 |
| P00-PRV-001 | Specify pharmacy/laboratory disclosure contract | P00-WFL-001 |
| P00-CLN-001 | Define clinical scope and safety model | P00-PRD-002 |
| P00-CLN-002 | Define emergency, referral, and critical-result protocols | P00-CLN-001 |
| P00-FUL-001 | Define prescription, pharmacy, lab, and delivery policies | P00-CLN-001, P00-PRV-001 |
| P00-DAT-001 | Define privacy, consent, guardianship, and data governance | P00-IAM-001, P00-DOM-001 |
| P00-REG-001 | Build official-source and obligations register | P00-DAT-001, P00-FUL-001 |
| P00-FIN-001 | Define funds flow, ledger, claims, and unlock payment event | P00-COV-001, P00-PRV-001 |
| P00-NFR-001 | Define security, reliability, accessibility, and browser testing | P00-ARC-001, P00-PRV-001 |
| P00-OPS-001 | Define metrics, SLOs, and operational exception ownership | P00-JRN-001, P00-WFL-001 |
| P00-RSK-001 | Consolidate risks, dependencies, assumptions, and ADRs | All drafting workstreams |
| P00-GATE-001 | Run traceability review and Phase 0 gate | All Phase 0 issues |

# 9. Definition of done for each Phase 0 issue

```text
[ ] Requested documents were created or updated.
[ ] Existing locked decisions were preserved.
[ ] New assumptions are explicitly marked.
[ ] Legal and clinical interpretations are not presented as approved without review.
[ ] Terms match docs/glossary.md or the glossary is updated.
[ ] Relevant requirement IDs were added.
[ ] Relevant user journeys and failure paths were covered.
[ ] Privacy and authorization implications were documented.
[ ] Pharmacy/laboratory disclosure implications were checked.
[ ] Browser-test implications were documented for user-facing behaviour.
[ ] Open questions have owners and resolution targets.
[ ] docs/STATUS.md was updated.
[ ] Cross-document links are valid.
[ ] Markdown lint and link checks pass when tooling exists.
[ ] Codex reviewed its own diff for contradictions and unsupported claims.
[ ] A concise completion summary lists files, decisions, assumptions, and blockers.
```

# 10. Phase 0 execution rules for Codex

1. Work on one issue or tightly related issue group at a time.
2. Read the master implementation map, this Phase 0 specification, `AGENTS.md`, and `docs/STATUS.md` before editing.
3. Do not scaffold application code during Phase 0.
4. Do not select vendors unless the task specifically requests an evaluation.
5. Do not invent clinical thresholds, legal conclusions, licence requirements, or retention periods.
6. Use official sources for regulatory research and record the date checked.
7. Mark uncertain matters and assign an owner.
8. Preserve the pharmacy and laboratory pre-payment disclosure rule exactly.
9. Use Mermaid or text diagrams for journeys and state machines, with a text alternative when readability requires it.
10. Update traceability as requirements become stable.
11. Stop at the issue boundary. Do not opportunistically implement later phases.
12. At the end of every task, report:
    - changed files
    - decisions captured
    - assumptions introduced
    - questions remaining
    - validation performed
    - recommended next issue

