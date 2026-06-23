# NelyoHealth Phase 0: Codex Prompt Pack

**Use:** Paste one prompt at a time into Codex in the IDE.  
**Mode:** Use Plan mode for the first prompt and for any prompt that touches several documents.  
**Rule:** Review the diff after each prompt before moving to the next.

## Before the first prompt

Place these files in the repository root or a clearly referenced planning folder:

```text
NelyoHealth_Build_Implementation_Map_for_Codex.md
NelyoHealth_Phase_0_Complete_Breakdown.md
```

Create a Git checkpoint before Codex edits the repository.

The browser integration is not needed to write most Phase 0 documents, but the browser-test strategy must be defined in Phase 0 and implemented during Phase 1. Codex in the IDE should later receive Playwright access through project-scoped MCP or the supported Playwright skill/CLI, plus a normal Playwright Test suite in the repository.

# Prompt P00-00: Phase 0 preflight and execution plan

```text
You are beginning Phase 0 of NelyoHealth. Work in Plan mode first. Do not write application code, install application dependencies, or scaffold runtime services in this task.

Read all available project instructions and planning sources, especially:
- AGENTS.md, if present
- NelyoHealth_Build_Implementation_Map_for_Codex.md
- NelyoHealth_Phase_0_Complete_Breakdown.md
- README.md, if present
- docs/STATUS.md, if present

Goal:
Create the governance and execution skeleton for Phase 0 so later prompts can work against stable documents.

Locked requirements:
1. One person has one longitudinal patient identity even when covered by multiple plans.
2. Paying for care does not automatically grant clinical-record access.
3. Before successful payment, the only pharmacy or laboratory identity detail available to a patient is the provider name. Address, branch, coordinates, distance, contacts, directions, map pins, photos, external links, instructions, and derivable metadata must not reach the client.
4. Emergency escalation must not be blocked by payment.
5. Signed clinical records use amendments, not silent overwrites.
6. Codex must later have real-browser access from the IDE through Playwright-based tooling, and user-facing work must have both interactive browser validation and deterministic automated browser tests.

Create or update:
- docs/STATUS.md
- docs/exec-plans/P00-product-clinical-regulatory-foundation.md
- docs/governance/document-register.md
- docs/governance/decision-register.md
- docs/governance/open-questions.md
- docs/governance/assumptions-register.md
- docs/governance/change-log.md
- docs/governance/traceability-conventions.md

Requirements:
- Preserve existing content that is compatible with the supplied specifications.
- Record locked requirements as approved decisions.
- Record proposed pilot assumptions separately as PROPOSED, not approved.
- Give each open question an owner role and target phase.
- Add a work breakdown matching P00-01 through P00-20.
- Define document status and review-state conventions.
- Add a checklist to the execution plan.
- Update docs/STATUS.md with the current state and recommended next issue.

Validation:
- Check for contradictions between the two supplied planning documents.
- Check all created relative links.
- Search the changed files for vague placeholders that lack an owner.
- Review your diff before finishing.

Return:
1. Files changed.
2. Approved decisions recorded.
3. Proposed assumptions recorded.
4. Conflicts or missing information found.
5. Validation performed.
6. The next recommended prompt.
```

# Prompt P00-01: Product charter and product principles

```text
Implement issue P00-PRD-001 for NelyoHealth. Documentation only.

Read:
- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md
- docs/governance/assumptions-register.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md
- NelyoHealth_Phase_0_Complete_Breakdown.md

Goal:
Draft a coherent product charter that explains NelyoHealth as a patient-centered care-orchestration platform for Nigeria, with B2C and B2B funding and administration layers.

Create or update:
- docs/product/product-charter.md
- docs/product/value-propositions.md
- docs/product/business-model-hypotheses.md
- docs/product/product-principles.md

Cover:
- Problem statements for patients, families, diaspora sponsors, employers, HMOs, and providers.
- Customer, user, beneficiary, payer, provider, and administrator distinctions.
- Core closed-loop care proposition.
- NelyoHealth's proposed role and roles it must not claim without review.
- Revenue hypotheses, clearly labeled as hypotheses.
- Pilot success and failure conditions.
- Product principles derived from the locked decisions.

Constraints:
- Do not claim that NelyoHealth is an insurer, licensed medical provider, pharmacy, laboratory, or emergency service unless an approved decision says so.
- Do not weaken the provider-detail disclosure rule.
- Do not grant clinical access to payers by implication.
- Mark statements requiring legal or clinical review.

Done when:
- The four documents are mutually consistent.
- Every target customer has a clear value proposition.
- The central patient-level model is explicit.
- docs/STATUS.md and the document register are updated.
- Your final summary lists decisions, hypotheses, and unresolved questions separately.
```

