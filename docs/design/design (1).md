# NelyoHealth Design Direction and UX Operating Manual v2

## Design north star

NelyoHealth must feel calm, competent, clinical, human, and trustworthy. It must not feel like a generic SaaS dashboard, a social app, a crypto app, or a decorative wellness product. This is a healthcare workflow product for Nigerian reality: mobile-first users, weak networks, family-supported care, diaspora sponsors, fragmented offline partners, and high trust friction.

## Brand posture

NelyoHealth should communicate:

- healthcare access
- real clinical governance
- family care confidence
- privacy and consent
- operational follow-through
- Nigerian context
- calm authority

It should not communicate:

- “AI doctor”
- guaranteed treatment
- emergency replacement
- casual health advice
- surveillance for employers/HMOs
- sponsor control over adult patients

## Visual direction

Use a restrained medical palette: deep blue or teal-blue as primary, soft blue backgrounds, clinical green for success, amber for caution, red only for true danger, and neutral grays for surfaces and text. Avoid neon, gradients that reduce readability, heavy shadows, playful illustrations in clinical flows, and tiny text in dashboards.

Typography must be highly readable on mobile. Use large page titles, clear body text, strong form labels, and accessible contrast. Avoid dense paragraphs in patient flows. Use progressive disclosure for complex clinical/admin data.

## Website design direction

The public website must be narrative, trust-building, and segmented. It must not be a generic “book a doctor” landing page.

### Home page required sections

1. Hero with one strong proposition: coordinated healthcare access for Nigerian families, employers, HMOs, and diaspora sponsors.
2. Segment CTAs: patient, employer, HMO, diaspora, doctor, Care Partner.
3. Care journey visual: intake, triage, consult, prescription/lab, follow-up.
4. Trust section: verified doctors, consent controls, audit logs, clinical safety, emergency limits.
5. Diaspora family care section: parent support, medication/lab updates, Care Partner coordination.
6. Corporate/HMO section: PMPM access, member activation, aggregated utilization, privacy boundaries.
7. Care Partner section: professional support, verification, allowed and forbidden tasks.
8. Partner network section: pharmacies, labs, hospitals, specialists.
9. FAQ and final CTA.

### Public page tone by segment

- Employers: ROI, staff benefit, reduced care friction, privacy boundaries.
- HMOs: member satisfaction, digital access, reporting, integration readiness.
- Diaspora: emotional trust, parent safety, consent, reliable execution.
- Doctors: professional workflow, verification, schedule, earnings, safety.
- Care Partners: professional standards, verification, permitted tasks, earnings.
- Pharmacies/labs: reliable queue, fulfillment, settlements, partner standards.

## App shell direction

Each role gets a role-specific shell. Do not build one universal dashboard.

- Patient: mobile-first, simple cards, next action, support access.
- Doctor: workbench, queue, patient context, notes, prescription/lab/referral actions.
- Nurse: triage queue, risk flags, escalation actions.
- Care Partner: task-first, mobile field workflow.
- Sponsor: family overview, consent status, updates, billing.
- Guardian: dependent switcher, pediatric/adolescent clarity.
- Corporate/HMO: aggregate analytics, member eligibility, reports, privacy tooltips.
- Pharmacy/lab: operational queue and status workflow.
- Admin: dense but controlled operations center.

### Patient design rules

Role purpose: Adult care recipient who owns their care journey and records.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Guardian design rules

Role purpose: Parent or legal guardian managing dependents and minors.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Minor Patient design rules

Role purpose: Infant, child, or pre-teen dependent profile, never a standalone adult account.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Adolescent Patient design rules

Role purpose: Guardian-linked minor with limited self-access and privacy-aware flows.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Sponsor design rules

Role purpose: Family or diaspora payer/supporter with consent-scoped visibility.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Doctor design rules

Role purpose: Verified clinician who consults, documents, prescribes, requests labs, and refers.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Nurse/Triage Officer design rules

Role purpose: Clinical support role for triage, routing, follow-up, and safety flags.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Care Partner design rules

Role purpose: Verified individual or organization that supports non-clinical care execution.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Corporate Admin design rules

Role purpose: Employer administrator managing employee eligibility and aggregated reporting.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### HMO Admin design rules

Role purpose: HMO administrator managing members, plans, integrations, and aggregated reports.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Pharmacy Partner design rules

Role purpose: Partner fulfilling prescriptions and updating medication lifecycle.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Lab Partner design rules

Role purpose: Partner scheduling tests and uploading lab results.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Hospital Partner design rules

Role purpose: Partner receiving referrals and coordinating discharge follow-up.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Specialist design rules

Role purpose: Verified specialist receiving and handling specialist referrals.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Emergency Partner design rules

