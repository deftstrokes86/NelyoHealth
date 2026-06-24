# Regulatory Change Monitoring

## Document Control

| Field | Value |
|---|---|
| Codex prompt ID | P00-12 |
| Complete Breakdown work package | P00-15 |
| Issue ID | P00-REG-001 |
| Status | DRAFT-PENDING-NIGERIAN-LEGAL-AND-REGULATORY-REVIEW |
| Legal status | Not legal advice; does not establish compliance; source findings require applicability analysis. |
| Review state | REQUIRES_NIGERIAN_LEGAL_AND_REGULATORY_REVIEW |
| Required reviewers | Nigerian legal/regulatory counsel; clinical lead; privacy/DPO; finance/payments owner; security lead; operations lead; pharmacy operations lead; laboratory operations lead; architecture owner. |
| Approval authority | External orchestration plus qualified Nigerian legal/regulatory counsel and named domain owners. |
| Version | 0.1 |
| Last updated | 2026-06-24 |
| Date sources checked | 2026-06-24 |
| Effective date | NOT EFFECTIVE AS A COMPLIANCE DETERMINATION |
| Related decisions | REQ-REG-023; REQ-REG-028 |
| Related open questions | REG-Q-037; OQ-00-383 |
| Review and change control | Update only through governed Phase 0 change control; re-check official sources before pilot launch and after regulator changes. |

## Legal and Regulatory Disclaimer

- This document is not legal advice.
- This document does not establish that NelyoHealth is compliant, licensed, registered, accredited, approved, or authorized.
- Source findings require applicability analysis by qualified Nigerian counsel.
- Legal interpretations require qualified Nigerian counsel.
- Regulator clarification may be required.
- State-level requirements depend on the approved pilot location.

## Monitoring Principles

- Official sources only are authoritative for regulatory changes.
- Each regulator/source family has a named owner.
- Review cadence is configured by approval; P00-12 does not invent a statutory cadence.
- Event-triggered review is required for new laws, regulations, circulars, guidance, notices, suspensions, recalls, court orders, regulator directions, source supersession, and capability changes.
- Every change record must include legal, product, engineering, operations, contract, clinical, privacy, test, launch-gate, and audit-trail impact review where applicable.

## Monitoring Sources

