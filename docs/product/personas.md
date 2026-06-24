# NelyoHealth Personas (P00-03)

## Document Control

- Document: `docs/product/personas.md`
- Codex prompt ID: `P00-03`
- Complete Breakdown package: `P00-04`
- Issue ID: `P00-IAM-001`
- Owner role: Product + Clinical + Security
- Review state: `PROPOSED`
- Required reviewers: Product owner, Clinical lead, Security lead, Privacy counsel, Legal counsel
- Last updated: `2026-06-24`
- Related decisions: `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-LOCK-003`, `REQ-LOCK-004`, `REQ-LOCK-005`, `REQ-LOCK-006`, `REQ-LOCK-007`, `REQ-LOCK-008`, `REQ-LOCK-009`, `REQ-LOCK-010`, `REQ-LOCK-011`, `REQ-LOCK-012`, `REQ-LOCK-013`, `REQ-GOV-001`, `REQ-GOV-004`, `REQ-GOV-008`, `REQ-GOV-013`, `REQ-GOV-014`, `REQ-GOV-015`, `REQ-GOV-017`
- Related open questions: `OQ-00-10`, `OQ-00-13`, `OQ-00-14`, `OQ-00-34`, `OQ-00-35`, `OQ-00-36`

## Persona method

Personas describe goals, constraints, and expected workflows only.
- Personas explain who is being designed for.
- Personas do not grant access by themselves.
- They must be linked to the actor model and do not replace access governance.
- Scope labels are assigned once per persona from:
  - `PILOT`
  - `POST-PILOT`
  - `DESIGN-NOW-IMPLEMENT-LATER`
  - `OUT-OF-SCOPE`
  - `BLOCKED-PENDING-REVIEW`

## Persona Catalogue

### 1. Prospective patient — `PILOT`
- **Persona role:** Pre-registration individual preparing to become a patient record.
- **Primary goal:** Create the first continuity-preserving identity record.
- **Secondary goals:** Validate continuity with existing records, choose suitable care path, complete consent scaffolding.
- **Primary anxieties:** Duplicate identity creation, accidental loss of continuity, hidden access rights.
- **Operational constraints:** Requires consent and data-quality checks before account activation.
- **Accessibility / connectivity concerns:** Low-bandwidth onboarding support, clear error and retry messaging.
- **Main journeys:** Registration, identity capture, account activation handoff.
- **Information needed:** Name alias, contact route, age bracket, identity-discovery hints.
- **Information not automatically permitted:** Clinical summaries, provider location details, protected records.
- **Common exception scenarios:** Duplicate-match detection, suspended activation, identity disputes.
- **Trust requirements:** Must state that record is one-to-one with a Person.
- **Success indicators:** Identity created with no duplicate Patient generated; clear activation path; no clinical access granted yet.
- **Related actors/relationships:** Adult patient, Patient (future), Applicant context.

### 2. Adult patient — `PILOT`
- **Persona role:** Direct care recipient and continuity anchor.
- **Primary goal:** Receive closed-loop care with continuity and privacy.
- **Secondary goals:** Schedule appointments, track orders, review allowed records, and manage payer-related funding context.
- **Primary anxieties:** Wrong payer data leakage, duplicate identities, wrong order unlocks.
- **Operational constraints:** Must rely on one longitudinal Patient identity across all coverage changes.
- **Accessibility / connectivity concerns:** Screen-reader-friendly patient surfaces and tolerant mobile network handling.
- **Main journeys:** Registration, consult, payment, prescription/lab workflows, emergency routing.
- **Information needed:** Own care state, receipts, limited clinical summary, providerDisplayName and approved non-identifying commercial info before payment.
- **Information not automatically permitted:** Provider internal identifiers, map pins, contacts, coordinates, directions, hidden payer-controlled clinical records.
- **Common exception scenarios:** Failed payment, reimbursement/reversal, unauthorized role claims.
- **Trust requirements:** Knows which data is their own and why actions are blocked.
- **Success indicators:** Authorized actions complete; no unauthorized disclosure;
- **Related actors/relationships:** Family-plan member, diaspora sponsor, guardian, clinician.

