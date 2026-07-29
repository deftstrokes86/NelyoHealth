# ADR-0014: HTTP trust boundary — two-tier PEP, non-enumerating error translation, the trust seam, and the self-access decision kind

## Status

ACCEPTED (roadmap M7 — HTTP surface, first slice). Plan reviewed and approved with rulings and two
additions, all folded in below.

## Date

2026-07-28

## Context

Through M6 every roadmap resource was **service-layer only** — no transport. The M2.3 NestJS runtime
already provided the platform trust-boundary machinery (a global PEP guard, the ActingContext resolver,
session auth, the request-context / idempotency middleware, an OpenAPI drift gate, and an endpoint
coverage gate). M7 is the **first time a roadmap domain resource — real patient data with
non-enumeration and deny-uniformity semantics — crosses the HTTP boundary**. The first slice exposes
the existing read surfaces (timeline, care circle, notifications inbox) plus the appointment booking
loop. The risk the whole milestone turns on: the non-enumeration and deny-uniformity work either
survives contact with a router or quietly dies.

## Decision

### 1. Two-tier PEP — defense in depth, not duplication

Authorization is enforced at two tiers that do not overlap:

- **Edge PEP (the global Nest `AuthorizationGuard`)** — PLATFORM tier, coarse: is this a valid,
  non-revoked session, in a valid workspace/persona, meeting the route's `@Authorize()` requirement?
  It resolves the ActingContext and gates on platform facts. It does **not** evaluate consent /
  relationship / break-glass, and it is **not** the audited resource decision.
- **Service PEP (`resolveDecideAndAuditAccess` / `decideSelfAccessAndAudit`)** — RESOURCE tier, the
  single authoritative + audited decision. The controller is a **thin translator**: build the access
  context → call the service → map the outcome to HTTP. No resource-authz logic lives in controllers or
  the guard.

The resource decision needs request intent that only exists at the handler, must emit its audit exactly
once (the service owns that), and must remain the one source of truth so HTTP and any future transport
agree. The edge tier is genuine defense in depth (it sheds unauthenticated / expired / tenant-invalid
traffic before it reaches a service), not a second copy of the resource policy that could drift.

### 2. Non-enumerating error translation (404-uniform, reads AND writes)

A two-tier error model:

- **Platform tier (guard):** `401` challenge-required (recoverable) vs `403` denied. Safe to
  distinguish — these are SESSION facts and reveal nothing about resource existence.
- **Resource tier (controllers):** every resource-scoped **denied AND not-found** collapses to ONE
  canonical **`404 RESOURCE_UNAVAILABLE`** with a byte-identical body — for reads and writes alike (a
  denied `POST /appointments/:id/cancel` is a 404, not a 403). This **deliberately deviates from REST
  convention**: a 403-on-a-specific-id or a "not found" message leaks existence. The true
  allowed/denied/not-found distinction lives **only in the server audit trail**, which is where it
  belongs. This is load-bearing because some service write paths return `not-found` *before* the access
  decision (reschedule/cancel), so an unauthorized actor can reach `not-found` internally; the edge
  collapse is what closes that channel over HTTP.
- **Write state conflicts** (`slot-unavailable`, `not-cancellable`) → **`409 STATE_CONFLICT`**,
  reachable **only after authorization passes** — so surfacing the state-machine reason never leaks
  state to an unauthorized actor (the HTTP image of the M6.4 "authz before validity" invariant).
- **Malformed input** (a tampered timeline cursor) → uniform **`400 VALIDATION_FAILED`**, never a 500.

The hardened `ApiExceptionFilter` emits the canonical `code` (+ optional `details`) from the exception
payload rather than a bare `HTTP_${status}`, so the 404s are identical regardless of the internal
reason.

### 3. The trust seam — server-derived vs. client-intent

`buildResourceAccessContext(actingContext, intent)` maps the guard-resolved ActingContext to the
service access context. The discipline:

