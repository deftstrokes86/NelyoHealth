# NelyoHealth Canonical Glossary

## Document Control

| Field | Value |
|---|---|
| Document title | Canonical terminology, data classification, and conceptual architecture glossary |
| Codex prompt ID | P00-06 |
| Complete Breakdown work packages | P00-07 Domain glossary and data classification; P00-08 Conceptual domain model and boundaries |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Product owner + architecture lead |
| Review state | PROPOSED |
| Required reviewers | Product, clinical, privacy, security, finance, operations, architecture |
| Last updated | 2026-06-24 |
| Related decisions | REQ-LOCK-001 through REQ-LOCK-013; REQ-DOM-001 through REQ-DOM-012; REQ-ARC-001 through REQ-ARC-018 |
| Related open questions | OQ-00-90 through OQ-00-110 |
| Related source documents | NelyoHealth_Phase_0_Complete_Breakdown.md; NelyoHealth_Phase_0_Codex_Prompt_Pack.md; NelyoHealth_Build_Implementation_Map_for_Codex.md |

## Glossary Rules

- Each term has one canonical meaning.
- Definitions are direct and must not be circular.
- Synonyms point to one canonical term.
- Deprecated or ambiguous terms are identified.
- Business-facing labels may differ from canonical domain terms only when mapped explicitly.
- `Member` must always be qualified as `OrganizationMember`, `FacilityMember`, `FamilyPlanMember`, `CoverageMember`, `HMOMember`, or `PlanMember`.
- A database table name is not automatically a domain definition.
- A vendor term is not automatically a domain term.
- Provider-disclosure terms are conceptual boundaries, not final API names or class names.

## Canonical Glossary Fields

Each row includes canonical term, definition, category, synonyms or aliases, deprecated or prohibited ambiguous uses, distinction from related terms, owning bounded context, data classification implications, pilot scope, and related decisions.

## Canonical Glossary

