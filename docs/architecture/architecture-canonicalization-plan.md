# NelyoHealth — Architecture Canonicalization Plan

## Document Control

| Field | Value |
|---|---|
| Document | `docs/architecture/architecture-canonicalization-plan.md` |
| Kind | Canonicalization execution plan (planning only — no document is modified by this plan) |
| Authority basis | `docs/architecture/architecture-evolution-report.md` (ACCEPTED) |
| Owner role | Principal Architect + Technical Governance Lead |
| Review state | PROPOSED |
| Version | 1.0 |
| Last updated | 2026-07-18 |
| Related documents | Platform Manifest; Platform Kernel Blueprint; Platform Glossary; Domain Glossary; ADR set; `docs/architecture/*` |

> **Scope discipline.** This plan changes nothing. It is the governed execution guide for the documentation updates that complete Architecture Canonicalization. Executing this plan — and only executing this plan — produces the single canonical architecture and enables Design Freeze. No new architectural concepts or abstractions are introduced here; every ruling below restates a decision already accepted in the Architecture Evolution Report.

---

# Executive Summary

## Accepted direction

The Architecture Evolution Report was accepted with the verdict **canonicalize, don't reconstruct**. The implemented system (authentication, multi-dimensional authorization, granular consent, append-only audit, tenancy with facility-scoped roles, the relationship graph, the transactional-outbox foundation, API-first tooling) is architecturally sound. The recently authored aspirational documents (Manifest, Kernel Blueprint, Glossary) over-specified persisted abstractions the platform does not need. The canonical architecture therefore adopts the **derive-don't-persist** posture: the code's proven primitives are the system of record; the aspirational concepts are retained as **derived** runtime concepts; the documents are corrected to match.

## Major decisions being canonicalized

1. **Runtime → long-lived containers** for the NestJS API and the worker; Supabase retained for managed Postgres + Storage (replaces the Edge-Functions posture recorded in P02-ISS-016).
2. **Workspace, Persona, and Care Circle are derived, not persisted.** Workspace = f(active tenant, persona kind); Persona = the actor-role capacity resolved from membership + relationship; Care Circle = a patient-centered read model over the relationship graph.
3. **Resource Registry and Capability Registry are removed** from the design (redundant with data classification + role definitions).
4. **The transactional outbox becomes the mandatory single path** for every state change: state + event intent + audit intent in one transaction; the dispatcher is the sole fan-out.
5. **The authorization policy is canonical as implemented** (`allowed | denied | challenge-required` over role × relationship × consent × session × emergency), to be made universally enforced; RBAC/ABAC remain descriptive vocabulary, not a re-implementation.
6. **A central Projection layer** (classification-driven redaction) and **Navigation/Dashboard declarative registries** are the only NEW kernel surfaces.
7. **Foundational ADRs 0005–0011 must be ratified**, and the video-transport decision (ADR-0009) must be made behind an Integrations port.

## Why these decisions improve the platform

They collapse two competing architectures into one; they eliminate needless persistence (fewer sources of truth, fewer consistency bugs, less migration surface); they preserve every proven, tested implementation; they make the Manifest's non-negotiables (context-aware action, consent-gated access, event emission) *enforceable by convention + CI gate* rather than aspirational; and they fix the one genuinely dangerous mismatch (a serverless runtime that cannot host a persistent dispatcher) before production deployment.

---

# Canonical Architecture

This is the single reference model. Every document update in this plan is evaluated against this section and nothing else.

## Persisted (systems of record — unchanged owners per `source-of-truth-matrix.md`)

- **Identity & Access:** Person, UserAccount, ExternalIdentity, Session, Device.
- **Patients & Relationships:** Patient/PatientProfile; the Relationship graph (guardian, household, sponsor, caregiver-delegation, clinical-proxy, emergency-contact) carrying `permittedActions`, verification, lifecycle, revocation.
- **Organizations & Facilities:** Organization/Tenant, Facility, OrganizationMembership, RoleAssignment (facility-scoped `roleScopes`).
- **Consent & Audit:** granular purpose-scoped ConsentGrant (11 consent domains); append-only AuditEvent store.
- **Domain contexts:** as owned in `domain-boundaries.md` (Scheduling, Encounters, Clinical Records, Prescriptions, Diagnostics, Marketplace/Matching, Pharmacy Fulfilment, Lab Ops, Referrals, Payments & Ledger, Plans & Coverage).
- **Kernel-owned:** the TransactionalOutbox table.

