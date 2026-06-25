import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const before = new Map();
for (const file of ["generated/tokens.json", "generated/tokens.css"]) {
  const full = path.join(root, file);
  before.set(file, fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null);
}
const build = spawnSync(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);
const changed = [];
for (const file of before.keys()) {
  const full = path.join(root, file);
  const after = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null;
  if (before.get(file) !== after) changed.push(file);
}
if (changed.length > 0) {
  console.error(`Design token generated output drifted: ${changed.join(", ")}`);
  process.exit(1);
}
console.log("Design token generated output is current.");
