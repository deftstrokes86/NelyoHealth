# NelyoHealth Product Principles (P00-01)

## Document control

- Document: Product Principles
- Codex prompt ID: **P00-01**
- Complete Breakdown work package: **P00-02**
- Issue ID: **P00-PRD-001**
- Review state: **PROPOSED**
- Last updated date: **2026-06-23**

## Principle 1: The patient is the center of the system

- **Principle statement:** All workflow design must start from a single longitudinal patient care identity.
- **Why it exists:** Prevents duplicate records and role-driven fragmentation.
- **Product consequence:** Journeys are patient-scoped before sponsor- or organization-level features.
- **Engineering consequence:** Identity and relation models must preserve one patient anchor and prevent duplicate clinical records.
- **Operational consequence:** Escalations and follow-ups are attached to the same patient timeline.
- **Example of compliance:** A sponsor payment creates `payer context` on one patient journey, not a parallel patient record.
- **Example of violation:** A second patient record is created when adding a family insurer.
- **Related locked decision:** **REQ-LOCK-001**

## Principle 2: One person, one longitudinal identity

- **Principle statement:** One individual maps to one longitudinal patient identity regardless of plans, sponsors, or organisations.
- **Why it exists:** Protects care continuity and access correctness.
- **Product consequence:** Account structures may have many affiliations, but clinical continuity remains singular.
- **Engineering consequence:** Query and join logic must use the longitudinal person anchor.
- **Operational consequence:** Transfers between family, sponsor, and employer contexts do not fork the record.
- **Example of compliance:** Family onboarding attaches to existing patient identity after duplicate checks.
- **Example of violation:** Reopening patient flow from a new sponsor creates a new clinical identity.
- **Related locked decision:** **REQ-LOCK-001**

## Principle 3: Payment does not equal clinical access

- **Principle statement:** Financial authority alone cannot authorize clinical data visibility.
- **Why it exists:** Financial and clinical rights differ in purpose and risk.
- **Product consequence:** UI and policy layers separate payment status from record visibility.
- **Engineering consequence:** Access controls are based on explicit authorization checks, not payment outcome only.
- **Operational consequence:** Support agents cannot treat payer identity as full clinical authorization.
- **Example of compliance:** Employer pays bill, clinician note remains hidden from employer dashboard.
- **Example of violation:** Any payer page shows diagnosis by default after successful payment.
- **Related locked decision:** **REQ-LOCK-002**

## Principle 4: Close the care loop

- **Principle statement:** Core loops must reach safe completion states or explicit exception recovery states.
- **Why it exists:** Partial workflows create unsafe follow-through gaps.
- **Product consequence:** Journeys include completion and reopen criteria.
- **Engineering consequence:** State machines include success, expiry, failure, and handoff states.
- **Operational consequence:** Operations team resolves unresolved loops before release expansion.
- **Example of compliance:** Consultation creates post-consultation action and closes only after medication/result/review path settles.
- **Example of violation:** Consultation marked complete while prescription order remains unresolved.
- **Related locked decision:** **REQ-LOCK-011**

## Principle 5: Emergencies bypass commercial friction

- **Principle statement:** Emergency workflow cannot be blocked by payment, comparison, or registration gates.
- **Why it exists:** Delay can increase clinical harm.
- **Product consequence:** Emergency actions have independent override path.
- **Engineering consequence:** Emergency checks are evaluated before commercial and routine booking branches.
- **Operational consequence:** Escalation desk and referral path remain active under normal failures.
- **Example of compliance:** Patient enters emergency escalation from triage without payment status checks.
- **Example of violation:** Emergency route blocked because card authorization is pending.
- **Related locked decision:** **REQ-LOCK-010**

## Principle 6: Provider details are protected before payment

- **Principle statement:** Pre-payment exposure is limited to approved non-identifying fields, including `providerDisplayName`.
- **Why it exists:** Prevents inference, targeting, and unauthorized disclosure.
- **Product consequence:** Discovery screens and APIs hide protected fields completely.
- **Engineering consequence:** Server-side projection enforces field filtering at source.
- **Operational consequence:** Incident response includes audit checks for protected-field leaks.
- **Example of compliance:** Discovery payload returns name only and approved commercial fields.
- **Example of violation:** Pre-payment response includes distance, address, phone, or map pin.
- **Related locked decision:** **REQ-LOCK-003**, **REQ-LOCK-004**

## Principle 7: Disclosure is order-scoped and server-authorized

- **Principle statement:** Detailed provider disclosures are tied to the exact authorized, paid order context.
- **Why it exists:** Prevents cross-order or cross-tenant data spill.
- **Product consequence:** Clicking one order should not reveal another order’s details.
- **Engineering consequence:** Every provider-detail query validates order, actor, patient, tenant, and authorization.
- **Operational consequence:** Fraud and support workflows require full context verification.
- **Example of compliance:** User sees fulfilment details only for selected paid prescription.
- **Example of violation:** Same credentials unlock all earlier quotations for the same user.
- **Related locked decision:** **REQ-LOCK-006**, **REQ-LOCK-007**, **REQ-LOCK-008**

