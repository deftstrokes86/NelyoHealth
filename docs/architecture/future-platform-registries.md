# NelyoHealth — Registry Activation Roadmap

## Document Control

| Field | Value |
|---|---|
| Document | `docs/architecture/future-platform-registries.md` |
| Kind | Permanent architectural memory — deferred and rejected registry decisions |
| Authority | Advisory. It records DECISIONS and their reasons; it does not itself authorise building anything. |
| Owner role | Principal Architect + Technical Governance Lead |
| Created | 2026-08-01 (after M8.3f) |
| Related | [ADR-0016](../adr/ADR-0016-platform-registry-layer.md) · [ADR-0007](../adr/ADR-0007-payer-and-clinical-access-separation.md) · [ADR-0010](../adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md) · [ADR-0009](../adr/ADR-0009-video-platform-decision-deferred.md) · [ADR-0002](../adr/ADR-0002-wallet-as-ledger-backed-balance.md) · [architecture-evolution-report.md](./architecture-evolution-report.md) |

> **Why this document exists.** M8.3a–M8.3f built, rejected, superseded, and deferred a lot of
> registry ideas across many separate conversations. Without a written record, a future milestone
> will either **rediscover** an idea already decided against (and rebuild something deliberately
> removed), or **forget** one that was genuinely needed. This is the authoritative list of both.
>
> It is equally a defence against over-building. Several entries below say *"do not build this"* —
> that verdict is as load-bearing as the ones that say *"build this later"*.

---

## The distinction that governs this whole document

The single most common error during M8.x was calling something a **registry** when it was actually a
**domain service** or **reference data**. Getting this wrong produces registries that declare things
nothing can execute — the "filter that lies" failure mode caught twice during review.

| Kind | Definition | Test | Example |
|---|---|---|---|
| **Registry** | Declarative, JSON-serialisable data that says what the platform COMPOSES or OFFERS. Finite, authored, versioned with the code, cross-validated by `gates:registry`. | *Would an administrator edit this in a platform builder?* | Navigation, Dashboard, Persona |
| **Domain service** | Code + tables that DO something and hold instance state. | *Does it write rows describing real-world events?* | Pharmacy dispensing, billing ledger |
| **Reference data** | Externally-sourced catalogues, large and updated on someone else's schedule. | *Does a third party publish it?* | LOINC, ICD-10, NAFDAC formulary |
| **Tenant configuration** | Per-organization settings; shape is common, values differ per tenant. | *Does each tenant need a different value?* | An employer's benefit rules |

**Rule of thumb:** if it is per-tenant, externally sourced, or instance state, it is **not** a registry.
Most items on the "future registries" wish-list fail this test — see the verdicts below.

---

## What already exists (do not rebuild)

Fifteen registries shipped in `packages/platform-registry`, plus two outside it. Recorded here so a
future milestone does not propose one of them as new.

| Registry | Milestone | Notes |
|---|---|---|
| Capability | M8.3a | Structured `resource.action` vocabulary; the unifying primitive |
| Tool | M8.3a | Shared contract for UI / Mobile / AI / Automation / Integration |
| Workspace | M8.3a | Includes the 7 organization types; `organization_type` column resolves it |
| Persona | M8.3a | 11 personas, each with a full composition |
| Care Circle | M8.3b | Roles + `composesAsPersona` / `composesInWorkspace` / `compositionPriority` |
| Workflow | M8.3b | Generic state/transition engine |
| Event | M8.3b | Formalises the M6 Event Platform contract |
| Feature | M8.3b | Org-available features, distinct from feature flags |
| Notification | M8.3b | Declarative event → audience → channel routing |
| Navigation | M8.3c | Hierarchy, sections, badge sources |
| Dashboard | M8.3c | Widget-level composition |
| Experience | M8.3c | `onboarding` / `homepage-section` / `profile` |
| Search | M8.3d | Scopes with reach + result classification |
| Report | M8.3d | ADR-0010 enforced structurally |
| Integration | M8.3d | Every inbound/outbound boundary |
| **Scope Registry** | M8.2 | `packages/database/scope-registry.*` — tenancy, not composition |
| **Content Registry** | P05 | `packages/content-registry` — marketing copy today; see CR-1 below |

---

## Deferred, rejected, and superseded registries

Status vocabulary:

