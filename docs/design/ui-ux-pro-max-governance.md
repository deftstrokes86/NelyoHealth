# P00-14 UI UX Pro Max Governance

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, design, security, architecture, QA, accessibility, privacy, legal/compliance, clinical safety, and operations owners |
| Scope | Third-party skill governance, review controls, and Phase 1 handoff only |
| Exclusions | No UI UX Pro Max installation, global installer, repository skill installation, AGENTS.md workflow, generated design output, components, routes, fixtures, or production copy |
| Related decisions | REQ-NFR-061 through REQ-NFR-065 |

## Primary Source Checks

| Source | Issuer | Date checked | Capability confirmed | Version-sensitive detail | Phase 1 verification action | Security or supply-chain concern |
| --- | --- | --- | --- | --- | --- | --- |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Next Level Builder | 2026-06-24 | Primary UI UX Pro Max repository | Default branch `main`; head inspected at `bdf1179bcf641cca49ee7a5f76df14c3015fd38c`; latest release observed as `v2.6.5` | Re-check latest release/commit before any install and pin exact commit | Third-party source must be reviewed before use |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md | Next Level Builder | 2026-06-24 | Skill declares design-intelligence use cases and rule categories | Skill content can change by commit | Review exact pinned `SKILL.md` before project-local install | Skill output is advisory and must not override NelyoHealth requirements |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/cli/assets/scripts | Next Level Builder | 2026-06-24 | CLI scripts exist for search/design-system behavior | Script behavior is commit-sensitive | Review Python/script behavior before installation or invocation | Scripts may read/write files or generate unapproved artifacts |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/cli/assets/data | Next Level Builder | 2026-06-24 | Data CSVs exist for colors, typography, UX, product types, charts, and stack guidance | Data may include unlicensed or inappropriate recommendations | Review data files before relying on recommendations | Data can suggest fonts/assets/styles needing license/accessibility review |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/main/cli/assets/templates | Next Level Builder | 2026-06-24 | Templates exist for multiple AI tools, including Codex | Template behavior is commit-sensitive | Review Codex template and generated paths | Template may introduce unsupported workflow files if unreviewed |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/README.md | Next Level Builder | 2026-06-24 | CLI documents `uipro init --ai codex` and default GitHub download behavior | CLI README states global npm install and latest-release download by default | Prefer reviewed project-local install; block automatic unreviewed latest updates | Default global install/update behavior is not approved for NelyoHealth |
| Repository license metadata and license file | Next Level Builder | 2026-06-24 | Repository metadata/license file observed as MIT | `cli/README.md` states CC-BY-NC-4.0 for CLI | Resolve license inconsistency before installation | Conflicting license statements require legal review |
| Codex manual, Agent Skills | OpenAI | 2026-06-24 | Codex skills are `SKILL.md` directories; repo-scoped skills are discoverable under `.agents/skills`; skills are distinct from plugins and AGENTS.md | Codex skill mechanics can change | Verify current Codex-compatible project-local skill install path | Do not introduce AGENTS.md or global skill install without approval |

## Tool Status

UI UX Pro Max is a third-party design-intelligence skill. It is not an authoritative NelyoHealth product specification. It is not a clinical, privacy, legal, accessibility, or regulatory authority. Its output is advisory. NelyoHealth documentation and approved design decisions override it. It is not installed during P00-14. Phase 1 installation requires security and supply-chain review.

## Requirement Matrix