### 3. Minor patient — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Beneficiary represented in model for later runtime release.
- **Primary goal:** Receive safe care using lawful representation.
- **Secondary goals:** Protected transition to independent care rights.
- **Primary anxieties:** Overexposure, incomplete guardian chain.
- **Operational constraints:** Activation remains deferred until legal/clinical model approved.
- **Accessibility / connectivity concerns:** Progressive disclosure for sensitive content.
- **Main journeys:** Future guardian-assisted access, safety routing.
- **Information needed:** Guardian/proxy status and legal scope.
- **Information not automatically permitted:** Full clinical visibility without lawful delegation.
- **Common exception scenarios:** Missing guardian verification, age transition disputes.
- **Trust requirements:** Explicit legal basis before any treatment-linked action.
- **Success indicators:** Deferred in pilot with no production claims.
- **Related actors/relationships:** Guardian, Clinical proxy.

### 4. Adult dependent — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Beneficiary relationship model in family context.
- **Primary goal:** Participate in care without creating duplicate patient identities.
- **Secondary goals:** Keep continuity while under family membership.
- **Primary anxieties:** Incorrect assumption of independent billing rights.
- **Operational constraints:** Deferred runtime implementation; modelling only for now.
- **Accessibility / connectivity concerns:** Shared device safety and clear consent boundaries.
- **Main journeys:** Family benefit flows and delegated updates.
- **Information needed:** Family membership and care relationship state.
- **Information not automatically permitted:** Independent clinical access when no delegated authority.
- **Common exception scenarios:** Mis-assigned payer role, family membership mismatch.
- **Trust requirements:** Separation of relationship, coverage, and clinical rights.
- **Success indicators:** No duplicate patient identity; clear ownership edges.
- **Related actors/relationships:** Family-plan administrator, Adult patient.

### 5. Guardian — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Adult legal representative for lawful dependent workflows.
- **Primary goal:** Enable safe access within delegated scope.
- **Secondary goals:** Fund/approve care actions, receive operational updates.
- **Primary anxieties:** Overreach from legal/age edge cases.
- **Operational constraints:** Must be scoped by legal basis and revocation.
- **Accessibility / connectivity concerns:** Multi-device and urgent-incident reliability.
- **Main journeys:** Delegation setup and limited care operations.
- **Information needed:** Dependent relationship proof, delegation status.
- **Information not automatically permitted:** Diagnosis-level access without explicit authorization.
- **Common exception scenarios:** Disputed guardianship, stale consent.
- **Trust requirements:** Logged authority and review trails.
- **Success indicators:** No automatic clinical rights; actions stop after suspension.
- **Related actors/relationships:** Minor patient, Adult patient.

### 6. Clinical proxy — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Adult legally appointed care decision proxy.
- **Primary goal:** Act as clinical decision helper when authorized.
- **Secondary goals:** Preserve continuity during incapacity.
- **Primary anxieties:** Insufficiently narrow mandates.
- **Operational constraints:** Required verification and time-bound scope.
- **Accessibility / connectivity concerns:** Clear status dashboards in weak networks.
- **Main journeys:** Emergency substitute care and care coordination.
- **Information needed:** Clinical proxy evidence and expiry.
- **Information not automatically permitted:** Full payer-like privileges; no automatic admission rights.
- **Common exception scenarios:** Invalid proxy proof, expired authorization.
- **Trust requirements:** Evidence-backed delegation.
- **Success indicators:** Proxy actions only where explicit and time-bound.
- **Related actors/relationships:** Adult patient.

### 7. Delegated caregiver — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Care-support actor with task-limited authority.
- **Primary goal:** Carry out assigned non-clinical care tasks.
- **Secondary goals:** Preserve continuity and logistics support.
- **Primary anxieties:** Acting outside delegated scope.
- **Operational constraints:** No full clinical-record authority.
- **Accessibility / connectivity concerns:** Mobile field workflow reliability.
- **Main journeys:** Task completion, reminders, logistics handoffs.
- **Information needed:** Active care task, delivery/visit context, expiry.
- **Information not automatically permitted:** Diagnosis, prescriptions, unrelated records.
- **Common exception scenarios:** Role/task mismatch.
- **Trust requirements:** Assignment-based visibility only.
- **Success indicators:** Task completes with no unauthorized record access.
- **Related actors/relationships:** Adult dependent, Patient, Clinical proxy (in some flows).