# Prompt P00-02: MVP and pilot boundary

```text
Implement issue P00-PRD-002 for NelyoHealth. Documentation only.

Read the Phase 0 plan, product charter, decision register, assumptions register, and master implementation map.

Goal:
Define a controlled first-pilot scope and explicit non-goals.

Create or update:
- docs/product/mvp-scope.md
- docs/product/pilot-operating-boundary.md
- docs/product/service-catalogue-boundary.md
- docs/product/non-goals.md
- docs/product/expansion-gates.md

Use these scope labels:
- PILOT
- POST-PILOT
- DESIGN-NOW-IMPLEMENT-LATER
- OUT-OF-SCOPE
- BLOCKED-PENDING-REVIEW

At minimum decide or mark for approval:
- launch geography
- patient ages
- consultation types
- clinical inclusion and exclusion
- doctor specialties
- pharmacy categories
- laboratory test catalogue
- payment methods
- family and diaspora features
- employer and HMO features
- guardian/minor activation
- home-care scope
- supported clients, devices, and browsers
- native mobile timing

Use the proposed defaults from the Phase 0 specification when no approved decision exists, but label them PROPOSED and add them to the decision register.

Done when:
- Every major capability in the master map has a scope label.
- The pilot can be understood without reading future phases.
- Expansion is controlled by measurable gates.
- Non-goals prevent Codex from overbuilding.
- docs/STATUS.md is updated.
```

# Prompt P00-03: Actors, roles, relationships, and tenancy

```text
Implement issue P00-IAM-001. Documentation only.

Goal:
Define NelyoHealth's actors, person/account distinction, relationships, organization context, and access intent.

Create or update:
- docs/product/personas.md
- docs/product/actor-catalogue.md
- docs/product/relationship-model.md
- docs/architecture/tenancy-concept.md
- docs/security/access-intent-matrix.md

Requirements:
- Cover patients, minors, guardians, clinical proxies, caregivers, family administrators, diaspora sponsors, doctors, pharmacists, laboratory scientists, nurses, home-care workers, hospitals, HMOs, employers, provider organizations, support, finance, compliance, clinical supervisors, security administrators, auditors, and platform administrators.
- Distinguish role, relationship, organization membership, and coverage.
- Distinguish Person, UserAccount, Patient, Member, and Beneficiary.
- Explain accountless patient records.
- Explain multi-organization membership and context switching.
- Explain staff offboarding and patient continuity.
- State that administrator status does not grant invisible unrestricted clinical access.
- State that a payer or sponsor does not automatically receive clinical access.

Add a preliminary access-intent matrix with actions such as:
- schedule
- join consultation
- pay
- approve spend
- view receipt
- view clinical summary
- view full clinical record
- view prescription
- view laboratory result
- receive medicine
- manage organization
- review credentials
- use break-glass access

Do not design database tables or implementation-level permission code yet.

Validate for contradictory actor names and accidental privilege escalation. Update docs/STATUS.md.
```

# Prompt P00-04: Funding, family, diaspora, employer, and HMO model

