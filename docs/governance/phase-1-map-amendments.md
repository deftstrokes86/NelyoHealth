# Phase 1 Map Amendments

These amendments are explicit owner-approved Phase 1 map clarifications. They are not accidental omissions and do not begin Phase 2.

## Amendment 1: AGENTS Terminology

`AGENTS.md` means repository instructions. It does not require autonomous agents, agent teams, agent routing, or background execution. Root and nested instruction files are restored as durable Codex guidance.

## Amendment 2: Manual Git Authority

The human owner retains all Git and GitHub writes. Codex performs edits and validation only. No automated commit, push, merge, tag, release, deployment, package publication, or GitHub settings mutation is allowed.

## Amendment 3: GitHub Organization

The current founder-owned repository is accepted. A GitHub organization is deferred.

Organization creation becomes required when:

- Multiple maintainers require managed ownership.
- Team permissions are needed.
- Production ownership transfer is needed.
- Enterprise governance requires it.

## Amendment 4: Browser Validation

Playwright Test remains deterministic. Playwright CLI is the verified interactive fallback. Project-scoped Playwright MCP is preferred and was reverified for local synthetic smoke during P01-FND-004 with Codex CLI 0.141.0. The previous upstream blocker must be reopened only if the `sandboxPolicy` bridge error recurs.

## Amendment 5: Database Commands

Command interfaces are registered in Phase 1. Operational migration and seed behavior begins in Phase 2. No fake Phase 1 database implementation is permitted.

## Amendment 6: Visual Testing

A meaningful synthetic foundation visual test is required in Phase 1. Final product visual baselines remain subject to design approval.
