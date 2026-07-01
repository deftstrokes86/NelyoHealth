import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const toPosix = (value) => value.split(path.sep).join("/");
const allowed = JSON.parse(
  fs.readFileSync(path.join(root, ".agents/skills/ui-ux-pro-max/allowed-files.json"), "utf8")
).files;
const allowedMap = new Map(allowed.map((item) => [item.path, item.sha256]));
const scanRoots = [".agents/skills/ui-ux-pro-max", "tools/vendor/ui-ux-pro-max"];
const discovered = [];

function bytesForIntegrityHash(filePath, bytes) {
  if (!filePath.endsWith(".csv")) return bytes;
  return Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
}

for (const scanRoot of scanRoots) {
  const absoluteRoot = path.join(root, scanRoot);
  if (!fs.existsSync(absoluteRoot)) continue;
  const stack = [absoluteRoot];
  while (stack.length) {
    const current = stack.pop();
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink())
      throw new Error("Symlink or junction is not allowed: " + path.relative(root, current));
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current)) stack.push(path.join(current, entry));
      continue;
    }
    const rel = toPosix(path.relative(root, current));
    if (
      rel.endsWith("UPSTREAM.json") ||
      rel.endsWith("allowed-files.json") ||
      rel.endsWith("SKILL.md") ||
      rel.endsWith("NOTICE.md")
    )
      continue;
    discovered.push(rel);
  }
}
for (const item of allowed) {
  const absolute = path.join(root, item.path);
  if (!fs.existsSync(absolute))
    throw new Error("Missing vendored UI UX Pro Max file: " + item.path);
  const stat = fs.lstatSync(absolute);
  if (stat.isSymbolicLink()) throw new Error("Symlink or junction is not allowed: " + item.path);
  const hash = crypto
    .createHash("sha256")
    .update(bytesForIntegrityHash(item.path, fs.readFileSync(absolute)))
    .digest("hex");
  if (hash !== item.sha256) throw new Error("Hash mismatch for " + item.path);
}
const extras = discovered.filter((rel) => !allowedMap.has(rel));
if (extras.length > 0)
  throw new Error("Unexpected vendored UI UX Pro Max file(s): " + extras.join(", "));
console.log("UI UX Pro Max integrity OK (" + allowed.length + " files).");
