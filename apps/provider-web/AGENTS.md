# Provider Web Instructions

These instructions apply under `apps/provider-web/`.

- This directory is boundary-only until P02-ISS-012 implements the Next.js shell.
- Do not create routes, dashboards, auth, credentialing workflows, encounter workflows, real provider data, or production-origin behavior in P02-ISS-002.
- Future browser-visible work must use synthetic data, deterministic Playwright coverage, interactive browser inspection, accessibility checks, and privacy assertions.
- Do not expose patient, clinical, payment, credential, or protected provider details in shell scaffolding.
