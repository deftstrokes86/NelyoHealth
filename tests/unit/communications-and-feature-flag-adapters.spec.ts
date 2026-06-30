import { describe, expect, it } from "vitest";
import {
  FakeCommunicationsAdapter,
  LocalFeatureFlagAdapter,
  assertSafeCommunicationMessage,
  assertSafeFeatureFlagKey
} from "../../packages/platform-adapters/src/index.js";

describe("communications and feature-flag adapter shells", () => {
  it("dispatches fake email/sms/push messages without live vendors", async () => {
    const adapter = new FakeCommunicationsAdapter();

    const receipts = await adapter.dispatchBatch([
      {
        channel: "email",
        recipient: "synthetic.user@example.test",
        templateId: "notify.email.synthetic",
        templateVariables: {
          subject: "Synthetic notice"
        },
        safeContext: {
          requestId: "req-email",
          correlationId: "corr-email",
          idempotencyKey: "idem-email",
          operationTag: "comms.synthetic.email"
        }
      },
      {
        channel: "sms",
        recipient: "+10000000001",
        templateId: "notify.sms.synthetic",
        templateVariables: {
          code: "123456"
        },
        safeContext: {
          requestId: "req-sms",
          correlationId: "corr-sms",
          idempotencyKey: "idem-sms",
          operationTag: "comms.synthetic.sms"
        }
      },
      {
        channel: "push",
        recipient: "synthetic-device-1",
        templateId: "notify.push.synthetic",
        templateVariables: {
          title: "Synthetic push"
        },
        safeContext: {
          requestId: "req-push",
          correlationId: "corr-push",
          idempotencyKey: "idem-push",
          operationTag: "comms.synthetic.push"
        }
      }
    ]);

    expect(receipts).toHaveLength(3);
    expect(receipts.every((receipt) => receipt.accepted)).toBe(true);
    expect(new Set(receipts.map((receipt) => receipt.channel))).toEqual(
      new Set(["email", "sms", "push"])
    );

    const outbox = adapter.readOutbox();
    expect(outbox).toHaveLength(3);
    expect(outbox[0].messageId).toBeTruthy();
  });

  it("rejects unsafe communication variables that look like secrets", () => {
    expect(() =>
      assertSafeCommunicationMessage({
        channel: "email",
        recipient: "synthetic.user@example.test",
        templateId: "notify.email.synthetic",
        templateVariables: {
          apiToken: "never-allowed"
        },
        safeContext: {
          requestId: "req-unsafe",
          correlationId: "corr-unsafe",
          idempotencyKey: "idem-unsafe",
          operationTag: "comms.synthetic.unsafe"
        }
      })
    ).toThrow(/synthetic safety constraints/);
  });

  it("evaluates local feature flags with override and default behavior", async () => {
    const adapter = new LocalFeatureFlagAdapter({
      initialFlags: {
        "feature.synthetic.enabled": true,
        "feature.synthetic.variant": "beta",
        "feature.synthetic.rollout": 25
      }
    });

    const context = {
      actorId: "operator-1",
      actorType: "operator" as const,
      environment: "local" as const
    };

    const enabled = await adapter.evaluateBoolean("feature.synthetic.enabled", false, context);
    expect(enabled).toMatchObject({
      key: "feature.synthetic.enabled",
      value: true,
      reason: "OVERRIDE"
    });

    const variant = await adapter.evaluateString("feature.synthetic.variant", "control", context);
    expect(variant.value).toBe("beta");

    const missing = await adapter.evaluateBoolean("feature.synthetic.missing", false, context);
    expect(missing).toMatchObject({
      value: false,
      reason: "DEFAULT"
    });

    assertSafeFeatureFlagKey("feature.synthetic.safe");
    expect(() => assertSafeFeatureFlagKey("INVALID KEY")).toThrow(/Feature flag key/);
  });
});
