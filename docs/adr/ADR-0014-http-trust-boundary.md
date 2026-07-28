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
- **Deferred (M7.x):** the web-shell UIs; the other five resource controllers; `openAvailabilitySlot`
  (org-persona path — its own slice); durable idempotency with response replay; a Valkey-backed
  idempotency store; and **cross-patient capacity resolution** — deriving a caregiver/guardian actor
  role for a *non-self* subject from the relationship graph. Until then, a personal-workspace
  cross-patient read presents the persona capacity and is governed by the pipeline (a mismatch denies →
  404); org-workspace clinicians reach a consented patient today.

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