```text
Implement issue P00-COV-001. Documentation only.

Goal:
Define how self-pay, family, diaspora, employer, and HMO arrangements fund the same patient-level care workflows.

Create or update:
- docs/product/funding-and-coverage-model.md
- docs/product/family-plan-rules.md
- docs/product/diaspora-plan-rules.md
- docs/product/employer-benefit-rules.md
- docs/product/hmo-coverage-rules.md
- docs/security/payer-visibility-matrix.md

Cover:
- membership and beneficiary lifecycle
- effective and expiry dates
- spending limits
- approval modes
- service restrictions
- copay and partial coverage
- overlapping funding sources
- funding-source choice
- split payments
- refunds
- coverage termination
- employee offboarding
- sponsor revocation
- audit and notifications

Locked constraint:
Funding authority and clinical-record access are separate. Do not grant diagnosis, notes, prescriptions, or results to a payer without a separate authorization basis.

For each arrangement, include examples and failure cases. Update decisions, assumptions, open questions, and docs/STATUS.md.
```

# Prompt P00-05: End-to-end journeys and service blueprints

```text
Implement issue P00-JRN-001. Documentation only.

Goal:
Create end-to-end journeys and service blueprints that include frontend steps, backend decisions, human operations, failure handling, disclosures, audit, and closure.

Create or update:
- docs/product/user-journeys.md
- docs/product/service-blueprints.md
- docs/product/exception-journeys.md
- docs/testing/journey-test-catalogue.md

Include at least the 20 journeys listed in NelyoHealth_Phase_0_Complete_Breakdown.md.

For each journey include:
- trigger and preconditions
- actors
- main flow
- alternative and failure flows
- payment point
- authorization and consent checks
- data created and data disclosed
- human operational steps
- notifications
- audit events
- completion and reopening conditions
- later browser-test scenarios

Provider discovery rule:
Before payment, a pharmacy or laboratory may be identified to the patient by name only. Do not include address, location, contact, map pin, directions, or derivable location data in a pre-payment screen, API response, client state, or test fixture. Post-payment disclosure applies only to the selected authorized order.

Use Mermaid sequence or flow diagrams where helpful, with readable text descriptions. Update docs/STATUS.md.
```

# Prompt P00-06: Glossary, data classification, and domain boundaries

```text
Implement issues P00-DOM-001 and P00-ARC-001 together because the glossary controls the conceptual model. Documentation only.

Goal:
Create canonical terminology, data classifications, bounded contexts, sources of truth, and dependency rules.

Create or update:
- docs/glossary.md
- docs/data/data-classification.md
- docs/data/data-handling-matrix.md
- docs/architecture/domain-boundaries.md
- docs/architecture/context-map.md
- docs/architecture/conceptual-domain-model.md
- docs/architecture/source-of-truth-matrix.md
- docs/architecture/event-catalogue-draft.md

Requirements:
- Define all terms listed in the Phase 0 specification.
- Select one canonical term when synonyms exist.
- Define handling for protected clinical, provider identity/location, payment, credential, authentication, and analytics data.
- Identify one source of truth for every major entity.
- Keep the architecture compatible with a modular monolith.
- Separate domain types from vendor-specific types.
- Model pre-payment marketplace quote views separately from authorized post-payment fulfilment views.
- Identify transaction boundaries and acceptable eventual consistency.

Do not create code or database migrations.

Validate:
- No circular definitions.
- Person, account, patient, member, beneficiary, and dependent are distinct.
- No domain context can bypass payment/access policy to expose protected provider details.
- Update docs/STATUS.md.
```

# Prompt P00-07: Workflow state machines

```text
Implement issue P00-WFL-001. Documentation only.

Goal:
Specify the legal state machines for every long-running NelyoHealth workflow.

Create:
- docs/workflows/state-machine-index.md
- docs/workflows/cross-workflow-invariants.md
- one clearly named Markdown file per required state machine

Required state machines are listed in NelyoHealth_Phase_0_Complete_Breakdown.md.

For every state machine define:
- states
- initial and terminal states
- allowed transitions
- actor or system permitted to transition
- guards
- side effects
- events
- notifications
- audit events
- timeouts
- retries
- idempotency
- reversal or compensation
- operations intervention
- illegal transitions

Cross-workflow invariants must include:
- emergency escalation is not blocked by payment
- stock cannot be sold twice
- payment and order states cannot silently diverge
- signed clinical records are amended, not overwritten
- provider details are not released before the defined successful-payment state
- failed, cancelled, expired, or reversed payments do not leave provider details unlocked without an explicit reviewed rule
- critical results require acknowledgment and escalation

Use Mermaid state diagrams plus transition tables. Update docs/STATUS.md.
```

