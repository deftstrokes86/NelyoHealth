# NelyoHealth UI UX Pro Max Runner
This runner executes a manually reviewed, vendored subset of UI UX Pro Max as advisory input only.
Allowed commands: pnpm uiux:check and pnpm uiux:review:foundation.
Outputs are written only under .artifacts/ui-ux-pro-max/.
Prohibited: upstream installers, global skill commands, --persist, arbitrary output paths, network URLs, shell fragments, path traversal, symlinks, junctions, and any clinical, legal, regulatory, pharmacy, laboratory, payment, security, or locked-requirement decisions.
