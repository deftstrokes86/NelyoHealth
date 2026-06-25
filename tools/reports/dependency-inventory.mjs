#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".artifacts", "dependencies");
fs.mkdirSync(outDir, { recursive: true });

function runPnpm(args) {
  const execPath = process.env.npm_execpath;
  if (execPath && /pnpm/i.test(execPath)) {
    if (/\.(cjs|mjs|js)$/i.test(execPath)) {
      return execFileSync(process.execPath, [execPath, ...args], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
    }
    return execFileSync(execPath, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  }
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function run(args) {
  try {
    return { ok: true, output: runPnpm(args) };
  } catch (error) {
    return {
      ok: false,
      output: error.stdout?.toString() ?? "",
      error: error.stderr?.toString() ?? error.message
    };
  }
}

const list = run(["list", "--depth", "0", "--json"]);
const licenses = run(["licenses", "list", "--json"]);
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const policy = JSON.parse(
  fs.readFileSync(path.join(root, "config", "dependency-policy.json"), "utf8")
);
const inventory = {
  generatedAt: new Date().toISOString(),
  generatedBy: "tools/reports/dependency-inventory.mjs",
  phase: "P01-FND-003",
  runtime: { node: process.version, packageManager: pkg.packageManager },
  policy,
  directDevDependencies: pkg.devDependencies ?? {},
  pnpmList: list.ok ? JSON.parse(list.output) : { error: list.error },
  pnpmLicenses: licenses.ok ? JSON.parse(licenses.output) : { error: licenses.error },
  pnpmOutdated: {
    informational:
      "Live outdated checks are network-dependent and intentionally separated from deterministic inventory generation. Run pnpm deps:outdated for the current informational report."
  },
  constraints: [
    "Synthetic data only",
    "No production deployment",
    "No product application feature implementation",
    "UI UX Pro Max remains separately governed advisory-only content"
  ]
};
fs.writeFileSync(
  path.join(outDir, "dependency-inventory.json"),
  JSON.stringify(inventory, null, 2) + "\n",
  "utf8"
);
const rows = Object.entries(pkg.devDependencies ?? {})
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, version]) => `| ${name} | ${version} |`);
const md = [
  "# Dependency Inventory",
  "",
  `Generated: ${inventory.generatedAt}`,
  "",
  `Node runtime observed: ${process.version}`,
  `Package manager: ${pkg.packageManager}`,
  "",
  "## Direct development dependencies",
  "",
  "| Package | Version |",
  "|---|---|",
  ...rows,
  "",
  "## Notes",
  "",
  "- Inventory is engineering evidence, not legal advice.",
  "- License classifications require legal/commercial review before production or broader redistribution.",
  "- UI UX Pro Max remains governed separately from npm dependency policy."
].join("\n");
fs.writeFileSync(path.join(outDir, "dependency-inventory.md"), md + "\n", "utf8");
console.log("Dependency inventory written to .artifacts/dependencies/.");
