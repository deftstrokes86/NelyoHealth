# Traceability Conventions for Phase 0

## Purpose

Provide a deterministic linking format from requirement -> issue -> implementation prompt -> review artifact.

## Core traceability rules

- The Complete Breakdown governs scope and content.
- The Codex Prompt Pack governs executable prompt order.
- A Codex prompt may cover one or more Complete Breakdown work packages.
- Future execution instructions must always cite both IDs.
- P00-00 through P00-17 and Complete Breakdown P00-01 through P00-20 must all be covered before Phase 0 completion.
- Similar-looking IDs are not equivalent unless explicitly crosswalked.

## Canonical crosswalk

| Codex Prompt Pack | Complete Breakdown coverage |
|---|---|
| P00-00 | P00-01 Document control and decision system |
| P00-01 | P00-02 Product charter and business model |
| P00-02 | P00-03 MVP and pilot boundary |
| P00-03 | P00-04 Actors, personas, relationships, and tenancy |
| P00-04 | P00-05 Plans, sponsorship, coverage, and funding |
| P00-05 | P00-06 User journeys and service blueprints |
| P00-06 | P00-07 Domain glossary and data classification, plus P00-08 Conceptual domain model and boundaries |
| P00-07 | P00-09 Workflow state machines |
| P00-08 | P00-10 Pharmacy and laboratory disclosure contract |
| P00-09 | P00-11 Clinical scope and safety model, plus P00-12 Emergency, urgent, referral, and critical-result protocols |
| P00-10 | P00-13 Prescription, laboratory, pharmacy, and delivery policies |
| P00-11 | P00-14 Privacy, consent, guardianship, and data governance |
| P00-12 | P00-15 Regulatory obligations and source register |
| P00-13 | P00-16 Payments, ledger, claims, and commercial rules |
| P00-14 | P00-17 Non-functional requirements and browser-test strategy |
| P00-15 | P00-18 Metrics, service levels, and operational readiness |
| P00-16 | P00-19 Risks, assumptions, dependencies, and ADRs |
| P00-17 | P00-20 Traceability, review, and phase gate |

## ID formats

- **Requirements:** `REQ-<CATEGORY>-<NNN>`
  - Example: `REQ-PHARMACY-003`
- **Work items:** `P00-<NN>` (as defined by prompt pack and execution plan)
- **Reviews:** `REV-<AREA>-<NNN>`
- **Open questions:** `OQ-00-<NN>`
- **Risks:** `RISK-<NNN>`
- **Decisions:** `REQ-LOCK-<NNN>` and `REQ-PAY-<NNN>`

## Category map

- `REQ-PHARMACY-*` -- discovery, location redaction, release authorization.
- `REQ-CLINICAL-*` -- clinical scope, safety, referrals, critical results, emergency.
- `REQ-PAYER-*` -- payer access, sponsorship, funding, HMO rules.
- `REQ-PAYMENT-*` -- payment intent/capture/settlement/reversal linkage.
- `REQ-GOV-*` -- governance, roles, approval, traceability.
- `REQ-TECH-*` -- state machines, workflows, NFR, testing strategy.
- `REQ-RISK-*` -- risks, dependencies, ADRs, assumptions.

## P00-08 PRV identifier families

- Disclosure requirements: `PRV-REQ-<NNN>`
- Disclosure contract fields: `PRV-FLD-<NNN>`
- Disclosure policy rules: `PRV-POL-<NNN>`
- Disclosure threat cases: `PRV-THR-<NNN>`
- Disclosure test scenarios: `PRV-TST-<NNN>`
- Governance decisions: `REQ-PRV-<NNN>`

These are documentation traceability identifiers only. They are not database identifiers, URL identifiers, API route names, provider identifiers, order identifiers, or implementation-generated IDs.

## Linkage obligations

For each significant requirement, include:
1. Origin prompt (`P00-xx`).
2. Primary document path.
3. Affected workflow/state-machine IDs.
4. Access rule and failure behavior.
5. Planned acceptance test (manual and browser deterministic).
6. Owner and review state (`APPROVED` / `PROPOSED` / `REQUIRES_*`).

