#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [
  ["Community health", ["node", ["tools/checks/community-health.mjs"]]],
  ["Package policy", ["node", ["tools/checks/package-policy.mjs"]]],
  ["GitHub Actions policy", ["node", ["tools/checks/github-actions-pinning.mjs"]]],
  ["Dependency license policy", ["node", ["tools/checks/dependency-license-policy.mjs"]]],
  ["Changesets policy", ["node", ["tools/checks/changeset-policy.mjs"]]],
  ["Contract drift and invariant gate", ["node", ["tools/checks/contract-invariant-gate.mjs"]]],
  ["UI UX Pro Max integrity", ["node", ["tools/ui-ux-pro-max/check-integrity.mjs"]]],
  ["Basic secret scan", ["node", ["tools/checks/basic-secret-scan.mjs"]]]
];
const failures = [];
for (const [label, [command, args]] of checks) {
  try {
    execFileSync(command, args, { cwd: root, stdio: "inherit" });
  } catch {
    failures.push(label);
  }
}
const requiredDocs = [
  "docs/governance/phase-1-requirements-traceability.md",
  "docs/governance/phase-1-gate-review.md",
  "docs/governance/phase-1-completion-report.md",
  "docs/governance/phase-2-readiness-handoff.md",
  "AGENTS.md",
  ".agent/PLANS.md",
  ".agents/skills/nelyo-browser-validation/SKILL.md",
  "docs/engineering/repository-collaboration.md",
  "docs/engineering/github-repository-controls.md",
  "docs/engineering/github-manual-ruleset-checklist.md",
  "docs/engineering/manual-git-and-github-workflow.md",
  "docs/engineering/dependency-governance.md",
  "docs/engineering/versioning-and-release.md",
  "docs/engineering/supply-chain-inventory.md",
  "docs/governance/phase-1-map-amendments.md",
  "docs/exec-plans/P01-phase-1-map-gap-closure.md",
  "tools/checks/phase-gated-database-command.mjs"
];
for (const file of requiredDocs) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`);
}
if (failures.length) {
  console.error(`Release readiness failed: ${failures.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(
    "Release readiness passed for read-only foundation gate. No publish, tag, deploy, or production release was performed."
  );
}
