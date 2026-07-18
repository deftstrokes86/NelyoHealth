import pg from "pg";

/**
 * Database client factory (Identity & Access + platform persistence).
 *
 * Central place to construct pg clients/pools against the local stack's
 * NELYO_LOCAL_POSTGRES_* environment contract (same contract db-cli.mjs
 * and the API readiness probe use).
 */

export interface DatabaseClientConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

export function localDatabaseConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): DatabaseClientConfig {
  return {
    host: env.NELYO_LOCAL_POSTGRES_HOST ?? "127.0.0.1",
    port: Number(env.NELYO_LOCAL_POSTGRES_PORT ?? 55432),
    database: env.NELYO_LOCAL_POSTGRES_DB ?? "nelyohealth_local",
    user: env.NELYO_LOCAL_POSTGRES_USER ?? "nelyohealth",
    password: env.NELYO_LOCAL_POSTGRES_PASSWORD ?? "localdev",
    ssl: env.NELYO_LOCAL_POSTGRES_SSL === "true"
  };
}

export function createDatabaseClient(config?: DatabaseClientConfig): pg.Client {
  const resolved = config ?? localDatabaseConfigFromEnv();
  return new pg.Client({
    host: resolved.host,
    port: resolved.port,
    database: resolved.database,
    user: resolved.user,
    password: resolved.password,
    ssl: resolved.ssl ? { rejectUnauthorized: false } : false
  });
}

export function createDatabasePool(config?: DatabaseClientConfig): pg.Pool {
  const resolved = config ?? localDatabaseConfigFromEnv();
  return new pg.Pool({
    host: resolved.host,
    port: resolved.port,
    database: resolved.database,
    user: resolved.user,
    password: resolved.password,
    ssl: resolved.ssl ? { rejectUnauthorized: false } : false
  });
}
