#!/usr/bin/env node
/**
 * Construction gate: authorization endpoint coverage (roadmap M0.3).
 *
 * Inventories every HTTP route exposed by apps/api (NestJS decorators and
 * Hono registrations) and reports which routes lack involvement of the
 * central authorization policy (authorization-policy.ts — the platform PDP).
 *
 * Modes:
 *   default    — ADVISORY: prints the coverage report, always exits 0.
 *   --enforce  — BLOCKING: exits 1 when any non-allowlisted route is
 *                uncovered. CI flips to this mode at roadmap M2.3
 *                (universal authorization guard).
 *
 * Coverage heuristic (deliberately simple and reviewable): a route is
 * "covered" when its defining module, or a module it imports directly,
 * references the authorization policy entrypoints.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiSrc = path.join(root, "apps", "api", "src");
const enforce = process.argv.includes("--enforce");

/** Routes that are intentionally public (liveness/readiness only). */
const PUBLIC_ROUTE_ALLOWLIST = new Set([
  "GET /api/health",
  "GET /api/ready",
  "GET /api/health (hono)"
]);

/** Markers indicating the central PDP is involved. */
const AUTHORIZATION_MARKERS = [
  "evaluateAuthorizationPolicyDecision",
  'from "./authorization-policy.js"',
  'from "../authorization-policy.js"',
  'from "../../authorization-policy.js"'
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".spec.ts") &&
      !entry.name.endsWith(".d.ts")
    ) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(apiSrc);
const sourceByFile = new Map(files.map((file) => [file, fs.readFileSync(file, "utf8")]));

function directImports(file) {
  const source = sourceByFile.get(file) ?? "";
  const imports = [];
  for (const match of source.matchAll(/from\s+"(\.{1,2}\/[^"]+)\.js"/g)) {
    const resolved = path.resolve(path.dirname(file), `${match[1]}.ts`);
    if (sourceByFile.has(resolved)) imports.push(resolved);
  }
  return imports;
}

function isAuthorizationInvolved(file) {
  const candidates = [file, ...directImports(file)];
  return candidates.some((candidate) => {
    const source = sourceByFile.get(candidate) ?? "";
    return AUTHORIZATION_MARKERS.some((marker) => source.includes(marker));
  });
}

const routes = [];

// 1. NestJS controller routes.
for (const file of files) {
  const source = sourceByFile.get(file);
  const controllerMatch = source.match(/@Controller\(\s*"([^"]*)"\s*\)/);
  if (!controllerMatch) continue;
  const basePath = controllerMatch[1];
  for (const match of source.matchAll(/@(Get|Post|Put|Patch|Delete)\(\s*(?:"([^"]*)")?\s*\)/g)) {
    const method = match[1].toUpperCase();
    const subPath = match[2] ?? "";
    const fullPath = `/${[basePath, subPath].filter(Boolean).join("/")}`;
    routes.push({
      route: `${method} ${fullPath}`,
      file: path.relative(root, file),
      covered: isAuthorizationInvolved(file)
    });
  }
}

// 2. Hono routes (first argument must be a string path).
for (const file of files) {
  const source = sourceByFile.get(file);
  for (const match of source.matchAll(/\bapp\.(get|post|put|patch|delete)\(\s*"([^"]+)"/g)) {
    const method = match[1].toUpperCase();
    const routeKey = `${method} ${match[2]}`;
    routes.push({
      route: routeKey === "GET /api/health" ? `${routeKey} (hono)` : routeKey,
      file: path.relative(root, file),
      covered: isAuthorizationInvolved(file)
    });
  }
}

routes.sort((a, b) => a.route.localeCompare(b.route));

const uncovered = routes.filter(
  (entry) => !entry.covered && !PUBLIC_ROUTE_ALLOWLIST.has(entry.route)
);
const covered = routes.filter((entry) => entry.covered);
const publicRoutes = routes.filter((entry) => PUBLIC_ROUTE_ALLOWLIST.has(entry.route));

console.log(`Authorization endpoint-coverage gate (${enforce ? "ENFORCING" : "ADVISORY"})`);
console.log(`Routes discovered: ${routes.length}`);
console.log(
  `  covered by authorization policy: ${covered.length}` +
    ` | public allowlist: ${publicRoutes.length}` +
    ` | UNCOVERED: ${uncovered.length}`
);
for (const entry of routes) {
  const status = entry.covered
    ? "covered "
    : PUBLIC_ROUTE_ALLOWLIST.has(entry.route)
      ? "public  "
      : "UNCOVERED";
  console.log(`  [${status}] ${entry.route}  (${entry.file})`);
}

if (routes.length === 0) {
  console.error("Gate error: no routes discovered — the inventory scan is broken.");
  process.exit(1);
}

if (enforce && uncovered.length > 0) {
  console.error(`\nFAIL: ${uncovered.length} route(s) lack authorization-policy involvement.`);
  process.exit(1);
}

if (!enforce && uncovered.length > 0) {
  console.log(
    `\nAdvisory: ${uncovered.length} route(s) currently lack authorization-policy involvement.` +
      " This gate becomes blocking at roadmap M2.3."
  );
}
