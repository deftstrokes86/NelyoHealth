# Design Note — Break-glass WRITE policy & unidentified-patient ("John Doe") registration

Status: **DESIGN NOTE / OPTIONS ON PAPER** (roadmap M6.3b). NOT a decision, NOT implemented.
Directed by Chief Architect review of M6.3. The decision + implementation are a later milestone
(tracked; trigger: **before emergency/acute-care workflows ship**).

## Why this note exists

M6.3 / ADR-0011 excludes the `emergency-care` purpose from patient-profile WRITES — correct for that
resource (break-glass is a read affordance there; an ER clinician does not need to edit demographics
under emergency). But that exclusion **must not silently become the platform default**: an emergency
clinician under an active break-glass grant legitimately needs to *write* clinical resources, and may
need to *create* a record for a patient who cannot yet be identified. Two questions must be answered
deliberately, per resource, before acute-care workflows exist.

## Question 1 — Which resource WRITES may break-glass open?

Break-glass currently bypasses consent/ReBAC only when `purpose == emergency-care` (evaluator
`emergencyBypass`). Whether that bypass reaches a given WRITE is governed entirely by whether that
resource's write rule lists the `emergency-care` purpose. So the policy is expressed rule-by-rule.

| Resource write | Emergency write legitimate? | Recommended posture |
|---|---|---|
| consultation note / encounter documentation | **Yes** — you must record what you did | Permit under break-glass (`emergency-care` on the write rule), encounter-linked, time-boxed |
| prescription (issue) | **Yes** — emergency meds | Permit under break-glass, with the grant's short TTL + mandatory justification |
| lab order (place) | **Yes** — emergency diagnostics | Permit under break-glass |
| medical-record entry (append) | **Yes** — clinical findings | Permit under break-glass (append-only; amendments stay non-emergency) |
| patient-profile demographics (update) | **No** | Keep excluded (ADR-0011) |
| record amendment / void / cancel / administrative | **No** | Keep excluded — not an emergency need |

**Principle:** break-glass opens **append-only clinical documentation writes** that emergency care
produces, never administrative mutation or correction. Every such write already emits its own audit
event with `breakGlassActive` + the justification reference, so the emergency write is fully traced.
This is a **per-rule** decision (add `emergency-care` to the specific write rules), never a global flag.

## Question 2 — The unidentified-patient ("John Doe") registration flow

The M6.3 create path gates on identity resolution (dedup): an unidentified emergency patient cannot
present a resolvable identity, so they cannot pass it. Options:

- **Option A — Temporary identity + deferred resolution + later merge (recommended).**
  Registration mints a **provisional identity** (a `john-doe` provenance profile) under a break-glass /
  emergency-registration capability, explicitly flagged `identity-unverified`, with dedup **deferred**
  (not skipped — recorded as "deferred, reason: emergency"). Care proceeds; all clinical writes attach
  to the provisional patient ref. When the patient is later identified, an **identity claim/merge**
  reconciles the provisional ref into the verified identity, re-pointing (or linking) the clinical
  records, with **full audit continuity** (a merge event records both refs; nothing is rewritten
  silently). This matches the existing identity claim/link flow direction from ADR-0011.

- **Option B — Pre-created "unknown patient" pool per facility.** A fixed set of placeholder patients
  reused per encounter. Rejected: collides across concurrent John Does; muddies audit; merge is worse.

- **Option C — Block registration; document against the encounter/organization only.** Rejected:
  clinical records with no patient anchor break every downstream projection + the care-circle model.

**Open sub-questions for the decision milestone:** which capability authorizes emergency/provisional
registration; the merge conflict rules (same provisional claimed by two identities); how consent
bootstraps for a provisional identity (deferred until identified vs. an emergency-scope grant); and
retention/expiry of never-claimed provisional identities.

## What this note is NOT

Not a decision and not implemented. It puts the options on paper so the eventual milestone
(break-glass write policy + John-Doe registration) starts from a shared frame. The M6.3 structural
exclusion stands for patient-profile until that milestone revisits it per-resource.
