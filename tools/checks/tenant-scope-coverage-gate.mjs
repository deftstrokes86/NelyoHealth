#!/usr/bin/env node
/**
 * Construction gate: repository tenant-scope coverage (roadmap M8.2, AM-7).
 *
 * The Scope Registry (packages/database/src/scope-registry.data.json) is the single
 * source of truth for which persistence tables are SCOPE-OWNED. This gate scans the
 * repository layer's SQL and proves — structurally, before production — that every
 * statement touching a scope-owned table carries its scope constraint by construction:
 *
 *   - aggregate of record   → INSERT stamps the scope column; SELECT/UPDATE/DELETE
 *                             carries `<scopeColumn> = $` (the belt-and-suspenders
 *                             predicate — even PK-keyed single-object statements).
 *   - child (scoped-via-parent, no scope column of its own) → every statement is keyed
 *                             by the parent foreign key.
 *   - tables NOT in the registry are intentionally global → untouched.
 *
 * A forgotten scope predicate fails CI rather than leaking across tenants at runtime.
 * Genuinely cross-scope statements (a subject's own record across organizations, a
 * discovery load that ESTABLISHES the scope for an immediate PDP decision) are governed
 * in tools/checks/scope-exemptions.json — visible debt, printed on every run.
 *
 * Modes:
 *   default    — ADVISORY: prints findings, exits 0 (used during the M8.2 retrofit).
 *   --enforce  — BLOCKING: exits 1 on any violation or stale ledger entry.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enforce = process.argv.includes("--enforce");

const registry = JSON.parse(
  fs.readFileSync(
    path.join(root, "packages", "database", "src", "scope-registry.data.json"),
    "utf8"
  )
);
const ledger = JSON.parse(
  fs.readFileSync(path.join(root, "tools", "checks", "scope-exemptions.json"), "utf8")
);

const byName = new Map(registry.tables.map((t) => [`${t.schema}.${t.table}`, t]));

const repoDir = path.join(root, "packages", "database", "src");
const repoFiles = fs.readdirSync(repoDir).filter((n) => n.endsWith("-repository.ts"));

/** Extract every backtick template literal (each SQL query is one). */
function templates(source) {
  return source.match(/`[^`]*`/g) ?? [];
}

/** Identify the primary operation + target table of a SQL template. */
function classify(sql) {
  const m =
    /\bINSERT\s+INTO\s+([a-z_]+\.[a-z_]+)/i.exec(sql) ||
    /\bUPDATE\s+([a-z_]+\.[a-z_]+)\s+SET/i.exec(sql) ||
    /\bDELETE\s+FROM\s+([a-z_]+\.[a-z_]+)/i.exec(sql) ||
    /\bFROM\s+([a-z_]+\.[a-z_]+)/i.exec(sql);
  if (!m) return null;
  const target = m[1];
  const op = /\bINSERT\s+INTO/i.test(sql)
    ? "INSERT"
    : /\bUPDATE\s+[a-z_]+\.[a-z_]+\s+SET/i.test(sql)
      ? "UPDATE"
      : /\bDELETE\s+FROM/i.test(sql)
        ? "DELETE"
        : "SELECT";
  return { op, target };
}

/** Does the statement satisfy the scope rule for its table? */
function isCovered(sql, entry, op) {
  if (entry.scopes.length > 0) {
    const col = entry.scopes[0].column; // organization_ref today; extends per binding
    if (op === "INSERT") return new RegExp(`\\b${col}\\b`).test(sql);
    return new RegExp(`\\b${col}\\s*=\\s*\\$\\d`).test(sql);
  }
  // Child table (no scope column of its own): it must be keyed by the parent foreign
  // key (a collection scoped to its parent) OR by its own primary key (a single-object
  // op). Either way it can only reach rows reachable from an already-scoped parent.
  const fk = entry.parent?.foreignKey;
  if (!fk) return false;
  const keyed = [fk, ...entry.primaryKey];
  if (op === "INSERT") return keyed.some((c) => new RegExp(`\\b${c}\\b`).test(sql));
  return keyed.some((c) => new RegExp(`\\b${c}\\s*=\\s*\\$\\d`).test(sql));
}

function normalize(sql) {
  return sql.replace(/\s+/g, " ").replace(/`/g, "").trim();
}

const violations = [];
const waived = [];
const ledgerHits = new Set();
let statementsScanned = 0;

for (const file of repoFiles) {
  const source = fs.readFileSync(path.join(repoDir, file), "utf8");
  for (const raw of templates(source)) {
    const info = classify(raw);
    if (!info) continue;
    const entry = byName.get(info.target);
    if (!entry) continue; // global table — untouched
    statementsScanned += 1;
    if (isCovered(raw, entry, info.op)) continue;

    const flat = normalize(raw);
    const exemption = ledger.exemptions.find(
      (e) => e.module === file && flat.includes(e.sqlIncludes)
    );
    if (exemption) {
      waived.push({ file, table: info.target, op: info.op, reason: exemption.reason });
      ledgerHits.add(exemption);
      continue;
    }
    violations.push({
      file,
      table: info.target,
      op: info.op,
      snippet: flat.slice(0, 90)
    });
  }
}

const staleLedger = ledger.exemptions.filter((e) => !ledgerHits.has(e));

console.log(`Tenant-scope coverage gate (${enforce ? "ENFORCING" : "ADVISORY"})`);
console.log(`  scope-owned tables in registry: ${registry.tables.length}`);
console.log(`  repository files scanned: ${repoFiles.length}`);
console.log(`  scope-owned statements: ${statementsScanned}`);
console.log(`  covered by construction: ${statementsScanned - violations.length - waived.length}`);
console.log(`  governed exemptions (ledger): ${waived.length}`);
console.log(`  UNCOVERED: ${violations.length}`);

for (const v of violations) {
  console.log(`  [UNCOVERED] ${v.file} ${v.op} ${v.table}: ${v.snippet}…`);
}
if (waived.length > 0) {
  console.log("\nGoverned cross-scope exemptions (visible debt):");
  for (const w of waived) console.log(`  [WAIVED] ${w.file} ${w.op} ${w.table} — ${w.reason}`);
}
if (staleLedger.length > 0) {
  console.log("\nStale ledger entries (no matching statement — remove or fix):");
  for (const s of staleLedger) console.log(`  [STALE] ${s.module}: "${s.sqlIncludes}"`);
}

if (statementsScanned === 0) {
  console.error("\nGate error: zero scope-owned statements scanned — the scan is broken.");
  process.exit(1);
}

if (enforce && (violations.length > 0 || staleLedger.length > 0)) {
  console.error(
    `\nFAIL: ${violations.length} uncovered scope-owned statement(s), ${staleLedger.length} stale ledger entry(ies).`
  );
  console.error(
    "Add the scope predicate (`<scopeColumn> = $n`) via the runtime scope-guard, or, if the statement is genuinely cross-scope, add a governed entry to tools/checks/scope-exemptions.json."
  );
  process.exit(1);
}

if (!enforce && violations.length > 0) {
  console.log(
    "\nAdvisory: violations listed above. This gate becomes blocking (--enforce) at the M8.2 boundary."
  );
}