## Derived (computed at runtime — never persisted as authority)

- **ActingContext** — resolved per request from identity + session + declared persona + active tenant.
- **Persona** — the actor-role capacity (`AuthorizationActorRole`), validated against membership/relationship.
- **Workspace** — Personal (no active tenant) · Organization (active tenant) · Professional/Business (tenant sub-type).
- **Capability set** — the effective `permittedActions` resolved into the ActingContext.
- **Care Circle** — patient-centered read model over the relationship graph + active care contexts.
- **Timeline / Activity Stream** — projections over the event stream (per subject / per workspace).

## The one request lifecycle

`Authenticate → Resolve ActingContext → Authorize (single PDP: allowed | denied | challenge-required) → Execute (transactional command: state + outbox + audit in one TX) → Dispatch (worker: audit, notifications, projections, de-identified analytics)`.

Reads follow the same pipeline minus Execute/Dispatch and pass through the **Projection layer** (minimum-necessary, classification-checked redaction). Navigation and dashboards assemble by filtering **declarative registries** against the ActingContext's capabilities. There are **no** Resource or Capability registries.

## Runtime

NestJS modular monolith (API) + worker (outbox dispatcher, queue consumer) as **long-lived containers**; Supabase Postgres + Storage; managed Redis-compatible queue; observability with telemetry redaction; OpenAPI-first with typed client and drift gating.

**Precedence rule during execution:** where any existing document conflicts with this section, this section wins; the conflict is fixed in the document and recorded in the Canonicalization Changelog.

---

# Document Update Matrix

Scope: all architecture-governing documents — `docs/architecture/*` (9), root-level architecture docs (3), and the ADR set (18). **Every document appears exactly once (30 rows).**

Conventions: **Actions describe content-level changes.** The uniform Canonical Status Standard front-matter retrofit (see below) applies mechanically to *all* 30 documents regardless of action and is not counted as an UPDATE. No document receives DELETE (healthcare governance requires traceability; obsolete material is ARCHIVED with supersession pointers). No MERGE is required (the two-glossary division of authority was deliberately resolved as complementary, not merged — Glossary conflict C-12). No DEPRECATE is required (the only superseded document is fully ARCHIVED).

