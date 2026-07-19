#!/usr/bin/env node
/**
 * Construction gate: authorization endpoint coverage (roadmap M0.3, blocking at M2.3).
 *
 * As of M2.3 the NestJS runtime enforces authorization through a single
 * mandatory PEP guard (AuthorizationGuard) registered globally via APP_GUARD.
 * The model is default-deny: every route is protected unless it is explicitly
 * declared @Public(). This gate verifies that posture:
 *
 *   1. the global PEP guard is registered (otherwise nothing is enforced);
 *   2. every NestJS route is either protected-by-the-guard or an explicitly
 *      sanctioned @Public() route (the declarative public allowlist);
 *   3. legacy Hono routes (apps/api/src/server.ts), which are not under the
 *      Nest guard, still reference the authorization policy directly.
 *
 * Modes:
 *   default    — ADVISORY: prints the report, always exits 0.
 *   --enforce  — BLOCKING: exits 1 on any uncovered/undeclared route or if the
 *                global guard is missing. CI runs this mode from M2.3 onward.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiSrc = path.join(root, "apps", "api", "src");
const enforce = process.argv.includes("--enforce");

/**
 * Sanctioned public routes — the explicit, reviewable public-endpoint
 * allowlist. A route may be @Public() only if it appears here; a @Public()
 * route absent from this set fails the gate (accidental exposure), and a
 * sanctioned route that is not actually @Public() is reported as drift.
 *
 * Rationale per route:
 *  - health/ready: liveness/readiness, no principal.
 *  - idempotency/observability probe: synthetic operational plumbing; no
 *    principal-scoped resource access.
 *  - storage synthetic endpoints: synthetic-only scaffolding (synthetic
 *    documents/objects); real document access will be a protected business
 *    route.
 *  - GET /api/health (hono): legacy liveness.
 */
const SANCTIONED_PUBLIC_ROUTES = new Set([
  "GET /api/health",
  "GET /api/ready",
  "POST /api/idempotency/probe",
  "POST /api/observability/probe",
  "POST /api/storage/signed-url/upload",
  "POST /api/storage/signed-url/download",
  "DELETE /api/storage/synthetic-objects",
  "GET /api/health (hono)"
]);

/** Markers indicating a (Hono) route references the authorization policy directly. */
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

// 1. Confirm the global PEP guard is actually registered as a provider
// (a real `provide: APP_GUARD, useClass: AuthorizationGuard` binding — not a
// mere import of those symbols, which would be trivially satisfiable).
const GUARD_REGISTRATION_PATTERN =
  /provide:\s*APP_GUARD[\s\S]{0,160}useClass:\s*AuthorizationGuard/;
const guardRegistered = [...sourceByFile.values()].some((source) =>
  GUARD_REGISTRATION_PATTERN.test(source)
);

function directImports(file) {
  const source = sourceByFile.get(file) ?? "";
  const imports = [];
  for (const match of source.matchAll(/from\s+"(\.{1,2}\/[^"]+)\.js"/g)) {
    const resolved = path.resolve(path.dirname(file), `${match[1]}.ts`);
    if (sourceByFile.has(resolved)) imports.push(resolved);
  }
  return imports;
}

function honoReferencesPolicy(file) {
  const candidates = [file, ...directImports(file)];
  return candidates.some((candidate) => {
    const source = sourceByFile.get(candidate) ?? "";
    return AUTHORIZATION_MARKERS.some((marker) => source.includes(marker));
  });
}

/** True when a @Public() decorator sits in the decorator stack of this route. */
function isPublicRoute(source, decoratorIndex) {
  const windowStart = Math.max(0, decoratorIndex - 220);
  const bodyIndex = source.indexOf("{", decoratorIndex);
  const windowEnd = bodyIndex === -1 ? decoratorIndex + 220 : bodyIndex;
  return source.slice(windowStart, windowEnd).includes("@Public(");
}

const routes = [];