## Principle 8: Clinical judgment is not subordinated to revenue

- **Principle statement:** Product optimization cannot pressure unsafe clinical decisions.
- **Why it exists:** Patient safety overrides commercial throughput.
- **Product consequence:** No workflow path uses revenue as a clinical decision signal.
- **Engineering consequence:** Clinical action criteria must be explicit and auditable.
- **Operational consequence:** Clinical exceptions outrank conversion targets.
- **Example of compliance:** Referral is generated when clinically indicated even if non-revenue.
- **Example of violation:** Prescriptions reduced to minimize provider fees.
- **Related locked decision:** **REQ-LOCK-011**

## Principle 9: Finalized clinical records are amended, not overwritten

- **Principle statement:** Signed clinical outputs are versioned.
- **Why it exists:** Regulatory and safety requirements demand traceable corrections.
- **Product consequence:** Clinical edits create amendment versions with provenance.
- **Engineering consequence:** All record changes must preserve immutable history and diff trail.
- **Operational consequence:** Reviewers can inspect previous and corrected entries.
- **Example of compliance:** Corrected prescription adds amendment record with actor/time reason.
- **Example of violation:** Existing diagnosis is silently replaced after an error.
- **Related locked decision:** **REQ-LOCK-011**

## Principle 10: Consent and delegation are explicit

- **Principle statement:** Delegation and consent must be explicit and auditable.
- **Why it exists:** Protects minors, dependents, and vulnerable users.
- **Product consequence:** Actionable role toggles and expiry-based delegation states.
- **Engineering consequence:** Access checks evaluate consent version and target scope.
- **Operational consequence:** Revocation takes effect according to policy with audit capture.
- **Example of compliance:** Guardian role auto-revokes on expiry and re-auth is required.
- **Example of violation:** Old delegation remains valid after explicit withdrawal.
- **Related locked decision:** **REQ-LOCK-002**, **REQ-LOCK-004**

## Principle 11: Least privilege by default

- **Principle statement:** Every role starts with minimum permissions.
- **Why it exists:** Reduces accidental disclosure and unauthorized operations.
- **Product consequence:** Advanced rights require explicit action and logging.
- **Engineering consequence:** Fine-grained matrix checks in every protected action.
- **Operational consequence:** Support and admin access remains constrained.
- **Example of compliance:** Organization admins cannot view clinical notes by default.
- **Example of violation:** Viewer role includes record editing and full clinical output.
- **Related locked decision:** **REQ-LOCK-002**

## Principle 12: Every sensitive action is auditable

- **Principle statement:** All sensitive actions are logged with actor, reason, and state transition.
- **Why it exists:** Supports safety, trust, and investigations.
- **Product consequence:** Clear audit trail surfaced in reviews and incident handling.
- **Engineering consequence:** Immutable event records for access and state transitions.
- **Operational consequence:** Faster investigation and policy enforcement.
- **Example of compliance:** Payment failure-to-success transition logs payer, order, and source.
- **Example of violation:** State change with no audit event or trace.
- **Related locked decision:** **REQ-LOCK-012**

## Principle 13: Accessibility is a product requirement

- **Principle statement:** The product must be usable with assistive technologies and low-vision/low-bandwidth constraints.
- **Why it exists:** Health access must not depend on one interaction pattern.
- **Product consequence:** Keyboard-first interactions and semantic states are baseline.
- **Engineering consequence:** Accessibility checks in UI behavior and content.
- **Operational consequence:** Reduced support burden from inaccessible error and alert states.
- **Example of compliance:** All high-risk actions are keyboard reachable and clearly labeled.
- **Example of violation:** Critical action only reachable via drag-only gesture.
- **Related locked decision:** **REQ-LOCK-013**

## Principle 14: Design for unreliable connectivity

- **Principle statement:** Clinical and payment workflows must tolerate intermittent network and device instability.
- **Why it exists:** Nigerian usage contexts may include unstable connectivity.
- **Product consequence:** Explicit loading, retry, offline, and recovery states for critical journeys.
- **Engineering consequence:** Idempotent retries and deterministic state recovery.
- **Operational consequence:** Lower failed-journey volume and easier support.
- **Example of compliance:** Payment retry preserves order context without duplicate charges.
- **Example of violation:** Network interruption creates partially completed hidden states.
- **Related locked decision:** **REQ-LOCK-013**

## Principle 15: Human review for high-impact decisions

- **Principle statement:** High-risk or ambiguous decisions include human review checkpoints.
- **Why it exists:** Reduces automation harm in safety-critical areas.
- **Product consequence:** Manual review queues exist for restricted cases.
- **Engineering consequence:** Workflow engine supports escalation and manual intervention without bypassing audit.
- **Operational consequence:** Escalations have ownership and closure criteria.
- **Example of compliance:** Unusual prescription patterns move to manual review.
- **Example of violation:** All exception routes auto-approve when uncertain.
- **Related locked decision:** **REQ-LOCK-013**

