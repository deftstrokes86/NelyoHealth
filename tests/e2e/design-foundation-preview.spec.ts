import { expect, test } from "@playwright/test";
import {
  attachFoundationGuards,
  designPreviewUrl,
  expectNoProtectedSentinels
} from "../helpers/design-foundation-assertions";
test.describe("design foundation preview", () => {
  test("renders synthetic preview without external requests or protected provider details", async ({
    page
  }) => {
    const guards = await attachFoundationGuards(page);
    await page.goto(designPreviewUrl, { waitUntil: "networkidle" });
    await expect(
      page.getByText("SYNTHETIC / NONPRODUCTION / DESIGN FOUNDATION PREVIEW")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /Warm Care Grid/i })).toBeVisible();
    await expect(page.getByText(/CarePoint Pharmacy/i)).toBeVisible();
    await expectNoProtectedSentinels(page);
    expect(await page.evaluate(() => navigator.serviceWorker?.controller)).toBeNull();
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    expect(guards.externalRequests).toEqual([]);
    expect(guards.failedRequests).toEqual([]);
    expect(guards.consoleErrors).toEqual([]);
  });
  test("supports keyboard focus and emergency safety action", async ({ page }) => {
    await page.goto(designPreviewUrl);
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
    await page.getByRole("button", { name: /Toggle emergency panel/i }).click();
    await expect(page.getByRole("alert", { name: /Emergency escalation/i })).toBeVisible();
  });
  test("keeps layouts usable across the active viewport", async ({ page }) => {
    await page.goto(designPreviewUrl);
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Responsive and accessibility foundation/i })
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(overflow).toBe(false);
  });
});
