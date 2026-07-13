import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const galleryComponents = [
  "site-header",
  "site-footer",
  "emergency-ribbon",
  "hero-block",
  "story-section",
  "proof-strip",
  "workflow-stepper",
  "segment-grid",
  "trust-bar",
  "faq-accordion",
  "cta-section",
  "pricing-matrix",
  "quote-block",
  "legal-notice-strip",
  "theme-toggle",
  "illustration-slot"
];

test.describe("P05-MKT-002 marketing gallery accessibility", () => {
  for (const slug of galleryComponents) {
    test(`no critical or serious axe violations: ${slug}`, async ({ page }) => {
      await page.goto(`/_gallery/marketing/${slug}`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (violation) =>
          violation.impact === "critical" || violation.impact === "serious"
      );
      expect(blocking, `axe violations on ${slug}`).toEqual([]);
    });
  }
});