- **Create Later** — should definitely exist; the milestone that needs it is named.
- **Activate Later** — already exists in some form; needs extending or wiring, not creating.
- **Probably Unnecessary** — might never be justified; reasoning recorded so it is not rebuilt on instinct.
- **Superseded** — the need is already met by something that exists.
- **Rejected** — a deliberate decision NOT to build it. Do not reopen without new evidence.

### Summary table

| Registry | Purpose | Status | Planned Milestone | Dependencies | Notes |
|---|---|---|---|---|---|
| AI Prompt Registry | Versioned prompts, model bindings, safety constraints | **Create Later** | AI Platform (M10.x) | Tool Registry, ADR for AI safety, clinical-safety sign-off | Prompts are regulatory evidence; versioning is the point |
| AI Conversation Registry | Store AI conversations | **Probably Unnecessary** | — | — | Conversations are instance state, not declarations. Build as a domain aggregate + projection |
| Automation Registry | Declare automated jobs | **Mostly Superseded** | Automation (M10.x) | Workflow, Tool, Event | Only the *trigger/schedule* is missing; see AU-1 |
| Analytics Registry | Define metrics/dashboards for analytics | **Superseded** | — | — | Report Registry (`kind: analytics`) + Event `analyticsVisible` already do this under ADR-0010 |
| Webhook Registry | Declare inbound/outbound webhooks | **Superseded** | — | — | Integration Registry already models `protocol: webhook` (`payment-webhook` exists) |
| Billing Registry | Billing configuration | **Rejected as named** | — | — | Billing is a service + ledger (ADR-0002). See BI-1 for the one registry-shaped part |
| Tariff / Price Registry | Service → price, per payer | **Create Later** | Billing & Payments | Billing service, ADR-0007 | The genuinely declarative half of "Billing Registry" |
| Sponsorship Registry | Sponsorship configuration | **Mostly Superseded** | Sponsorship service | Billing service | Composition already exists end-to-end; see SP-1 |
| Sponsorship Plan/Tier Registry | What can be sponsored, at what cadence | **Create Later** | Billing & Sponsorship | Tariff Registry | Declarative and finite — a real candidate |
| Pharmacy Registry | Pharmacy configuration | **Rejected as named** | — | — | Missing piece is the pharmacy *service*; see PH-1 |
| Formulary / Medication Catalogue | Dispensable medications | **Create Later (as reference data)** | Pharmacy | Pharmacy service, NAFDAC source | External data, not a composition registry |
| Laboratory Registry | Lab configuration | **Rejected as named** | — | — | Missing piece is the laboratory *service* |
| Test Catalogue | Orderable tests + specimen rules | **Create Later (as reference data)** | Laboratory | Laboratory service, LOINC mapping | External data |
| Programme Registry | Employer/NGO/government programme rules | **Create Later (as tenant config)** | Programmes | Programme service, tenancy | Per-tenant values ⇒ configuration, not a global registry |
| Coverage / Plan Registry | Insurer plans, eligibility | **Create Later (as tenant config)** | Coverage | Payer integration (ADR-0007) | Same shape as Programme |
| Platform Templates | Compose workspaces+personas+features into a deployment | **Create Later** | Platform Builder | All composition registries (done) | Named as roadmap in ADR-0016 |
| Terminology / Code System Registry | SNOMED / ICD-10 / LOINC | **Create Later (as reference data)** | Clinical Coding | Clinical records service | Regulatory dependency; large external data |
| Role Code Registry | Tenancy role code → persona mapping | **Activate Later** | Next composition milestone | Persona Registry | Currently a **code map**; see RC-1 — highest-priority item here |
| Consent Domain Registry | Consent domains as data | **Probably Unnecessary** | — | — | 11 domains as a TS union works; revisit only if domains become tenant-specific |
| Notification Preference Registry | Per-actor channel preferences | **Superseded** | — | — | `Persona.notificationPreferences` + Notification Registry. Instance-level prefs are a service |
| Resource Registry | PDP resource metadata | **Rejected** | — | — | Removed by AM-4; derive from `data-classification.md` + `source-of-truth-matrix.md` |
| Persisted Capability Registry | Capabilities in a database table | **Rejected** | — | — | Removed by AM-4; capabilities are code data |
| Video / Real-time Transport | Transport selection | **Not a registry** | ADR-0009 decision | — | An ADR and a port, not a registry |
| Search Index Registry | Search engine index definitions | **Probably Unnecessary** | Search runtime | Search Registry (done) | Postgres FTS first; revisit only if an engine is adopted |

---

### Detailed entries

