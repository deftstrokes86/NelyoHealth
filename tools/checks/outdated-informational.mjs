#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const root = process.cwd();
const timeout = 120_000;

function runPnpm(args) {
  const execPath = process.env.npm_execpath;
  const options = {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout
  };
  if (execPath && /pnpm/i.test(execPath)) {
    if (/\.(cjs|mjs|js)$/i.test(execPath)) {
      return execFileSync(process.execPath, [execPath, ...args], options);
    }
    return execFileSync(execPath, args, options);
  }
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  return execFileSync(command, args, options);
}

try {
  const output = runPnpm(["outdated", "--format", "table"]);
  const trimmed = output.trim();
  console.log(trimmed || "No outdated dependencies reported by pnpm.");
} catch (error) {
  const stdout = error.stdout?.toString().trim();
  const stderr = error.stderr?.toString().trim();
  if (stdout) console.log(stdout);
  if (stderr) console.warn(stderr);
  if (error.signal === "SIGTERM" || /timed out/i.test(String(error.message))) {
    console.warn(
      `pnpm outdated did not complete within ${timeout / 1000}s; this network-dependent check remains informational.`
    );
  } else {
    console.warn(
      "pnpm outdated returned a nonzero status; this usually means newer versions are available and remains informational for P01-FND-003."
    );
  }
}