| # | Document | Action | Reason | Priority |
|---|---|---|---|---|
| 1 | `docs/platform-manifest.md` | UPDATE | Reword Workspace/Persona/Care Circle as first-class **concepts realized as derived models**; principles otherwise stand. | P0 |
| 2 | `docs/architecture/platform-kernel-blueprint.md` | UPDATE | Heaviest correction: thin kernel; remove Resource/Capability registries; derived context model; align PDP naming to `allowed/denied/challenge-required`; container runtime; mandatory outbox. | P0 |
| 3 | `docs/architecture/platform-glossary.md` | UPDATE | Mark Workspace/Persona/Capability/Care Circle/Timeline/Activity Stream as **derived**; delete Resource/Capability Registry entries; confirm Persona = actor-role capacity. | P0 |
| 4 | `docs/glossary.md` (domain glossary) | UPDATE | Minor: add division-of-authority cross-link (C-12); annotate any entries touched by the derived rulings. Content authority unchanged. | P1 |
| 5 | `docs/architecture/architecture-evolution-report.md` | ARCHIVE | Point-in-time decision record; once executed, its rulings live in the updated canon + changelog. Archived with Superseded-By pointers as historical evidence. | P2 (last step) |
| 6 | `docs/architecture/conceptual-domain-model.md` | UPDATE | Add the derived read models (Care Circle, Timeline, Activity Stream); verify diagrams use canonical vocabulary. | P1 |
| 7 | `docs/architecture/context-map.md` | UPDATE | Reflect the thin kernel, Projection layer, and Notification orchestration as cross-cutting/downstream elements; verify no contradictory flows. | P1 |
| 8 | `docs/architecture/domain-boundaries.md` | UPDATE | Largely correct; add ownership rows/notes for the Projection layer, Notification orchestration, and derived read models. | P1 |
| 9 | `docs/architecture/source-of-truth-matrix.md` | UPDATE | Add derived read models to the projection register; affirm no new persisted stores; reference the central Projection layer as the enforcement mechanism. | P1 |
| 10 | `docs/architecture/event-catalogue-draft.md` | UPDATE | Promote from draft to versioned baseline (rename to `event-catalogue.md` at freeze); add kernel events (context transition, policy decision audit); define the schema-freeze/versioning rule. | P0 |
| 11 | `docs/architecture/tenancy-concept.md` | KEEP | Already correct and matched by the implementation; the derived-Workspace ruling is consistent with it. | — |
| 12 | `docs/STATUS.md` | UPDATE | Minor: amend the P02-ISS-016 compute record with a supersession note pointing at the runtime ADR. | P0 |
| 13 | `docs/adr/ADR-0001-provider-detail-release-after-payment.md` | KEEP | Sound and implemented; untouched by canonicalization. | — |
| 14 | `docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md` | KEEP | Proposed wallet decision; orthogonal to this sprint. | — |
| 15 | `docs/adr/ADR-0003-codex-browser-validation.md` | KEEP | Process ADR; unaffected. | — |
| 16 | `docs/adr/ADR-0004-design-motion-and-content-governance.md` | KEEP | Design-governance ADR; unaffected. | — |
| 17 | `docs/adr/ADR-0005-modular-monolith-first.md` | UPDATE | Status only: ratify DRAFT → ACCEPTED. Content stands. | P0 |
| 18 | `docs/adr/ADR-0006-person-and-longitudinal-patient-identity.md` | UPDATE | Status only: ratify. | P0 |
| 19 | `docs/adr/ADR-0007-payer-and-clinical-access-separation.md` | UPDATE | Status only: ratify. | P0 |
| 20 | `docs/adr/ADR-0008-finalized-clinical-record-amendments.md` | UPDATE | Status only: ratify. | P0 |
| 21 | `docs/adr/ADR-0009-video-platform-decision-deferred.md` | UPDATE | Decision required: select transport behind an Integrations port, or record an explicitly scoped pilot-without-video deferral with the port contract. | P0 |
| 22 | `docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md` | UPDATE | Status only: ratify. | P0 |
| 23 | `docs/adr/ADR-0011-order-funding-secured-and-disclosure-separation.md` | UPDATE | Status only: ratify. | P0 |
| 24 | `docs/adr/ADR-P02-001-application-framework-and-dependency-pins.md` | KEEP | Accepted; unaffected. | — |
| 25 | `docs/adr/ADR-P02-002-database-access-and-migration-tool.md` | KEEP | Accepted; unaffected. | — |
| 26 | `docs/adr/ADR-P02-003-redis-compatible-cache-queue-and-worker-backplane.md` | KEEP | Accepted; production-posture review tracked separately. | — |
| 27 | `docs/adr/ADR-P02-004-object-storage-signed-url-adapter.md` | KEEP | Accepted; unaffected. | — |
| 28 | `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md` | UPDATE | Mark the Edge-Functions compute path **superseded by the runtime ADR**; IaC/provider record preserved. | P0 |
| 29 | `docs/adr/ADR-P02-006-observability-and-error-reporting-boundary.md` | KEEP | Accepted; vendor deferral tracked separately. | — |
| 30 | `docs/adr/ADR-index.md` | UPDATE | Reflect ratified statuses, the superseded compute path, and the five new ADRs. | P0 |

### New documents created during execution (not existing docs; listed for completeness)

| New document | Purpose |
|---|---|
| `docs/architecture/canonicalization-changelog.md` | Instantiated from the template in this plan (execution step 0). |
| `docs/adr/ADR-0012-runtime-and-compute-long-lived-containers.md` | The REPLACE decision; supersedes the compute portion of ADR-P02-005. |
| `docs/adr/ADR-0013-mandatory-transactional-outbox-emission.md` | Outbox as the single state+event+audit path, with CI gate. |
| `docs/adr/ADR-0014-derived-context-model.md` | Workspace/Persona/Care Circle as derived; registries removed. |
| `docs/adr/ADR-0015-central-projection-and-redaction-layer.md` | Classification-driven projection layer for all cross-context reads. |
| `docs/adr/ADR-0016-notification-orchestration.md` | Event-driven notification module over the outbox stream. |

---

# Detailed Update Plan

