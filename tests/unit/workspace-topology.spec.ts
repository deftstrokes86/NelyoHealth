import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const applications = [
  ["api", "@nelyohealth/api"],
  ["worker", "@nelyohealth/worker"],
  ["patient-web", "@nelyohealth/patient-web"],
  ["provider-web", "@nelyohealth/provider-web"],
  ["organization-web", "@nelyohealth/organization-web"],
  ["admin-web", "@nelyohealth/admin-web"],
  ["mobile", "@nelyohealth/mobile"]
] as const;

const sharedPackages = [
  ["api-client", "@nelyohealth/api-client"],
  ["config", "@nelyohealth/config"],
  ["domain", "@nelyohealth/domain"],
  ["observability", "@nelyohealth/observability"],
  ["platform-adapters", "@nelyohealth/platform-adapters"],
  ["testing-factories", "@nelyohealth/testing-factories"]
] as const;

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
] as const;

interface WorkspaceManifest {
  name: string;
  version: string;
  private: boolean;
  type: string;
  scripts?: Record<string, string>;
  publishConfig?: unknown;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function readManifest(relativePath: string): WorkspaceManifest {
  return JSON.parse(readText(relativePath)) as WorkspaceManifest;
}

function expectBoundaryWorkspace(
  relativeDir: string,
  packageName: string,
  markerName: string
): void {
  const manifest = readManifest(`${relativeDir}/package.json`);
  expect(manifest).toMatchObject({
    name: packageName,
    version: "0.0.0",
    private: true,
    type: "module"
  });
  expect(manifest.publishConfig).toBeUndefined();
  expect(manifest.scripts?.build).toBe("tsc -p tsconfig.json");
  expect(manifest.scripts?.typecheck).toBe("tsc -p tsconfig.json --noEmit");

  for (const lifecycle of ["preinstall", "install", "postinstall", "prepare"]) {
    expect(manifest.scripts?.[lifecycle]).toBeUndefined();
  }

  for (const dependencyField of dependencyFields) {
    expect(manifest[dependencyField] ?? {}).toEqual({});
  }

  expect(fs.existsSync(path.join(rootDir, relativeDir, "README.md"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "tsconfig.json"))).toBe(true);

  const source = readText(`${relativeDir}/src/index.ts`);
  expect(source).toContain(markerName);
  expect(source).toContain('status: "boundary-only"');
  expect(source).toContain("runtimeImplementation: false");
  expect(source).toContain("featureImplementation: false");
}

describe("Phase 2 workspace topology", () => {
  it("registers the approved apps in the pnpm workspace", () => {
    const workspace = readText("pnpm-workspace.yaml");
    expect(workspace).toContain('- "apps/*"');
    expect(workspace).toContain('- "packages/*"');
    expect(workspace).toContain('- "tools/*"');

    for (const [appName] of applications) {
      expect(fs.existsSync(path.join(rootDir, "apps", appName))).toBe(true);
    }
  });

  it("keeps application scaffolds private, dependency-free, and boundary-only", () => {
    for (const [appName, packageName] of applications) {
      const marker = `${appName.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}ApplicationBoundary`;
      expectBoundaryWorkspace(`apps/${appName}`, packageName, marker);
      expect(fs.existsSync(path.join(rootDir, "apps", appName, "AGENTS.md"))).toBe(true);
    }
  });

  it("keeps approved shared packages private, dependency-free, and boundary-only", () => {
    for (const [packageDir, packageName] of sharedPackages) {
      const marker = `${packageDir.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}PackageBoundary`;
      expectBoundaryWorkspace(`packages/${packageDir}`, packageName, marker);
    }
  });
});
