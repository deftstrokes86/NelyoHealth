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
      orderId: "order-e2e-1",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "CarePoint Pharmacy",
      authorizedAt: null
    });
    expect(pendingDecision).not.toHaveProperty("providerId");
    expect(pendingDecision).not.toHaveProperty("providerAddress");
    expect(pendingDecision).not.toHaveProperty("providerPhone");

    const settledResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&hasAuthorization=true&sameTenant=true"
    );
    expect(settledResponse.ok()).toBe(true);
    const settledDecision = await settledResponse.json();
    expect(settledDecision).toMatchObject({
      orderId: "order-e2e-1",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "CarePoint Pharmacy"
    });
    expect(typeof settledDecision.authorizedAt).toBe("string");

    const refundedResponse = await page.request.get(
      "/api/disclosure-eligibility?orderId=order-e2e-1&providerDisplayName=CarePoint%20Pharmacy&paymentStatus=settled&refundStatus=completed&hasAuthorization=true&sameTenant=true"
    );
    expect(refundedResponse.ok()).toBe(true);
    const refundedDecision = await refundedResponse.json();
    expect(refundedDecision).toMatchObject({
      orderId: "order-e2e-1",
      status: "not-eligible",
      reasonCode: "policy-gated",
      providerDisplayName: "CarePoint Pharmacy",
      authorizedAt: null
    });

    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
