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
  "identity-password-login-service",
  "identity-registration-service",
  "password-hashing",
  "acting-context-resolver",
  // Server-side Policy Decision Point (clinical RBAC/ABAC/ReBAC). Evaluated
  // in the API only; never mirrored to clients. Reclassified from a contract
  // exemption to api-only at M2.3 (authorization is server-side infrastructure).
  "authorization-policy",
  "authorization-policy-handlers",
  // Consent persistence + consent-gated authorization (roadmap M4.1). The
  // consent domain types, the versioned workflow logic, and the grant/withdraw
  // command + PDP-integration service are all server-side: consent status is
  // DERIVED on the authorization path, never shipped as a client contract.
  // Reclassified from contract exemptions to api-only at M4.1. A client-facing
  // consent DTO surface lands with the consent-management UI (later milestone),
  // at which point a real api-client mirror is introduced.
  "granular-consent",
  "granular-consent-workflows",
  "consent-service",
  // Relationship persistence + relationship-gated authorization (roadmap M4.2).
  // The relationship domain types, the versioned workflow logic, and the
  // establish/verify/revoke command + ReBAC-integration service are server-side:
  // the relationship dimension is DERIVED on the authorization path, never
  // shipped as a client contract. Reclassified from contract exemptions to
  // api-only at M4.2. A client-facing relationship DTO surface lands with the
  // relationship-management UI (later milestone).
  "relationship-model",
  "relationship-workflows",
  "relationship-service",
  // Break-glass persistence + break-glass-gated authorization (roadmap M4.3).
  // The emergency-access workflow logic and the request/activate/review command +
  // override-integration service are server-side: the break-glass override is
  // DERIVED on the authorization path from a persisted grant, never shipped as a
  // client contract, and the justification never leaves the server in a payload.
  // Reclassified from a contract exemption to api-only at M4.3. A client-facing
  // break-glass surface (request/review UI) lands with the emergency-access UI.
  "break-glass-workflows",
  "break-glass-service",
  // Patient-profile resource (roadmap M5.1). The create/update commands and the
  // full-pipeline (consent + ReBAC + break-glass) access-governance logic are
  // server-side; profile demographics/contacts/identifiers never leave the server
  // in a payload. A client-facing patient-profile DTO surface lands with the
  // patient-profile UI, at which point a real api-client mirror is introduced.
  "patient-profile-service",
  // Core Resource Platform shared authorization + appointment resource (M5.2).
  // resource-authorization composes the M4 dimensions for every resource;
  // appointment-service holds the lifecycle commands + decide-before-load/write
  // governance. Both are server-side; client DTO surfaces land with the resource
  // UIs. Reclassified api-only at M5.2.
  "resource-authorization",
  "appointment-service",
  // Consultation resource (roadmap M5.3). Lifecycle commands + decide-before-
  // load/write governance; clinical notes never leave the server in a payload.
  // Reclassified api-only at M5.3.
  "consultation-service",
  // Medical record resource (roadmap M5.4). Append-only clinical entries + decide-
  // before-load/write governance (reusing the clinical-record-summary PDP
  // resource); clinical content never leaves the server in a payload. Api-only.
  "medical-record-service"
]);
// Note: apps/api/src/nest/** is not scanned by this gate at all (getContractModules
// reads apps/api/src non-recursively) — the new auth controllers/module living
// under nest/auth/ need no allowlist entry here.
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