## Review-state rules

- A non-empty unresolved open item in active output requires:
  - an owner
  - target phase
  - risk assessment
  - explicit follow-up issue
- No requirement can advance to implementation without mapping from requirement ID to:
  - source prompt (`P00-xx`)
  - target test artifact and review gate.

## Artifact mapping expectation by phase

- **P00-00:** lock core docs and decision register.
- **P00-01 to P00-07:** map product/domain decisions and constraints.
- **P00-08 to P00-13:** map disclosure/clinical/finance decisions to workflow states.
- **P00-14 to P00-15:** map NFR and browser-test expectations.
- **P00-16 to P00-17:** map risks, owners, traceability matrix, and completion approval status.



## P00-11 identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| DAT-REQ | Cross-cutting data-governance requirement | P00-11 | Requirement traceability inside privacy artifacts |
| DFM-FLW | Data-flow map flow | P00-11 | Conceptual data movement, not topology |
| ROPA-ACT | Draft processing activity | P00-11 | Not a final legally complete ROPA |
| CNS-POL | Consent policy rule or consent type | P00-11 | Consent is purpose-specific and not blanket lawful basis |
| GDN-POL | Guardian and delegation policy rule | P00-11 | Minor functionality remains design-only until approved |
| RET-CAT | Retention category | P00-11 | No statutory period approved in P00-11 |
| DSR-WFL | Data-subject-rights workflow | P00-11 | No statutory response period approved in P00-11 |
| XBR-FLW | Cross-border data flow | P00-11 | Transfer mechanism remains legal-review controlled |
| SUB-REQ | Subprocessor category or due-diligence requirement | P00-11 | No vendor approved without review |
| BGA-POL | Break-glass policy rule | P00-11 | Exceptional, audited, review-bound access |
| NTF-POL | Notification data policy rule/type | P00-11 | Minimum-necessary notification content |
| REQ-DAT | Governance decision for data/privacy | P00-11 | Decision register entries for privacy controls |

## P00-12 identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| REG-SRC | Official source register entry | P00-12 | Official source, access status, date checked, source status, and applicability notes |
| REG-OBL | Regulatory obligation register entry | P00-12 | Source-backed obligation or access-limited issue with owner and launch gate |
| REG-Q | Legal/regulatory question | P00-12 | Counsel/regulator question; not a legal answer |
| REG-LIC | Licence, registration, accreditation, or credential matrix entry | P00-12 | Separates platform approvals, facility approvals, professional credentials, partner-held licences, and contractual evidence |
| REG-CTR | Contract inventory category | P00-12 | Inventory only; not legal drafting |
| REG-MON | Regulatory monitoring source/rule | P00-12 | Official-source monitoring and change workflow |
| REQ-REG | Governance decision for regulatory research and launch gates | P00-12 | Decision register entries for source hierarchy, legal-review boundaries, and launch-gate rules |

## P00-13 finance identifier families

| Identifier family | Owner prompt | Meaning |
|---|---|---|
| FIN-REQ | P00-13 | Finance requirement rows in finance artifacts. |
| FIN-FLW | P00-13 | Funds-flow records. |
| PAY-POL | P00-13 | Payment-state and evidence-policy rules. |
| LED-POL | P00-13 | Ledger and balance-policy rules. |
| RFD-POL | P00-13 | Refund, reversal, chargeback, and dispute-policy rules. |
| STL-POL | P00-13 | Provider settlement and payout-policy rules. |
| CLM-POL | P00-13 | Claims, remittance, employer, and HMO-boundary policy rules. |
| FIN-TST | P00-13 | Future financial test requirements, including browser and Playwright coverage delegated to P00-14. |
| REQ-FIN | P00-13 | Decision-register finance decisions. |

