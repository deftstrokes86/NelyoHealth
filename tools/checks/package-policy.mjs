#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];
const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];
const exactVersion = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const forbiddenFragments = [
  "latest",
  "*",
  "^",
  "~",
  ">",
  "<",
  "git:",
  "github:",
  "http:",
  "https:",
  "file:",
  "link:"
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`Invalid JSON in ${path.relative(root, filePath)}: ${error.message}`);
    return null;
  }
}

function packageFiles() {
  const candidates = ["package.json"];
  for (const base of ["packages", "tools"]) {
    const dir = path.join(root, base);
    if (!fs.existsSync(dir)) continue;
    for (const child of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!child.isDirectory()) continue;
      const pkgPath = path.join(base, child.name, "package.json");
      if (fs.existsSync(path.join(root, pkgPath))) candidates.push(pkgPath);
    }
  }
  return candidates;
}

function validateSpecifier(pkgFile, field, depName, specifier) {
  if (depName.startsWith("@nelyohealth/")) {
    if (specifier === "workspace:*" || exactVersion.test(specifier)) return;
    failures.push(
      `${pkgFile}: ${field}.${depName} must use workspace:* or an exact version, found ${specifier}`
    );
    return;
  }
  if (!exactVersion.test(specifier)) {
    failures.push(`${pkgFile}: ${field}.${depName} must be exact semver, found ${specifier}`);
  }
  for (const fragment of forbiddenFragments) {
    if (specifier === fragment || specifier.includes(fragment)) {
      failures.push(
        `${pkgFile}: ${field}.${depName} contains forbidden specifier fragment ${fragment}`
      );
    }
  }
}

const names = new Map();
for (const relative of packageFiles()) {
  const absolute = path.join(root, relative);
  const pkg = readJson(absolute);
  if (!pkg) continue;
  if (!pkg.name) failures.push(`${relative}: package name is required`);
  if (pkg.name) {
    if (names.has(pkg.name))
      failures.push(`Duplicate package name ${pkg.name} in ${relative} and ${names.get(pkg.name)}`);
    names.set(pkg.name, relative);
  }
  if (pkg.private !== true)
    failures.push(`${relative}: package must be private to prevent accidental publish`);
  if (pkg.publishConfig)
    failures.push(`${relative}: publishConfig is not allowed during foundation work`);
  for (const lifecycle of ["preinstall", "install", "postinstall", "prepare"]) {
    if (pkg.scripts?.[lifecycle])
      failures.push(`${relative}: lifecycle script ${lifecycle} is not allowed`);
  }
  for (const field of dependencyFields) {
    const deps = pkg[field] ?? {};
    for (const [depName, specifier] of Object.entries(deps)) {
      validateSpecifier(relative, field, depName, String(specifier));
    }
  }
  const serialized = JSON.stringify(pkg).toLowerCase();
  for (const secretWord of ["api_key", "apikey", "secret=", "password=", "token="]) {
    if (serialized.includes(secretWord))
      warnings.push(
        `${relative}: possible secret-like text found for ${secretWord}; verify manually if intentional`
      );
  }
}

if (warnings.length) console.warn(warnings.map((warning) => `WARNING: ${warning}`).join("\n"));
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Package policy passed for ${names.size} workspace package(s).`);
}