# Prompt P00-08: Provider-detail disclosure contract and threat model

```text
Implement issue P00-PRV-001. This is a high-priority locked requirement. Documentation only.

Read all existing product, workflow, finance, privacy, and architecture documents before editing.

Goal:
Turn the pharmacy and laboratory pre-payment obscurity rule into an exact data contract, access policy, threat model, and future test matrix.

Create or update:
- docs/product/provider-discovery-privacy.md
- docs/contracts/provider-disclosure-contract.md
- docs/security/provider-disclosure-threat-model.md
- docs/testing/provider-disclosure-test-matrix.md
- docs/adr/ADR-0001-provider-detail-release-after-payment.md

Locked rule:
Before successful payment, the only provider identity field exposed to the patient is providerDisplayName. Protected fields must not be sent to the browser and must not merely be hidden visually.

Define:
1. Pre-payment MarketplaceQuoteView.
2. Post-payment AuthorizedFulfilmentLocationView.
3. The successful-payment or approved-coverage events that unlock details.
4. The actor and order relationship required to retrieve details.
5. Behaviour after failure, expiry, cancellation, refund, reversal, chargeback, provider replacement, or logout.
6. Map behaviour before and after payment.
7. Cache, logging, analytics, error, support-tool, and session-replay rules.
8. API enumeration and direct-object-reference threats.
9. Browser and API negative tests.
10. Audit events.

Pre-payment protected fields include address, branch, coordinates, approximate or precise distance, contacts, directions, map pins, photos, links, instructions, and metadata from which these can be derived.

Do not return a full provider object and redact it on the frontend. Specify projection and policy enforcement at the server boundary.

Add a legal-review item asking counsel to confirm whether any minimum public/provider disclosures must coexist with this transactional rule. Do not change the locked product requirement yourself.

Update the decision register, open questions, traceability, and docs/STATUS.md.
```

# Prompt P00-09: Clinical scope, safety, emergency, referral, and critical results

```text
Implement issues P00-CLN-001 and P00-CLN-002. Documentation only. Do not invent clinical thresholds.

Goal:
Define NelyoHealth's clinical pilot scope, telemedicine suitability, safety model, emergency escalation, referrals, and critical-result loops.

Create or update all clinical and draft runbook files listed under P00-11 and P00-12 in the Phase 0 specification.

Requirements:
- Mark all clinical rules as DRAFT-PENDING-CLINICAL-APPROVAL unless already approved.
- Define supported and excluded consultation categories.
- Define intake, identity, location, consent, remote-exam limits, video/audio fallback, safety-netting, disconnection, follow-up, and documentation.
- Define emergency and urgent flows separately from normal booking.
- Define transfer summaries and receiving-facility handoff.
- Define routine referral acceptance, attendance, outcome, and closure.
- Define critical-result notification, acknowledgment, failed contact, escalation, and closure.
- Store thresholds as clinically managed configuration requirements, not hard-coded values guessed by Codex.
- State that payment cannot block emergency escalation.

Validate the documents for closed-loop ownership and update docs/STATUS.md.
```

# Prompt P00-10: Prescription, pharmacy, laboratory, and delivery policies