## P00-14 identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| SEC-NFR- | Security non-functional requirement | P00-14 | Draft until security and architecture approval. |
| REL-NFR- | Reliability non-functional requirement | P00-14 | Numeric targets remain approval-controlled. |
| A11Y-NFR- | Accessibility non-functional requirement | P00-14 | WCAG 2.2 AA is a target, not a conformance claim. |
| PERF-NFR- | Performance non-functional requirement | P00-14 | Budgets require approved targets before implementation gates. |
| TST-REQ- | Testing strategy requirement | P00-14 | Defines future verification requirements only. |
| BRW-REQ- | Browser validation requirement | P00-14 | Covers interactive Codex IDE browser and deterministic Playwright Test strategy. |
| PBT-REQ- | Privacy-boundary test requirement | P00-14 | Covers provider-disclosure and sensitive-data negative tests. |
| NFR-TST- | Future non-functional test anchor | P00-14 | Reserved for Phase 1/later implementation; no test code created in Phase 0. |
| REQ-NFR- | Non-functional governance decision | P00-14 | Recorded in decision register. |

## P00-14 revision identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| DES-NFR- | Experience and visual quality non-functional requirement | P00-14 revision / P00-14A | Final values and system specs deferred to P00-14A. |
| MOT-NFR- | Motion requirement | P00-14 revision / P00-14A | Motion for React planned; package/version pinned only in Phase 1. |
| UXP-REQ- | UI UX Pro Max governance requirement | P00-14 revision | Third-party advisory skill; project-local reviewed install only after approval. |
| CNT-NFR- | Content alignment non-functional requirement | P00-14 revision / P00-14A | Page/section/content/CTA contracts; final registry format deferred. |
| DCT-TST- | Design and content validation scenario | P00-14 revision | Future tests and browser review requirements only. |

## P00-14A identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| EXP-PRN- | Experience principle | P00-14A | Stable if labels change. |
| VIS-DIR- | Visual-direction decision | P00-14A | Candidate and recommended visual directions. |
| DSYS-REQ- | Design-system requirement | P00-14A | Future design-system implementation requirements. |
| TOK-COL- | Color token | P00-14A | Proposed only until approved. |
| TOK-TYP- | Typography token | P00-14A | Font licensing remains unresolved. |
| TOK-SPC- | Spacing token | P00-14A | Semantic use required. |
| TOK-SIZ- | Sizing token | P00-14A | Includes touch target planning. |
| TOK-RAD- | Radius token | P00-14A | Proposed only. |
| TOK-SHD- | Shadow/elevation token | P00-14A | Proposed only. |
| TOK-Z- | Stacking token | P00-14A | Proposed only. |
| TOK-BRK- | Breakpoint token | P00-14A | Proposed only. |
| TOK-MOT- | Motion token | P00-14A | Motion version pinned only in Phase 1. |
| IA-NODE- | Information-architecture node | P00-14A | Public and authenticated IA. |
| NAV-MOD- | Navigation model | P00-14A | Role-specific navigation models. |
| PAGE- | Stable page identifier | P00-14A | Stable if visible labels/routes change. |
| SEC- | Stable section identifier | P00-14A | Stable if visible labels change. |
| CMP- | Component or pattern identifier | P00-14A | Covers primitives, domain components, and content components. |
| MOT-PAT- | Motion pattern | P00-14A | Governed motion behavior. |
| CNT- | Content item or content type | P00-14A | Stable if visible copy changes. |
| CTA- | Call-to-action contract | P00-14A | Label must match actual action. |
| MSG- | System/state message | P00-14A | State-specific content. |
| FORM- | Form contract | P00-14A | Future form validation/content alignment. |
| STATE- | Page or component state | P00-14A | Future state coverage. |
| REQ-DES- | Design governance decision | P00-14A | Recorded in decision register. |
| REQ-CNT- | Content governance decision | P00-14A | Recorded in decision register. |

