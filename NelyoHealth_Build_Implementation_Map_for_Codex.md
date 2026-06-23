# NelyoHealth Build and Implementation Map

**Sequential Delivery Plan for Codex in the IDE**  
**Project:** NelyoHealth  
**Date:** 23 June 2026

## Contents

| **Sections**                                             | **Phases**                                                             |
|----------------------------------------------------------|------------------------------------------------------------------------|
| Document Control and Locked Product Decisions            | Phase 8: Service catalogue, pricing, payments, and ledger              |
| NelyoHealth Build and Implementation Map                 | Phase 9: Scheduling, availability, intake, and triage                  |
| 1\. Recommended delivery strategy                        | Phase 10: Video consultation and clinical encounter                    |
| 2\. Codex repository operating system                    | Phase 11: Electronic prescription domain                               |
| Phase 0: Product, clinical, and regulatory foundation    | Phase 12: Pharmacy matching and medicine fulfilment                    |
| Phase 1: Repository and Codex foundation                 | Phase 13: Laboratory ordering and results                              |
| Phase 2: Platform and infrastructure foundation          | Phase 14: Hospital, specialist, urgent, and emergency referrals        |
| Phase 3: Identity, accounts, organizations, and tenancy  | Phase 15: Companies, HMOs, benefits, SSO, and claims                   |
| Phase 4: Authorization, consent, guardianship, and audit | Phase 16: Home and continuing care                                     |
| Phase 5: Design system and application shells            | Phase 17: Administration, operations, support, and analytics           |
| Phase 6: Patient, family, guardian, and diaspora core    | Phase 18: External APIs and interoperability                           |
| Phase 7: Provider, practitioner, and facility registry   | Phase 19: Security, privacy, clinical safety, and production hardening |
| 3\. Definition of done for every Codex task              | Phase 20: Controlled pilot and production launch                       |
| 4\. Codex task template                                  | Phase 21: Scale and post-pilot expansion                               |
| 5\. Release milestones                                   | References for Codex browser integration                               |

## Document Control and Locked Product Decisions

This document preserves the sequential implementation phases previously defined for NelyoHealth and adds a mandatory browser-testing workflow for Codex in the IDE.

> **Locked pharmacy and laboratory discovery rule**  
> Before payment, the only pharmacy or laboratory identity detail exposed to the patient is the provider’s **name**. The patient may see the quote and service information required to decide whether to pay, but the address, precise distance, map coordinates, telephone number, email address, branch identifier, directions, photographs, external links, and fulfilment or collection instructions remain obscured. Those details are released only after successful payment and are then available solely within the authorised order or booking workflow. This restriction must be enforced by the backend response contract, not merely hidden with CSS or client-side state.
>
> **Locked browser-testing rule**  
> Codex must have browser access from the IDE through Playwright-based tooling. Every user-facing task must be tested in a real browser as well as through repeatable automated test suites. Interactive browser inspection never replaces CI tests, and CI tests never replace visual and behavioural inspection in a live browser.


The phase gates below are sequential. Work packages inside a phase may run in parallel, but the next phase should not begin until the current phase’s exit gate passes.

Do not give Codex an entire phase as a single prompt. Each phase should become an execution plan, then several narrowly scoped issues and pull requests. OpenAI’s current guidance recommends giving Codex a goal, relevant context, constraints, and a concrete definition of done. It also recommends storing durable repository instructions in `AGENTS.md`, using planning documents for complex work, and requiring tests and validation before accepting changes.

## 1. Recommended delivery strategy

Build NelyoHealth as a **modular monolith in a TypeScript monorepo**.

The first production release should be:

- Responsive patient web application
- Doctor and provider portal
- Operations and admin portal
- Adult outpatient consultations
- Family and diaspora sponsorship
- Selected pharmacies and laboratories
- Payments, prescriptions, results, and follow-ups
- One controlled geographic market

Native mobile applications, extensive HMO integrations, home care, and national expansion should follow after the web-based workflow has been proven.

This gives you a progression of:

```text
Platform foundation
    ↓
Patient and provider identities
    ↓
Paid consultation
    ↓
Prescription and pharmacy fulfilment
    ↓
Laboratory and referral loops
    ↓
HMO and employer layers
    ↓
Home care
    ↓
Production hardening and expansion
```

## 2. Codex repository operating system

### Recommended repository structure

```text
nelyohealth/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .codex/
│   └── config.toml
├── .agent/
│   └── PLANS.md
├── .agents/
│   └── skills/
│       └── nelyo-browser-validation/
│           └── SKILL.md
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── CODEOWNERS
├── docs/
│   ├── SPEC.md
│   ├── STATUS.md
│   ├── glossary.md
│   ├── architecture/
│   ├── product/
│   ├── clinical/
│   ├── compliance/
│   ├── security/
│   ├── testing/
│   ├── runbooks/
│   ├── adr/
│   └── exec-plans/
├── apps/
│   ├── api/
│   ├── worker/
│   ├── patient-web/
│   ├── provider-web/
│   ├── organization-web/
│   ├── admin-web/
│   └── mobile/
├── packages/
│   ├── database/
│   ├── contracts/
│   ├── authz/
│   ├── domain/
│   ├── ui/
│   ├── integrations/
│   ├── observability/
│   ├── notifications/
│   ├── testkit/
│   ├── eslint-config/
│   └── typescript-config/
├── tests/
│   ├── e2e/
│   ├── visual/
│   ├── accessibility/
│   ├── fixtures/
│   └── browser-artifacts/
└── infra/
    ├── docker/
    ├── terraform/
    └── scripts/
```

Keep `apps/mobile` as a shell initially. Do not try to maintain complete native-mobile parity while the product workflows are still changing.

### Repository-level `AGENTS.md`

Your root `AGENTS.md` should encode the permanent rules of the platform:

```text
Product invariants
- A payer does not automatically receive access to clinical records.
- Every patient has one longitudinal identity even when covered by several plans.
- Emergency flows must not be blocked by payment.
- Clinical records are corrected by amendment, not silent overwriting.
- Every financial, clinical, consent, credential, and access event is auditable.
- No protected health information may appear in logs, analytics, fixtures, or notifications.
- Every query must enforce tenant and relationship access controls.
- Workflow status changes must go through domain state machines.
- External callbacks and webhooks must be authenticated and idempotent.
- Before payment, a patient-facing pharmacy or laboratory result may expose the provider name only.
- Pharmacy or laboratory address, precise location, coordinates, contact details, branch data,
  directions, photographs, external links, and fulfilment instructions must be omitted from
  pre-payment API responses and client state.
- Provider details may be released only after successful payment and only for the authorised order.

Engineering rules
- Use pnpm.
- Run lint, typecheck, unit tests, integration tests, browser tests, and builds before completion.
- Add an ADR before introducing a new major dependency or infrastructure component.
- Do not access the database directly from controllers.
- Do not call external providers inside a database transaction.
- Every migration needs a rollout and rollback strategy.
- Every feature requires loading, empty, error, unauthorized, offline, and retry states.
- Every new endpoint requires authorization and audit tests.
- Every user-facing change must be opened and inspected in a real browser by Codex.
- Use Playwright for deterministic end-to-end tests and Playwright interactive for IDE inspection.
- Browser validation must cover desktop, tablet, and mobile viewports as applicable.
- Browser validation must check console errors, failed requests, keyboard navigation, focus order,
  responsive layout, privacy boundaries, authorization boundaries, and the main happy and failure paths.
- Use synthetic test data only. Never enter real patient data into browser tests.
```

Create additional `AGENTS.md` files inside sensitive areas:

```text
apps/api/src/modules/clinical/AGENTS.md
apps/api/src/modules/payments/AGENTS.md
apps/api/src/modules/access/AGENTS.md
apps/api/src/modules/marketplace/AGENTS.md
apps/patient-web/AGENTS.md
apps/provider-web/AGENTS.md
infra/AGENTS.md
```

Codex automatically reads repository instructions and supports more specific guidance in nested directories, allowing payment, clinical, marketplace, frontend, and infrastructure code to carry stricter local rules.

### Codex browser access in the IDE

Codex supports Model Context Protocol servers in both the CLI and the IDE extension, and both clients share `config.toml`. Configure a project-scoped Playwright MCP server so Codex can control and inspect a real browser from the IDE.

Initial setup command:

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest
```

After confirming the setup works, pin the Playwright MCP package version in `.codex/config.toml` rather than relying indefinitely on `latest`:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@<pinned-version>"]
enabled = true
required = true
startup_timeout_sec = 30
tool_timeout_sec = 120
default_tools_approval_mode = "prompt"
```