Entries appear in execution order within each phase. "Effort" is document effort only (S ≤ half day, M ≤ 2 days, L ≤ 5 days).

## D-1 `docs/platform-manifest.md` — UPDATE (P0)

- **Current purpose.** Governing principles and domain concepts for the whole platform.
- **Problems.** Presents Workspace, Persona, and Care Circle in language that implies persisted first-class entities; "first-class platform entities" (Care Circle) conflicts with the accepted derived model.
- **Required updates.** Targeted wording amendments only; no principle changes.
- **Rewrite.** Domain-object entries for Persona, Workspace, Care Circle → "first-class *concepts*, realized as *derived* context/read models over identity, tenancy, and relationships."
- **Remove.** Nothing.
- **Merge.** Nothing.
- **Preserve.** All six Principles, the Authorization Model, Consent Engine, Family/Diaspora/Activity-Stream/AI/Security principles, and all ten Architectural Rules — verbatim.
- **Effort.** S. **Dependencies.** ADR-0014 drafted (so the Manifest can cite it).

## D-2 `docs/architecture/platform-kernel-blueprint.md` — UPDATE (P0)

- **Current purpose.** Kernel execution blueprint (engines, lifecycle, registries, event model).
- **Problems.** Over-specifies: Resource/Capability registries; persisted-leaning Workspace/Persona; RBAC∧ABAC naming that shadows the implemented PDP; runtime silence that leaves the Edge-Functions posture unchallenged.
- **Required updates.** Rewrite to the thin kernel exactly as in *Canonical Architecture* above.
- **Rewrite.** §3 lifecycle (align PDP outputs to `allowed | denied | challenge-required`, keep obligations); §4–6 engines (explicitly derived; resolver unifies existing middleware + tenancy + actor-role); §10 event model (mandatory outbox, single dispatcher, audit as subscriber); add a Runtime section (containers).
- **Remove.** Resource Registry and Capability Registry (all references); any implication that Workspace/Persona/Care Circle are stored.
- **Merge.** Nothing inward; its corrected content becomes the single kernel reference.
- **Preserve.** Sequence diagrams (corrected labels), Navigation/Dashboard registry design, obligations model, completion criteria (renumbered), Manifest traceability.
- **Effort.** L (largest single rewrite). **Dependencies.** ADR-0012/0013/0014/0015 drafted; D-1 wording agreed.

## D-3 `docs/architecture/platform-glossary.md` — UPDATE (P0)

- **Current purpose.** Canonical platform language specification.
- **Problems.** Defines Resource/Capability Registries; Workspace/Persona/Capability/Care Circle entries read as persistable; Timeline/Activity Stream not marked derived.
- **Required updates.** Re-classify per the derived model; align implementation notes to the real code names (`AuthorizationActorRole`, `TenancyAccessDraft`, `permittedActions`).
- **Rewrite.** Entries: Persona, Workspace (all four kinds), Capability, Care Circle, Timeline, Activity Stream, Projection — each gains an explicit "**Derived — never persisted as authority**" line.
- **Remove.** Resource Registry and Capability Registry entries (moved to the changelog as removed concepts).
- **Merge.** Nothing (C-12 division of authority stands).
- **Preserve.** All other entries, Naming Rules, Reserved Terms, Conflict Register (append outcomes), product-mapping appendix.
- **Effort.** M. **Dependencies.** D-2 vocabulary settled.

## D-4 `docs/architecture/event-catalogue-draft.md` — UPDATE (P0)

- **Current purpose.** Draft conceptual event catalogue.
- **Problems.** "Draft, not a final message schema" conflicts with the freeze requirement; missing kernel events; no versioning rule.
- **Required updates.** Promote to the versioned baseline; rename to `event-catalogue.md` at freeze (old filename left as a pointer or redirect note per governance preference).
- **Rewrite.** Header/status; add the envelope + schema-versioning rule (frozen envelope, versioned payloads, additive-only within a version).
- **Remove.** Nothing (rows retain their approval states).
- **Merge.** Add kernel rows: ContextTransitioned, AuthorizationPolicyDecisionRecorded (audit), NotificationDispatched.
- **Preserve.** All EVT rows, taxonomy, exclusion columns.
- **Effort.** M. **Dependencies.** ADR-0013 drafted.

