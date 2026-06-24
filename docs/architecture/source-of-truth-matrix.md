# NelyoHealth Source-of-Truth Matrix

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Architecture lead + data owners |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |
| Related decisions | REQ-ARC-003; REQ-ARC-004; REQ-ARC-005; REQ-ARC-012; REQ-ARC-018 |

## Source-of-Truth Rules

- Every major entity has exactly one authoritative owning bounded context.
- Other contexts may hold references, redacted projections, derived aggregates, or rebuildable read models only.
- A read model is not an authoritative copy.
- Analytics is downstream-only and non-authoritative.
- Support and Operations cannot mutate another context's private storage directly.
- Provider precise location must not be duplicated into pre-payment client projections.

## Major Entity Source-of-Truth Matrix

| Entity or concept | Owning bounded context | Canonical record | Other allowed references | Allowed read models | Prohibited duplication | Data classification | Transaction authority | Audit owner | Retention authority | Pilot scope | Related decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Person | Identity and Access | Person identity record | Patient, practitioner, membership references | Redacted identity summary | Duplicate patient/person master | SENSITIVE-PERSONAL-DATA | Identity | Consent and Audit | Identity/privacy | PILOT | REQ-DOM-001 |
| UserAccount, ExternalIdentity, AuthenticationFactor, Session, Device | Identity and Access | Account/authentication records | Actor reference IDs | Security/session summaries | Auth secrets outside Identity | AUTHENTICATION-SECRET; SECURITY-OPERATIONAL-DATA | Identity | Consent and Audit | Security/privacy | PILOT | REQ-DOM-001 |
| IdentityVerification, AccountActivation, AccountRecovery | Identity and Access | Verification and activation records | Support case references | Recovery audit projection | Unreviewed duplicate activation | SENSITIVE-PERSONAL-DATA; REGULATORY-EVIDENCE | Identity | Consent and Audit | Security/privacy | PILOT | REQ-DOM-001 |
| Patient, PatientProfile, ProspectivePatient | Patients and Relationships | Patient identity/profile | Person reference, order references | Treating doctor summary | Duplicate Patient per coverage/sponsor | PROTECTED-CLINICAL-DATA; SENSITIVE-PERSONAL-DATA | Patients | Consent and Audit | Clinical/privacy | PILOT | REQ-LOCK-001 |
| Guardian, ClinicalProxy, Caregiver, Delegation, EmergencyContact | Patients and Relationships / Consent and Audit for consent | Relationship authority record | Scoped actor references | Relationship summary | Implicit payer/clinical bundling | SENSITIVE-PERSONAL-DATA; clinical where scoped | Patients/Consent | Consent and Audit | Privacy | DEFERRED/PILOT where applicable | REQ-DOM-007 |
| FamilyPlanMember, CoverageMember, HMOMember, OrganizationMember, FacilityMember, PlanMember | Owning plan/org context | Qualified membership record | Person/Patient references | Eligibility/admin projection | Generic Member entity | SENSITIVE-PERSONAL-DATA; PAYMENT-DATA | Plans or Organizations | Consent and Audit | Privacy/finance | Mixed | REQ-DOM-002 |
| Beneficiary, Sponsor, Payer | Plans and Coverage / Payments | Funding relationship or payment responsibility | Patient/order refs | Payer visibility projection | Clinical-record ownership by payer | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | Plans/Payments | Consent and Audit | Finance/privacy | PILOT | REQ-LOCK-002 |
| Organization, Tenant | Organizations and Facilities | Organization/tenant master | Context reference | Tenant label projection | Separate org master in provider contexts | INTERNAL; SENSITIVE-PERSONAL-DATA where staff | Organizations | Consent and Audit | Org/legal | PILOT | REQ-ARC-003 |
| Facility, Branch, ServiceLocation, ServiceArea | Organizations and Facilities | Facility/location master | Provider/order references | Redacted provider capability projection | Pre-payment client copy of precise location | PROVIDER-IDENTITY-LOCATION-DATA | Organizations | Consent and Audit | Org/legal | PILOT | REQ-LOCK-004 |
| OrganizationMembership, FacilityMembership | Organizations and Facilities | Membership record | Actor references | Role/context projection | Access grants without context | SENSITIVE-PERSONAL-DATA | Organizations | Consent and Audit | Privacy/org | DEFERRED/PILOT | REQ-GOV-005 |
| Practitioner, PractitionerRole | Credentialing with Person ref | Practitioner role eligibility record | Person and org refs | Eligible-provider projection | Separate human identity | PROVIDER-CREDENTIAL-DATA; SENSITIVE-PERSONAL-DATA | Credentialing | Consent and Audit | Credentialing/legal | PILOT | REQ-ARC-003 |
| Doctor, Pharmacist, LaboratoryScientist, Nurse, HomeCareWorker | Credentialing | PractitionerRole subtype/status | Role references | Eligibility projection | Separate person tables by role | PROVIDER-CREDENTIAL-DATA | Credentialing | Consent and Audit | Credentialing/legal | Mixed | REQ-DOM-002 |
| ProviderOrganization | Organizations and Facilities | Organization/facility master | Marketplace/provider refs | Redacted provider projection | Provider master in Marketplace | PROVIDER-IDENTITY-LOCATION-DATA | Organizations | Consent and Audit | Org/legal | PILOT | REQ-ARC-003 |
| PractitionerCredential, FacilityCredential, CredentialReview, CredentialSuspension, CredentialExpiry | Credentialing | Credential evidence/status | Eligibility refs | Credential eligibility projection | Credential status copies in Scheduling | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | Credentialing | Consent and Audit | Credentialing/legal | PILOT | REQ-ARC-003 |
| Plan, FamilyPlan, BenefitPackage, Benefit, Coverage, Eligibility, FundingAuthorization, SpendingLimit, Budget, Copayment, PatientShortfall, PriorAuthorization | Plans and Coverage | Coverage/funding policy records | Patient/order/payment refs | Eligibility/funding projection | Clinical record ownership by plan | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | Plans | Consent and Audit | Finance/legal | Mixed | REQ-COV-020 |
| Claim, ClaimLine, Adjudication, Remittance | Claims | Claim workflow records | Payment/coverage/patient refs | Claim-support projection | Full clinical record copy in claims | PAYMENT-DATA; limited clinical | Claims | Consent and Audit | Finance/legal | DEFERRED | REQ-COV-022 |
| Schedule, Availability, Appointment | Scheduling | Scheduling records | Patient/provider refs | Appointment summary | Encounter content in Scheduling | INTERNAL; SENSITIVE-PERSONAL-DATA | Scheduling | Consent and Audit | Operations/privacy | PILOT | REQ-DOM-003 |
| Intake, Triage, Encounter, Consultation, ConsultationParticipant, FollowUpPlan | Consultations and Encounters | Encounter lifecycle records | Clinical output refs | Encounter summary | Finalized clinical note source | PROTECTED-CLINICAL-DATA | Encounters | Consent and Audit | Clinical/privacy | PILOT | REQ-DOM-003 |
| ClinicalNote, ClinicalRecord, ClinicalAmendment, Observation, Condition, Allergy, MedicationStatement, CareInstruction | Clinical Records | Clinical record/version records | Encounter/patient refs | Treating summary/referral packet | Finalized clinical source copies | PROTECTED-CLINICAL-DATA | Clinical Records | Consent and Audit | Clinical/legal | PILOT | REQ-LOCK-011 |
| ClinicalIncident, Complaint, PrivacyIncident, SecurityIncident, DataSubjectRequest | Support and Operations / Consent and Audit | Case and incident records | Related entity refs | Redacted support case summary | Direct business source mutation | SECURITY-OPERATIONAL-DATA plus embedded class | Support/Consent | Consent and Audit | Legal/security/privacy | PILOT | REQ-JRN-002 |
| Prescription, PrescriptionItem, MedicationCatalogueItem, DosageInstruction, SubstitutionPermission | Prescriptions | Prescription/version records | Encounter/patient/pharmacy refs | Pharmacy prescription fulfilment view | Prescription source in Pharmacy | PROTECTED-CLINICAL-DATA | Prescriptions | Consent and Audit | Clinical/legal | PILOT | REQ-DOM-005 |
| PharmacyQuote, Quote, Reservation, ServiceOrder, InternalProviderMatchingCandidate, PrePaymentProviderOfferView, OpaqueSelectionToken, ProviderDetailDisclosureDecision, ProviderDetailDisclosureBoundary | Marketplace and Matching | Matching/quote/selection/disclosure records | Provider/order/payment refs | Sanitized pre-payment and authorized post-payment views | Protected provider data in client projections | PAYMENT-DATA; PROVIDER-IDENTITY-LOCATION-DATA | Marketplace | Consent and Audit | Security/privacy | PILOT | REQ-ARC-013 |
| StockReservation, PharmacyOrder, Fulfilment, Dispensing, Delivery, ProofOfDelivery | Pharmacy Fulfilment | Pharmacy fulfilment records | Prescription/order refs | Pharmacy fulfilment view, delivery task view | Prescription authority in Pharmacy | Minimal clinical; payment; location | Pharmacy | Consent and Audit | Operations/legal | PILOT | REQ-DOM-005 |
| DiagnosticOrder, DiagnosticOrderItem, DiagnosticResult, ResultComponent, ReferenceRange, CriticalResult, ResultCorrection, ResultAmendment | Diagnostics | Diagnostic order/result/version records | Encounter/lab refs | Lab fulfilment view, clinical result view | Verified result source in Lab Ops | PROTECTED-CLINICAL-DATA | Diagnostics | Consent and Audit | Clinical/legal | PILOT | REQ-DOM-010 |
| LaboratoryAppointment, Specimen, Accession | Laboratory Operations | Lab operational records | Diagnostic order refs | Lab workflow view | Verified clinical result source after handoff | PROTECTED-CLINICAL-DATA; SECURITY-OPERATIONAL-DATA | Laboratory Operations | Consent and Audit | Lab/legal | PILOT | REQ-DOM-010 |
| Referral, ReferralPriority, ReferralPacket, ReferralOutcome | Referrals | Referral records and packet projection | Encounter/clinical refs | Hospital referral packet | Full clinical record copy in referral | PROTECTED-CLINICAL-DATA | Referrals | Consent and Audit | Clinical/legal | PILOT | REQ-ARC-005 |
| CarePlan, HomeCareVisit, VisitTask, MedicationAdministration, VisitIncident | Home Care | Deferred home-care records | Patient/clinical refs | Home-care task view | Pilot activation without approval | PROTECTED-CLINICAL-DATA | Home Care | Consent and Audit | Clinical/legal | DEFERRED | REQ-DOM-008 |
| Invoice, InvoiceLine, PaymentIntent, Payment, PaymentAuthorization, PaymentCapture, Refund, Reversal, Chargeback, Payout, LedgerAccount, LedgerEntry, Reconciliation, Settlement | Payments and Ledger | Payment and ledger records | Order/funding refs | Finance summary | Clinical content in payment source | PAYMENT-DATA | Payments | Consent and Audit | Finance/legal | PILOT | REQ-DOM-006 |
| ConsentGrant, ConsentWithdrawal, Authorization, AccessIntent, PurposeOfUse, BreakGlassAccess | Consent and Audit | Consent/purpose/access records | Actor/context refs | Consent summary | Consent source in consuming contexts | SECURITY-OPERATIONAL-DATA plus affected class | Consent | Consent and Audit | Privacy/legal | MIXED | REQ-DOM-007 |
| AuditEvent, DomainEvent, IntegrationEvent | Audit owner or publishing context | Audit store for AuditEvent; publishing context for DomainEvent; Integrations for IntegrationEvent transmission | Event refs | Audit/operational projections | Full source documents in event payloads | Minimized varying data | Owning context + audit | Consent and Audit | Legal/security | PILOT | REQ-ARC-012 |
| Analytics aggregate | Analytics | Derived aggregate | Source event/projection refs | Approved reports | Transactional source of truth | DEIDENTIFIED-OR-AGGREGATED-DATA | Analytics | Consent and Audit | Analytics/privacy | PILOT | REQ-ARC-016 |

