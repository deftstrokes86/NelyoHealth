# ADR-0015: Repository tenant-scope guard — the Scope Registry, belt-and-suspenders persistence integrity, and the CI construction gate

## Status

ACCEPTED (roadmap M8.2 — architecture-completion arc, closes Design-Freeze gap AM-7). Design review
approved with two modifications (belt-and-suspenders on PK operations; generalize the registry beyond
"organization"), both folded in below.

## Date

2026-07-31

## Context

Through M8.1 tenant isolation at the persistence boundary was enforced by **repository/query
convention**: a developer had to remember to add `AND organization_ref = $n` to every tenant-scoped
statement. A single forgotten predicate on a collection query returns rows **across tenants** — a
multi-tenant data-leak bug no test is guaranteed to catch. AM-7 (a P1 Design-Freeze item) requires the
tenant filter to be **mandatory by construction, not developer discipline**.

The persistence layer is 18 hand-written SQL repositories over soft `organization_ref` references (no
FKs — context isolation). Three shapes of statement touch a tenant-owned table:

1. **Collection / attribute reads** (list, count, exists) — filter by a non-unique attribute; the
   high-leak class.
2. **PK single-object operations** (read/update/delete by a globally-unique id).
3. **Deliberate cross-organization reads** — a subject's own record across organizations; the
   relationship-graph capacity resolution; discovery loads that *establish* the scope for the PDP.

## Decision

### 1. Separation of responsibilities (unchanged invariant)

- **The PDP decides WHETHER** access is permitted (consent / relationship / break-glass / self).
- **The repository tenant-scope guard enforces WHERE** data may be touched (the scope predicate is
  present and matches).

The repository layer is **not** a second authorization engine — it evaluates no policy, loads no roles.
The two guarantees are **independent**: if either layer regresses, the other still prevents
cross-tenant access.

### 2. The Scope Registry — single source of truth (extensible beyond organization)

`packages/database/src/scope-registry.data.json` declares which tables are **scope-owned**. Each table
declares a **list of `scopes`** (`{ scopeType, column }`), so the abstraction is a general *scope*, not
a hardwired organization. `organization` is the only **live** scope type today; `facility`,
`department`, `care-circle`, `household`, `employer`, `insurer`, `government-region`, and
`research-cohort` are **reserved** — adding one is a data addition, not a redesign. Child tables carry
no scope column of their own and declare a `parent` (scoped-via-parent). Tables **not** in the registry
are intentionally **global** (identity, sessions, credentials, tenancy, audit, outbox) and are left
untouched. The typed accessor (`scope-registry.ts`) and the CI gate read the same JSON.

### 3. Belt-and-suspenders — the scope predicate is mandatory on every scope-owned statement

Per the approved modification, the predicate is carried on **all** scope-owned statements, including
PK-keyed single-object ones:

- **INSERT** stamps the scope column.
- **UPDATE / DELETE** carry `<scopeColumn> = $n`. For **unconditional** writes the runtime guard
  (`assertScopedMutation`) treats a zero-row result as a **persistence-integrity violation** (the PDP
  already allowed the action, so a mismatch means the two layers disagree on ownership) and throws
  `ScopeIntegrityError` — fail-closed. For **conditional** compare-and-set writes a mismatch simply
  fails to match (benign `false`), the org predicate still preventing any cross-tenant write.
- The runtime guard (`requireScopeRef` / `requireOrganizationScope`) refuses any scope-owned query
  issued without a concrete scope ref — fail-closed by construction.

The expected scope is available at mutation time: every write flow **loads the aggregate to discover
its organization, decides (PDP), then mutates** — the loaded `organizationRef` is threaded into the
mutation.

### 4. Governed exemptions — deliberate cross-scope statements

The genuinely cross-scope statements (a subject's own record across organizations; the cross-org
capacity resolution; discovery loads that establish the scope for an immediate PDP decision — a read
cannot filter by an organization it exists to discover) are recorded in
`tools/checks/scope-exemptions.json`, each with its module, a distinctive SQL substring, the class, the
reason, and the boundary that keeps it safe. Discovery loads are safe because the loaded row's
organization is fed to the PDP, which denies cross-organization access before disclosure, and every
subsequent mutation is scope-belted.

### 5. The CI construction gate

`tools/checks/tenant-scope-coverage-gate.mjs` (in `gates:verify`, alongside authorization / outbox /
projection coverage) scans the repository SQL and fails CI on any scope-owned statement lacking its
predicate (or any stale ledger entry). A forgotten tenant filter fails the build before it can reach
production.

### 6. Row-Level Security is FUTURE defense-in-depth, not the primary mechanism

Postgres RLS was evaluated and **deferred**. It is the strongest data-layer isolation, but the platform
uses soft `organization_ref` with many first-class cross-tenant paths (self-reads, identity, projections,
audit, the relationship graph) that would each need an RLS exception + a bypass role, it requires a
per-transaction tenant GUC threaded through the pool and the outbox command, and it pushes an
authorization-shaped decision into the database. If adopted later it sits **underneath** the existing
layers, not replacing them. The order of responsibility is:

> **PDP → Repository Tenant-Scope Guard → (future) PostgreSQL RLS → Database**

## Consequences

- Multi-tenant collection leakage and cross-tenant mutation are eliminated as a structural class:
  caught in CI (gate) and fail-closed at runtime (guard).
- The Scope Registry becomes the single, extensible source of truth for tenant-owned persistence.
- Every deliberate cross-scope read is now a named, reviewed ledger entry instead of an unmarked query
  — silent convention becomes visible, governed debt.
- Cost: ~23 mutation signatures gained an `organizationRef`, threaded from the already-loaded
  aggregate; no business logic changed.
- The three read-projections (timeline / notification / care-circle — subject-scoped, two with nullable
  organization, already governed by the PDP + the M8.1 projection layer) are out of scope for M8.2 and
  are the first candidates when the registry generalizes past `organization`.