| Canonical term | Definition | Category | Synonyms or aliases | Deprecated or prohibited ambiguous uses | Distinction from related terms | Owning bounded context | Data classification implications | Pilot scope | Related decisions |
|---|---|---|---|---|---|---|---|---|---|
| Person | One real human identity across all relationships. | Identity | Human | User, account, member | Distinct from login and care-subject identity. | Identity and Access | SENSITIVE-PERSONAL-DATA | PILOT | REQ-LOCK-001; REQ-DOM-001 |
| UserAccount | Authentication and interactive access for a Person. | Identity | Login account | Patient account | Does not create Patient by itself. | Identity and Access | SENSITIVE-PERSONAL-DATA; AUTHENTICATION-SECRET refs | PILOT | REQ-DOM-001 |
| ExternalIdentity | External identity assertion or provider subject. | Identity | IdP subject | Vendor user type | Supports proofing; does not own Person. | Identity and Access | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-ARC-006 |
| AuthenticationFactor | Secret or factor used to prove account control. | Identity | MFA factor | Clinical credential | Separate from PractitionerCredential. | Identity and Access | AUTHENTICATION-SECRET | PILOT | REQ-DOM-011 |
| Session | Time-bound authenticated interaction. | Identity | Login session | Encounter | Access state, not care episode. | Identity and Access | SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-001 |
| Device | Client device associated with access or recovery. | Identity | Phone, browser | Medical device | Access/security object, not clinical measurement. | Identity and Access | SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-011 |
| IdentityVerification | Evidence review for identity or account linkage. | Identity | Proofing | Account creation | Supports activation; not Patient creation. | Identity and Access | SENSITIVE-PERSONAL-DATA; REGULATORY-EVIDENCE | PILOT | REQ-GOV-003 |
| AccountActivation | Linking UserAccount to verified Person and existing/newly approved Patient. | Identity | Onboarding | Duplicate patient creation | Must preserve longitudinal Patient. | Identity and Access | SENSITIVE-PERSONAL-DATA | PILOT | REQ-DOM-001 |
| AccountRecovery | Restoring access while preserving identity. | Identity | Lost-phone recovery | New account as new patient | Recovery must not create duplicate Patient. | Identity and Access | SENSITIVE-PERSONAL-DATA; SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-001 |
| Patient | Longitudinal subject-of-care identity for a Person. | Patient | Care subject | Member, account | One per cared-for Person. | Patients and Relationships | PROTECTED-CLINICAL-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-LOCK-001 |
| PatientProfile | Demographic and care-context summary for Patient. | Patient | Patient details | ClinicalRecord | Summary, not full record source. | Patients and Relationships | SENSITIVE-PERSONAL-DATA; sometimes PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-001 |
| ProspectivePatient | Person being invited or evaluated before active care. | Patient | Invitee | Patient if not activated | Becomes Patient only through approved linkage. | Patients and Relationships | SENSITIVE-PERSONAL-DATA | PILOT | REQ-LOCK-001 |
| FamilyPlanMember | Person/Patient participating in FamilyPlan. | Relationship | Family member | Member | Funding/admin link, not clinical access. | Plans and Coverage | SENSITIVE-PERSONAL-DATA | PILOT | REQ-DOM-002 |
| CoverageMember | Person/Patient eligible under Coverage. | Relationship | Covered member | Member | Eligibility, not clinical ownership. | Plans and Coverage | SENSITIVE-PERSONAL-DATA; PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| HMOMember | Person/Patient recognized by HMO coverage. | Relationship | HMO enrollee | Member | HMO eligibility/claims, not full record access. | Plans and Coverage | SENSITIVE-PERSONAL-DATA; PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| OrganizationMember | Person associated with Organization. | Relationship | Staff, employee | Member | Organization role, not Patient identity. | Organizations and Facilities | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| FacilityMember | Person associated with Facility or Branch. | Relationship | Facility staff | Member | Facility-scoped role only. | Organizations and Facilities | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| PlanMember | Qualified plan participant term. | Relationship | Plan participant | Member | Must resolve to specific member type. | Plans and Coverage | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| Beneficiary | Person/Patient receiving funded care. | Relationship | Sponsored beneficiary | Dependent by default | Benefit recipient; not necessarily payer. | Plans and Coverage | SENSITIVE-PERSONAL-DATA; PAYMENT-DATA | PILOT | REQ-COV-020 |
| Dependent | Person linked to another actor by legal, family, or coverage policy. | Relationship | Child, supported person | Beneficiary | Does not imply Guardian authority. | Patients and Relationships | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| Guardian | Actor with legal/policy authority for another person. | Relationship | Parent/guardian | Payer, sponsor | Authority is scoped and not financial by default. | Patients and Relationships | SENSITIVE-PERSONAL-DATA; authorized clinical | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| ClinicalProxy | Actor with scoped clinical decision/access authority. | Relationship | Proxy | Guardian, caregiver | Clinical authority without automatic payer status. | Patients and Relationships | PROTECTED-CLINICAL-DATA where authorized | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| Caregiver | Actor assisting logistics or support. | Relationship | Carer | ClinicalProxy by default | No automatic clinical decision authority. | Patients and Relationships | SENSITIVE-PERSONAL-DATA; limited clinical | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| Delegation | Explicit assignment of a capability. | Governance | Delegate access | Consent, Authorization | Grants capability; runtime access still authorized. | Consent and Audit | Varies by scope | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| EmergencyContact | Contact used under emergency policy. | Relationship | ICE contact | Caregiver by default | No routine record access. | Patients and Relationships | SENSITIVE-PERSONAL-DATA | PILOT | REQ-LOCK-010 |
| Sponsor | Actor funding or approving another person's care. | Funding | Diaspora sponsor | Clinical proxy | Financial authority unless separately granted. | Plans and Coverage | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-COV-020 |
| Payer | Actor or source responsible for payment. | Funding | Payor | Sponsor with clinical rights | Payment does not grant clinical access. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-LOCK-002 |
| Organization | Legal or operating entity. | Organization | Company, provider org | Tenant | Entity, not isolation context. | Organizations and Facilities | INTERNAL; sometimes SENSITIVE-PERSONAL-DATA | PILOT | REQ-ARC-003 |
| Tenant | Platform isolation and authorization context. | Organization | Workspace | Organization | Isolation boundary, not necessarily legal entity. | Organizations and Facilities | SECURITY-OPERATIONAL-DATA | PILOT | REQ-GOV-007 |
| Facility | Physical or operating care site. | Organization | Clinic, lab site | Branch | Site grouping; may have branches. | Organizations and Facilities | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-ARC-003 |
| Branch | Specific operating subdivision/location. | Organization | Outlet | Facility | Protected pre-payment when pharmacy/lab. | Organizations and Facilities | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-LOCK-004 |
| ServiceLocation | Place/point for service delivery or collection. | Organization | Pickup point | ServiceArea | May reveal location; protected pre-payment. | Organizations and Facilities | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-LOCK-004 |
| ServiceArea | Geographic availability area. | Organization | Coverage area | ServiceLocation | Area, not exact service point. | Organizations and Facilities | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-LOCK-004 |
| OrganizationMembership | Link between Person and Organization. | Organization | Staff membership | OrganizationMember as entity | Relationship record for role/status. | Organizations and Facilities | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-GOV-005 |
| FacilityMembership | Link between Person and Facility. | Organization | Facility staff link | FacilityMember as entity | Narrower than OrganizationMembership. | Organizations and Facilities | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-GOV-017 |
| Practitioner | Person acting in credentialed health role. | Credentialing | Clinician | Provider organization | Human actor, not organization. | Credentialing | PROVIDER-CREDENTIAL-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-ARC-003 |
| PractitionerRole | Specific role a Practitioner performs. | Credentialing | Doctor role | Practitioner identity | Role is contextual and scoped. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-GOV-006 |
| Doctor | PractitionerRole for medical doctor. | Credentialing | Physician | Provider | Role, not separate identity. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-DOM-002 |
| Pharmacist | PractitionerRole for pharmacy duties. | Credentialing | Pharmacy professional | Pharmacy org | Role, not PharmacyOrder. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-DOM-002 |
| LaboratoryScientist | PractitionerRole for laboratory work. | Credentialing | Lab scientist | Laboratory | Role, not lab organization. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-DOM-002 |
| Nurse | PractitionerRole for nursing care. | Credentialing | Nurse | HomeCareWorker | Role requires approved scope. | Credentialing | PROVIDER-CREDENTIAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| HomeCareWorker | Role for home-care visits. | Credentialing | Care worker | Nurse | Deferred role; not automatically clinical authority. | Credentialing | PROVIDER-CREDENTIAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-002 |
| ProviderOrganization | Organization providing services. | Credentialing | Provider, supplier | Practitioner | Organization, not individual. | Organizations and Facilities | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-ARC-003 |
| PractitionerCredential | Evidence/status for PractitionerRole. | Credentialing | Licence | Account permission | Credential status, not login permission. | Credentialing | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | PILOT | REQ-ARC-003 |
| FacilityCredential | Evidence/status for Facility or provider org. | Credentialing | Facility licence | Facility master data | Credential record, not facility source. | Credentialing | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | PILOT | REQ-ARC-003 |
| CredentialReview | Review of credential evidence. | Credentialing | Verification | Clinical review | Credentialing process only. | Credentialing | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | PILOT | REQ-ARC-003 |
| CredentialSuspension | Restriction on credentialed work. | Credentialing | Suspension | Account suspension | Role eligibility, not Person identity. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-ARC-003 |
| CredentialExpiry | Time/condition when credential lapses. | Credentialing | Expiration | Suspension | Time-based lapse, not disciplinary action by default. | Credentialing | PROVIDER-CREDENTIAL-DATA | PILOT | REQ-ARC-003 |
| Plan | Arrangement defining benefits, funding, eligibility, or administration. | Funding | Scheme | CarePlan | Financial/admin plan, not clinical care plan. | Plans and Coverage | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-COV-020 |
| FamilyPlan | Plan for family funding/admin. | Funding | Family account | Family clinical record | Does not own clinical records. | Plans and Coverage | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-COV-002 |
| BenefitPackage | Set of benefits under a plan. | Funding | Package | Clinical entitlement | Funding package, not clinical approval. | Plans and Coverage | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-010 |
| Benefit | Funded or covered service category. | Funding | Covered item | Treatment approval | Financial/service scope, not care decision. | Plans and Coverage | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-010 |
| Coverage | Active eligibility relationship. | Funding | Cover | Clinical access | Coverage does not grant clinical record access. | Plans and Coverage | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-020 |
| Eligibility | Determination that Coverage may apply. | Funding | Entitlement check | Authorization to treat | Financial/admin input only. | Plans and Coverage | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| FundingSource | Source used to pay. | Funding | Payment source | Clinical sponsor | Does not own care record. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-COV-012 |
| FundingAuthorization | Approval to use a funding source. | Funding | Sponsor approval | Clinical authorization | Financial approval only. | Plans and Coverage | PAYMENT-DATA | PILOT | REQ-COV-012 |
| SpendingLimit | Constraint on spending by source/person/category. | Funding | Limit | Clinical limit | Money limit, not care limit. | Plans and Coverage | PAYMENT-DATA | PILOT | REQ-COV-005 |
| Budget | Planned available amount. | Funding | Allowance | Wallet | Not stored-value custody unless approved. | Plans and Coverage | PAYMENT-DATA | PILOT | REQ-COV-005 |
| Copayment | Patient share of a covered cost. | Funding | Copay | Clinical approval | Financial shortfall, not clinical decision. | Payments and Ledger | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-016 |
| PatientShortfall | Amount not covered by selected funding. | Funding | Shortfall | Care denial by default | Routine payment issue; emergency remains unblocked. | Payments and Ledger | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-016 |
| PriorAuthorization | Payer/plan preapproval for funding. | Funding | Preauth | Clinical authorization | Coverage decision, not clinical decision. | Plans and Coverage | PAYMENT-DATA; limited clinical support | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| Claim | Request for reimbursement/settlement. | Funding | Insurance claim | Clinical record | Uses minimum necessary support data. | Claims | PAYMENT-DATA; limited PROTECTED-CLINICAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| ClaimLine | Itemized claim component. | Funding | Claim item | InvoiceLine | Claim workflow, not billing line. | Claims | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| Adjudication | Decision on claim amount/denial/adjustment. | Funding | Claim decision | Clinical decision | Financial review, not care decision. | Claims | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| Remittance | Claim/payment settlement explanation. | Funding | Remittance advice | Payment | Explains settlement; not transaction source. | Claims | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-COV-022 |
| Schedule | Resource availability plan. | Care | Timetable | Appointment | Capacity plan, not booking. | Scheduling | INTERNAL | PILOT | REQ-ARC-003 |
| Availability | Bookable capacity. | Care | Slot availability | Appointment | Capacity, not commitment. | Scheduling | INTERNAL | PILOT | REQ-ARC-003 |
| Appointment | Scheduled commitment. | Care | Booking | Encounter | May lead to Encounter. | Scheduling | SENSITIVE-PERSONAL-DATA; limited clinical | PILOT | REQ-DOM-003 |
| Intake | Pre-encounter information capture. | Care | Previsit form | Triage | Collects facts; Triage routes risk. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-003 |
| Triage | Clinical/rules-based urgency and suitability routing. | Care | Screening | Diagnosis | Routing, not final diagnosis. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-010 |
| Encounter | Care episode linking patient, practitioner, time, and disposition. | Care | Visit | Appointment, Consultation | Lifecycle container. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-003 |
| Consultation | Synchronous or encounter-linked clinician interaction. | Care | Video visit, audio fallback | Encounter | Interaction modality within/around Encounter. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-003 |
| ConsultationParticipant | Authorized participant in Consultation. | Care | Attendee | Payer by default | Participation is scoped. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-003 |
| Observation | Clinical fact observed/measured. | Care | Finding | DiagnosticResult | Clinical fact, not necessarily lab result. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| Condition | Clinical problem or diagnosis. | Care | Diagnosis | Complaint | Clinical state, not support case. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| Allergy | Allergy/intolerance clinical record. | Care | Allergy record | Alert only | Clinical data requiring integrity. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| MedicationStatement | Medication use/history statement. | Care | Current medication | Prescription | Describes use; does not authorize dispense. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| ClinicalNote | Signed/draft clinical note. | Care | Doctor note | ClinicalRecord | One item in ClinicalRecord. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| ClinicalRecord | Longitudinal collection/projection of clinical data. | Care | Medical record | ClinicalNote | Broader than one note. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-011 |
| ClinicalAmendment | Versioned correction/addition to finalized record. | Care | Addendum | Silent overwrite | Preserves history. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-011 |
| FollowUpPlan | Clinician-defined next steps. | Care | Follow-up | Appointment | Plan may create tasks/bookings. | Consultations and Encounters | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-003 |
| CareInstruction | Patient/caregiver care instruction. | Care | Advice | Emergency facility guarantee | Clinical communication. | Clinical Records | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-004 |
| ClinicalIncident | Safety/clinical quality event. | Care | Safety incident | Complaint only | Clinical governance case. | Support and Operations | PROTECTED-CLINICAL-DATA; SECURITY-OPERATIONAL-DATA | PILOT | REQ-JRN-002 |
| Prescription | Clinician-authorized medication order. | Pharmacy | Rx | PharmacyOrder | Clinical authority, not fulfilment. | Prescriptions | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-005 |
| PrescriptionItem | Medication line in Prescription. | Pharmacy | Rx item | InvoiceLine | Clinical line, not billing line. | Prescriptions | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-005 |
| MedicationCatalogueItem | Medication catalogue concept. | Pharmacy | Medicine entry | Inventory item | Catalogue, not stock. | Prescriptions | INTERNAL; PROTECTED-CLINICAL-DATA where clinical | PILOT | OQ-00-26 |
| DosageInstruction | Dosing directions. | Pharmacy | Sig | Delivery instruction | Clinical instruction. | Prescriptions | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-005 |
| SubstitutionPermission | Prescriber permission/prohibition for substitution. | Pharmacy | Substitution flag | Pharmacy-only decision | Requires clinical authority. | Prescriptions | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-005 |
| PharmacyQuote | Pharmacy-specific commercial offer. | Pharmacy | Medicine quote | Prescription | Commercial offer, not clinical authority. | Marketplace and Matching | PAYMENT-DATA; controlled provider data | PILOT | REQ-DOM-005 |
| Quote | Commercial offer/price/availability representation. | Marketplace | Offer | Order, Invoice | Pre-order offer. | Marketplace and Matching | PAYMENT-DATA; INTERNAL | PILOT | REQ-DOM-005 |
| Reservation | Temporary hold on capacity/stock/quote. | Marketplace | Hold | Order | Expires; not fulfilment. | Marketplace and Matching | INTERNAL; PAYMENT-DATA | PILOT | REQ-DOM-005 |
| StockReservation | Hold against pharmacy inventory. | Pharmacy | Stock hold | Prescription | Inventory hold, not clinical authority. | Pharmacy Fulfilment | INTERNAL; PAYMENT-DATA | PILOT | REQ-DOM-005 |
| PharmacyOrder | Operational pharmacy fulfilment order. | Pharmacy | Medicine order | Prescription | Fulfils Prescription. | Pharmacy Fulfilment | Minimal clinical; PAYMENT-DATA | PILOT | REQ-DOM-005 |
| ServiceOrder | Selected-provider service attempt. | Marketplace | Order | Quote, Payment | One selected provider/order context. | Marketplace and Matching | PAYMENT-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-DOM-005 |
| Fulfilment | Execution of accepted ServiceOrder. | Marketplace | Completion | Delivery only | May include dispense, specimen, delivery, handover. | Service context | Varies | PILOT | REQ-DOM-005 |
| Dispensing | Pharmacist preparation/release of medication. | Pharmacy | Medicine dispense | Delivery | Pharmacy action, not logistics. | Pharmacy Fulfilment | Minimal clinical | PILOT | REQ-DOM-005 |
| Delivery | Logistics movement task. | Pharmacy | Courier task | Fulfilment | Needs logistics data, not diagnosis. | Pharmacy Fulfilment / Integrations | SENSITIVE-PERSONAL-DATA; location data | PILOT | REQ-DOM-008 |
| ProofOfDelivery | Evidence of completed handover. | Pharmacy | POD | Clinical outcome | Operational evidence. | Pharmacy Fulfilment | SENSITIVE-PERSONAL-DATA; SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-008 |
| DiagnosticOrder | Clinician order for diagnostic testing. | Diagnostics | Lab order | DiagnosticResult | Test request. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-010 |
| DiagnosticOrderItem | Requested test line. | Diagnostics | Test item | ResultComponent | Requested test, not result line. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-010 |
| LaboratoryAppointment | Lab operational booking. | Diagnostics | Lab booking | Appointment | Lab-specific operation. | Laboratory Operations | Minimal clinical; SENSITIVE-PERSONAL-DATA | PILOT | REQ-DOM-010 |
| Specimen | Biological sample for testing. | Diagnostics | Sample | Result | Material sample, not clinical result. | Laboratory Operations | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-010 |
| Accession | Lab intake/chain-of-custody record. | Diagnostics | Lab accession | Patient identity | Operational lab identifier. | Laboratory Operations | PROTECTED-CLINICAL-DATA; SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-010 |
| DiagnosticResult | Verified clinical test outcome. | Diagnostics | Lab result | Result generic | Verified/versioned clinical output. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-011 |
| ResultComponent | Measurement/result line. | Diagnostics | Component | Observation by default | Part of result. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-010 |
| ReferenceRange | Interpretive range. | Diagnostics | Normal range | Diagnosis | Interpretation aid, not diagnosis. | Diagnostics | PROTECTED-CLINICAL-DATA; REGULATORY-EVIDENCE where sourced | PILOT | REQ-DOM-010 |
| CriticalResult | Result requiring urgent acknowledgement. | Diagnostics | Panic result | Emergency by default | Triggers escalation policy. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-010 |
| ResultCorrection | Correction action for incorrect result. | Diagnostics | Corrected result | Overwrite | Creates version/amendment. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-011 |
| ResultAmendment | Versioned amendment to DiagnosticResult. | Diagnostics | Addendum | Silent edit | Preserves prior versions. | Diagnostics | PROTECTED-CLINICAL-DATA | PILOT | REQ-LOCK-011 |
| Referral | Clinician handoff to other provider/facility. | Referral | Specialist referral | Emergency transfer | Routine/urgent handoff, not emergency flow by default. | Referrals | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-008 |
| ReferralPriority | Priority of referral. | Referral | Urgency | Queue order only | Clinical routing priority. | Referrals | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-008 |
| ReferralPacket | Minimum-necessary referral information. | Referral | Referral summary | Full record | Redacted projection, not full ClinicalRecord. | Referrals | PROTECTED-CLINICAL-DATA | PILOT | REQ-ARC-005 |
| ReferralOutcome | Outcome of referral process. | Referral | Referral result | DiagnosticResult | Handoff outcome, not lab result. | Referrals | PROTECTED-CLINICAL-DATA | PILOT | REQ-DOM-008 |
| CarePlan | Structured ongoing/home-care plan. | Home care | Plan of care | Coverage plan | Clinical care plan, not funding. | Home Care | PROTECTED-CLINICAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-008 |
| HomeCareVisit | Scheduled home-care event. | Home care | Home visit | Appointment | Deferred care visit. | Home Care | PROTECTED-CLINICAL-DATA; SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-008 |
| VisitTask | Task performed during HomeCareVisit. | Home care | Home task | Clinical order by default | Must trace to approved care plan. | Home Care | PROTECTED-CLINICAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-008 |
| MedicationAdministration | Recorded administration of medication. | Home care | Med admin | Prescription | Action record, not prescription authority. | Home Care | PROTECTED-CLINICAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-008 |
| VisitIncident | Incident during HomeCareVisit. | Home care | Home-care incident | Complaint only | May trigger clinical/privacy case. | Home Care | PROTECTED-CLINICAL-DATA; SECURITY-OPERATIONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-JRN-002 |
| Invoice | Billing document. | Payment | Bill | Quote | Billing request, not offer. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| InvoiceLine | Itemized billing line. | Payment | Bill item | PrescriptionItem | Financial line, not clinical line. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| PaymentIntent | Payment initiation for scoped amount/order. | Payment | Payment request | Payment | Intent, not confirmed transaction. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| Payment | Recorded payment transaction outcome. | Payment | Transaction | LedgerEntry | Transaction status, not accounting entry. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| PaymentAuthorization | Payment hold/approval that is not final success. | Payment | Auth | Successful payment | Alone does not unlock provider details. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-PAY-001 |
| PaymentCapture | Capture of funds after authorization. | Payment | Capture | Settlement | Finality unresolved until P00-13. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-PAY-001 |
| Refund | Return of funds. | Payment | Money back | Reversal, Chargeback | Platform/payment return path. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| Reversal | Void/undo of transaction. | Payment | Void | Refund | Distinct processor/ledger undo path. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-PAY-003 |
| Chargeback | Dispute-led payment reversal. | Payment | Dispute | Refund | Dispute/legal path. | Payments and Ledger | PAYMENT-DATA; REGULATORY-EVIDENCE | PILOT | REQ-PAY-004 |
| Payout | Disbursement to provider/partner. | Payment | Settlement payout | Remittance | Money movement, not claim explanation. | Payments and Ledger | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-006 |
| LedgerAccount | Accounting account. | Payment | Ledger account | Wallet | Accounting construct, not user wallet. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-ARC-010 |
| LedgerEntry | Immutable accounting entry. | Payment | Journal entry | Payment | Balanced accounting movement. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-ARC-010 |
| Reconciliation | Matching financial records. | Payment | Settlement matching | Clinical review | Financial consistency process. | Payments and Ledger | PAYMENT-DATA | PILOT | REQ-DOM-006 |
| Settlement | Financial settlement completion. | Payment | Final settlement | Successful payment | Not approved disclosure event yet. | Payments and Ledger | PAYMENT-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-PAY-001 |
| ConsentGrant | Consent for defined purpose/scope. | Governance | Consent | Authorization | Informs policy; does not itself execute access. | Consent and Audit | Varies by scope | PILOT | REQ-DOM-007 |
| ConsentWithdrawal | Withdrawal/limit of prior consent. | Governance | Revoke consent | Deletion by default | Affects future processing subject to retention law. | Consent and Audit | SENSITIVE-PERSONAL-DATA | PILOT | REQ-DOM-007 |
| Authorization | Runtime/policy access decision. | Governance | Access decision | Consent, Delegation | Evaluates actor, purpose, scope, context. | Consent and Audit / owning context | SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-007 |
| AccessIntent | Declared purpose for access. | Governance | Purpose | Role | Purpose signal, not permission alone. | Consent and Audit | SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-007 |
| PurposeOfUse | Policy category for processing/access. | Governance | Use purpose | Consent | Defines reason, not actor. | Consent and Audit | SECURITY-OPERATIONAL-DATA | PILOT | REQ-DOM-007 |
| BreakGlassAccess | Exceptional audited urgent access. | Governance | Emergency access | Admin override | Time-bound and reviewed. | Consent and Audit | PROTECTED-CLINICAL-DATA; SECURITY-OPERATIONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-GOV-014 |
| AuditEvent | Append-only evidence of action. | Governance | Audit log | DomainEvent | Evidence, not business entity. | Consent and Audit | SECURITY-OPERATIONAL-DATA; varies | PILOT | REQ-ARC-012 |
| DomainEvent | Business fact emitted by a domain context. | Governance | Business event | AuditEvent | Domain coordination fact. | Owning context | Minimized varying data | PILOT | REQ-ARC-009 |
| IntegrationEvent | External/cross-boundary adapted event. | Governance | Partner event | DomainEvent | Adapter-facing minimized message. | Integrations | Minimized varying data | DESIGN-NOW-IMPLEMENT-LATER | REQ-ARC-006 |
| Complaint | Support case. | Governance | Support complaint | ClinicalIncident | Operational/support case. | Support and Operations | SECURITY-OPERATIONAL-DATA; possible clinical | PILOT | REQ-JRN-002 |
| PrivacyIncident | Data handling/disclosure incident. | Governance | Data incident | SecurityIncident | Privacy impact focus. | Support and Operations / Consent and Audit | SECURITY-OPERATIONAL-DATA; affected data class | PILOT | REQ-JRN-002 |
| SecurityIncident | System security incident. | Governance | Security event | PrivacyIncident | Security impact focus. | Support and Operations / Security | SECURITY-OPERATIONAL-DATA | PILOT | REQ-JRN-002 |
| DataSubjectRequest | Data rights request. | Governance | DSR | Complaint | Privacy/legal workflow. | Consent and Audit | SENSITIVE-PERSONAL-DATA | DESIGN-NOW-IMPLEMENT-LATER | REQ-DOM-007 |
| InternalProviderMatchingCandidate | Server-side full matching candidate. | Disclosure | Internal candidate | Pre-payment offer | May include internal protected data; never pre-payment client serialized. | Marketplace and Matching | PROVIDER-IDENTITY-LOCATION-DATA; INTERNAL | PILOT | REQ-LOCK-004; REQ-ARC-014 |
| PrePaymentProviderOfferView | Sanitized pre-payment client offer. | Disclosure | Pre-payment offer | Matching candidate | Only providerDisplayName and approved non-identifying fields. | Marketplace and Matching | PAYMENT-DATA plus field allowance | PILOT | REQ-LOCK-003; REQ-ARC-014 |
| AuthorizedPostPaymentFulfilmentView | Authorized post-payment fulfilment detail view. | Disclosure | Post-payment provider view | Generic provider record | Exact order/provider/actor/patient/tenant scoped. | Marketplace and Matching | PROVIDER-IDENTITY-LOCATION-DATA; SENSITIVE-PERSONAL-DATA | PILOT | REQ-LOCK-006; REQ-ARC-015 |
| providerDisplayName | Approved pre-payment display name. | Disclosure | Display name | Legal/branch name by default | Field-level allowance only. | Marketplace and Matching | PROVIDER-IDENTITY-LOCATION-DATA with explicit allowance | PILOT | REQ-LOCK-003; REQ-DOM-010 |
| OpaqueSelectionToken | Non-derivable scoped selection token. | Disclosure | Offer token | Provider ID | Cannot reveal provider identity/location. | Marketplace and Matching | SECURITY-OPERATIONAL-DATA; INTERNAL | PILOT | REQ-LOCK-004; REQ-ARC-015 |
| ProviderDetailDisclosureDecision | Server-side decision to expose provider details. | Disclosure | Disclosure eligibility | Generic payment success | Deny-by-default exact scope decision. | Marketplace and Matching | SECURITY-OPERATIONAL-DATA; PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-LOCK-007; REQ-PAY-001 |
| ProviderDetailDisclosureBoundary | Server-side boundary blocking protected pre-payment provider data. | Disclosure | Disclosure firewall | UI hiding | Projection/sanitization boundary, not rendering trick. | Marketplace and Matching | PROVIDER-IDENTITY-LOCATION-DATA | PILOT | REQ-LOCK-005; REQ-ARC-013 |

