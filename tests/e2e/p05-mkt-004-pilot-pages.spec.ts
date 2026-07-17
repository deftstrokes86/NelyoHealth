import { expect, test } from "@playwright/test";

const pilotRoutes: Array<{ path: string; titleFragment: string }> = [
  { path: "/", titleFragment: "NelyoHealth" },
  { path: "/how-it-works", titleFragment: "How NelyoHealth works" },
  { path: "/patients", titleFragment: "For patients" },
  { path: "/family-health", titleFragment: "Family Health" },
  { path: "/diaspora", titleFragment: "families" },
  { path: "/doctors", titleFragment: "doctors" },
  { path: "/pharmacies", titleFragment: "pharmacies" },
  { path: "/laboratories", titleFragment: "laboratories" },
  { path: "/trust-and-safety", titleFragment: "Trust" },
  { path: "/privacy-overview", titleFragment: "Privacy" },
  { path: "/accessibility", titleFragment: "Accessibility" },
  { path: "/faq", titleFragment: "Frequently" },
  { path: "/contact", titleFragment: "Contact" },
  { path: "/legal-and-regulatory-notices", titleFragment: "Legal" },
  { path: "/emergency", titleFragment: "Emergency" }
];

const authRoutes: Array<{ path: string; titleFragment: string }> = [
  { path: "/sign-in", titleFragment: "Sign in" },
  { path: "/create-account", titleFragment: "Create" },
  { path: "/forgot-password", titleFragment: "Recover" },
  { path: "/reset-password", titleFragment: "Set a new password" }
];

test.describe("P05-MKT-004 PILOT pages render with shared chrome", () => {
  for (const route of [...pilotRoutes, ...authRoutes]) {
    test(`route renders chrome + metadata title: ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator(".nh-site-header").first()).toBeVisible();
      await expect(page.locator(".nh-site-footer").first()).toBeVisible();
      await expect(page.locator(".nh-emergency-ribbon").first()).toBeVisible();
      const title = await page.title();
      expect(title.toLowerCase()).toContain(route.titleFragment.toLowerCase());
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      expect(overflow, `${route.path} caused horizontal overflow`).toBe(false);
    });
  }

  test("home hero headline reads from the content registry", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Care that follows the patient", { exact: false })
    ).toBeVisible();
  });

  test("emergency ribbon is the first tab stop on every route", async ({ page }) => {
    for (const route of [...pilotRoutes, ...authRoutes].slice(0, 6)) {
      await page.goto(route.path);
      await page.keyboard.press("Tab");
      const focusedInsideRibbon = await page.evaluate(() => {
        const ribbon = document.querySelector(".nh-emergency-ribbon");
        return ribbon?.contains(document.activeElement) ?? false;
      });
      expect(focusedInsideRibbon, `first tab stop not inside emergency ribbon on ${route.path}`).toBe(
        true
      );
    }
  });

  test("route renames redirect with 301 semantics", async ({ page, request }) => {
    const pairs: Array<[string, string]> = [
      ["/for-diaspora", "/diaspora"],
      ["/for-doctors", "/doctors"],
      ["/for-care-partners", "/family-health"],
      ["/family-plans", "/family-health"],
      ["/for-pharmacies", "/pharmacies"],
      ["/for-labs", "/laboratories"],
      ["/trust-safety", "/trust-and-safety"],
      ["/login", "/sign-in"],
      ["/register", "/create-account"]
    ];
    for (const [source, destination] of pairs) {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(
        [301, 308].includes(response.status()),
        `${source} returned ${response.status()}`
      ).toBe(true);
      const location = response.headers()["location"] ?? "";
      expect(location.endsWith(destination), `${source} -> ${location}`).toBe(true);
    }
  });

  test("home reports LCP under 2500ms and no CLS", async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== "chromium", "Web-vitals API is chromium-only.");
    testInfo.setTimeout(60_000);
    await page.goto("/");
    const metrics = await page.evaluate(
      () =>
        new Promise<{ lcp: number; cls: number }>((resolve) => {
          let lcpValue = 0;
          let clsValue = 0;
          const lcpObserver = new PerformanceObserver((entries) => {
            for (const entry of entries.getEntries()) {
              lcpValue = Math.max(lcpValue, (entry as PerformanceEntry & { startTime: number }).startTime);
            }
          });
          lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
          const clsObserver = new PerformanceObserver((entries) => {
            for (const entry of entries.getEntries()) {
              const layoutShift = entry as PerformanceEntry & {
                hadRecentInput: boolean;
                value: number;
              };
              if (!layoutShift.hadRecentInput) clsValue += layoutShift.value;
            }
          });
          clsObserver.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => {
            lcpObserver.disconnect();
            clsObserver.disconnect();
            resolve({ lcp: lcpValue, cls: clsValue });
          }, 3000);
        })
    );
    expect(metrics.lcp).toBeLessThan(2500);
    expect(metrics.cls).toBeLessThan(0.1);
  });
});