### 8. Family-plan administrator — `PILOT`
- **Persona role:** Family account administrator.
- **Primary goal:** Fund and manage eligible dependent care spending.
- **Secondary goals:** Receipts, approvals, spend controls.
- **Primary anxieties:** Clinical leakage while paying.
- **Operational constraints:** Financial authority only; clinical rights remain separate.
- **Accessibility / connectivity concerns:** Clear spend/receipt visibility.
- **Main journeys:** Family-plan setup, member support, pay/approve.
- **Information needed:** Plan membership, payment status, spend approvals.
- **Information not automatically permitted:** Automatic clinical notes, provider location, pre-payment provider details.
- **Common exception scenarios:** Unauthorized clinical reads, stale member permissions.
- **Trust requirements:** Explicit separation from clinical intent.
- **Success indicators:** Pays/spends without creating clinical visibility.
- **Related actors/relationships:** Adult family-plan member.

### 9. Adult family-plan member — `PILOT`
- **Persona role:** Dependent member using family membership.
- **Primary goal:** Consume care under family administration.
- **Secondary goals:** Receive care continuity and payment updates.
- **Primary anxieties:** Internal over-sharing of personal details.
- **Operational constraints:** Member-level rights only.
- **Accessibility / connectivity concerns:** Family-shared contexts with consent-safe displays.
- **Main journeys:** Care scheduling, payment-linked service flow.
- **Information needed:** Own care state and plan entitlement.
- **Information not automatically permitted:** Employer-like management roles.
- **Common exception scenarios:** Mislabelled as administrator.
- **Trust requirements:** Identity continuity unaffected by funding changes.
- **Success indicators:** Access stays at member scope.
- **Related actors/relationships:** Family-plan administrator.

### 10. Diaspora sponsor — `PILOT`
- **Persona role:** External payer for a designated beneficiary.
- **Primary goal:** Fund approved patient actions from remote context.
- **Secondary goals:** Track authorized payments and receipts.
- **Primary anxieties:** Clinical data overreach and cross-border ambiguity.
- **Operational constraints:** Payment and receipt visibility only unless explicitly granted by law/process.
- **Accessibility / connectivity concerns:** Reliable low-bandwidth confirmation and notifications.
- **Main journeys:** Sponsor setup, approval, payment, receipts.
- **Information needed:** Beneficiary context and allowed payment state.
- **Information not automatically permitted:** Clinical records and protected provider-location details.
- **Common exception scenarios:** Duplicate beneficiary mapping, revocation, failed payment.
- **Trust requirements:** Traceable funding authority and patient-consent linkage.
- **Success indicators:** Sponsor can fund without clinical record access.
- **Related actors/relationships:** Adult patient, Family-plan member.

### 11. Doctor — `PILOT`
- **Persona role:** Licensed clinician.
- **Primary goal:** Deliver safe diagnosis/treatment and continuity.
- **Secondary goals:** Ensure referral, orders, and handoff quality.
- **Primary anxieties:** Missing context, unsafe delegation bypass.
- **Operational constraints:** Order/encounter-scoped access.
- **Accessibility / connectivity concerns:** Stable video/audio fallback and keyboard usability.
- **Main journeys:** Consult, prescription, referral, escalation.
- **Information needed:** Encounter context, patient safety profile, permitted orders.
- **Information not automatically permitted:** Global provider/payment/admin data.
- **Common exception scenarios:** Incorrect tenant, expired clinician relationship, emergency bypass path.
- **Trust requirements:** Clear treatment and credential provenance.
- **Success indicators:** Care and records remain lawful and amend-only.
- **Related actors/relationships:** Patient, Pharmacist, Lab scientist, Hospital coordinator, Clinical supervisor.

