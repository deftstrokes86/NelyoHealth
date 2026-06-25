# Application Instructions

These instructions apply under `apps/`.

- App directories are workspace boundaries until their owning P02 issue implements runtime behavior.
- Use synthetic data only.
- Do not add authentication, tenancy, clinical care, payments, provider matching, dashboards, production infrastructure, or pilot behavior unless the active issue explicitly authorizes it.
- Keep app-specific framework dependencies local to the app package when later authorized.
- Do not expose protected provider details, PHI, payment credentials, real organization data, production origins, or secrets.
- Preserve deterministic Playwright and interactive browser validation for any future browser-visible route.
- Keep vendor SDK types out of domain contracts and shared package APIs.
