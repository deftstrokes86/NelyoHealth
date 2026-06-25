#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const configPath = path.join(root, ".changeset", "config.json");

if (!fs.existsSync(configPath)) {
  failures.push(".changeset/config.json is missing");
} else {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (config.baseBranch !== "main") failures.push("Changesets baseBranch must be main");
  if (config.privatePackages?.version !== true)
    failures.push("Changesets privatePackages.version must be true");
  if (config.privatePackages?.tag !== false)
    failures.push("Changesets privatePackages.tag must be false");
  if (config.commit !== false)
    failures.push("Changesets commit must be false for explicit human commits");
  if (config.access !== "restricted")
    failures.push("Changesets access must remain restricted for private foundation packages");
}

const changesetDir = path.join(root, ".changeset");
if (fs.existsSync(changesetDir)) {
  for (const fileName of fs.readdirSync(changesetDir)) {
    if (!fileName.endsWith(".md") || fileName === "README.md") continue;
    const relative = path.join(".changeset", fileName).replaceAll("\\", "/");
    const content = fs.readFileSync(path.join(changesetDir, fileName), "utf8");
    if (!content.startsWith("---\n"))
      failures.push(`${relative}: changeset frontmatter is missing`);
    if (/npm publish|changeset publish|gh release|git tag/i.test(content))
      failures.push(
        `${relative}: publish, release, or tag instruction is forbidden in foundation work`
      );
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else if (process.argv.includes("--status-only")) {
  console.log(
    "Changesets status did not require a package changeset for this private tooling or governance-only diff. Policy check passed."
  );
} else {
  console.log("Changesets policy passed.");
}
