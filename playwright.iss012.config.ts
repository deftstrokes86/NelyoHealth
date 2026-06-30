import { defineConfig, devices } from "@playwright/test";

const patientPort = 4301;
const providerPort = 4302;
const organizationPort = 4303;
const adminPort = 4304;

export default defineConfig({
  testDir: ".",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/iss012" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  },
  webServer: [
    {
      command: `pnpm --filter @nelyohealth/patient-web dev -- --hostname 127.0.0.1 --port ${patientPort}`,
      url: `http://127.0.0.1:${patientPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: `pnpm --filter @nelyohealth/provider-web dev -- --hostname 127.0.0.1 --port ${providerPort}`,
      url: `http://127.0.0.1:${providerPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: `pnpm --filter @nelyohealth/organization-web dev -- --hostname 127.0.0.1 --port ${organizationPort}`,
      url: `http://127.0.0.1:${organizationPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: `pnpm --filter @nelyohealth/admin-web dev -- --hostname 127.0.0.1 --port ${adminPort}`,
      url: `http://127.0.0.1:${adminPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ],
  projects: [
    {
      name: "patient-shell-smoke",
      testMatch: ["tests/e2e/iss012-web-shells.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${patientPort}` }
    },
    {
      name: "provider-shell-smoke",
      testMatch: ["tests/e2e/iss012-web-shells.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${providerPort}` }
    },
    {
      name: "organization-shell-smoke",
      testMatch: ["tests/e2e/iss012-web-shells.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${organizationPort}` }
    },
    {
      name: "admin-shell-smoke",
      testMatch: ["tests/e2e/iss012-web-shells.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${adminPort}` }
    },
    {
      name: "patient-shell-a11y",
      testMatch: ["tests/accessibility/iss012-web-shells.a11y.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${patientPort}` }
    },
    {
      name: "provider-shell-a11y",
      testMatch: ["tests/accessibility/iss012-web-shells.a11y.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${providerPort}` }
    },
    {
      name: "organization-shell-a11y",
      testMatch: ["tests/accessibility/iss012-web-shells.a11y.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${organizationPort}` }
    },
    {
      name: "admin-shell-a11y",
      testMatch: ["tests/accessibility/iss012-web-shells.a11y.spec.ts"],
      use: { ...devices["Desktop Chrome"], baseURL: `http://127.0.0.1:${adminPort}` }
    }
  ]
});
