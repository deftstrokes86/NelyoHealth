# P00-14A Design and Content Validation

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | QA Owner + Design Owner + Content Owner |
| Required reviewers | Product, Design, Content, Accessibility, Privacy, Security, Clinical Safety, Legal, Finance, Operations, QA, and domain owners where relevant |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, QA, and affected domain owners |
| Related decisions | REQ-DES-019, REQ-DES-020, REQ-CNT-038, REQ-CNT-039 |
| Related open questions | OQ-00-656 through OQ-00-673 |
| Non-implementation notice | Proposed validation specification only; no tests, browser tooling, Playwright config, UI, conformance, dependencies, assets, or production copy. |
| Change control | Changes require owner review, register updates, and orchestration acceptance. |
## Automated Validation

| Validation ID | Layer | Check | Gate effect | Data rule |
|---|---|---|---|---|
| DCT-TST-013 | Automated | Page ID exists | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-014 | Automated | Section ID exists | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-015 | Automated | Content key resolves | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-016 | Automated | Component contract matches | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-017 | Automated | CTA label matches action | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-018 | Automated | Route exists | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-019 | Automated | Required states have content | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-020 | Automated | Only approved content ships | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-021 | Automated | Superseded content is absent | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-022 | Automated | Filler/prohibited copy is absent | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-023 | Automated | Unsupported claims are absent | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-024 | Automated | Heading hierarchy is valid | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-025 | Automated | Links resolve | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-026 | Automated | No role leakage | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-027 | Automated | No patient leakage | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-028 | Automated | No tenant leakage | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-029 | Automated | No provider-detail leakage | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-030 | Automated | No overflow | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-031 | Automated | No clipped critical content | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-032 | Automated | Reduced motion works | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-033 | Automated | Motion does not delay safety action | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-034 | Automated | Contrast is reviewed | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-035 | Automated | Accessibility scans pass required gate | Blocks release if failed where applicable | Synthetic data only |
| DCT-TST-036 | Automated | Visual snapshots use approved baselines | Blocks release if failed where applicable | Synthetic data only |

## Interactive Browser Validation

| Validation ID | Layer | Check | Viewport/state rule | Data rule |
|---|---|---|---|---|
| DCT-TST-101 | Interactive browser | Inspect Visual hierarchy | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-102 | Interactive browser | Inspect Alignment | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-103 | Interactive browser | Inspect Spacing | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-104 | Interactive browser | Inspect Typography | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-105 | Interactive browser | Inspect Color | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-106 | Interactive browser | Inspect Density | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-107 | Interactive browser | Inspect Component consistency | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-108 | Interactive browser | Inspect Content placement | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-109 | Interactive browser | Inspect Section order | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-110 | Interactive browser | Inspect CTA placement | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-111 | Interactive browser | Inspect Responsive behavior | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-112 | Interactive browser | Inspect Truncation | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-113 | Interactive browser | Inspect Overflow | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-114 | Interactive browser | Inspect Loading | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-115 | Interactive browser | Inspect Empty | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-116 | Interactive browser | Inspect Error | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-117 | Interactive browser | Inspect Offline | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-118 | Interactive browser | Inspect Unauthorized | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-119 | Interactive browser | Inspect Pending payment | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-120 | Interactive browser | Inspect Payment failure | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-121 | Interactive browser | Inspect Provider detail locked | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-122 | Interactive browser | Inspect Provider detail authorized | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-123 | Interactive browser | Inspect Urgent | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-124 | Interactive browser | Inspect Emergency | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-125 | Interactive browser | Inspect Focus | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-126 | Interactive browser | Inspect Accessibility tree | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-127 | Interactive browser | Inspect Motion | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-128 | Interactive browser | Inspect Reduced motion | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-129 | Interactive browser | Inspect Console | Desktop/tablet/mobile where relevant | Synthetic data only |
| DCT-TST-130 | Interactive browser | Inspect Network failures | Desktop/tablet/mobile where relevant | Synthetic data only |

## UI UX Pro Max Validation

Future workflow requires a pre-implementation design pass, post-implementation page review, accepted/rejected recommendation log, version and commit record, and no automatic override of NelyoHealth requirements.

## Visual Baselines

Approved baselines must record environment, browser, viewport, synthetic data, state, font loading, animation stabilization or reduced-motion mode, baseline owner, review, update policy, and reason for update. Blind snapshot-baseline updates are prohibited.

## Browser Evidence

All evidence must use synthetic data and must be scanned for PHI, protected provider details, payment data, secrets, unsupported claims, and unapproved content before sharing.

