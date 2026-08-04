# NelyoHealth — Registry Activation Roadmap

## Document Control

| Field | Value |
|---|---|
| Document | `docs/architecture/future-platform-registries.md` |
| Kind | Permanent architectural memory — the activation schedule for every registry that does not yet exist |
| Authority | **Canonical** for registry activation sequencing. It records DECISIONS, their reasons, and their preconditions. It does not itself authorise building anything — an entry reaching its ACTIVATE WHEN conditions authorises a *milestone proposal*, not a commit. |
| Owner role | Principal Architect + Technical Governance Lead |
| Created | 2026-08-01 (after M8.3f) |
| Restructured | 2026-08-04 (M8.3g) — converted from a deferral register into a full activation roadmap |
| Related | [ADR-0016](../adr/ADR-0016-platform-registry-layer.md) · [ADR-0015](../adr/ADR-0015-repository-tenant-scope-guard.md) · [ADR-0014](../adr/ADR-0014-http-trust-boundary.md) · [ADR-0010 (no PHI in analytics)](../adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md) · [ADR-0009](../adr/ADR-0009-video-platform-decision-deferred.md) · [ADR-0007](../adr/ADR-0007-payer-and-clinical-access-separation.md) · [ADR-0002](../adr/ADR-0002-wallet-as-ledger-backed-balance.md) · [architecture-evolution-report.md](./architecture-evolution-report.md) |

> **Why this document exists.** M8.3a–M8.3f built, rejected, superseded, and deferred a large number
> of registry ideas across many separate conversations. Without a written record a future milestone
> will either **rediscover** an idea already decided against and rebuild something deliberately
> removed, or **forget** one that was genuinely needed, or **build one before its dependencies exist**
> and produce a surface that declares things nothing can execute.
>
> This document exists to make all three impossible. It is equally a defence against over-building:
> several entries below say *"do not build this, ever"* — that verdict is as load-bearing as the ones
> that say *"build this later"*.

---

## How to use this document

1. **Before proposing any registry** — run the four-way test below, then check the master index. If
   the name appears with status `REJECTED`, do not reopen it without new evidence and a superseding
   ADR.
