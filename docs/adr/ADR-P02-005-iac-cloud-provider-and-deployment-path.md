# ADR-P02-005: IaC, Cloud Provider, and Deployment Path

## Status

PARTIAL-DECISION; CLOUD-PROVIDER-HUMAN-DECISION-REQUIRED; IMPLEMENTATION-PENDING-P02-ISS-016

## Date

2026-06-25

## Decision owners

Platform/release owner, engineering/architecture owner, security owner, privacy owner, operations owner, and finance/commercial owner. Cloud provider selection requires human approval.

## Context

Phase 2 must eventually support development deployment after human merge and human-controlled staging promotion. P02-ISS-001 is not authorized to select a live cloud provider, create IaC files, deploy, provision resources, or create secrets.

The Phase 2 technology evaluation compared Terraform, OpenTofu, Pulumi, and provider-native templates.

## Decision

No cloud provider is selected in P02-ISS-001.

OpenTofu is the preferred IaC tool path for P02-ISS-016 if the later cloud/provider decision supports the required resources and the platform owner approves an HCL workflow.

Pulumi remains an approved candidate if the platform owner explicitly prefers TypeScript IaC and its state/secrets model is approved.

Terraform is not the default because current Terraform releases use HashiCorp Business Source License and require legal/commercial review before adoption.

P02-ISS-016 owns final IaC/cloud provider selection and may create provider-neutral deployment contracts or approved IaC skeletons only after human decision evidence exists.

## Current version evidence

| Tool | Current evidence | Licence posture | Decision |
|---|---|---|---|
| OpenTofu | Official docs/release evidence show 1.12.x current path | MPL-2.0 | Preferred candidate |
| Pulumi | Official docs show current stable 3.248.0 | Apache-2.0 core | Candidate |
| Terraform | Official install docs show 1.15.7 | HashiCorp BSL for current releases | Review-required, not default |

## Alternatives considered

| Alternative | Decision |
|---|---|
| Select a cloud provider now | Rejected; prompt and Phase 2 plan require human provider decision. |
| Create IaC skeleton now | Rejected; P02-ISS-016 owns IaC implementation. |
| Terraform default | Deferred pending BSL review. |
| Provider-native templates only | Deferred until provider is selected. |

## Consequences

- P02-ISS-016 remains blocked on human cloud/provider decision.
- P02-ISS-017 remains blocked until P02-ISS-016 completes.
- Local app skeleton issues can proceed without live cloud infrastructure.

## Security and privacy implications

- No production, development, or staging secrets are created by P02-ISS-001.
- No live resources, DNS/TLS/CDN/WAF, managed database, object storage, queue, monitoring, or deployment workflow is created.
- Future IaC must keep production data separate from lower environments and must never copy production data downward.

## Implementation implications

Implementation is pending P02-ISS-016. This ADR creates no `infra/` implementation files, provider configuration, workflow, cloud account link, secret reference, or deployment.

## Test implications

P02-ISS-016 must add format/validate/plan-only checks where safe. Apply/deploy remains unauthorized unless a later prompt explicitly grants it.

## Review triggers

Review before cloud provider selection, IaC file creation, secret-manager implementation, deployment workflow creation, development environment provisioning, staging promotion workflow, or provider contract commitment.

## Supersession rule

This ADR may be superseded only by a later ADR with explicit human provider decision evidence and preserved manual Git/GitHub, no-production-deploy, and no-production-data boundaries.

