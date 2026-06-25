# ADR Index

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


## ADR Status Values

PROPOSED, ACCEPTED, ACCEPTED-IN-PRINCIPLE, DEFERRED, REJECTED, SUPERSEDED, IMPLEMENTATION-PENDING, and REVIEW-REQUIRED. Compatible qualifiers may be combined. Implementation-pending does not imply implementation exists.

## ADR Index

| ADR ID | Title | Status | Decision owner | Decision date | Last reviewed | Related requirement | Related risks | Related assumptions | Related dependencies | Supersedes | Superseded by | Implementation phase | Review triggers | Approval authority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ADR-0001 | Provider detail release after payment | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING | Architecture owner with domain owners | Existing Phase 0 | 2026-06-25 | Existing accepted decision | RSK references in register | Existing assumptions | Existing dependencies | None | None | Phase 1 or later | P00-17 review or related domain change | Domain approvers | Server-side separation, exact-order authorization, no frontend masking, finance-event dependency, PCN legal conflict unresolved |
| ADR-0002 | Wallet as ledger-backed balance | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING | Architecture owner with domain owners | Existing Phase 0 | 2026-06-25 | Existing accepted decision | RSK references in register | Existing assumptions | Existing dependencies | None | None | Phase 1 or later | P00-17 review or related domain change | Domain approvers | Ledger-backed funding balance, no assumed NelyoHealth custody, wallet terminology approval-gated |
| ADR-0003 | Codex browser validation | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING | Architecture owner with domain owners | Existing Phase 0 | 2026-06-25 | Existing accepted decision | RSK references in register | Existing assumptions | Existing dependencies | None | None | Phase 1 or later | P00-17 review or related domain change | Domain approvers | Interactive Codex browser validation, Playwright Test, project-scoped configuration, synthetic data, trusted origins, no personal profile |
| ADR-0004 | Design, motion, and content governance | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING | Architecture owner with domain owners | Existing Phase 0 | 2026-06-25 | Existing accepted decision | RSK references in register | Existing assumptions | Existing dependencies | None | None | Phase 1 or later | P00-17 review or related domain change | Domain approvers | Governed visual system, Motion for React, UI UX Pro Max advisory use, page and section contracts |
| ADR-0005 | Modular monolith first | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING-PHASE-1 | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Independent scaling need; regulatory isolation; data-residency boundary; team ownership boundary; deployment contention; repeated reliability isolation need; measured operational pressure | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0006 | Person and longitudinal patient identity | ACCEPTED; IMPLEMENTATION-PENDING | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Identity matching, merge review, national identity integration, multi-country expansion, HMO/employer imports, account recovery, and data portability changes | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0007 | Payer and clinical-access separation | ACCEPTED; IMPLEMENTATION-PENDING | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | New payer, sponsor, HMO, employer, claims, guardian, delegation, or support-access model | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0008 | Finalized clinical record amendments | ACCEPTED; IMPLEMENTATION-PENDING | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Correction workflow, DSR handling, legal retention, clinical safety, or audit-model change | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0009 | Video platform decision deferred | DEFERRED; EVALUATION-REQUIRED-BEFORE-VIDEO-IMPLEMENTATION | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Before consultation video implementation begins | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0010 | No production PHI in product analytics or session replay | ACCEPTED-IN-PRINCIPLE; IMPLEMENTATION-PENDING | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Session replay proposal; new analytics vendor; new clinical-quality use; employer or HMO reporting; AI/model training; new cross-border processor | Domain approvers | New P00-16 ADR; implementation not started. |
| ADR-0011 | OrderFundingSecured and disclosure separation | PROPOSED; REQUIRES-FINANCE-LEGAL-PRIVACY-SECURITY-AND-OPERATIONS-APPROVAL | Architecture owner with domain owners | 2026-06-25 | 2026-06-25 | REQ-RSK and locked requirements as applicable | Risk register | Assumptions register | Dependency register | None | None | Phase 1 or later unless deferred | Payment provider; capture meaning; bank-transfer confirmation; coverage guarantee; refund behavior; chargeback behavior; PCN disclosure conflict; provider acceptance sequence | Domain approvers | New P00-16 ADR; implementation not started. |

## Existing ADR Review

ADR-0001 through ADR-0004 were reviewed and retained. No ADR was deleted. No contradictory accepted ADR was found that required supersession in P00-16; unresolved conflicts remain for P00-17/domain review where applicable.