#### RC-1 — Role Code Registry · **Activate Later** · *highest priority*

- **Purpose.** Map a tenancy `roleCode` to a Persona Registry id.
- **Why needed.** M8.3e introduced `ROLE_CODE_PERSONA_ALIASES` as a **hardcoded map in
  `apps/api/src/acting-context-resolver.ts`**. That is exactly the kind of data the Platform Registry
  Layer exists to hold, and it is currently the only composition mapping still living in code.
- **Why deferred.** M8.3e was already large; the map is small and correct, and moving it needed no
  runtime change to work.
- **Milestone.** The next milestone that touches composition or tenancy roles. Do not let it drift.
- **Dependencies.** Persona Registry (exists).
- **Verdict.** Should definitely exist later — likely a field on the Persona Registry
  (`matchesRoleCodes: string[]`) rather than a new registry.

#### AI-1 — AI Prompt Registry · **Create Later**

- **Purpose.** Versioned prompts/system instructions, model bindings, temperature and safety
  constraints, and the capability each prompt is allowed to exercise.
- **Why needed.** ADR-0016 §4 fixes that *AI is a consumer, not a parallel platform* — AI actions come
  from the Tool Registry via `resolveToolContract(consumer: "ai")`, already built. But prompts are
  genuinely different data: in a clinical setting a prompt version is **regulatory evidence** of what
  the system was instructed to do at the time of an interaction.
- **Why deferred.** No AI capability exists in the platform. M8.3f was explicitly told "AI summaries —
  when AI exists"; inventing a prompt registry with no consumer would have been architecture for its
  own sake.
- **Milestone.** AI Platform. **Must not start without an AI safety ADR** and clinical sign-off.
- **Dependencies.** Tool Registry (done), consumer contract (done), AI safety ADR (does not exist),
  `docs/clinical/clinical-safety-model.md` review.
- **Verdict.** Should definitely exist later. Do **not** create an "AI capability" surface — that was
  explicitly rejected by ADR-0016 §4.

#### AI-2 — AI Conversation Registry · **Probably Unnecessary**

- A conversation is **instance state** — an ordered log of turns tied to an actor and subject. It
  fails every registry test: it is not finite, not authored, not administrator-editable.
- **Correct home:** a domain aggregate with its own table, an Event Registry entry
  (`AiConversationStarted` etc.), and a Timeline projection — the M6 pattern.
- **Verdict.** Might never be necessary *as a registry*. Recorded here so it is not created as one.

#### AU-1 — Automation Registry · **Mostly Superseded**

- Already covered: `resolveToolContract(consumer: "automation")` (M8.3d), `Workflow.automationHooks`
  (M8.3b), and the rule that an automation-exposed write **must** require approval (gate-enforced).
- **Genuinely missing:** a declaration of *triggers* — schedule, event, or threshold — binding a
  Workflow transition or Tool to an automatic invocation.
- **Verdict.** If built, keep it narrow: an **Automation Trigger** registry, not a general one.
  Anything broader duplicates Workflow + Tool.
- **Milestone.** Automation. **Dependencies:** worker backplane (exists), Event Registry (exists).

#### AN-1 — Analytics Registry · **Superseded**

- Report Registry `kind: "analytics"` already enforces ADR-0010 structurally: analytics must be
  aggregated or de-identified, classified `DEIDENTIFIED-OR-AGGREGATED-DATA`, and sourced only from
  events marked `analyticsVisible`.
- A separate analytics registry would create a second place to express the same rule — the precise
  drift risk the layer exists to prevent.
- **Verdict.** Do not create. If a distinct *metric definition* need appears, extend Report first.

#### WH-1 — Webhook Registry · **Superseded**

- Integration Registry already models direction, protocol (`webhook`), counterparty, classification,
  cross-border flag, auth mode, and processor agreement. `payment-webhook` is a live entry.
- **Verdict.** Do not create. Add webhook entries to Integration.

#### BI-1 — Billing Registry · **Rejected as named** → Tariff/Price Registry **Create Later**

- "Billing" is a **service + ledger**: ADR-0002 (wallet as ledger-backed balance),
  `docs/finance/ledger-principles.md`, `docs/finance/funds-flow.md`. Ledger entries are instance state.
- The registry-shaped part is a **Tariff / Price Registry**: service → price, per payer, with
  effective dates. Finite, authored, administrator-editable — it passes the test.
- **Milestone.** Billing & Payments. **Dependencies:** billing service, ADR-0007 payer separation.