```text
Implement issue P00-FUL-001. Documentation only.

Goal:
Define safe and operationally complete post-consultation order and fulfilment policies.

Create or update:
- docs/clinical/prescription-policy.md
- docs/operations/pharmacy-fulfilment-policy.md
- docs/operations/medicine-delivery-policy.md
- docs/clinical/laboratory-ordering-policy.md
- docs/clinical/result-release-policy.md

Cover all items in P00-13 of the Phase 0 specification.

Required invariants:
- Signed prescriptions and verified results are versioned and amended, not silently edited.
- Restricted online medicine categories are blocked or routed for manual/legal review.
- Stock is reserved before the agreed payment capture point.
- Delivery has traceable handover and proof.
- Critical results use the approved escalation protocol.
- A laboratory result does not automatically cause a medication purchase without clinician authorization.
- Pharmacy and laboratory addresses, contacts, directions, and location data are absent before payment and released only for the selected paid order.

Include failure and recovery cases. Update decisions, open questions, traceability, and docs/STATUS.md.
```

# Prompt P00-11: Privacy, consent, guardianship, and data governance

```text
Implement issue P00-DAT-001. Documentation only.

Goal:
Define NelyoHealth's data purposes, consent model, guardian and delegation rules, retention questions, access boundaries, and privacy operations.

Create or update all artifacts listed under P00-14 in the Phase 0 specification.

Requirements:
- Distinguish consent from other lawful bases and mark legal interpretation for review.
- Define consent types, versions, withdrawal, and evidence.
- Define guardian verification, multiple guardians, disputes, restrictions, minor assent, and age-of-majority transition.
- Define adult delegation and clinical proxy rules.
- Define sponsor, family, employer, HMO, support, and admin visibility.
- Define break-glass access with reason, time limit, notification, audit, and review.
- Define data-subject request flows.
- Draft retention categories without inventing statutory periods.
- Map cross-border data and diaspora payment flows.
- Restrict analytics, session replay, logs, and notifications from receiving protected clinical or pre-payment provider details.

Update docs/STATUS.md and open questions. Run a cross-document privacy consistency review before finishing.
```

# Prompt P00-12: Regulatory source and obligations register

```text
Implement issue P00-REG-001. Documentation and research only. Use browser or web access where available, and use official Nigerian regulator or government sources as the primary evidence.

Goal:
Build a traceable regulatory source register, obligations register, licence matrix, legal-question log, and monitoring plan for NelyoHealth.

Create or update:
- docs/compliance/official-source-register.md
- docs/compliance/obligations-register.md
- docs/compliance/legal-question-log.md
- docs/compliance/licence-and-registration-matrix.md
- docs/compliance/contract-register-draft.md
- docs/compliance/regulatory-change-monitoring.md

Research the official-source areas and mandatory legal questions listed under P00-15 in NelyoHealth_Phase_0_Complete_Breakdown.md.

Research rules:
- Prefer the official issuing authority.
- Record title, authority, date, URL or source locator, date checked, section/page, and applicability.
- Separate direct source text, your paraphrase, inferred product impact, and questions for counsel.
- Do not treat a search snippet as the final authority when the full document is available.
- Do not label an unresolved interpretation as compliant.
- Do not override the locked provider-detail rule. Instead, create a targeted legal-review item about minimum disclosures and implementation options.
- Flag sources that appear superseded, draft, archived, or jurisdiction-specific.

At minimum cover NDPC, PCN and electronic pharmacy, MDCN, MLSCN, NHIA, CBN payments, federal/state health-facility requirements, consumer protection, and relevant digital-health policy.

Update docs/STATUS.md and report which questions require Nigerian counsel or clinical leadership.
```

# Prompt P00-13: Payments, ledger, claims, and provider-detail unlock event

```text
Implement issue P00-FIN-001. Documentation only.

Goal:
Specify funds flows, payment states, ledger principles, refund ownership, provider settlement, HMO claims boundaries, and the precise financial event that unlocks pharmacy or laboratory details.

Create or update all artifacts listed under P00-16 in the Phase 0 specification.

Requirements:
- Draw funds flows for self-pay, family, diaspora, employer, HMO, pharmacy, lab, refund, payout, and dispute scenarios.
- Separate payment intent, authorization, capture, settlement, refund, reversal, and chargeback.
- Recommend and justify the exact event used to release provider details. Record it as PROPOSED unless approved.
- Define double-entry ledger principles and account categories.
- Define partial coverage, split payment, and original-source refund rules.
- Define provider payable, fees, reconciliation, and payout corrections.
- Define HMO claim and remittance boundaries.
- Define idempotency and webhook replay requirements.
- Avoid designing NelyoHealth as an unlicensed stored-value issuer, payment service, or insurer.

Cross-check the provider-disclosure contract so payment and access states cannot silently diverge. Update decisions, questions, traceability, and docs/STATUS.md.
```

