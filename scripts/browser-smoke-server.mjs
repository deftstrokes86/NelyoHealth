import http from "node:http";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    host: { type: "string", default: "127.0.0.1" },
    port: { type: "string", default: "4173" }
  }
});
const host = values.host ?? "127.0.0.1";
const port = Number(values.port ?? "4173");
const apiJsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NelyoHealth Browser Smoke Check</title>
<style>
body{font-family:Verdana,sans-serif;margin:0;background:#fffdf8;color:#102321}*,*:before,*:after{box-sizing:border-box}main{width:min(100% - 2rem,64rem);margin:0 auto;padding:2rem;display:grid;gap:1rem}section{display:grid;gap:.5rem}nav ul{display:flex;gap:.75rem;flex-wrap:wrap;padding:0;list-style:none}button,input{min-height:44px;width:100%;max-width:24rem;font:inherit;border-radius:12px;border:1px solid #b8cab9;padding:.65rem .9rem}button{background:#0d5e57;color:#fffdf8;font-weight:700}button:focus-visible,input:focus-visible{outline:3px solid #f5c15c;outline-offset:3px}.dialog-backdrop{position:fixed;inset:0;display:none;place-items:center;background:rgba(16,35,33,.36);padding:1rem}.dialog-backdrop[open]{display:grid}.dialog-panel{background:#fffdf8;border:1px solid #b8cab9;border-radius:20px;padding:1.25rem;box-shadow:0 18px 42px rgba(16,35,33,.12)}.error{color:#7a1f17}</style>
</head>
<body>
<main>
<h1>NelyoHealth Browser Smoke Check</h1>
<nav aria-label="Smoke sections"><ul><li><a href="#status">Status</a></li><li><a href="#form">Form</a></li><li><a href="#dialog">Dialog</a></li></ul></nav>
<section id="status"><p role="status" id="live-status" aria-live="polite">Synthetic status idle.</p><button id="statusButton" type="button">Update synthetic status</button></section>
<section id="form"><label for="syntheticInput">Synthetic label</label><p id="synthetic-name-help">Enter the synthetic pass phrase.</p><input id="syntheticInput" autocomplete="off" aria-describedby="synthetic-name-help"><button id="formButton" type="button">Submit synthetic form</button><p id="synthetic-name-error" class="error" hidden>Enter &quot;ready&quot; to pass the synthetic validation check.</p></section>
<section id="dialog"><button id="openDialog" type="button">Open synthetic dialog</button></section>
<section><p id="asyncState">Synthetic same-origin idle.</p><button id="sameOrigin" type="button">Run same-origin check</button><button id="errorState" type="button">Show synthetic error state</button></section>
<div class="dialog-backdrop" id="dialogBackdrop"><div class="dialog-panel" role="dialog" aria-modal="true" aria-label="Synthetic confirmation dialog"><p>Synthetic confirmation dialog</p><button id="closeDialog" type="button">Close dialog</button></div></div>
</main>
<script>
const statusText=document.getElementById('live-status');
const statusButton=document.getElementById('statusButton');
const input=document.getElementById('syntheticInput');
const formButton=document.getElementById('formButton');
const validation=document.getElementById('synthetic-name-error');
const backdrop=document.getElementById('dialogBackdrop');
const openDialog=document.getElementById('openDialog');
const closeDialog=document.getElementById('closeDialog');
const asyncState=document.getElementById('asyncState');
statusButton.addEventListener('click',()=>{statusText.textContent='Synthetic status updated.'});
formButton.addEventListener('click',()=>{if(input.value!=='ready'){input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','synthetic-name-help synthetic-name-error');validation.hidden=false;input.focus();return;}input.removeAttribute('aria-invalid');input.setAttribute('aria-describedby','synthetic-name-help');validation.hidden=true;});
openDialog.addEventListener('click',()=>{backdrop.setAttribute('open','');closeDialog.focus();});
closeDialog.addEventListener('click',()=>{backdrop.removeAttribute('open');openDialog.focus();});
document.getElementById('sameOrigin').addEventListener('click',async()=>{asyncState.textContent='Loading synthetic same-origin response...';const response=await fetch('/api/smoke',{cache:'no-store'});if(response.ok)asyncState.textContent='Synthetic same-origin request completed.';});
document.getElementById('errorState').addEventListener('click',()=>{asyncState.textContent='Synthetic handled error state.'});
</script>
</body></html>`;
const server = http.createServer((request, response) => {
  if (request.url === "/api/smoke") {
    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    setTimeout(() => response.end(JSON.stringify({ ok: true, synthetic: true })), 1000);
    return;
  }
  if (request.url === "/api/payment-transition") {
    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data: {
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "initiated",
          amount: "5000",
          currency: "NGN",
          authorizedAt: null,
          settledAt: null
        },
        meta: {
          requestId: "req-payment-route",
          correlationId: "corr-payment-route",
          operationTag: "payment.transition",
          decisionReasonTag: "to:initiated"
        },
        errors: []
      })
    );
    return;
  }
  if (request.url === "/api/refund-transition") {
    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data: {
          refundId: "refund-route-1",
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "eligibility-review",
          amount: "5000",
          currency: "NGN",
          completedAt: null
        },
        meta: {
          requestId: "req-refund-route",
          correlationId: "corr-refund-route",
          operationTag: "refund.transition",
          decisionReasonTag: "to:eligibility-review"
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/disclosure-eligibility")) {
    const requestUrl = new URL(
      request.url ?? "/api/disclosure-eligibility",
      `http://${host}:${port}`
    );
    const paymentStatus = requestUrl.searchParams.get("paymentStatus") ?? "quoted";
    const refundStatus = requestUrl.searchParams.get("refundStatus");
    const sameTenant = requestUrl.searchParams.get("sameTenant") !== "false";
    const hasAuthorization = requestUrl.searchParams.get("hasAuthorization") !== "false";
    const orderId = requestUrl.searchParams.get("orderId") ?? "order-synthetic";
    const providerDisplayName =
      requestUrl.searchParams.get("providerDisplayName") ?? "Synthetic Provider";

    let payload = {
      orderId,
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName,
      authorizedAt: new Date(0).toISOString()
    };

    if (!sameTenant) {
      payload = {
        ...payload,
        status: "denied",
        reasonCode: "tenant-mismatch",
        authorizedAt: null
      };
    } else if (!hasAuthorization) {
      payload = {
        ...payload,
        status: "denied",
        reasonCode: "authorization-missing",
        authorizedAt: null
      };
    } else if (paymentStatus !== "settled") {
      payload = {
        ...payload,
        status: "not-eligible",
        reasonCode: "payment-not-settled",
        authorizedAt: null
      };
    } else if (refundStatus === "completed") {
      payload = {
        ...payload,
        status: "not-eligible",
        reasonCode: "policy-gated",
        authorizedAt: null
      };
    }

    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(
      JSON.stringify({
        data: payload,
        meta: {
          requestId: "req-disclosure-route",
          correlationId: "corr-disclosure-route",
          operationTag: "provider-disclosure.eligibility.evaluate",
          decisionReasonTag: payload.reasonCode
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/auth-decision")) {
    const requestUrl = new URL(request.url ?? "/api/auth-decision", `http://${host}:${port}`);
    const intent = requestUrl.searchParams.get("intent") ?? "login";
    const mode = requestUrl.searchParams.get("mode") ?? "password";
    const tier = requestUrl.searchParams.get("tier") ?? "patient";
    const attempts = Number(requestUrl.searchParams.get("attempts") ?? "0");
    const maxAttempts = Number(requestUrl.searchParams.get("maxAttempts") ?? "5");
    const passwordVerified = requestUrl.searchParams.get("passwordVerified") !== "false";
    const otpVerified = requestUrl.searchParams.get("otpVerified") === "true";
    const mfaVerified = requestUrl.searchParams.get("mfaVerified") === "true";
    const trustedDevice = requestUrl.searchParams.get("trustedDevice") === "true";
    const accountRecoveryApproved =
      requestUrl.searchParams.get("accountRecoveryApproved") === "true";
    const phoneChangeOtpVerified = requestUrl.searchParams.get("phoneChangeOtpVerified") === "true";
    const suspicious = requestUrl.searchParams.get("suspicious") === "true";
    const requestedPhone = requestUrl.searchParams.get("requestedPhone") ?? null;

    let data = {
      authRequestId: "auth-route-1",
      status: "authenticated",
      reasonCode: "authenticated",
      requiresMfa: false,
      sessionAction: "create",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: new Date(0).toISOString(),
      nextSteps: ["session-established"]
    };

    if (attempts >= maxAttempts) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "rate-limit-exceeded",
        sessionAction: "none",
        nextSteps: ["wait-and-retry", "optional-account-recovery"]
      };
    } else if (suspicious) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "suspicious-login-review-required",
        requiresMfa: true,
        sessionAction: "revoke",
        nextSteps: ["security-review", "account-recovery"]
      };
    } else if (intent === "recover-account" && !accountRecoveryApproved) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "recovery-verification-required",
        sessionAction: "none",
        nextSteps: ["verify-recovery-proof"]
      };
    } else if (intent === "change-phone" && !requestedPhone) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "phone-change-target-missing",
        sessionAction: "none",
        nextSteps: ["supply-target-phone"]
      };
    } else if (intent === "change-phone" && !phoneChangeOtpVerified) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "phone-change-otp-required",
        sessionAction: "none",
        nextSteps: ["verify-phone-change-otp"]
      };
    } else if (mode === "passwordless" && !otpVerified) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "otp-verification-required",
        sessionAction: "none",
        nextSteps: ["submit-otp"]
      };
    } else if (mode === "password" && !passwordVerified) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "credentials-invalid",
        sessionAction: "none",
        nextSteps: ["retry-login", "account-recovery"]
      };
    } else if (
      (tier === "provider" || tier === "organization-admin" || tier === "platform-admin") &&
      !trustedDevice &&
      !mfaVerified
    ) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "mfa-required",
        requiresMfa: true,
        sessionAction: "none",
        nextSteps: ["complete-mfa"]
      };
    } else if (intent === "change-phone") {
      data = {
        ...data,
        updatedPhoneE164: requestedPhone
      };
    }

    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-auth-route",
          correlationId: "corr-auth-route",
          operationTag: "authentication.decision.evaluate",
          decisionReasonTag: data.reasonCode
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/tenancy-access")) {
    const requestUrl = new URL(request.url ?? "/api/tenancy-access", `http://${host}:${port}`);
    const requestedTenantId = requestUrl.searchParams.get("requestedTenantId");
    const activeTenantId = requestUrl.searchParams.get("activeTenantId");
    const allowSwitch = requestUrl.searchParams.get("allowSwitch") === "true";
    const membershipStatus = requestUrl.searchParams.get("membershipStatus") ?? "active";
    const rolePresent = requestUrl.searchParams.get("rolePresent") !== "false";
    const roleStatus = requestUrl.searchParams.get("roleStatus") ?? "active";
    const facilityAllowed = requestUrl.searchParams.get("facilityAllowed") !== "false";

    let data = {
      accessRequestId: "access-route-1",
      status: "allowed",
      reasonCode: "allowed",
      sessionTenantAction:
        activeTenantId && requestedTenantId && activeTenantId !== requestedTenantId
          ? "switch-tenant"
          : "none",
      resolvedTenantId: requestedTenantId,
      nextSteps: ["proceed"],
      evaluatedAt: new Date(0).toISOString()
    };

    if (!requestedTenantId) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "tenant-context-missing",
        sessionTenantAction: "none",
        resolvedTenantId: null,
        nextSteps: ["select-tenant-context"]
      };
    } else if (membershipStatus !== "active") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "membership-not-active",
        sessionTenantAction: membershipStatus === "offboarded" ? "revoke-session" : "none",
        resolvedTenantId: requestedTenantId,
        nextSteps:
          membershipStatus === "invited"
            ? ["accept-invitation"]
            : ["contact-organization-administrator"]
      };
    } else if (!rolePresent) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "role-assignment-missing",
        sessionTenantAction: "none",
        resolvedTenantId: requestedTenantId,
        nextSteps: ["request-role-assignment"]
      };
    } else if (roleStatus !== "active") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "role-assignment-not-active",
        sessionTenantAction: "none",
        resolvedTenantId: requestedTenantId,
        nextSteps: ["contact-organization-administrator"]
      };
    } else if (!facilityAllowed) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "facility-out-of-scope",
        sessionTenantAction: "none",
        resolvedTenantId: requestedTenantId,
        nextSteps: ["switch-facility-context", "request-facility-scope"]
      };
    } else if (activeTenantId !== requestedTenantId && !allowSwitch) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "tenant-switch-required",
        sessionTenantAction: "none",
        resolvedTenantId: requestedTenantId,
        nextSteps: ["confirm-tenant-switch"]
      };
    }

    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-tenancy-route",
          correlationId: "corr-tenancy-route",
          operationTag: "tenancy.access.evaluate",
          decisionReasonTag: data.reasonCode
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/membership-lifecycle")) {
    const requestUrl = new URL(
      request.url ?? "/api/membership-lifecycle",
      `http://${host}:${port}`
    );
    const action = requestUrl.searchParams.get("action") ?? "accept-invitation";
    const currentStatus = requestUrl.searchParams.get("currentStatus") ?? "invited";

    let data = {
      membershipId: "membership-route-1",
      tenantId: "tenant-route-1",
      action,
      status: "applied",
      reasonCode: "applied",
      updatedStatus: "active",
      sessionAction: "none",
      evaluatedAt: new Date(0).toISOString()
    };

    if (action === "accept-invitation") {
      if (currentStatus !== "invited") {
        data = {
          ...data,
          status: "denied",
          reasonCode: "invitation-not-pending",
          updatedStatus: currentStatus
        };
      }
    } else if (action === "suspend-membership") {
      if (currentStatus !== "active") {
        data = {
          ...data,
          status: "denied",
          reasonCode: "membership-not-active",
          updatedStatus: currentStatus,
          sessionAction: "none"
        };
      } else {
        data = {
          ...data,
          updatedStatus: "suspended",
          sessionAction: "revoke-session"
        };
      }
    } else if (action === "offboard-membership") {
      if (currentStatus === "offboarded") {
        data = {
          ...data,
          status: "denied",
          reasonCode: "membership-already-offboarded",
          updatedStatus: "offboarded"
        };
      } else {
        data = {
          ...data,
          updatedStatus: "offboarded",
          sessionAction: "revoke-session"
        };
      }
    }

    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-membership-route",
          correlationId: "corr-membership-route",
          operationTag: "membership.lifecycle.evaluate",
          decisionReasonTag: data.reasonCode
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/tenant-protected-resource")) {
    const requestUrl = new URL(
      request.url ?? "/api/tenant-protected-resource",
      `http://${host}:${port}`
    );
    const sameTenant = requestUrl.searchParams.get("sameTenant") !== "false";

    if (!sameTenant) {
      response.writeHead(403, apiJsonHeaders);
      response.end(
        JSON.stringify({
          data: null,
          meta: {
            requestId: "req-tenant-protected-route",
            correlationId: "corr-tenant-protected-route",
            operationTag: "tenant.resource.access",
            decisionReasonTag: "tenant-mismatch"
          },
          errors: [
            {
              code: "TENANT_ACCESS_DENIED",
              message: "Access denied."
            }
          ]
        })
      );
      return;
    }

    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data: {
          resourceLabel: "tenant-safe-resource",
          tenantScoped: true
        },
        meta: {
          requestId: "req-tenant-protected-route",
          correlationId: "corr-tenant-protected-route",
          operationTag: "tenant.resource.access",
          decisionReasonTag: "allowed"
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/authorization-policy")) {
    const requestUrl = new URL(
      request.url ?? "/api/authorization-policy",
      `http://${host}:${port}`
    );
    const sameTenant = requestUrl.searchParams.get("sameTenant") !== "false";
    const sessionStatus = requestUrl.searchParams.get("sessionStatus") ?? "active";
    const consentStatus = requestUrl.searchParams.get("consentStatus") ?? "granted";
    const relationshipStatus = requestUrl.searchParams.get("relationshipStatus") ?? "active";
    const requiresRelationship = requestUrl.searchParams.get("requiresRelationship") !== "false";
    const sponsorPaymentOnly = requestUrl.searchParams.get("sponsorPaymentOnly") === "true";
    const requestedResource =
      requestUrl.searchParams.get("requestedResource") ?? "clinical-record-summary";
    const breakGlassRequested = requestUrl.searchParams.get("breakGlassRequested") === "true";
    const breakGlassReason = requestUrl.searchParams.get("breakGlassReason") ?? "";
    const breakGlassWindowMinutes = Number(
      requestUrl.searchParams.get("breakGlassWindowMinutes") ?? "0"
    );
    const actorRole = requestUrl.searchParams.get("actorRole") ?? "guardian";
    const impersonationAttempt = requestUrl.searchParams.get("impersonationAttempt") === "true";
    const auditEventEditAttempt = requestUrl.searchParams.get("auditEventEditAttempt") === "true";
    const consentCurrentVersion = Number(
      requestUrl.searchParams.get("consentCurrentVersion") ?? "1"
    );
    const knownConsentVersions = (requestUrl.searchParams.get("knownConsentVersions") ?? "1")
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value));
    const consentDomains = (
      requestUrl.searchParams.get("consentDomains") ?? "telemedicine,provider-data-sharing"
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const requestedConsentDomains = (
      requestUrl.searchParams.get("requestedConsentDomains") ?? "telemedicine,provider-data-sharing"
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    let data = {
      decisionRequestId: "policy-route-1",
      status: "allowed",
      reasonCode: "allowed",
      breakGlassActive: false,
      nextSteps: ["proceed"],
      auditIntent: {
        appendOnly: true,
        eventType: "authorization-policy-decision",
        actorId: "actor-route-1",
        patientId: "patient-route-1",
        organizationId: "tenant-route-1",
        requestedResource,
        requestedAction: "read",
        purpose: "care-delivery",
        decisionStatus: "allowed",
        reasonCode: "allowed",
        breakGlassUsed: breakGlassRequested,
        requestId: "policy-route-1",
        occurredAt: new Date(0).toISOString()
      },
      evaluatedAt: new Date(0).toISOString()
    };

    if (!sameTenant) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "tenant-mismatch",
        nextSteps: ["select-correct-organization-context"]
      };
    } else if (sessionStatus !== "active") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "stale-session",
        nextSteps: ["reauthenticate"]
      };
    } else if (auditEventEditAttempt) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "audit-event-append-only",
        nextSteps: ["create-amendment-event"]
      };
    } else if (impersonationAttempt && actorRole.includes("admin")) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "administrator-impersonation-denied",
        nextSteps: ["request-explicit-delegation"]
      };
    } else if (sponsorPaymentOnly && requestedResource.startsWith("clinical")) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "sponsor-payment-no-clinical-access",
        nextSteps: ["request-clinical-authorization"]
      };
    } else if (!knownConsentVersions.includes(consentCurrentVersion)) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "consent-version-stale",
        nextSteps: ["refresh-consent-version"]
      };
    } else if (consentStatus !== "granted") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "consent-revoked",
        nextSteps: ["restore-consent"]
      };
    } else if (!requestedConsentDomains.every((domain) => consentDomains.includes(domain))) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "consent-scope-not-granted",
        nextSteps: ["request-required-consent-scope"]
      };
    } else if (requiresRelationship && relationshipStatus === "revoked") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "relationship-revoked",
        nextSteps: ["request-relationship-reinstatement"]
      };
    } else if (requiresRelationship && relationshipStatus === "expired") {
      data = {
        ...data,
        status: "denied",
        reasonCode: "relationship-expired",
        nextSteps: ["renew-relationship-verification"]
      };
    } else if (breakGlassRequested && !breakGlassReason) {
      data = {
        ...data,
        status: "challenge-required",
        reasonCode: "break-glass-reason-required",
        nextSteps: ["capture-break-glass-reason"]
      };
    } else if (breakGlassRequested && breakGlassWindowMinutes > 15) {
      data = {
        ...data,
        status: "denied",
        reasonCode: "break-glass-window-exceeded",
        nextSteps: ["request-short-lived-break-glass"]
      };
    }

    data = {
      ...data,
      breakGlassActive:
        breakGlassRequested && data.status === "allowed" && Boolean(breakGlassReason),
      auditIntent: {
        ...data.auditIntent,
        decisionStatus: data.status,
        reasonCode: data.reasonCode
      }
    };

    response.writeHead(200, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-authorization-policy-route",
          correlationId: "corr-authorization-policy-route",
          operationTag: "authorization.policy.evaluate",
          decisionReasonTag: data.reasonCode
        },
        errors: []
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/audit-events")) {
    const requestUrl = new URL(request.url ?? "/api/audit-events", `http://${host}:${port}`);
    const operation = requestUrl.searchParams.get("operation") ?? "append";
    const targetEventId = requestUrl.searchParams.get("targetEventId") ?? "audit-event-1";

    let statusCode = 200;
    let data = {
      eventId: "audit-event-1",
      eventVersion: 1,
      appendOnly: true,
      actorId: "actor-route-1",
      subjectId: "patient-route-1",
      organizationId: "tenant-route-1",
      action: "read",
      resource: "clinical-record-summary",
      purpose: "care-delivery",
      occurredAt: new Date(0).toISOString(),
      requestId: "req-audit-route-1",
      ipAddress: "198.51.100.50",
      device: {
        deviceId: "device-route-1",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        status: "pending"
      },
      newState: {
        status: "allowed"
      }
    };
    let errors = [];
    let decisionReasonTag = "appended";

    if (operation === "mutate") {
      statusCode = 409;
      data = null;
      decisionReasonTag = "append-only-rejected";
      errors = [
        {
          code: "AUDIT_APPEND_ONLY_ENFORCED",
          message: "Audit events are append-only and cannot be edited through application routes."
        }
      ];
    } else if (operation === "amend") {
      data = {
        eventId: "audit-event-1-amendment",
        eventVersion: 2,
        appendOnly: true,
        actorId: "clinician-route-1",
        subjectId: "patient-route-1",
        organizationId: "tenant-route-1",
        action: "amend",
        resource: "clinical-record-summary",
        purpose: "care-delivery",
        occurredAt: new Date(0).toISOString(),
        requestId: "req-audit-route-2",
        ipAddress: "198.51.100.51",
        device: {
          deviceId: "device-route-2",
          deviceType: "desktop",
          userAgent: "SyntheticDesktop/1.0"
        },
        breakGlassUsed: false,
        priorState: {
          status: "allowed",
          version: 1
        },
        newState: {
          status: "allowed-amended",
          version: 2
        },
        supersedesEventId: targetEventId,
        amendmentReason: "post-sign-correction"
      };
      decisionReasonTag = "amended";
    }

    response.writeHead(statusCode, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-audit-route-envelope",
          correlationId: "corr-audit-route-envelope",
          operationTag: `audit.event.${operation}`,
          decisionReasonTag
        },
        errors
      })
    );
    return;
  }
  if ((request.url ?? "").startsWith("/api/break-glass")) {
    const requestUrl = new URL(request.url ?? "/api/break-glass", `http://${host}:${port}`);
    const operation = requestUrl.searchParams.get("operation") ?? "request";
    const requestedAt = requestUrl.searchParams.get("requestedAt") ?? "2026-07-02T12:00:00.000Z";
    const activatedAt = requestUrl.searchParams.get("activatedAt") ?? "2026-07-02T12:01:00.000Z";
    const ttlMinutes = Number(requestUrl.searchParams.get("ttlMinutes") ?? "5");
    const requestedAtMs = Date.parse(requestedAt);
    const expiresAt = Number.isNaN(requestedAtMs)
      ? requestedAt
      : new Date(requestedAtMs + ttlMinutes * 60_000).toISOString();

    let statusCode = 200;
    let decisionReasonTag = "requested";
    let data = {
      accessId: "bg-route-1",
      actorId: "clinician-route-1",
      patientId: "patient-route-1",
      organizationId: "tenant-route-1",
      reason: "critical deterioration",
      requestedAt,
      ttlMinutes,
      expiresAt,
      status: "requested",
      reviews: []
    };
    let errors = [];

    if (operation === "activate") {
      const activatedAtMs = Date.parse(activatedAt);
      const expiresAtMs = Date.parse(expiresAt);

      if (
        !Number.isNaN(activatedAtMs) &&
        !Number.isNaN(expiresAtMs) &&
        activatedAtMs > expiresAtMs
      ) {
        statusCode = 409;
        decisionReasonTag = "activation-rejected";
        data = null;
        errors = [
          {
            code: "BREAK_GLASS_EXPIRED",
            message: "Break-glass access expired before activation."
          }
        ];
      } else {
        decisionReasonTag = "activated";
        data = {
          ...data,
          status: "active",
          activatedAt,
          complianceNotificationId: `compliance-bg-route-1-${activatedAt}`,
          complianceNotifiedAt: activatedAt
        };
      }
    } else if (operation === "review") {
      decisionReasonTag = "review-completed";
      data = {
        ...data,
        status: "review-completed",
        activatedAt,
        complianceNotificationId: `compliance-bg-route-1-${activatedAt}`,
        complianceNotifiedAt: activatedAt,
        reviews: [
          {
            reviewId: "review-bg-route-1",
            reviewedByActorId: "compliance-route-1",
            reviewedAt: "2026-07-02T12:30:00.000Z",
            outcome: "approved",
            notes: "review complete"
          }
        ]
      };
    } else if (operation === "history") {
      decisionReasonTag = "history-returned";
      data = [
        {
          accessId: "bg-route-1",
          actorId: "clinician-route-1",
          patientId: "patient-route-1",
          organizationId: "tenant-route-1",
          reason: "critical deterioration",
          usedAt: activatedAt,
          expiresAt,
          status: "review-completed",
          reviewOutcome: "approved",
          reviewedAt: "2026-07-02T12:30:00.000Z"
        }
      ];
    }

    response.writeHead(statusCode, apiJsonHeaders);
    response.end(
      JSON.stringify({
        data,
        meta: {
          requestId: "req-break-glass-route",
          correlationId: "corr-break-glass-route",
          operationTag: `break-glass.${operation}`,
          decisionReasonTag
        },
        errors
      })
    );
    return;
  }
  if (request.url === "/" || request.url === "/healthz") {
    response.writeHead(200, {
      "content-type":
        request.url === "/healthz" ? "text/plain; charset=utf-8" : "text/html; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(request.url === "/healthz" ? "ok" : html);
    return;
  }
  if (request.url === "/favicon.ico") {
    response.writeHead(204, {
      "cache-control": "no-store"
    });
    response.end();
    return;
  }
  response.writeHead(404, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end("not found");
});
server.listen(port, host, () =>
  console.log(`browser smoke server listening at http://${host}:${port}`)
);
