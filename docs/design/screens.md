# MediReach Screens

## Normalization Note

- For repository implementation, NelyoHealth is the canonical product name.
- "MediReach" labels in this document are treated as legacy copy references.
- Screen IDs and routes in this file remain authoritative for scaffolding.
- Scope gating is applied using [page-and-state-inventory.md](page-and-state-inventory.md).

Generated for the expanded MediReach autonomous Codex build. This documentation targets the full 200-screen multi-role healthcare platform, including B2B, HMO, corporate, diaspora, Care Partner, pediatric, adolescent, hospital, pharmacy, lab, admin, compliance, audit, and clinical safety workflows.

Core product position: MediReach is not just telemedicine. It is coordinated healthcare access infrastructure for Nigeria and diaspora-supported families.


## Screen count

This document contains exactly **200 screen-level routes** for the expanded multi-role platform.

- Public Marketing, Trust, and Conversion Routes: 14 screens
- Authentication, Account, Consent, and Security Routes: 8 screens
- Adult Patient App: 22 screens
- Guardian, Infant, Child, and Adolescent Care: 22 screens
- Doctor Provider Portal: 18 screens
- Nurse and Triage Officer Portal: 10 screens
- Care Partner Portal: 22 screens
- Diaspora Sponsor and Family Sponsor Portal: 13 screens
- Corporate Admin Dashboard: 11 screens
- HMO Admin Dashboard: 11 screens
- Pharmacy Partner Portal: 8 screens
- Lab Partner Portal: 8 screens
- Hospital, Specialist, and Emergency Response Network: 9 screens
- Platform Admin and Super Admin: 24 screens

## Complete screen inventory

