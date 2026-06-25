# ADR-0011: OrderFundingSecured and disclosure separation

## Document Control

| Field | Value |
|---|---|
| Status | DRAFT-PENDING-DOMAIN-OWNER-AND-FOUNDER-APPROVAL |
| Codex prompt ID | P00-16 |
| Complete Breakdown work package | P00-19 |
| Issue ID | P00-RSK-001 |
| Version | 0.1 draft |
| Owner | Governance and risk owner |
| Review state | Draft pending domain-owner and founder approval |
| Last updated | 2026-06-25 |
| Effective date | NOT EFFECTIVE AS RISK ACCEPTANCE UNTIL APPROVED |
| Required reviewers | Founder/product owner, clinical lead, Nigerian legal/regulatory counsel, privacy owner/DPO, security owner, finance/payments owner, operations lead, engineering/architecture owner, accessibility/design/content owners |
| Approval authority | External domain approvers; Codex cannot accept risk on behalf of NelyoHealth |
| Related decisions | REQ-RSK-001 through REQ-RSK-035 |
| Related open questions | OQ-00-775 through OQ-00-831 |
| Review and change-control requirements | Risk acceptance, closure, waiver, dependency satisfaction, assumption validation, ADR supersession, or blocker downgrade requires recorded human approval. |

This is a risk and decision-governance artifact. It does not itself approve legal, clinical, regulatory, financial, privacy, security, operational, design, or accessibility risk. Risk scoring is qualitative and prioritization-oriented. Risk scores are not statistical predictions. Vendor and partner dependencies remain unselected unless prior evidence proves otherwise.


## Status

PROPOSED; REQUIRES-FINANCE-LEGAL-PRIVACY-SECURITY-AND-OPERATIONS-APPROVAL

## Date

2026-06-25

## Decision owners

Architecture owner with relevant product, clinical, privacy, security, finance, operations, design, content, and legal/regulatory owners.

## Context

P00-16 consolidates foundational decisions from Phase 0 without implying implementation exists or that unresolved legal, clinical, financial, privacy, security, accessibility, or operational approvals have been granted.

## Decision

Payments and Ledger proposes OrderFundingSecured as exact-order scoped, requiring verified capture, confirmed receipt, or approved evidence profile, balanced ledger posting, valid order and funding allocation. It does not expose provider details. ProviderDetailDisclosureDecision remains authorization authority and ProviderDetailDisclosureEligibilityEstablished remains separate access-policy outcome.

## Decision drivers

Locked NelyoHealth requirements, Phase 0 source documents, existing decision registers, ADR-0001 through ADR-0004, risk register, dependency register, and implementation reversibility.

## Alternatives considered

Browser success flag; payment authorization; settlement only; generic paid flag; provider acceptance; ledger posting only; exact-order verified funding plus separate disclosure authorization.

## Positive consequences

Improves traceability, preserves locked requirements, supports safer Phase 1 design, and gives P00-17 explicit review points.

## Negative consequences

Adds governance, requires implementation discipline, and leaves unresolved dependencies as blockers until approved evidence exists.

## Security implications

Requires least privilege, auditability, isolation, and no reliance on client-side or analytics signals for sensitive authority.

## Privacy implications

Preserves patient identity boundaries, payer/clinical separation, provider-detail protections, and minimized analytics.

## Clinical implications

Protects clinical safety, emergency independence, finalized-record provenance, and domain-owner approval boundaries.

## Financial implications

Financial authority remains separate from clinical access and disclosure authorization; custody, ledger, payment, refund, and settlement questions remain approval-controlled.

## Operational implications

Requires queues, metrics, runbooks, tests, review triggers, fallback decisions, and explicit owners before launch reliance.

## Accessibility and design implications

Design, content, browser, motion, and accessibility implementations must preserve safety, privacy, reduced-motion, and CTA semantics.

## Assumptions

Related assumptions remain UNVALIDATED or APPROVAL-REQUIRED unless evidence is present in the repository.

## Dependencies

See docs/governance/dependency-register.md. No vendor, partner, regulator, or implementation dependency is treated as satisfied unless evidence exists.

## Related risks

See docs/governance/risk-register.md. Critical and high residual risks require P00-17 review.

## Implementation implications

Implementation is pending Phase 1 or later. This ADR does not create application code, schemas, services, tests, tooling, or infrastructure.

## Test implications

Future tests must use synthetic data outside production and cover authorization, privacy, workflow, browser, accessibility, and audit boundaries relevant to this decision.

## Review triggers

Payment provider; capture meaning; bank-transfer confirmation; coverage guarantee; refund behavior; chargeback behavior; PCN disclosure conflict; provider acceptance sequence.

## Supersession rule

This ADR may be refined or superseded only by a later ADR that explicitly names the superseded decision and preserves history.

## Related documents

ADR-index.md, risk-register.md, dependency-register.md, decision-register.md, open-questions.md, assumptions-register.md, and relevant Phase 0 domain documents.

## Open Dependencies

Open dependencies include payment provider, capture meaning, bank-transfer confirmation, coverage guarantee, refund behavior, chargeback behavior, PCN disclosure conflict, and provider acceptance sequence.

## Disclosure Separation Rule

OrderFundingSecured does not directly expose provider details. ProviderDetailDisclosureDecision remains the authorization authority, and ProviderDetailDisclosureEligibilityEstablished remains a separate access-policy outcome tied to the selected authorized order.
