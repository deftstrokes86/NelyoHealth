#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const command = process.argv[2] ?? "status";

console.warn(
  "tools/checks/phase-gated-database-command.mjs is deprecated. Use pnpm db:* commands directly."
);

const result = spawnSync("node", ["packages/database/scripts/db-cli.mjs", command], {
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