### 12. Pharmacist — `PILOT`
- **Persona role:** Pharmacy clinician for selected orders.
- **Primary goal:** Fulfill selected prescription orders safely.
- **Secondary goals:** Confirm stock and delivery handoff.
- **Primary anxieties:** Wrong patient/order, pre-payment field leakage.
- **Operational constraints:** Order and patient authorization must align.
- **Accessibility / connectivity concerns:** Mobile operational workflow, intermittent signal handling.
- **Main journeys:** Quote acceptance, order fulfilment, handoff.
- **Information needed:** Authorized prescription metadata, fulfillment status.
- **Information not automatically permitted:** Provider map/location/contact pre-payment.
- **Common exception scenarios:** Wrong order context, missing prescription confirmation.
- **Trust requirements:** Pharmacy role must remain order-scoped.
- **Success indicators:** Fulfilment only on valid paid order path.
- **Related actors/relationships:** Patient, Doctor, Delivery participant.

### 13. Laboratory scientist — `PILOT`
- **Persona role:** Qualified operator for selected diagnostic orders.
- **Primary goal:** Process and report results for authorized orders.
- **Secondary goals:** Escalate critical results safely.
- **Primary anxieties:** Misattributed samples, data contamination.
- **Operational constraints:** Order-scoped result creation only.
- **Accessibility / connectivity concerns:** Structured result upload and review workflows.
- **Main journeys:** Test processing, result verification, critical escalation.
- **Information needed:** Diagnostic order context and sample metadata.
- **Information not automatically permitted:** unrelated patient record history.
- **Common exception scenarios:** Critical result delay, wrong encounter.
- **Trust requirements:** Audit trail and verified lab context.
- **Success indicators:** Results posted only for valid authorized lab work.
- **Related actors/relationships:** Patient, Doctor, Hospital coordinator.

### 14. Nurse — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Clinical support actor in future workflow.
- **Primary goal:** Support clinical handoff and follow-up.
- **Secondary goals:** Monitor continuity tasks where approved.
- **Primary anxieties:** Role ambiguity and unsafe care actions.
- **Operational constraints:** Deferred implementation, non-core role in this issue.
- **Accessibility / connectivity concerns:** Hand-off interfaces and alert clarity.
- **Main journeys:** Future follow-up coordination.
- **Information needed:** Task and care handoff scope.
- **Information not automatically permitted:** Full autonomous treatment authority.
- **Common exception scenarios:** Scope drift toward clinician-only actions.
- **Trust requirements:** Clear escalation chain.
- **Success indicators:** Deferred without clinical mis-assignment.
- **Related actors/relationships:** Clinical supervisor, Doctor.

### 15. Home-care worker — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Future field-worker actor.
- **Primary goal:** Complete approved home-care tasks.
- **Secondary goals:** Ensure safety and incident reporting.
- **Primary anxieties:** Scope creep into clinical decision-making.
- **Operational constraints:** Not implement now; modeled for later.
- **Accessibility / connectivity concerns:** Mobile-first reliability and safety confirmations.
- **Main journeys:** Delivery-like field task support.
- **Information needed:** Assigned task context, contact points.
- **Information not automatically permitted:** Full clinical notes or prescribing rights.
- **Common exception scenarios:** Task assignment mismatch.
- **Trust requirements:** Task-only visibility and audit.
- **Success indicators:** No patient continuity or clinical logic breaks in deferred model.
- **Related actors/relationships:** Clinical supervisor, Patient.

### 16. Hospital or referral coordinator — `PILOT`
- **Persona role:** Referral routing actor between virtual care and facility.
- **Primary goal:** Maintain continuity of transfer.
- **Secondary goals:** Ensure referral receipt and follow-up tracking.
- **Primary anxieties:** Wrong referral, missing urgency classification.
- **Operational constraints:** Referral and transfer rules are safety critical.
- **Accessibility / connectivity concerns:** Reliable workflow for mobile/desktop.
- **Main journeys:** Referral intake and facility transition.
- **Information needed:** Transfer scope, patient consent scope, receiving facility context.
- **Information not automatically permitted:** Clinician authority.
- **Common exception scenarios:** Referral without emergency checks.
- **Trust requirements:** Clinical handoff checks and emergency override precedence.
- **Success indicators:** Referral packets route only with lawful context.
- **Related actors/relationships:** Doctor, Patient.

