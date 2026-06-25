import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const harnessModuleUrl = pathToFileURL(
  path.join(rootDir, "tools/local-infra/local-infra.mjs")
).href;

async function loadHarness() {
  return (await import(harnessModuleUrl)) as {
    dockerAvailability: () => { available: boolean; message: string };
    findOpenPorts: (
      services: Array<{ name: string; host: string; port: number }>
    ) => Promise<Array<{ name: string; host: string; port: number }>>;
    imagePins: Array<{ name: string; image: string; version: string; license: string }>;
    localInfraConfig: () => {
      services: Array<{ name: string; host: string; port: number; env: string }>;
    };
    parsePort: (value: string | undefined, fallback: number, label?: string) => number;
    validateStaticConfig: () => string[];
  };
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

describe("Phase 2 local infrastructure harness", () => {
  it("keeps the local infrastructure compose file exact-pinned and local-only", async () => {
    const harness = await loadHarness();
    const compose = readText("infra/local/compose.yaml");
    const failures = harness.validateStaticConfig();

    expect(failures).toEqual([]);
    expect(compose).not.toContain(":latest");
    expect(compose).not.toContain("AUTH_TOKEN");
    expect(compose).not.toContain("production");
    expect(compose).toContain("127.0.0.1:${NELYO_LOCAL_POSTGRES_PORT:-55432}:5432");
    expect(compose).toContain("127.0.0.1:${NELYO_LOCAL_VALKEY_PORT:-56379}:6379");
    expect(compose).toContain("127.0.0.1:${NELYO_LOCAL_OBJECT_STORAGE_PORT:-55000}:5000");

    for (const image of harness.imagePins) {
      expect(image.image).toContain("@sha256:");
      expect(compose).toContain(image.image);
    }
  });

  it("documents all expected local services without real credentials", async () => {
    const harness = await loadHarness();
    const config = harness.localInfraConfig();
    const serviceNames = config.services.map((service) => service.name);

    expect(serviceNames).toEqual([
      "postgres-postgis",
      "valkey",
      "object-storage",
      "otel-collector-grpc",
      "otel-collector-http",
      "otel-collector-health"
    ]);
    expect(config.services.every((service) => service.host === "127.0.0.1")).toBe(true);
    expect(readText("infra/local/README.md")).toContain("synthetic local defaults");
  });

  it("rejects invalid local port overrides", async () => {
    const harness = await loadHarness();

    expect(harness.parsePort(undefined, 55432)).toBe(55432);
    expect(() => harness.parsePort("80", 55432, "TEST_PORT")).toThrow(/1024 through 65535/);
    expect(() => harness.parsePort("not-a-port", 55432, "TEST_PORT")).toThrow(/1024 through 65535/);
  });

  it("detects occupied ports before start", async () => {
    const harness = await loadHarness();
    const server = net.createServer();

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    expect(typeof address).toBe("object");

    const port = typeof address === "object" && address ? address.port : 0;
    const conflicts = await harness.findOpenPorts([
      { name: "occupied-test-port", host: "127.0.0.1", port }
    ]);

    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );

    expect(conflicts.map((conflict) => conflict.name)).toEqual(["occupied-test-port"]);
  });

  it("reports Docker availability without requiring Docker for static checks", async () => {
    const harness = await loadHarness();
    const availability = harness.dockerAvailability();

    expect(typeof availability.available).toBe("boolean");
    expect(availability.message.length).toBeGreaterThan(0);
  });
});
