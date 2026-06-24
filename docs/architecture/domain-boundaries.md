# NelyoHealth Domain Boundaries

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Architecture lead |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |
| Related decisions | REQ-ARC-001 through REQ-ARC-018 |

## Architecture Position

NelyoHealth begins as a modular monolith with independently owned logical modules inside one deployable backend. A bounded context is a domain ownership boundary, terminology boundary, data-authority boundary, and dependency boundary. It is not automatically a microservice, deployment, database, queue, or repository.

## Bounded Contexts

| Context | Purpose | Canonical language | Owned entities and policies | Commands accepted conceptually | Events published | Events consumed | Data classifications | Upstream dependencies | Downstream consumers | Prohibited responsibilities | Pilot scope | Future extraction signals |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Identity and Access | Person/account authentication and session control. | Person, UserAccount, Session, AccountActivation. | UserAccount, ExternalIdentity, AuthenticationFactor, Session, Device; authentication policy. | Activate account, recover account, revoke sessions. | PersonIdentityCreated, UserAccountActivated, SessionsRevoked. | OrganizationMembershipRevoked. | SENSITIVE-PERSONAL-DATA, AUTHENTICATION-SECRET, SECURITY-OPERATIONAL-DATA. | Consent/Audit for audit intent. | Patients, Organizations, Support. | Patient clinical identity, clinical records, organization membership. | PILOT | High auth scale or regulatory isolation. |
| Organizations and Facilities | Organization, tenant, facility, branch, and service-area master data. | Organization, Tenant, Facility, Branch, ServiceLocation. | Organization/facility master data, tenant config, memberships, service areas. | Register organization, update facility, revoke membership. | OrganizationMembershipGranted, OrganizationMembershipRevoked. | Credential status projections. | INTERNAL, SENSITIVE-PERSONAL-DATA, PROVIDER-IDENTITY-LOCATION-DATA. | Identity for Person reference. | Credentialing, Marketplace, Pharmacy, Lab, Support. | Practitioner credential status and clinical records. | PILOT | Large partner network. |
| Patients and Relationships | Patient continuity and patient relationships. | Patient, PatientProfile, Guardian, ClinicalProxy, Caregiver, SponsorRelationship. | Patient, PatientProfile, relationship authority, emergency contacts. | Create/update profile, grant/revoke relationship. | PatientProfileCreated, DelegationGranted, SponsorRelationshipAccepted. | Account activation. | SENSITIVE-PERSONAL-DATA, PROTECTED-CLINICAL-DATA. | Identity for Person reference. | Scheduling, Clinical, Plans, Support. | Authentication secrets and payment ledger. | PILOT | Patient master data governance scale. |
| Credentialing | Verification and eligibility of practitioners/facilities. | PractitionerCredential, FacilityCredential, CredentialReview. | Credentials, review, expiry, suspension evidence. | Submit/verify/suspend credentials. | PractitionerCredentialVerified, PractitionerSuspended. | Organization/facility changes. | PROVIDER-CREDENTIAL-DATA, REGULATORY-EVIDENCE. | Organizations, Identity. | Scheduling, Consultations, Marketplace, Support. | Practitioner clinical records. | PILOT | Regulatory workload isolation. |
| Scheduling | Availability and appointment state. | Schedule, Availability, Appointment. | Schedules, slots, appointments. | Book/cancel appointment, record no-show. | AppointmentBooked, AppointmentCancelled, AppointmentNoShowRecorded. | Credential eligibility, patient profile. | INTERNAL, SENSITIVE-PERSONAL-DATA. | Patients, Credentialing. | Consultations, Notifications, Support. | Clinical encounter content. | PILOT | Complex capacity optimization. |
| Consultations and Encounters | Encounter lifecycle and consultation coordination. | Encounter, Consultation, Intake, Triage, Disposition. | Encounter lifecycle, participants, waiting-room, disposition. | Start/interrupt/complete encounter, trigger emergency. | EncounterStarted, EncounterCompleted, EmergencyEscalationTriggered. | AppointmentBooked. | PROTECTED-CLINICAL-DATA. | Scheduling, Patients, Credentialing. | Clinical Records, Prescriptions, Diagnostics, Referrals. | Finalized clinical-record source if Clinical Records owns it. | PILOT | High concurrency video/care coordination. |
| Clinical Records | Finalized clinical documentation and longitudinal projections. | ClinicalRecord, ClinicalNote, ClinicalAmendment. | Notes, observations, conditions, allergies, amendments, longitudinal projections. | Finalize/amend clinical note. | ClinicalNoteFinalized, ClinicalNoteAmended. | EncounterCompleted, DiagnosticResultVerified. | PROTECTED-CLINICAL-DATA. | Encounters, Diagnostics. | Treating clinicians, referrals, support projections. | Payment, provider matching, raw lab operations. | PILOT | Clinical repository compliance needs. |
| Prescriptions | Prescription authority and medication order instructions. | Prescription, PrescriptionItem, DosageInstruction. | Prescription issue, cancellation, replacement, items, substitution permission. | Issue/cancel/replace prescription. | PrescriptionIssued, PrescriptionCancelled. | EncounterCompleted. | PROTECTED-CLINICAL-DATA. | Encounters, Clinical Records. | Marketplace, Pharmacy Fulfilment. | Inventory, delivery, payment ledger. | PILOT | Formulary/clinical rules complexity. |
| Diagnostics | Clinical diagnostic orders and verified results. | DiagnosticOrder, DiagnosticResult, CriticalResult. | Diagnostic orders, verified results, result versions, critical status. | Issue order, verify/correct result, acknowledge critical. | DiagnosticOrderIssued, DiagnosticResultVerified, CriticalResultDetected. | EncounterCompleted, SpecimenCollected. | PROTECTED-CLINICAL-DATA. | Encounters, Laboratory Operations. | Lab Ops, Clinical Records, Notifications. | Specimen logistics as source. | PILOT | Lab result governance scale. |
| Marketplace and Matching | Server-side matching, sanitized offers, selected ServiceOrder, disclosure decisions. | MatchingRequest, InternalProviderMatchingCandidate, PrePaymentProviderOfferView, ServiceOrder. | Matching requests, opaque tokens, sanitized pre-payment offers, selected provider binding, disclosure decision. | Request match, generate offer, select provider, evaluate disclosure. | MatchingRequested, ProviderOfferGenerated, ProviderSelected, ProviderDetailDisclosureEligibilityEstablished. | PrescriptionIssued, DiagnosticOrderIssued, payment status. | PAYMENT-DATA, PROVIDER-IDENTITY-LOCATION-DATA, SECURITY-OPERATIONAL-DATA. | Organizations, Pharmacy/Lab projections, Payments. | Client views, Pharmacy, Lab, Audit. | Provider master records, payment ledger, inventory, raw lab records. | PILOT | Marketplace scale or independent risk controls. |
| Pharmacy Fulfilment | Inventory reservation, pharmacy order, dispensing, handover. | StockReservation, PharmacyOrder, Dispensing, Delivery. | Inventory, stock reservation, pharmacy acceptance/rejection, dispensing, handover proof. | Reserve stock, accept/reject order, dispense, request delivery. | StockReserved, PharmacyOrderAccepted, MedicationDispensed. | PrescriptionIssued, ProviderSelected. | Minimal PROTECTED-CLINICAL-DATA, PAYMENT-DATA, provider data. | Prescriptions, Marketplace. | Notifications, Support, Payments. | Prescription authority, full clinical record. | PILOT | Pharmacy network scale. |
| Laboratory Operations | Lab appointment, specimen, accession, processing. | LaboratoryAppointment, Specimen, Accession. | Lab booking, specimen identity, accession, processing, operational artifacts. | Book lab, collect/reject specimen, produce result. | SpecimenCollected, SpecimenRejected. | DiagnosticOrderIssued, LaboratorySelected. | PROTECTED-CLINICAL-DATA, SECURITY-OPERATIONAL-DATA. | Diagnostics, Marketplace. | Diagnostics, Notifications, Support. | Canonical verified DiagnosticResult after handoff. | PILOT | Lab operations scale. |
| Referrals | Routine referral packet, outcome, and closure. | Referral, ReferralPacket, ReferralOutcome. | Referral creation, packet projection, outcome tracking. | Create/accept/complete referral. | ReferralCreated, ReferralCompleted. | EncounterCompleted. | PROTECTED-CLINICAL-DATA. | Encounters, Clinical Records. | Notifications, Support, Integrations. | Full clinical record duplication. | PILOT | Hospital network integration. |
| Home Care | Deferred home-care plan and visit operations. | CarePlan, HomeCareVisit, VisitTask. | Care plan, home visit, visit task, visit incident. | Schedule visit, record missed visit/incident. | HomeCareVisitScheduled, HomeCareIncidentReported. | Referral/encounter outputs. | PROTECTED-CLINICAL-DATA, SENSITIVE-PERSONAL-DATA. | Clinical Records, Scheduling. | Support, Notifications. | Active pilot care unless approved. | DESIGN-NOW-IMPLEMENT-LATER | Home-care rollout. |
| Plans and Coverage | Eligibility, benefits, funding authorization. | Plan, Coverage, Eligibility, PriorAuthorization. | Plans, benefits, eligibility, funding authorization, limits. | Select funding, request/approve funding. | FundingSourceSelected, FundingApprovalGranted. | Patient relationships. | PAYMENT-DATA, SENSITIVE-PERSONAL-DATA. | Patients, Organizations. | Payments, Claims, Marketplace. | Clinical record ownership. | PILOT/deferred by model | Employer/HMO integrations. |
| Claims | Claims, adjudication, remittance workflow. | Claim, ClaimLine, Adjudication, Remittance. | Claim submission/support, adjudication, remittance. | Submit/adjudicate claim. | ClaimSubmitted, RemittanceReceived. | Payment/coverage events. | PAYMENT-DATA; limited clinical. | Plans, Payments. | Finance, HMO reporting. | Full clinical record ownership. | DESIGN-NOW-IMPLEMENT-LATER | HMO claims scale. |
| Payments and Ledger | Financial transaction and ledger authority. | PaymentIntent, Payment, Refund, LedgerEntry. | Payment intents, payments, refunds, payouts, ledger, reconciliation. | Create intent, record status, post ledger, refund. | PaymentIntentCreated, PaymentFailed, RefundCompleted. | FundingSourceSelected, ProviderSelected. | PAYMENT-DATA. | Plans, Marketplace. | Marketplace, Claims, Finance. | Provider-detail access authority and clinical content. | PILOT | Payment volume/risk. |
| Consent and Audit | Consent authority and canonical append-only audit store. | ConsentGrant, Authorization, AuditEvent. | Consent grants/withdrawals, purpose-of-use, break-glass, audit store. | Grant/withdraw consent, record audit intent. | ConsentGranted, BreakGlassAccessUsed, SensitiveRecordAccessed. | Sensitive domain intents. | SECURITY-OPERATIONAL-DATA and affected classes. | All sensitive contexts. | All governance/review consumers. | Business source-of-truth records outside audit. | PILOT | Audit compliance scale. |
| Notifications | Delivery of safe user/staff notifications. | Notification, message, template. | Notification tasks, delivery status, template policy. | Send notification, record delivery failure. | NotificationSent, NotificationFailed. | Domain events. | Minimized copies of source data. | Domain contexts. | Patients, staff, partners. | Source-of-truth clinical/payment/provider data. | PILOT | Messaging volume. |
| Support and Operations | Complaints, incidents, operational cases, orchestration. | Complaint, Incident, SupportCase. | Cases, queues, escalation, remediation tickets. | Open/resolve complaint, escalate incident. | ComplaintOpened, PrivacyIncidentOpened. | All operational signals. | SECURITY-OPERATIONAL-DATA plus embedded classes. | Domain projections. | Operations, product, security. | Direct mutation of another context private storage. | PILOT | Dedicated case system. |
| Analytics | Derived metrics, aggregates, de-identified projections. | Metric, aggregate, report. | Derived metrics and approved aggregates. | Build aggregate, publish report. | AnalyticsAggregateRefreshed. | Approved minimized events/projections. | DEIDENTIFIED-OR-AGGREGATED-DATA. | Domain events/projections. | Product, operations, finance. | Transactional source of truth or operational access. | PILOT | BI platform needs. |
| Integrations | Ports/adapters and partner transmission state. | Adapter, port, webhook receipt. | Adapter config, mapping metadata, delivery state, webhook metadata. | Send/receive partner message. | IntegrationMessageReceived. | Domain commands/events. | Varies; minimized. | Domain-defined ports. | External systems and domains. | Owning business entity represented by vendor response. | PILOT/deferred | Partner integration volume. |