#### SP-1 — Sponsorship Registry · **Mostly Superseded**

- Already exists across the layer: `sponsorship.read` / `.fund` capabilities, `diaspora-sponsor`
  care-circle role, `diaspora-sponsorship` feature, `diaspora-household` workspace,
  `diaspora-sponsor` persona, `sponsorship-statement` report, `CareSponsorshipFunded` event, and
  nine sponsor PDP rules (M8.3f, ADR-0007 extension).
- **Genuinely missing:** the sponsorship **domain service** and its tables — not a registry.
- **Possible registry later:** Sponsorship **Plan/Tier** (what may be sponsored, at what cadence,
  with what caps). Declarative and finite.
- **Milestone.** Billing & Sponsorship.

#### PH-1 / LA-1 — Pharmacy and Laboratory Registries · **Rejected as named**

- Both workspaces, personas, navigation, dashboards, onboarding, search scopes and reports already
  exist (M8.3e). The blocker is that **`pharmacy` and `laboratory` domain services are absent**, so
  their widgets have no invocable tool (M8.3f item 4, not done).
- What is registry-shaped is **reference data**, not composition:
  - **Formulary / Medication Catalogue** — dispensable medications, sourced from NAFDAC.
  - **Test Catalogue** — orderable tests, specimen and turnaround rules, LOINC-mapped.
- Both are large, externally-published, and updated on someone else's schedule ⇒ a reference-data
  service with its own refresh path, **not** a code registry validated by `gates:registry`.
- **Milestone.** Pharmacy / Laboratory domain milestones.

#### PR-1 / CO-1 — Programme and Coverage Registries · **Create Later (as tenant configuration)**

- Employer, NGO, government programmes and insurer plans are declarative — eligibility, benefits,
  enrolment, caps — but **every tenant's values differ**. That makes them tenant configuration rows,
  not a global registry authored with the code.
- The Workspace/Persona/Feature composition for all four org types already exists (M8.3e).
- **Milestone.** Programmes / Coverage. **Dependencies:** programme + coverage services, tenancy
  scoping (exists), ADR-0007.
- **Watch for:** the temptation to add them to `packages/platform-registry`. Do not — a registry there
  is global and code-authored; these are per-tenant and admin-authored.

#### PT-1 — Platform Templates · **Create Later**

- Named as roadmap in ADR-0016 ("the composition layer above the registries"): a template selects and
  configures workspaces, personas, features, workflows and notifications into a ready-to-run
  deployment (Hospital, Employer, Insurer, NGO, Government, Research, Diaspora Family).
- **Why deferred.** Pointless before the registries it composes existed. They now do.
- **Dependencies.** All composition registries — **satisfied as of M8.3d**.
- **Verdict.** Should definitely exist later; it is the natural next step toward an administrator-run
  platform builder.

#### CR-1 — Content Registry (i18n) · **Activate Later** · *carried over from M8.3f*

- `packages/content-registry` **already exists** for marketing copy.
- M8.3f item 8 (move user-facing registry copy into it so experiences are localisable) was **not
  done**. Roughly 180 `label` / `description` strings across Navigation, Dashboard, Experience,
  Search and Report are developer-authored English inside the registry files.
- **Verdict.** Activate, do not create. **Milestone:** the first milestone with a localisation or
  non-English requirement — or the frontend milestone, whichever is first.

#### SI-1 — Search Index Registry · **Probably Unnecessary**

- **Purpose considered.** Declare index definitions, analysers and field weightings for a search
  engine.
- **Why it is probably unnecessary.** The Search Registry (M8.3d) already declares the scope,
  resource, searchable fields, match type, reach and result classification. An index registry would
  restate those in engine-specific terms — a second place expressing the same intent.
- **What is actually missing** is the search **executor**: nothing runs a query for any of the 12
  composed scopes (M8.3f item 5, not done). That is a service, not a registry.
- **Revisit only if** a dedicated engine is adopted and its index definitions genuinely cannot be
  derived from the Search Registry. The staged plan in `architecture-evolution-report.md` is Postgres
  FTS for the pilot, behind a port.

#### TE-1 — Terminology / Code System Registry · **Create Later (as reference data)**

- SNOMED CT, ICD-10, LOINC. A regulatory dependency for clinical coding and interoperability
  (`docs/compliance/obligations-register.md`).
- Reference data, externally versioned. Same treatment as Formulary and Test Catalogue.

#### RJ-1 — Registries deliberately REMOVED (do not reopen)

