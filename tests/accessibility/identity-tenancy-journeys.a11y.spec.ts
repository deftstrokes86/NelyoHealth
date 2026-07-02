import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

test.describe("identity and tenancy accessibility smoke", () => {
  test("keeps baseline route accessible while identity and tenancy endpoints are exercised", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "NelyoHealth Browser Smoke Check" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Smoke sections" })).toBeVisible();

    const authPing = await page.request.get(
      "/api/auth-decision?intent=login&mode=password&tier=patient&passwordVerified=true"
    );
    expect(authPing.ok()).toBe(true);

    const tenancyPing = await page.request.get(
      "/api/tenancy-access?activeTenantId=tenant-a&requestedTenantId=tenant-a&allowSwitch=true&membershipStatus=active&rolePresent=true&roleStatus=active&facilityAllowed=true"
    );
    expect(tenancyPing.ok()).toBe(true);

    await expectNoViewportOverflow(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await expectNoBrowserGuardFailures(guards);
  });
});
