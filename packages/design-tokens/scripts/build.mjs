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
const rootLines = [":root {"];
const darkOverrides = [];
for (const [category, group] of Object.entries(tokens)) {
  for (const [name, definition] of Object.entries(group)) {
    const varName = tokenCssVariableName(category, name);
    rootLines.push(`  ${varName}: ${definition.value};`);
    if (definition.dark !== undefined) {
      darkOverrides.push(`  ${varName}: ${definition.dark};`);
    }
  }
}
rootLines.push("}");
const darkLines = [];
if (darkOverrides.length > 0) {
  darkLines.push("");
  darkLines.push('[data-theme="dark"] {');
  darkLines.push(...darkOverrides);
  darkLines.push("}");
  darkLines.push("");
  darkLines.push("@media (prefers-color-scheme: dark) {");
  darkLines.push('  :root:not([data-theme="light"]) {');
  darkLines.push(...darkOverrides.map((line) => `  ${line}`));
  darkLines.push("  }");
  darkLines.push("}");
}
fs.writeFileSync(
  path.join(outDir, "tokens.css"),
  [...rootLines, ...darkLines].join("\n") + "\n"
);
console.log(`Generated ${path.relative(process.cwd(), outDir)}`);
