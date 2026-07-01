import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const dbCliScript = path.join(rootDir, "packages/database/scripts/db-cli.mjs");

function runDb(command: string): string {
  return execFileSync(process.execPath, [dbCliScript, command], {
    cwd: rootDir,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "test",
      NELYO_DEPLOYMENT_ENV: "local"
    }
  });
}

describe.skipIf(!shouldRun)("database cli integration", () => {
  it("applies migrations, seeds deterministic rows, reports status, and resets", () => {
    const migrateOutput = runDb("migrate");
    expect(migrateOutput).toContain("Migration complete");

    const seedOutput = runDb("seed");
    expect(seedOutput).toContain("Synthetic seed complete");

    const statusOutput = runDb("status");
    expect(statusOutput).toContain("0001_foundation_infrastructure: applied");

    const resetOutput = runDb("reset");
    expect(resetOutput).toContain("Synthetic seed table reset complete");
  });
});
