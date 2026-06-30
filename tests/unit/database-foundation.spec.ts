import { describe, expect, it } from "vitest";
import {
  assertSafeDatabaseCommandEnvironment,
  deterministicSyntheticSeedRows,
  parsePort,
  resolveDatabaseCommandConfig
} from "../../packages/database/src/index.js";

describe("database foundation package", () => {
  it("resolves default local database config", () => {
    expect(resolveDatabaseCommandConfig({})).toMatchObject({
      host: "127.0.0.1",
      port: 55432,
      database: "nelyohealth_local",
      user: "nelyohealth",
      password: "localdev",
      ssl: false
    });
  });

  it("rejects invalid ports", () => {
    expect(() => parsePort("80", 55432)).toThrow(/1024/);
    expect(() => parsePort("invalid", 55432)).toThrow(/integer/);
  });

  it("blocks production database command environments", () => {
    expect(() =>
      assertSafeDatabaseCommandEnvironment("seed", {
        NODE_ENV: "production"
      })
    ).toThrow(/Refusing to run/);

    expect(() =>
      assertSafeDatabaseCommandEnvironment("seed", {
        NODE_ENV: "development",
        NELYO_DEPLOYMENT_ENV: "production"
      })
    ).toThrow(/Refusing to run/);
  });

  it("returns deterministic synthetic seed rows", () => {
    const a = deterministicSyntheticSeedRows();
    const b = deterministicSyntheticSeedRows();
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
    expect(a.every((row) => row.seedVersion === "p02-iss-004-v1")).toBe(true);
  });
});
