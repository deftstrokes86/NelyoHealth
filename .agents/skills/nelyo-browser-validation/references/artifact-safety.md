# Artifact Safety

Browser artifacts are sensitive evidence.

- Use synthetic data only.
- Save artifacts only beneath ignored paths such as `.artifacts/`, `.playwright-cli/`, `test-results/`, and `playwright-report/`.
- Inspect artifacts before sharing.
- Do not commit screenshots, videos, traces, storage snapshots, cookies, auth state, or reports unless a later reviewed process explicitly permits a sanitized artifact.
- Delete or quarantine any artifact containing real patient, provider, clinical, payment, credential, organization, or production data.
- Do not upload artifacts from release-readiness workflows unless the repository policy and secret/sentinel scans permit it.
