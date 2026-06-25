#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const workflowDir = path.join(root, ".github", "workflows");
const failures = [];
const warnings = [];
const sha = /^[0-9a-f]{40}$/i;

if (!fs.existsSync(workflowDir)) {
  failures.push(".github/workflows directory is missing");
} else {
  for (const fileName of fs.readdirSync(workflowDir)) {
    if (!/\.ya?ml$/i.test(fileName)) continue;
    const relative = path.join(".github", "workflows", fileName).replaceAll("\\", "/");
    const content = fs.readFileSync(path.join(workflowDir, fileName), "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      const uses = line.match(/^\s*uses:\s*([^\s#]+)\s*$/);
      if (!uses) return;
      const value = uses[1].replace(/^['"]|['"]$/g, "");
      if (value.startsWith("./") || value.startsWith("docker://")) return;
      const at = value.lastIndexOf("@");
      if (at === -1) {
        failures.push(
          `${relative}:${index + 1} external action must be pinned to a full commit SHA: ${value}`
        );
        return;
      }
      const ref = value.slice(at + 1);
      if (!sha.test(ref))
        failures.push(
          `${relative}:${index + 1} external action ref must be a 40-character SHA: ${value}`
        );
    });
    if (/continue-on-error:\s*true/i.test(content))
      failures.push(
        `${relative}: continue-on-error true is forbidden for required foundation gates`
      );
    if (/permissions:\s*(write-all|read-all)/i.test(content))
      failures.push(`${relative}: broad permissions keyword is forbidden`);
    if (/contents:\s*write/i.test(content))
      failures.push(`${relative}: contents: write is forbidden in foundation workflows`);
    if (/id-token:\s*write/i.test(content))
      failures.push(
        `${relative}: id-token: write is forbidden without explicit deployment approval`
      );
    if (
      /gh release|npm publish|pnpm publish|changeset publish|docker push|kubectl|terraform apply/i.test(
        content
      )
    ) {
      failures.push(
        `${relative}: publish, deploy, release, or infrastructure command is forbidden in foundation workflows`
      );
    }
    if (!/permissions:\s*\n\s+contents:\s*read/i.test(content))
      warnings.push(`${relative}: expected least-privilege contents: read permissions`);
  }
}

if (warnings.length) console.warn(warnings.map((warning) => `WARNING: ${warning}`).join("\n"));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("GitHub Actions pinning and permissions policy passed.");
}
