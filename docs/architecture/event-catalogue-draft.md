# NelyoHealth Event Catalogue Draft

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Architecture lead + domain owners |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |
| Status | Draft conceptual catalogue only; not code and not a final message schema |

## Event Types

| Event type | Definition |
|---|---|
| Domain event | Business fact emitted by an owning bounded context after a meaningful domain change. |
| Integration event | Minimized event adapted for external system or partner boundary. |
| Audit event | Append-only accountability record owned by Consent and Audit. |
| Operational signal | Support, queue, notification, incident, or monitoring signal that does not own business state. |

## Draft Event Schema

Every draft event row records event ID, event name, event type, owning context, trigger, business meaning, minimal payload, data classification, explicitly excluded payload, potential consumers, ordering requirement, idempotency expectation, delivery expectation, retention expectation, audit relationship, approval status, related workflow, and related decision/open question. Columns below combine related schema fields for compact review.

## Draft Events

| Event ID | Event name | Type | Owning context | Trigger and business meaning | Minimal payload | Explicitly excluded payload | Consumers | Ordering/idempotency/delivery | Retention/audit | Approval | Related workflow/decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EVT-001 | PersonIdentityCreated | Domain event | Identity and Access | Approved Person identity exists. | personRef, decisionRef | Auth secrets, clinical record | Patients, Audit | Ordered per person; idempotent by event ID; local outbox concept | Retain by identity policy; audit intent | PROPOSED | REQ-DOM-001 |
| EVT-002 | ExistingPersonMatchReviewRequested | Operational signal | Identity and Access | Possible duplicate requires review. | reviewRef, candidateRefs | Full identity evidence in event | Support, Audit | Idempotent by reviewRef | Security/privacy retention | PROPOSED | OQ-00-91 |
| EVT-003 | UserAccountActivated | Domain event | Identity and Access | Account linked to Person. | accountRef, personRef | Passwords, MFA secrets | Patients, Notifications, Audit | Ordered per account | Audit required | PROPOSED | REQ-DOM-001 |
| EVT-004 | AccountRecoveryRequested | Operational signal | Identity and Access | Recovery started. | recoveryRef, accountRef | Secrets, proof documents | Support, Security | Idempotent by recoveryRef | Security audit | PROPOSED | OQ-00-83 |
| EVT-005 | SessionsRevoked | Domain event | Identity and Access | Active sessions revoked. | accountRef, reasonCode | Tokens | Security, Notifications | Ordered per account | Audit required | PROPOSED | REQ-DOM-001 |
| EVT-006 | OrganizationMembershipGranted | Domain event | Organizations and Facilities | Person gains org context role. | personRef, orgRef, roleRef | Clinical record | Identity, Audit | Ordered per membership | Audit required | PROPOSED | REQ-GOV-005 |
| EVT-007 | OrganizationMembershipRevoked | Domain event | Organizations and Facilities | Org role revoked. | membershipRef, effectiveAt | Clinical record | Identity, Support | Ordered before access-removal intent | Audit required | PROPOSED | REQ-ARC-012 |
| EVT-008 | PractitionerCredentialSubmitted | Domain event | Credentialing | Credential evidence submitted. | credentialRef, practitionerRef | Evidence file contents | Credentialing ops | Idempotent by credentialRef | Regulatory evidence | PROPOSED | REQ-ARC-003 |
| EVT-009 | PractitionerCredentialVerified | Domain event | Credentialing | Practitioner role verified. | credentialRef, roleRef, status | Evidence file contents | Scheduling, Encounters | Ordered per credential | Audit required | PROPOSED | REQ-ARC-003 |
| EVT-010 | PractitionerCredentialExpired | Domain event | Credentialing | Credential expired. | credentialRef, roleRef, expiryAt | Patient data | Scheduling, Support | Ordered per credential | Audit required | PROPOSED | REQ-ARC-003 |
| EVT-011 | PractitionerSuspended | Domain event | Credentialing | Practitioner suspended. | practitionerRef, roleRef, reasonCode | Patient clinical details | Scheduling, Encounters, Support | Ordered per practitioner | Audit required | PROPOSED | OQ-00-84 |
| EVT-012 | FacilityCredentialVerified | Domain event | Credentialing | Facility verified. | facilityRef, credentialRef | Evidence file contents | Marketplace, Scheduling | Idempotent by credentialRef | Audit required | PROPOSED | REQ-ARC-003 |
| EVT-013 | FacilitySuspended | Domain event | Credentialing | Facility suspended. | facilityRef, reasonCode | Patient data | Marketplace, Support | Ordered per facility | Audit required | PROPOSED | REQ-ARC-003 |
| EVT-014 | PatientProfileCreated | Domain event | Patients and Relationships | Patient profile created. | patientRef, personRef | Full clinical record | Scheduling, Audit | Ordered per patient | Audit required | PROPOSED | REQ-LOCK-001 |
| EVT-015 | PatientProfileUpdated | Domain event | Patients and Relationships | Profile updated. | patientRef, changedFieldClass | Full demographics in event | Care contexts | Ordered per patient | Audit required | PROPOSED | REQ-DOM-001 |
| EVT-016 | GuardianRelationshipSubmitted | Operational signal | Patients and Relationships | Guardian evidence submitted. | relationshipRef, patientRef | Evidence contents | Support, Audit | Idempotent by relationshipRef | Privacy retention | PROPOSED | OQ-00-10 |
| EVT-017 | DelegationGranted | Domain event | Patients and Relationships | Delegation granted. | delegationRef, scope, actorRef | Full clinical content | Authorization, Audit | Ordered per delegation | Audit required | PROPOSED | REQ-DOM-007 |
| EVT-018 | DelegationRevoked | Domain event | Patients and Relationships | Delegation revoked. | delegationRef, effectiveAt | Full clinical content | Authorization, Audit | Ordered per delegation | Audit required | PROPOSED | REQ-DOM-007 |
| EVT-019 | SponsorRelationshipAccepted | Domain event | Plans and Coverage | Beneficiary accepts sponsor. | sponsorRelRef, patientRef | Clinical record | Payments, Audit | Ordered per relationship | Audit required | PROPOSED | REQ-COV-006 |
| EVT-020 | SponsorRelationshipRevoked | Domain event | Plans and Coverage | Sponsorship revoked. | sponsorRelRef, effectiveAt | Clinical record | Payments, Support | Ordered per relationship | Audit required | PROPOSED | OQ-00-52 |
| EVT-021 | AppointmentBooked | Domain event | Scheduling | Appointment booked. | appointmentRef, patientRef, practitionerRoleRef, timeWindow | Clinical note | Encounters, Notifications | Ordered per appointment | Audit intent | PROPOSED | REQ-DOM-003 |
| EVT-022 | AppointmentCancelled | Domain event | Scheduling | Appointment cancelled. | appointmentRef, reasonCode | Clinical note | Notifications, Support | Ordered per appointment | Audit intent | PROPOSED | OQ-00-73 |
| EVT-023 | AppointmentNoShowRecorded | Domain event | Scheduling | No-show recorded. | appointmentRef, actorType | Clinical details | Support, Payments | Ordered per appointment | Audit intent | PROPOSED | OQ-00-73 |
| EVT-024 | EncounterStarted | Domain event | Consultations and Encounters | Encounter begins. | encounterRef, patientRef, practitionerRef | Full intake | Clinical Records, Audit | Ordered per encounter | Audit required | PROPOSED | REQ-DOM-003 |
| EVT-025 | EncounterInterrupted | Operational signal | Consultations and Encounters | Consultation disrupted. | encounterRef, reasonCode | Clinical content | Support, Notifications | Ordered per encounter | Audit intent | PROPOSED | OQ-00-72 |
| EVT-026 | EncounterCompleted | Domain event | Consultations and Encounters | Encounter disposition completed. | encounterRef, dispositionCode | Full note | Clinical Records, Rx, Diagnostics | Ordered per encounter | Audit intent | PROPOSED | REQ-DOM-003 |
| EVT-027 | EmergencyEscalationTriggered | Domain event | Consultations and Encounters | Emergency path triggered. | escalationRef, patientRef, triggerCode | Payment demand, marketplace comparison | Support, Notifications, Audit | Highest priority; idempotent by escalationRef | Clinical audit | APPROVED | REQ-LOCK-010 |
| EVT-028 | ClinicalNoteFinalized | Domain event | Clinical Records | Note finalized. | noteRef, patientRef, versionRef | Note body in event | Audit, treating projections | Ordered per note | Clinical audit | APPROVED | REQ-LOCK-011 |
| EVT-029 | ClinicalNoteAmended | Domain event | Clinical Records | Final note amended. | noteRef, amendmentRef, versionRef | Superseded note body in event | Audit, treating projections | Ordered per note | Clinical audit | APPROVED | REQ-LOCK-011 |
| EVT-030 | FollowUpRequired | Domain event | Consultations and Encounters | Follow-up required. | followUpRef, patientRef, dueClass | Full note | Notifications, Support | Ordered per encounter | Audit intent | PROPOSED | REQ-DOM-003 |
| EVT-031 | PrescriptionIssued | Domain event | Prescriptions | Prescription signed. | prescriptionRef, patientRef, itemRefs | Full note, diagnosis unless needed | Marketplace, Pharmacy | Ordered per prescription | Clinical audit | PROPOSED | REQ-DOM-005 |
| EVT-032 | PrescriptionCancelled | Domain event | Prescriptions | Prescription cancelled. | prescriptionRef, reasonCode | Full note | Pharmacy, Audit | Ordered per prescription | Clinical audit | PROPOSED | REQ-DOM-005 |
| EVT-033 | PrescriptionReplaced | Domain event | Prescriptions | Prescription replaced by version. | oldPrescriptionRef, newPrescriptionRef | Full contents | Pharmacy, Audit | Ordered per prescription | Clinical audit | PROPOSED | REQ-DOM-005 |
| EVT-034 | MatchingRequested | Domain event | Marketplace and Matching | Provider matching requested. | matchingRef, serviceType, patientRegionClass | Address, coordinates to client | Marketplace only | Ordered per request | Audit intent | APPROVED | REQ-ARC-013 |
| EVT-035 | ProviderOfferGenerated | Domain event | Marketplace and Matching | Sanitized offer generated. | offerRef, providerDisplayName, quoteFields, opaqueToken | Address, distance, branch, contact, coordinates | Client, Audit | Idempotent by offerRef | Disclosure audit | APPROVED | REQ-LOCK-003 |
| EVT-036 | ProviderSelected | Domain event | Marketplace and Matching | Patient selected offer token. | serviceOrderRef, offerRef, tokenRef | Internal provider ID to client | Payments, Pharmacy/Lab | Ordered per order | Audit required | APPROVED | REQ-LOCK-006 |
| EVT-037 | StockReservationRequested | Domain event | Pharmacy Fulfilment | Stock reservation requested. | reservationRef, pharmacyOrderRef | Full clinical note | Pharmacy | Ordered per order | Audit intent | PROPOSED | REQ-DOM-005 |
| EVT-038 | StockReserved | Domain event | Pharmacy Fulfilment | Stock reserved. | reservationRef, expiryAt | Provider location to pre-payment client | Marketplace, Notifications | Ordered per reservation | Audit intent | PROPOSED | REQ-DOM-005 |
| EVT-039 | StockReservationExpired | Domain event | Pharmacy Fulfilment | Stock reservation expired. | reservationRef | Patient diagnosis | Marketplace, Payments | Ordered per reservation | Audit intent | PROPOSED | OQ-00-75 |
| EVT-040 | PharmacyOrderCreated | Domain event | Pharmacy Fulfilment | Pharmacy order created. | pharmacyOrderRef, prescriptionRef | Full clinical record | Pharmacy, Support | Ordered per order | Audit intent | PROPOSED | REQ-DOM-005 |
| EVT-041 | PharmacyOrderAccepted | Domain event | Pharmacy Fulfilment | Pharmacy accepts order. | pharmacyOrderRef, acceptedAt | Full notes | Marketplace, Notifications | Ordered per order | Audit intent | PROPOSED | REQ-DOM-005 |
| EVT-042 | PharmacyOrderRejected | Domain event | Pharmacy Fulfilment | Pharmacy rejects order. | pharmacyOrderRef, reasonCode | Hidden alternative provider details | Marketplace, Support | Ordered per order | Audit intent | PROPOSED | OQ-00-75 |
| EVT-043 | MedicationDispensed | Domain event | Pharmacy Fulfilment | Medication dispensed. | pharmacyOrderRef, dispensedAt | Diagnosis | Notifications, Audit | Ordered per order | Audit required | PROPOSED | REQ-DOM-005 |
| EVT-044 | DeliveryRequested | Domain event | Pharmacy Fulfilment | Delivery requested. | deliveryRef, orderRef, destinationRef | Diagnosis, full note | Delivery adapter | Ordered per delivery | Audit intent | PROPOSED | REQ-DOM-008 |
| EVT-045 | DeliveryCompleted | Domain event | Pharmacy Fulfilment | Delivery complete. | deliveryRef, proofRef | Full clinical details | Notifications, Payments | Ordered per delivery | Audit intent | PROPOSED | REQ-DOM-008 |
| EVT-046 | DeliveryFailed | Operational signal | Pharmacy Fulfilment | Delivery failed. | deliveryRef, reasonCode | Diagnosis | Support, Payments | Ordered per delivery | Audit intent | PROPOSED | OQ-00-74 |
| EVT-047 | DiagnosticOrderIssued | Domain event | Diagnostics | Diagnostic order signed. | diagnosticOrderRef, patientRef, itemRefs | Full note | Marketplace, Lab Ops | Ordered per order | Clinical audit | PROPOSED | REQ-DOM-010 |
| EVT-048 | LaboratorySelected | Domain event | Marketplace and Matching | Lab selected for order. | serviceOrderRef, labOfferRef | Lab location before authorization | Lab Ops, Payments | Ordered per ServiceOrder | Disclosure audit | APPROVED | REQ-LOCK-006 |
| EVT-049 | SpecimenCollected | Domain event | Laboratory Operations | Specimen collected. | specimenRef, accessionRef | Full clinical note | Diagnostics | Ordered per specimen | Audit required | PROPOSED | REQ-DOM-010 |
| EVT-050 | SpecimenRejected | Domain event | Laboratory Operations | Specimen rejected. | specimenRef, reasonCode | Full record | Diagnostics, Support | Ordered per specimen | Audit required | PROPOSED | OQ-00-76 |
| EVT-051 | DiagnosticResultVerified | Domain event | Diagnostics | Result verified. | resultRef, versionRef, patientRef | Full result body in event | Clinical Records, Notifications | Ordered per result | Clinical audit | APPROVED | REQ-LOCK-011 |
| EVT-052 | DiagnosticResultCorrected | Domain event | Diagnostics | Result corrected/versioned. | resultRef, correctionRef, versionRef | Old/new full values in event | Clinical Records, Audit | Ordered per result | Clinical audit | APPROVED | REQ-LOCK-011 |
| EVT-053 | CriticalResultDetected | Domain event | Diagnostics | Critical result identified. | criticalRef, resultRef, urgencyClass | Full result body in notification | Clinical escalation, Support | Priority ordered per result | Clinical audit | APPROVED | REQ-LOCK-010 |
| EVT-054 | CriticalResultAcknowledged | Domain event | Diagnostics | Critical result acknowledged. | criticalRef, actorRef, time | Full result body | Clinical Records, Audit | Ordered per criticalRef | Clinical audit | PROPOSED | OQ-00-78 |
| EVT-055 | ReferralCreated | Domain event | Referrals | Referral created. | referralRef, patientRef, priority | Full record | Notifications, Integrations | Ordered per referral | Audit required | PROPOSED | REQ-DOM-008 |
| EVT-056 | ReferralAccepted | Domain event | Referrals | Referral accepted. | referralRef, receiverRef | Full packet in event | Notifications, Support | Ordered per referral | Audit required | PROPOSED | REQ-DOM-008 |
| EVT-057 | ReferralCompleted | Domain event | Referrals | Referral closed. | referralRef, outcomeCode | Full external report unless approved | Clinical Records, Support | Ordered per referral | Audit required | PROPOSED | OQ-00-80 |
| EVT-058 | HomeCareVisitScheduled | Domain event | Home Care | Home-care visit scheduled. | visitRef, patientRef, window | Full record | Notifications, Support | Ordered per visit | Audit required | PROPOSED | REQ-DOM-008 |
| EVT-059 | HomeCareVisitMissed | Operational signal | Home Care | Home-care visit missed. | visitRef, reasonCode | Full record | Support | Ordered per visit | Audit required | PROPOSED | REQ-DOM-008 |
| EVT-060 | HomeCareIncidentReported | Operational signal | Home Care | Home-care incident reported. | incidentRef, visitRef, severity | Full note | Support, Clinical | Ordered per incident | Audit required | PROPOSED | REQ-DOM-008 |
| EVT-061 | FundingSourceSelected | Domain event | Plans and Coverage | Funding source selected. | orderRef, fundingSourceRef, actorRef | Clinical record | Payments | Ordered per order | Audit required | PROPOSED | REQ-COV-012 |
| EVT-062 | FundingApprovalRequested | Operational signal | Plans and Coverage | Sponsor/plan approval requested. | approvalRef, orderRef, amount | Full clinical record | Sponsor, Notifications | Idempotent by approvalRef | Audit required | PROPOSED | REQ-COV-012 |
| EVT-063 | FundingApprovalGranted | Domain event | Plans and Coverage | Funding approved. | approvalRef, fundingSourceRef | Full clinical record | Payments | Ordered per approval | Audit required | PROPOSED | REQ-COV-012 |
| EVT-064 | FundingApprovalRejected | Domain event | Plans and Coverage | Funding rejected. | approvalRef, reasonCode | Clinical details | Payments, Support | Ordered per approval | Audit required | PROPOSED | REQ-COV-013 |
| EVT-065 | PaymentIntentCreated | Domain event | Payments and Ledger | Payment attempt created. | paymentIntentRef, orderRef, amount | Raw card/bank data | Payment adapter, Marketplace | Ordered per intent | Finance audit | PROPOSED | REQ-DOM-006 |
| EVT-066 | PaymentPending | Domain event | Payments and Ledger | Payment is pending. | paymentRef, orderRef, status | Raw credentials | Marketplace | Ordered per payment | Finance audit | APPROVED | REQ-LOCK-009 |
| EVT-067 | PaymentFailed | Domain event | Payments and Ledger | Payment failed. | paymentRef, reasonCode | Raw credentials | Marketplace, Support | Ordered per payment | Finance audit | APPROVED | REQ-LOCK-009 |
| EVT-068 | PaymentCancelled | Domain event | Payments and Ledger | Payment cancelled. | paymentRef, reasonCode | Raw credentials | Marketplace, Support | Ordered per payment | Finance audit | APPROVED | REQ-LOCK-009 |
| EVT-069 | RefundRequested | Domain event | Payments and Ledger | Refund requested. | refundRef, paymentRef, orderRef | Clinical record | Finance, Support | Ordered per payment | Finance audit | PROPOSED | OQ-00-02 |
| EVT-070 | RefundCompleted | Domain event | Payments and Ledger | Refund completed. | refundRef, ledgerRefs | Clinical record | Finance, Marketplace | Ordered per refund | Finance audit | REQUIRES_APPROVAL | OQ-00-02 |
| EVT-071 | RefundFailed | Operational signal | Payments and Ledger | Refund failed. | refundRef, reasonCode | Clinical record | Support, Finance | Ordered per refund | Finance audit | PROPOSED | OQ-00-21 |
| EVT-072 | ReconciliationExceptionDetected | Operational signal | Payments and Ledger | Reconciliation mismatch found. | exceptionRef, paymentRef | Raw credentials | Finance, Support | Idempotent by exceptionRef | Finance audit | PROPOSED | REQ-DOM-006 |
| EVT-073 | ProviderDetailDisclosureEligibilityEstablished | Domain event/policy outcome | Marketplace and Matching | Server policy says provider detail may be disclosed for exact selected order. | serviceOrderRef, selectedProviderRef, actorRef, patientRef, tenantRef, policyDecisionRef | Generic payment success, other providers/orders, address in event payload unless producing authorized view | Client view generator, Audit | Ordered per ServiceOrder; idempotent by decisionRef | Disclosure audit | REQUIRES_APPROVAL | REQ-PAY-001; REQ-ARC-015 |
| EVT-074 | ConsentGranted | Domain event | Consent and Audit | Consent granted. | consentRef, actorRef, scope | Full clinical content | Authorization, Audit | Ordered per consent | Audit required | PROPOSED | REQ-DOM-007 |
| EVT-075 | ConsentWithdrawn | Domain event | Consent and Audit | Consent withdrawn. | consentRef, effectiveAt | Full clinical content | Authorization, Audit | Ordered per consent | Audit required | PROPOSED | REQ-DOM-007 |
| EVT-076 | BreakGlassAccessUsed | Audit event | Consent and Audit | Break-glass used. | auditRef, actorRef, patientRef, reasonCode | Full record content in event | Security, Clinical review | Ordered per access | Audit retained | REQUIRES_APPROVAL | REQ-GOV-014 |
| EVT-077 | SensitiveRecordAccessed | Audit event | Consent and Audit | Sensitive record access occurred. | auditRef, actorRef, recordClass, purpose | Record body | Security, Compliance | Ordered per access | Audit retained | PROPOSED | REQ-ARC-012 |
| EVT-078 | ComplaintOpened | Operational signal | Support and Operations | Complaint opened. | complaintRef, category, severity | Unnecessary clinical/payment data | Support, Audit | Ordered per case | Case audit | PROPOSED | REQ-JRN-002 |
| EVT-079 | ComplaintResolved | Operational signal | Support and Operations | Complaint resolved. | complaintRef, resolutionCode | Excess detail | Support, Audit | Ordered per case | Case audit | PROPOSED | OQ-00-86 |
| EVT-080 | ClinicalIncidentOpened | Operational signal | Support and Operations | Clinical incident opened. | incidentRef, severity, patientRef | Full record body | Clinical review, Audit | Ordered per incident | Clinical audit | PROPOSED | OQ-00-86 |
| EVT-081 | PrivacyIncidentOpened | Operational signal | Support and Operations | Privacy incident opened. | incidentRef, affectedClass, severity | Excess personal data | Privacy, Security | Ordered per incident | Privacy audit | PROPOSED | OQ-00-87 |
| EVT-082 | SecurityIncidentOpened | Operational signal | Support and Operations | Security incident opened. | incidentRef, severity, systemArea | Secrets | Security | Ordered per incident | Security audit | PROPOSED | OQ-00-86 |