Role purpose: Escalation partner for urgent response coordination, not a replacement for emergency services.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Admin design rules

Role purpose: Platform operator for verification, monitoring, support, incidents, and settlements.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Safeguarding Admin design rules

Role purpose: Restricted admin for child, abuse, self-harm, vulnerable patient, and safety cases.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.

### Super Admin design rules

Role purpose: Highest control role for RBAC, feature flags, system settings, and privileged audits.

UI must prioritize:

- The next safe action for this role.
- Clear boundaries on what this role can and cannot do.
- Information hierarchy that matches the role's real job.
- Clear empty states and failure states.
- Mobile behavior if this role likely operates in the field.

UI must avoid:

- Showing controls for actions the role cannot perform.
- Mixing administrative and clinical authority.
- Hiding risk warnings behind tabs or secondary clicks.



## Component system requirements

### Buttons

Variants: primary, secondary, ghost, destructive, warning, success, link, icon. Destructive buttons require confirmation, reason, and audit event where sensitive.

### Forms

Forms must use persistent labels, helper text, validation messages, field grouping, autosave where appropriate, and clear submit states. Clinical forms must use precise labels and units.

### Cards

Card types: appointment, prescription, lab, care task, patient summary, sponsor summary, alert, organization metric, partner queue, admin monitor. Every card must have a status.

### Tables

Tables must support filters, sort, search, pagination, row actions, mobile card fallback, empty state, export where permitted, and role-specific column visibility.

### Modals and drawers

Use modals for small confirmations. Use drawers for record detail side panels. Do not put long clinical documentation forms inside cramped modals.

### Alerts

Levels: info, success, warning, danger. Danger is reserved for emergencies, clinical risk, critical failure, or high-severity incidents.

### Empty states

Every empty state must explain why it is empty and what to do next. Avoid “No data found” as final copy.

### Error states

Every error state must explain whether the user can retry, contact support, or wait. Avoid generic “Something went wrong.”


## Safety UX rules

- Emergency warnings must be direct and impossible to miss.
- Pediatric red flags must use stricter warnings.
- Adolescent privacy notices must be plain and age-appropriate.
- Sponsor visibility must explain consent boundaries.
- Corporate/HMO dashboards must explain that reports are aggregated.
- Care Partner screens must repeatedly reinforce non-clinical boundaries.

## Low-bandwidth UX

- Avoid heavy media in app flows.
- Use skeleton loading.
- Preserve forms locally where possible.
- Show retry buttons.
- Compress images.
- Avoid forcing video when chat/audio can work.
- Design mobile first for patient, guardian, sponsor, and Care Partner flows.

## Accessibility

- Keyboard navigation.
- Visible focus states.
- Semantic headings.
- High contrast.
- No color-only status meaning.
- Screen-reader-friendly validation errors.
- Touch targets at least 44px.
- Plain language in patient-facing flows.

## Copy rules

Avoid: “diagnosis complete”, “you are fine”, “AI doctor”, “guaranteed”, “don’t worry”, “emergency handled”.

Use: “A clinician will review this”, “This may require urgent care”, “Please seek emergency help now if symptoms are severe”, “Your sponsor only sees what you approve”, “Care Partners cannot diagnose or prescribe”.


## Non-negotiable rules

1. Never expose patient health data without authentication, server-side RBAC, consent where required, and audit logging.
2. Never let corporate or HMO admins view individual clinical notes by default.
3. Never let sponsors see raw adult patient records by default. Sponsor visibility is consent-scoped and summary-first.
4. Never let Care Partners diagnose, prescribe, edit clinical instructions, or act as doctors.
5. Never let minors behave like independent adult accounts. Minors require guardian linkage or a legally reviewed authorized arrangement.
6. Never present AI as a doctor, diagnosis engine, prescriber, emergency responder, or clinician replacement.
7. Never postpone RBAC, consent, audit logs, clinical safety, or minor-care rules as “later polish”.
8. Never build generic dashboards that show every object. Every dashboard is role-specific and least-privilege.
9. Never create production emergency, pediatric, safeguarding, prescription, lab, or referral flows as casual placeholders.
10. Never mark a task complete without tests, error states, empty states, role-denial behavior, and documentation alignment.

## 23. Page archetypes

### 23.1 Marketing landing page archetype

Use this for public segment pages. Required structure:

1. Header with segment-aware CTA.
2. Hero with clear promise and one primary action.
3. Pain section naming the user's real problem.
4. Workflow section showing exactly how MediMate helps.
5. Trust and safety section.
6. Feature proof section.
7. FAQ section.
8. Final CTA.

Do not open with a feature grid. Open with the user's problem and the trust reason.

### 23.2 Patient dashboard archetype

Layout priority:

