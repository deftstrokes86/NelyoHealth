#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "apps", "api", "src");
const apiClientDir = path.join(root, "packages", "api-client", "src");
const apiIndexPath = path.join(apiDir, "index.ts");
const apiClientIndexPath = path.join(apiClientDir, "index.ts");

function getContractModules(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".ts"))
    .filter((fileName) => !fileName.endsWith(".d.ts"))
    .filter((fileName) => !fileName.endsWith(".test.ts"))
    .filter((fileName) => fileName !== "index.ts")
    .map((fileName) => fileName.replace(/\.ts$/, ""))
    .sort();
}

function getExportedModuleNames(indexContent) {
  const matches = [...indexContent.matchAll(/from\s+"\.\/([^"]+)\.js"/g)];
  return new Set(matches.map((match) => match[1]));
}

const failures = [];
const apiOnlyModules = new Set([
  "health",
  "response",
  "payment-handlers",
  "refund-handlers",
  "provider-disclosure-handlers",
  "appointment-handlers",
  "booking-handlers",
  "appointment-booking-routes",
  "server",
  "referral-advanced",
  "prescription-advanced",
  "referral-prescription-handlers",
  "referral-prescription-routes",
  "tracing-context",
  "identity-session-service",
  "acting-context-resolver",
  // Server-side Policy Decision Point (clinical RBAC/ABAC/ReBAC). Evaluated
  // in the API only; never mirrored to clients. Reclassified from a contract
  // exemption to api-only at M2.3 (authorization is server-side infrastructure).
  "authorization-policy",
  "authorization-policy-handlers"
]);
// --- Governed contract-mirror exemptions ---------------------------------
// Temporary, documented exceptions to the api/api-client mirror requirement.
// This does NOT weaken the gate: unexempted drift still fails, every
// exemption must carry full governance metadata (a missing removal
// milestone is a hard failure), and stale exemptions (module now mirrored
// or gone) also fail — so the debt cannot rot silently.
const exemptionsPath = path.join(root, "tools", "checks", "contract-gate-exemptions.json");
const REQUIRED_EXEMPTION_FIELDS = [
  "module",
  "reason",
  "dateIntroduced",
  "expectedRemovalMilestone",
  "owner"
];
const MILESTONE_PATTERN = /^M\d+\.\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

let exemptionEntries = [];
try {
  const parsed = JSON.parse(fs.readFileSync(exemptionsPath, "utf8"));
  exemptionEntries = Array.isArray(parsed.exemptions) ? parsed.exemptions : [];
} catch (error) {
  failures.push(`Contract exemptions file unreadable at ${exemptionsPath}: ${error.message}`);
}

const exemptModules = new Set();
for (const [index, entry] of exemptionEntries.entries()) {
  const label = entry?.module ?? `#${index}`;
  const missingFields = REQUIRED_EXEMPTION_FIELDS.filter(
    (field) => typeof entry?.[field] !== "string" || entry[field].trim() === ""
  );
  if (missingFields.length > 0) {
    failures.push(
      `Contract exemption "${label}" is missing required field(s): ${missingFields.join(", ")}. ` +
        `Every exemption must record module, reason, dateIntroduced, expectedRemovalMilestone, and owner.`
    );
    continue;
  }
  if (!MILESTONE_PATTERN.test(entry.expectedRemovalMilestone)) {
    failures.push(
      `Contract exemption "${label}" has an invalid expectedRemovalMilestone ` +
        `"${entry.expectedRemovalMilestone}" (expected a planned milestone of the form MX.Y).`
    );
    continue;
  }
  if (!DATE_PATTERN.test(entry.dateIntroduced)) {
    failures.push(
      `Contract exemption "${label}" has an invalid dateIntroduced ` +
        `"${entry.dateIntroduced}" (expected YYYY-MM-DD).`
    );
    continue;
  }
  if (exemptModules.has(entry.module)) {
    failures.push(`Duplicate contract exemption for module "${entry.module}".`);
    continue;
  }
  exemptModules.add(entry.module);
}

const allApiModules = getContractModules(apiDir);
const apiModules = allApiModules.filter((moduleName) => !apiOnlyModules.has(moduleName));
const apiClientModules = getContractModules(apiClientDir);
const missingInApiClient = apiModules.filter(
  (moduleName) => !apiClientModules.includes(moduleName)
);
const missingInApiClientSet = new Set(missingInApiClient);
const missingInApi = apiClientModules.filter((moduleName) => !apiModules.includes(moduleName));

// Drift that is NOT governed by an exemption fails exactly as before.
const unexemptedMissing = missingInApiClient.filter((moduleName) => !exemptModules.has(moduleName));
if (unexemptedMissing.length > 0) {
  failures.push(
    `Contract module drift: missing api-client modules for: ${unexemptedMissing.join(", ")}`
  );
}

// A stale exemption (its module is no longer a genuinely-missing api module)
// must be removed — debt is not allowed to linger past its resolution.
for (const moduleName of exemptModules) {
  if (missingInApiClientSet.has(moduleName)) {
    continue; // Still legitimately missing its mirror.
  }
  if (apiClientModules.includes(moduleName)) {
    failures.push(
      `Stale contract exemption "${moduleName}": an api-client mirror now exists — remove this exemption.`
    );
  } else if (apiOnlyModules.has(moduleName)) {
    failures.push(
      `Contradictory contract exemption "${moduleName}": module is declared api-only and needs no mirror — remove this exemption.`
    );
  } else if (!allApiModules.includes(moduleName)) {
    failures.push(
      `Stale contract exemption "${moduleName}": no such api contract module — remove this exemption.`
    );
  } else {
    failures.push(`Stale contract exemption "${moduleName}": no longer required — remove it.`);
  }
}

if (missingInApi.length > 0) {
  failures.push(`Contract module drift: missing api modules for: ${missingInApi.join(", ")}`);
}

const apiIndexContent = fs.readFileSync(apiIndexPath, "utf8");
const apiClientIndexContent = fs.readFileSync(apiClientIndexPath, "utf8");
const apiExportedModules = getExportedModuleNames(apiIndexContent);
const apiClientExportedModules = getExportedModuleNames(apiClientIndexContent);

const unexportedApiModules = apiModules.filter((moduleName) => !apiExportedModules.has(moduleName));
const unexportedApiClientModules = apiClientModules.filter(
  (moduleName) => !apiClientExportedModules.has(moduleName)
);

if (unexportedApiModules.length > 0) {
  failures.push(`API contract modules not exported from index: ${unexportedApiModules.join(", ")}`);
}

if (unexportedApiClientModules.length > 0) {
  failures.push(
    `API client contract modules not exported from index: ${unexportedApiClientModules.join(", ")}`
  );
}

// Visible debt: print the governed exemption ledger on every run.
if (exemptModules.size > 0) {
  console.log(
    `Contract mirror exemptions — ${exemptModules.size} governed, temporary (client mirror deferred):`
  );
  for (const entry of exemptionEntries) {
    if (!entry?.module || !exemptModules.has(entry.module)) {
      continue;
    }
    const active = missingInApiClientSet.has(entry.module) ? "active" : "STALE";
    console.log(
      `  - ${entry.module}: remove by ${entry.expectedRemovalMilestone} ` +
        `(since ${entry.dateIntroduced}, owner: ${entry.owner}) [${active}]`
    );
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    "Contract drift gate passed: API and API client contracts are in parity and exported " +
      `(${exemptModules.size} governed exemption(s) outstanding).`
  );
}