### 17. HMO administrator — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Coverage policy operator.
- **Primary goal:** Configure and report membership/policy status.
- **Secondary goals:** Eligibility governance and eligibility reporting.
- **Primary anxieties:** Clinical misinterpretation of coverage role.
- **Operational constraints:** Deferred operational release.
- **Accessibility / connectivity concerns:** Reporting dashboard reliability.
- **Main journeys:** Coverage policy modelling.
- **Information needed:** Eligibility windows, policy context.
- **Information not automatically permitted:** Clinical note writing or treatment authority.
- **Common exception scenarios:** Coverage changes without continuity impact controls.
- **Trust requirements:** Explicit separation of coverage vs care access.
- **Success indicators:** No clinical authority granted by HMO admin role.
- **Related actors/relationships:** HMO claims operator.

### 18. HMO claims operator — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Claims-adjacent operations actor.
- **Primary goal:** Support coverage workflow governance.
- **Secondary goals:** Record claims-style events.
- **Primary anxieties:** Payer workflow incorrectly mapped to treatment control.
- **Operational constraints:** Deferred production claims behavior.
- **Accessibility / connectivity concerns:** Queue handling for claims-like events.
- **Main journeys:** Claims context and approval queue modelling.
- **Information needed:** Benefit and policy status.
- **Information not automatically permitted:** Direct care changes.
- **Common exception scenarios:** Claims data used as care directive.
- **Trust requirements:** Coverage-only interpretation.
- **Success indicators:** No order/clinical mutation rights.
- **Related actors/relationships:** HMO administrator.

### 19. Employer benefits administrator — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** B2B program operator.
- **Primary goal:** Configure employee benefit participation.
- **Secondary goals:** Monitor coverage configuration.
- **Primary anxieties:** Privacy leakage between employee and clinical records.
- **Operational constraints:** Deferred in this phase.
- **Accessibility / connectivity concerns:** Portal workflow reliability.
- **Main journeys:** Benefits setup and benefit list maintenance.
- **Information needed:** Program and participant context.
- **Information not automatically permitted:** Full clinical record access.
- **Common exception scenarios:** Benefit config interpreted as clinical authority.
- **Trust requirements:** Employer context remains non-clinical by default.
- **Success indicators:** Benefits metadata only.
- **Related actors/relationships:** Employer finance operator, Adult patient.

### 20. Employer finance operator — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Financial operator for employer payroll or benefit funding.
- **Primary goal:** Finance and reconcile benefit-linked events.
- **Secondary goals:** Provide settlement visibility and payment state.
- **Primary anxieties:** Reconciliation with protected disclosures.
- **Operational constraints:** Payment scope-only in this issue.
- **Accessibility / connectivity concerns:** Dashboard clarity for reconciliation exceptions.
- **Main journeys:** Funding reconciliation and payout views.
- **Information needed:** Payment events and source approvals.
- **Information not automatically permitted:** Clinical content or provider-disclosure details.
- **Common exception scenarios:** Reconciliation mismatch causing wrong actor exposure.
- **Trust requirements:** Role-based finance scope with audit trails.
- **Success indicators:** No clinical read/write rights by finance role.
- **Related actors/relationships:** Employer administrator, Platform finance operator.

### 21. Provider organization administrator — `PILOT`
- **Persona role:** Org-level governance owner for provider network.
- **Primary goal:** Maintain active provider roster and role assignments.
- **Secondary goals:** Suspend or adjust access in safety cases.
- **Primary anxieties:** Unbounded administrator capabilities.
- **Operational constraints:** No guaranteed treatment rights.
- **Accessibility / connectivity concerns:** Administrative dashboard access.
- **Main journeys:** Roster/credential administration, role assignment.
- **Information needed:** Organization membership, practitioner credentials.
- **Information not automatically permitted:** Treating-clinician authority over all patients.
- **Common exception scenarios:** Access carryover after offboarding.
- **Trust requirements:** Admin actions are auditable and scoped.
- **Success indicators:** Org management with no patient-wide override.
- **Related actors/relationships:** Doctor, Pharmacist, Laboratory scientist.