## Principle 16: Use verified providers

- **Principle statement:** Fulfillment partners and clinical participants must be verified before patient-facing use.
- **Why it exists:** Prevents unsafe outcomes and reputational harm.
- **Product consequence:** Unverified entities stay out of active matching pools.
- **Engineering consequence:** Verification state gates provider availability and routing.
- **Operational consequence:** Revocations and re-verification flows are explicit.
- **Example of compliance:** Expired lab verification removes provider from active matching.
- **Example of violation:** Unverified provider receives patient-facing status.
- **Related locked decision:** **REQ-LOCK-004**

## Principle 17: Build one platform, not disconnected portals

- **Principle statement:** B2C and B2B flows must converge on one core care state model.
- **Why it exists:** Avoids contradictory policies and duplicate workflows.
- **Product consequence:** Shared journey model and shared patient timeline.
- **Engineering consequence:** Single core definitions with integration extensions.
- **Operational consequence:** Unified operations training and analytics.
- **Example of compliance:** Family sponsor and direct-pay journeys share the same closure states.
- **Example of violation:** Separate independent implementations with conflicting rules.
- **Related locked decision:** **REQ-LOCK-001**

## Principle 18: Separate domain logic from external vendors

- **Principle statement:** NelyoHealth controls policy and state transitions, vendor data is integrated through interfaces.
- **Why it exists:** Reduces vendor lock-in and preserves deterministic behavior.
- **Product consequence:** Vendor integrations remain replaceable and policy-compliant.
- **Engineering consequence:** Domain boundaries between policy, routing, and external adapters.
- **Operational consequence:** Vendor issues can be isolated.
- **Example of compliance:** Payment provider failure does not alter clinical state model directly.
- **Example of violation:** Provider SDK callback directly sets clinical visibility flags.
- **Related locked decision:** **REQ-LOCK-013**

## Principle 19: Test privacy boundaries negatively

- **Principle statement:** Privacy is validated by proving absence of protected data in all channels.
- **Why it exists:** Visual checks alone do not detect hidden leakage.
- **Product consequence:** Negative test obligations exist for API, storage, logs, maps, and analytics.
- **Engineering consequence:** Automated assertions across channels and channels for pre-payment phases.
- **Operational consequence:** Security incidents can be detected before release.
- **Example of compliance:** Regression suite asserts no location fields in API payload and browser state.
- **Example of violation:** Manual QA only checks page text and misses hidden network leaks.
- **Related locked decision:** **REQ-LOCK-004**, **REQ-LOCK-005**

## Principle 20: Use synthetic data in testing

- **Principle statement:** Browser, analytics, and negative security tests use synthetic data only.
- **Why it exists:** Avoids real patient data exposure before controls are mature.
- **Product consequence:** Test fixtures are synthetic and role-labeled.
- **Engineering consequence:** Test environments and CI data management enforce synthetic-only policies.
- **Operational consequence:** Compliance posture remains stronger during testing.
- **Example of compliance:** Browser test suite uses synthetic patients and fixtures.
- **Example of violation:** Real names and real addresses used in test scripts.
- **Related locked decision:** **REQ-LOCK-012**

## Principle 21: Keep emergency and safety pathways operational during partial system failure

- **Principle statement:** Emergency and high-risk safety paths remain available when optional services fail.
- **Why it exists:** Operational resilience is mandatory for health platforms.
- **Product consequence:** Non-fatal fallback logic for comparison, scheduling, and payment failures.
- **Engineering consequence:** Circuit-breaker patterns and alternate paths for critical flows.
- **Operational consequence:** Reduced mortality and harm risk during outages.
- **Example of compliance:** Emergency escalation channel still available when pharmacy map service fails.
- **Example of violation:** Entire platform blocks on a non-critical vendor outage.
- **Related locked decision:** **REQ-LOCK-010**

## Principle 22: Make financial movements reconcilable

- **Principle statement:** All payment and payout events must map to a ledger model with traceable settlement state.
- **Why it exists:** Financial disputes impact trust and clinical continuity.
- **Product consequence:** Clear event states for intent, capture, settlement, reversal, and refund.
- **Engineering consequence:** Deterministic event IDs and immutable payment records.
- **Operational consequence:** Reconciliation becomes a documented process.
- **Example of compliance:** Refund state does not unlock protected details unless policy permits.
- **Example of violation:** Cash reconciliation has no auditable settlement trail.
- **Related locked decision:** **REQ-LOCK-009**

## Principle 23: Make operational exceptions visible and recoverable

- **Principle statement:** Every high-impact failure path has visibility, ownership, and recovery closure.
- **Why it exists:** Hidden exceptions become safety risks.
- **Product consequence:** Explicit queue and owner-based exception model.
- **Engineering consequence:** Exception states are first-class events and tests.
- **Operational consequence:** Faster incident response and lower recurrence.
- **Example of compliance:** Failed disclosure or authorization attempts route to review queue.
- **Example of violation:** Failures are only logged as generic errors with no owner.
- **Related locked decision:** **REQ-LOCK-012**

