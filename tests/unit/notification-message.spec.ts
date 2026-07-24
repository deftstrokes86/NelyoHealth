import { describe, expect, it } from "vitest";
import {
  buildReferenceOnlyDeliveryMessage,
  deriveProviderIdempotencyKey
} from "../../packages/database/src/index.js";

/**
 * M6.2 — the "no PHI beyond the trust boundary" invariant (Principle 12), proven
 * on the pure message builder without a database. The external message the
 * communications adapter sends carries only a reference recipient, the template
 * id, and reference-only template variables — never a clinical body or free text.
 * Also proves the review item-1 fix: the provider idempotency key is stable across
 * re-sends (derived from the event/recipient/channel tuple), so a gateway dedups.
 */
describe("notification: reference-only delivery message", () => {
  const safeContext = {
    requestId: "req-1",
    correlationId: "corr-1",
    idempotencyKey: "idem-1",
    operationTag: "appointment.booking.book"
  };
  const notification = {
    channel: "email" as const,
    eventRef: "00000000-0000-0000-0000-0000000000aa",
    recipientActorRef: "11111111-1111-1111-1111-111111111111",
    templateId: "notify.appointment.booked",
    notificationType: "appointment-booked",
    targetRef: "22222222-2222-2222-2222-222222222222",
    organizationRef: "33333333-3333-3333-3333-333333333333"
  };

  it("carries only the recipient reference, template id, and reference-only variables", () => {
    const message = buildReferenceOnlyDeliveryMessage(notification, safeContext);

    expect(message.recipient).toBe(notification.recipientActorRef);
    expect(message.templateId).toBe("notify.appointment.booked");
    expect(Object.keys(message.templateVariables).sort()).toEqual([
      "notificationType",
      "organizationRef",
      "targetRef"
    ]);
    expect(message.templateVariables).toEqual({
      notificationType: "appointment-booked",
      targetRef: notification.targetRef,
      organizationRef: notification.organizationRef
    });
  });

  it("contains no PHI / clinical / free-text fragments anywhere in the payload", () => {
    const message = buildReferenceOnlyDeliveryMessage(notification, safeContext);
    const serialized = JSON.stringify(message).toLowerCase();
    for (const fragment of ["phi", "clinical", "secret", "diagnosis", "reason", "note", "body"]) {
      expect(serialized).not.toContain(fragment);
    }
  });

  it("emits empty strings (never undefined/PHI) for absent optional refs", () => {
    const message = buildReferenceOnlyDeliveryMessage(
      { ...notification, targetRef: undefined, organizationRef: undefined },
      safeContext
    );
    expect(message.templateVariables.targetRef).toBe("");
    expect(message.templateVariables.organizationRef).toBe("");
  });

  it("overrides the delivery idempotency key with a stable tuple-derived key (item 1)", () => {
    const derived = deriveProviderIdempotencyKey({
      eventRef: notification.eventRef,
      recipientActorRef: notification.recipientActorRef,
      channel: notification.channel
    });

    // A re-send from a DIFFERENT run context (different safeContext) still carries
    // the SAME provider key — so a compliant gateway dedups the duplicate send.
    const first = buildReferenceOnlyDeliveryMessage(notification, safeContext);
    const retry = buildReferenceOnlyDeliveryMessage(notification, {
      ...safeContext,
      requestId: "req-2",
      correlationId: "corr-2",
      idempotencyKey: "idem-2"
    });

    expect(first.safeContext.idempotencyKey).toBe(derived);
    expect(retry.safeContext.idempotencyKey).toBe(derived);
    expect(first.safeContext.idempotencyKey).not.toBe(safeContext.idempotencyKey);
    // Traceability fields are preserved from the caller's context.
    expect(retry.safeContext.correlationId).toBe("corr-2");
  });
});