## Required Distinctions

| Distinction | Canonical difference | Rule |
|---|---|---|
| Person vs UserAccount vs Patient | Person is human identity; UserAccount is authentication; Patient is subject-of-care identity. | Account creation/recovery must not duplicate Patient. |
| Role vs relationship vs membership vs coverage | Role is capability; relationship is association; membership is participation; coverage is benefit eligibility. | None implies clinical access by default. |
| Payer vs sponsor vs beneficiary | Payer provides money; Sponsor funds/approves for another; Beneficiary receives funded care. | Funding role does not grant clinical record access. |
| Guardian vs clinical proxy vs caregiver | Guardian has legal/policy authority; ClinicalProxy has clinical authority; Caregiver supports logistics. | Do not bundle automatically. |
| Organization vs tenant vs facility vs branch | Organization is entity; Tenant is isolation; Facility is care site; Branch is specific location. | Branch/location is protected pre-payment. |
| Appointment vs encounter vs consultation | Appointment reserves time; Encounter is care episode; Consultation is interaction. | Scheduling does not own finalized clinical content. |
| Clinical record vs clinical note | ClinicalRecord is longitudinal collection; ClinicalNote is one item. | Finalized content is amended/versioned. |
| Prescription vs pharmacy order | Prescription is clinical authorization; PharmacyOrder is fulfilment operation. | Pharmacy fulfilment cannot silently change prescription. |
| Diagnostic order vs diagnostic result | DiagnosticOrder requests test; DiagnosticResult is verified output. | Corrections are versioned. |
| Quote vs reservation vs service order vs fulfilment | Quote offers; Reservation holds; ServiceOrder selects; Fulfilment executes. | None equals payment success. |
| Payment intent vs payment vs ledger entry | PaymentIntent starts; Payment records transaction; LedgerEntry records accounting movement. | Ledger is authoritative for accounting, not provider-detail access. |
| Refund vs reversal vs chargeback | Refund is return; Reversal is void/undo; Chargeback is dispute. | Disclosure behavior remains P00-13 approval item. |
| Consent vs delegation vs authorization | Consent expresses permission; Delegation grants capability; Authorization evaluates an action. | Runtime access requires authorization. |
| Domain event vs integration event vs audit event | DomainEvent is business fact; IntegrationEvent is adapted message; AuditEvent is accountability evidence. | Events are minimized. |
| Internal matching candidate vs pre-payment offer vs post-payment fulfilment view | Candidate is server-only; pre-payment offer is sanitized; post-payment view is scoped and authorized. | Protected fields are removed before server-to-client boundary. |

