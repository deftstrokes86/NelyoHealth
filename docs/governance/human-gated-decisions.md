# Human-Gated Decisions

## Status

Draft decision register for implementation work that cannot safely proceed without explicit human approval.

## Decision list

| Decision | Owner | Status | Notes |
|---|---|---|---|
| Cloud and IaC provider selection | Human owner | Pending | Required before deployment automation and staging promotion work. The provider-neutral deployment contract baseline is recorded in `docs/engineering/environment-and-deployment-baseline.md`. |
| Development deploy and staging promotion workflow | Human owner | Pending | Required before the P02-ISS-017 workflow can be treated as operational. |
| Database migration tool and ownership | Human owner | Pending | Required before operational migration and seed workflows. |
| Queue/cache provider selection | Human owner | Pending | Required before queue foundation and retry behavior finalization. |
| Object storage provider strategy | Human owner | Pending | Required before signed URL adapter finalization. |
| Observability provider strategy | Human owner | Pending | Required before production-grade telemetry design is finalized. |
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
