import { describe, expect, it } from "vitest";
import {
  evaluateSelfAccessAuthorization,
  type SelfAccessDecisionInput
} from "../../apps/api/src/authorization-policy-handlers.js";

/**
 * The self-access decision kind (M7, ADR-0014). A data subject reaching their OWN
 * record. Consent is NOT an input (it governs delegation; there is no delegate), so
 * the ONLY denials are an unverified/incorrect identity and the restriction hook.
 * The load-bearing invariant — withdraw every consent grant and still read your own
 * record — is proved end-to-end in tests/integration/api-resource-http.spec.ts;
 * here we prove the pure decision never consults consent and default-denies
 * anything that is not self.
 */
function selfInput(overrides: Partial<SelfAccessDecisionInput> = {}): SelfAccessDecisionInput {
  return {
    decisionRequestId: "dr-1",
    actorId: "account-1",
    actorRole: "patient",
    actorType: "patient",
    subjectRef: "person-1",
    subjectVerified: true,
    workspace: "personal",
    requestedResource: "timeline",
    requestedAction: "read",
    purpose: "care-coordination",
    sessionStatus: "active",
    evaluatedAt: new Date().toISOString(),
    ...overrides
  };
}

describe("evaluateSelfAccessAuthorization (self-access decision kind)", () => {
  it("allows a verified data subject with a valid session — no consent consulted", () => {
    const decision = evaluateSelfAccessAuthorization(selfInput());
    expect(decision.status).toBe("allowed");
    expect(decision.reasonCode).toBe("allowed");
    expect(decision.dimensionOutcomes.abac.status).toBe("allowed");
    expect(decision.dimensionOutcomes.rebac.status).toBe("allowed");
  });

  it("denies (self-identity-unverified) when the linkage is not server-verified", () => {
    const decision = evaluateSelfAccessAuthorization(selfInput({ subjectVerified: false }));
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("self-identity-unverified");
  });

  it("denies a non-patient persona and a non-personal workspace (not a data subject)", () => {
    expect(evaluateSelfAccessAuthorization(selfInput({ actorType: "clinician" })).reasonCode).toBe(
      "self-identity-unverified"
    );
    expect(
      evaluateSelfAccessAuthorization(selfInput({ workspace: "organization" })).reasonCode
    ).toBe("self-identity-unverified");
  });

  it("denies a non-active session before anything else", () => {
    const decision = evaluateSelfAccessAuthorization(selfInput({ sessionStatus: "revoked" }));
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("stale-session");
  });

  it("honors the restriction hook (future minors / withholds) — default is allow", () => {
    expect(evaluateSelfAccessAuthorization(selfInput({ restriction: "none" })).status).toBe(
      "allowed"
    );
    const restricted = evaluateSelfAccessAuthorization(selfInput({ restriction: "restricted" }));
    expect(restricted.status).toBe("denied");
    expect(restricted.reasonCode).toBe("self-access-restricted");
  });
});