In the Codex IDE extension, use **MCP settings \> Open config.toml** to inspect or update the project configuration. Confirm the Playwright server is visible and healthy before assigning frontend implementation work.

Install browser-test dependencies in the repository as well:

```bash
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install --with-deps chromium
```

The repository should provide these commands:

```bash
pnpm test:browser
pnpm test:browser:headed
pnpm test:browser:ui
pnpm test:browser:debug
pnpm test:visual
pnpm test:visual:update
pnpm test:a11y
```

Create `.agents/skills/nelyo-browser-validation/SKILL.md` so Codex can invoke a repeatable repository-specific workflow. The skill should require Codex to:

1.  Start or reuse the appropriate local development services.
2.  Seed synthetic users, organizations, plans, orders, and provider records.
3.  Open the changed route in a real browser with Playwright interactive.
4.  Exercise the primary happy path and at least one relevant failure path.
5.  Test at representative mobile, tablet, and desktop viewports.
6.  Inspect browser console output and failed network requests.
7.  Verify keyboard navigation, focus order, labels, validation, loading, empty, offline, unauthorized, and retry states.
8.  Verify tenant, role, relationship, consent, and patient privacy boundaries.
9.  Capture screenshots for meaningful visual states.
10. Run the deterministic Playwright suite after interactive inspection.
11. Save failure traces, screenshots, and videos under ignored test-artifact directories.
12. Report exactly what was tested and any remaining uncertainty.

For pharmacy and laboratory discovery, browser tests must additionally verify that:

- Before payment, only the provider name is present as a provider identity field.
- Address, precise location, coordinates, contact data, directions, branch data, images, external links, and fulfilment instructions are absent from the HTML, browser state, API payload, GraphQL cache if used, network response, and client logs.
- Direct navigation or API calls cannot retrieve the protected fields before payment.
- A successful payment unlocks the details only for the authorised patient, guardian, or delegated actor attached to that order.
- Another patient, sponsor without clinical or order permission, organization administrator, or unrelated tenant cannot retrieve the unlocked details.
- Failed, cancelled, expired, or abandoned payment attempts do not unlock the details.

OpenAI’s Codex guidance explicitly describes Playwright as a way for Codex to open a real browser, resize it for different breakpoints, inspect behaviour, and iterate. Treat that workflow as a mandatory validation gate rather than an optional visual check.

### Execution plan structure

Create one execution plan per phase:

```text
docs/exec-plans/
├── P00-product-foundation.md
├── P01-repository-foundation.md
├── P02-platform-infrastructure.md
├── P03-identity-tenancy.md
└── ...
```

Each execution plan should include:

1.  Objective
2.  Existing context
3.  Scope
4.  Non-goals
5.  Domain rules
6.  Data-model changes
7.  API changes
8.  User-interface changes
9.  Security and privacy requirements
10. Browser-test scenarios
11. Milestones
12. Acceptance criteria
13. Validation commands
14. Rollback plan
15. Known risks
16. Decisions made during implementation

For complex phases, let Codex create a plan first and review it before implementation. For independent reviews, Codex subagents can separately inspect security, correctness, race conditions, test quality, browser coverage, accessibility, and maintainability. They must be explicitly requested.

## Phase 0: Product, clinical, and regulatory foundation

### Outcome

A frozen implementation target that prevents Codex from building technically impressive but operationally incorrect healthcare workflows.

### Put in place

#### Product definition

Document:

- Initial launch location
- Initial service categories
- Initial supported patient ages
- Supported consultation types
- Which prescriptions may be fulfilled
- Which laboratory tests may be ordered
- Which payment methods are accepted
- Which provider categories are included in the first pilot
- What is deliberately excluded

Create detailed journeys for:

- Individual patient
- Family-plan owner
- Family member
- Diaspora sponsor
- Minor and guardian
- Doctor
- Pharmacy
- Laboratory
- Hospital
- Employer
- HMO
- Home-care agency
- Platform administrator

#### Domain glossary

Define terms including:

- Person
- User account
- Patient
- Beneficiary
- Dependent
- Sponsor
- Payer
- Guardian
- Caregiver
- Member
- Coverage
- Plan
- Benefit
- Organization
- Facility
- Practitioner
- Encounter
- Consultation
- Prescription
- Diagnostic order
- Referral
- Claim
- Fulfilment

These definitions must be reflected consistently in database tables, API contracts, code, and UI text.

#### Workflow state machines

Document legal state transitions for:

- Appointment
- Encounter
- Prescription
- Laboratory order
- Pharmacy order
- Referral
- Payment
- Refund
- Claim
- Credential verification
- Home-care visit
- Guardian verification
- Consent

#### Clinical safety

Document:

- Emergency red flags
- Escalation rules
- Consultation suitability rules
- Clinician response expectations
- Laboratory critical-result rules
- Prescription restrictions
- Referral urgency levels
- Failed-contact escalation
- Clinical incident reporting

#### Compliance and operational map

Create a living obligations register covering:

- Data protection
- Consent
- Children and guardians
- Health record retention
- Provider licensing
- Pharmacy operations
- Laboratory operations
- Insurance and HMO relationships
- Payment-provider responsibilities
- Cross-border sponsorship
- Complaints and dispute handling
- The pre-payment provider-detail obscurity rule and its legal review status

This register should be reviewed by Nigerian healthcare and legal professionals before launch.

### Deliverables

```text
docs/SPEC.md
docs/glossary.md
docs/product/personas.md
docs/product/mvp-scope.md
docs/product/user-journeys.md
docs/product/provider-discovery-privacy.md
docs/clinical/clinical-safety-model.md
docs/clinical/emergency-protocol.md
docs/compliance/obligations-register.md
docs/architecture/domain-boundaries.md
```

### Exit gate

Phase 0 passes when:

- The MVP scope is explicit
- All principal workflows have state diagrams
- Emergency handling is documented
- Patient, payer, guardian, and organization relationships are unambiguous
- The pharmacy and laboratory detail-release rule is expressed as an API and authorization invariant
- All unresolved regulatory questions have named owners
- Non-goals have been documented

## Phase 1: Repository and Codex foundation

### Outcome

A reproducible repository in which Codex can safely implement one bounded task at a time.

### Put in place

- GitHub repository and organization
- Monorepo using pnpm workspaces
- Task runner such as Turborepo
- Root and nested `AGENTS.md`
- `.agent/PLANS.md`
- Codex configuration
- Project-scoped Playwright MCP configuration
- Repository browser-validation skill
- Pull-request template
- Issue templates
- CODEOWNERS
- Branch protection
- Conventional commit rules
- Changeset or release-note process
- Dependency update automation
- Secret scanning
- Basic static analysis
- CI skeleton