Both were removed by **AM-4** in `architecture-evolution-report.md` and confirmed frozen-by-removal in
the Design Freeze checklist:

| Removed | Why | Derive instead from |
|---|---|---|
| **Resource Registry** | Redundant — PDP resource metadata already exists elsewhere | `docs/data/data-classification.md` + `docs/architecture/source-of-truth-matrix.md` |
| **Persisted Capability Registry** | Capabilities derive from role→permission definitions; a persisted store adds complexity for no gain | The code-authored Capability catalog |

Reopening either requires new evidence and an ADR superseding AM-4.

---

## Registry Activation Checklist

Run the relevant block **before writing code** for each milestone. Each line names what to read and
the decision to re-test.

### Before the **AI Platform** milestone
- [ ] Read **AI-1** (Prompt Registry) and **AI-2** (Conversation Registry).
- [ ] Re-read ADR-0016 §4 — AI is a consumer. Do **not** create an AI capability surface or a parallel
      AI tool registry.
- [ ] Confirm an **AI safety ADR** exists and clinical sign-off is recorded before any prompt ships.
- [ ] Verify `resolveToolContract(consumer: "ai")` still enforces approval on every write tool.

### Before the **Pharmacy** milestone
- [ ] Read **PH-1**. The gap is the pharmacy *service*, not a registry.
- [ ] Decide the Formulary source (NAFDAC) and its refresh path — reference data, not `gates:registry`.
- [ ] Bind pharmacy widgets to real tools in `tool-invocation.ts` (M8.3f item 4 remains open).
- [ ] Only then move the `pharmacy` workspace off `invite-only` if it was gated.

### Before the **Laboratory** milestone
- [ ] Read **LA-1**. Decide the Test Catalogue source and LOINC mapping.
- [ ] Bind `lab-worklist-widget` and `lab-recent-results` to real tools.

### Before **Billing & Sponsorship**
- [ ] Read **BI-1**, **SP-1**, and the Tariff/Price entry.
- [ ] Do not create a "Billing Registry" — build the service + ledger (ADR-0002) and, separately, the
      Tariff Registry.
- [ ] Re-read the nine sponsor PDP rules (M8.3f) before widening them; confirm least privilege still
      holds, especially the **upload-only, no-read** document rule.
- [ ] Revisit **per-capacity consent domains** (`sponsor-participation`) — reverted in M8.3f because
      nothing grants them. This needs a consent-grant change at relationship creation.

### Before **Programmes** (Employer / NGO / Government) and **Coverage** (Insurer)
- [ ] Read **PR-1** / **CO-1**. Build as **tenant configuration**, not entries in
      `packages/platform-registry`.
- [ ] Confirm ADR-0007 payer/clinical separation still holds for the new surfaces.

### Before **Search runtime**
- [ ] Read **SI-1** (Search Index Registry — probably unnecessary). The Search *Registry* exists; the
      executor does not.
- [ ] Preserve the schema rule: cross-organization reach may not return clinical or sensitive results.

### Before **Reporting runtime**
- [ ] Read **AN-1**. Do not create an Analytics Registry — extend Report.
- [ ] Confirm ADR-0010 enforcement still holds: analytics sourced only from `analyticsVisible` events.

### Before **Automation**
- [ ] Read **AU-1**. If anything is built, keep it to an Automation **Trigger** registry.

### Before any **composition or tenancy-role** milestone
- [ ] Read **RC-1** — move `ROLE_CODE_PERSONA_ALIASES` out of `acting-context-resolver.ts` into
      registry data. This is the only composition mapping still hardcoded.

### Before the **frontend / localisation** milestone
- [ ] Read **CR-1** — activate the existing Content Registry for registry copy.

### Before proposing **any** new registry
- [ ] Check the "already exists" table — 17 registries exist.
- [ ] Check **RJ-1** — Resource and persisted Capability registries were deliberately removed.
- [ ] Apply the four-way test at the top of this document. If it is per-tenant, externally sourced, or
      instance state, **it is not a registry**.
- [ ] Confirm something can actually execute what it declares. A registry whose entries have no
      runtime is worse than no registry — it produces a surface that lies.

---

## Maintenance

Update this document when a registry is **created**, **activated**, or when a verdict **changes** —
particularly when a "Probably Unnecessary" becomes justified, since that reversal is the most
valuable thing to capture. Move activated entries into the "already exists" table rather than
deleting them, so the reasoning survives.