2. **Before starting any milestone** — run that milestone's block in the
   [Registry Activation Checklist](#registry-activation-checklist).
3. **Before activating a registry** — every line in its `ACTIVATE WHEN` block must be true. Not
   *mostly* true. A registry activated early declares things nothing can execute, which is the
   "filter that lies" failure mode caught twice during M8.3 review.
4. **After activating** — satisfy the *acceptance criteria after activation*, move the entry into the
   [What already exists](#what-already-exists--status-active) table, and leave its reasoning behind.

---

## The distinction that governs this whole document

The single most common error during M8.x was calling something a **registry** when it was actually a
**domain service** or **reference data**. Getting this wrong produces registries that declare things
nothing can execute.

| Kind | Definition | Test | Example |
|---|---|---|---|
| **Registry** | Declarative, JSON-serialisable data saying what the platform COMPOSES or OFFERS. Finite, authored, versioned with the code, cross-validated by `gates:registry`. | *Would an administrator edit this in a platform builder?* | Navigation, Dashboard, Persona |
| **Domain service** | Code + tables that DO something and hold instance state. | *Does it write rows describing real-world events?* | Pharmacy dispensing, billing ledger |
| **Reference data** | Externally-sourced catalogues, large, updated on someone else's schedule. | *Does a third party publish it?* | LOINC, ICD-10, NAFDAC formulary |
| **Tenant configuration** | Per-organization settings; common shape, per-tenant values. | *Does each tenant need a different value?* | An employer's benefit rules |

**Rule of thumb:** if it is per-tenant, externally sourced, or instance state, it is **not** a registry.
Most items on the "future registries" wish-list fail this test — see the verdicts below.

---

## Naming reconciliation

Several names in circulation describe things that are not registries. They are retained here as
**searchable aliases** so that a future contributor who searches for the name they remember lands on
the decision rather than an empty result — but each carries its honest verdict and a pointer to what
should actually be built.

| Name in circulation | Honest verdict | What to build instead |
|---|---|---|
| Pharmacy Registry | REJECTED as named | Pharmacy **service** + Formulary **reference data** |
| Laboratory Registry | REJECTED as named | Laboratory **service** + Test Catalogue **reference data** |
| Billing Registry | REJECTED as generic configuration | Billing **service** + ledger (ADR-0002) + **Tariff Registry** |
| Sponsorship Registry | REJECTED as a new registry | Sponsorship **service** + **Sponsorship Plan & Tier Registry** |
| Webhook Registry | REJECTED — superseded | Entries in the existing **Integration Registry** (`protocol: webhook`) |
| Integration Runtime Registry | REJECTED | Integration **executor service** binding existing declarations |
| Search Runtime Registry | DEFERRED — probably unnecessary | Search **executor service** over the existing Search Registry |
| Report Runtime Registry | DEFERRED — probably unnecessary | Report **execution service** + server-side binding table |
| AI Conversation Registry | REJECTED | Conversation **aggregate** + Event entries + Timeline projection |
| AI Tool Policy Registry | REJECTED — superseded | The existing **Tool Registry consumer contract** |
| Mobile Capability Registry | REJECTED — superseded | `mobile` is already a `ConsumerSurface`; use `supportsMobile` |
| Notification Preference Registry | REJECTED — superseded | `Persona.notificationPreferences` + a preference **service** |

---

## STATUS vocabulary

| Status | Meaning |
|---|---|
| **ACTIVE** | Exists, shipped, validated by `gates:registry`. Listed for completeness so it is not proposed as new. |
| **PLANNED** | Will definitely exist. The activating milestone is named and its prerequisites are enumerated. |
| **NOT STARTED** | Agreed in principle, but the activating milestone is not yet scheduled and prerequisites are incomplete. |
| **DEFERRED** | May never be justified. Reasoning recorded so it is not rebuilt on instinct. Revisit only on the stated trigger. |
| **REJECTED** | A deliberate decision NOT to build it. Do not reopen without new evidence and a superseding ADR. |

---

## What already exists — STATUS: ACTIVE

Fifteen registries in `packages/platform-registry`, plus two outside it. Recorded here so a future
milestone does not propose one of them as new. Entry counts are as validated by `gates:registry` at
M8.3g.

| Registry | Milestone | Entries | Notes |
|---|---|---|---|
| Capability | M8.3a | 31 | Structured `resource.action` vocabulary; the unifying primitive |
| Tool | M8.3a | 5 | Shared contract for UI / Mobile / AI / Automation / Integration |
| Workspace | M8.3a | 9 | Includes the 7 organization types; `organization_type` column resolves it |
| Persona | M8.3a | 11 | Each with a full composition |
| Care Circle | M8.3b | 6 | Roles + `composesAsPersona` / `composesInWorkspace` / `compositionPriority` |
| Workflow | M8.3b | 3 | Generic state/transition engine |
| Event | M8.3b | 12 | Formalises the M6 Event Platform **contract** — see RJ-4 |
| Feature | M8.3b | 13 | Org-available features, distinct from feature flags |
| Notification | M8.3b | 6 | Declarative event → audience → channel routing |
| Navigation | M8.3c | 29 | Hierarchy, sections, badge sources |
| Dashboard | M8.3c | 8 | Widget-level composition |
| Experience | M8.3c | 27 | `onboarding` / `homepage-section` / `profile` |
| Search | M8.3d | 12 | Scopes with reach + result classification |
| Report | M8.3d | 10 | ADR-0010 enforced structurally; kinds `operational`/`clinical`/`regulatory`/`analytics` |
| Integration | M8.3d | 9 | Every inbound/outbound boundary, incl. `payment-webhook` |
| **Scope Registry** | M8.2 | — | `packages/database/scope-registry.*` — tenancy, not composition (ADR-0015) |
| **Content Registry** | P05 | — | `packages/content-registry` — marketing copy today; see **CR-1** |

> **Standing caveat.** The Tool Registry has **5** tools and `tool-invocation.ts` binds all five. But
> Navigation declares 29 items, Dashboard 8, Experience 27, Search 12 and Report 10. Composition
> currently declares substantially more than the runtime can execute. Several entries below exist
> precisely to close that gap, and no new registry should widen it further.

---

## Master index

| # | Registry | Status | Activation milestone | Kind |
|---|---|---|---|---|
| RC-1 | Role Code Registry | **PLANNED** | Next composition / tenancy-role milestone | Registry extension |
| CR-1 | Content Registry (registry i18n) | **PLANNED** | Frontend or localisation milestone | Activation of existing |
| TA-1 | Tariff Registry | **PLANNED** | Billing & Payments | Registry |
| SP-2 | Sponsorship Plan & Tier Registry | **PLANNED** | Billing & Sponsorship | Registry |
| PH-2 | Formulary / Medication Catalogue | **PLANNED** | Pharmacy | Reference data |
| LA-2 | Test Catalogue | **PLANNED** | Laboratory | Reference data |
| PR-1 | Programme Registry | **PLANNED** | Programmes | Tenant configuration |
| CO-1 | Coverage Registry | **PLANNED** | Coverage | Tenant configuration |
| TE-1 | Terminology / Code System Registry | **NOT STARTED** | Clinical Coding | Reference data |
| PT-1 | Platform Templates | **NOT STARTED** | Platform Builder | Registry |
| AI-1 | AI Safety Registry | **NOT STARTED** | AI Platform | Registry |
| AI-2 | AI Prompt Registry | **NOT STARTED** | AI Platform | Registry |
| AI-3 | AI Evaluation Registry | **NOT STARTED** | AI Platform | Registry |
| AI-4 | AI Memory Policy Registry | **DEFERRED** | AI Platform (only if memory is built) | Registry |
| AU-1 | Automation Trigger Registry | **DEFERRED** | Automation | Registry |
| SR-1 | Search Runtime Registry | **DEFERRED** | Search Runtime (probably never) | — |
| RR-1 | Report Runtime Registry | **DEFERRED** | Reporting Runtime (probably never) | — |
| CD-1 | Consent Domain Registry | **DEFERRED** | Only if domains become tenant-specific | — |
| RJ-1 | Resource Registry | **REJECTED** | — | — |
| RJ-2 | Persisted Capability Registry | **REJECTED** | — | — |
| RJ-3 | Analytics Registry | **REJECTED** | — | — |
| RJ-4 | Event Registry as source-of-truth | **REJECTED** | — | — |
| RJ-5 | Billing Registry (generic configuration) | **REJECTED** | — | — |
| RJ-6 | Pharmacy Registry (as named) | **REJECTED** | — | — |
| RJ-7 | Laboratory Registry (as named) | **REJECTED** | — | — |
| RJ-8 | Sponsorship Registry (as a new registry) | **REJECTED** | — | — |
| RJ-9 | Webhook Registry | **REJECTED** | — | — |
| RJ-10 | Integration Runtime Registry | **REJECTED** | — | — |
| RJ-11 | AI Conversation Registry | **REJECTED** | — | — |
| RJ-12 | AI Tool Policy Registry | **REJECTED** | — | — |
| RJ-13 | Notification Preference Registry | **REJECTED** | — | — |
| RJ-14 | Mobile Capability Registry | **REJECTED** | — | — |
| RJ-15 | Video / Real-time Transport Registry | **REJECTED** (not a registry) | — | — |

---

# Part I — Registries that will or may exist

Each entry uses the full activation template. A field marked *n/a* is genuinely inapplicable, not
unconsidered.

---

## RC-1 — Role Code Registry

**STATUS: PLANNED** · *highest priority item in this document*

**Purpose.** Map a tenancy `roleCode` to a Persona Registry id, as registry data rather than a code
constant.

**Why it does not exist today.** M8.3e introduced `ROLE_CODE_PERSONA_ALIASES` as a **hardcoded map in
`apps/api/src/acting-context-resolver.ts`**. That is exactly the data the Platform Registry Layer
exists to hold, and it is the **only composition mapping still living in application code**. M8.3e was
already large; the map is small and correct, and moving it required no runtime change to work.

**Prerequisites.** Persona Registry (exists, ACTIVE).

**Activation milestone.** The next milestone that touches composition or tenancy roles. Do not let
this drift — every milestone it survives makes the seam harder to see.

**Dependencies.** Persona Registry · `acting-context-resolver.ts` · `gates:registry`.

**ACTIVATE WHEN:**
- Any milestone modifies `acting-context-resolver.ts`, **or**
- Any milestone adds a tenancy role code, **or**
- Any milestone adds a persona
- (whichever comes first — this is a *carry-forward*, not a scheduled build)

**Expected runtime consumers.** `acting-context-resolver.ts` only.

**Expected APIs.** None new. `GET /api/me/surface` and `GET /api/me/subjects` already resolve through
the resolver and would consume this transparently.

**Expected frontend consumers.** None directly — the mapping is server-side and must remain so.

**Related ADRs.** ADR-0016 (Platform Registry Layer).

**Acceptance criteria before activation.** None outstanding; prerequisites are already satisfied.

**Acceptance criteria after activation.**
- `ROLE_CODE_PERSONA_ALIASES` no longer exists in `apps/api/src`.
- The mapping is expressed as a field on the Persona Registry (likely `matchesRoleCodes: string[]`)
  rather than a new registry file — a new registry for one map would fail the four-way test.
- `gates:registry` cross-validates every role code against a persona that exists.
- Acting-context resolution tests pass unchanged, proving the move was behaviour-preserving.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## CR-1 — Content Registry activation for registry copy

**STATUS: PLANNED** *(activation of an existing registry, not a new one)*

**Purpose.** Move user-facing strings declared inside the composition registries into the existing
`packages/content-registry`, so registry-composed surfaces are localisable.

**Why it does not exist today.** `packages/content-registry` already exists and holds marketing copy
(P05). **M8.3f item 8 was not done.** Roughly 180 `label` / `description` strings across Navigation,
Dashboard, Experience, Search and Report remain developer-authored English literals inside the
registry source files.

**Prerequisites.** Content Registry (exists) · a decision on locale scope (which languages).

**Activation milestone.** The first milestone with a localisation or non-English requirement, **or**
the frontend milestone — whichever comes first.

**Dependencies.** Content Registry · Navigation / Dashboard / Experience / Search / Report registries
· `pnpm content:validate` · the P05 voice-and-tone lint.

**ACTIVATE WHEN:**
- A non-English locale is required by product or regulation, **or**
- The frontend milestone begins consuming registry labels for real UI
- AND the content approval workflow (`docs/content/content-approval-workflow.md`) can accept
  registry-sourced entries

**Expected runtime consumers.** `composeSurface` and the surface controller, resolving content keys
rather than returning literals.

**Expected APIs.** `GET /api/me/surface` returns content **keys** plus a resolved locale string —
a contract change requiring an OpenAPI regeneration and a client update.

**Expected frontend consumers.** All four web shells and mobile — every consumer of `/me/surface`.

**Related ADRs.** ADR-0004 (design, motion and content governance) · ADR-0016.

**Acceptance criteria before activation.**
- A locale set is decided and recorded.
- The content-approval workflow explicitly covers registry copy (it currently covers marketing copy).

**Acceptance criteria after activation.**
- Zero user-facing English literals remain in `packages/platform-registry/src/*.ts`.
- `gates:registry` fails if a registry entry references a content key that does not exist.
- The voice-and-tone lint runs over registry copy as it does over marketing copy.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## TA-1 — Tariff Registry

**STATUS: PLANNED**

**Purpose.** Declare service → price bindings, per payer, with effective dates: the authored,
finite half of what people loosely call "billing configuration".

**Why it does not exist today.** No billing service and no ledger implementation exist to price
against. Pricing declared with nothing able to charge it would be a declaration with no runtime.

**Prerequisites.** Billing domain service · ledger implementation (ADR-0002) · payer model
(ADR-0007) · a decided currency and rounding policy.

**Activation milestone.** Billing & Payments.

**Dependencies.** Billing service · ledger · Capability Registry (`billing-ledger.read`,
`payment-status.read` exist) · payer/clinical separation.

**ACTIVATE WHEN:**
- A billing domain service exists with tables and HTTP endpoints
- The ledger (ADR-0002) is implemented and writes through the transactional command path
- A payer model distinguishes self-pay / sponsor / employer / HMO at pricing time
- Currency, rounding and effective-date semantics are decided and recorded

**Expected runtime consumers.** Billing service (pricing an order) · sponsorship service (computing a
sponsored amount) · Report Registry entries of kind `operational`.

**Expected APIs.** `GET /api/tariffs` (administrator-scoped) · price resolution embedded in existing
order and payment endpoints rather than exposed as a public pricing endpoint — pre-payment provider
disclosure rules (ADR-0001) constrain what pricing may reveal.

**Expected frontend consumers.** `organization-web` (administrator price management) · `patient-web`
(displayed price at point of order, subject to ADR-0001 disclosure limits).

**Related ADRs.** ADR-0002 (wallet as ledger-backed balance) · ADR-0007 (payer/clinical separation) ·
ADR-0001 (provider detail release after payment).

**Acceptance criteria before activation.**
- Billing service exists and is gated by an authorization decision per ADR-0012.
- It is confirmed that a tariff never reveals protected provider identity or location pre-payment.

**Acceptance criteria after activation.**
- Every priced action resolves its price through the Tariff Registry — no price literals in service
  code.
- `gates:registry` validates that every tariff references a capability and a payer type that exist.
- Effective-date overlap is a validation error, not a runtime surprise.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## SP-2 — Sponsorship Plan & Tier Registry

**STATUS: PLANNED**

**Purpose.** Declare what may be sponsored, at what cadence, with what caps — the finite, authored
part of sponsorship.

**Why it does not exist today.** The **composition** for sponsorship already exists end-to-end
(`sponsorship.read` / `.fund` capabilities, `diaspora-sponsor` care-circle role and persona,
`diaspora-household` workspace, `diaspora-sponsorship` feature, `sponsorship-statement` report,
`CareSponsorshipFunded` event, and nine sponsor PDP rules from M8.3f). What is missing is the
sponsorship **domain service** and its tables — not a registry. Plans and tiers cannot be declared
before there is something that can enrol in them.

**Prerequisites.** Sponsorship domain service · Tariff Registry (TA-1) · billing service.

**Activation milestone.** Billing & Sponsorship.

**Dependencies.** TA-1 · billing service · ledger (ADR-0002) · the nine sponsor PDP rules (M8.3f).

**ACTIVATE WHEN:**
- A sponsorship domain service exists with tables and endpoints
- The Tariff Registry (TA-1) is active — a tier without a price is meaningless
- The **per-capacity consent-domain question is resolved** (see below)

**Expected runtime consumers.** Sponsorship service · billing service · notification routing for
`CareSponsorshipFunded`.

**Expected APIs.** `GET /api/sponsorship/plans` · `POST /api/sponsorship/enrolments` · the existing
`sponsorship.fund` capability becomes an invocable tool.

**Expected frontend consumers.** `patient-web` diaspora surfaces (already composed in Experience and
Navigation but not yet executable).

**Related ADRs.** ADR-0007 (payer/clinical separation) · ADR-0002 · ADR-0016.

**Acceptance criteria before activation.**
- The **nine sponsor PDP rules are re-reviewed before being widened**. Least privilege must still
  hold, especially the deliberate **upload-only, no-read document rule**: a sponsor funding a
  procedure never acquires the right to read its result.
- **Per-capacity consent domains** (`sponsor-participation` etc.) were **reverted in M8.3f** because
  no code path grants them, and requiring them denied *all* delegated access including caregivers.
  Activating sponsorship plans requires deciding whether consent domains are granted at relationship
  creation. This is a **consent-model change, not a composition one**, and needs its own decision.

**Acceptance criteria after activation.**
- A sponsor's read reach is unchanged by enrolling in any tier — tiers govern money, not access.
- `gates:registry` validates every tier against an existing tariff and capability.

**Reason if intentionally rejected forever.** n/a — not rejected. Note that the broader
"Sponsorship Registry" **is** rejected — see **RJ-8**.

---

## PH-2 — Formulary / Medication Catalogue

**STATUS: PLANNED** *(as reference data, not a composition registry)*

**Purpose.** The catalogue of dispensable medications — presentations, strengths, controlled-substance
schedules, and NAFDAC registration status.

**Why it does not exist today.** No pharmacy domain service exists to dispense against it, and no
source-of-record decision has been made. It is also **not registry-shaped**: it is large,
externally published, and updated on someone else's schedule, so it must not be a code-authored file
validated by `gates:registry`.

**Prerequisites.** Pharmacy domain service · a decided NAFDAC (or equivalent) source and refresh path
· prescription service integration.

**Activation milestone.** Pharmacy.

**Dependencies.** Pharmacy service · prescription service (exists, unexposed) · a reference-data
service with its own versioning and refresh cadence.

**ACTIVATE WHEN:**
- A pharmacy dispensing service exists with tables
- Pharmacy HTTP endpoints exist
- The pharmacy tools declared in the Tool Registry are **executable** — bound in
  `tool-invocation.ts` (**M8.3f item 4 remains open**)
- The pharmacy frontend begins
- The formulary source and its refresh path are decided and recorded

**Expected runtime consumers.** Pharmacy dispensing service · prescription service (validating a
prescribed item) · `pharmacy-worklist` dashboard widgets.

**Expected APIs.** `GET /api/formulary/items` (search-scoped) · validation embedded in prescription
and dispensing endpoints.

**Expected frontend consumers.** `provider-web` (prescriber selection) · a pharmacy surface in
`organization-web`.

**Related ADRs.** None specific. Governed by `docs/clinical/prescription-policy.md` and
`docs/compliance/obligations-register.md`.

**Acceptance criteria before activation.**
- Pharmacy service exists and its writes are gated by an authorization decision per ADR-0012.
- The formulary refresh path does **not** run through `gates:registry` — it is reference data with
  its own lifecycle.

**Acceptance criteria after activation.**
- Every dispensable item resolves through the catalogue; no medication literals in service code.
- Controlled-substance schedule is enforced at prescribing, not only at dispensing.
- The `pharmacy` workspace's declared navigation and dashboard entries all bind to executable tools.

**Reason if intentionally rejected forever.** n/a — not rejected. The *"Pharmacy Registry"* as a
composition registry **is** rejected — see **RJ-6**.

---

## LA-2 — Test Catalogue

**STATUS: PLANNED** *(as reference data, not a composition registry)*

**Purpose.** Orderable diagnostic tests with specimen requirements, turnaround expectations, reference
ranges, and LOINC mapping.

**Why it does not exist today.** No laboratory domain service exists to order or result against, and
no LOINC mapping decision has been made. Like the formulary, it is externally published reference
data, not a code registry.

**Prerequisites.** Laboratory domain service · a decided test-catalogue source · LOINC mapping
decision · the critical-result protocol.

**Activation milestone.** Laboratory.

**Dependencies.** Laboratory service (exists as `laboratory-service.ts`, **unexposed over HTTP**) ·
diagnostics domain · TE-1 (Terminology) if LOINC is adopted registry-side.

**ACTIVATE WHEN:**
- A laboratory ordering and resulting service exists with HTTP endpoints
- `lab-worklist-widget` and `lab-recent-results` are **bound to executable tools**
  (**M8.3f item 4 remains open**)
- The laboratory frontend begins
- The test-catalogue source and LOINC mapping approach are decided and recorded

**Expected runtime consumers.** Laboratory ordering service · result-release logic
(`docs/clinical/result-release-policy.md`) · critical-result protocol.

**Expected APIs.** `GET /api/tests` (search-scoped) · validation embedded in order and result
endpoints.

**Expected frontend consumers.** `provider-web` (ordering) · a laboratory surface in
`organization-web` · `patient-web` (result display, subject to the result-release policy).

**Related ADRs.** ADR-0008 (finalized clinical record amendments — results are amendable, never
silently overwritten).

**Acceptance criteria before activation.**
- Laboratory service writes are gated per ADR-0012 (already true for `record-result` / `cancel`).
- Reference ranges are understood as **clinical** data with a safety owner, not neutral metadata.

**Acceptance criteria after activation.**
- Every orderable test resolves through the catalogue.
- Critical-result flagging is driven by catalogue data, not hardcoded thresholds.

**Reason if intentionally rejected forever.** n/a — not rejected. The *"Laboratory Registry"* as a
composition registry **is** rejected — see **RJ-7**.

---

## PR-1 — Programme Registry

**STATUS: PLANNED** *(as tenant configuration, not an entry in `packages/platform-registry`)*

**Purpose.** Declare employer, NGO and government programme rules — eligibility, benefits, enrolment
windows, caps.

**Why it does not exist today.** No programme domain service exists. More importantly, **every
tenant's values differ**, which makes this tenant configuration rows, not a global registry authored
with the code. The Workspace / Persona / Feature composition for all four organization types already
exists (M8.3e); what is missing is the service that reads per-tenant rules.

**Prerequisites.** Programme domain service · tenant configuration storage · ADR-0007 confirmation
for the new payer surfaces.

**Activation milestone.** Programmes (Employer / NGO / Government).

**Dependencies.** Tenancy scoping (exists, ADR-0015) · Scope Registry · billing service · TA-1.

**ACTIVATE WHEN:**
- A programme domain service exists with per-tenant configuration tables
- Tenant-scoped configuration storage exists and is covered by the Scope Registry
- ADR-0007 payer/clinical separation is re-confirmed to hold for the new employer surfaces
- The employer frontend begins

**Expected runtime consumers.** Programme service · eligibility resolution at point of care ·
billing (who pays) · `sponsorship-statement`-style reports.

**Expected APIs.** `GET /api/organizations/:id/programmes` (tenant-scoped, administrator) ·
eligibility resolved server-side inside existing order flows.

**Expected frontend consumers.** `organization-web` (employer administrator) · `patient-web`
(showing a member their coverage, subject to ADR-0007).

**Related ADRs.** ADR-0007 (payer/clinical separation — **load-bearing**) · ADR-0015 (tenant scope).

**Acceptance criteria before activation.**
- **Do not add these to `packages/platform-registry`.** A registry there is global and code-authored;
  these are per-tenant and administrator-authored. This is the single most likely mistake.
- Programme configuration rows carry a tenant scope and appear in the Scope Registry.

**Acceptance criteria after activation.**
- An employer can see who is eligible and what was spent, and **cannot** see any clinical record —
  the ADR-0007 invariant, tested.
- Programme configuration is tenant-scoped at the repository boundary, not by convention.

**Reason if intentionally rejected forever.** n/a — not rejected as a concept; rejected only as a
*global registry*.

---

## CO-1 — Coverage Registry

**STATUS: PLANNED** *(as tenant configuration, not an entry in `packages/platform-registry`)*

**Purpose.** Declare insurer plans, benefit schedules, eligibility rules, prior-authorization
requirements and caps.

**Why it does not exist today.** No coverage or payer-integration service exists. As with PR-1, values
are per-tenant, so this is configuration rather than a global registry.

**Prerequisites.** Coverage domain service · payer integration · tenant configuration storage.

**Activation milestone.** Coverage (Insurer / HMO).

**Dependencies.** Tenancy scoping · Integration Registry (payer connections) · TA-1 · ADR-0007.

**ACTIVATE WHEN:**
- A coverage domain service exists with per-tenant configuration tables
- A payer integration exists and is declared in the Integration Registry
- ADR-0007 payer/clinical separation is re-confirmed for insurer surfaces
- The HMO frontend begins

**Expected runtime consumers.** Coverage service · eligibility and prior-authorization checks ·
billing (adjudication) · claim reporting.

**Expected APIs.** `GET /api/organizations/:id/coverage-plans` (tenant-scoped) · eligibility resolved
server-side within order flows.

**Expected frontend consumers.** `organization-web` (HMO administrator) · `patient-web` (member
coverage view).

**Related ADRs.** ADR-0007 (**load-bearing**) · ADR-0015 · ADR-0011 (order funding secured and
disclosure separation).

**Acceptance criteria before activation.**
- **Do not add these to `packages/platform-registry`** — same reasoning as PR-1.
- Prior authorization must never become a channel through which a payer reads clinical detail beyond
  the minimum necessary; the projection layer (M8.1) is the enforcement point.

**Acceptance criteria after activation.**
- An HMO can adjudicate and **cannot** read the clinical record — ADR-0007, tested.
- Every payer-visible field passes through the central projection layer.

**Reason if intentionally rejected forever.** n/a — not rejected as a concept; rejected only as a
*global registry*.

---

## TE-1 — Terminology / Code System Registry

**STATUS: NOT STARTED** *(as reference data)*

**Purpose.** SNOMED CT, ICD-10 and LOINC code systems for clinical coding and interoperability.

**Why it does not exist today.** No clinical-coding requirement has been activated, no licensing
decision has been made (SNOMED CT licensing is jurisdiction-dependent), and the clinical records
service is not yet exposed over HTTP.

**Prerequisites.** Clinical records service exposed · a licensing decision per code system · an
interoperability requirement (HL7v2 / FHIR integrations are declared in the Integration Registry but
not implemented).

**Activation milestone.** Clinical Coding / Interoperability.

**Dependencies.** Clinical records service · Integration Registry (`hl7v2`, `fhir` protocols already
declared) · a reference-data service with independent versioning.

**ACTIVATE WHEN:**
- A regulatory or interoperability obligation requires coded clinical data
  (`docs/compliance/obligations-register.md`)
- Licensing for each adopted code system is resolved
- The clinical records service is exposed over HTTP

**Expected runtime consumers.** Clinical records service · referral service · laboratory (LOINC) ·
FHIR/HL7v2 integration adapters.

**Expected APIs.** `GET /api/terminology/:system/search` (authenticated, non-PHI) · coded fields
embedded in clinical record contracts.

**Expected frontend consumers.** `provider-web` (coded entry with type-ahead).

**Related ADRs.** ADR-0008 (clinical record amendments).

**Acceptance criteria before activation.** Licensing resolved; refresh cadence owned; **not** routed
through `gates:registry`.

**Acceptance criteria after activation.** Coded fields validate against the loaded code system
version, and the version is recorded on the record for regulatory evidence.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## PT-1 — Platform Templates

**STATUS: NOT STARTED**

**Purpose.** Compose workspaces, personas, features, workflows and notifications into a ready-to-run
deployment profile (Hospital, Employer, Insurer, NGO, Government, Research, Diaspora Family) — the
composition layer *above* the registries.

**Why it does not exist today.** It was pointless before the registries it composes existed. **They
now all do**, as of M8.3d. What is missing is the administrative runtime that would apply a template
to a tenant.

**Prerequisites.** All composition registries (**satisfied**) · tenant provisioning flow · an
administrator surface.

**Activation milestone.** Platform Builder.

**Dependencies.** Workspace · Persona · Feature · Workflow · Notification · Navigation · Dashboard ·
Experience registries (all ACTIVE) · tenant provisioning.

**ACTIVATE WHEN:**
- A tenant provisioning flow exists that can apply configuration at organization creation
- `admin-web` has moved beyond its Phase-2 shell
- More than one organization type is actually in use, making templates worth the abstraction

**Expected runtime consumers.** Tenant provisioning · `composeSurface` (a template narrows what a
tenant composes).

**Expected APIs.** `POST /api/organizations` accepting a `templateId` · `GET /api/platform-templates`
(platform-administrator only).

**Expected frontend consumers.** `admin-web` (platform administrator) — currently a 6-file Phase-2
shell.

**Related ADRs.** ADR-0016 (names this as roadmap).

**Acceptance criteria before activation.** At least two organization types in real use; otherwise a
template is a premature abstraction over a single case.

**Acceptance criteria after activation.** Applying a template is idempotent, audited, and reversible;
`gates:registry` validates that every template references only entries that exist.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## AI-1 — AI Safety Registry

**STATUS: NOT STARTED**

**Purpose.** Declare the safety constraints binding every AI interaction: prohibited topics, mandatory
refusals, clinical red-flag escalation triggers, required disclaimers, and the human-review
requirement per capability.

> **Do not confuse this with the AI Safety *ADR*.** The ADR is a decision document and is a
> **prerequisite**. This registry is the machine-readable expression of the constraints that ADR
> settles. Neither substitutes for the other.

**Why it does not exist today.** No AI capability exists anywhere in the platform, and — more
importantly — **no AI safety ADR exists**. Declaring safety constraints before the safety position is
decided would encode an unreviewed clinical policy as data.

**Prerequisites.** **An accepted AI safety ADR** · clinical sign-off
(`docs/clinical/clinical-safety-model.md`) · an LLM provider abstraction · a prompt runtime.

**Activation milestone.** AI Platform.

**Dependencies.** AI safety ADR (**does not exist**) · Tool Registry consumer contract (exists) ·
clinical safety model · `docs/clinical/critical-result-protocol.md`.

**ACTIVATE WHEN:**
- **An AI Safety ADR is accepted** (not drafted — accepted)
- Clinical sign-off on the safety model is recorded
- An LLM provider abstraction exists
- A prompt runtime exists
- The escalation path for a red-flag detection is implemented and tested

**Expected runtime consumers.** The AI context resolver · prompt execution · a pre-response safety
filter · escalation routing.

**Expected APIs.** No public endpoint. Safety constraints are applied server-side and are never
client-supplied — a client that could name its own safety profile could disable it.

**Expected frontend consumers.** None directly. Disclaimers surface through composed content, not by
the client choosing them.

**Related ADRs.** ADR-0016 §4 (AI is a **consumer**, not a parallel platform) · a **required** new AI
safety ADR · ADR-0010 (no PHI in analytics — AI telemetry is squarely in scope).

**Acceptance criteria before activation.**
- The AI safety ADR is accepted and clinically signed off.
- It is settled that an AI **never** performs an unapproved write:
  `resolveToolContract` already forces `requiresApproval` for any write tool on the `ai` or
  `automation` surface. That invariant must be re-verified, not assumed.

**Acceptance criteria after activation.**
- Every AI interaction resolves a safety profile; there is no unconstrained path.
- A red-flag trigger escalates to a human and is audited.
- Safety constraint versions are retained as **regulatory evidence**, matching the
  `REGULATORY-EVIDENCE` classification already in the Event Registry taxonomy.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## AI-2 — AI Prompt Registry

**STATUS: NOT STARTED**

**Purpose.** Versioned prompts and system instructions, model bindings, generation parameters, and the
capability each prompt is permitted to exercise.

**Why it does not exist today.** No AI capability exists. M8.3f was explicitly scoped "AI summaries —
when AI exists"; inventing a prompt registry with no consumer would have been architecture for its
own sake.

**Prerequisites.** AI safety ADR · AI Safety Registry (AI-1) · LLM provider abstraction · prompt
runtime.

**Activation milestone.** AI Platform — **after** AI-1, never before.

**Dependencies.** AI-1 · Tool Registry (exists) · consumer contract (exists) · Capability Registry.

**ACTIVATE WHEN:**
- AI Safety Registry (AI-1) is active
- An LLM provider abstraction exists
- A prompt runtime exists that can execute a versioned prompt
- `resolveToolContract(consumer: "ai")` is verified to still enforce approval on every write tool

**Expected runtime consumers.** Prompt execution service · the AI context resolver.

**Expected APIs.** No public prompt endpoint. Prompts are selected server-side by intent; a
client-supplied prompt is a prompt-injection surface and must not exist.

**Expected frontend consumers.** None directly — clients name an *intent*, never a prompt.

**Related ADRs.** ADR-0016 §4 · the required AI safety ADR.

**Acceptance criteria before activation.**
- **Do not create an "AI capability" surface or a parallel AI tool registry** — explicitly rejected by
  ADR-0016 §4. AI actions come from the existing Tool Registry via
  `resolveToolContract(consumer: "ai")`.

**Acceptance criteria after activation.**
- Every AI interaction records the prompt **version** used — in a clinical setting a prompt version is
  regulatory evidence of what the system was instructed to do at that moment.
- A prompt cannot reference a capability that is not in the Capability Registry; `gates:registry`
  enforces it.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## AI-3 — AI Evaluation Registry

**STATUS: NOT STARTED**

**Purpose.** Declare evaluation suites for AI behaviour: test cases, expected behaviour, pass
thresholds, and the sign-off owner per suite.

**Why it does not exist today.** Nothing to evaluate. There is no AI capability, no prompt, and no
safety profile to test against.

**Prerequisites.** AI-1 · AI-2 · a decision on who clinically owns evaluation sign-off.

**Activation milestone.** AI Platform — **with** AI-2, not after it ships to users.

**Dependencies.** AI-1 · AI-2 · clinical safety model · CI.

**ACTIVATE WHEN:**
- AI Prompt Registry (AI-2) is active
- A clinical owner for evaluation sign-off is named
- Evaluation can run in CI without sending any PHI to a provider

**Expected runtime consumers.** CI (as a gate) · a pre-release evaluation runner. **Not** the request
path.

**Expected APIs.** None. Evaluation is a build-time and release-time concern.

**Expected frontend consumers.** None.

**Related ADRs.** The required AI safety ADR · ADR-0010 (evaluation fixtures must be synthetic).

**Acceptance criteria before activation.**
- Evaluation fixtures are **synthetic only** — the standing platform rule, and non-negotiable when
  data leaves the boundary to a model provider.

**Acceptance criteria after activation.**
- No prompt version ships without a passing evaluation run recorded against it.
- Evaluation results are retained as regulatory evidence.

**Reason if intentionally rejected forever.** n/a — not rejected.

---

## AI-4 — AI Memory Policy Registry

**STATUS: DEFERRED**

**Purpose.** Declare what an AI may retain across sessions: which data classes, for how long, under
which consent domain, and how a subject revokes it.

**Why it does not exist today.** No AI exists, and cross-session memory may never be built. The
distinction that matters: **memory contents are instance state and very likely PHI** — an aggregate
with tables, consent and audit, not a registry. Only the **policy** governing retention is
registry-shaped.

**Prerequisites.** AI-1 · AI-2 · a **consent-model decision**: retaining clinical facts across
sessions is a new processing purpose and plausibly needs its own consent domain.

**Activation milestone.** AI Platform — only if cross-session memory is actually built.

**Dependencies.** AI-1 · AI-2 · consent service (exists, 11 domains) · projection layer (M8.1) ·
data classification taxonomy.

**ACTIVATE WHEN:**
- Cross-session AI memory is a decided product requirement (it is not today)
- A consent domain covering AI retention exists and is **granted by a real code path** — the exact
  trap that forced the M8.3f revert of per-capacity consent domains
- Retention, revocation and subject-access semantics are decided under
  `docs/privacy/` obligations

**Expected runtime consumers.** AI context resolver (deciding what may be recalled) · a retention
job · consent revocation handling.

**Expected APIs.** Subject-access and deletion endpoints — a data-protection obligation, not a
convenience.

**Expected frontend consumers.** `patient-web` privacy surface (view and revoke what is retained).

**Related ADRs.** The required AI safety ADR · ADR-0010 · ADR-0016.

**Acceptance criteria before activation.**
- **Do not build a memory registry that stores memories.** If it holds per-actor content it is an
  aggregate, and calling it a registry will smuggle PHI into a code-authored, git-versioned file.

**Acceptance criteria after activation.**
- Revoking consent purges retained memory and the purge is audited.
- Retained content passes through the projection layer on every read, like any other clinical data.

**Reason if intentionally rejected forever.** n/a — deferred, not rejected. It may never be
justified; if cross-session memory is never built, this entry simply never activates.

---

## AU-1 — Automation Trigger Registry

**STATUS: DEFERRED**

**Purpose.** Declare what causes an automated invocation — a schedule, an event, or a threshold —
bound to a Workflow transition or a Tool.

**Why it does not exist today.** Most of what an "Automation Registry" would hold **already exists**:
`resolveToolContract(consumer: "automation")` (M8.3d), `Workflow.automationHooks` (M8.3b), and the
gate-enforced rule that an automation-exposed write must require approval. Only the *trigger*
declaration is genuinely missing, and nothing yet needs one.

**Prerequisites.** A real automation requirement · worker backplane (exists) · Event Registry
(exists).

**Activation milestone.** Automation.

**Dependencies.** Workflow Registry · Tool Registry · Event Registry · worker backplane · outbox
dispatcher.

**ACTIVATE WHEN:**
- A concrete automation requirement exists that cannot be expressed as an existing
  `Workflow.automationHook`
- The approval semantics for an unattended write are re-confirmed
- More than one trigger is needed — a single scheduled job is a worker job, not a registry

**Expected runtime consumers.** The worker · outbox dispatcher · workflow engine.

**Expected APIs.** None public. Administrator visibility only, if any.

**Expected frontend consumers.** Possibly `admin-web` for observability of what runs automatically.

**Related ADRs.** ADR-0016 · ADR-0010 (event-consumer projection pattern).

**Acceptance criteria before activation.**
- **Keep it narrow — an Automation *Trigger* registry, not a general Automation registry.** Anything
  broader duplicates Workflow + Tool, which is the drift the layer exists to prevent.

**Acceptance criteria after activation.**
- Every automated invocation is attributable and audited with a synthetic actor identity.
- No unattended write commits without the approval the consumer contract already requires.

**Reason if intentionally rejected forever.** n/a — deferred, not rejected.

---

## SR-1 — Search Runtime Registry

**STATUS: DEFERRED** *(probably unnecessary)*

**Purpose considered.** Declare search-engine index definitions, analysers and field weightings.

**Why it does not exist today.** The **Search Registry** (M8.3d, 12 scopes) already declares scope,
resource, searchable fields, match type, reach and result classification. An index registry would
restate that in engine-specific terms — a second place expressing the same intent.

**What is actually missing** is the search **executor**: nothing runs a query for any of the 12
composed scopes (**M8.3f item 5 remains open**). That is a service, not a registry.

**Prerequisites.** A search executor · evidence that index definitions genuinely cannot be derived
from the existing Search Registry.

**Activation milestone.** Search Runtime — and even then, probably not.

**Dependencies.** Search Registry (exists) · Postgres FTS or an adopted engine · projection layer.

**ACTIVATE WHEN:**
- A dedicated search engine is adopted (the staged plan is **Postgres FTS for the pilot, behind a
  port** — see `architecture-evolution-report.md`)
- **AND** its index definitions demonstrably cannot be derived from the Search Registry
- Both conditions, not either

**Expected runtime consumers.** Search executor only.

**Expected APIs.** `GET /api/search` consumes the **existing** Search Registry; no new contract.

**Expected frontend consumers.** All shells — but they consume `/api/search`, not this.

**Related ADRs.** ADR-0016 · ADR-0015 (cross-organization reach must respect tenant scope).

**Acceptance criteria before activation.**
- **Preserve the schema rule:** cross-organization reach may not return clinical or sensitive results.
  This is declared in the Search Registry today and must not be weakened by an index layer.

**Acceptance criteria after activation.** Index definitions are derived from, and validated against,
the Search Registry — never authored independently.

**Reason if intentionally rejected forever.** Not rejected outright, because an adopted engine could
justify it. But the default answer is **no**: build the executor.

---

## RR-1 — Report Runtime Registry

**STATUS: DEFERRED** *(probably unnecessary)*

**Purpose considered.** Declare the query bindings, data sources and execution parameters behind each
declared report.

**Why it does not exist today.** The **Report Registry** (M8.3d, 10 reports) already declares kind,
audience, classification and source constraints. What is missing is the **execution service** —
nothing runs any of the 10 declared reports.

The binding question is the same one already answered for tools: `tool-invocation.ts` holds the
tool → implementation binding **server-side and nowhere else**, deliberately, so a client cannot
invoke something it was not offered. Report bindings should follow that precedent — a server-side
binding module, not a registry.

**Prerequisites.** A report execution service · a decision on whether bindings follow the
`tool-invocation.ts` precedent.

**Activation milestone.** Reporting Runtime — and even then, probably not as a registry.

**Dependencies.** Report Registry (exists) · Event Registry `analyticsVisible` · projection layer ·
ADR-0010.

**ACTIVATE WHEN:**
- A report execution service exists
- **AND** the number of bindings makes a declarative table clearly better than a server-side module
- If in doubt, follow the `tool-invocation.ts` precedent instead

**Expected runtime consumers.** Report execution service.

**Expected APIs.** `GET /api/reports/:id/run` consuming the **existing** Report Registry.

**Expected frontend consumers.** `organization-web` and `admin-web`.

**Related ADRs.** ADR-0010 (**load-bearing**) · ADR-0016.

**Acceptance criteria before activation.**
- **Do not create an Analytics Registry** — see **RJ-3**. Extend Report.
- Confirm ADR-0010 enforcement still holds: analytics reports source **only** from events marked
  `analyticsVisible`.

**Acceptance criteria after activation.** Every report execution passes through the projection layer;
no report can widen disclosure beyond its declared classification.

**Reason if intentionally rejected forever.** Not rejected outright, but the default answer is **no**:
build the execution service and bind server-side.

---

## CD-1 — Consent Domain Registry

**STATUS: DEFERRED** *(probably unnecessary)*

**Purpose considered.** Express the 11 consent domains as registry data rather than a TypeScript
union.

**Why it does not exist today.** The union works, is exhaustively type-checked, and consent is among
the strongest areas of the platform. Moving it to data would add indirection without adding
capability.

**Prerequisites.** Evidence that consent domains need to vary per tenant or be administrator-authored.

**Activation milestone.** None scheduled.

**Dependencies.** Consent service · granular consent workflows.

**ACTIVATE WHEN:**
- Consent domains must differ **per tenant or per jurisdiction**, **or**
- A regulator requires the domain catalogue as separately versioned evidence

**Expected runtime consumers.** Consent service · PDP.

**Expected APIs.** No change — domains already appear in consent contracts.

**Expected frontend consumers.** No change.

**Related ADRs.** ADR-0007 · ADR-0012.

**Acceptance criteria before activation.** A concrete case where a TypeScript union is genuinely
insufficient. Type safety is a real benefit being traded away.

**Acceptance criteria after activation.** Exhaustiveness checking is preserved by another means; the
PDP still fails closed on an unknown domain.

**Reason if intentionally rejected forever.** n/a — deferred.

---

# Part II — Permanently rejected registries

**Do not recreate these.** Each was decided against with reasons. Reopening any of them requires new
evidence *and* an ADR superseding the decision named below. These entries use a condensed template —
the activation fields are inapplicable by definition.

---

## RJ-1 — Resource Registry · **REJECTED**

- **Purpose considered.** A store of PDP resource metadata.
- **Reason rejected forever.** Redundant. Resource metadata already exists in
  [`docs/data/data-classification.md`](../data/data-classification.md) and
  [`source-of-truth-matrix.md`](./source-of-truth-matrix.md). A second store creates two places to
  express one truth, and they will diverge.
- **Derive instead from.** Data classification + source-of-truth matrix.
- **Decided by.** **AM-4** in `architecture-evolution-report.md`; confirmed frozen-by-removal in the
  Design Freeze checklist.
- **Reopening condition.** New evidence **and** an ADR superseding AM-4.

---

## RJ-2 — Persisted Capability Registry (database table) · **REJECTED**

- **Purpose considered.** Capabilities stored in a database table rather than authored in code.
- **Reason rejected forever.** Capabilities derive from role → permission definitions. A persisted
  store adds operational complexity, a migration path, and a cache-invalidation problem for no gain.
  The code-authored Capability Registry (31 entries, ACTIVE) is the correct realisation.
- **Note.** The **Capability Registry itself exists and is ACTIVE.** What is rejected is *persisting*
  it. Do not read this entry as rejecting capabilities.
- **Decided by.** **AM-4**.
- **Reopening condition.** Capabilities needing to vary per tenant at runtime — which would itself
  need an ADR, since it changes the authorization model.

---

## RJ-3 — Analytics Registry · **REJECTED**

- **Purpose considered.** Define metrics and analytics dashboards.
- **Reason rejected forever.** Already expressed twice over: Report Registry `kind: "analytics"` plus
  the Event Registry's `analyticsVisible` flag structurally enforce ADR-0010 — analytics must be
  aggregated or de-identified, classified `DEIDENTIFIED-OR-AGGREGATED-DATA`, and sourced only from
  events marked analytics-visible. A separate registry would create a second place to express the
  same rule: precisely the drift risk the layer exists to prevent.
- **Build instead.** Extend the Report Registry.
- **Decided by.** M8.3d · ADR-0010.
- **Reopening condition.** A metric-definition need that demonstrably cannot be expressed as a Report
  entry.

---

## RJ-4 — Event Registry as source-of-truth · **REJECTED**

- **What is rejected.** Treating the Event Registry as the **source of truth for events**.
- **Reason rejected forever.** The source of truth for what happened is the **transactional outbox
  and the append-only audit trail** — state, event and audit intent written in one transaction, per
  AM-6. The Event Registry is a **declared contract**: publishers, subscribers, retry policy,
  dead-letter handling, classification, retention and analytics visibility. Contract and record are
  different things, and collapsing them would make the registry authoritative over history it does
  not hold.
- **Note.** The **Event Registry itself exists and is ACTIVE** (12 events). Only the source-of-truth
  reading is rejected.
- **Decided by.** AM-6 (mandatory outbox path, `gates:outbox`) · M8.3b · ADR-0010 (event-consumer
  projection pattern).
- **Reopening condition.** None foreseeable. Event sourcing as a storage strategy would be a
  different decision requiring its own ADR.

---

## RJ-5 — Billing Registry as generic configuration · **REJECTED**

- **Purpose considered.** A general "billing configuration" registry.
- **Reason rejected forever.** Billing is a **service + ledger**. Ledger entries are instance state —
  they record real money movements — and belong in tables governed by ADR-0002, not in a
  code-authored registry. "Billing configuration" as a category is too vague to pass the four-way
  test; it dissolves into pricing (declarative), adjudication (service), and per-tenant terms
  (configuration).
- **Build instead.** Billing **service** + ledger (ADR-0002) + **Tariff Registry (TA-1)** for the
  genuinely declarative half.
- **Decided by.** M8.3f · ADR-0002.
- **Reopening condition.** None. The decomposition above covers every real need identified.

---

## RJ-6 — Pharmacy Registry (as named) · **REJECTED**

- **Purpose considered.** A pharmacy composition or configuration registry.
- **Reason rejected forever.** The pharmacy **composition already exists** — workspace, persona,
  navigation, dashboards, onboarding experiences, search scopes and reports all shipped in M8.3e. A
  "Pharmacy Registry" would duplicate them. The actual blockers are that the **pharmacy domain
  service is absent** and its widgets have no invocable tool (M8.3f item 4 open).
- **Build instead.** Pharmacy **service** + **Formulary reference data (PH-2)** + tool bindings in
  `tool-invocation.ts`.
- **Decided by.** M8.3e / M8.3f.
- **Reopening condition.** None. Anything genuinely declarative belongs in the existing registries.

---

## RJ-7 — Laboratory Registry (as named) · **REJECTED**

- **Purpose considered.** A laboratory composition or configuration registry.
- **Reason rejected forever.** Identical to RJ-6. The laboratory composition shipped in M8.3e; the
  missing pieces are the **laboratory service exposure** and tool bindings for
  `lab-worklist-widget` and `lab-recent-results`.
- **Build instead.** Laboratory service HTTP exposure + **Test Catalogue reference data (LA-2)** +
  tool bindings.
- **Decided by.** M8.3e / M8.3f.
- **Reopening condition.** None.

---

## RJ-8 — Sponsorship Registry (as a new registry) · **REJECTED**

- **Purpose considered.** A sponsorship configuration registry.
- **Reason rejected forever.** Sponsorship composition **already exists across seven registries** —
  capabilities, care-circle role, feature, workspace, persona, report and event — plus nine sponsor
  PDP rules from M8.3f. A new registry would fragment a composition that is already coherent.
- **Build instead.** Sponsorship **domain service** + **Sponsorship Plan & Tier Registry (SP-2)** for
  the declarative part.
- **Decided by.** M8.3f · ADR-0007.
- **Reopening condition.** None.

---

## RJ-9 — Webhook Registry · **REJECTED**

- **Purpose considered.** Declare inbound and outbound webhooks.
- **Reason rejected forever.** The **Integration Registry already models this**: direction, protocol
  (`webhook` and `signed-webhook` are both in the protocol enum), counterparty, classification,
  cross-border flag, auth mode and processor agreement. `payment-webhook` is a live entry today. A
  webhook registry would be a strict subset of an existing registry.
- **Build instead.** Add entries to the Integration Registry. A "Webhook milestone" delivers the
  webhook **executor** and new Integration *entries* — never a new registry.
- **Decided by.** M8.3d.
- **Reopening condition.** None.

---

## RJ-10 — Integration Runtime Registry · **REJECTED**

- **Purpose considered.** Declare the runtime bindings behind each declared integration.
- **Reason rejected forever.** Same shape as RR-1 and SR-1, and the same answer: the **declaration**
  exists (Integration Registry, 9 entries); what is missing is the **executor**, which is a service
  with adapters, retries, circuit breaking and credential handling. Runtime bindings for integrations
  should follow the `tool-invocation.ts` precedent — server-side, in one module, never client-visible.
- **Build instead.** An integration executor service binding the existing declarations.
- **Decided by.** M8.3g (this document), extending the M8.3d reasoning.
- **Reopening condition.** None foreseeable.

---

## RJ-11 — AI Conversation Registry · **REJECTED**

- **Purpose considered.** Store AI conversations.
- **Reason rejected forever.** A conversation is **instance state** — an ordered log of turns tied to
  an actor and a subject, very likely containing PHI. It fails every registry test: not finite, not
  authored, not administrator-editable. Storing it in a code-authored, git-versioned registry file
  would place patient data in the repository.
- **Build instead.** A domain aggregate with its own tables, Event Registry entries
  (`AiConversationStarted` etc.), and a Timeline projection — the established M6 pattern.
- **Decided by.** M8.3f.
- **Reopening condition.** None.

---

## RJ-12 — AI Tool Policy Registry · **REJECTED**

- **Purpose considered.** Declare which tools an AI may use and under what conditions.
- **Reason rejected forever.** **Already implemented.** `resolveToolContract(consumer, ...)` in
  `packages/platform-registry/src/consumer.ts` resolves the tool contract per consumer surface —
  `ui`, `mobile`, `ai`, `automation`, `api`, `offline` — filters by declared surface support, fails
  closed on an inactive composition, reports every withheld tool with a reason, and **forces
  `requiresApproval` for any write tool on the `ai` or `automation` surface**, re-asserted in code so
  a future data change cannot quietly widen the contract. A separate AI tool policy would be a second
  authority over the same question.
- **Build instead.** Extend the Tool Registry's compatibility declarations if a new dimension is
  needed.
- **Decided by.** M8.3d · ADR-0016 §4 ("AI is a consumer, not a parallel platform").
- **Reopening condition.** None. This is the clearest supersession in the document.

---

## RJ-13 — Notification Preference Registry · **REJECTED**

- **Purpose considered.** Per-actor notification channel preferences.
- **Reason rejected forever.** Split across two things that already exist or are already planned:
  **declared** routing lives in `Persona.notificationPreferences` plus the Notification Registry
  (6 routes); **per-actor instance preferences** are user data belonging to a service with tables,
  not a registry.
- **Build instead.** A notification-preference **service**. This is already tracked as a
  non-blocking item in the operational hardening backlog from M6.2.
- **Decided by.** M8.3b / M8.3f.
- **Reopening condition.** None.

---

## RJ-14 — Mobile Capability Registry · **REJECTED**

- **Purpose considered.** A separate registry describing what the mobile app can do.
- **Reason rejected forever.** **Already implemented.** `mobile` is a first-class `ConsumerSurface`
  in `CONSUMER_SURFACES`, with its own `SURFACE_SUPPORT` predicate reading `tool.compatibility
  .supportsMobile`. Mobile resolves composition through exactly the same `/api/me/surface` and
  `resolveToolContract` path as web. A separate mobile registry would **fork the composition** — the
  precise drift the Platform Registry Layer exists to prevent, and it would allow mobile to offer
  something web's PDP would deny.
- **Build instead.** If mobile needs device-specific capabilities (camera, biometrics, offline sync),
  express them as **Capability Registry entries** and **Tool compatibility flags**
  (`supportsOffline` already exists), not as a parallel registry.
- **Decided by.** M8.3a (surface support) · M8.3d (consumer contract) · M8.3g (this verdict).
- **Reopening condition.** None foreseeable. Mobile is a consumer, exactly like AI.

---

## RJ-15 — Video / Real-time Transport Registry · **REJECTED (not a registry)**

- **Purpose considered.** Declare video and real-time transport selection.
- **Reason rejected forever.** This is an **ADR decision and a port**, not a registry. There is one
  transport choice to make, not a catalogue to compose. ADR-0009 defers it deliberately.
- **Build instead.** Decide ADR-0009; implement behind a port.
- **Decided by.** ADR-0009 · `architecture-evolution-report.md` (AM-9).
- **Reopening condition.** If multiple transports must coexist per tenant, that is **tenant
  configuration**, not a registry.

---

# Part III — Chronological activation roadmap

The order below is a **dependency order**, not a schedule. A milestone may be reordered; a
dependency may not be skipped.

```
                        M8.3f (current)
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │  CARRY-FORWARD — no milestone of its own    │
        │  → RC-1  Role Code Registry                 │
        │    (activate at the next milestone that     │
        │     touches composition or tenancy roles)   │
        └─────────────────────────────────────────────┘
                              │
                              ▼
                      PHARMACY MILESTONE
        prereq: pharmacy service · HTTP endpoints ·
                tool bindings (M8.3f item 4) · frontend
        → activate PH-2  Formulary / Medication Catalogue (reference data)
        → Pharmacy Registry stays REJECTED (RJ-6)
                              │
                              ▼
                     LABORATORY MILESTONE
        prereq: laboratory HTTP exposure · tool bindings ·
                LOINC decision · frontend
        → activate LA-2  Test Catalogue (reference data)
        → Laboratory Registry stays REJECTED (RJ-7)
                              │
                              ▼
                  BILLING & SPONSORSHIP MILESTONE
        prereq: billing service · ledger (ADR-0002) ·
                sponsorship service · consent-domain decision
        → activate TA-1  Tariff Registry
        → activate SP-2  Sponsorship Plan & Tier Registry
        → Billing Registry stays REJECTED (RJ-5)
        → Sponsorship Registry stays REJECTED (RJ-8)
                              │
                              ▼
                     PROGRAMMES MILESTONE
        prereq: programme service · tenant config storage ·
                ADR-0007 re-confirmation
        → activate PR-1  Programme Registry (TENANT CONFIGURATION,
                         NOT packages/platform-registry)
                              │
                              ▼
                      COVERAGE MILESTONE
        prereq: coverage service · payer integration
        → activate CO-1  Coverage Registry (TENANT CONFIGURATION)
                              │
                              ▼
                   SEARCH RUNTIME MILESTONE
        prereq: search executor (M8.3f item 5)
        → build the EXECUTOR; Search Registry already exists
        → SR-1 Search Runtime Registry: DEFERRED — activate only if
          an engine is adopted AND indexes cannot be derived
                              │
                              ▼
                     REPORTING MILESTONE
        prereq: report execution service
        → build the EXECUTION SERVICE; Report Registry already exists
        → RR-1 Report Runtime Registry: DEFERRED — prefer the
          tool-invocation.ts server-side binding precedent
        → Analytics Registry stays REJECTED (RJ-3)
                              │
                              ▼
                        AI MILESTONE
        HARD PREREQ: AI Safety ADR ACCEPTED (does not exist today)
                   + clinical sign-off
                   + LLM provider abstraction
                   + prompt runtime
        → activate AI-1  AI Safety Registry        ── first, always
        → activate AI-2  AI Prompt Registry        ── after AI-1
        → activate AI-3  AI Evaluation Registry    ── with AI-2
        → AI-4  Memory Policy Registry: DEFERRED — only if
                cross-session memory is built AND a consent
                domain for it is actually granted
        → AI Conversation Registry stays REJECTED (RJ-11)
        → AI Tool Policy Registry stays REJECTED (RJ-12)
                              │
                              ▼
                     WEBHOOK / INTEGRATION MILESTONE
        → build the INTEGRATION EXECUTOR
        → add Integration Registry ENTRIES (protocol: webhook)
        → Webhook Registry stays REJECTED (RJ-9)
        → Integration Runtime Registry stays REJECTED (RJ-10)
                              │
                              ▼
                      MOBILE EXPANSION
        → NO registry activation. Mobile is already a
          ConsumerSurface with supportsMobile.
        → Mobile Capability Registry stays REJECTED (RJ-14)
                              │
                              ▼
              AUTOMATION MILESTONE (unscheduled)
        → AU-1  Automation Trigger Registry: DEFERRED —
          only if a trigger cannot be a Workflow.automationHook
                              │
                              ▼
           FRONTEND / LOCALISATION MILESTONE
        → activate CR-1  Content Registry for registry copy
          (M8.3f item 8 — ~180 strings)
                              │
                              ▼
              CLINICAL CODING MILESTONE (unscheduled)
        → activate TE-1  Terminology (reference data, licensing first)
                              │
                              ▼
              PLATFORM BUILDER MILESTONE (unscheduled)
        → activate PT-1  Platform Templates
          (all composition-registry dependencies ALREADY satisfied)
```

**Three orderings that must not be violated:**

1. **AI-1 before AI-2 before AI-3.** A prompt without a safety profile is an unreviewed clinical
   policy. The AI Safety **ADR** precedes all three and does not yet exist.
2. **TA-1 before SP-2.** A sponsorship tier without a price is meaningless.
3. **Service before catalogue, everywhere.** PH-2, LA-2 and TE-1 are reference data for services that
   must already exist. A catalogue with no consumer is the "filter that lies" failure mode.

---

## Registry Activation Checklist

Run the relevant block **before writing code** for each milestone.

### Before the **AI Platform** milestone
- [ ] Read **AI-1**, **AI-2**, **AI-3**, **AI-4**, **RJ-11**, **RJ-12**.
- [ ] Re-read ADR-0016 §4 — AI is a **consumer**. Do **not** create an AI capability surface or a
      parallel AI tool registry.
- [ ] Confirm an **AI safety ADR exists and is ACCEPTED**, and clinical sign-off is recorded, before
      any prompt ships.
- [ ] Verify `resolveToolContract(consumer: "ai")` still forces `requiresApproval` on every write
      tool.
- [ ] Confirm evaluation fixtures are synthetic only.

### Before the **Pharmacy** milestone
- [ ] Read **PH-2** and **RJ-6**. The gap is the pharmacy *service*, not a registry.
- [ ] Decide the Formulary source (NAFDAC) and its refresh path — reference data, **not**
      `gates:registry`.
- [ ] Bind pharmacy widgets to real tools in `tool-invocation.ts` (**M8.3f item 4 remains open**).
- [ ] Only then move the `pharmacy` workspace off `invite-only` if it was gated.

### Before the **Laboratory** milestone
- [ ] Read **LA-2** and **RJ-7**. Decide the Test Catalogue source and LOINC mapping.
- [ ] Bind `lab-worklist-widget` and `lab-recent-results` to real tools.
- [ ] Confirm the result-release policy governs what a patient sees and when.

### Before **Billing & Sponsorship**
- [ ] Read **TA-1**, **SP-2**, **RJ-5**, **RJ-8**.
- [ ] Do **not** create a "Billing Registry" — build the service + ledger (ADR-0002) and, separately,
      the Tariff Registry.
- [ ] Re-read the **nine sponsor PDP rules** (M8.3f) before widening them; confirm least privilege
      still holds, especially the **upload-only, no-read document rule**.
- [ ] Revisit **per-capacity consent domains** (`sponsor-participation`) — reverted in M8.3f because
      nothing grants them. This needs a consent-grant change at relationship creation.

### Before **Programmes** (Employer / NGO / Government) and **Coverage** (Insurer)
- [ ] Read **PR-1** and **CO-1**. Build as **tenant configuration**, not entries in
      `packages/platform-registry`.
- [ ] Confirm ADR-0007 payer/clinical separation still holds for the new surfaces.
- [ ] Confirm every payer-visible field passes through the M8.1 projection layer.

### Before **Search runtime**
- [ ] Read **SR-1**. The Search *Registry* exists; the **executor** does not (M8.3f item 5).
- [ ] Preserve the schema rule: cross-organization reach may not return clinical or sensitive
      results.

### Before **Reporting runtime**
- [ ] Read **RR-1** and **RJ-3**. Do **not** create an Analytics Registry — extend Report.
- [ ] Prefer the `tool-invocation.ts` server-side binding precedent over a bindings registry.
- [ ] Confirm ADR-0010 enforcement holds: analytics sourced only from `analyticsVisible` events.

### Before **Webhook / Integration runtime**
- [ ] Read **RJ-9** and **RJ-10**. Add **Integration Registry entries**, not a new registry.
- [ ] Build the executor; keep bindings server-side.

### Before **Automation**
- [ ] Read **AU-1**. If anything is built, keep it to an Automation **Trigger** registry.
- [ ] Confirm approval semantics for unattended writes are unchanged.

### Before any **composition or tenancy-role** milestone
- [ ] Read **RC-1** — move `ROLE_CODE_PERSONA_ALIASES` out of `acting-context-resolver.ts` into
      registry data. **This is the only composition mapping still hardcoded.**

### Before the **frontend / localisation** milestone
- [ ] Read **CR-1** — activate the existing Content Registry for registry copy (~180 strings,
      M8.3f item 8).

### Before **Mobile expansion**
- [ ] Read **RJ-14**. Mobile is already a `ConsumerSurface`. Do **not** create a mobile registry.
- [ ] Express device capabilities as Capability entries and Tool compatibility flags.

### Before proposing **any** new registry
- [ ] Check the [What already exists](#what-already-exists--status-active) table — **17 registries
      exist**.
- [ ] Check **Part II** — fifteen registries are permanently rejected.
- [ ] Apply the four-way test. If it is **per-tenant**, **externally sourced**, or **instance state**,
      it is **not a registry**.
- [ ] Confirm something can actually **execute** what it declares. A registry whose entries have no
      runtime is worse than no registry — it produces a surface that lies.
- [ ] Check the standing caveat: composition already declares more than the runtime executes. Do not
      widen that gap.

---

## Maintenance

Update this document when a registry is **created**, **activated**, or when a verdict **changes** —
particularly when a `DEFERRED` becomes justified, since that reversal is the most valuable thing to
capture.

- Move activated entries into the [What already exists](#what-already-exists--status-active) table
  rather than deleting them, so the reasoning survives.
- When a `REJECTED` entry is reopened, record the new evidence and the superseding ADR **in place** —
  never by quietly deleting the rejection.
- Keep the [chronological roadmap](#part-iii--chronological-activation-roadmap) in dependency order.
  If a milestone is reordered, verify the three inviolable orderings still hold.
