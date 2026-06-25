import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  designPreviewUrl,
  expectNoProtectedSentinels
} from "../helpers/design-foundation-assertions";
test("design foundation preview has no detectable accessibility violations", async ({ page }) => {
  await page.goto(designPreviewUrl, { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await expectNoProtectedSentinels(page);
});