Create standard commands:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm test:browser
pnpm test:browser:headed
pnpm test:visual
pnpm test:a11y
pnpm build
pnpm db:migrate
pnpm db:seed
```

### GitHub issue convention

Use identifiers that show phase and domain:

```text
P03-IAM-001 Create Person and UserAccount models
P03-IAM-002 Add tenant-context middleware
P03-IAM-003 Implement organization invitations
P03-IAM-004 Add tenant-isolation integration tests
```

One issue should normally produce one reviewable pull request.

### Exit gate

- New developers can run the repository from documented steps
- CI executes lint, typecheck, tests, browser tests, accessibility checks, and build
- Codex can read the repository instructions
- Codex in the IDE can open and inspect the local application in a real browser
- The Playwright MCP server is configured and verified
- Pull requests cannot merge with failed checks
- No application feature code exists outside the defined architecture

## Phase 2: Platform and infrastructure foundation

### Outcome

A deployable application skeleton with local, development, and staging environments.

### Put in place

#### Applications

- NestJS API
- Background worker
- Next.js patient application
- Next.js provider application
- Next.js organization application
- Next.js admin application
- Empty Expo or React Native application

#### Infrastructure

- PostgreSQL
- PostGIS
- Redis
- Object storage
- Background job queue
- Email adapter
- SMS adapter
- Push-notification abstraction
- Feature-flag service
- Secrets manager
- Managed logging
- Metrics and tracing
- Error reporting

#### Backend conventions

- Modular-monolith module boundaries
- REST APIs
- OpenAPI generation
- Typed frontend API client
- Request IDs
- Correlation IDs
- Standard error format
- Idempotency-key middleware
- Database transaction helpers
- Transactional outbox
- Domain event dispatch
- Retry and dead-letter queues
- Health and readiness endpoints

#### Browser-test harness

- Playwright configuration for Chromium
- Separate projects for patient, provider, organization, and admin applications
- Desktop, tablet, and mobile viewport projects
- Authenticated storage states for synthetic roles
- Synthetic test-data builders
- Database reset and deterministic seed commands
- API request helpers
- Page-object or screen-object conventions
- Console-error and failed-request assertions
- Trace, screenshot, and video capture on failure
- Visual snapshot conventions
- Accessibility scans with `@axe-core/playwright`
- Route-level privacy assertions
- CI sharding and retry policy
- Browser-artifact retention policy

#### Environments

```text
Local
Ephemeral pull-request environment
Development
Staging
Production
Partner sandbox
```

Production data must never be copied into lower environments.

#### Infrastructure as code

Set up:

- Network
- Application hosting
- Managed PostgreSQL
- Redis
- Object storage
- Queue
- DNS
- TLS
- CDN
- Web application firewall
- Secrets
- Backups
- Monitoring

### Exit gate

- A change merged into the main branch deploys automatically to development
- A version can be promoted to staging
- Database migrations run safely
- Logs, traces, and metrics connect one request across API and worker
- A background job can be enqueued, processed, retried, and dead-lettered
- A document can be uploaded using a signed URL
- Browser tests can start the application, seed data, sign in, navigate, and save failure traces
- Codex can inspect local routes from the IDE and report browser console and network failures
- No vendor-specific code leaks outside integration adapters

## Phase 3: Identity, accounts, organizations, and tenancy

### Outcome

Every actor has a stable identity, and every organization is securely isolated.

### Put in place

#### Core model

```text
Person
UserAccount
ExternalIdentity
ContactPoint
Address
Organization
Facility
OrganizationMembership
RoleAssignment
Invitation
Session
Device
AuthenticationEvent
```

Keep `Person` separate from `UserAccount`. A child, incapacitated person, or imported HMO beneficiary may be a patient without having their own login.

#### Authentication

Support:

- Phone-number registration
- Email registration
- OTP verification
- Passwordless or password authentication
- MFA for providers and administrators
- Session management
- Trusted-device management
- Account recovery
- Phone-number change workflow
- Suspicious-login handling
- Login rate limiting

Prefer a mature identity provider rather than implementing cryptography and session security from scratch.

#### Multi-tenancy

Implement:

- Tenant context on every request
- Organization switching
- Organization invitations
- Staff membership
- Membership suspension
- Staff offboarding
- Facility-level roles
- Organization-level settings
- Tenant-scoped database access helpers

#### SSO architecture

Do not implement every enterprise protocol yet. Establish adapters for:

- OpenID Connect
- SAML
- Just-in-time provisioning
- SCIM
- Workforce roster import

#### Browser validation

Codex must test registration, login, MFA prompts, recovery, organization switching, invitation acceptance, membership removal, unauthorized routes, and cross-tenant isolation in a real browser. Network responses must be inspected to confirm that rejected cross-tenant requests do not leak record existence or sensitive metadata.

### Exit gate

- A patient can register and authenticate
- An organization administrator can invite a staff member
- One user can belong to multiple organizations
- A user can switch organization context
- Cross-tenant access tests fail closed
- Removing a membership immediately removes organizational access
- Provider and admin accounts require MFA
- Browser tests cover identity and tenant-isolation journeys across supported viewport sizes

## Phase 4: Authorization, consent, guardianship, and audit

### Outcome

Access depends on role, relationship, purpose, consent, organization, and encounter context.

### Put in place

#### Authorization model

Combine:

- Role-based access control
- Attribute-based access control
- Relationship-based access control

Policy inputs should include:

```text
Actor
Role
Organization
Patient
Relationship
Requested resource
Requested action
Purpose
Consent
Active encounter
Emergency status
Time
```

#### Relationship model

Implement:

```text
GuardianRelationship
HouseholdRelationship
SponsorRelationship
CaregiverDelegation
EmergencyContact
ClinicalProxy
```

Each relationship needs:

- Status
- Verification method
- Effective date
- Expiry date
- Permitted actions
- Revocation information
- Supporting documents
- Review history

#### Consent

Implement granular consent for:

- Telemedicine
- Sharing data with another provider
- Sponsor access
- Family-member access
- Caregiver participation
- Consultation participants
- Recording, normally disabled
- Marketing
- Research
- Cross-border processing
- Emergency access

Consent must be versioned and revocable.

#### Audit

Every sensitive event should record:

- Actor
- Patient or subject
- Organization
- Action
- Resource
- Purpose
- Timestamp
- Request ID
- Previous and new state where appropriate
- IP and device metadata
- Whether break-glass access was used

#### Break-glass access

Implement:

- Reason capture
- Short-lived access
- Automatic notification to compliance
- Post-event review
- Patient-visible access history where appropriate

#### Browser validation

Codex must use browser-driven role switching and synthetic accounts to prove that payer, sponsor, employer, HMO, guardian, caregiver, clinician, support, and administrator permissions remain distinct. Tests must attempt direct route access, manipulated identifiers, stale sessions, revoked consent, expired relationships, and browser back-navigation after revocation.

### Exit gate

- Every protected endpoint has policy tests
- Sponsor payment access does not grant clinical access
- Guardian access can be restricted and revoked
- Break-glass access is time-limited and audited
- Audit events cannot be edited through the application
- Administrators cannot silently impersonate patients
- Browser tests verify access loss immediately after consent or relationship revocation

## Phase 5: Design system and application shells

### Outcome

All applications share a consistent, responsive, accessible interaction system.

### Put in place

#### Design system

Create:

- Typography
- Spacing
- Color tokens
- Form controls
- Validation states
- Buttons
- Tables
- Cards
- Dialogs
- Drawers
- Tabs
- Stepper
- Timeline
- Status badge
- Notification banner
- File uploader
- Map components
- Appointment calendar
- Video consultation frame
- Chat interface
- Clinical data display
- Skeleton and loading states

#### Application shells

Build shells for:

- Patient
- Provider
- HMO and employer
- Admin and operations

Each shell should include:

- Role-aware navigation
- Profile switching
- Organization switching
- Notification center
- Help and support
- Session management
- Accessibility settings
- Connection-status indicator

#### Accessibility

Automate:

- Keyboard testing
- Focus management
- Accessible labels
- Contrast checks
- Screen-reader checks
- Reduced-motion behavior
- Text-resizing behavior

#### Low-bandwidth behavior

Design:

- Progressive loading
- Resumable uploads
- Video-to-audio fallback
- Retryable requests
- Draft preservation
- Offline connection warnings
- Lightweight dashboard payloads

#### Browser visual-validation matrix

Codex must inspect every shared component and shell in a live browser at representative widths, including approximately 390 px mobile, 768 px tablet, and 1440 px desktop. It must validate hover, focus, active, disabled, loading, empty, validation-error, server-error, offline, unauthorized, and reduced-motion states. Visual snapshots should cover stable shared components and critical page layouts, while dynamic content should use targeted assertions rather than brittle full-page snapshots.

### Exit gate

- All four application shells deploy
- Shared components pass automated accessibility checks
- All pages have loading, empty, error, unauthorized, and offline states
- Patient workflows are usable on small mobile screens
- Codex has opened and inspected each shell in a real browser
- No domain-specific business logic exists inside shared UI components

## Phase 6: Patient, family, guardian, and diaspora core

### Outcome

The platform can represent one patient under several payment, family, and caregiving arrangements without creating duplicate medical records.

### Put in place

#### Patient record

```text
PatientProfile
PatientIdentifier
EmergencyContact
Address
CommunicationPreference
MedicalHistory
Allergy
MedicationStatement
Condition
PatientDocument
AccessibilityRequirement
```

#### Patient onboarding

Support:

- Identity verification
- Demographics
- Preferred language
- Address and location
- Emergency contacts
- Allergies
- Existing medications
- Medical conditions
- Pregnancy information where relevant
- Accessibility needs
- Communication preferences

#### Duplicate detection

Add:

- Phone matching
- Email matching
- Name and date-of-birth matching
- HMO member-number matching
- Manual merge-review queue
- Safe account-merge workflow

Never automatically merge medical records solely because names are similar.

#### Family plans

Implement:

- Household
- Household administrator
- Members
- Dependents
- Plan payer
- Spending limits
- Member removal
- Member transfer
- Family activity that does not expose clinical details

#### Minors and guardians

Implement:

- Guardian invitations
- Supporting evidence
- Verification queue
- Multiple guardians
- Restricted guardian
- Scheduling permission
- Payment permission
- Consultation participation permission
- Record-viewing permission
- Age-of-majority transition

#### Diaspora sponsorship

Implement:

- Sponsor identity
- Beneficiary invitation
- Beneficiary acceptance
- Sponsor funding limit
- Per-service approval rules
- Payment notifications
- Receipt access
- Separate clinical-record consent

#### Browser validation

Codex must test the same patient across individual, family, guardian, company, HMO, and diaspora contexts. It must verify that switching the payer or plan does not duplicate the patient record or expose clinical information to a sponsor or household administrator. Tests must cover mobile onboarding, interrupted onboarding, document upload failure, guardian revocation, beneficiary rejection, and age-of-majority transition boundaries.

### Exit gate

- One patient can be a company member, HMO beneficiary, family member, and diaspora beneficiary simultaneously
- No duplicate clinical record is created
- A guardian can manage a minor within granted permissions
- A sponsor can pay without seeing diagnoses
- An adult patient can revoke sponsor or family clinical access
- Patient profile changes are audited
- Browser tests verify payer and clinical-access separation

## Phase 7: Provider, practitioner, and facility registry

### Outcome

Only verified and currently eligible providers can offer services.

### Put in place

#### Provider model

```text
Practitioner
PractitionerRole
PractitionerCredential
Specialty
Facility
FacilityCredential
FacilityService
ServiceArea
OperatingHours
CredentialReview
CredentialExpiry
Sanction
```

#### Provider types

Model:

- Doctor
- Pharmacist
- Laboratory scientist
- Nurse
- Home-care worker
- Hospital coordinator
- Organization administrator
- Finance operator

#### Credential workflow

```text
DRAFT
→ SUBMITTED
→ UNDER_REVIEW
→ VERIFIED
→ EXPIRED
→ SUSPENDED
→ REJECTED
```

Support:

- Document uploads
- Manual verification
- Registry-integration adapters
- Review notes
- Renewal
- Expiration reminders
- Automatic booking suspension
- Appeal and correction
- Compliance review history

#### Facility model

Support:

- Multiple branches
- Staff memberships
- Service catalogue
- Geographic coordinates
- Operating hours
- Service radius
- Accessibility information
- Contact channels
- HMO network membership
- Delivery capability
- Home-collection capability

Provider coordinates and contact channels are internal and privileged data. They must not be returned to patient-facing pharmacy or laboratory search interfaces before payment, even when they exist in the facility registry.

#### Provider portals

Build:

- Onboarding wizard
- Credential dashboard
- Staff management
- Facility management
- Service configuration
- Availability shell
- Verification-status display
- Suspension and remediation workflow

#### Browser validation

Codex must test provider onboarding, document uploads, review states, expiry, suspension, staff invitations, branch switching, and permission boundaries. Patient-facing tests must confirm that unverified or suspended facilities do not appear and that protected pharmacy and laboratory details do not leak from provider-registry APIs.

### Exit gate

- An unverified provider cannot appear in search
- Expired credentials prevent new bookings
- Facility administrators can manage staff without accessing unrelated patient records
- Credential changes are audited
- Doctor, pharmacy, laboratory, hospital, and home-care entities can all be represented
- Browser and API tests confirm provider-registry fields are filtered by context

## Phase 8: Service catalogue, pricing, payments, and ledger

### Outcome

NelyoHealth can quote, authorize, collect, refund, reconcile, and settle payments safely.

### Put in place

#### Commerce model

```text
ServiceDefinition
PriceBook
Price
Quote
Invoice
InvoiceLine
PaymentIntent
PaymentTransaction
Refund
Dispute
Payout
LedgerAccount
LedgerEntry
ReconciliationRecord
```

#### Service catalogue

Define services such as:

- General consultation
- Specialist consultation
- Follow-up consultation
- Laboratory test
- Home collection
- Medication
- Delivery
- Home-care visit
- Platform fee

#### Double-entry ledger

Create accounts for:

- Patient
- Sponsor
- Employer
- HMO
- Provider
- Platform revenue
- Payment clearing
- Refund liability
- Provider payable

The displayed “wallet” should be backed by ledger entries. Do not calculate balances from a collection of successful payment records.

#### Payment lifecycle

```text
CREATED
→ REQUIRES_ACTION
→ AUTHORIZED
→ CAPTURED
→ SETTLED
```

Failure branches:

```text
FAILED
CANCELLED
EXPIRED
PARTIALLY_REFUNDED
REFUNDED
DISPUTED
```

#### Payment-provider abstraction

Implement:

- Payment initialization
- Authorization
- Capture
- Verification
- Refund
- Webhook verification
- Idempotency
- Reconciliation
- Provider payout
- International sponsor-payment adapter

#### Sponsorship

Support:

- Family funding account
- Diaspora funding account
- Service-specific limit
- Beneficiary-specific limit
- Per-transaction approval
- Monthly budget
- Low-balance notification
- Sponsor receipts

#### Detail-release event

Successful payment must emit an auditable domain event that authorizes release of the selected pharmacy or laboratory details for the relevant order. The release must not be inferred from client-side success screens. It must rely on verified backend payment state and be idempotent. Failed, cancelled, expired, disputed-before-capture, or abandoned payments must not release the details.

#### Browser validation

Codex must test card or transfer redirects where applicable, duplicate submissions, refresh during payment, browser back-navigation, webhook delay, success-page spoofing, failed payment, expired payment, refund, and reconciliation mismatch. It must inspect network responses to verify that protected provider details are absent until the backend payment state permits release.

### Exit gate

- The same request cannot charge a patient twice
- A payment can be authorized and captured separately
- Refunds produce balanced ledger entries
- Webhooks can be replayed safely
- Daily gateway reconciliation identifies missing or mismatched transactions
- Payment failure never corrupts a clinical or order state
- Only a verified successful payment can trigger provider-detail release
- Browser tests prove that a forged client success state cannot unlock provider details

## Phase 9: Scheduling, availability, intake, and triage

### Outcome

Patients can safely book the right provider and arrive at a consultation with the necessary information collected.

### Put in place

#### Scheduling model

```text
Schedule
AvailabilityRule
AvailabilityException
AppointmentSlot
Appointment
WaitlistEntry
AppointmentParticipant
AppointmentReminder
```

#### Scheduling functionality

Support:

- Recurring availability
- One-time exceptions
- Breaks and buffers
- Time-zone handling
- Slot reservation
- Double-booking prevention
- Rescheduling
- Cancellation
- Waitlist
- No-show
- Provider delay
- Follow-up booking
- Organization-sponsored booking

#### Appointment states

```text
DRAFT
HELD
PENDING_PAYMENT
CONFIRMED
CHECKED_IN
IN_PROGRESS
COMPLETED
CANCELLED
NO_SHOW
EXPIRED
```

#### Intake

Collect:

- Presenting complaint
- Symptom duration
- Relevant history
- Allergies
- Current medication
- Measurements
- Location
- Emergency contact
- Files and images
- Accessibility needs
- Consent

#### Triage

Implement clinically approved red-flag questions and routing:

```text
Self-care information
Routine appointment
Priority appointment
Urgent referral
Emergency escalation
```

Do not implement autonomous diagnosis.

#### Notifications

Implement neutral reminders through:

- In-app
- Email
- SMS
- Push
- Optional messaging-channel adapters

Notifications should avoid including diagnoses, medications, or laboratory details.

#### Browser validation

Codex must test slot concurrency, stale slots, interrupted intake, validation, uploads, emergency red flags, low-bandwidth behaviour, rescheduling, cancellation, refunds, waitlists, no-shows, and timezone display. The browser suite should use parallel workers to attempt booking the same final slot and prove that only one booking succeeds.

### Exit gate

- A patient can find, reserve, pay for, and confirm an appointment
- Double bookings are prevented under concurrency
- Emergency red flags bypass normal booking
- Reminder jobs are retryable
- Failed payment releases the held slot
- Cancellation and refund rules are deterministic
- Browser tests cover the complete appointment journey on mobile and desktop

## Phase 10: Video consultation and clinical encounter

### Outcome

NelyoHealth supports a complete paid telemedicine consultation with a signed clinical record and follow-up plan.

### Put in place

#### Video infrastructure

Use a video-provider abstraction supporting:

- Waiting room
- Server-generated access tokens
- Patient and doctor roles
- Background blur
- Audio-only mode
- Reconnection
- Connection-quality indicators
- Participant controls
- Screen or document sharing where appropriate
- Session events
- No recording by default

#### Encounter model

```text
Encounter
EncounterParticipant
ClinicalNote
Diagnosis
Observation
Attachment
CareInstruction
FollowUpPlan
EncounterAmendment
ClinicalSignature
```

#### Encounter states

```text
PLANNED
WAITING
IN_PROGRESS
INTERRUPTED
COMPLETED
INCOMPLETE
CANCELLED
REFERRED
ESCALATED
```

#### Clinician functionality

- Review intake
- Review patient summary
- Confirm identity
- Record history
- Record examination limitations
- Add diagnosis or differential
- Record observations
- Create prescription
- Create laboratory order
- Create referral
- Create follow-up
- Add safety-net instructions
- Sign encounter note

#### Patient functionality

- Join waiting room
- Test camera and microphone
- Use audio fallback
- Upload files
- Invite an approved participant
- Receive visit summary
- View follow-up instructions
- Report technical failure

#### Clinical record integrity

- Signed notes become immutable
- Corrections create amendments
- Drafts are autosaved
- Access is audited
- Provider credentials are rechecked before encounter start

#### Browser validation

Codex must exercise waiting-room entry, camera and microphone denial, audio fallback, reconnect, clinician delay, participant invitation, note autosave, signing, post-sign amendment, unauthorized note access, and mobile responsiveness. Where real media devices are unavailable, tests should use browser permissions and synthetic media while still verifying the actual page behaviour and provider integration boundaries.

### Exit gate

- A patient can complete registration-to-consultation end to end
- Disconnection does not lose notes
- A signed note cannot be silently edited
- A sponsor who paid cannot view the note without consent
- A failed video session can move to audio or be rescheduled
- Consultation completion produces a clear disposition
- Codex has inspected the complete encounter flow in a real browser

This is the first usable B2C consultation milestone.

## Phase 11: Electronic prescription domain

### Outcome

Doctors can create safe, signed, traceable prescriptions that pharmacies can verify.

### Put in place

#### Prescription model

```text
Prescription
PrescriptionItem
MedicationCatalogItem
DosageInstruction
SubstitutionPermission
PrescriptionSignature
PrescriptionAmendment
PrescriptionCancellation
PharmacistClarification
```

#### Prescription functionality

- Generic and brand naming
- Strength
- Dosage form
- Quantity
- Frequency
- Route
- Duration
- Instructions
- Refill policy
- Expiry
- Prescriber details
- Digital signature
- Patient instructions
- Cancellation
- Replacement
- Pharmacy clarification

#### Safety checks

Implement warnings for:

- Recorded allergies
- Duplicate active therapy
- Missing dosage
- Missing quantity
- Excessive duration
- Pregnancy considerations where data exists
- Restricted fulfilment category
- Expired prescription
- Already-dispensed quantity

Warnings requiring clinical judgment should not silently block the clinician. They should require acknowledgment and reason capture.

#### Immutability

A signed prescription must not be edited. Changes create:

- New version
- Cancellation of old version
- Link between versions
- Audit event
- Notifications to affected parties

#### Browser validation

Codex must test prescribing forms, medication search, validation, allergy and duplication warnings, acknowledgement reasons, signing, cancellation, replacement, expiry, pharmacist clarification, and unauthorized access. Browser tests must verify that signed content displayed later exactly matches the signed version and cannot be altered through stale forms or manipulated requests.

### Exit gate

- A doctor can sign a prescription
- A pharmacy can verify authenticity
- A cancelled prescription cannot be dispensed
- Dispensing quantity cannot exceed the permitted amount
- All overrides and acknowledgments are audited
- Restricted categories are blocked from ordinary online fulfilment
- Browser tests cover signed, cancelled, replaced, and expired prescriptions

## Phase 12: Pharmacy matching and medicine fulfilment

### Outcome

A prescription can become a reserved, paid, dispensed, delivered, and closed medication order.

### Put in place

#### Inventory

```text
PharmacyInventoryItem
StockSnapshot
StockReservation
InventoryImport
InventoryAdjustment
```

Support:

- Manual inventory
- CSV import
- Partner API
- Stock timestamp
- Quantity
- Batch and expiry where appropriate
- Cold-chain capability
- Reservation expiry
- Inventory reconciliation

#### Matching

Search progressively:

```text
4 km
8 km
15 km
30 km
Citywide
Approved wider network
```

Filter and rank by:

- Exact medicine
- Strength
- Dosage form
- Quantity
- Valid prescription
- Stock freshness
- Pharmacy status
- Price
- Delivery time
- Cold-chain requirements
- Coverage network
- Reliability
- Patient accessibility needs

The matching service may use full facility data internally. The pre-payment patient response must expose only the pharmacy name as the pharmacy identity field. It may expose the quote, medicine availability, total price, estimated fulfilment or delivery window, and payment terms needed to select and pay, but it must not expose address, precise distance, coordinates, contact details, branch identifiers, directions, photographs, external links, pickup instructions, or delivery-origin details.

#### Order lifecycle

```text
MATCHING
→ QUOTED
→ SELECTED
→ RESERVED
→ PAYMENT_AUTHORIZED
→ PHARMACIST_ACCEPTED
→ PAYMENT_CAPTURED
→ DETAILS_RELEASED
→ DISPENSED
→ READY_FOR_PICKUP
→ PICKED_UP
→ DELIVERED
→ CONFIRMED
→ CLOSED
```

Failure states:

```text
OUT_OF_STOCK
RESERVATION_EXPIRED
PHARMACIST_REJECTED
PAYMENT_FAILED
DELIVERY_FAILED
CANCELLED
REFUND_PENDING
REFUNDED
```

#### Provider-detail release

After successful payment:

- Release the selected pharmacy address, location, map coordinates, approved contact channel, branch information, and fulfilment instructions within the authorised order.
- Generate an audit event identifying the actor, order, pharmacy, payment, and fields released.
- Permit the patient, authorised guardian, or authorised delegated actor to access the details.
- Do not grant access to an unrelated sponsor, employer, HMO administrator, family-plan administrator, support agent, or another tenant unless a separate permission applies.
- Do not release details merely because the frontend displays a payment-success route.
- Do not include protected details in analytics, notification previews, browser logs, or error messages.

#### Delivery

Implement a delivery-provider abstraction:

- Delivery quote
- Pickup creation
- Courier assignment
- Pharmacy handover
- Tamper-status confirmation
- Temperature-handling instruction
- Courier tracking
- OTP or signature proof
- Failed delivery
- Return to pharmacy

Rideshare deep links may be offered for patient transport or self-pickup after payment. They should not replace the controlled medicine-delivery workflow.

#### Pharmacy portal

- Inventory management
- New-order queue
- Prescription validation
- Clarification requests
- Acceptance and rejection
- Dispensing confirmation
- Delivery handover
- Settlement report
- Refund and dispute visibility

#### Browser validation

Codex must test the pharmacy search and fulfilment loop in a real browser with explicit privacy assertions:

1.  Search before payment and confirm the pharmacy identity field contains only the name.
2.  Inspect page source, client state, network responses, cached data, and browser logs for forbidden provider details.
3.  Attempt direct API and route access to the protected details before payment.
4.  Complete a valid payment and confirm that the selected pharmacy details become available in the authorised order.
5.  Confirm that another patient or tenant cannot retrieve those details.
6.  Confirm that failed, cancelled, expired, or abandoned payment attempts do not release details.
7.  Test stock race conditions, reservation expiry, pharmacist rejection, refund, delivery failure, proof of delivery, and order closure.
8.  Test mobile map and deep-link behaviour only after details have been released.

### Exit gate

- Inventory is reserved before capture
- Two patients cannot purchase the last unit
- Failed reservations release stock
- Order and payment transitions stay consistent
- Delivery proof closes the loop
- A failed delivery enters a recoverable operational queue
- Before payment, the patient can see the pharmacy name but no other pharmacy identity or location details
- Protected pharmacy details are omitted server-side rather than merely hidden visually
- Successful payment releases the selected pharmacy details only within the authorised order
- Browser tests prove the privacy boundary before and after payment

This completes the first full consultation-to-medication vertical slice.

## Phase 13: Laboratory ordering and results

### Outcome

A doctor can order a test, the patient can pay and attend, and a verified result returns to the doctor and patient.

### Put in place

#### Laboratory catalogue

```text
LabTestDefinition
LabTestPanel
LabCapability
SpecimenRequirement
PreparationInstruction
ReferenceRange
TurnaroundCommitment
```

#### Laboratory order

```text
DiagnosticOrder
DiagnosticOrderItem
LabAppointment
Specimen
Accession
DiagnosticResult
ResultComponent
ResultAmendment
CriticalResultEvent
ResultAcknowledgement
```

#### Workflow

```text
ORDERED
→ MATCHING
→ LAB_SELECTED
→ SLOT_RESERVED
→ AUTHORIZED
→ PAYMENT_CAPTURED
→ DETAILS_RELEASED
→ SAMPLE_COLLECTED
→ PROCESSING
→ RESULT_VERIFIED
→ RESULT_RELEASED
→ DOCTOR_NOTIFIED
→ DOCTOR_REVIEWED
→ FOLLOW_UP_CREATED
→ CLOSED
```

#### Matching

Rank by:

- Exact test capability
- Distance
- Price
- Turnaround time
- Home collection
- Collection availability
- Coverage
- Facility status
- Accessibility
- Reliability

The matching service may use complete laboratory data internally. Before payment, the only laboratory identity detail exposed to the patient is the laboratory name. The patient may see the test quote, price, availability, estimated turnaround, preparation requirements that are not location-revealing, and payment terms, but must not receive the address, precise distance, coordinates, telephone number, email address, branch identifier, directions, photographs, external links, collection location, or visit instructions.

#### Provider-detail release

After successful payment:

- Release the selected laboratory’s address, location, map coordinates, approved contact channel, branch information, appointment or collection instructions, and access directions within the authorised diagnostic order.
- Record an auditable detail-release event tied to the payment and order.
- Restrict access to the patient and authorised actors attached to the order.
- Keep protected details out of general notifications, analytics, browser logs, and error messages.
- Require a new authorization decision if a laboratory is changed after payment.

#### Results

Support:

- Structured values
- Units
- Reference ranges
- Flags
- Signed PDF
- Corrected result
- Amended result
- Result version history
- Clinician interpretation
- Patient-friendly explanation field

#### Critical results

Implement:

```text
Critical result detected
→ responsible clinician notified
→ acknowledgment required
→ patient-contact attempt recorded
→ escalation if unacknowledged
→ resolution documented
```

#### Browser validation

Codex must test laboratory matching and booking with explicit privacy assertions:

1.  Confirm that the pre-payment laboratory identity response contains only the name.
2.  Inspect the DOM, page source, network payloads, client cache, browser storage, and logs for protected details.
3.  Attempt direct navigation and API access before payment.
4.  Complete successful payment and confirm that the selected laboratory details and visit instructions unlock only within the authorised order.
5.  Confirm that failed, cancelled, expired, or abandoned payment attempts do not unlock details.
6.  Test laboratory substitution after payment, slot expiry, home collection, sample collection, result upload, corrected results, critical-result alerts, clinician acknowledgment, and follow-up.
7.  Confirm that another patient, sponsor without permission, employer, HMO administrator, or tenant cannot retrieve the unlocked details.

### Exit gate

- A result cannot be uploaded against the wrong order without detection
- Signed results are immutable
- Corrections create new versions
- Critical results require acknowledgment
- The responsible clinician is alerted
- A result does not automatically generate medication without clinician review
- Before payment, the patient can see the laboratory name but no other laboratory identity or location details
- Protected laboratory details are omitted server-side rather than merely hidden visually
- Successful payment releases details only within the authorised diagnostic order
- Browser tests prove the privacy boundary before and after payment

## Phase 14: Hospital, specialist, urgent, and emergency referrals

### Outcome

Patients who cannot safely remain in telemedicine receive coordinated in-person care.

### Put in place

#### Referral model

```text
Referral
ReferralReason
ReferralPriority
ReferralDestination
ReferralPacket
FacilityAcceptance
ReferralAppointment
TransferEvent
ReferralOutcome
```

#### Referral levels

- Routine
- Priority
- Urgent
- Emergency

#### Matching

Match facilities by:

- Required specialty
- Emergency capability
- Diagnostic capability
- Location
- Operating hours
- Accessibility
- Coverage network
- Referral acceptance
- Patient choice

#### Non-emergency flow

```text
REFERRAL_CREATED
→ FACILITIES_PRESENTED
→ PATIENT_SELECTED
→ FACILITY_ACCEPTED
→ PRE_REGISTERED
→ APPOINTMENT_CONFIRMED
→ PATIENT_ATTENDED
→ OUTCOME_RETURNED
→ CLOSED
```

#### Emergency flow

Emergency handling should:

- Interrupt the normal consultation
- Display persistent emergency instructions
- Use the patient’s current location
- Show suitable nearby facilities
- Generate a concise transfer summary
- Notify emergency contacts where authorized
- Attempt receiving-facility contact where supported
- Avoid payment blocking
- Record every escalation action

#### Browser validation

Codex must test routine, urgent, and emergency referral paths, including location denial, poor connectivity, facility rejection, timeout, pre-registration failure, and emergency contact notification. Emergency browser tests must prove that no payment page or provider-detail obscurity rule delays access to emergency facility information.

### Exit gate

- Routine and emergency referrals use different workflows
- Emergency referral does not wait for payment
- Shared referral data is limited to necessary information
- A receiving facility can acknowledge the referral
- Patient attendance and outcome can close the referral
- Unresolved urgent referrals enter an operations queue
- Browser tests prove emergency information remains immediately available

## Phase 15: Companies, HMOs, benefits, SSO, and claims

### Outcome

Organizations can fund and administer healthcare without gaining inappropriate clinical access.

### Put in place

#### Coverage model

```text
OrganizationContract
BenefitPackage
Coverage
Beneficiary
DependentCoverage
EligibilityPeriod
BenefitRule
ServiceLimit
ProviderNetwork
Copayment
PriorAuthorization
Claim
ClaimLine
ClaimDecision
Appeal
Remittance
```

#### Employer functionality

- Employee roster
- Dependent roster
- Joiner and leaver processing
- Benefit-package assignment
- Eligibility lookup
- Spending summaries
- Aggregate utilization
- Funding account
- Invoices
- De-identified reporting
- Employee support cases

Employers must not receive diagnoses, prescriptions, consultation notes, or individual laboratory results.

#### HMO functionality

- Member import
- Member-number matching
- Eligibility verification
- Benefit limits
- Exclusions
- Copay
- Provider networks
- Prior authorization
- Claims
- Claim attachments
- Adjudication
- Denials
- Appeals
- Remittance
- Reconciliation

#### Enterprise identity

Implement:

- OIDC
- SAML
- Just-in-time provisioning
- SCIM
- CSV and API roster synchronization
- Employee-number mapping
- HMO member-number mapping
- Organization-specific MFA policies

An employee’s personal patient identity must survive employment termination. Only company coverage and company SSO access should end.

#### B2B API

Provide:

- Eligibility endpoint
- Member synchronization
- Coverage lookup
- Prior-authorization request
- Claim submission
- Claim-status webhook
- Remittance export

#### Browser validation

Codex must test SSO entry, roster imports, eligibility, coverage expiry, copays, prior authorization, claim states, employer dashboards, HMO dashboards, de-identified reports, and offboarding. It must verify through browser and API inspection that employers and HMOs do not receive protected clinical information or pre-payment pharmacy and laboratory details outside the permitted patient order workflow.

### Exit gate

- Company SSO users retain their personal patient record after leaving
- Employer administrators cannot view clinical records
- HMO benefits are evaluated deterministically
- Claims can be submitted and reconciled
- Coverage expiry takes effect immediately
- Roster imports are idempotent and generate exception reports
- Browser tests verify employer and HMO privacy boundaries

This is the first complete B2C and B2B commercial milestone.

## Phase 16: Home and continuing care

### Outcome

NelyoHealth can coordinate recurring in-home care for elderly, chronically ill, disabled, or recovering patients.

### Put in place

#### Home-care model

```text
CareAgency
CareWorker
CareRecipient
CarePlan
CarePlanTask
RecurringVisit
HomeCareVisit
VisitTask
MedicationAdministration
VisitObservation
VisitIncident
ShiftHandover
MissedVisit
```

#### Care planning

Support:

- Clinical goals
- Visit frequency
- Assigned staff type
- Required competencies
- Medication tasks
- Vitals
- Wound care
- Mobility assistance
- Hygiene and feeding
- Escalation criteria
- Family-update policy

#### Visit workflow

```text
SCHEDULED
→ ASSIGNED
→ WORKER_EN_ROUTE
→ CHECKED_IN
→ IN_PROGRESS
→ COMPLETED
→ SUPERVISOR_REVIEWED
→ CLOSED
```

Failure states:

```text
UNASSIGNED
WORKER_CANCELLED
PATIENT_UNAVAILABLE
MISSED
INCIDENT_REPORTED
ESCALATED
```

#### Safety controls

- Worker identity confirmation
- Credential revalidation
- Service-zone verification
- Check-in and check-out
- Geolocation with documented fallback
- Missed-visit alerts
- Incident reporting
- Supervisor escalation
- Patient safety check
- Worker safety check

#### Family and sponsor updates

Updates should follow consent and may include:

- Visit completed
- Next visit
- Care-plan task completed
- Nonclinical note
- Incident alert
- Payment status

Clinical notes require separate permission.

#### Browser validation

Codex must test care-plan creation, recurring visits, assignment, check-in and fallback, missed visits, worker cancellation, incident reporting, supervisor review, medication administration, family notifications, revoked consent, and cross-role access. Mobile browser testing is mandatory for care-worker workflows.

### Exit gate

- Recurring visits can be scheduled and reassigned
- Missed visits trigger escalation
- Medication administration is auditable
- Incidents cannot be silently closed
- Family updates respect patient consent
- Care workers see only the information required for their assigned visit
- Browser tests cover mobile care-worker and family views

## Phase 17: Administration, operations, support, and analytics

### Outcome

Every operational exception can be handled through an audited interface rather than direct database access.

### Put in place

#### Admin areas

- User management
- Organization management
- Provider credentialing
- Facility verification
- Guardian verification
- Consent review
- Appointment operations
- Prescription exception queue
- Pharmacy-order operations
- Laboratory-result exceptions
- Referral follow-up
- Home-care incidents
- Payment and refund operations
- Claim operations
- Complaint management
- Fraud review
- Feature flags
- Content management
- Audit viewer

#### Support access

Do not implement invisible user impersonation.

Use:

- Support-session request
- Purpose selection
- Limited-duration access
- Patient notification where appropriate
- Masked sensitive data
- Complete audit history
- Restricted actions

#### Fraud and abuse controls

Start with deterministic rules for:

- Duplicate prescriptions
- Reused prescriptions
- Suspicious account creation
- Impossible geography
- False inventory
- Duplicate claims
- Unusual refunds
- Phantom home visits
- Repeated failed deliveries
- Provider self-referral patterns

Flag for review rather than automatically denying clinically necessary care.

#### Analytics

Separate:

- Product analytics
- Operational analytics
- Financial analytics
- Clinical-quality analytics
- Security analytics

Exclude protected health information from general analytics systems.

#### Browser validation

Codex must test every operational queue, filtering, assignment, escalation, support-session expiry, audit visibility, masked fields, and privilege boundary. It must confirm that support and administrator browser sessions cannot inspect protected pharmacy or laboratory details before payment unless the specific operational permission and order context authorize it.

### Exit gate

- Every failure state has an operations queue
- Administrators do not need production database access
- Every admin action is audited
- Reports respect organization and patient boundaries
- Fraud flags have review and appeal workflows
- Operational dashboards expose ageing and unresolved cases
- Browser tests cover administrative access boundaries and masked data

## Phase 18: External APIs and interoperability

### Outcome

HMOs, employers, providers, and logistics partners can integrate without gaining direct internal-system access.

### Put in place

#### Integration platform

- API clients
- Client credentials
- Scoped permissions
- Rate limits
- IP controls where needed
- Signed webhooks
- Idempotency
- Replay protection
- Partner-specific configuration
- Integration health dashboard
- Dead-letter and replay tooling

#### External interfaces

Provide versioned APIs for:

- Member eligibility
- Appointment creation
- Provider availability
- Prescription status
- Pharmacy fulfilment
- Laboratory orders and results
- Referrals
- Claims
- Remittances
- Delivery tracking

Pre-payment partner APIs that feed patient-facing pharmacy or laboratory discovery must not expose protected provider details to the patient client. Internal partner connectors may hold those details, but the NelyoHealth boundary must filter them according to payment and authorization state.

#### Healthcare interoperability

Map the internal model toward resources such as:

- Patient
- Practitioner
- Organization
- Encounter
- Observation
- Medication request
- Service request
- Diagnostic report
- Coverage
- Claim
- Consent
- Audit event

Do not attempt to implement the entire healthcare interoperability standard before a real partner needs it.

#### Partner sandbox

Create:

- Test credentials
- Synthetic patients
- Sample payloads
- Webhook simulator
- API reference
- Integration guides
- Error catalogue
- Certification test suite

#### Browser and contract validation

Codex must test partner sandbox journeys, webhook replay, version negotiation, expired credentials, wrong tenant, partial outages, and API-to-browser field filtering. Contract tests must prove that no partner payload accidentally bypasses the pre-payment detail-release policy.

### Exit gate

- Partner calls cannot access another tenant
- Webhooks are signed and replay-safe
- Failed integrations can be replayed
- Partner payload mappings are versioned
- Breaking changes require a new API version
- No partner receives direct database access
- Contract and browser tests prove protected provider fields remain filtered until payment

## Phase 19: Security, privacy, clinical safety, and production hardening

### Outcome

A production candidate that has been tested against failure, abuse, concurrency, poor connectivity, and operational mistakes.

### Put in place

#### Security

- Threat model for every domain
- Static analysis
- Dependency scanning
- Secret scanning
- Dynamic testing
- Penetration testing
- Tenant-isolation testing
- Authorization fuzzing
- Upload malware scanning
- Rate limiting
- Bot protection
- Web application firewall
- Session revocation
- Key rotation
- Privileged-access review

#### Privacy

- Data inventory
- Retention schedules
- Data export
- Data correction
- Erasure workflow where applicable
- Consent withdrawal
- Processor inventory
- Cross-border data-flow review
- Privacy notice versioning
- Breach-response workflow
- Pharmacy and laboratory pre-payment data-leak review

#### Reliability

- Load tests
- Soak tests
- Queue-backlog tests
- Payment-webhook replay tests
- Database-failover tests
- Video-provider outage tests
- SMS-provider outage tests
- Map-provider outage tests
- Payment-provider outage tests
- Backup restoration
- Disaster-recovery rehearsal

#### Clinical safety

Perform failure-mode analysis for:

- Missed emergency
- Wrong patient
- Wrong medication
- Wrong dosage
- Expired credential
- Lost laboratory result
- Unacknowledged critical result
- Failed referral
- Failed delivery
- Guardian dispute
- Sponsor privacy breach
- Home-care missed visit

#### Browser security and privacy testing

Perform browser-based abuse tests for:

- Insecure direct-object references
- Cross-tenant identifier manipulation
- Stale authenticated tabs after revocation
- Browser back and cache exposure
- Sensitive data in local storage, session storage, IndexedDB, service-worker caches, console logs, source maps, analytics, error reports, URLs, referrers, and notifications
- Pre-payment pharmacy and laboratory detail leakage in API payloads or hydrated page data
- Forged payment-success routes
- Webhook delay and replay
- Cross-site scripting and unsafe file previews
- Clickjacking and frame restrictions
- Session fixation and logout completeness
- Mobile viewport and low-bandwidth failure states

#### Accessibility

Complete:

- Automated audits
- Manual keyboard review
- Screen-reader review
- Low-vision review
- Mobile review
- Video-caption workflow review
- Accessible-support process

#### Runbooks

Create runbooks for:

- Security incident
- Clinical incident
- Data breach
- Payment discrepancy
- Provider suspension
- Video outage
- Database outage
- Queue failure
- Failed deployment
- Pharmacy outage
- Critical laboratory result
- Emergency referral failure
- Pre-payment provider-detail exposure incident

### Exit gate

- Penetration-test critical findings are resolved
- Backup restoration has been demonstrated
- Production rollback is tested
- Tenant-isolation test suite passes
- Clinical safety hazards have mitigations
- Incident owners and escalation contacts are defined
- Operational staff complete rehearsal exercises
- No critical workflow depends on manually editing the database
- Browser privacy tests prove protected pharmacy and laboratory details cannot be recovered before payment

## Phase 20: Controlled pilot and production launch

### Outcome

A monitored production deployment serving a deliberately limited cohort.

### Put in place

#### Pilot boundary

Limit:

- Geographic area
- Number of doctors
- Number of pharmacies
- Number of laboratories
- Supported consultation categories
- Supported medication categories
- Supported laboratory tests
- Number of company or HMO partners
- Number of patients

#### Production preparation

- Verify every provider again
- Load provider schedules
- Confirm inventory update processes
- Confirm pharmacy delivery procedures
- Confirm laboratory-result procedures
- Train operations staff
- Train clinical supervisors
- Train support staff
- Verify financial reconciliation
- Run emergency simulations
- Run critical-result simulations
- Run pre-payment pharmacy and laboratory privacy simulations
- Publish patient support channels
- Configure on-call rotations

#### Rollout

Use feature flags and cohorts:

```text
Internal staff
→ invited patients
→ selected family and diaspora users
→ selected employer cohort
→ selected HMO cohort
→ controlled public availability
```

#### Pilot metrics

Track:

- Registration completion
- Identity-verification completion
- Appointment conversion
- Payment success
- Consultation connection success
- Video-to-audio fallback
- No-show rate
- Prescription fulfilment
- Pharmacy reservation expiry
- Delivery completion
- Laboratory turnaround
- Critical-result acknowledgment
- Referral completion
- Refund completion
- Support volume
- Security incidents
- Clinical incidents
- Accessibility complaints
- Pre-payment provider-detail exposure incidents
- Browser-test pass rate on release candidates

#### Browser release gate

Before every pilot release, Codex and the delivery team must run the full Playwright suite against the release candidate and then inspect the highest-risk journeys interactively in a real browser. The smoke set must include patient registration, paid consultation, pharmacy discovery before and after payment, laboratory discovery before and after payment, emergency referral, sponsor payment without clinical access, and organization privacy boundaries.

### Exit gate

The pilot only expands when:

- Clinical incidents are reviewed
- Payment reconciliation is reliable
- Pharmacy inventory accuracy is acceptable
- Laboratory results reliably return to clinicians
- Emergency referrals work operationally
- Support can handle exception volume
- No unresolved critical security issue exists
- Providers and patients can complete the core flows without engineering intervention
- Browser release gates pass with no protected provider-detail leakage

## Phase 21: Scale and post-pilot expansion

### Outcome

Controlled expansion without destabilizing the proven core.

### Put in place progressively

- Native patient mobile application
- Native provider mobile application where justified
- Additional Nigerian states
- More payment providers
- More pharmacies and laboratories
- Additional HMO integrations
- Additional employer integrations
- More home-care agencies
- Language localization
- Advanced provider-quality reporting
- Data warehouse using de-identified data
- Advanced fraud detection
- Partner self-service onboarding
- Wider hospital integration
- Patient portability exports
- Multi-region disaster recovery
- Expanded cross-browser coverage where user analytics justify it
- Device-lab testing for critical mobile journeys

Only extract a domain into a microservice after measurable pressure appears, such as independent scaling requirements, deployment contention, regulatory isolation, or repeated team ownership conflicts.

Do not split services merely because the platform has become large.

## 3. Definition of done for every Codex task

A task is not complete merely because the code compiles.

Every Codex issue should satisfy the applicable items below:

```text
[ ] Acceptance criteria pass
[ ] Unit tests added or updated
[ ] Database integration tests pass
[ ] Authorization tests pass
[ ] Tenant-isolation tests pass
[ ] Audit events verified
[ ] Idempotency and retry behavior tested
[ ] Concurrency behavior tested where relevant
[ ] API schema updated
[ ] Generated client updated
[ ] Loading, empty, error, unauthorized, offline, and retry UI states exist
[ ] Accessibility checks pass
[ ] Logs contain no protected health information
[ ] Metrics and traces are added
[ ] Database migration is documented
[ ] Rollback path exists
[ ] ADR added when architecture changed
[ ] Runbook updated when operations changed
[ ] Feature flag added for incomplete or risky behavior
[ ] Codex opened the changed route in a real browser
[ ] Browser happy path was exercised
[ ] At least one relevant browser failure path was exercised
[ ] Mobile, tablet, and desktop layouts were checked where applicable
[ ] Browser console and failed network requests were inspected
[ ] Keyboard navigation and focus order were checked
[ ] Playwright deterministic browser tests were added or updated
[ ] Failure traces, screenshots, or videos are retained by CI when tests fail
[ ] Pharmacy/laboratory pre-payment field filtering was tested where relevant
[ ] Lint passes
[ ] Typecheck passes
[ ] Unit tests pass
[ ] Integration tests pass
[ ] End-to-end tests pass
[ ] Browser tests pass
[ ] Visual tests pass where applicable
[ ] Production build passes
[ ] Codex reviews its own diff
[ ] Codex reports exactly what it verified in the browser
```

## 4. Codex task template

Use this for each issue:

```markdown
# Goal

