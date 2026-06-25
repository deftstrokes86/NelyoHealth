# Changesets

Changesets is configured for private-package versioning evidence only. It must not publish, tag, deploy, or create production releases during foundation work.

Use:

```bash
pnpm changeset
pnpm changeset:status
```

Run versioning only inside an explicitly approved release task:

```bash
pnpm release:version
```

Documentation-only, governance-only, workflow-only, and private tooling-only changes do not require a package changeset when package contracts are unchanged. Package API, token, content-registry, UI foundation, or browser-tooling contract changes require a changeset unless explicitly exempted in the pull request with reviewer approval.
