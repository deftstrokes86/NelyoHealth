import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const runtimeApplications = [
  ["api", "@nelyohealth/api"],
  ["worker", "@nelyohealth/worker"]
] as const;

const mobileShellApplications = [["mobile", "@nelyohealth/mobile"]] as const;

// patient-web is under active build-out (marketing surfaces); the other three
// remain untouched Next.js shells. They are governed by different contracts.
const webShellApplications = [
  ["provider-web", "@nelyohealth/provider-web"],
  ["organization-web", "@nelyohealth/organization-web"],
  ["admin-web", "@nelyohealth/admin-web"]
] as const;

const activeWebApplications = [["patient-web", "@nelyohealth/patient-web"]] as const;

const webShellBaseDependencies = {
  "@nelyohealth/api-client": "workspace:*",
  "@nelyohealth/ui-foundation": "workspace:*",
  next: "16.2.9",
  react: "19.2.7",
  "react-dom": "19.2.7"
} as const;

// Dependencies an active web application may add beyond the shell base. Each
// entry is an explicit governance decision — the test fails on any unvetted
// addition, so drift stays visible rather than silently accepted.
const activeWebApplicationAllowedExtraDependencies = new Set([
  "@nelyohealth/content-registry",
  "@radix-ui/react-slot",
  "@xyflow/react",
  "class-variance-authority",
  "clsx",
  "framer-motion",
  "lucide-react",
  "tailwind-merge"
]);

const boundarySharedPackages = [
  ["domain", "@nelyohealth/domain"],
  ["testing-factories", "@nelyohealth/testing-factories"]
] as const;

const runtimeSharedPackages = [
  ["api-client", "@nelyohealth/api-client"],
  ["config", "@nelyohealth/config"],
  ["observability", "@nelyohealth/observability"],
  ["platform-adapters", "@nelyohealth/platform-adapters"],
  ["database", "@nelyohealth/database"]
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
  // A boundary package may carry a descriptive status as it accrues shared
  // contracts (e.g. the domain identity/tenancy model scaffold). The boundary
  // invariant is not the label but that it remains non-runtime and
  // non-feature — asserted on the next two lines.
  expect(source).toMatch(/status: "[a-z0-9-]+"/);
  expect(source).toContain("runtimeImplementation: false");
  expect(source).toContain("featureImplementation: false");
}

function expectWebShellWorkspace(
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
  expect(manifest.scripts?.dev).toBe("next dev");
  expect(manifest.scripts?.build).toBe("next build");
  expect(manifest.scripts?.start).toBe("next start");
  expect(manifest.scripts?.typecheck).toBe("tsc -p tsconfig.json --noEmit");

  for (const lifecycle of ["preinstall", "install", "postinstall", "prepare"]) {
    expect(manifest.scripts?.[lifecycle]).toBeUndefined();
  }

  expect(manifest.dependencies).toEqual(webShellBaseDependencies);

  expect(fs.existsSync(path.join(rootDir, relativeDir, "README.md"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "tsconfig.json"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "app", "page.tsx"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "app", "layout.tsx"))).toBe(true);

  const source = readText(`${relativeDir}/src/index.ts`);
  expect(source).toContain(markerName);
  expect(source).toContain('status: "shell-runtime"');
  expect(source).toContain("runtimeImplementation: true");
  expect(source).toContain("featureImplementation: false");
}

function expectActiveWebWorkspace(
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
  expect(manifest.scripts?.dev).toBe("next dev");
  expect(manifest.scripts?.build).toBe("next build");
  expect(manifest.scripts?.start).toBe("next start");
  expect(manifest.scripts?.typecheck).toBe("tsc -p tsconfig.json --noEmit");

  for (const lifecycle of ["preinstall", "install", "postinstall", "prepare"]) {
    expect(manifest.scripts?.[lifecycle]).toBeUndefined();
  }

  const dependencies = manifest.dependencies ?? {};
  // The shell base contract must remain intact...
  for (const [dependencyName, version] of Object.entries(webShellBaseDependencies)) {
    expect(dependencies[dependencyName]).toBe(version);
  }
  // ...and every extra dependency must be explicitly vetted.
  for (const dependencyName of Object.keys(dependencies)) {
    if (dependencyName in webShellBaseDependencies) continue;
    expect(activeWebApplicationAllowedExtraDependencies.has(dependencyName)).toBe(true);
  }

  expect(fs.existsSync(path.join(rootDir, relativeDir, "README.md"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "tsconfig.json"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "app", "page.tsx"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "app", "layout.tsx"))).toBe(true);

  const source = readText(`${relativeDir}/src/index.ts`);
  expect(source).toContain(markerName);
  expect(source).toContain('status: "shell-runtime"');
  expect(source).toContain("runtimeImplementation: true");
  expect(source).toContain("featureImplementation: false");
}