### 22. Platform support operator — `PILOT`
- **Persona role:** Exception-handling actor for operational support.
- **Primary goal:** Resolve support tickets without violating clinical boundaries.
- **Secondary goals:** Help restore workflows and document interventions.
- **Primary anxieties:** Hidden support access and broad read privileges.
- **Operational constraints:** Break-glass only when exception workflow is active.
- **Accessibility / connectivity concerns:** Console clarity and secure workstation use.
- **Main journeys:** Queue triage and incident closure.
- **Information needed:** Incident context and authorized action scope.
- **Information not automatically permitted:** Unbounded records visibility.
- **Common exception scenarios:** Reopening closed records with invalid scope.
- **Trust requirements:** Limited incident-driven purpose and evidence.
- **Success indicators:** Resolution without permanent access broadening.
- **Related actors/relationships:** Clinical supervisor, Compliance officer.

### 23. Platform finance operator — `PILOT`
- **Persona role:** Finance workflow operator.
- **Primary goal:** Monitor payment events and settlement integrity.
- **Secondary goals:** Support dispute and refund workflows with audit trail.
- **Primary anxieties:** Mixing finance visibility with clinical access.
- **Operational constraints:** Payment channel only unless separately approved.
- **Accessibility / connectivity concerns:** Financial dashboards resilient under failure.
- **Main journeys:** Payment state monitoring and refund review.
- **Information needed:** Settlement events, dispute state.
- **Information not automatically permitted:** Clinical decisions or protected clinical context.
- **Common exception scenarios:** Triggering visibility of provider location from finance events.
- **Trust requirements:** Payment-specific scope by actor and event.
- **Success indicators:** No clinical fields in finance view.
- **Related actors/relationships:** Patient, Platform support operator.

### 24. Credential reviewer — `PILOT`
- **Persona role:** Credential and eligibility checker.
- **Primary goal:** Validate practitioner and partner credentials before activation.
- **Secondary goals:** Detect expiry and evidence gaps.
- **Primary anxieties:** Credential replay without expiry evidence.
- **Operational constraints:** Review-only scope by design.
- **Accessibility / connectivity concerns:** Secure document upload and audit-friendly review.
- **Main journeys:** Credential intake and periodic review.
- **Information needed:** Verification proofs, expiration dates.
- **Information not automatically permitted:** Clinical note editing.
- **Common exception scenarios:** Invalid credential leading to unsafe service activation.
- **Trust requirements:** Expiry and revalidation discipline.
- **Success indicators:** Accurate activation/revocation based on proofs.
- **Related actors/relationships:** Provider organization administrator, Doctor.

### 25. Compliance officer — `POST-PILOT`
- **Persona role:** Governance and policy officer.
- **Primary goal:** Ensure policy adherence and review exceptions.
- **Secondary goals:** Maintain control evidence for external review.
- **Primary anxieties:** Silent policy drift.
- **Operational constraints:** Governance scope rather than clinical operations.
- **Accessibility / connectivity concerns:** Evidence package accessibility.
- **Main journeys:** Exception review, audit evidence preparation.
- **Information needed:** Governance exceptions, policy state.
- **Information not automatically permitted:** Direct treatment control.
- **Common exception scenarios:** Policy updates without implementation trace.
- **Trust requirements:** Traceable decision chain.
- **Success indicators:** Compliance evidence available before launch review.
- **Related actors/relationships:** Clinical supervisor, Security administrator.