## Required Ownership Rules

- Identity and Access owns UserAccount, ExternalIdentity, AuthenticationFactor, Session, Device, and authentication events; it does not own patient clinical identity, organization membership, or clinical records.
- Patients and Relationships owns Patient, PatientProfile, guardian relationship, clinical proxy relationship, caregiver delegation, family relationship, and emergency contact. Person is canonically owned by Identity and Access; Patients references Person and owns the Patient identity.
- Organizations and Facilities owns Organization, Tenant configuration, Facility, Branch, ServiceLocation, ServiceArea, OrganizationMembership, and FacilityMembership; it does not own practitioner credentials.
- Credentialing owns practitioner credentials, facility credentials, verification reviews, expiry, suspension, and credential evidence metadata; it does not own a practitioner's clinical records.
- Scheduling owns Schedule, Availability, Appointment, and Slot reservation; it does not own the clinical encounter.
- Consultations and Encounters owns encounter lifecycle, consultation participants, waiting-room coordination, and consultation disposition; Clinical Records owns finalized clinical-record content.
- Clinical Records owns ClinicalNote, Observation, Condition, Allergy, MedicationStatement, ClinicalAmendment, and longitudinal clinical-record projections.
- Prescriptions owns Prescription, PrescriptionItem, DosageInstruction, SubstitutionPermission, and prescription amendment/cancellation; it does not own inventory or delivery.
- Diagnostics owns DiagnosticOrder, verified DiagnosticResult, result versions, and CriticalResult status.
- Laboratory Operations owns specimen, accession, processing, and raw operational artifacts, then hands verified clinical result authority to Diagnostics.
- Marketplace owns MatchingRequest, Quote, OpaqueSelectionToken, PrePaymentProviderOfferView, selected ServiceOrder, and provider-detail disclosure decision/eligibility. It does not own provider master records, facility master records, payment ledger, pharmacy inventory, or lab operational records.
- Payments and Ledger owns PaymentIntent, Payment, Refund, Payout, LedgerAccount, LedgerEntry, Reconciliation, and Settlement record. Payment status is an input to exact-order provider disclosure, not the access authority itself.
- Consent and Audit owns ConsentGrant, ConsentWithdrawal, PurposeOfUse, BreakGlassAccess, and canonical append-only AuditEvent store. Each context produces audit intent for its own sensitive actions.
- Analytics owns derived metrics, approved aggregates, and de-identified projections only.
- Integrations owns vendor adapter configuration, partner message delivery state, mapping metadata, and webhook receipt metadata only.