| Requirement ID | Purpose | Affected page or journey class | Affected audience | Design or content owner | Accessibility impact | Privacy impact | Clinical or safety impact | Browser validation | Automated validation | Approval status | Implementation phase | Pilot gate effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UXP-REQ-001 | Treat UI UX Pro Max as advisory only | Design research and review | Product, design, frontend, QA | Design Owner | Recommendations must be accessibility-reviewed | Recommendations must not weaken privacy | Recommendations must not decide clinical safety | Review-record inspection | Governance checklist | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unreviewed skill authority |
| UXP-REQ-002 | Require project-local reviewed installation | Skill installation and invocation | Codex users and reviewers | Security Owner + Architecture Owner | Installed skill must not bypass accessibility review | Skill must not access production data | Skill must not generate clinical claims | Install review in Phase 1 | Supply-chain checklist | REQUIRES_APPROVAL | Phase 1 | Blocks global or unpinned install |
| UXP-REQ-003 | Pin exact release or commit and record provenance | Skill versioning | Design, engineering, QA | Security Owner | Repeatable review requires version identity | Prevents silent behavior drift | Prevents unreviewed clinical/legal output changes | Version evidence review | Version policy check | REQUIRES_APPROVAL | Phase 1 | Blocks unpinned skill use |
| UXP-REQ-004 | Require two-pass design intelligence and implementation review | Major interfaces | All users | Design Owner + Product Owner | Accessibility reviewed before and after implementation | Privacy states reviewed in browser | Clinical/emergency surfaces get domain review | Browser implementation review | Review-record checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks major page acceptance if skipped |
| UXP-REQ-005 | Prohibit skill authority over governed copy and regulated claims | Clinical, emergency, consent, privacy, financial, HMO, provider, medication, result, legal, regulatory content | Patients, clinicians, payers, operators | Content Owner + Domain Owner | Prevents inaccessible or misleading copy | Prevents privacy notice/disclosure drift | Prevents unsafe clinical guidance | Content review gate | Claim and owner checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unapproved content promotion |
| UXP-REQ-006 | Control raw skill output artifacts | Design research outputs | Design, product, engineering | Design Owner + Security Owner | Outputs must be reviewed before use | Outputs may contain sensitive prompts or screenshots | Outputs may include unsafe copy requiring review | Artifact review | Artifact path/scanner checks | REQUIRES_APPROVAL | Phase 1 | Blocks uncontrolled artifact storage |
| UXP-REQ-007 | Confirm no AGENTS.md workflow is required | Codex workflow design | Engineering and Codex operators | Architecture Owner | Prevents unsupported workflow coupling | Reduces accidental broad instruction scope | Avoids agent workflow confusion | Governance review | Repository scan | REQUIRES_APPROVAL | Phase 1 | Blocks unsupported orchestration files |

## Installation Policy

Phase 1 must verify the current primary repository, current stable release or commit, licence, `SKILL.md`, scripts, data files, templates, installer behavior, network access, filesystem access, generated files, and Codex-compatible project-local installation mechanism. It must pin an exact release or commit, record version and commit, record checksums where practical, prevent automatic unreviewed updates, remove or disable unnecessary scripts, verify Codex IDE invocation, and confirm no AGENTS.md file is required. A Codex Skill and an autonomous agent workflow are not the same thing.

## Required Invocation Points

UI UX Pro Max must be used for initial design-system exploration, visual-direction review, typography and palette exploration, component-pattern review, dashboard-layout review, responsive-layout review, page-level design review, accessibility and UX heuristic review, pre-implementation design pass, and post-implementation browser review.

## Two-Pass Rule

### Pass A: Design Intelligence

Before implementation, use the skill to identify suitable design patterns, evaluate hierarchy, evaluate density, evaluate color and typography direction, identify usability risks, and produce recommendations.

### Pass B: Implementation Review

After implementation, open the actual page in the browser, compare it with the approved design specification, check desktop/tablet/mobile, check required states, check motion, check reduced motion, check content hierarchy, check accessibility, record defects, and iterate until the acceptance gate passes.

## Skill Output Handling

Raw skill output must be treated as unapproved design research, stored only in controlled artifact locations, excluded from production bundles, reviewed before promotion into canonical design documents, and prevented from silently overwriting NelyoHealth decisions. It must not introduce unlicensed fonts/assets, inaccessible colors, unsupported clinical or legal copy, fake statistics, dark patterns, or arbitrary frameworks/dependencies.

## Prohibited Authority

UI UX Pro Max must not independently decide clinical wording, emergency wording, consent wording, privacy notices, refund promises, wallet terminology, HMO or insurance claims, provider licensing claims, medication advice, result interpretation, legal statements, regulatory statements, or patient eligibility.

## Review Record

Every invocation later used to support a design decision must record skill version, skill commit, date, task, query, page/component, output summary, accepted recommendations, rejected recommendations, reason, reviewer, and related design decision.
