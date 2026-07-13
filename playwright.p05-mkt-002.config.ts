import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.NELYO_MKT002_PORT ?? 4287);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: ".",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report/p05-mkt-002" }]
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${PORT}`,
    cwd: "apps/patient-web",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      NEXT_PUBLIC_ENABLE_GALLERY: "1"
    }
  },
  projects: [
    {
      name: "gallery-desktop",
      testMatch: ["tests/e2e/p05-mkt-002-marketing-gallery.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: "gallery-tablet",
      testMatch: ["tests/e2e/p05-mkt-002-marketing-gallery.spec.ts"],
      use: {
        ...devices["iPad Pro 11 landscape"],
        browserName: "chromium",
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: "gallery-mobile",
      testMatch: ["tests/e2e/p05-mkt-002-marketing-gallery.spec.ts"],
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: "gallery-desktop-a11y",
      testMatch: ["tests/accessibility/p05-mkt-002-marketing-gallery.a11y.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: "gallery-mobile-a11y",
      testMatch: ["tests/accessibility/p05-mkt-002-marketing-gallery.a11y.spec.ts"],
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: "gallery-reduced-motion",
      testMatch: ["tests/e2e/p05-mkt-002-marketing-gallery.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        contextOptions: { reducedMotion: "reduce" }
      }
    }
  ]
});
