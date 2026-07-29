#!/usr/bin/env node
/**
 * Patient-web typecheck fence (roadmap M7.1 review carry-item).
 *
 * patient-web carries pre-existing Category A (marketing-track) typecheck debt, so
 * `tsc` is already red — which means a NEW error (notably in the authenticated
 * (portal) segment or the M7.1 client/BFF/CSRF files) would be invisible: the build
 * was already failing. This fence GRANDFATHERS only the known-debt files by an
 * explicit allowlist and fails on ANY typecheck error outside it. So Category A
 * cannot silently absorb a portal regression; the baseline is fenced, not ignored.
 *
 * The allowlist is meant to SHRINK: when the marketing track fixes a listed file,
 * remove its entry. A stale entry (no longer erroring) is reported as advisory, not
 * a hard failure, so this fence never depends on another track's fix landing.
 */
import { execSync } from "node:child_process";

// Known, grandfathered Category A (marketing-track) debt. Do not add portal files here.
const ALLOWLIST = [
  "app/_gallery/marketing/gallery-content.ts",
  "src/components/ui/motion-shell.tsx"
];

function normalize(line) {
  return line.replaceAll("\\", "/");
}

let output = "";
try {
  output = execSync("pnpm --filter @nelyohealth/patient-web typecheck", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
} catch (error) {
  output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
}

const errorLines = output
  .split(/\r?\n/)
  .map(normalize)
  .filter((line) => /error TS\d+/.test(line));

const offending = errorLines.filter(
  (line) => !ALLOWLIST.some((allowed) => line.includes(allowed))
);
const seenAllowed = new Set(
  ALLOWLIST.filter((allowed) => errorLines.some((line) => line.includes(allowed)))
);
const staleAllow = ALLOWLIST.filter((allowed) => !seenAllowed.has(allowed));

console.log("Patient-web typecheck fence");
console.log(`  total tsc errors: ${errorLines.length}`);
console.log(`  grandfathered (Category A) files still erroring: ${seenAllowed.size}/${ALLOWLIST.length}`);
console.log(`  new/unfenced errors: ${offending.length}`);
for (const stale of staleAllow) {
  console.log(`  ADVISORY: allowlisted file no longer errors — remove from the fence: ${stale}`);
}

if (offending.length > 0) {
  console.error("\nFAIL: typecheck error(s) outside the grandfathered Category A allowlist:");
  for (const line of offending.slice(0, 40)) console.error(`  ${line}`);
  console.error(
    "\nThe (portal) segment and the M7.1 client/BFF/CSRF files must stay clean — fix the new error(s)."
  );
  process.exit(1);
}

console.log("\nPatient-web fence OK: no new typecheck errors outside the grandfathered Category A baseline.");
