#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = path.join(packageDir, "migrations");

function parsePort(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1024 || parsed > 65535) {
    throw new Error("Database port must be an integer from 1024 through 65535.");
  }
  return parsed;
}

function assertSafe(command, env = process.env) {
  const nodeEnv = (env.NODE_ENV ?? "development").toLowerCase();
  const deploymentEnv = (env.NELYO_DEPLOYMENT_ENV ?? "local").toLowerCase();
  if (nodeEnv === "production" || deploymentEnv === "production") {
    throw new Error(`Refusing to run db:${command} when NODE_ENV or NELYO_DEPLOYMENT_ENV is production.`);
  }
  if (env.NELYO_ALLOW_PRODUCTION_DB_COMMANDS === "true") {
    throw new Error("NELYO_ALLOW_PRODUCTION_DB_COMMANDS=true is not allowed.");
  }
}

function databaseConfig(env = process.env) {
  return {
    host: env.NELYO_LOCAL_POSTGRES_HOST ?? "127.0.0.1",
    port: parsePort(env.NELYO_LOCAL_POSTGRES_PORT, 55432),
    database: env.NELYO_LOCAL_POSTGRES_DB ?? "nelyohealth_local",
    user: env.NELYO_LOCAL_POSTGRES_USER ?? "nelyohealth",
    password: env.NELYO_LOCAL_POSTGRES_PASSWORD ?? "localdev",
    ssl: env.NELYO_LOCAL_POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : false
  };
}

function readMigrations() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".up.sql"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const absolute = path.join(migrationsDir, file);
    const sql = fs.readFileSync(absolute, "utf8");
    return {
      id: file.replace(/\.up\.sql$/, ""),
      sql,
      checksum: crypto.createHash("sha256").update(sql).digest("hex")
    };
  });
}

function readDownMigration(id) {
  const downPath = path.join(migrationsDir, `${id}.down.sql`);
  if (!fs.existsSync(downPath)) return null;
  return fs.readFileSync(downPath, "utf8");
}

async function ensureMetadata(client) {
  await client.query(`
    CREATE SCHEMA IF NOT EXISTS nelyo_meta;
    CREATE TABLE IF NOT EXISTS nelyo_meta.schema_migrations (
      migration_id TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function appliedMigrations(client) {
  await ensureMetadata(client);
  const result = await client.query(
    "SELECT migration_id, checksum, applied_at FROM nelyo_meta.schema_migrations ORDER BY migration_id ASC"
  );
  return result.rows;
}

async function migrate(client) {
  const migrations = readMigrations();
  const applied = await appliedMigrations(client);
  const appliedMap = new Map(applied.map((row) => [row.migration_id, row]));

  let appliedCount = 0;
  for (const migration of migrations) {
    const existing = appliedMap.get(migration.id);
    if (existing) {
      if (existing.checksum !== migration.checksum) {
        throw new Error(
          `Checksum mismatch for migration ${migration.id}. Expected ${existing.checksum} but found ${migration.checksum}.`
        );
      }
      continue;
    }

    await client.query("BEGIN");
    try {
      await client.query(migration.sql);
      await client.query(
        "INSERT INTO nelyo_meta.schema_migrations (migration_id, checksum) VALUES ($1, $2)",
        [migration.id, migration.checksum]
      );
      await client.query("COMMIT");
      appliedCount += 1;
      console.log(`Applied migration ${migration.id}.`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  const pendingBefore = migrations.filter((migration) => !appliedMap.has(migration.id)).length;
  console.log(`Migration complete. Applied in this run: ${appliedCount}. Pending before run: ${pendingBefore}.`);
}

async function status(client) {
  const migrations = readMigrations();
  const applied = await appliedMigrations(client);
  const appliedMap = new Map(applied.map((row) => [row.migration_id, row]));

  console.log("Database migration status:");
  for (const migration of migrations) {
    const row = appliedMap.get(migration.id);
    if (row) {
      console.log(`- ${migration.id}: applied at ${row.applied_at.toISOString()}`);
    } else {
      console.log(`- ${migration.id}: pending`);
    }
  }
}

function syntheticSeedRows(seedVersion = "p02-iss-004-v1") {
  return [
    ["synthetic.system.region", "sandbox-west", seedVersion],
    ["synthetic.system.release_channel", "phase-2-foundation", seedVersion],
    ["synthetic.system.seed_marker", "SYNTHETIC_ONLY", seedVersion]
  ];
}

async function resetSyntheticSeed(client) {
  await client.query("BEGIN");
  try {
    await client.query(
      "CREATE SCHEMA IF NOT EXISTS nelyo_foundation; CREATE TABLE IF NOT EXISTS nelyo_foundation.synthetic_seed_reference (seed_key TEXT PRIMARY KEY, seed_value TEXT NOT NULL, seed_version TEXT NOT NULL, seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW());"
    );
    await client.query("TRUNCATE TABLE nelyo_foundation.synthetic_seed_reference");
    await client.query("COMMIT");
    console.log("Synthetic seed table reset complete.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function seed(client) {
  await migrate(client);
  await resetSyntheticSeed(client);
  const rows = syntheticSeedRows();

  await client.query("BEGIN");
  try {
    for (const [seedKey, seedValue, seedVersion] of rows) {
      await client.query(
        "INSERT INTO nelyo_foundation.synthetic_seed_reference (seed_key, seed_value, seed_version) VALUES ($1, $2, $3)",
        [seedKey, seedValue, seedVersion]
      );
    }
    await client.query("COMMIT");
    console.log(`Synthetic seed complete. Inserted rows: ${rows.length}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function rollbackLatest(client) {
  const applied = await appliedMigrations(client);
  if (applied.length === 0) {
    console.log("No applied migrations to roll back.");
    return;
  }

  const latest = applied[applied.length - 1];
  const downSql = readDownMigration(latest.migration_id);
  if (!downSql) {
    throw new Error(`No down migration found for ${latest.migration_id}.`);
  }

  await client.query("BEGIN");
  try {
    await client.query(downSql);
    await client.query("DELETE FROM nelyo_meta.schema_migrations WHERE migration_id = $1", [
      latest.migration_id
    ]);
    await client.query("COMMIT");
    console.log(`Rolled back migration ${latest.migration_id}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function run() {
  const command = process.argv[2] ?? "help";

  if (command === "help") {
    console.log("Usage: node packages/database/scripts/db-cli.mjs <migrate|seed|status|reset|rollback>");
    return;
  }

  if (!["migrate", "seed", "status", "reset", "rollback"].includes(command)) {
    throw new Error(`Unknown database command: ${command}`);
  }

  assertSafe(command);
  const client = new Client(databaseConfig());
  await client.connect();

  try {
    if (command === "migrate") await migrate(client);
    if (command === "seed") await seed(client);
    if (command === "status") await status(client);
    if (command === "reset") await resetSyntheticSeed(client);
    if (command === "rollback") await rollbackLatest(client);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`Database command failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