| ID | Screen | Route | Primary Role | Purpose |
|---|---|---|---|---|
| MED-PUB-001 | Home | `/` | Public | Main story, segment CTAs, trust, demo booking. |
| MED-PUB-002 | About MediReach | `/about` | Public | Mission, coordinated care model, Nigerian healthcare context. |
| MED-PUB-003 | For Employers | `/for-employers` | Public | Corporate benefits, PMPM model, outcomes, demo CTA. |
| MED-PUB-004 | For HMOs | `/for-hmos` | Public | HMO dashboard, member access, utilization reporting, API narrative. |
| MED-PUB-005 | For Diaspora Families | `/for-diaspora` | Public | Hard-currency family plans, parent care, sponsor peace of mind. |
| MED-PUB-006 | For Doctors | `/for-doctors` | Public | Provider recruitment, verification, earnings, clinical standards. |
| MED-PUB-007 | For Care Partners | `/for-care-partners` | Public | Professional caregivers, agencies, nurses, coordinators. |
| MED-PUB-008 | For Pharmacies | `/for-pharmacies` | Public | Prescription fulfillment partner proposition. |
| MED-PUB-009 | For Labs | `/for-labs` | Public | Diagnostics, booking, results upload partner proposition. |
| MED-PUB-010 | For Hospitals and Specialists | `/for-hospitals` | Public | Referral, discharge follow-up, specialist network. |
| MED-PUB-011 | Pricing and Plans | `/pricing` | Public | Corporate, HMO, diaspora, pay-per-consult, chronic care tiers. |
| MED-PUB-012 | Book Demo | `/book-demo` | Public | B2B lead capture and scheduling intent. |
| MED-PUB-013 | Trust and Safety | `/trust-safety` | Public | Doctor verification, consent, privacy, clinical escalation. |
| MED-PUB-014 | Help Center Landing | `/help` | Public | Public FAQs and support entry. |
| MED-AUTH-001 | Unified Login | `/login` | Public | Login for all roles with role-aware redirect. |
| MED-AUTH-002 | Create Account | `/register` | Public | Multi-role signup selection. |
| MED-AUTH-003 | Forgot Password | `/forgot-password` | Public | Password reset request. |
| MED-AUTH-004 | Reset Password | `/reset-password` | Public | Password reset completion. |
| MED-AUTH-005 | MFA Setup | `/account/mfa/setup` | Authenticated | Enroll authenticator, SMS, or email MFA. |
| MED-AUTH-006 | MFA Challenge | `/account/mfa/challenge` | Authenticated | Step-up challenge for sensitive actions. |
| MED-AUTH-007 | Role Selection | `/onboarding/role` | Authenticated | Select or request platform role. |
| MED-AUTH-008 | Consent Center | `/account/consents` | Authenticated | View, grant, revoke, and audit consents. |
| MED-PAT-001 | Patient Onboarding | `/patient/onboarding` | Patient | Welcome, care promise, next steps. |
| MED-PAT-002 | Patient Profile Setup | `/patient/profile/setup` | Patient | Demographics, address, emergency contact. |
| MED-PAT-003 | Medical History Setup | `/patient/medical-history/setup` | Patient | Conditions, allergies, medications, surgeries. |
| MED-PAT-004 | Patient Dashboard | `/patient/dashboard` | Patient | Health summary, next actions, recent activity. |
| MED-PAT-005 | Symptom Intake | `/patient/symptoms/new` | Patient | Structured triage form and red-flag capture. |
| MED-PAT-006 | AI-Assisted Intake Review | `/patient/symptoms/review` | Patient | Plain-language summary before booking, not diagnosis. |
| MED-PAT-007 | Choose Consultation Type | `/patient/consultations/type` | Patient | Chat, audio, video, urgent, routine. |
| MED-PAT-008 | Doctor Availability | `/patient/doctors/availability` | Patient | Specialty, available slots, care type. |
| MED-PAT-009 | Book Consultation | `/patient/consultations/book` | Patient | Confirm slot, reason, consent. |
| MED-PAT-010 | Payment or Benefit Check | `/patient/checkout` | Patient | Self-pay, corporate/HMO entitlement, sponsor coverage. |
| MED-PAT-011 | Waiting Room | `/patient/consultations/waiting` | Patient | Queue status, instructions, cancellation. |
| MED-PAT-012 | Live Consultation | `/patient/consultations/live` | Patient | Secure chat/audio/video UI. |
| MED-PAT-013 | Consultation Summary | `/patient/consultations/summary` | Patient | Doctor-approved care plan. |
| MED-PAT-014 | Prescription View | `/patient/prescriptions` | Patient | Medication instructions, refill, pharmacy routing. |
| MED-PAT-015 | Lab Request View | `/patient/labs/requests` | Patient | Diagnostics requested, booking status. |
| MED-PAT-016 | Book Lab Test | `/patient/labs/book` | Patient | Lab partner selection and sample collection options. |
| MED-PAT-017 | Medication Fulfillment | `/patient/medications/fulfillment` | Patient | Delivery/pickup status. |
| MED-PAT-018 | Medical Records | `/patient/records` | Patient | Consults, prescriptions, labs, care plans. |
| MED-PAT-019 | Care Team | `/patient/care-team` | Patient | Doctors, Care Partners, sponsors, guardians where applicable. |
| MED-PAT-020 | Notifications | `/patient/notifications` | Patient | Reminders, alerts, follow-ups. |
| MED-PAT-021 | Support and Complaints | `/patient/support` | Patient | Help, disputes, failed consults, clinical complaints. |
| MED-PAT-022 | Patient Settings | `/patient/settings` | Patient | Security, preferences, data export, account. |
| MED-MIN-001 | Guardian Dashboard | `/guardian/dashboard` | Guardian | Dependent overview and alerts. |
| MED-MIN-002 | Add Dependent | `/guardian/dependents/add` | Guardian | Create infant, child, pre-teen, or adolescent profile. |
| MED-MIN-003 | Minor Profile Setup | `/guardian/dependents/profile` | Guardian | DOB, weight, allergies, school, emergency data. |
| MED-MIN-004 | Guardian Consent | `/guardian/consent` | Guardian | Consent for care and data processing. |
| MED-MIN-005 | Adolescent Welcome | `/adolescent/welcome` | Adolescent | Age-appropriate onboarding. |
| MED-MIN-006 | Adolescent Assent | `/adolescent/assent` | Adolescent | Plain-language assent acknowledgment. |
| MED-MIN-007 | Adolescent Privacy Settings | `/guardian/adolescent/privacy` | Guardian/Adolescent | Visibility boundaries and consent rules. |
| MED-MIN-008 | Pediatric Symptom Intake | `/guardian/dependents/symptoms` | Guardian | Age-aware triage and red flags. |
| MED-MIN-009 | Pediatric Emergency Warning | `/guardian/dependents/emergency-warning` | Guardian | Immediate escalation for red flags. |
| MED-MIN-010 | Pediatric Consult Booking | `/guardian/dependents/consultations/book` | Guardian | Pediatric doctor routing. |
| MED-MIN-011 | Pediatric Waiting Room | `/guardian/dependents/consultations/waiting` | Guardian | Parent/guardian-present waiting room. |
| MED-MIN-012 | Pediatric Live Consultation | `/guardian/dependents/consultations/live` | Guardian/Minor | Child consult with guardian present. |
| MED-MIN-013 | Pediatric Consultation Summary | `/guardian/dependents/consultations/summary` | Guardian | Doctor-approved pediatric care plan. |
| MED-MIN-014 | Child Prescription Instructions | `/guardian/dependents/prescriptions` | Guardian | Weight/age-sensitive medication instructions. |
| MED-MIN-015 | Child Lab Requests | `/guardian/dependents/labs` | Guardian | Test orders and lab booking. |
| MED-MIN-016 | Immunization Record | `/guardian/dependents/immunizations` | Guardian | Vaccination history and reminders. |
| MED-MIN-017 | Growth and Vitals Chart | `/guardian/dependents/growth` | Guardian | Weight, height, temperature, BP where relevant. |
| MED-MIN-018 | School Health Records | `/guardian/dependents/school-health` | Guardian | School notes, allergies, emergency instructions. |
| MED-MIN-019 | Minor Care Partner Access | `/guardian/dependents/care-partners` | Guardian | Assign care support with strict permission scope. |
| MED-MIN-020 | Safeguarding Alert | `/guardian/dependents/safeguarding-alert` | Guardian/Admin | Abuse, self-harm, exploitation, danger workflow. |
| MED-MIN-021 | Guardian Care Summary | `/guardian/dependents/care-summary` | Guardian | Parent-facing longitudinal summary. |
| MED-MIN-022 | Minor Access Audit | `/guardian/dependents/access-audit` | Guardian/Admin | View access history to minor records. |
| MED-DOC-001 | Doctor Onboarding | `/doctor/onboarding` | Doctor | Provider onboarding checklist. |
| MED-DOC-002 | Doctor Verification Upload | `/doctor/verification` | Doctor | MDCN/license, identity, specialty proof. |
| MED-DOC-003 | Doctor Profile | `/doctor/profile` | Doctor | Bio, specialties, language, clinical services. |
| MED-DOC-004 | Availability Setup | `/doctor/availability` | Doctor | Work hours, slot length, consult types. |
| MED-DOC-005 | Doctor Dashboard | `/doctor/dashboard` | Doctor | Queue, schedule, unresolved tasks. |
| MED-DOC-006 | Patient Queue | `/doctor/queue` | Doctor | Waiting and assigned patients. |
| MED-DOC-007 | Patient Record View | `/doctor/patients/:id/record` | Doctor | Permitted clinical context. |
| MED-DOC-008 | Consultation Workspace | `/doctor/consultations/:id/workspace` | Doctor | Live consult, notes, actions. |
| MED-DOC-009 | Clinical Notes | `/doctor/consultations/:id/notes` | Doctor | SOAP notes and structured documentation. |
| MED-DOC-010 | Prescription Builder | `/doctor/prescriptions/new` | Doctor | Create prescriptions with safety checks. |
| MED-DOC-011 | Lab Request Builder | `/doctor/labs/new` | Doctor | Order diagnostics. |
| MED-DOC-012 | Referral Builder | `/doctor/referrals/new` | Doctor | Specialist, hospital, emergency referral. |
| MED-DOC-013 | Follow-Up Scheduler | `/doctor/follow-ups` | Doctor | Schedule follow-up care. |
| MED-DOC-014 | Care Partner Task Handoff | `/doctor/care-partner-tasks` | Doctor | Assign non-clinical follow-up tasks. |
| MED-DOC-015 | Pediatric Review Mode | `/doctor/pediatric/review` | Doctor | Child-safe consult workflow. |
| MED-DOC-016 | Chronic Care Panel | `/doctor/chronic-care` | Doctor | Track hypertension, diabetes, asthma, etc. |
| MED-DOC-017 | Earnings and Payouts | `/doctor/earnings` | Doctor | Consult earnings and settlements. |
| MED-DOC-018 | Doctor Support and Settings | `/doctor/settings` | Doctor | Support, profile, security. |
| MED-NUR-001 | Triage Dashboard | `/triage/dashboard` | Nurse/Triage | Incoming intake queue and urgency levels. |
| MED-NUR-002 | Intake Queue | `/triage/intakes` | Nurse/Triage | Review submitted symptoms. |
| MED-NUR-003 | Triage Review Workspace | `/triage/intakes/:id/review` | Nurse/Triage | Validate intake, flag risks. |
| MED-NUR-004 | Red Flag Escalation | `/triage/escalations/red-flags` | Nurse/Triage | Emergency routing queue. |
| MED-NUR-005 | Assign Doctor | `/triage/assign-doctor` | Nurse/Triage | Route cases by specialty and availability. |
| MED-NUR-006 | Pediatric Triage Review | `/triage/pediatric` | Nurse/Triage | Age-aware child triage. |
| MED-NUR-007 | Adolescent Safeguarding Review | `/triage/adolescent-safeguarding` | Nurse/Triage | Teen risk and privacy-sensitive escalation. |
| MED-NUR-008 | Care Partner Coordination Queue | `/triage/care-partner-coordination` | Nurse/Triage | Hand off non-clinical support. |
| MED-NUR-009 | Triage Notes | `/triage/notes` | Nurse/Triage | Internal triage documentation. |
| MED-NUR-010 | Triage Settings | `/triage/settings` | Nurse/Triage | Availability, escalation preferences. |
| MED-CAR-001 | Care Partner Onboarding | `/care-partner/onboarding` | Care Partner | Individual or organization intro. |
| MED-CAR-002 | Care Partner Type Selection | `/care-partner/type` | Care Partner | Individual vs organization. |
| MED-CAR-003 | Individual Verification | `/care-partner/individual/verification` | Care Partner | Identity and credentials. |
| MED-CAR-004 | Organization Verification | `/care-partner/organization/verification` | Care Partner | CAC/registration, agency data. |
| MED-CAR-005 | Service Profile | `/care-partner/profile/services` | Care Partner | Services offered and limitations. |
| MED-CAR-006 | Service Area | `/care-partner/profile/service-area` | Care Partner | Geographic coverage. |
| MED-CAR-007 | Availability | `/care-partner/availability` | Care Partner | Schedule and visit capacity. |
| MED-CAR-008 | Care Partner Dashboard | `/care-partner/dashboard` | Care Partner | Assigned patients and tasks. |
| MED-CAR-009 | Assigned Patients | `/care-partner/patients` | Care Partner | Permitted patient list. |
| MED-CAR-010 | Patient Care Plan | `/care-partner/patients/:id/care-plan` | Care Partner | Approved non-clinical instructions. |
| MED-CAR-011 | Care Task List | `/care-partner/tasks` | Care Partner | Medication, lab, visit, follow-up tasks. |
| MED-CAR-012 | Medication Adherence Tracker | `/care-partner/medication-adherence` | Care Partner | Track reminders and reports. |
| MED-CAR-013 | Lab Coordination | `/care-partner/lab-coordination` | Care Partner | Help with lab booking and follow-up. |
| MED-CAR-014 | Home Visit Report | `/care-partner/home-visits/report` | Care Partner | Visit notes, images where allowed. |
| MED-CAR-015 | Vitals Entry | `/care-partner/vitals` | Care Partner | BP, sugar, temp, weight, pulse. |
| MED-CAR-016 | Escalation Report | `/care-partner/escalations/new` | Care Partner | Urgent concern to clinician/admin. |
| MED-CAR-017 | Sponsor Update | `/care-partner/sponsor-updates` | Care Partner | Approved family update without private notes. |
| MED-CAR-018 | Post-Discharge Follow-Up | `/care-partner/post-discharge` | Care Partner | Hospital discharge task support. |
| MED-CAR-019 | Elderly Care Monitoring | `/care-partner/elderly-care` | Care Partner | Routine checks for elderly patients. |
| MED-CAR-020 | Care Partner Earnings | `/care-partner/earnings` | Care Partner | Invoices and payout status. |
| MED-CAR-021 | Reviews and Performance | `/care-partner/performance` | Care Partner | Ratings, SLA, completed tasks. |
| MED-CAR-022 | Care Partner Settings | `/care-partner/settings` | Care Partner | Profile, security, support. |
| MED-SPO-001 | Sponsor Onboarding | `/sponsor/onboarding` | Sponsor | Family care promise and setup. |
| MED-SPO-002 | Sponsor Dashboard | `/sponsor/dashboard` | Sponsor | Loved ones, alerts, care plan status. |
| MED-SPO-003 | Add Family Member | `/sponsor/family/add` | Sponsor | Invite parent/dependent. |
| MED-SPO-004 | Family Consent Status | `/sponsor/family/consent-status` | Sponsor | Track patient consent. |
| MED-SPO-005 | Choose Family Care Plan | `/sponsor/plans` | Sponsor | Basic, chronic, elderly-care plans. |
| MED-SPO-006 | Sponsor Subscription Checkout | `/sponsor/checkout` | Sponsor | Hard-currency card/payment flow. |
| MED-SPO-007 | Parent Health Summary | `/sponsor/family/:id/health-summary` | Sponsor | Consent-controlled summary. |
| MED-SPO-008 | Medication and Lab Activity | `/sponsor/family/:id/meds-labs` | Sponsor | Fulfillment and diagnostics timeline. |
| MED-SPO-009 | Care Partner Assignment | `/sponsor/family/:id/care-partners` | Sponsor | Assign or request verified support. |
| MED-SPO-010 | Monthly Care Report | `/sponsor/reports/monthly` | Sponsor | Downloadable family care report. |
| MED-SPO-011 | Emergency Alerts | `/sponsor/alerts` | Sponsor | Urgent notifications. |
| MED-SPO-012 | Sponsor Messages | `/sponsor/messages` | Sponsor | Care team messaging. |
| MED-SPO-013 | Sponsor Settings | `/sponsor/settings` | Sponsor | Billing, family permissions, account. |
| MED-COR-001 | Corporate Onboarding | `/corporate/onboarding` | Corporate Admin | Company setup and contract activation. |
| MED-COR-002 | Corporate Dashboard | `/corporate/dashboard` | Corporate Admin | Employee health access overview. |
| MED-COR-003 | Company Profile | `/corporate/profile` | Corporate Admin | Organization info and contacts. |
| MED-COR-004 | Employee Import | `/corporate/employees/import` | Corporate Admin | CSV/member upload. |
| MED-COR-005 | Employee Directory | `/corporate/employees` | Corporate Admin | Member list and status. |
| MED-COR-006 | Plan Configuration | `/corporate/plans/configuration` | Corporate Admin | Benefits and eligibility rules. |
| MED-COR-007 | Utilization Analytics | `/corporate/analytics/utilization` | Corporate Admin | Usage trends and activation. |
| MED-COR-008 | Sick-Day and Productivity Insights | `/corporate/analytics/productivity` | Corporate Admin | Aggregated non-identifiable impact insights. |
| MED-COR-009 | Invoices and Billing | `/corporate/billing` | Corporate Admin | PMPM invoices and payments. |
| MED-COR-010 | Corporate Reports | `/corporate/reports` | Corporate Admin | Download monthly reports. |
| MED-COR-011 | Corporate Settings | `/corporate/settings` | Corporate Admin | Admins, roles, support. |
| MED-HMO-001 | HMO Onboarding | `/hmo/onboarding` | HMO Admin | HMO setup and integration status. |
| MED-HMO-002 | HMO Dashboard | `/hmo/dashboard` | HMO Admin | Member access and utilization view. |
| MED-HMO-003 | Member Import | `/hmo/members/import` | HMO Admin | Upload/sync members. |
| MED-HMO-004 | Member Directory | `/hmo/members` | HMO Admin | Eligibility and status. |
| MED-HMO-005 | Benefit Plan Setup | `/hmo/plans` | HMO Admin | Coverage and consult rules. |
| MED-HMO-006 | Utilization Dashboard | `/hmo/analytics/utilization` | HMO Admin | Visits, consults, referrals. |
| MED-HMO-007 | Claims Support Reports | `/hmo/reports/claims-support` | HMO Admin | Aggregated support for claims analysis. |
| MED-HMO-008 | Provider Network Insights | `/hmo/analytics/providers` | HMO Admin | Provider performance and access. |
| MED-HMO-009 | API Integration Settings | `/hmo/integrations/api` | HMO Admin | API keys, webhooks, sync configuration. |
| MED-HMO-010 | HMO Billing | `/hmo/billing` | HMO Admin | Invoices and contract terms. |
| MED-HMO-011 | HMO Settings | `/hmo/settings` | HMO Admin | Team, permissions, support. |
| MED-PHA-001 | Pharmacy Onboarding | `/pharmacy/onboarding` | Pharmacy Partner | Partner setup and verification. |
| MED-PHA-002 | Pharmacy Dashboard | `/pharmacy/dashboard` | Pharmacy Partner | Orders and fulfillment summary. |
| MED-PHA-003 | Incoming Prescriptions | `/pharmacy/prescriptions` | Pharmacy Partner | Pending prescriptions. |
| MED-PHA-004 | Prescription Detail | `/pharmacy/prescriptions/:id` | Pharmacy Partner | Fulfillment-safe medication details. |
| MED-PHA-005 | Inventory Availability | `/pharmacy/inventory` | Pharmacy Partner | Medication availability and substitutions flag. |
| MED-PHA-006 | Fulfillment Update | `/pharmacy/fulfillment/:id` | Pharmacy Partner | Pack, dispatch, pickup, delivery statuses. |
| MED-PHA-007 | Pharmacy Settlements | `/pharmacy/settlements` | Pharmacy Partner | Commission and payout records. |
| MED-PHA-008 | Pharmacy Settings | `/pharmacy/settings` | Pharmacy Partner | Location, staff, support. |
| MED-LAB-001 | Lab Onboarding | `/lab/onboarding` | Lab Partner | Partner setup and verification. |
| MED-LAB-002 | Lab Dashboard | `/lab/dashboard` | Lab Partner | Orders and appointment overview. |
| MED-LAB-003 | Incoming Test Orders | `/lab/orders` | Lab Partner | Pending diagnostics. |
| MED-LAB-004 | Test Order Detail | `/lab/orders/:id` | Lab Partner | Requested tests and patient booking info. |
| MED-LAB-005 | Appointment Scheduling | `/lab/appointments` | Lab Partner | Lab visit or home sample collection. |
| MED-LAB-006 | Result Upload | `/lab/results/upload` | Lab Partner | Upload results securely. |
| MED-LAB-007 | Lab Settlements | `/lab/settlements` | Lab Partner | Commission and payout records. |
| MED-LAB-008 | Lab Settings | `/lab/settings` | Lab Partner | Location, services, support. |
| MED-HSP-001 | Hospital Partner Dashboard | `/hospital/dashboard` | Hospital Partner | Referrals and discharge follow-up. |
| MED-HSP-002 | Referral Intake | `/hospital/referrals` | Hospital Partner | Incoming referrals from doctors. |
| MED-HSP-003 | Specialist Directory | `/specialists` | Authenticated | Specialist discovery and referral support. |
| MED-HSP-004 | Specialist Profile | `/specialists/:id` | Authenticated | Credentials, slots, supported care types. |
| MED-HSP-005 | Specialist Booking | `/specialists/:id/book` | Patient/Doctor | Book specialist consultation. |
| MED-HSP-006 | Emergency Referral Directory | `/emergency/directory` | Clinical/Admin | Nearby emergency options and protocols. |
| MED-HSP-007 | Emergency Escalation Case | `/emergency/cases/:id` | Clinical/Admin | Track urgent escalation lifecycle. |
| MED-HSP-008 | Post-Hospital Discharge Plan | `/hospital/discharge-plans/:id` | Doctor/Care Partner | Follow-up tasks and monitoring. |
| MED-HSP-009 | Emergency Partner Settings | `/emergency/settings` | Admin | Emergency network configuration. |
| MED-ADM-001 | Admin Login | `/admin/login` | Admin | Admin secure entry. |
| MED-ADM-002 | Admin Dashboard | `/admin/dashboard` | Admin | Platform health and operational overview. |
| MED-ADM-003 | User Management | `/admin/users` | Admin | All user types and status. |
| MED-ADM-004 | Patient Management | `/admin/patients` | Admin | Patient records, support, safety flags. |
| MED-ADM-005 | Doctor Management | `/admin/doctors` | Admin | Doctor verification and status. |
| MED-ADM-006 | Nurse/Triage Management | `/admin/triage-staff` | Admin | Triage staff and permissions. |
| MED-ADM-007 | Care Partner Management | `/admin/care-partners` | Admin | Individual and organization verification. |
| MED-ADM-008 | Sponsor Management | `/admin/sponsors` | Admin | Diaspora sponsor accounts and billing support. |
| MED-ADM-009 | Guardian and Minor Management | `/admin/minors` | Admin | Minor profiles, consents, safeguarding visibility. |
| MED-ADM-010 | Corporate Account Management | `/admin/corporates` | Admin | Corporate clients and contracts. |
| MED-ADM-011 | HMO Account Management | `/admin/hmos` | Admin | HMO clients and integrations. |
| MED-ADM-012 | Pharmacy Partner Management | `/admin/pharmacies` | Admin | Pharmacy verification and SLA. |
| MED-ADM-013 | Lab Partner Management | `/admin/labs` | Admin | Lab verification and SLA. |
| MED-ADM-014 | Hospital and Specialist Management | `/admin/hospitals-specialists` | Admin | Referral network management. |
| MED-ADM-015 | Consultation Monitor | `/admin/consultations` | Admin | Consult lifecycle and quality. |
| MED-ADM-016 | Prescription Monitor | `/admin/prescriptions` | Admin | Prescription flow and incidents. |
| MED-ADM-017 | Lab Order Monitor | `/admin/lab-orders` | Admin | Diagnostics flow and result delays. |
| MED-ADM-018 | Payments and Subscriptions | `/admin/payments` | Admin | Transactions, PMPM billing, sponsor plans. |
| MED-ADM-019 | Complaints and Disputes | `/admin/complaints` | Admin | Complaint handling and resolution. |
| MED-ADM-020 | Clinical Incidents | `/admin/clinical-incidents` | Admin | Wrong prescription, escalation failure, safety issues. |
| MED-ADM-021 | Safeguarding Cases | `/admin/safeguarding` | Safeguarding Admin | Minor and vulnerable patient safety cases. |
| MED-ADM-022 | Notifications Manager | `/admin/notifications` | Admin | Templates, triggers, retries. |
| MED-ADM-023 | Audit Logs | `/admin/audit-logs` | Admin | Sensitive action logs. |
| MED-ADM-024 | System Settings | `/admin/settings` | Super Admin | Roles, feature flags, global config. |