## D-5 ADR ratification batch — `ADR-0005, 0006, 0007, 0008, 0010, 0011` — UPDATE (P0)

- **Current purpose.** Foundational domain decisions.
- **Problems.** All `DRAFT-PENDING-DOMAIN-OWNER-AND-FOUNDER-APPROVAL`; a freeze cannot rest on undedecided foundations.
- **Required updates.** Status transition to ACCEPTED with reviewer sign-off recorded; no content changes anticipated.
- **Rewrite/Remove/Merge.** None. **Preserve.** All content.
- **Effort.** S each (governance time dominates). **Dependencies.** Owner/founder review session (single time-boxed sitting recommended).

## D-6 `docs/adr/ADR-0009-video-platform-decision-deferred.md` — UPDATE (P0)

- **Current purpose.** Records the deferral of the video/real-time transport choice.
- **Problems.** The Consultation encounter module cannot be production-built against a deferral.
- **Required updates.** Either (a) select the transport, or (b) convert the deferral into a scoped decision: pilot proceeds without video, and the Integrations **port contract** for real-time transport is specified now so the encounter module builds against the interface.
- **Rewrite.** Decision + consequences sections. **Remove.** Open-ended deferral language. **Merge.** None. **Preserve.** Options analysis.
- **Effort.** S–M (decision effort, not writing effort). **Dependencies.** Product/clinical input on pilot scope.

## D-7 `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md` — UPDATE (P0)

