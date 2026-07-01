# Human-Gated Decisions

## Status

Draft decision register for implementation work that cannot safely proceed without explicit human approval.

## Decision list

| Decision | Owner | Status | Notes |
|---|---|---|---|
| Cloud and deployment model selection | Human owner | Approved-for-Phase-2-foundation (2026-07-01) | Supabase primary platform; Hostinger shared hosting selected for web-hosting surface; API/worker runtime on Supabase Edge Functions and scheduled jobs; signed URL storage on Supabase Storage; managed Redis-compatible queue/cache; manual deployment steps for current phase. |
| Development deploy and staging promotion workflow | Human owner | Pending | Required before the P02-ISS-017 workflow can be treated as operational. |
| Database migration tool and ownership | Human owner | Pending | Required before operational migration and seed workflows. |
| Queue/cache provider selection | Human owner | Approved-for-Phase-2-foundation (2026-07-01) | Managed Redis-compatible provider path selected for non-VPS shared-hosting constraints. |
| Object storage provider strategy | Human owner | Approved-for-Phase-2-foundation (2026-07-01) | Supabase Storage selected for signed URL flow. |
| Observability provider strategy | Human owner | Approved-phased-baseline (2026-07-01) | Platform logs plus structured app logs now; self-hosted stack deferred. |
| Secrets management model | Human owner | Pending | Required before environment and deployment baseline is finalized. |
| Clinical/legal/privacy domain approval | Human owner | Pending | Required before later feature implementation can be treated as release-ready. |

## Decision process

Each decision should capture:
- context,
- options considered,
- recommendation,
- approval status,
- and follow-up implementation impact.

## Implementation rule

No implementation issue that depends on a pending human decision should be treated as complete without that decision being recorded and reflected in the relevant spec, contract, or deployment artifact.