### 26. Clinical supervisor — `PILOT`
- **Persona role:** Clinical governance actor for exceptional clinical exceptions.
- **Primary goal:** Review high-risk exceptions and escalate safely.
- **Secondary goals:** Closure and learning from deviations.
- **Primary anxieties:** Delay in unsafe or unresolved exception handling.
- **Operational constraints:** Not every case; emergency and high-risk only.
- **Accessibility / connectivity concerns:** Structured clinical review interface.
- **Main journeys:** Exception review and escalation closure.
- **Information needed:** Encounter, risk, and escalation history.
- **Information not automatically permitted:** Routine operations or admin-only controls.
- **Common exception scenarios:** Missing exception context or unauthorized overrides.
- **Trust requirements:** Explicit clinical basis and closure evidence.
- **Success indicators:** Unsafe cases closed only through documented review.
- **Related actors/relationships:** Doctor, Compliance officer.

### 27. Security administrator — `PILOT`
- **Persona role:** Security operations actor.
- **Primary goal:** Protect tenant/session/control-plane safety.
- **Secondary goals:** Detect suspicious behavior and force revocation.
- **Primary anxieties:** Privilege leakage and session persistence after revocation.
- **Operational constraints:** Security-focused scope with minimal clinical content.
- **Accessibility / connectivity concerns:** Incident-console accessibility.
- **Main journeys:** Access review, session invalidation, suspicious activity.
- **Information needed:** Session logs and privilege transitions.
- **Information not automatically permitted:** Treating-clinical content without explicit scope.
- **Common exception scenarios:** Session reuse after role removal.
- **Trust requirements:** Full audit and immediate revocation controls.
- **Success indicators:** No silent privilege persistence.
- **Related actors/relationships:** Platform administrator, Security operations.

### 28. Platform administrator — `POST-PILOT`
- **Persona role:** Global platform control actor.
- **Primary goal:** Maintain non-clinical platform configuration safely.
- **Secondary goals:** Coordinate release and incident governance.
- **Primary anxieties:** Global invisible access.
- **Operational constraints:** No implicit clinical content rights.
- **Accessibility / connectivity concerns:** Command-and-control dashboard accessibility.
- **Main journeys:** Configuration governance and incident workflows.
- **Information needed:** System state, policy state, release gating.
- **Information not automatically permitted:** Broad patient-scoped clinical read.
- **Common exception scenarios:** Emergency access used as normal admin convenience.
- **Trust requirements:** Governance boundaries and multi-party review where required.
- **Success indicators:** Platform ops without omniscient access.
- **Related actors/relationships:** Security administrator, Compliance officer.

### 29. Auditor — `DESIGN-NOW-IMPLEMENT-LATER`
- **Persona role:** Independent review actor.
- **Primary goal:** Validate controls, logs, and policy outcomes.
- **Secondary goals:** Support risk identification.
- **Primary anxieties:** Read-write confusion and missing evidence.
- **Operational constraints:** Review role and evidence access only.
- **Accessibility / connectivity concerns:** Access to exportable audit artifacts.
- **Main journeys:** Audit report review and control assurance.
- **Information needed:** Audit history and policy mappings.
- **Information not automatically permitted:** Clinical mutation rights.
- **Common exception scenarios:** Read-only posture not enforced.
- **Trust requirements:** Tamper-resistant evidence surface.
- **Success indicators:** Independent evidence trails without system side effects.
- **Related actors/relationships:** Compliance officer.

### 30. Delivery or logistics participant — `PILOT`
- **Persona role:** Delivery operator for logistics handoff.
- **Primary goal:** Execute assigned handoff tasks.
- **Secondary goals:** Provide proof-of-delivery and exception updates.
- **Primary anxieties:** Wrong order dispatch and oversharing patient logistics.
- **Operational constraints:** Order-specific task scope; no treatment rights.
- **Accessibility / connectivity concerns:** Mobile handoff reliability.
- **Main journeys:** Delivery route, handoff confirmation, proof capture.
- **Information needed:** Order handoff details and safety instructions.
- **Information not automatically permitted:** Clinical records or pre-payment provider location data unless operationally required.
- **Common exception scenarios:** Wrong order/tenant assignment.
- **Trust requirements:** Order and task binding.
- **Success indicators:** Correct handoff with no unauthorized data exposure.
- **Related actors/relationships:** Pharmacist, Patient.
