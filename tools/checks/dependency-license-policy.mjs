#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const policy = JSON.parse(
  fs.readFileSync(path.join(root, "config", "dependency-policy.json"), "utf8")
);
const allowed = new Set(policy.allowedLicenses);
const reviewRequired = new Set(policy.reviewRequiredLicenses);
const overrides = policy.knownLicenseMetadataOverrides ?? {};
const failures = [];
const warnings = [];

function runPnpm(args) {
  const execPath = process.env.npm_execpath;
  if (execPath && /pnpm/i.test(execPath)) {
    if (/\.(cjs|mjs|js)$/i.test(execPath))
      return execFileSync(process.execPath, [execPath, ...args], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
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

function flatten(value) {
  const rows = [];
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (Array.isArray(nested)) {
        for (const item of nested) rows.push({ license: key, ...item });
      } else if (nested && typeof nested === "object") {
        rows.push({ name: key, ...nested });
      }
    }
  }
  return rows;
}

let parsed = [];
try {
  const output = runPnpm(["licenses", "list", "--json"]);
  parsed = flatten(JSON.parse(output));
} catch (error) {
  failures.push(`Unable to run pinned pnpm licenses list --json: ${error.message}`);
}

for (const row of parsed) {
  const name = row.name ?? row.package ?? row.path ?? "unknown-package";
  let license = String(row.license ?? row.licenses ?? "UNKNOWN").trim() || "UNKNOWN";
  if ((license === "Unknown" || license === "UNKNOWN") && overrides[name]) {
    warnings.push(
      `${name}: pnpm reported Unknown; using recorded metadata override ${overrides[name].license} from ${overrides[name].source}`
    );
    license = overrides[name].license;
  }
  const licenseParts = license
    .split(/\s+OR\s+|\s+AND\s+|[(),]/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const accepted = licenseParts.some((part) => allowed.has(part));
  const needsReview =
    licenseParts.some((part) => reviewRequired.has(part)) || reviewRequired.has(license);
  if (accepted) continue;
  if (needsReview) {
    warnings.push(
      `${name}: license requires external legal/commercial review before production or redistribution: ${license}`
    );
    continue;
  }
  failures.push(`${name}: license is unclassified or disallowed for foundation use: ${license}`);
}

const upstream = path.join(root, "tools", "vendor", "ui-ux-pro-max", "UPSTREAM.json");
if (fs.existsSync(upstream)) {
  const metadata = JSON.parse(fs.readFileSync(upstream, "utf8"));
  if (!String(metadata.licenseFinding ?? "").includes("license review"))
    warnings.push(
      "UI UX Pro Max upstream metadata does not explicitly retain external license review wording."
    );
} else {
  failures.push("tools/vendor/ui-ux-pro-max/UPSTREAM.json is missing");
}

if (parsed.length === 0 && failures.length === 0)
  warnings.push("pnpm reported zero dependency license rows; verify pnpm license output manually.");
if (warnings.length) console.warn(warnings.map((warning) => `WARNING: ${warning}`).join("\n"));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Dependency license policy passed for ${parsed.length} license row(s). Review-required licenses are recorded as warnings, not approvals.`
  );
}
