import { describe, expect, it } from "vitest";
import { buildReferenceOnlyDeliveryMessage } from "../../packages/database/src/index.js";

/**
 * M6.2 — the "no PHI beyond the trust boundary" invariant (Principle 12), proven
 * on the pure message builder without a database. The external message the
 * communications adapter sends carries only a reference recipient, the template
 * id, and reference-only template variables — never a clinical body or free text.
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
});