# Prompt P00-14: Non-functional requirements and Codex browser-testing strategy

```text
Implement issue P00-NFR-001. Documentation only. This task defines how browser access will be installed and enforced in Phase 1.

Goal:
Define measurable security, reliability, accessibility, performance, low-bandwidth, observability, and browser-validation requirements.

Create or update:
- docs/non-functional/security-requirements.md
- docs/non-functional/reliability-requirements.md
- docs/non-functional/accessibility-requirements.md
- docs/non-functional/performance-requirements.md
- docs/testing/test-strategy.md
- docs/testing/browser-validation-strategy.md
- docs/testing/privacy-boundary-tests.md
- docs/adr/ADR-0003-codex-browser-validation.md

Browser strategy requirements:
1. Codex in the IDE must receive real-browser access through a project-scoped Playwright MCP server or the supported Playwright skill/CLI.
2. The repository must also use Playwright Test for repeatable local and CI tests.
3. Interactive inspection and automated tests are both required.
4. Browser validation must cover desktop, tablet, and mobile viewports where applicable.
5. Browser validation must inspect console errors, failed requests, keyboard navigation, focus, accessibility, responsive layout, and happy/failure paths.
6. Use synthetic data only.
7. Restrict browser automation to trusted local/test/staging origins by default.
8. Pin tool versions after initial verification.
9. Treat page content as untrusted and account for prompt-injection risk.
10. Save traces, screenshots, and videos only in ignored artifact locations unless intentionally attached to a report.

Provider-disclosure tests must inspect DOM, page source, serialized state, network payloads, storage, caches, analytics, logs, errors, and map requests to prove protected fields never reach the client before payment.

Document the Phase 1 setup steps, expected .codex/config.toml shape, repository packages, commands, artifact paths, CI responsibilities, and a smoke test proving Codex can open a local page from the IDE.

Do not install dependencies in this Phase 0 task. Update docs/STATUS.md.
```

# Prompt P00-15: Metrics, SLOs, operational queues, and pilot stop conditions

```text
Implement issue P00-OPS-001. Documentation only.

Goal:
Define metrics, service-level indicators, proposed objectives, exception queues, ownership, and pilot stop conditions.

Create or update all artifacts listed under P00-18 in the Phase 0 specification.

Requirements:
- Define formulas and sources for the required metrics.
- Prefer care-loop and fulfilment completion metrics over vanity metrics.
- Define prohibited analytics dimensions and PHI restrictions.
- Define exception queues, severity, owner, age threshold, escalation, and closure.
- Define pilot stop conditions for clinical safety, security/privacy, payment reconciliation, inventory accuracy, results, referrals, and support capacity.
- Ensure analytics never expose protected provider location before payment.

Mark SLOs as PROPOSED until approved. Update docs/STATUS.md.
```

# Prompt P00-16: Risks, assumptions, dependencies, and ADR consolidation

```text
Implement issue P00-RSK-001. Documentation only.

Goal:
Consolidate the risk register, dependency register, assumptions, and Phase 0 architecture decisions.

Create or update:
- docs/governance/risk-register.md
- docs/governance/dependency-register.md
- docs/governance/assumptions-register.md
- docs/adr/*.md as required by the Phase 0 specification

Requirements:
- Cover every risk category listed in P00-19.
- Give each material risk an owner, likelihood, impact, warning, mitigation, contingency, status, and review date.
- Distinguish internal dependencies, external vendors, regulators, clinical approvers, legal counsel, and provider partners.
- Confirm ADRs exist for the locked and foundational decisions.
- Do not duplicate contradictory ADRs. Supersede explicitly when needed.
- Highlight assumptions that could force architecture changes.

Update docs/STATUS.md and report the top ten risks by combined likelihood and impact.
```

