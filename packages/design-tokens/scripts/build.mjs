import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, tokenCssVariableName, visualDirection, tokenAuditSummary } from "../lib/index.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "tokens.json"),
  JSON.stringify({ visualDirection, tokenAuditSummary, tokens }, null, 2) + "\n"
);
const lines = [":root {"];
for (const [category, group] of Object.entries(tokens)) {
  for (const [name, definition] of Object.entries(group))
    lines.push(`  ${tokenCssVariableName(category, name)}: ${definition.value};`);
}
lines.push("}");
fs.writeFileSync(path.join(outDir, "tokens.css"), lines.join("\n") + "\n");
console.log(`Generated ${path.relative(process.cwd(), outDir)}`);
