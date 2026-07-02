import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

test.describe("authorization policy accessibility smoke", () => {
  test("keeps baseline route accessible while authorization policy endpoints are exercised", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "NelyoHealth Browser Smoke Check" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Smoke sections" })).toBeVisible();

    const deniedPing = await page.request.get(
      "/api/authorization-policy?consentStatus=revoked"
    );
    expect(deniedPing.ok()).toBe(true);

    const challengePing = await page.request.get(
      "/api/authorization-policy?breakGlassRequested=true"
    );
    expect(challengePing.ok()).toBe(true);

    await expectNoViewportOverflow(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await expectNoBrowserGuardFailures(guards);
  });
});