| EVT-083 | TelemedicineSuitabilityReassessed | Domain event | Consultations and Encounters | Telemedicine suitability was reassessed. | encounterRef, patientRef, assessmentStage, outcomeCode | Full clinical note or red-flag detail in generic payload | Clinical Records, Support, Audit | Ordered per encounter; idempotent by assessmentRef | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-004 |
| EVT-084 | InPersonAssessmentRequired | Domain event | Consultations and Encounters | Clinician determined in-person assessment is required. | encounterRef, patientRef, dispositionCode | Full clinical note | Referrals, Notifications, Audit | Ordered per encounter | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-004 |
| EVT-085 | UrgentEscalationTriggered | Domain event | Consultations and Encounters | Urgent-care path triggered outside ordinary flow. | escalationRef, patientRef, triggerCategory | Payment demand, marketplace comparison, full clinical note | Referrals, Support, Audit | Idempotent by escalationRef | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-005 |
| EVT-086 | EmergencyTransferSummaryPrepared | Domain event | Referrals | Minimum-necessary emergency transfer summary prepared. | transferSummaryRef, patientRef, escalationRef | Full longitudinal record, unrelated diagnoses | Receiving facility workflow, Audit | Ordered per escalation | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-025 |
| EVT-087 | ReferralFollowUpRequired | Domain event | Referrals | Referral requires follow-up or outcome chase. | referralRef, patientRef, followUpReasonCode | Full referral packet | Support, Clinical supervisor, Audit | Ordered per referral | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-022 |
| EVT-088 | ReferralOutcomeReceived | Domain event | Referrals | Referral outcome returned or recorded. | referralRef, outcomeRef, patientRef | Full external report unless approved | Clinical Records, Support, Audit | Ordered per referral | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-022 |
| EVT-089 | CriticalResultNotificationSent | Domain event | Diagnostics | Critical-result notification was sent. | criticalRef, resultRef, recipientRole, channelClass | Result value in insecure notification | Clinical escalation, Audit | Ordered per criticalRef | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-028 |
| EVT-090 | CriticalResultAcknowledgmentOverdue | Operational signal | Diagnostics | Critical-result acknowledgment is overdue under approved policy. | criticalRef, resultRef, ownerRole | Full result body in queue summary | Clinical supervisor, Operations, Audit | Idempotent by criticalRef + policyVersion | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-029 |
| EVT-091 | CriticalResultPatientContactFailed | Operational signal | Diagnostics | Patient contact failed for critical result. | criticalRef, patientRef, contactPolicyRef | Result value in notification metadata | Operations, Clinical supervisor, Audit | Ordered per criticalRef | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-029 |
| EVT-092 | CriticalResultResolved | Domain event | Diagnostics | Critical-result loop reached documented resolution. | criticalRef, resolutionRef, patientRef | Full result body unless specifically authorized | Clinical Records, Audit | Ordered per criticalRef | Clinical audit | REQUIRES_APPROVAL | REQ-CLN-028 |
| EVT-093 | ClinicalSafetyConfigurationActivated | Domain event | Clinical Governance | Versioned clinical safety configuration activated. | configRef, versionRef, effectiveDate, ownerRole | Clinical rule body unless approved for consumers | Clinical contexts, Audit | Ordered per configRef | Governance audit | REQUIRES_APPROVAL | REQ-CLN-035 |

## Payload Minimization

- Events contain identifiers and minimum-necessary facts.
- Events do not become copies of full clinical documents.
- Authentication secrets never appear in events.
- Raw payment credentials never appear in events.
- Pre-payment events sent to client-facing consumers do not contain protected provider location.
- Analytics consumers receive minimized or approved derived events.
- Notification consumers do not automatically receive clinical content.

## Eventual Consistency

Draft events may support eventual consistency for notifications, analytics, search indexes, provider availability projections, credential eligibility projections, aggregate reporting, partner webhooks, support queues, and audit projections where the audit intent was committed atomically. P00-06 does not define queue technology, delivery timeout, final schema, or runtime state machines.