- **Server-derived, never client-trusted:** actor id (account), actor role/type (persona → mapping),
  organization (validated active tenant), session status, and — critically — **"self"** (is the actor
  the data subject), computed from the server-resolved identity link (`personId === subject`), **never**
  from a client-supplied ref compared to itself.
- **Client-supplied request intent, each gated downstream:** the subject `patientRef` (path), purpose.
- **Break-glass is never a request header** — `emergencyStatus` is fixed `none`; emergency access flows
  only through the existing audited break-glass mechanism.

### 4. The self-access decision kind (consent is inapplicable, not "missing")

Wiring the read services to real sessions surfaced that the M4–M6 model is patient+org-consent-scoped
with **no self-access path** — a personal-workspace patient could not read their own timeline
(`consent-missing`). The resolution (a distinct decision kind, mirroring ADR-0012's classification):

> **Self-access is not consent-mediated, because consent is the machinery of *delegation*.** A consent
> grant gives an *other* access to the subject's data. A data subject reading their own record delegates
> nothing — there is no grantor/grantee pair — so consent is **definitionally inapplicable**, not
> "missing".

`evaluateSelfAccessAuthorization` authorizes on **verified identity + patient persona in a personal
workspace + a valid session**; consent, relationship, and break-glass are **not inputs**. It is:

- **routed at classification time** (the seam computes `subjectIsSelf`; the service selects the kind) —
  never a `consent-missing → allow if self` branch inside the consent evaluator;
- **server-verified** — the actor==subject linkage is a server fact, never a client claim;
- **audited** through the same decide-and-audit wrapper (kind: self), uniformly with every decision;
- **restriction-hooked** — a `restriction` input (default `none` = allow) leaves room for
  guardian-mediated minors (that is ReBAC, *not* self — it does not route here) and jurisdictional
  clinical withholds to arrive as *policy*, not a redesign.

The **invariant**, tested end-to-end: *a patient who withdraws every consent grant still reads their own
record.* For a self reader the timeline's per-domain filters resolve through self-scope (all domains
visible, incl. messaging); a care-circle member reading the same patient still flows through the consent
pipeline unchanged (M6.5's decision-kind-per-domain rule holds).

### 5. Response DTO discipline (success payloads, not just errors)

Every endpoint maps service output through an **explicit response DTO built field-by-field** (the shared
`create*Dto` allowlist constructors in `@nelyohealth/api-client`) — never a spread or pass-through of an
internal object. Internal fields (decision metadata, cross-context soft refs, projection timestamps,
gateway/retry state) cannot leak by omission. Enforced by an integration assertion that response bodies
contain **only the declared DTO fields** and **none of the forbidden PHI-ish key fragments** — the HTTP
sibling of the event/audit sentinel scan.

### 6. Rate limiting + degradation, and edge hygiene

- **Tiered limiter before the guard:** strict per-IP on `/api/auth/*` (brute-force/enumeration surface),
  moderate per-session elsewhere. **Valkey-backed** (shared across instances) via a dependency-free RESP
  client, with a **conservative in-process fallback**: when Valkey is unreachable the `ResilientRateLimiter`
  degrades to in-process limiting and logs the transition — it **never fails open (unlimited) and never
  hard-fails (500)**. `429` carries `Retry-After` and a uniform body (the limiter must not be an oracle).
- **Baseline security headers** (dependency-free helmet-equivalent: nosniff, DENY framing, no-referrer,
  same-origin CORP) and a **locked CORS allowlist** (known origins, not `*`).
- **Cursor validation:** a tampered timeline keyset cursor is a uniform `400` — it can only re-window the
  caller's own already-authorized read (the subject comes from the access context, never the cursor).

### 7. Typed client contract

`packages/api-client/src/http/` holds the request/response DTOs + error envelope the web shells consume.
The controllers construct every response through the matching `create*Dto`, so server and client cannot
drift. (It lives under a subdirectory, intentionally outside the api/api-client module-parity gate,
which scans top-level only.)

## Scope & follow-ups

- **In:** timeline / care-circle / notifications reads + the self appointment booking loop
  (book/read/reschedule/cancel), all over the existing Nest runtime.
- **Delivered (M7.1):** the first patient web shell (reads-first dashboard: persona, timeline,
  notification inbox with mark-read, appointments list + cancel) + `GET /api/me/appointments`
  (self-kind list, keyset-paginated).
- **Delivered (M7.2):** cross-patient capacity resolution — a caregiver/guardian reaches a consented
  patient's read surfaces via a capacity derived from the relationship graph (guardian +
  caregiver-delegation; deterministic multi-org tie-break; delegated-access audit).
