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

test.describe("P05-MKT-002 marketing gallery", () => {
  for (const slug of galleryComponents) {
    test(`gallery route renders in light + dark: ${slug}`, async ({ page }) => {
      await page.goto(`/_gallery/marketing/${slug}`);

      await expect(page.locator(".nh-gallery")).toBeVisible();
      await expect(page.locator('[data-theme="light"]')).toHaveCount(1);
      await expect(page.locator('[data-theme="dark"]')).toHaveCount(1);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });
      expect(overflow, `${slug} caused horizontal overflow`).toBe(false);
    });
  }

  test("emergency ribbon gallery route renders SAFETY-IMMEDIATE motion profile", async ({
    page
  }) => {
    await page.goto("/_gallery/marketing/emergency-ribbon");
    await expect(
      page.locator('[data-motion-profile="SAFETY-IMMEDIATE"]').first()
    ).toBeVisible();
  });

  test("hero-block gallery renders all five variants", async ({ page }) => {
    await page.goto("/_gallery/marketing/hero-block");
    await expect(page.locator('[data-variant="universal"]').first()).toBeVisible();
    await expect(page.locator('[data-variant="patient"]').first()).toBeVisible();
    await expect(
      page.locator('[data-variant="family-diaspora"]').first()
    ).toBeVisible();
    await expect(page.locator('[data-variant="provider"]').first()).toBeVisible();
    await expect(
      page.locator('[data-variant="organization"]').first()
    ).toBeVisible();
  });

  test("theme-toggle mutates data-theme on the document root", async ({
    page
  }) => {
    await page.goto("/_gallery/marketing/theme-toggle");
    const toggle = page.locator(".nh-gallery__stage .nh-theme-toggle").first();
    await toggle.click();
    const first = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    await toggle.click();
    const second = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    expect(first).not.toEqual(second);
  });

  test("faq-accordion is keyboard operable", async ({ page }) => {
    await page.goto("/_gallery/marketing/faq-accordion");
    const trigger = page.locator(".nh-accordion__trigger").first();
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("illustration-slot gallery lists every registered id", async ({
    page
  }) => {
    await page.goto("/_gallery/marketing/illustration-slot");
    const items = page.locator(".nh-illustration-gallery__item");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });
});