- **Current purpose.** Cloud/IaC/deployment record (currently: Supabase Edge Functions for API/worker).
- **Problems.** The compute path cannot host a persistent NestJS monolith + outbox dispatcher.
- **Required updates.** Mark the compute portion **Superseded by ADR-0012**; preserve provider, storage, IaC, and promotion-workflow records.
- **Rewrite.** Status + compute section only. **Remove.** Nothing (supersede, don't erase). **Merge.** None. **Preserve.** Everything else.
- **Effort.** S. **Dependencies.** ADR-0012 accepted. **Companion.** D-8 STATUS note.

## D-8 `docs/STATUS.md` — UPDATE (P0)

- **Current purpose.** Program status ledger.
- **Problems.** P02-ISS-016 records the now-superseded compute model as completed evidence.
- **Required updates.** Append a dated amendment note to the P02-ISS-016 line: compute model superseded by ADR-0012; original record preserved.
- **Effort.** S. **Dependencies.** ADR-0012 accepted.

## D-9 `docs/adr/ADR-index.md` — UPDATE (P0)

- **Current purpose.** ADR registry.
- **Required updates.** Ratified statuses (D-5), ADR-0009 outcome, P02-005 supersession, rows for ADR-0012–0016.
- **Effort.** S. **Dependencies.** All ADR actions complete.

## D-10 `docs/architecture/domain-boundaries.md` — UPDATE (P1)

- **Current purpose.** Bounded contexts, ownership, dependency rules.
- **Problems.** None structural; lacks the canonicalized cross-cutting elements.
- **Required updates.** Add: Projection layer as the enforcement mechanism for cross-context reads; Notification orchestration as a downstream module; derived read models (Care Circle, Timeline, Activity Stream) named as projections, with owning source contexts.
- **Preserve.** All context rows, ownership rules, dependency rules, transaction boundaries.
- **Effort.** S–M. **Dependencies.** D-2, ADR-0015/0016.

## D-11 `docs/architecture/source-of-truth-matrix.md` — UPDATE (P1)

- **Current purpose.** Canonical owners + redacted projection register.
- **Required updates.** Append projection-register rows: Care Circle view, Timeline, Activity Stream, ActingContext capability view; add a note that the central Projection layer (ADR-0015) is the single mechanism enforcing this register.
- **Preserve.** Everything else verbatim.
- **Effort.** S. **Dependencies.** ADR-0015.

## D-12 `docs/architecture/conceptual-domain-model.md` — UPDATE (P1)

- **Current purpose.** Conceptual entity model + diagrams.
- **Required updates.** Add derived read models with explicit "derived" styling in diagrams; terminology sweep against the corrected Glossary.
- **Preserve.** Entity structure.
- **Effort.** M. **Dependencies.** D-3.

## D-13 `docs/architecture/context-map.md` — UPDATE (P1)

- **Current purpose.** Context relationships map.
- **Required updates.** Add kernel (thin) as cross-cutting; Projection layer on read paths; Notifications as outbox subscriber; diagram-consistency check against D-2's lifecycle.
- **Effort.** S–M. **Dependencies.** D-2, D-10.

## D-14 `docs/glossary.md` — UPDATE (P1)

- **Current purpose.** Domain-entity + data-classification glossary (P00-06).
- **Required updates.** Minor: cross-link the division of authority (C-12); annotate Persona/Workspace-adjacent entries if present; no entity-definition changes.
- **Effort.** S. **Dependencies.** D-3.

## D-15 `docs/architecture/architecture-evolution-report.md` — ARCHIVE (P2, final step)

- **Current purpose.** The accepted decision record driving this plan.
- **Required updates.** After D-1…D-14 land: set Status = Superseded, Superseded-By = the updated canonical set + changelog; move under `docs/architecture/archive/` (or equivalent convention) with pointers both ways. Content untouched.
- **Effort.** S. **Dependencies.** Everything above complete.

## Execution order

- **Phase 0 (gate-setting):** instantiate the changelog; draft ADR-0012–0016; run the D-5 ratification sitting; decide D-6.
- **Phase 1 (P0 canon):** D-7, D-8, D-9 → D-1 → D-2 → D-3 → D-4.
- **Phase 2 (P1 alignment):** D-10 → D-11 → D-12 → D-13 → D-14.
- **Phase 3 (close):** consistency verification (Design Freeze Checklist below) → D-15 archive → declare Design Freeze.

---

# Canonicalization Changelog

Initial structure for `docs/architecture/canonicalization-changelog.md`, instantiated verbatim as execution step 0. Every architecture-changing decision from this sprint onward gets an entry; PRs touching `docs/architecture/**` or `docs/adr/**` must reference an entry ID.

```markdown
# NelyoHealth Architecture Canonicalization Changelog

Append-only. Every entry records one architectural change to the platform canon.
Entry ID format: CANON-NNN.

| Field | Meaning |
|---|---|
| Date | Decision date (ISO). |
| Document(s) | Documents embodying the change. |
| Previous Concept | What the canon said before. |
| New Concept | What the canon says now. |
| Reason | Why (evidence-based). |
| Impact | Code / docs / runtime consequences. |
| Migration Notes | How existing material transitions. |
```

Seed entries (recorded at instantiation):

| ID | Date | Document(s) | Previous Concept | New Concept | Reason | Impact | Migration Notes |
|---|---|---|---|---|---|---|---|
| CANON-001 | 2026-07-18 | ADR-0012; ADR-P02-005; STATUS.md | API/worker on Supabase Edge Functions | API + worker as long-lived containers; Supabase = Postgres + Storage only | Serverless cannot host a persistent NestJS monolith + outbox dispatcher | Deployment-breaking; no domain code change | P02-005 compute section superseded; deploy workflows retargeted |
| CANON-002 | 2026-07-18 | ADR-0014; Manifest; Kernel Blueprint; Platform Glossary | Workspace as a first-class (implicitly persistable) entity | Workspace = derived dimension of ActingContext over tenancy (`activeTenantId`) + persona | Tenancy already implements the semantics; a table would duplicate authority | Docs-only + resolver mapping | No schema change; resolver maps tenant state → workspace kind |
| CANON-003 | 2026-07-18 | ADR-0014; same docs | Persona as a first-class switchable entity | Persona = derived actor-role capacity (`AuthorizationActorRole`) validated from membership + relationship | The enum + relationship graph already carry the semantics | Docs + resolver; vocabulary alignment | No new store; switch = audited context transition |
| CANON-004 | 2026-07-18 | ADR-0014; Manifest; Kernel Blueprint; Glossary | Care Circle as a persisted first-class aggregate | Care Circle = derived patient-centered read model over the relationship graph | Relationships already carry permittedActions/verification/revocation; an aggregate would duplicate authority | Read model + endpoints to build; no authority store | First-class in the model/API, derived in storage |
| CANON-005 | 2026-07-18 | Kernel Blueprint; Platform Glossary | Resource Registry + Capability Registry as kernel components | Removed; derive from data-classification + role/permission definitions | Redundant persistence; complexity without gain | Docs-only deletion | Glossary entries removed; PDP consumes existing sources |
| CANON-006 | 2026-07-18 | ADR-0013; Kernel Blueprint; event-catalogue | Outbox available but optional; audit on a parallel path | Transactional command mandatory: state + outbox + audit in one TX; dispatcher is sole fan-out | Prevents event/audit drift; makes Principle 6 enforceable | Handler retrofit + CI gate | Existing handlers migrate before new domain modules stack on them |
| CANON-007 | 2026-07-18 | ADR-0015; source-of-truth-matrix; domain-boundaries | Per-handler redaction (provider-disclosure et al.) | Central classification-driven Projection layer for all cross-context reads | Per-handler redaction leaks as consumers multiply | New layer; reads routed through it | Provider-disclosure logic becomes the first tenant of the layer |
| CANON-008 | 2026-07-18 | Kernel Blueprint; Platform Glossary | PDP described as RBAC ∧ ABAC ∧ Consent | Canonical decision = implemented policy: allowed \| denied \| challenge-required over role × relationship × consent × session × emergency; RBAC/ABAC retained as descriptive vocabulary | The implemented model is sound and richer (step-up leg); rename-to-match risked a needless rewrite | Docs-only | No policy-engine change; enforcement gates tracked separately |
| CANON-009 | 2026-07-18 | ADR-0016; domain-boundaries; context-map | Notifications = fake adapter only | Event-driven Notification orchestration module subscribed to the outbox stream | Prevents per-feature hand-rolled notifications | New module (P1) | Adapter already present; orchestration added above it |
| CANON-010 | 2026-07-18 | platform-glossary; glossary | Ambiguous dual-glossary authority | Division of authority: domain glossary owns entity/classification; platform glossary owns platform language/relationships/naming | Two glossaries must not compete | Docs-only cross-links | Recorded as Conflict C-12 outcome |

---

# Canonical Status Standard

Every architecture document (all 30 above, plus new ones) carries this front-matter block, retrofitted mechanically during execution:

```markdown
## Document Status

| Field | Value |
|---|---|
| Status | Draft | Proposed | Accepted | Deprecated | Superseded |
| Owner | <role, not person> |
| Version | <MAJOR.MINOR> |
| Last Updated | <ISO date> |
| Supersedes | <doc/ADR refs or —> |
| Superseded By | <doc/ADR refs or —> |
| Related ADRs | <refs> |
| Related Documents | <refs> |
```

**Lifecycle rules.**
- `Draft → Proposed` — author; `Proposed → Accepted` — requires recorded reviewer sign-off (owner role + governance lead).
- `Accepted → Deprecated` — content discouraged but not replaced; must state why.
- `Accepted/Deprecated → Superseded` — requires a `Superseded By` target, and the successor must list this doc under `Supersedes` (pointers both ways, always).
- Status changes are content changes: each requires a Canonicalization Changelog entry (or ADR-index entry for ADRs).
- Version bumps: MAJOR for meaning changes, MINOR for clarifications. Mechanical front-matter retrofit itself is Version-neutral.
- Legacy status vocabularies (`Review state: PROPOSED`, `DRAFT-PENDING-…-APPROVAL`) are mapped onto this standard during the retrofit and retired.

---

# Design Freeze Checklist

Verification that executing this plan yields exactly one canonical architecture. Each criterion lists the guaranteeing updates and how it is verified in Phase 3.

| Criterion | Guaranteed by | Verification method |
|---|---|---|
| Exactly one canonical architecture | D-2 (single kernel reference) + D-15 (evolution report archived) + precedence rule | Review: no live doc claims kernel authority except the Blueprint; archive pointer check |
| No duplicated concepts | CANON-002/003/004/005 (derived rulings; registries removed) | Grep sweep for "Resource Registry", "Capability Registry", persisted-Workspace/Persona language across `docs/**` |
| No conflicting terminology | D-3 + D-14 (glossary pair aligned, C-12 recorded) | Terminology sweep of the derived-concept entries against both glossaries |
| No contradictory diagrams | D-2, D-12, D-13 (diagrams corrected in the same pass) | Manual diagram review against the Canonical Architecture lifecycle |
| No conflicting request lifecycles | D-2 (one pipeline: Authenticate → Resolve → Authorize → Execute → Dispatch) | Search for lifecycle descriptions outside the Blueprint; each must reference, not restate |
| No conflicting deployment models | CANON-001 (ADR-0012 + D-7 + D-8) | ADR-index shows one accepted compute model; P02-005 compute marked superseded |
| No conflicting domain models | D-10/D-11/D-12 additive-only updates | Diff review: no ownership row changed, only derived rows added |
| No conflicting authorization models | CANON-008 (implemented PDP canonical; RBAC/ABAC descriptive) | Blueprint + Glossary name the same decision outputs as the code |
| No conflicting glossary definitions | CANON-010 + D-3 + D-14 | Cross-check the ~15 overlapping terms between the two glossaries |

The freeze is declared only when every verification passes **and** the Phase-0 governance gates (ratifications, ADR-0009 decision, ADR-0012–0016 acceptance) are recorded — not merely planned.

---

# Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| CR-1 | **Docs freeze but code conventions lag** — canon says "mandatory outbox / universal authorization" before the CI gates exist, so new code silently diverges from the frozen design. | Medium | High | Treat ADR-0013's CI gate and the authorization-coverage gate as *freeze conditions*, not follow-ups; freeze announcement lists them explicitly as in-force. |
| CR-2 | **Ratification stalls** — founder/domain-owner sign-off for D-5/D-6 doesn't happen; docs sit half-updated. | Medium | High | Single time-boxed ratification sitting in Phase 0; any ADR that cannot be approved converts to a named blocker before Phase 1 starts. |
| CR-3 | **Changelog discipline decays** — future doc edits skip CANON entries and drift resumes. | Medium | Medium | PR checklist rule: changes under `docs/architecture/**` or `docs/adr/**` require a CANON/ADR-index reference; reviewer enforces. |
| CR-4 | **Premature event-schema freeze** — the catalogue is frozen while payload details are still draft, forcing breaking changes later. | Medium | High | Freeze the **envelope + naming + versioning rule**, not payload bodies; payloads version independently (additive-only within a version), per D-4. |
| CR-5 | **Runtime supersession confusion** — P02-ISS-016 "COMPLETED" evidence vs. ADR-0012 reads as contradiction to newcomers. | Low | Medium | D-7 + D-8 supersession notes with both-way pointers; ADR-index is the arbiter. |
| CR-6 | **Rewrite scope creep in D-2** — the Blueprint rewrite becomes a venue for new ideas, violating the no-new-abstractions constraint. | Medium | Medium | D-2 review gate: every changed statement must trace to a CANON entry or an accepted ADR; anything else is rejected. |
| CR-7 | **Archived report keeps getting cited** as authority after D-15. | Low | Low | Superseded-By front matter + archive location; changelog is the citable decision record. |
| CR-8 | **Glossary pair drifts again** over time. | Low | Medium | C-12 rule in both docs + the overlap-term cross-check added to the release/review checklist. |

---

# Final Recommendation

## After this canonicalization plan is executed, will the architecture be ready for Design Freeze?

# YES WITH CONDITIONS

**Reasoning.** The plan closes every identified divergence deterministically: one kernel reference (D-2), one vocabulary (D-3/D-14), one deployment model (CANON-001), one authorization model (CANON-008), one event discipline (CANON-006), one decision trail (changelog + status standard), and a clean archive of the superseded decision record (D-15). Nothing in the plan invents new concepts; every change traces to the accepted Evolution Report. Executed faithfully, the nine freeze criteria are all verifiable, and the architecture is coherent enough to freeze.

It is **WITH CONDITIONS** because a freeze rests on decisions being *made*, not scheduled, and on the frozen design being *enforceable*, not aspirational:

1. **Governance gates must actually close** — ADRs 0005–0011 ratified, ADR-0009 decided (transport or scoped deferral with port contract), and ADR-0012–0016 accepted. If any gate fails, the freeze halts at that named blocker.
2. **The two enforcement gates must be in force at freeze** — the mandatory-outbox CI gate (ADR-0013) and the authorization endpoint-coverage gate. A design frozen without its enforcement mechanisms will diverge within weeks (risk CR-1).
3. **The Phase-3 verification sweep must pass**, not be waived — the checklist above is the acceptance test of the freeze itself.

Meet those three and the answer converts to an unconditional YES: one canonical architecture, fully traceable, ready to govern everything built afterward.
