#!/usr/bin/env node
/**
 * Projection-coverage gate (roadmap M8.1, AM-8).
 *
 * Enforces that every cross-context read DTO leaving a resource controller is routed
 * through the central projection layer: each `create<Name>Dto(...)` response
 * construction must be an argument to `project(` or `projectExact(` (which carry the
 * field classification map + the reader's obligations). This makes the "all
 * cross-context reads pass through the projection layer" invariant structural, the
 * way the endpoint-coverage gate does for authorization — a new read DTO that forgets
 * to declare + project fails here rather than leaking by omission.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resourceDir = path.join(root, "apps", "api", "src", "nest", "resource");
const files = fs.readdirSync(resourceDir).filter((name) => name.endsWith(".controller.ts"));

const DTO_CALL = /create\w*Dto\(/g;
const WRAPPED_BEFORE = /(?:projectExact|project)\(\s*$/;

const violations = [];
let dtoConstructions = 0;

for (const file of files) {
  const source = fs.readFileSync(path.join(resourceDir, file), "utf8");
  let match;
  while ((match = DTO_CALL.exec(source)) !== null) {
    dtoConstructions += 1;
    const before = source.slice(Math.max(0, match.index - 60), match.index);
    if (!WRAPPED_BEFORE.test(before)) {
      const snippet = source.slice(match.index, match.index + 40).replace(/\s+/g, " ");
      violations.push(`${file}: '${snippet}…' is not wrapped in project()/projectExact()`);
    }
  }
}

console.log("Projection-coverage gate");
console.log(`  resource controllers scanned: ${files.length}`);
console.log(`  read-DTO constructions: ${dtoConstructions}`);
console.log(`  unrouted: ${violations.length}`);

if (dtoConstructions === 0) {
  console.error("Gate error: no create*Dto constructions found — the scan is broken.");
  process.exit(1);
}
if (violations.length > 0) {
  console.error("\nFAIL: cross-context read DTO(s) not routed through the projection layer:");
  for (const v of violations) console.error(`  ${v}`);
  console.error(
    "\nWrap the DTO in projectExact(dto, <CLASSIFICATION_MAP>, <context>) so its fields declare a data classification (M8.1)."
  );
  process.exit(1);
}
console.log(
  "\nProjection coverage OK: every resource read DTO routes through the projection layer."
);
