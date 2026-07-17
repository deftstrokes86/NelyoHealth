import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/how-it-works",
  "/patients",
  "/family-health",
  "/diaspora",
  "/doctors",
  "/pharmacies",
  "/laboratories",
  "/trust-and-safety",
  "/privacy-overview",
  "/accessibility",
  "/faq",
  "/contact",
  "/legal-and-regulatory-notices",
  "/emergency",
  "/sign-in",
  "/create-account",
  "/forgot-password",
  "/reset-password"
];

test.describe("P05-MKT-004 PILOT pages accessibility", () => {
  for (const path of routes) {
    test(`no critical/serious axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (violation) =>
          violation.impact === "critical" || violation.impact === "serious"
      );
      expect(blocking, `axe violations on ${path}`).toEqual([]);
    });
  }
});
