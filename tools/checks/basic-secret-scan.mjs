import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const includeExtensions = new Set([
  "",
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".mjs",
  ".ts",
  ".toml",
  ".yaml",
  ".yml"
]);

const ignoredPathFragments = [
  "node_modules/",
  ".next/",
  ".artifacts/",
  "test-results/",
  "playwright-report/",
  ".auth/",
  "pnpm-lock.yaml",
  ".git/"
];

const patterns = [
  { label: "aws-access-key", regex: /AKIA[0-9A-Z]{16}/g },
  { label: "private-key", regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { label: "openai-secret-key", regex: /sk-[A-Za-z0-9_-]{20,}/g },
  {
    label: "generic-secret-assignment",
    regex:
      /(?:api[_-]?key|secret|token|password)(?!name\b)\s*[:=]\s*["'](?!\[redacted:)[^"'\s]{20,}["']/gi
  }
];

function projectFiles() {
  const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8"
  });
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => !ignoredPathFragments.some((fragment) => path.includes(fragment)))
    .filter((path) => includeExtensions.has(extname(path)));
}

const findings = [];
for (const file of projectFiles()) {
  const text = readFileSync(file, "utf8");
  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const line = text.slice(0, match.index).split(/\r?\n/).length;
      findings.push({ file, line, label: pattern.label });
    }
  }
}

if (findings.length > 0) {
  console.error("Basic secret-pattern scan failed. Values are intentionally not printed.");
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.label}`);
  }
  process.exit(1);
}

console.log("Basic secret-pattern scan passed.");
