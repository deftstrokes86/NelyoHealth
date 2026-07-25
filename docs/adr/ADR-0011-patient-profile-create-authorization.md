# ADR-0011: Patient-profile CREATE is a distinct decision kind (capability + workspace + identity), with atomic consent/relationship bootstrap

## Status

ACCEPTED (roadmap M6.3 — Patient-Profile Write Authorization). Directed by Chief Architect review.

## Date

2026-07-25

## Decision owner

Architecture owner (Lead Platform Engineer), under Chief Architect direction.

## Context

M5.1 gated patient-profile READS through the composed pipeline (consent + ReBAC + break-glass) with
decide-before-load, but profile WRITES were transactional/audited yet **ungated**. M6.3 closes that.
UPDATE is straightforward — the patient exists, so it composes the full pipeline exactly as reads do.
CREATE is not: the subject does not exist yet, so **consent is definitionally absent, not "missing."**
Routing CREATE through the consent-gated pipeline would deny every registration with `consent-missing`.

The tempting fix — a `consent-missing → allow if action == create` branch inside the generic
evaluator — is rejected: it would weaken default-deny for **every** resource and make the consent
invariant conditional. The real invariant to protect is not "consent exists before create" but
**"no profile ever exists without governing consent/relationship rows."**

## Decision

**1. CREATE is a distinct decision kind.** `evaluatePatientProfileCreateAuthorization` authorizes a
registration on inputs that CAN exist before the patient does:

- **capability** — an RBAC `create-profile` rule for the actor's role (patient self, guardian,
  clinician, organization-admin);
- **workspace** — same tenant + active session;
- **purpose** — permitted by the matched rule.

It **never consults the consent store**. Default-deny holds unchanged: an unmapped capability denies
(`rbac-policy-unmapped-deny-default`). The consent-gated pipeline (`evaluateAuthorizationPolicyDecision`)
is left completely untouched — no create branch, no weakened default-deny.

**2. Ordering is DECIDE → DEDUP → BOOTSTRAP.** Identity resolution reads identity data, so it runs
**after** the authorization decision — an unauthorized caller is denied (and audited) before any
identity lookup executes (proven by a fake-pool unit test asserting no identity query runs on deny).

**3. Identity resolution is the create-specific hard gate, and its response is non-enumerating.**
Principle 1 dedup (existing profile for the person/org, or an identifier already owned) substitutes
for the consent check as the "hard" gate. On a probable match the caller receives a generic
`possible-existing-identity → identity-claim-or-link` outcome carrying **no matched identifiers or
attributes**; the full match detail is written to the **audit event only**.

**4. CREATE atomically bootstraps the governing rows it will need** — in the same transaction as the
profile (state + outbox + audit + bootstrap), so the invariant holds by construction:

- **self-registration** (actor == subject): profile + explicit consent, provenance `self-registration`;
- **org-registration** (front desk / walk-in): profile + consent grant to the creating org (treatment
  scope), provenance `captured-at-registration` — the org's ongoing access then DERIVES from that
  grant like any other (revocable, dashboard-visible), never a "we created it, we own it" rule;
- **guardian-mediated** (newborn / dependent): profile + guardian relationship (ReBAC) + guardian-
  granted consent, provenance `guardian-granted`.

Consent provenance is recorded on `consent_version.provenance` (migration 0023). Everything after the
creating transaction flows through the normal pipeline unchanged — no post-create read needs a
special case.

**5. Break-glass cannot open a profile WRITE.** No `create-profile` / `update-profile` rule carries
the `emergency-care` purpose, and the evaluator's emergency bypass requires `purpose ==
emergency-care`. So break-glass (an emergency READ affordance) structurally cannot bypass consent for
a write. Proven by test, not just rule inspection.

## Alternatives considered

- **`consent-missing → allow on create` branch in the generic pipeline.** Rejected: weakens
  default-deny for every resource; makes the consent invariant conditional.
- **Consent-first registration** (capture consent keyed to person/org before the profile). Rejected
  for M6.3: consent is keyed by `patientId`, which does not exist until create — a larger model change.

## Invariants preserved

No-PHI in events/audit; atomic state/outbox/audit; **default-deny** (unmapped create capability
denies); context isolation (soft refs); immediate revocation propagation (update reads live consent);
append-only auditability — and denied/dedup-hit creates are audited like any other decision.

## Consequences

- Positive: registration works without weakening the consent invariant; the "no profile without
  governing consent/relationship" invariant holds by construction; org access is an ordinary
  revocable grant; identity existence is not disclosed.
- Negative / follow-ups: deny-audit persistence is currently implemented for profile writes only —
  generalizing it across all operational writes is M6.3b. Bootstrap consent scopes are minimal named
  constants; a real notification-preference / consent-capture UX will refine them. A patient later
  claiming a self-identity a facility pre-registered goes through the identity claim/link flow.

## Related documents

`docs/adr/ADR-0010-event-consumer-projection-pattern.md`,
`docs/architecture/patient-profile-write-authorization-hardening.md`,
`docs/architecture/architecture-evolution-report.md`.