// NestJS controller routes.
for (const file of files) {
  const source = sourceByFile.get(file);
  const controllerMatch = source.match(/@Controller\(\s*"([^"]*)"\s*\)/);
  if (!controllerMatch) continue;
  const basePath = controllerMatch[1];
  for (const match of source.matchAll(/@(Get|Post|Put|Patch|Delete)\(\s*(?:"([^"]*)")?\s*\)/g)) {
    const method = match[1].toUpperCase();
    const subPath = match[2] ?? "";
    const fullPath = `/${[basePath, subPath].filter(Boolean).join("/")}`;
    const route = `${method} ${fullPath}`;
    const isPublic = isPublicRoute(source, match.index ?? 0);
    routes.push({
      route,
      file: path.relative(root, file),
      runtime: "nest",
      isPublic,
      covered: isPublic || guardRegistered
    });
  }
}

// Legacy Hono routes (not under the Nest guard).
for (const file of files) {
  const source = sourceByFile.get(file);
  for (const match of source.matchAll(/\bapp\.(get|post|put|patch|delete)\(\s*"([^"]+)"/g)) {
    const method = match[1].toUpperCase();
    let route = `${method} ${match[2]}`;
    if (route === "GET /api/health") route = "GET /api/health (hono)";
    const isPublic = SANCTIONED_PUBLIC_ROUTES.has(route);
    routes.push({
      route,
      file: path.relative(root, file),
      runtime: "hono",
      isPublic,
      covered: isPublic || honoReferencesPolicy(file)
    });
  }
}

routes.sort((a, b) => a.route.localeCompare(b.route));

const failures = [];

if (!guardRegistered) {
  failures.push(
    "Global PEP guard not found: no module registers AuthorizationGuard via APP_GUARD — authorization is not enforced."
  );
}

// A @Public route must be sanctioned; a protected route must be covered.
const undeclaredPublic = [];
const uncovered = [];
for (const entry of routes) {
  if (entry.isPublic && !SANCTIONED_PUBLIC_ROUTES.has(entry.route)) {
    undeclaredPublic.push(entry);
  }
  if (!entry.covered) {
    uncovered.push(entry);
  }
}

// Drift: a sanctioned public route that is no longer actually public (Nest only).
const staleSanctioned = [...SANCTIONED_PUBLIC_ROUTES].filter((route) => {
  const match = routes.find((entry) => entry.route === route);
  return match && match.runtime === "nest" && !match.isPublic;
});

if (undeclaredPublic.length > 0) {
  failures.push(
    `Undeclared public route(s): ${undeclaredPublic
      .map((entry) => entry.route)
      .join(
        ", "
      )} — a @Public() route must be added to SANCTIONED_PUBLIC_ROUTES with justification.`
  );
}
if (uncovered.length > 0) {
  failures.push(
    `Uncovered route(s): ${uncovered.map((entry) => entry.route).join(", ")} — not protected by the guard and not sanctioned public.`
  );
}
if (staleSanctioned.length > 0) {
  failures.push(
    `Stale public allowlist entr(ies): ${staleSanctioned.join(", ")} — sanctioned public but no longer marked @Public(); remove from the allowlist.`
  );
}

const publicRoutes = routes.filter((entry) => entry.isPublic);
const protectedRoutes = routes.filter((entry) => !entry.isPublic);

console.log(`Authorization endpoint-coverage gate (${enforce ? "ENFORCING" : "ADVISORY"})`);
console.log(`Global PEP guard registered: ${guardRegistered ? "yes" : "NO"}`);
console.log(`Routes discovered: ${routes.length}`);
console.log(
  `  protected (guard/policy): ${protectedRoutes.length} | public: ${publicRoutes.length}`
);
for (const entry of routes) {
  const status = entry.isPublic ? "public   " : entry.covered ? "protected" : "UNCOVERED";
  console.log(`  [${status}] ${entry.route}  (${entry.runtime}: ${entry.file})`);
}

if (routes.length === 0) {
  console.error("Gate error: no routes discovered — the inventory scan is broken.");
  process.exit(1);
}

if (failures.length > 0) {
  console.error("");
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  if (enforce) {
    process.exit(1);
  }
  console.log("\nAdvisory only — this gate is blocking under --enforce.");
} else {
  console.log(
    "\nAuthorization coverage OK: PEP guard enforced; every route protected or sanctioned public."
  );
}