- **Deferred (named slices):**
  - **Sponsor cross-patient capacity** — deferred from M7.2 to the **billing/payment slice**, where
    sponsor's financial-only scope (`billing-ledger`, `payment-status`) is exposed and its
    cross-patient visibility can be designed on purpose (the diaspora trust core), not inherited.
  - **Slot discovery / availability search** — the read surface a patient books/reschedules against
    (search open availability by provider/time/facility). Its absence is why M7.1 shipped
    appointment *view + cancel* but not *book/reschedule* from the UI. Scope: an availability query
    endpoint + its own DTO/paging, plus the org-persona `openAvailabilitySlot` write path (its own
    slice with org-workspace testing).
  - Additional relationship types (`household`, `clinical-proxy`) as each is deliberately modelled;
    the remaining resource controllers; durable idempotency with response replay; the other web shells.

## M7.1 addendum — the patient web shell, the BFF, and CSRF

The patient web shell (Next.js) consumes this API through a **typed client**
(`createPatientApiClient`, in `@nelyohealth/api-client/http`) — server components read
with it; nothing does raw `fetch`. Two disciplines make the shell safe:

- **The BFF is a proxy, not a translator.** Browser mutations go through Next.js BFF
  route handlers (sign-in/out, mark-read, cancel) that forward to the Nest API via the
  typed client and **pass the `ApiEnvelope` + status straight back** — no reshaping of
  error bodies, no remapping the uniform 404 into a richer client error, no retries.
  The non-enumeration and DTO guarantees were earned at the Nest edge; the BFF must be
  incapable of undoing them. `401 → redirect to sign-in` is the single exception. The
  shell closes the loop by rendering **404 identically to empty/absent** — it never
  distinguishes denied from not-found, and holds no authorization logic of its own.

- **CSRF on BFF mutation routes.** Moving auth from a bearer header to an HttpOnly
  cookie reintroduces CSRF (the browser attaches the cookie automatically). Defense is
  two-layer: the session cookie is already **`SameSite=Lax`** + `HttpOnly` + `secure`
  in production (confirmed in `session-cookie.ts`), and every BFF mutation route runs an
  **origin check** (`Origin`, falling back to `Referer`, must match `Host`; neither
  present ⇒ reject) returning a uniform 403. Reads (server components) don't need it —
  they never rely on ambient browser cookies. Established now, before the portal grows,
  because retrofitting it across a grown surface is far costlier.

## M7.2 addendum — cross-patient capacity resolution

A Care Circle member (caregiver/guardian) reaches a **consented** patient's read
surfaces over HTTP by a capacity **derived server-side from the relationship graph** —
never a client claim, and never from the care-circle projection (a projection is
eventually-consistent DATA, forbidden as an authorization input; capacity reads the
authoritative `nelyo_relationship` table).

- **Capacity as input-supply, not new composition.** The resolver only chooses
  `actorRole` + `relationshipType` + `organizationId` (from the resolved relationship);
  the **unchanged** consent + ReBAC + break-glass pipeline then decides. The pipeline
  **re-loads the relationship live** for the decision, so a revocation between the
  resolver's read and the pipeline's read is caught — immediate-revocation propagation
  is preserved (proved: revoke → next read 404).
- **"Not self" is server-derived** (`identity.personId === subjectPatientRef`); the
  capacity is keyed by the server's `accountId`. A client controls neither, so it can
  forge neither self nor a caregiver capability.
