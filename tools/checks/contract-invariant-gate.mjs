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
  "provider-disclosure-handlers"
]);
const apiModules = getContractModules(apiDir).filter((moduleName) => !apiOnlyModules.has(moduleName));
const apiClientModules = getContractModules(apiClientDir);
const missingInApiClient = apiModules.filter((moduleName) => !apiClientModules.includes(moduleName));
const missingInApi = apiClientModules.filter((moduleName) => !apiModules.includes(moduleName));

if (missingInApiClient.length > 0) {
  failures.push(
    `Contract module drift: missing api-client modules for: ${missingInApiClient.join(", ")}`
  );
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

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Contract drift gate passed: API and API client contracts are in parity and exported.");
}
