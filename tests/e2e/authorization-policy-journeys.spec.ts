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

  test("applies domain-specific consent toggles and stale-version checks immediately", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const baselineAllowed = await page.request.get(
      "/api/authorization-policy?consentStatus=granted&requestedConsentDomains=telemedicine,provider-data-sharing&consentDomains=telemedicine,provider-data-sharing&consentCurrentVersion=1&knownConsentVersions=1"
    );
    expect(baselineAllowed.ok()).toBe(true);
    const baselineAllowedBody = await baselineAllowed.json();
    expect(baselineAllowedBody).toMatchObject({
      data: {
        status: "allowed",
        reasonCode: "allowed"
      }
    });

    const afterToggleDenied = await page.request.get(
      "/api/authorization-policy?consentStatus=granted&requestedConsentDomains=telemedicine,provider-data-sharing&consentDomains=telemedicine&consentCurrentVersion=2&knownConsentVersions=1,2"
    );
    expect(afterToggleDenied.ok()).toBe(true);
    const afterToggleDeniedBody = await afterToggleDenied.json();
    expect(afterToggleDeniedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "consent-scope-not-granted"
      }
    });

    const staleVersionDenied = await page.request.get(
      "/api/authorization-policy?consentStatus=granted&requestedConsentDomains=telemedicine&consentDomains=telemedicine&consentCurrentVersion=3&knownConsentVersions=1,2"
    );
    expect(staleVersionDenied.ok()).toBe(true);
    const staleVersionDeniedBody = await staleVersionDenied.json();
    expect(staleVersionDeniedBody).toMatchObject({
      data: {
        status: "denied",
        reasonCode: "consent-version-stale"
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });

  test("proves audit edits are blocked and amendment/versioning paths are enforced", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const appendResponse = await page.request.get("/api/audit-events?operation=append");
    expect(appendResponse.ok()).toBe(true);
    const appendBody = await appendResponse.json();
    expect(appendBody).toMatchObject({
      data: {
        eventVersion: 1,
        appendOnly: true,
        actorId: "actor-route-1",
        subjectId: "patient-route-1",
        organizationId: "tenant-route-1",
        action: "read",
        resource: "clinical-record-summary",
        purpose: "care-delivery",
        requestId: "req-audit-route-1",
        ipAddress: "198.51.100.50",
        device: {
          deviceId: "device-route-1",
          deviceType: "browser"
        },
        breakGlassUsed: false,
        priorState: {
          status: "pending"
        },
        newState: {
          status: "allowed"
        }
      },
      meta: {
        operationTag: "audit.event.append",
        decisionReasonTag: "appended"
      }
    });

    const mutateResponse = await page.request.get("/api/audit-events?operation=mutate");
    expect(mutateResponse.status()).toBe(409);
    const mutateBody = await mutateResponse.json();
    expect(mutateBody).toMatchObject({
      data: null,
      meta: {
        operationTag: "audit.event.mutate",
        decisionReasonTag: "append-only-rejected"
      },
      errors: [
        {
          code: "AUDIT_APPEND_ONLY_ENFORCED"
        }
      ]
    });

    const amendResponse = await page.request.get(
      "/api/audit-events?operation=amend&targetEventId=audit-event-1"
    );
    expect(amendResponse.ok()).toBe(true);
    const amendBody = await amendResponse.json();
    expect(amendBody).toMatchObject({
      data: {
        eventVersion: 2,
        appendOnly: true,
        action: "amend",
        supersedesEventId: "audit-event-1",
        amendmentReason: "post-sign-correction"
      },
      meta: {
        operationTag: "audit.event.amend",
        decisionReasonTag: "amended"
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });

  test("runs break-glass operational controls with notification, review, patient history, and ttl expiry", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.goto("/");

    const requestResponse = await page.request.get(
      "/api/break-glass?operation=request&requestedAt=2026-07-02T12:00:00.000Z&ttlMinutes=5"
    );
    expect(requestResponse.ok()).toBe(true);
    const requestBody = await requestResponse.json();
    expect(requestBody).toMatchObject({
      data: {
        accessId: "bg-route-1",
        status: "requested",
        expiresAt: "2026-07-02T12:05:00.000Z"
      },
      meta: {
        operationTag: "break-glass.request",
        decisionReasonTag: "requested"
      }
    });

    const activateResponse = await page.request.get(
      "/api/break-glass?operation=activate&requestedAt=2026-07-02T12:00:00.000Z&activatedAt=2026-07-02T12:01:00.000Z&ttlMinutes=5"
    );
    expect(activateResponse.ok()).toBe(true);
    const activateBody = await activateResponse.json();
    expect(activateBody).toMatchObject({
      data: {
        status: "active",
        complianceNotificationId: "compliance-bg-route-1-2026-07-02T12:01:00.000Z",
        complianceNotifiedAt: "2026-07-02T12:01:00.000Z"
      },
      meta: {
        operationTag: "break-glass.activate",
        decisionReasonTag: "activated"
      }
    });

    const reviewResponse = await page.request.get(
      "/api/break-glass?operation=review&requestedAt=2026-07-02T12:00:00.000Z&activatedAt=2026-07-02T12:01:00.000Z&ttlMinutes=5"
    );
    expect(reviewResponse.ok()).toBe(true);
    const reviewBody = await reviewResponse.json();
    expect(reviewBody).toMatchObject({
      data: {
        status: "review-completed",
        reviews: [
          {
            reviewId: "review-bg-route-1",
            outcome: "approved"
          }
        ]
      },
      meta: {
        operationTag: "break-glass.review",
        decisionReasonTag: "review-completed"
      }
    });

    const historyResponse = await page.request.get(
      "/api/break-glass?operation=history&requestedAt=2026-07-02T12:00:00.000Z&activatedAt=2026-07-02T12:01:00.000Z&ttlMinutes=5"
    );
    expect(historyResponse.ok()).toBe(true);
    const historyBody = await historyResponse.json();
    expect(historyBody).toMatchObject({
      data: [
        {
          accessId: "bg-route-1",
          status: "review-completed",
          reviewOutcome: "approved"
        }
      ],
      meta: {
        operationTag: "break-glass.history",
        decisionReasonTag: "history-returned"
      }
    });

    const expiredActivationResponse = await page.request.get(
      "/api/break-glass?operation=activate&requestedAt=2026-07-02T12:00:00.000Z&activatedAt=2026-07-02T12:10:00.000Z&ttlMinutes=5"
    );
    expect(expiredActivationResponse.status()).toBe(409);
    const expiredActivationBody = await expiredActivationResponse.json();
    expect(expiredActivationBody).toMatchObject({
      data: null,
      errors: [
        {
          code: "BREAK_GLASS_EXPIRED"
        }
      ],
      meta: {
        operationTag: "break-glass.activate",
        decisionReasonTag: "activation-rejected"
      }
    });

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
