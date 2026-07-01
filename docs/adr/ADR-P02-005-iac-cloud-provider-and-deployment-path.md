# ADR-P02-005: IaC, Cloud Provider, and Deployment Path

## Status

ACCEPTED-FOR-PHASE-2-FOUNDATION; PROVIDER-AND-DEPLOYMENT-MODEL-RECORDED; IMPLEMENTATION-EVIDENCE-PENDING-P02-ISS-017-P02-ISS-018

## Date

2026-06-25 (updated 2026-07-01)

## Decision owners

Platform/release owner, engineering/architecture owner, security owner, privacy owner, operations owner, and finance/commercial owner. Cloud provider selection requires human approval.

## Context

Phase 2 must eventually support development deployment after human merge and human-controlled staging promotion. P02-ISS-001 is not authorized to select a live cloud provider, create IaC files, deploy, provision resources, or create secrets.

The Phase 2 technology evaluation compared Terraform, OpenTofu, Pulumi, and provider-native templates.

## Decision

Cloud and deployment model choices are now recorded for Phase 2 and early Phase 3 foundation execution.

- Supabase is the required primary platform for Postgres and object storage.
- Hostinger shared hosting is the selected web-hosting surface for shell hosting contexts where shared hosting is applicable.
- API and worker runtime should use Supabase Edge Functions and scheduled jobs; VPS hosting is out of scope for this decision.
- Signed upload/download URLs should use Supabase Storage.
- Redis-compatible queue/cache should use a managed Redis-compatible service (recommended: Upstash) because shared hosting cannot safely host Redis/Valkey daemons.
- Observability baseline is platform logs plus structured application logs now; self-hosted observability stack is deferred.
- Budget target remains under 100 USD per month for development/staging foundation.
- Single-node availability posture is acceptable for this phase; high availability expansion is deferred.
- Backup baseline is daily backups plus a documented restore drill.
- IaC delivery for this phase uses documented manual steps; IaC automation choice remains deferred.

OpenTofu and Pulumi remain future IaC automation candidates. Terraform remains review-required because current Terraform releases use HashiCorp Business Source License.

## Current version evidence

| Tool | Current evidence | Licence posture | Decision |
|---|---|---|---|
| OpenTofu | Official docs/release evidence show 1.12.x current path | MPL-2.0 | Preferred candidate |
| Pulumi | Official docs show current stable 3.248.0 | Apache-2.0 core | Candidate |
| Terraform | Official install docs show 1.15.7 | HashiCorp BSL for current releases | Review-required, not default |

## Alternatives considered

| Alternative | Decision |
|---|---|
| VPS-first deployment path | Rejected; shared-hosting-only constraint was selected by owner. |
| Self-hosted Redis/Valkey on shared hosting | Rejected; incompatible with shared-hosting process constraints. |
| Self-hosted observability stack now | Deferred; conflicts with shared-hosting constraints and current budget target. |
| Full IaC automation now | Deferred; manual documented steps selected for current phase. |

## Consequences

- Human cloud/provider decision dependency is resolved for Phase 2 foundation work.
- P02-ISS-017 and P02-ISS-018 remain evidence-pending for controlled deployment and promotion runs.
- Production deployment approval, pilot readiness, and production data usage remain separately gated.

## Security and privacy implications

- No production, development, or staging secrets are created by P02-ISS-001.
- No live resources, DNS/TLS/CDN/WAF, managed database, object storage, queue, monitoring, or deployment workflow is created.
- Future IaC must keep production data separate from lower environments and must never copy production data downward.

## Implementation implications

Implementation evidence remains pending P02-ISS-017 and P02-ISS-018. This ADR itself creates no `infra/` implementation files, cloud account mutation, secret creation, or deployment action.

## Test implications

P02-ISS-016 must add format/validate/plan-only checks where safe. Apply/deploy remains unauthorized unless a later prompt explicitly grants it.

## Review triggers

Review before production deployment approval, high-availability expansion, IaC automation adoption, observability stack expansion, secrets-manager implementation, or provider contract changes.

## Supersession rule

This ADR may be superseded only by a later ADR with explicit human provider decision evidence and preserved manual Git/GitHub, no-production-deploy, and no-production-data boundaries.

