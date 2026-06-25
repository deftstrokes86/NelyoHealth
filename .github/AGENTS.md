# GitHub Configuration Instructions

These instructions apply under `.github/`.

- Pin all external GitHub Actions to immutable full commit SHAs.
- Do not enable auto-merge.
- Do not add auto-push behavior.
- Do not add automatic release publication.
- Do not deploy without explicit later authorization.
- Repository settings remain human-controlled.
- Workflows must use least-privilege permissions.
- Required checks may block merges, but they must not merge automatically.
