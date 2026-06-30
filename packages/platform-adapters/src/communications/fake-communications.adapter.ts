import { randomUUID } from "node:crypto";
import {
  assertSafeCommunicationMessage,
  type CommunicationDispatchReceipt,
  type CommunicationMessage,
  type CommunicationsPort
} from "./communications-port.js";

export class FakeCommunicationsAdapter implements CommunicationsPort {
  private readonly outbox: Array<CommunicationMessage & { messageId: string; queuedAt: string }> = [];

  async dispatch(message: CommunicationMessage): Promise<CommunicationDispatchReceipt> {
    assertSafeCommunicationMessage(message);

    const messageId = randomUUID();
    const queuedAt = new Date().toISOString();
    this.outbox.push({
      ...message,
      messageId,
      queuedAt
    });

    return {
      channel: message.channel,
      messageId,
      accepted: true,
      queuedAt
    };
  }

  async dispatchBatch(messages: CommunicationMessage[]): Promise<CommunicationDispatchReceipt[]> {
    const receipts: CommunicationDispatchReceipt[] = [];
    for (const message of messages) {
      receipts.push(await this.dispatch(message));
    }
    return receipts;
  }

  readOutbox(): Array<CommunicationMessage & { messageId: string; queuedAt: string }> {
    return [...this.outbox];
  }

  resetOutbox(): void {
    this.outbox.length = 0;
  }
}
