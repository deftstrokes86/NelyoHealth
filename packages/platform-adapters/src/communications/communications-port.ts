export type CommunicationChannel = "email" | "sms" | "push";

export interface CommunicationSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface CommunicationMessage {
  channel: CommunicationChannel;
  recipient: string;
  templateId: string;
  templateVariables: Record<string, string>;
  safeContext: CommunicationSafeContext;
}

export interface CommunicationDispatchReceipt {
  channel: CommunicationChannel;
  messageId: string;
  accepted: boolean;
  queuedAt: string;
}

export interface CommunicationsPort {
  dispatch(message: CommunicationMessage): Promise<CommunicationDispatchReceipt>;
  dispatchBatch(messages: CommunicationMessage[]): Promise<CommunicationDispatchReceipt[]>;
}

export function assertSafeCommunicationMessage(message: CommunicationMessage): void {
  if (!message.safeContext.correlationId || !message.safeContext.idempotencyKey) {
    throw new Error("Communication messages require correlationId and idempotencyKey.");
  }

  if (!message.recipient || !message.templateId) {
    throw new Error("Communication messages require recipient and templateId.");
  }

  const forbiddenValueFragments = ["password", "token", "secret", "apikey", "card"] as const;
  for (const [key, value] of Object.entries(message.templateVariables)) {
    const normalizedKey = key.toLowerCase();
    const normalizedValue = value.toLowerCase();
    for (const fragment of forbiddenValueFragments) {
      if (normalizedKey.includes(fragment) || normalizedValue.includes(fragment)) {
        throw new Error(
          `Communication template variable '${key}' violates synthetic safety constraints.`
        );
      }
    }
  }
}
