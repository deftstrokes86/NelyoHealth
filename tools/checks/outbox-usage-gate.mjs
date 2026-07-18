#!/usr/bin/env node
/**
 * Construction gate: transactional-outbox usage (roadmap M0.3).
 *
 * The accepted architecture (CANON-006) makes the transactional outbox the
 * single mandatory path for state changes: state + event intent + audit
 * intent in one transaction. This gate scans application and package source
 * for raw SQL write statements in modules that do not go through the outbox
 * transaction helper.
 *
 * Modes:
 *   default    — ADVISORY: prints findings, always exits 0.
 *   --enforce  — BLOCKING: exits 1 on violations. CI flips to this mode at
 *                roadmap M3.3 (handler retrofit complete).
 *
 * Exemptions (by design, reviewable below): the database package itself
 * (owns the helper, migrations, and CLI), migration SQL, seeds, tests, and
 * testing factories.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enforce = process.argv.includes("--enforce");

const SCAN_ROOTS = ["apps", "packages"].map((dir) => path.join(root, dir));

/** Path fragments exempt from the rule (normalized with forward slashes). */
const EXEMPT_PATH_FRAGMENTS = [
  "/node_modules/",
  "/lib/",
  "/dist/",
  "/.next/",
  "/migrations/",
  "/packages/database/",
  "/packages/testing-factories/"
];

const OUTBOX_MARKERS = ["runTransactionalWorkWithOutbox", "TransactionalOutboxPort"];

const SQL_WRITE_PATTERN =
  /\b(INSERT\s+INTO|UPDATE\s+[A-Za-z_."][\w."]*\s+SET|DELETE\s+FROM|TRUNCATE\s+TABLE)\b/i;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const normalized = full.split(path.sep).join("/");
    if (EXEMPT_PATH_FRAGMENTS.some((fragment) => `${normalized}/`.includes(fragment))) {
      continue;
    }
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (
      /\.(ts|mts|cts|mjs|js)$/.test(entry.name) &&
      !/\.(test|spec)\.(ts|mts|cts|mjs|js)$/.test(entry.name) &&
      !entry.name.endsWith(".d.ts")
    ) {
      out.push(full);
    }
  }
  return out;
}

const findings = [];
let scanned = 0;

for (const scanRoot of SCAN_ROOTS) {
  if (!fs.existsSync(scanRoot)) continue;
  for (const file of walk(scanRoot)) {
    scanned += 1;
    const source = fs.readFileSync(file, "utf8");
    if (!SQL_WRITE_PATTERN.test(source)) continue;
    const usesOutbox = OUTBOX_MARKERS.some((marker) => source.includes(marker));
    if (!usesOutbox) {
      const lines = source.split("\n");
      const hits = [];
      lines.forEach((line, index) => {
        if (SQL_WRITE_PATTERN.test(line)) hits.push(index + 1);
      });
      findings.push({
        file: path.relative(root, file),
        lines: hits.slice(0, 5)
      });
    }
  }
}

console.log(`Outbox-usage gate (${enforce ? "ENFORCING" : "ADVISORY"})`);
console.log(`Source files scanned: ${scanned}`);
if (findings.length === 0) {
  console.log("No raw SQL writes outside the transactional-outbox path. ✔");
} else {
  console.log(`Raw SQL writes WITHOUT the transactional-outbox helper: ${findings.length} file(s)`);
  for (const finding of findings) {
    console.log(`  [VIOLATION] ${finding.file} (lines ${finding.lines.join(", ")})`);
  }
}

if (scanned === 0) {
  console.error("Gate error: zero files scanned — the scan configuration is broken.");
  process.exit(1);
}

if (enforce && findings.length > 0) {
  console.error(
    `\nFAIL: ${findings.length} file(s) perform raw SQL writes outside the outbox path.`
  );
  process.exit(1);
}

if (!enforce && findings.length > 0) {
  console.log("\nAdvisory: violations listed above. This gate becomes blocking at roadmap M3.3.");
}