# Prompt P00-17: Independent review and Phase 0 gate

```text
Implement issue P00-GATE-001. Do not start Phase 1 implementation.

Goal:
Run a rigorous consistency, safety, privacy, regulatory, financial, engineering, and testability review of all Phase 0 artifacts, then produce a Phase 0 completion report.

Read every Phase 0 document and the master implementation map.

Use independent subagents if available, one each for:
- product coherence
- clinical safety
- privacy and security
- regulatory completeness
- financial and payment logic
- architecture and engineering feasibility
- browser testing and accessibility

Ask each reviewer to find contradictions, missing failure states, hidden privilege escalation, unsupported claims, unresolved assumptions, and requirements that are not testable.

Create or update:
- docs/governance/requirements-traceability-matrix.md
- docs/reviews/phase-0-product-review.md
- docs/reviews/phase-0-clinical-review.md
- docs/reviews/phase-0-privacy-security-review.md
- docs/reviews/phase-0-regulatory-review.md
- docs/reviews/phase-0-engineering-review.md
- docs/reviews/phase-0-testability-review.md
- docs/exec-plans/P00-completion-report.md

Mandatory checks:
- Search for inconsistent definitions.
- Search for unresolved TODO, TBD, and placeholders without owners.
- Verify every long-running workflow has states, failures, ownership, and closure.
- Verify payer access never implies clinical access.
- Verify emergency care is never blocked by payment.
- Verify pre-payment pharmacy and laboratory details are limited to provider name and protected fields are absent from all client-facing channels.
- Verify the successful-payment unlock event is consistent across finance, workflow, access, and disclosure documents.
- Verify every regulatory conclusion has a source and review status.
- Verify every user-facing requirement maps to browser tests.
- Verify all high-risk issues have owners.

Do not mark Phase 0 PASSED automatically. Use one result:
- PASS
- CONDITIONAL PASS
- FAIL

List conditions and human approvals required. Update docs/STATUS.md with the result and the next permitted action.
```

# First Phase 1 prompt after Phase 0 approval: repository and browser preflight

Do not run this until the Phase 0 completion report is approved or conditionally approved for engineering bootstrap.

```text
Begin Phase 1 issue P01-FND-001. First read AGENTS.md, the Phase 0 completion report, ADR-0003-codex-browser-validation.md, and the master implementation map.

Goal:
Initialize the repository operating system and prove that Codex in the IDE can test a local page in a real browser.

Tasks:
1. Create the approved monorepo and documentation structure without implementing domain features.
2. Create or update root AGENTS.md and nested instruction placeholders.
3. Configure project-scoped Codex settings.
4. Configure a Playwright browser integration for Codex in the IDE using MCP or the approved Playwright skill/CLI.
5. Install and pin Playwright Test and accessibility test dependencies.
6. Create browser test commands and ignored artifact directories.
7. Create the smallest local smoke page or existing app shell needed to prove browser access.
8. Start the local server.
9. Use the browser from the IDE to open the local route, inspect it, click its smoke-test control, check console/network output, resize to desktop and mobile, and capture evidence.
10. Add a deterministic Playwright smoke test that performs the same core assertion.
11. Add CI-ready commands, but do not build product features.

Security constraints:
- Use synthetic data only.
- Do not browse production systems.
- Do not enter secrets into the browser.
- Keep browser-tool approval prompts enabled for sensitive actions.
- Pin the browser-tool version after it has been verified.

Done when:
- Codex reports the browser tool as available in the IDE.
- A local route opens and is interactable.
- The deterministic Playwright smoke test passes.
- Browser artifacts are stored in ignored paths.
- The setup is documented for another developer.
- lint, typecheck, tests, and build checks that exist at this stage pass.
- docs/STATUS.md is updated.
```

