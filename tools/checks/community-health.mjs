#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];
const requiredFiles = [
  "AGENTS.md",
  "docs/AGENTS.md",
  "packages/AGENTS.md",
  "tests/AGENTS.md",
  "tools/AGENTS.md",
  ".github/AGENTS.md",
  "infra/AGENTS.md",
  ".agent/PLANS.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "SUPPORT.md",
  "GOVERNANCE.md",
  "CHANGELOG.md",
  ".github/pull_request_template.md",
  ".github/dependabot.yml",
  ".github/dependency-review-config.yml",
  ".github/release.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/release-readiness.yml",
  "config/dependency-policy.json",
  ".agents/skills/nelyo-browser-validation/SKILL.md",
  ".agents/skills/nelyo-browser-validation/references/browser-checklist.md",
  ".agents/skills/nelyo-browser-validation/references/provider-disclosure-checklist.md",
  ".agents/skills/nelyo-browser-validation/references/artifact-safety.md",
  "docs/engineering/manual-git-and-github-workflow.md",
  "docs/engineering/github-manual-ruleset-checklist.md",
  "docs/governance/phase-1-map-amendments.md",
  "tools/checks/phase-gated-database-command.mjs"
];
const issueForms = [
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/documentation.yml",
  ".github/ISSUE_TEMPLATE/dependency_or_tooling.yml"
];

for (const file of [...requiredFiles, ...issueForms]) {
  if (!fs.existsSync(path.join(root, file)))
    failures.push(`Missing required community or governance file: ${file}`);
}

const codeowners = path.join(root, ".github", "CODEOWNERS");
const codeownersExample = path.join(root, ".github", "CODEOWNERS.example");
if (!fs.existsSync(codeowners) && !fs.existsSync(codeownersExample))
  failures.push("Missing CODEOWNERS or CODEOWNERS.example");
if (fs.existsSync(codeowners)) {
  const content = fs.readFileSync(codeowners, "utf8");
  if (!content.includes("@deftstrokes86"))
    failures.push("CODEOWNERS does not contain evidenced personal repository owner @deftstrokes86");
  if (!/^\*\s+@deftstrokes86/m.test(content))
    warnings.push("CODEOWNERS lacks a repository-wide default owner rule");
}

for (const form of issueForms) {
  const content = fs.existsSync(path.join(root, form))
    ? fs.readFileSync(path.join(root, form), "utf8")
    : "";
  if (/labels:|assignees:|projects:/i.test(content))
    failures.push(
      `${form}: labels, assignees, and projects are not configured because repository labels/projects were not verified`
    );
  if (!/real patient|synthetic|production data/i.test(content))
    warnings.push(`${form}: sensitive-data warning is weak or absent`);
}

const scanFiles = [...requiredFiles, ...issueForms, ".github/CODEOWNERS"].filter((file) =>
  fs.existsSync(path.join(root, file))
);
for (const file of scanFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  if (/\b(TODO|TBD)\b/i.test(content))
    failures.push(`${file}: unresolved TODO/TBD marker is not allowed in P01-FND-003 artifacts`);
  if (/BEGIN PRIVATE KEY|AKIA[0-9A-Z]{16}|password\s*=|secret\s*=/i.test(content))
    failures.push(`${file}: possible secret pattern found`);
}

const rootAgents = fs.existsSync(path.join(root, "AGENTS.md"))
  ? fs.readFileSync(path.join(root, "AGENTS.md"), "utf8")
  : "";
if (rootAgents && !/not create autonomous agents/i.test(rootAgents))
  failures.push("AGENTS.md must state that it does not create autonomous agents");
if (
  rootAgents &&
  !/Codex must never commit, push, merge, tag, release, or deploy/i.test(rootAgents)
)
  failures.push("AGENTS.md must preserve the manual Git write prohibition");

const browserSkill = fs.existsSync(
  path.join(root, ".agents", "skills", "nelyo-browser-validation", "SKILL.md")
)
  ? fs.readFileSync(
      path.join(root, ".agents", "skills", "nelyo-browser-validation", "SKILL.md"),
      "utf8"
    )
  : "";
if (browserSkill) {
  if (!/^---\s*\nname:\s*nelyo-browser-validation/m.test(browserSkill))
    failures.push("nelyo-browser-validation skill metadata is missing the required name");
  if (!/description:/m.test(browserSkill))
    failures.push("nelyo-browser-validation skill metadata is missing a description");
  if (/autonomous agent/i.test(browserSkill) && !/not an autonomous agent/i.test(browserSkill))
    failures.push("nelyo-browser-validation skill must not imply autonomous-agent behavior");
}

if (warnings.length) console.warn(warnings.map((warning) => `WARNING: ${warning}`).join("\n"));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Community health policy passed.");
}
