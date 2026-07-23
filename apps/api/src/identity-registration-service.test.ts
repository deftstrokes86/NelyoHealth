import { describe, expect, it } from "vitest";
import { registerAccount } from "./identity-registration-service.js";

const validInput = {
  fullName: "Amina Okafor",
  loginEmail: "amina@example.test",
  password: "correct horse battery staple",
  safeContext: {
    requestId: "req-1",
    correlationId: "corr-1",
    idempotencyKey: "idem-1",
    operationTag: "identity.registrations.create"
  }
};

describe("registerAccount — input validation (no DB touched)", () => {
  const deps = {
    pool: {} as never,
    transaction: {} as never,
    outbox: {} as never,
    auditSink: {} as never,
    externalCallPolicy: {} as never
  };

  it("rejects a full name that is too short", async () => {
    const outcome = await registerAccount(deps, { ...validInput, fullName: "A" });
    expect(outcome).toEqual({ status: "rejected", reasonCode: "invalid-full-name" });
  });

  it("rejects a malformed email", async () => {
    const outcome = await registerAccount(deps, { ...validInput, loginEmail: "not-an-email" });
    expect(outcome).toEqual({ status: "rejected", reasonCode: "invalid-email" });
  });

  it("rejects a password below the minimum length", async () => {
    const outcome = await registerAccount(deps, { ...validInput, password: "short1" });
    expect(outcome).toEqual({ status: "rejected", reasonCode: "weak-password" });
  });

  it("trims the full name before validating length", async () => {
    const outcome = await registerAccount(deps, { ...validInput, fullName: "  A  " });
    expect(outcome).toEqual({ status: "rejected", reasonCode: "invalid-full-name" });
  });
});

// Duplicate-email no-enumeration and successful creation are data-integrity
// behavior, covered against live Postgres in tests/integration rather than
// with mocked pg internals here.
