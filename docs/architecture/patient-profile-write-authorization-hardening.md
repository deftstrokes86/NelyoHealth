# Patient Profile Write-Authorization Hardening — Plan

Status: **Planned** (opened in M5.2; implementation targeted for a dedicated hardening milestone)
Owner: Lead Platform Engineer

## Context

M5.1 gates patient-profile **reads** through the full composed pipeline (consent +
ReBAC + break-glass) with the decide-**before**-load discipline. Profile
**writes** (`createPatientProfile`, `updatePatientProfile`) are transactional and
fully audited/actor-attributed, but they are **not yet** gated by the composed
pipeline — any caller with a `CommandActor` can invoke them.

M5.2 established the missing half of the pattern on a different resource:
`bookAppointment` is a **decide-before-write** operation — it composes the same
pipeline (`resolveAndDecideResourceAccess`, `requestedAction: "book"`) and only
mutates state on an `allowed` decision. That is the template to port to profile
writes.

## Goal

`createPatientProfile` and `updatePatientProfile` should decide access through the
same shared `resource-authorization` composition **before** any state change, so
that write authorization is governed by consent / ReBAC / break-glass exactly as
reads are — no bespoke, weaker write path.

## Shape of the change

1. **Register write actions in the PDP.** `patient-profile` already has
   `update-profile` rules for `patient` (self) and `clinician`. Add the rules that
   should be able to *create* a profile — typically `organization-admin` /
   `clinician` under a `patient-administration` or `care-delivery` purpose — so the
   RBAC dimension has a mapping to match (otherwise every write default-denies).

2. **Thread an access context into the write commands.** Give
   `CreatePatientProfileInput` / `UpdatePatientProfileInput` an
   `access: ResourceAccessRequest`-shaped context (mirroring
   `AppointmentAccessContext`), then, before running the transactional command:
   ```
   const decision = await resolveAndDecideResourceAccess(pool, {
     ...access, requestedResource: "patient-profile", requestedAction: "update-profile"
   });
   if (decision.status !== "allowed") return { status: "denied", decision };
   ```
   Keep the mutation inside the existing transactional command so state + outbox +
   audit stay atomic. Decide-before-write means the decision precedes the command.

3. **Self vs. administrative create.** Profile *creation* is often an
   administrative/registration act (org staff, or the registration flow) rather
   than patient-subject-gated. Decide the policy explicitly:
   - **Self-service update** by the patient → subject = self, `requiresRelationship
     = false`, consent required (as reads are today).
   - **Administrative create/update** by org staff/clinician → subject = the
     patient, gated by RBAC + tenant + (optionally) an active care relationship.
   The composition already supports both via the request fields; the milestone
   only needs to choose the right context per caller.

4. **Break-glass on writes.** The emergency override already applies to any
   composed decision. Confirm whether emergency *writes* to a profile are ever
   legitimate; if not, gate writes with `emergencyStatus: "none"` in the context so
   break-glass cannot open a write path (it is an emergency *read* affordance).

## Invariants preserved

No change to: no-PHI-in-events, atomic state/outbox/audit, default-deny (an
unmapped write action denies), context isolation, immediate revocation
propagation (writes read the same live dimensions), append-only auditability.

## Test additions

- Pure: `decidePatientProfileAccessFrom(..., "update-profile", ...)` matrix
  (self-update allowed with consent; denied without; admin create allowed by RBAC).
- Integration: an unauthorized `updatePatientProfile` is denied and writes nothing;
  an authorized one commits state + event + audit.

## Why deferred (not in M5.2)

M5.2's scope is the Appointment resource. Porting profile writes touches M5.1's
committed public API (`Create/UpdatePatientProfileInput`) and the registration
call sites, so it belongs in a focused hardening milestone rather than riding
alongside a new resource. The pattern and shared machinery it needs
(`resolveAndDecideResourceAccess`, decide-before-write) now exist and are proven by
`bookAppointment`.
