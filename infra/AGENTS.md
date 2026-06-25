# Infrastructure Instructions

These instructions apply under `infra/`.

- Infrastructure under this directory is Phase 2 foundation-only unless a later prompt explicitly broadens scope.
- `infra/local/` may contain local container workflow files for synthetic development and test dependencies.
- Do not add production infrastructure, production credentials, production environments, production origins, or deployment paths.
- Infrastructure-as-code changes require an ADR, rollback plan, and security review.
- Do not create cloud resources or mutate cloud settings from Codex.
- Keep local infrastructure separate from cloud/provider IaC. P02-ISS-016 owns provider/IaC decisions.
