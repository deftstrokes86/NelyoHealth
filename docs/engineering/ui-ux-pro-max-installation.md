# UI UX Pro Max Advisory Installation
Status: vendored advisory subset installed for P01-FND-002.
Upstream verified:
- Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
- Selected tag: v2.6.5
- Selected commit: bdf1179bcf641cca49ee7a5f76df14c3015fd38c
Controls:
- No upstream installer used.
- No global skill installation used.
- No symlink, junction, or pointer-file vendoring used.
- Runner writes only to .artifacts/ui-ux-pro-max/.
- Integrity check fails on missing, unexpected, modified, symlinked, or hash-mismatched vendored files.
- Output is advisory and never authoritative.
License note: root upstream materials identify MIT; upstream cli/README.md references CC-BY-NC-4.0 and was excluded. External license review remains required before broader redistribution or commercial reliance.

## Runtime hardening - 2026-06-25T04:48:42.1518253+01:00

- The governed runner sets PYTHONDONTWRITEBYTECODE=1 so Python does not create __pycache__ artifacts inside the vendored advisory subset.
- Integrity checks pass after advisory execution.