| Monitoring ID | Authority | Source location | Current instrument | Owner | Last checked | Review cadence | Trigger | New item | Change type | Effective date | Superseded source | Affected capabilities | Severity | Immediate containment | Legal review | Clinical review | Engineering review | Contract review | Test review | Communication | Required decision | Implementation deadline | Evidence | Closure |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REG-MON-001 | NDPC publications and guidance | https://ndpc.gov.ng/ | REG-SRC-001; REG-SRC-002; REG-SRC-003 | Privacy Counsel | 2026-06-24 | Configured cadence to be approved | New Act/directive/guidance/register/notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Privacy, security, contracts, tests | Owner-assigned | Pause affected data processing if necessary | Required | If health data affected | Required | Required | Required | Approved communication only | REQ-REG update if material | Only if source/counsel sets date | Official source capture | Approval and verification |
| REG-MON-002 | PCN publications and laws | https://pcn.gov.ng/ | REG-SRC-004; REG-SRC-006; REG-SRC-007 | Pharmacy Operations Lead | 2026-06-24 | Configured cadence to be approved | New law/regulation/register/discipline/notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Pharmacy, credentials, contracts | Owner-assigned | Pause affected pharmacy launch | Required | Required if patient safety affected | Required if platform affected | Required | Required | Approved communication only | REQ-REG/REG-Q update | Only if source/counsel sets date | Official source capture | Approval and verification |
| REG-MON-003 | PCN Electronic Pharmacy and NEPP notices | https://pcn.gov.ng/ | REG-SRC-005 | Pharmacy Ops + Architecture | 2026-06-24 | Configured cadence to be approved | NEPP/display/aggregator notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Provider disclosure, pharmacy matching | High if display/unlock affected | Block pharmacy pilot if unresolved | Required | Required | Required | Required | Provider-disclosure tests | Approved communication only | REQ-REG-017 review | Only if source/counsel sets date | Official source capture | PCN/counsel answer |
| REG-MON-004 | MDCN downloads, ethics, registration, notices | https://mdcn.gov.ng/ | REG-SRC-008; REG-SRC-009; REG-SRC-010 | Clinical Lead | 2026-06-24 | Configured cadence to be approved | Ethics/code/licence/telemedicine notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Clinical practice, advertising | High if clinical launch affected | Pause affected clinical capability | Required | Required | Required if system controls affected | Required | Required | Approved communication only | REQ-REG-019 review | Only if source/counsel sets date | Official source capture | Clinical/legal approval |
| REG-MON-005 | MLSCN laws, guidelines, licensing notices | https://web.mlscn.gov.ng/ | REG-SRC-011 | Laboratory Operations Lead | 2026-06-24 | Configured cadence to be approved | Facility/practitioner/QMS/result notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Laboratory matching/result release | High if lab launch affected | Pause affected lab capability | Required | Required | Required if system controls affected | Required | Required | Approved communication only | REQ-REG-018 review | Only if source/counsel sets date | Official source capture | Lab/legal approval |
| REG-MON-006 | NHIA acts, accreditation, notices | https://www.nhia.gov.ng/ | REG-SRC-012; REG-SRC-013 | Finance/HMO Owner | 2026-06-24 | Configured cadence to be approved | HMO/provider/accreditation/claims notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | HMO, employer, family funding | High if funding affected | Pause affected funding model | Required | If clinical network affected | Required if claims affected | Required | Required | Approved communication only | REQ-REG-013 review | Only if source/counsel sets date | Official source capture | Finance/legal approval |
| REG-MON-007 | CBN payment-system circulars | https://www.cbn.gov.ng/ | REG-SRC-014 | Finance/Payments Owner | 2026-06-24 | Configured cadence to be approved | PSP/wallet/IMTO/circular/security change | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Payment, wallet, diaspora, settlement | High if payments affected | Pause affected payment flow | Required | N/A unless care access affected | Required | Required | Required | Approved communication only | REQ-REG-014 review | Only if source/counsel sets date | Official source capture | Finance/legal approval |
| REG-MON-008 | Federal Ministry of Health publications | https://health.gov.ng/ | REG-SRC-015; REG-SRC-022 | Clinical Lead + Architecture Owner | 2026-06-24 | Configured cadence to be approved | Health Act/policy/digital health notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Clinical, emergency, digital health | Owner-assigned | Pause affected capability if unsafe | Required | Required | Required | Required | Required | Approved communication only | Decision update if material | Only if source/counsel sets date | Official source capture | Domain approval |
| REG-MON-009 | NAFDAC regulations and safety notices | https://nafdac.gov.ng/ | REG-SRC-017 | Pharmacy Ops + Clinical Lead | 2026-06-24 | Configured cadence to be approved | Recall/ADR/advert/product notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Medicine catalogue, fulfilment, advertising | High if product safety affected | Pause product/medicine flow | Required | Required | Required if catalog affected | Required | Required | Approved communication only | Product/catalogue decision | Only if source/counsel sets date | Official notice | Closure after containment |
| REG-MON-010 | FCCPC notices and consumer rules | https://fccpc.gov.ng/ | REG-SRC-016; REG-SRC-018 | Product Owner + Operations Lead | 2026-06-24 | Configured cadence to be approved | Consumer/patient-rights/complaint notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Pricing, refunds, complaints, marketplace | Owner-assigned | Pause misleading pricing/content | Required | If patient rights affected | Required if flows affected | Required | Required | Approved communication only | Product/legal decision | Only if source/counsel sets date | Official notice | Approval and verification |
| REG-MON-011 | ARCON rules and notices | https://arcon.gov.ng/ | REG-SRC-019 | Marketing Owner | 2026-06-24 | Configured cadence to be approved | Advertising code/vetting/sector notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Marketing, testimonials, ranking | Owner-assigned | Pause affected marketing | Required | If clinical claims affected | Required if ranking/content affected | Required | Required | Approved communication only | Marketing decision | Only if source/counsel sets date | Official source capture | Legal/marketing approval |
| REG-MON-012 | NITDA/cybersecurity notices | https://nitda.gov.ng/ | REG-SRC-021 | Security Lead | 2026-06-24 | Configured cadence to be approved | Cyber/cloud/security/evidence notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | Security, hosting, incident evidence | Owner-assigned | Pause unsafe processing if necessary | Required | If clinical data affected | Required | Required | Required | Approved communication only | Security/legal decision | Only if source/counsel sets date | Official source capture | Security/legal approval |
| REG-MON-013 | Official Gazettes and certified legal materials | Official Gazette / official legal repositories | REG-SRC-024 | Legal Counsel | 2026-06-24 | Configured cadence to be approved | New Act/amendment/repeal/court decision | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | All affected capabilities | Legal owner assigned | Pause if binding conflict | Required | Required if clinical | Required if implementation affected | Required | Required | Approved communication only | Decision/register update | Only if source/counsel sets date | Certified source | Legal approval |
| REG-MON-014 | Relevant state health authorities after geography selection | STATE-DEPENDENT | REG-SRC-023 | Legal Counsel + Operations Lead | 2026-06-24 | Starts after pilot geography selection | State health/facility/lab/pharmacy/emergency/tax/waste notice | Record when detected | Binding/advisory/draft/superseding | As source states | Source ID if superseded | First pilot, facilities, providers | High until resolved | Block first pilot until state review | Required | Required | Required if controls affected | Required | Required | Approved communication only | State launch decision | Only if source/counsel sets date | State source pack | State approval |
| REG-MON-015 | Courts or official legal updates where material | Official courts/legal update sources | All source families | Legal Counsel | 2026-06-24 | Configured cadence to be approved | Court decision or legal interpretation affecting launch | Record when detected | Binding/advisory/superseding | As source states | Source ID if superseded | All affected capabilities | Legal owner assigned | Pause affected capability if required | Required | Required if patient care affected | Required if implementation affected | Required | Required | Approved communication only | Decision/register update | Only if source/counsel sets date | Official legal material | Legal approval |

## Change Workflow

1. Detect.
2. Verify from official source.
3. Identify whether binding, advisory, draft, archived, repealed, superseded, or inaccessible.
4. Record or update the source in `docs/compliance/official-source-register.md`.
5. Map affected obligations in `docs/compliance/obligations-register.md`.
6. Open or update a legal question where interpretation is needed.
7. Assess product, clinical, privacy, financial, engineering, operations, contract, and test impact.
8. Identify immediate launch or feature gate.
9. Update contracts/notices where needed.
10. Update later-phase tests.
11. Obtain approval.
12. Implement only in the appropriate later phase.
13. Verify.
14. Close or continue monitoring.

## Emergency Regulatory Change

Immediate containment is required for official prohibitions, licence/provider suspension, regulator directions, safety recalls, data-protection orders, payment-provider restrictions, HMO restrictions, court orders, state facility closure, or mandatory public notices. Containment may pause an affected pilot capability, but P00-12 does not implement runtime controls.