- **The mapping is deliberately small** (default-deny for the rest): `guardian→guardian`,
  `caregiver-delegation→caregiver`. **`sponsor` is deferred** to the billing/payment
  slice — its RBAC is financial-only (`billing-ledger`, `payment-status`) with no
  timeline/care-circle capability, so it belongs designed with those surfaces, not
  inherited here. `household` / `emergency-contact` (break-glass territory) /
  `clinical-proxy` are excluded until modelled.
- **Deterministic selection.** When an actor holds several active relationships to a
  patient: highest tier first (guardian > caregiver); within a tier the
  **most-recently-effective wins** (the multi-org tie-break — two caregiver delegations
  at different facilities resolve to exactly one relationship, hence one org and one
  consent scope); `relationship_id` is the final stable tie-break. Nondeterministic
  capacity would be nondeterministic visibility.
- **The visibility invariant is untouched.** Once allowed, the existing per-domain
  filter runs unchanged — a caregiver sees consented domains and **messaging stays
  hidden** (participant/self-scoped; a caregiver is never a thread participant). M7.2
  changes only *whether the access decision allows*, not *what the filter shows*.
- **Non-enumeration holds.** No capacity ⇒ a non-privileged context the pipeline denies
  ⇒ a uniform 404, **indistinguishable from a non-existent subject** (a stranger and a
  bogus ref both 404 with identical bodies — proved).
- **Delegated access is audited.** An allowed cross-patient read writes an append-only
  audit (`delegated-access-granted`) recording the **selected relationship ref + derived
  actorRole** — so a caregiver's access is traceable to the capacity it ran under, not
  just "allowed". The same fields are attached to a deny-audit.

## Sanctioned-public routes (the allowlist is a security artifact)

Default-deny means every route is protected unless it appears in `SANCTIONED_PUBLIC_ROUTES` (the
endpoint-coverage gate). That list is security-relevant: an addition must be a **visible diff against
this documented set**, not a quiet gate exemption. The 10 sanctioned routes and why each legitimately
needs no principal:

| Route | Why public |
|---|---|
| `GET /api/health` | Liveness probe — no principal. |
| `GET /api/ready` | Readiness probe (dependency checks) — no principal. |
| `GET /api/health (hono)` | Legacy Hono liveness — no principal. |
| `POST /api/idempotency/probe` | Synthetic operational plumbing; no principal-scoped resource. |
| `POST /api/observability/probe` | Synthetic telemetry/correlation probe; no principal-scoped resource. |
| `POST /api/storage/signed-url/upload` | Synthetic storage scaffolding (synthetic objects); real document access is a protected business route. |
| `POST /api/storage/signed-url/download` | Same synthetic storage scaffolding. |
| `DELETE /api/storage/synthetic-objects` | Synthetic-only test-object cleanup. |
| `POST /api/auth/sessions` | Sign-in — necessarily pre-authentication (creating a session cannot itself require one), and non-enumerating by construction. |
| `POST /api/auth/registrations` | Sign-up — necessarily pre-authentication. |

None serve principal-scoped patient data; the storage/probe entries are synthetic scaffolding that a
later milestone replaces with protected business routes. A new `@Public()` route that is not added here
fails the gate (accidental exposure), and a stale entry (no longer `@Public()`) also fails — so the
debt cannot rot silently.

## Invariants preserved

Default-deny; non-enumeration (deny/not-found indistinguishable over HTTP); authz-before-validity (409
only post-authz); no PHI over the wire (DTO allowlist + forbidden-fragment scan); the projection/audit
model unchanged; the self-access decision is a decision (audited, restriction-hooked), not an
unconditional pass.

## Related documents

`docs/adr/ADR-0012-derived-authority-and-operational-write-authorization.md` (decision-kind
classification), `docs/adr/ADR-0013-timeline-activity-stream-projection.md` (the timeline read model
+ decision-kind-per-domain), `apps/api/src/nest/authorization/authorization.guard.ts` (the edge PEP),
`apps/api/src/nest/resource/resource-access-context.ts` (the trust seam),
`apps/api/src/authorization-policy-handlers.ts` (`evaluateSelfAccessAuthorization`).