function expectMobileShellWorkspace(
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
  expect(manifest.scripts?.start).toBe("expo start --offline");
  expect(manifest.scripts?.build).toBe("tsc -p tsconfig.json");
  expect(manifest.scripts?.typecheck).toBe("tsc -p tsconfig.json --noEmit");
  expect(manifest.scripts?.["validate:expo"]).toBe("expo config --type public");

  expect(manifest.dependencies).toEqual({
    expo: "56.0.12",
    react: "19.2.7",
    "react-native": "0.85.3"
  });

  expect(fs.existsSync(path.join(rootDir, relativeDir, "README.md"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "tsconfig.json"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "App.tsx"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "expo.entry.ts"))).toBe(true);
  expect(fs.existsSync(path.join(rootDir, relativeDir, "app.json"))).toBe(true);

  const source = readText(`${relativeDir}/src/index.ts`);
  expect(source).toContain(markerName);
  expect(source).toContain('status: "shell-runtime"');
  expect(source).toContain("runtimeImplementation: true");
  expect(source).toContain("featureImplementation: false");
}

function expectRuntimeWorkspace(
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
  expect(manifest.scripts?.build).toBeTypeOf("string");
  expect(manifest.scripts?.typecheck).toBeTypeOf("string");

  const source = readText(`${relativeDir}/src/index.ts`);
  expect(source).toContain(markerName);
}

describe("Phase 2 workspace topology", () => {
  it("registers the approved apps in the pnpm workspace", () => {
    const workspace = readText("pnpm-workspace.yaml");
    expect(workspace).toContain('- "apps/*"');
    expect(workspace).toContain('- "packages/*"');
    expect(workspace).toContain('- "tools/*"');

    for (const [appName] of [
      ...runtimeApplications,
      ...mobileShellApplications,
      ...webShellApplications
    ]) {
      expect(fs.existsSync(path.join(rootDir, "apps", appName))).toBe(true);
    }
  });

  it("keeps existing runtime applications private and typed", () => {
    for (const [appName, packageName] of runtimeApplications) {
      const marker = `${appName.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}ApplicationBoundary`;
      expectRuntimeWorkspace(`apps/${appName}`, packageName, marker);
      expect(fs.existsSync(path.join(rootDir, "apps", appName, "AGENTS.md"))).toBe(true);
    }
  });

  it("keeps mobile as an empty Expo shell runtime", () => {
    for (const [appName, packageName] of mobileShellApplications) {
      const marker = `${appName.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}ApplicationBoundary`;
      expectMobileShellWorkspace(`apps/${appName}`, packageName, marker);
      expect(fs.existsSync(path.join(rootDir, "apps", appName, "AGENTS.md"))).toBe(true);
    }
  });

  it("keeps web applications as Next.js synthetic shell runtimes", () => {
    for (const [appName, packageName] of webShellApplications) {
      const marker = `${appName.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}ApplicationBoundary`;
      expectWebShellWorkspace(`apps/${appName}`, packageName, marker);
      expect(fs.existsSync(path.join(rootDir, "apps", appName, "AGENTS.md"))).toBe(true);
    }
  });

  it("keeps active web applications on the shell contract plus vetted dependencies", () => {
    for (const [appName, packageName] of activeWebApplications) {
      const marker = `${appName.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}ApplicationBoundary`;
      expectActiveWebWorkspace(`apps/${appName}`, packageName, marker);
      expect(fs.existsSync(path.join(rootDir, "apps", appName, "AGENTS.md"))).toBe(true);
    }
  });

  it("keeps boundary shared packages private, dependency-free, and boundary-only", () => {
    for (const [packageDir, packageName] of boundarySharedPackages) {
      const marker = `${packageDir.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}PackageBoundary`;
      expectBoundaryWorkspace(`packages/${packageDir}`, packageName, marker);
    }
  });

  it("keeps runtime shared packages private and typed", () => {
    for (const [packageDir, packageName] of runtimeSharedPackages) {
      const marker = `${packageDir.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase()
      )}PackageBoundary`;
      expectRuntimeWorkspace(`packages/${packageDir}`, packageName, marker);
    }
  });
});