1. Immediate next action.
2. Upcoming appointment or pending triage result.
3. Active prescription or lab request.
4. Care plan or follow-up tasks.
5. Care support status.
6. Notifications.
7. Support.

Never make the patient hunt for “what next”.

### 23.3 Clinical workbench archetype

Used by doctors and specialists.

Suggested layout:

- Left panel: patient context, allergies, current meds, triage summary, age band, risk flags.
- Center panel: live consult, notes, assessment, plan.
- Right panel: actions, prescription, labs, referral, follow-up, Care Partner task.

The clinical workbench must reduce switching. Critical patient warnings must remain visible while prescribing.

### 23.4 Queue archetype

Used by nurse, doctor, pharmacy, lab, hospital, emergency, admin.

Required elements:

- title and queue count
- filters
- priority/risk status
- search
- sortable timestamp
- assigned owner
- row action
- bulk action only when safe
- empty state
- SLA/overdue indicator where relevant

### 23.5 Detail page archetype

Used for patient, prescription, lab order, referral, incident, safeguarding, partner, organization, and settlement details.

Required structure:

- identity/header summary
- status badge
- timeline
- primary action
- secondary actions
- notes/activity log
- audit-sensitive access warning where applicable
- restricted sections hidden unless authorized

### 23.6 Consent screen archetype

Consent screens must answer:

- Who is getting access?
- What exactly can they see?
- What can they do?
- How long does access last?
- Can access be revoked?
- What happens if access is revoked?

Use checkboxes only after explanatory copy. Do not hide access scope in terms and conditions.

### 23.7 Emergency warning archetype

Emergency warnings must be visually obvious and copy-specific.

Required elements:

- danger status
- plain-language reason
- immediate instruction
- optional call/contact action if configured
- statement that MediMate is not a substitute for emergency services
- button to acknowledge only if safe

### 23.8 Safeguarding case archetype

Safeguarding screens must be sparse, restricted, and audit-heavy.

Required elements:

- restricted access notice
- case severity
- assigned safeguarding admin
- timeline
- actions with reason fields
- no unnecessary exposure of sensitive notes
- audit log visibility

## 24. Detailed component specs

### Status badges

Every status badge must use both color and text. Examples:

- Scheduled
- In progress
- Awaiting doctor review
- Consent pending
- Consent revoked
- High risk
- Escalated
- Fulfillment failed
- Result uploaded
- Result released
- Settlement pending
- Suspended

### Timeline component

Use for consults, prescriptions, labs, referrals, incidents, settlements, and safeguarding cases.

Each timeline item should include:

- timestamp
- actor
- role
- event label
- detail summary
- audit link where authorized

### Data cards

Data cards should never mix unrelated concerns. A prescription card should not also show billing. A sponsor family card should not show raw clinical details.

### Search and filters

Admin and operational queues require saved filters where helpful. Filters should include status, risk, assigned owner, date range, organization, partner, and overdue state.

### Export buttons

Export buttons must be hidden or disabled unless user has export permission. Every export action must create an audit log.

## 25. Mobile-specific rules

Mobile screens must avoid dense tables. Convert tables to stacked cards with clear actions.

For patient, sponsor, guardian, and Care Partner mobile screens:

- keep primary CTA above the fold
- use bottom navigation or a compact menu
- avoid horizontal scrolling
- show status badges prominently
- preserve long form progress
- use step-based forms for symptom intake and onboarding

For doctor and admin screens on mobile:

- mobile can be read-only or limited if full workbench requires desktop
- do not squeeze unsafe clinical workflows into unusable mobile layouts
- show a clear message when desktop is recommended

## 26. Empty-state copy examples

Bad: “No data.”

Good patient appointment empty state:

> You do not have any upcoming consultations. Start a symptom intake or book a routine consultation.

Good sponsor empty state:

> No family member has been added yet. Add a parent or relative and ask them to approve what updates you can see.

Good Care Partner empty state:

> You have no assigned care tasks today. New tasks will appear here after a patient or care team assigns you.

Good HMO empty state:

> No members have been imported yet. Upload a member list to activate access for this plan.

## 27. Error-state copy examples

Bad: “Failed.”

Good:

> We could not load this record because your access may have changed. Refresh the page or contact support if this looks wrong.

Good consent revoked:

> Access has been revoked. You can no longer view this family member’s health summary unless they grant access again.

Good organization boundary:

> This member does not belong to your organization account. Contact MediMate support if you believe this is an import error.

## 28. Design review checklist before merge

- Is this screen role-specific?
- Is sensitive data minimized?
- Is the main action obvious?
- Is the denied state clear?
- Is copy clinically cautious?
- Are minors and adolescents treated correctly?
- Does it work on mobile where needed?
- Does it avoid generic SaaS filler?
- Does it match the documented route purpose?
- Does it have tests for states and permissions?
