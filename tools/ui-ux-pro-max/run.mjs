import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const toPosix = (value) => value.split(path.sep).join("/");
const args = process.argv.slice(2);
const rejected = new Set(["--persist", "--output-dir", "-o", "--page"]);
const allowed = new Set(["--label", "--domain", "--stack", "--query"]);
const parsed = { label: "review", domain: "ux", stack: "react", query: "" };
for (let i = 0; i < args.length; i += 1) {
  const flag = args[i];
  if (rejected.has(flag)) throw new Error(flag + " is prohibited by NelyoHealth governance.");
  if (!allowed.has(flag)) throw new Error("Unsupported UI UX Pro Max runner flag: " + flag);
  const value = args[++i];
  if (!value || value.startsWith("--")) throw new Error("Missing value for " + flag);
  parsed[flag.slice(2)] = value;
}
if (!parsed.query || parsed.query.length > 500)
  throw new Error("A bounded query up to 500 characters is required.");
const unsafeFragments = ["http://", "https://", "..", ";", "&", "|", "<", ">", "$", "\\"];
for (const [key, value] of Object.entries(parsed)) {
  if (unsafeFragments.some((fragment) => value.includes(fragment)))
    throw new Error("Unsafe " + key + " value rejected.");
}
const safeLabel =
  parsed.label
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "") || "review";
const integrity = spawnSync(process.execPath, ["tools/ui-ux-pro-max/check-integrity.mjs"], {
  cwd: root,
  encoding: "utf8"
});
if (integrity.status !== 0) {
  process.stderr.write(integrity.stderr || integrity.stdout);
  process.exit(integrity.status ?? 1);
}
const candidates =
  process.platform === "win32"
    ? [
        ["python", ["--version"]],
        ["py", ["-3", "--version"]],
        ["python3", ["--version"]]
      ]
    : [
        ["python3", ["--version"]],
        ["python", ["--version"]]
      ];
let python = null;
for (const [cmd, versionArgs] of candidates) {
  const result = spawnSync(cmd, versionArgs, { encoding: "utf8" });
  if (result.status === 0) {
    python = { cmd, prefixArgs: cmd === "py" ? ["-3"] : [] };
    break;
  }
}
if (!python) throw new Error("Python 3 is required for the vendored advisory search script.");
const outputDir = path.join(root, ".artifacts/ui-ux-pro-max");
fs.mkdirSync(outputDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.join(outputDir, safeLabel + "-" + stamp + ".md");
const metadataPath = path.join(outputDir, safeLabel + "-" + stamp + ".json");
const scriptPath = path.join(root, ".agents/skills/ui-ux-pro-max/scripts/search.py");
const scriptArgs = [
  ...python.prefixArgs,
  scriptPath,
  parsed.query,
  "--domain",
  parsed.domain,
  "--stack",
  parsed.stack
];
const run = spawnSync(python.cmd, scriptArgs, {
  cwd: root,
  encoding: "utf8",
  env: {
    PATH: process.env.PATH ?? "",
    SystemRoot: process.env.SystemRoot ?? "",
    PYTHONIOENCODING: "utf-8",
    PYTHONDONTWRITEBYTECODE: "1"
  }
});
if (run.status !== 0) {
  process.stderr.write(run.stderr || run.stdout);
  process.exit(run.status ?? 1);
}
const upstream = JSON.parse(
  fs.readFileSync(path.join(root, ".agents/skills/ui-ux-pro-max/UPSTREAM.json"), "utf8")
);
fs.writeFileSync(outputPath, "# UI UX Pro Max Advisory Output\n\n" + run.stdout + "\n");
fs.writeFileSync(
  metadataPath,
  JSON.stringify(
    {
      ...parsed,
      timestamp: new Date().toISOString(),
      outputPath: toPosix(path.relative(root, outputPath)),
      upstream
    },
    null,
    2
  ) + "\n"
);
console.log(toPosix(path.relative(root, outputPath)));
