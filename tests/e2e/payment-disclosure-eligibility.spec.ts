import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

test.describe("synthetic payment to disclosure eligibility boundary", () => {
  test("keeps disclosure denied before settlement and eligible after settlement", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const pendingResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=authorized&hasAuthorization=true&sameTenant=true"
    );
    expect(pendingResponse.ok()).toBe(true);
    const pendingDecision = await pendingResponse.json();
    expect(pendingDecision).toMatchObject({
      data: {
        orderId: "order-e2e-1",
        status: "not-eligible",
        reasonCode: "payment-not-settled",
        providerDisplayName: "CarePoint Pharmacy",
        authorizedAt: null
      }
    });
    expect(pendingDecision.data).not.toHaveProperty("providerId");
    expect(pendingDecision.data).not.toHaveProperty("providerAddress");
    expect(pendingDecision.data).not.toHaveProperty("providerPhone");

    const settledResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&hasAuthorization=true&sameTenant=true"
    );
    expect(settledResponse.ok()).toBe(true);
    const settledDecision = await settledResponse.json();
    expect(settledDecision).toMatchObject({
      data: {
        orderId: "order-e2e-1",
        status: "eligible",
        reasonCode: "eligible",
        providerDisplayName: "CarePoint Pharmacy"
      }
    });
    expect(typeof settledDecision.data.authorizedAt).toBe("string");

    const refundedResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&refundStatus=completed&hasAuthorization=true&sameTenant=true"
    );
    expect(refundedResponse.ok()).toBe(true);
    const refundedDecision = await refundedResponse.json();
    expect(refundedDecision).toMatchObject({
      data: {
        orderId: "order-e2e-1",
        status: "not-eligible",
        reasonCode: "policy-gated",
        providerDisplayName: "CarePoint Pharmacy",
        authorizedAt: null
      }
    });

    const unauthorizedResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&hasAuthorization=false&sameTenant=true"
    );
    expect(unauthorizedResponse.ok()).toBe(true);
    const unauthorizedDecision = await unauthorizedResponse.json();
    expect(unauthorizedDecision).toMatchObject({
      data: {
        orderId: "order-e2e-1",
        status: "denied",
        reasonCode: "authorization-missing",
        providerDisplayName: "CarePoint Pharmacy",
        authorizedAt: null
      }
    });

    const wrongTenantResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&hasAuthorization=true&sameTenant=false"
    );
    expect(wrongTenantResponse.ok()).toBe(true);
    const wrongTenantDecision = await wrongTenantResponse.json();
    expect(wrongTenantDecision).toMatchObject({
      data: {
        orderId: "order-e2e-1",
        status: "denied",
        reasonCode: "tenant-mismatch",
        providerDisplayName: "CarePoint Pharmacy",
        authorizedAt: null
      }
    });

    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });

  test("does not cache disclosure eligibility across sequential requests", async ({ page }) => {
    await page.goto("/");

    const firstResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-cache&providerDisplayName=CacheSafe%20Provider&paymentStatus=settled&hasAuthorization=true&sameTenant=true"
    );
    expect(firstResponse.ok()).toBe(true);
    expect(firstResponse.headers()["cache-control"] ?? "").toContain("no-store");

    const firstDecision = await firstResponse.json();
    expect(firstDecision).toMatchObject({
      data: {
        orderId: "order-e2e-cache",
        status: "eligible",
        reasonCode: "eligible",
        providerDisplayName: "CacheSafe Provider"
      }
    });

    const secondResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-cache&providerDisplayName=CacheSafe%20Provider&paymentStatus=settled&refundStatus=completed&hasAuthorization=true&sameTenant=true"
    );
    expect(secondResponse.ok()).toBe(true);
    expect(secondResponse.headers()["cache-control"] ?? "").toContain("no-store");

    const secondDecision = await secondResponse.json();
    expect(secondDecision).toMatchObject({
      data: {
        orderId: "order-e2e-cache",
        status: "not-eligible",
        reasonCode: "policy-gated",
        providerDisplayName: "CacheSafe Provider",
        authorizedAt: null
      }
    });

    expect(secondDecision.data.status).not.toBe(firstDecision.data.status);
    expect(secondDecision.data.reasonCode).not.toBe(firstDecision.data.reasonCode);
  });
});
