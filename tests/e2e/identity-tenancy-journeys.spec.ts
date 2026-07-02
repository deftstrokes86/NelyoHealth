import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoUnexpectedStorage,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

test.describe("identity and tenancy browser journeys", () => {
  test("covers registration, login, MFA, recovery, and phone-change paths", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const registrationPending = await page.request.get(
      "/api/auth-decision?intent=register&mode=passwordless&otpVerified=false"
    );
    expect(registrationPending.ok()).toBe(true);
    expect(registrationPending.headers()["cache-control"] ?? "").toContain("no-store");
    const registrationPendingBody = await registrationPending.json();
    expect(registrationPendingBody).toMatchObject({
      data: {
        status: "challenge-required",
        reasonCode: "otp-verification-required"
      }
    });

    const registrationComplete = await page.request.get(
      "/api/auth-decision?intent=register&mode=passwordless&otpVerified=true"
    );
    expect(registrationComplete.ok()).toBe(true);
    const registrationCompleteBody = await registrationComplete.json();
    expect(registrationCompleteBody).toMatchObject({
      data: {
        status: "authenticated",
        reasonCode: "authenticated"
      }
    });

    const providerMfaChallenge = await page.request.get(
      "/api/auth-decision?intent=login&mode=password&tier=provider&passwordVerified=true&trustedDevice=false&mfaVerified=false"
    );
    expect(providerMfaChallenge.ok()).toBe(true);
    const providerMfaChallengeBody = await providerMfaChallenge.json();
    expect(providerMfaChallengeBody).toMatchObject({
      data: {
        status: "challenge-required",
        reasonCode: "mfa-required",
        requiresMfa: true
      }
    });

    const providerMfaComplete = await page.request.get(
      "/api/auth-decision?intent=login&mode=password&tier=provider&passwordVerified=true&trustedDevice=false&mfaVerified=true"
    );
    expect(providerMfaComplete.ok()).toBe(true);
    const providerMfaCompleteBody = await providerMfaComplete.json();
    expect(providerMfaCompleteBody).toMatchObject({
      data: {
        status: "authenticated",
        reasonCode: "authenticated"
      }
    });

    const recoveryChallenge = await page.request.get(
      "/api/auth-decision?intent=recover-account&accountRecoveryApproved=false"
    );
    expect(recoveryChallenge.ok()).toBe(true);
    const recoveryChallengeBody = await recoveryChallenge.json();
    expect(recoveryChallengeBody).toMatchObject({
      data: {
        status: "challenge-required",
        reasonCode: "recovery-verification-required"
      }
    });

    const phoneChangeComplete = await page.request.get(
      "/api/auth-decision?intent=change-phone&requestedPhone=%2B2348000000001&phoneChangeOtpVerified=true"
    );
    expect(phoneChangeComplete.ok()).toBe(true);
    const phoneChangeCompleteBody = await phoneChangeComplete.json();
    expect(phoneChangeCompleteBody).toMatchObject({
      data: {
        status: "authenticated",
        reasonCode: "authenticated",
        updatedPhoneE164: "+2348000000001"
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });

  test("covers organization switching, invitation acceptance, membership removal, and cross-tenant denial", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const switchChallenge = await page.request.get(
      "/api/tenancy-access?activeTenantId=tenant-a&requestedTenantId=tenant-b&allowSwitch=false&membershipStatus=active&rolePresent=true&roleStatus=active&facilityAllowed=true"
    );
    expect(switchChallenge.ok()).toBe(true);
    const switchChallengeBody = await switchChallenge.json();
    expect(switchChallengeBody).toMatchObject({
      data: {
        status: "challenge-required",
        reasonCode: "tenant-switch-required",
        resolvedTenantId: "tenant-b"
      }
    });

    const switchAllowed = await page.request.get(
      "/api/tenancy-access?activeTenantId=tenant-a&requestedTenantId=tenant-b&allowSwitch=true&membershipStatus=active&rolePresent=true&roleStatus=active&facilityAllowed=true"
    );
    expect(switchAllowed.ok()).toBe(true);
    const switchAllowedBody = await switchAllowed.json();
    expect(switchAllowedBody).toMatchObject({
      data: {
        status: "allowed",
        reasonCode: "allowed",
        sessionTenantAction: "switch-tenant",
        resolvedTenantId: "tenant-b"
      }
    });

    const invitationAccepted = await page.request.get(
      "/api/membership-lifecycle?action=accept-invitation&currentStatus=invited"
    );
    expect(invitationAccepted.ok()).toBe(true);
    const invitationAcceptedBody = await invitationAccepted.json();
    expect(invitationAcceptedBody).toMatchObject({
      data: {
        status: "applied",
        reasonCode: "applied",
        updatedStatus: "active"
      }
    });

    const membershipOffboarded = await page.request.get(
      "/api/membership-lifecycle?action=offboard-membership&currentStatus=active"
    );
    expect(membershipOffboarded.ok()).toBe(true);
    const membershipOffboardedBody = await membershipOffboarded.json();
    expect(membershipOffboardedBody).toMatchObject({
      data: {
        status: "applied",
        reasonCode: "applied",
        updatedStatus: "offboarded",
        sessionAction: "revoke-session"
      }
    });

    const deniedProtected = await page.request.get(
      "/api/tenant-protected-resource?sameTenant=false"
    );
    expect(deniedProtected.status()).toBe(403);
    expect(deniedProtected.headers()["cache-control"] ?? "").toContain("no-store");
    const deniedProtectedBody = await deniedProtected.json();
    expect(deniedProtectedBody).toMatchObject({
      data: null,
      errors: [{ code: "TENANT_ACCESS_DENIED", message: "Access denied." }]
    });
    expect(JSON.stringify(deniedProtectedBody).toLowerCase()).not.toContain("resourceexists");
    expect(JSON.stringify(deniedProtectedBody).toLowerCase()).not.toContain("provideraddress");

    const allowedProtected = await page.request.get(
      "/api/tenant-protected-resource?sameTenant=true"
    );
    expect(allowedProtected.ok()).toBe(true);
    const allowedProtectedBody = await allowedProtected.json();
    expect(allowedProtectedBody).toMatchObject({
      data: {
        resourceLabel: "tenant-safe-resource",
        tenantScoped: true
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