## P02 identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| P02-REQ | Phase 2 platform/infrastructure requirement | P02-PLAN-001 | Requirement rows in phase-2-requirements-traceability.md |
| P02-EG | Phase 2 exit-gate condition | P02-PLAN-001 | Exit gates from the canonical Phase 2 map |
| P02-ISS | Phase 2 implementation issue | P02-PLAN-001 | Future implementation backlog; not started by planning docs |
| DEC-P02-PLAN | Phase 2 planning decision | P02-PLAN-001 | Planning-only decisions and future ADR requirements |
| DEP-P02-PLAN | Phase 2 planning dependency | P02-PLAN-001 | Dependencies that gate future implementation |
| BLK-P02-PLAN | Phase 2 planning blocker | P02-PLAN-001 | Blockers/conditions for future Phase 2 issues |
| RSK-P02-PLAN | Phase 2 planning risk | P02-PLAN-001 | Cross-references into risk register |
| OQ-P02 | Phase 2 open question | P02-PLAN-001 | Questions requiring owner resolution before affected issues |

P02 identifiers are documentation traceability identifiers only. They are not app route names, database identifiers, environment names, queue names, object-storage keys, provider identifiers, or deployment identifiers.

## P00-15 operational identifier families

| Identifier family | Meaning | First use | Governance rule |
|---|---|---|---|
| OPS-REQ-001 onward | Cross-cutting operational requirements. | P00-15 | Must map to prompt, source requirement, owner, approval status, and validation. |
| MET-001 onward | Metric catalogue entries. | P00-15 | Must include formula, source, owner, target status, classification, and future test. |
| SLI-001 onward | Service-level indicators. | P00-15 | Must include good event, valid event, formula, source, owner, and related SLO. |
| SLO-001 onward | Proposed service-level objectives. | P00-15 | No numeric target is approved by ID creation. |
| DASH-001 onward | Proposed operational dashboard definitions. | P00-15 | Must include audience, data scope, prohibited data, accessibility, export, and approval status. |
| QUE-001 onward | Exception queue definitions. | P00-15 | Must include owner, backup, escalation, age, closure, reopening, permitted commands, and prohibited actions. |
| STOP-001 onward | Pilot stop, pause, rollback, freeze, containment, and resume conditions. | P00-15 | Must include trigger, source, verification, authority, containment, communication, investigation, resume criteria, and audit. |
| ANL-POL-001 onward | Analytics data policy rules. | P00-15 | Must include owner, minimization purpose, approval status, and validation. |
| OPS-TST-001 onward | Future operations tests. | P00-15 | Must use synthetic data outside production and remain future implementation work until Phase 1 or later. |

## P00-16 risk and dependency identifier families

| Identifier family | Meaning | First use | Governance rule |
|---|---|---|---|
| RSK-001 onward | Material risk entries. | P00-16 | Must include owner, score, residual score, early warning, mitigation, contingency, blocker, review trigger, and acceptance authority. |
| DEP-001 onward | Internal, approval, regulatory, provider, vendor, tooling, contract, geography, staffing, training, test, and future dependencies. | P00-16 | Must include owner, evidence, status, milestone, fallback, related risk, and verification method. |
| REQ-RSK-001 onward | Risk-governance and ADR-consolidation decisions. | P00-16 | Must preserve locked decisions and separate proposals from approvals. |

## P00-17 final gate identifier families

| Identifier family | Meaning | First use | Governance rule |
|---|---|---|---|
| TRC-001 onward | Detailed traceability entries. | P00-17 | Must map requirement, source, owner, risk, dependency, approval, test, implementation phase, and gap. |
| AUD-001 onward | Consistency-audit findings. | P00-17 | Must include severity, domain, correction status, blocker effect, owner, and resolution criterion. |
| APR-001 onward | Approval-register items. | P00-17 | APPROVED requires evidence of approver, capacity, scope, date, conditions, and location. |
| BLK-001 onward | Unresolved blocker entries. | P00-17 | Must classify phase, capability, release, pilot, expansion, tracked, or future-scope effect. |
| GATE-001 onward | Phase gate criteria. | P00-17 | Must state evidence, result, gaps, owner, required action, and whether Phase 0, Phase 1, or pilot is blocked. |
| HND-001 onward | Phase 1 handoff requirements. | P00-17 | Must preserve source set, restrictions, dependencies, browser/test obligations, and checkpoint discipline. |
| REQ-GATE-001 onward | Final gate-governance decisions. | P00-17 | Must not create new locked product requirements or external approvals. |
