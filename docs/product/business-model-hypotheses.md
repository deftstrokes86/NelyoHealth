# NelyoHealth Business Model Hypotheses

## Document control

- Document: Business model hypotheses for P00-01
- Codex prompt ID: **P00-01**
- Complete Breakdown package: **P00-02**
- Issue ID: **P00-PRD-001**
- Review state: **BUSINESS MODEL HYPOTHESIS**
- Last updated date: **2026-06-23**
- Owner role: **Product + Finance + Legal + Clinical liaison**

## Governing assumptions

- Clinical workflow quality must remain primary.
- All commercial mechanisms are exploratory and are not approved rates or final policy.
- Revenue decisions do not override clinical pathways, safety, or locked disclosure/information rules.

## Hypotheses

| Hypothesis ID | Customer / payer | Value exchanged | Possible revenue mechanism | Major cost drivers | Regulatory or contractual dependency | Operational dependency | Privacy or clinical-safety risk | Incentive risk | Pilot validation method | Evidence required | Current status | Approval authority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BM-01 | Patient (direct payer) | Access to a coordinated care loop | Consultation platform fee (per completed loop) | clinician availability, app operations, customer support | consumer protection, provider engagement terms | stable booking + consultation orchestration | risk of paywalling essential care | incentivized over-scheduling | conversion and completion of consult-to-care loops | completed loops, incident rate, support volume | PROPOSED | Product owner (commercial), Legal review (for payment terms), Clinical lead |
| BM-02 | Provider (doctor or clinic) | Order intake and appointment matching | Provider transaction/fulfilment fee on eligible paid orders | transaction processing, scheduling infra, support | platform-provider agreements, licensing posture | provider onboarding + availability controls | clinical pressure to overrecommend | over-service and overtesting | monitor repeat unnecessary referrals/duplicate orders | provider utilization quality, complaint rate, audit traces | PROPOSED | Product owner + Clinical lead |
| BM-03 | Pharmacy partner | Order release + logistics coordination | Pharmacy fulfilment fee or spread handling fee | inventory risk, logistics, verification operations | pharmacy agreements, logistics compliance | reliable geospatial and address mapping controls | risk of revealing protected location data pre-payment | over-fulfilment pressure | percentage of successful closed pharmacy orders | cancellation/fulfilment mismatch rates, no pre-payment leakage | PROPOSED | Operations lead + Security + Legal counsel |
| BM-04 | Laboratory partner | Test order intake and result return | Laboratory fulfilment fee per processed package | reagent and lab processing costs, turnaround infrastructure | laboratory regulatory alignment and chain-of-custody agreements | sample lifecycle tracking and result dispatch | diagnostic data handling and delayed-result handling | rushed test ordering | critical/urgent test pathways and turnaround variance | OOS, turnaround, critical-result acknowledgment logs | PROPOSED | Clinical lead + Legal counsel |
| BM-05 | Logistics provider / delivery partner | Last-mile pickup and delivery | Delivery coordination fee | routing, dispatch tools, delivery exceptions | courier transport regulations and insurance | route handling, failed-delivery handling | location leakage during pre-payment and support views | delay-based gaming or unsafe prioritization | on-time delivery within accepted windows | delivery attempt logs, retry handling, incident rate | PROPOSED | Operations lead + Security lead |
| BM-06 | Employer | Covered employee care pool | Employer contract fee for cohort or capped access rights | support desk, account controls, claims workflow | employment payment law and payroll integration | onboarding and employee mapping | employee privacy leakage in aggregate reporting | over-capping care or coercive usage | employer pilot with selected cohorts | auditable reports and complaint trend | PROPOSED | Product owner + Legal counsel + Finance owner |
| BM-07 | HMO | Network management and utilization workflows | HMO administration fee + per-member transaction management | provider vetting, claims adjudication support | insurance/managed-care and claims regulation | claims state machine and authorization flow | denied access requests becoming unsafe delays | denial optimization vs care delays | authorized HMO pilot with explicit exclusion states | exception queue health, denied/approved ratio | PROPOSED | Legal counsel + Clinical lead + Finance owner |
| BM-08 | Provider network | Access to platform infrastructure and visibility | Provider subscription (tiers by feature scope) | support, trust, uptime, feature modules | provider licensing and marketing rules | training and onboarding pace | incentive conflict between access and quality | ranking bias, self-referral risk | cohort with opt-in provider controls | referral quality, patient outcome consistency | PROPOSED | Product owner + Legal counsel |
| BM-09 | Care coordination operators | Management of multi-step loops and escalations | Care-coordination fee per active case | staffing and escalation tooling | operations agreements | support queue maturity and escalation scripts | missed escalation due to poor queue quality | case-closure pressure to reduce costs | time-to-closing high-risk exceptions | exception age, closure completeness, escalation handoff quality | PROPOSED | Operations lead + Clinical lead |
| BM-10 | Family-plan structures | Multi-member care management services | Family-plan administration fee | account governance and reporting | guardianship/commercial policy, consent law | family membership lifecycle management | unauthorized access by family admin | dependency misrepresentation | family cohort retention and safety audit | guardian relationship integrity metrics | PROPOSED | Product owner + Privacy counsel + Legal counsel |
| BM-11 | Diaspora sponsorship | Cross-border support for specific patients | Diaspora sponsorship service fee | compliance tooling, support, reconciliation | cross-border payment and currency controls | payout timing and currency reconciliation | family identification inference and remittance leakage | sponsor-driven selection bias | sponsored-care pilot conversion and satisfaction | reconciliation success and privacy compliance checks | PROPOSED | Finance owner + Legal counsel |

## Analysis notes

All hypotheses are provisional until approved. None are final commercial commitments.

### Common clinical incentive risks (must be mitigated for all hypotheses)

- overprescribing,
- overtesting,
- biased provider ranking,
- self-referral,
- patient steering toward higher-fee providers,
- claim inflation,
- hidden provider charges,
- platform revenue pressure conflicting with clinical judgment.

For each hypothesis, mitigation includes explicit workflow thresholds, audit tagging, and exception escalation.

## Controls and labels

- Hypothesis items above are **PROPOSED** commercial assumptions.
- Any statement that can alter clinical access or data minimization is marked with legal, regulatory, or clinical review requirements.
- No hypothesis here implies that clinical order quality is improved only by increased fees.

## Required review mapping

Each hypothesis requires review at least from:

- Product owner (business validity),
- Clinical lead (clinical safety),
- Finance owner (commercial and payout risk),
- Legal counsel where licensing/contractual or cross-border behavior is implicated,
- Privacy counsel for data minimization implications.

## Open questions to resolve before locking

The following are not part of P00-01 implementation decisions and remain unresolved:

- approved minimum fee bands and caps,
- whether any fee element is restricted by Nigerian law for telehealth or pharmacy interfaces,
- acceptable minimum volume for safe model activation.