Implement verified guardian relationships for minor patients.

# Context

Read:

- AGENTS.md
- docs/SPEC.md
- docs/product/minors-and-guardians.md
- docs/architecture/access-control.md
- docs/testing/browser-testing.md
- docs/exec-plans/P06-patient-relationships.md

# Scope

- Add GuardianRelationship persistence model
- Add submit, approve, reject, revoke, and expire commands
- Add guardian invitation endpoint
- Add admin verification queue
- Add policy checks for scheduling and record viewing
- Add audit events
- Add patient and guardian UI
- Add Playwright browser scenarios for invitation, approval, restricted access, and revocation

# Non-goals

- Do not implement court-order dispute resolution
- Do not implement automated document verification
- Do not implement age-of-majority transfer in this task

# Invariants

- Guardian authority must be verified before access is granted
- Payment authority does not imply record-viewing authority
- Revocation takes effect immediately
- All access and state changes must be audited
- Protected data must not be present in unauthorized browser responses or client state

# Browser validation

- Start or reuse the local application and synthetic test services
- Use $playwright-interactive to inspect the patient, guardian, and admin flows
- Test mobile and desktop layouts
- Inspect console errors and failed network requests
- Attempt direct unauthorized route and identifier access
- Verify access disappears immediately after revocation
- Add or update deterministic Playwright tests