## Dependency Rules

- Analytics is downstream-only and non-authoritative.
- Notifications is downstream from domain contexts and stores minimized message state only.
- Support and Operations may orchestrate approved actions but must not directly mutate another context's private storage.
- Integrations implements ports defined by domain contexts.
- Domain contexts must not depend on vendor SDK types.
- Payments must not depend on full clinical content.
- Marketplace depends on redacted provider capability and inventory projections and must not expose provider location before disclosure policy passes.
- Pharmacy and Laboratory contexts receive only order-specific minimum-necessary patient data.
- Employer and HMO contexts do not own patient identity or clinical records.
- No context may query another context's private tables as an implementation assumption.
- Conceptual cross-context reads use explicit interfaces or read models.

## Dependency Cycle Prevention

| Risk | Conceptual resolution |
|---|---|
| Patient and identity | Identity owns Person/account; Patients owns Patient and references Person. |
| Encounter and clinical records | Encounter emits disposition; Clinical Records owns finalized documentation. |
| Prescription and pharmacy fulfilment | Prescription authority precedes PharmacyOrder; pharmacy status never mutates Prescription silently. |
| Diagnostics and laboratory operations | Diagnostics owns order/result; Lab Ops owns specimen/process and hands off verified result. |
| Marketplace and payments | Marketplace owns selected ServiceOrder/disclosure decision; Payments supplies scoped status. |
| Plans and payments | Plans authorize funding; Payments records transaction and ledger. |
| Support and all contexts | Support uses redacted projections and commands, not private-table writes. |
| Consent and all sensitive contexts | Consent/Audit provides policy/audit interfaces; contexts keep their own business authority. |
| Analytics and operational contexts | Analytics consumes derived projections only and never feeds operational authority. |