## Required Source-of-Truth Outcomes

- One canonical Person.
- One canonical Patient.
- Identity and Access owns authentication data.
- Patients and Relationships owns patient relationship authority.
- Organizations and Facilities owns organization and facility master data.
- Credentialing owns credential status.
- Scheduling owns appointment state.
- Consultations and Encounters owns encounter lifecycle.
- Clinical Records owns finalized clinical documentation.
- Prescriptions owns prescription authority.
- Diagnostics owns clinical diagnostic orders and verified clinical results.
- Laboratory Operations owns specimen and processing operations.
- Marketplace owns matching and sanitized offer projections.
- Pharmacy Fulfilment owns inventory reservation and dispensing operations.
- Payments and Ledger owns financial transaction and ledger records.
- Plans and Coverage owns eligibility and benefit rules.
- Claims owns claims and remittance workflow.
- Consent and Audit owns consent authority and canonical append-only audit store.
- Support and Operations owns complaints and operational cases.
- Analytics owns only derived analytical products.
- Integrations owns only adapter and transmission state.
## Redacted Projection Register

| Projection name | Source contexts | Consumer | Permitted fields | Prohibited fields | Refresh method | Consistency expectation | Rebuildability | Authorization requirement | Audit requirement |
|---|---|---|---|---|---|---|---|---|---|
| Patient summary for treating doctor | Patients, Clinical Records, Encounters | Doctor | Patient identity, relevant clinical summary, allergies, medications, encounter context | Payment details, unrelated provider location, full payer records | On authorized care context | Fresh enough for care; policy-defined | Rebuildable from clinical sources | Treating relationship and purpose | Sensitive access audit |
| Pharmacy prescription fulfilment view | Prescriptions, Marketplace, Pharmacy | Pharmacist | Prescription item, dosage, substitution, patient minimum, order ID | Full diagnosis/notes unless approved, other provider offers | On order acceptance | Order-current | Rebuildable | Exact PharmacyOrder authorization | Fulfilment access audit |
| Laboratory diagnostic-order fulfilment view | Diagnostics, Marketplace, Lab Ops | Lab scientist | Test order, specimen needs, patient minimum, booking/order ID | Full clinical record, payer data beyond need | On lab selection/booking | Order-current | Rebuildable | Exact lab order authorization | Fulfilment access audit |
| Hospital referral packet | Referrals, Clinical Records | Hospital coordinator | Minimum referral reason, summary, contact path | Full record unless approved | On referral creation/update | As of referral handoff | Rebuildable | Referral receiver authorization | Referral disclosure audit |
| Employer aggregate utilization view | Plans, Claims, Analytics | Employer admin | Aggregated counts/costs | Patient names, clinical details, provider locations | Periodic aggregate | Eventual | Rebuildable | Employer contract + privacy approval | Report audit |
| HMO eligibility view | Plans, Patients | HMO/admin | Eligibility identifiers, coverage status | Full clinical record | On eligibility check | Near-current policy-defined | Rebuildable | HMO eligibility purpose | Access audit |
| HMO claim-support view | Claims, Payments, Clinical minimum | HMO/admin | Claim lines, minimal support fields | Full notes unless approved | Claim lifecycle | Eventual/claim-current | Rebuildable | Claim purpose authorization | Claim disclosure audit |
| Delivery task view | Pharmacy, Lab Ops, Patients | Delivery participant | Delivery address/contact window/task reference | Diagnosis, full prescription, provider pre-payment hidden fields | On delivery request | Task-current | Rebuildable | Delivery task assignment | Access audit |
| PrePaymentProviderOfferView | Marketplace | Patient client | providerDisplayName, approved price/availability/workflow fields, opaque token | Address, coordinates, distance, branch, map, directions, contact, instructions, IDs, derivable metadata | Generated per match | Current to quote expiry | Rebuildable | Patient/order context | Offer generation audit |
| AuthorizedPostPaymentFulfilmentView | Marketplace, Org, Pharmacy/Lab, Payments | Patient/client/authorized actor | Approved fulfilment details for exact selected provider/order | Other provider/order/patient/tenant data | Generated after policy decision | Current at disclosure | Rebuildable | Exact order/provider/actor/patient/tenant and P00-13 payment policy | Disclosure audit |
| Support case summary | Support plus relevant contexts | Platform support | Redacted case facts and status | Unnecessary clinical/payment/provider details | Case event updates | Eventual | Rebuildable | Support purpose and role | Case access audit |
| Analytics aggregate | Approved source projections | Analytics consumer | Aggregated/de-identified metrics | Direct identifiers, raw payment credentials, clinical documents, provider location pre-payment data | Batch/stream later decision | Eventual | Rebuildable | Analytics approval | Report audit |

## Data That Must Not Be Duplicated

| Data | Rule |
|---|---|
| Authentication secrets | Stay in Identity and Access secret handling; never copied to events/logs/analytics. |
| Raw payment credentials | Do not enter domain storage unless later approved compliant path; never copied to logs/tests. |
| Finalized clinical-note source | Clinical Records owns source; projections are derived. |
| Prescription source | Prescriptions owns source; pharmacy receives fulfilment view only. |
| Verified diagnostic-result source | Diagnostics owns source; Lab Ops may own raw operational artifacts. |
| Patient identity | Patients owns Patient; coverage/sponsor/employer/HMO never duplicate it. |
| Credential status | Credentialing owns status; other contexts consume eligibility projections. |
| Ledger source | Payments and Ledger owns ledger entries. |
| Consent authority | Consent and Audit owns consent records. |
| Provider precise location in pre-payment client projections | Must not exist in client projections, logs, analytics, browser artifacts, maps, or fixtures before payment. |
