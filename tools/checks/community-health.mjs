#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];
const requiredFiles = [
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
  "config/dependency-policy.json"
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

if (warnings.length) console.warn(warnings.map((warning) => `WARNING: ${warning}`).join("\n"));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Community health policy passed.");
}