## External Adapter Boundary

External systems are accessed through ports and adapters only. Conceptual ports include identity provider, video provider, payment provider, map and geocoding provider, messaging provider, delivery provider, employer integration, HMO integration, pharmacy integration, laboratory integration, hospital integration, provider credential registry, object storage, malware scanning, and analytics export. No vendor is selected in P00-06.

## Transaction Boundaries

Atomic local transaction candidates include balanced ledger entries for one movement, finalized clinical-record version plus immutable version reference, prescription issue plus items/signature metadata, diagnostic-result verification plus result version, consent grant/withdrawal plus audit or outbox intent, organization membership revocation plus access-removal intent, selected provider binding to one ServiceOrder, internally authoritative stock reservation, account activation link to approved Person/Patient, and audit/outbox intent with sensitive domain change.

External partner operations are never claimed to be in the same local database transaction.

Acceptable eventual consistency includes email/SMS/push, analytics, search/discovery indexes, de-identified reporting, employer aggregate reports, HMO reporting projections, provider availability projections, partner delivery callbacks, read-model refresh, and noncritical support dashboards.

Conceptual process-manager candidates include registration/identity review, appointment/payment, consultation/disposition, prescription to pharmacy fulfilment, diagnostic order to verified result/clinician review, payment to exact-order provider-detail disclosure, delivery recovery, referral outcome, emergency escalation, refund/reconciliation, and provider suspension with active-work reassignment.
