# Phase 0 Open Questions Log

## Open questions requiring owner and target phase

| ID | Question | Owner | Target phase | Approval required | Impact if unresolved |
|---|---|---|---|---|---|
| OQ-00-01 | Confirm exact minimum public pharmacy/lab disclosures that can remain pre-payment in Nigerian jurisdictions (beyond providerDisplayName). | Legal counsel | P00-08 / P00-12 | Legal + privacy review | Potential unlawful or unsafe disclosure assumptions |
| OQ-00-02 | Confirm whether initial telemedicine service in Lagos requires additional emergency routing or facility reporting obligations at platform launch. | Legal counsel | P00-12 | Legal / clinical policy approval | Launch eligibility and incident handling policy |
| OQ-00-03 | Define final successful-payment event that unlocks provider details and prove event parity with payment/refund/cancellation states. | Finance + security + engineering | P00-13 | Finance + security approval | Disclosure release risk and authorization bug |
| OQ-00-04 | Define payment custody model and explicit limits on wallet/credit exposure. | Finance owner + legal | P00-13 | Legal / finance approval | Compliance and operational risk |
| OQ-00-05 | Define exact sponsor/family/employer delegated actions that remain non-clinical even when payment authority exists. | Product owner + clinical + legal | P00-04 | Legal/clinical review | Clinical record leakage or rights overreach |
| OQ-00-06 | Confirm minor guardianship default across age transition and consent withdrawal policy for pilot. | Clinical lead + legal + privacy | P00-03 / P00-11 | Clinical + legal approval | Incorrect guardianship access control |
| OQ-00-07 | Confirm referral and critical-result escalation cadence for pilot clinical staffing model. | Clinical lead | P00-09 | Clinical approval | Patient safety workflow gaps |
| OQ-00-08 | Define initial list of rejected/blocked online medication categories vs restricted categories requiring manual escalation. | Clinical lead + operations | P00-10 | Clinical approval | Pharmacies dispensing unsafe products |
| OQ-00-09 | Set provider-detail redaction depth for cache, map tiles, analytics, and error-reporting payloads. | Security + privacy + QA | P00-08 / P00-14 | Security approval | Residual privacy leakage after payment checks |
| OQ-00-10 | Confirm scope of dashboard metrics and forbidden analytics dimensions for launch. | Product + privacy + engineering | P00-15 | Product + privacy approval | Privacy/compliance incident in analytics |
| OQ-00-11 | Confirm whether AGENTS/PLANS enforcement belongs to Phase 0 docs or Phase 1 bootstrap in current execution policy. | Execution lead | P00-00 | Architect + Product approval | Scope/cadence conflict in repo baseline |
| OQ-00-12 | Confirm if any prebuilt app skeleton exists externally that must be preserved rather than created. | Engineering lead | P00-00 / P01 | Engineering review | Merge risk and unnecessary rework |
| OQ-00-13 | Confirm whether synthetic browser fixtures should be single-source or per-workflow for privacy tests. | QA + engineering | P00-14 | QA/engineering approval | Test ambiguity in later deterministic suites |
| OQ-00-14 | Confirm retention periods for sensitive clinical and payment artifacts before implementation lock. | Legal/clinical/DPO | P00-11 | Legal/clinical/privacy approval | Invalid retention policy and legal non-compliance |

## Source conflicts requiring explicit external decision

| Conflict | Why it matters | Recommended handling |
|---|---|---|
| Build map recommends creating `AGENTS.md`, `.agent/PLANS.md`, repo bootstrap items during or before Phase 0. | Direct conflict with current explicit constraint to keep Phase 0 documentation-only and no scaffold execution now. | Apply prompt-pack and complete-breakdown precedence; defer any repository bootstrap artifacts to Phase 1 |
| Build map suggests dependency installs in repository setup guidance. | Phase 0 and current request scope require no installs in this phase. | Defer all install/config to Phase 1 browser/e2e setup. |
| Complete breakdown issue numbering differs from prompt pack at the P00-01 baseline layer. | Can create wrong sequencing and ownership if not reconciled. | Treat `P00-00` in prompt pack as including complete-breakdown P00-01 baseline governance work. |
