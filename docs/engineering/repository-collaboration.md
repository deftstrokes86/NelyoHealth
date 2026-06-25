# Repository Collaboration Foundation

## Purpose

This document defines how contributors collaborate on NelyoHealth foundation work without weakening locked requirements or drifting into product implementation.

## Community health files

| File | Purpose | Status |
|---|---|---|
| CONTRIBUTING.md | Contribution rules, local checks, PR expectations | Implemented |
| SECURITY.md | Private security reporting and sensitive-data rules | Implemented |
| SUPPORT.md | Repository support boundary | Implemented |
| GOVERNANCE.md | Domain authority and review routing | Implemented |
| CHANGELOG.md | Foundation change history | Implemented |
| .github/pull_request_template.md | Locked-requirement and validation checklist | Implemented |
| .github/ISSUE_TEMPLATE/*.yml | Bounded issue forms with sensitive-data warnings | Implemented |
| .github/CODEOWNERS | Personal repository owner routing | Implemented; enforcement pending repository admin settings |

## Review rules

Every change must identify its bounded prompt or task. Domain approvals cannot be inferred from code review alone. Clinical, legal, regulatory, privacy, pharmacy, laboratory, payment, financial, employer, HMO, sponsor, guardian, and commercial-risk decisions require external owner approval recorded in governance artifacts.

## Phase boundary

Phase 1 foundation work may configure repository controls and synthetic verification. It must not create production application behavior or begin Phase 2 capability work without orchestration approval.