# Done when

- A guardian can be invited
- Evidence can be uploaded
- An administrator can approve or reject the relationship
- Approved guardians receive only configured permissions
- Revoked guardians lose access immediately
- Cross-patient and cross-tenant access tests fail
- Browser tests cover the complete relationship lifecycle
- API documentation is updated
- All repository validation commands pass

# Validation

Run:

pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm test:browser
pnpm test:a11y
pnpm build
```

For pharmacy or laboratory tasks, add this mandatory invariant and browser check:

```text
Before payment, the provider identity response exposes only displayName.
No address, precise distance, coordinate, contact, branch, direction, image,
external link, collection instruction, pickup instruction, or fulfilment-origin
field may appear in the API response, DOM, client state, cache, storage, log,
or analytics event. Successful backend-verified payment releases those fields
only for the authorised order and actor.
```

## 5. Release milestones

| **Milestone**          | **Completed phases** | **Product state**                                                              |
|------------------------|----------------------|--------------------------------------------------------------------------------|
| Architecture baseline  | 0-5                  | Deployable shells, identity, security, design system, and browser-test harness |
| Patient foundation     | 6-9                  | Patients and providers can onboard, pay, and book                              |
| Consultation MVP       | 10                   | Complete B2C teleconsultation                                                  |
| Medication closed loop | 11-12                | Consultation through medication delivery                                       |
| Coordinated-care beta  | 13-14                | Laboratory and hospital referral loops                                         |
| Commercial beta        | 15                   | HMO and employer capabilities                                                  |
| Extended-care beta     | 16                   | Home and continuing care                                                       |
| Production candidate   | 17-19                | Operations, integrations, browser validation, and hardening                    |
| Controlled launch      | 20                   | Limited real-world production                                                  |
| Scale                  | 21                   | Geographic and capability expansion                                            |

The most important discipline is to make **Phase 10 the first complete patient-facing vertical slice**, then extend that same encounter into pharmacy, laboratory, referral, HMO, and home-care workflows. Do not build those as separate mini-platforms. They are layers around one patient, one clinical record, and one auditable care journey.

The second discipline is equally strict: every frontend task must be proven in a real browser. Codex should not stop at generated code, type safety, or passing unit tests. It must open the application, perform the journey, inspect what the browser actually received, and verify that the experience and privacy boundaries behave as designed.

## References for Codex browser integration

- OpenAI, *Model Context Protocol - Codex*: https://developers.openai.com/codex/mcp
- OpenAI, *Agent Skills - Codex*: https://developers.openai.com/codex/skills
- OpenAI, *Build responsive front-end designs - Codex use cases*: https://developers.openai.com/codex/use-cases/frontend-designs
- OpenAI, *Codex Quickstart*: https://developers.openai.com/codex/quickstart
