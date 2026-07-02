import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoUnexpectedStorage,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

test.describe("authorization policy browser journeys", () => {
  test("fails closed for consent and relationship revocation and stale-session contexts", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const baselineAllowed = await page.request.get(
      "/api/authorization-policy?sameTenant=true&sessionStatus=active&consentStatus=granted&relationshipStatus=active"
    );
    expect(baselineAllowed.ok()).toBe(true);
    const baselineAllowedBody = await baselineAllowed.json();
    expect(baselineAllowedBody).toMatchObject({
      data: {
        status: "allowed",
        reasonCode: "allowed",
        auditIntent: {
          appendOnly: true,
          decisionStatus: "allowed"
        }
      }
    });

    const consentRevoked = await page.request.get(
      "/api/authorization-policy?sameTenant=true&sessionStatus=active&consentStatus=revoked&relationshipStatus=active"
    );
    expect(consentRevoked.ok()).toBe(true);
    const consentRevokedBody = await consentRevoked.json();
    expect(consentRevokedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "consent-revoked"
      }
    });

    const relationshipRevoked = await page.request.get(
      "/api/authorization-policy?sameTenant=true&sessionStatus=active&consentStatus=granted&relationshipStatus=revoked"
    );
    expect(relationshipRevoked.ok()).toBe(true);
    const relationshipRevokedBody = await relationshipRevoked.json();
    expect(relationshipRevokedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "relationship-revoked"
      }
    });

    const staleSession = await page.request.get(
      "/api/authorization-policy?sameTenant=true&sessionStatus=stale&consentStatus=granted&relationshipStatus=active"
    );
    expect(staleSession.ok()).toBe(true);
    const staleSessionBody = await staleSession.json();
    expect(staleSessionBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "stale-session"
      }
    });

    const tenantMismatch = await page.request.get(
      "/api/authorization-policy?sameTenant=false&sessionStatus=active&consentStatus=granted&relationshipStatus=active"
    );
    expect(tenantMismatch.ok()).toBe(true);
    const tenantMismatchBody = await tenantMismatch.json();
    expect(tenantMismatchBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "tenant-mismatch"
      }
    });
    const tenantPayload = JSON.stringify(tenantMismatchBody).toLowerCase();
    expect(tenantPayload).not.toContain("resourceexists");
    expect(tenantPayload).not.toContain("provideraddress");

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });

  test("enforces break-glass reason, sponsor denial, impersonation denial, and append-only audit behavior", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const breakGlassNoReason = await page.request.get(
      "/api/authorization-policy?breakGlassRequested=true"
    );
    expect(breakGlassNoReason.ok()).toBe(true);
    const breakGlassNoReasonBody = await breakGlassNoReason.json();
    expect(breakGlassNoReasonBody).toMatchObject({
      data: {
        status: "challenge-required",
        reasonCode: "break-glass-reason-required"
      }
    });

    const breakGlassExpired = await page.request.get(
      "/api/authorization-policy?breakGlassRequested=true&breakGlassReason=severe-bleeding&breakGlassWindowMinutes=20"
    );
    expect(breakGlassExpired.ok()).toBe(true);
    const breakGlassExpiredBody = await breakGlassExpired.json();
    expect(breakGlassExpiredBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "break-glass-window-exceeded"
      }
    });

    const sponsorDenied = await page.request.get(
      "/api/authorization-policy?actorRole=sponsor&sponsorPaymentOnly=true&requestedResource=clinical-lab-result"
    );
    expect(sponsorDenied.ok()).toBe(true);
    const sponsorDeniedBody = await sponsorDenied.json();
    expect(sponsorDeniedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "sponsor-payment-no-clinical-access"
      }
    });

    const adminImpersonationDenied = await page.request.get(
      "/api/authorization-policy?actorRole=platform-admin&impersonationAttempt=true"
    );
    expect(adminImpersonationDenied.ok()).toBe(true);
    const adminImpersonationDeniedBody = await adminImpersonationDenied.json();
    expect(adminImpersonationDeniedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "administrator-impersonation-denied"
      }
    });

    const auditEditDenied = await page.request.get(
      "/api/authorization-policy?auditEventEditAttempt=true"
    );
    expect(auditEditDenied.ok()).toBe(true);
    const auditEditDeniedBody = await auditEditDenied.json();
    expect(auditEditDeniedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "audit-event-append-only",
        auditIntent: {
          appendOnly: true,
          reasonCode: "audit-event-append-only"
        }
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
