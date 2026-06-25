# Local Infrastructure Instructions

These instructions apply under `infra/local/`.

- Local infrastructure is for Phase 2 synthetic development and test support only.
- Do not add production infrastructure, production origins, cloud resources, real credentials, or deployment behavior here.
- Keep all bound host ports on `127.0.0.1`.
- Keep object storage, queue/cache, database, and observability services synthetic and local-only.
- Do not add schemas, migrations, seeds, clinical data, payment data, provider details, or product runtime behavior in this directory.
- Image changes require exact tags, digest pins, primary-source evidence, licence review notes, and governance updates.