## Synonym and Ambiguity Register

| Ambiguous or legacy term | Canonical replacement | Reason | Permitted UI use, if any | Prohibited implementation use |
|---|---|---|---|---|
| User | Person or UserAccount by context | Conflates human and login. | Generic UI label only. | Domain entity name. |
| Member | Qualified member term | Hides membership type. | UI only with visible qualifier. | Generic Member entity. |
| Provider | Practitioner, ProviderOrganization, Facility, or Branch by context | Conflates person/org/location. | Broad patient-facing label. | Source-of-truth entity without qualifier. |
| Doctor | Doctor PractitionerRole | Role, not identity. | Patient-facing label. | Separate human identity. |
| Patient account | Patient plus UserAccount | Conflates care identity and login. | UI shortcut if mapped. | Canonical entity. |
| Wallet | LedgerAccount, FundingSource, Budget, or approved stored-value product | Implies unapproved custody. | Avoid until finance/legal approval. | Payment source of truth before P00-13. |
| Order | ServiceOrder, PharmacyOrder, DiagnosticOrder, Prescription, Claim, or Invoice | Overloaded. | UI only with service context. | Generic Order aggregate. |
| Result | DiagnosticResult, ResultComponent, ReferralOutcome, or Payment result | Ambiguous. | UI with context. | Unqualified Result entity. |
| Plan | FamilyPlan, BenefitPackage, Coverage, CarePlan, or FollowUpPlan | Overloaded clinical/finance. | UI with context. | Generic Plan entity. |
| Admin | Scoped administrator role | Admin rights differ by context. | Scoped UI role label. | Broad admin access. |
| Sponsor | Sponsor or Payer by context | Funding does not imply clinical authority. | Sponsor label allowed. | ClinicalProxy substitute. |
| Dependent | Dependent or Beneficiary by context | Legal/coverage meaning differs. | Policy-approved UI label. | Guardian authority inference. |
| Location | ServiceLocation, Branch, ServiceArea, patient address, emergency location, or delivery address | Disclosure class differs. | UI after authorization. | Generic unclassified field. |
| Successful payment | P00-13-approved event or scoped disclosure eligibility | Generic flag is unsafe. | Not approved until P00-13. | Generic unlock condition. |
