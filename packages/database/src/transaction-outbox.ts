import { randomUUID } from "node:crypto";
import { FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS } from "@nelyohealth/domain";

export interface DomainEventSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface DomainEventEnvelope<TPayload extends Record<string, unknown>> {
  eventId: string;
  eventType: string;
  aggregateId: string;
  safeContext: DomainEventSafeContext;
  payload: TPayload;
  createdAt: string;
}

export type DispatchStatus = "pending" | "dispatched" | "dead-lettered";

export interface OutboxEventRecord<
  TPayload extends Record<string, unknown>
> extends DomainEventEnvelope<TPayload> {
  dispatchStatus: DispatchStatus;
  dispatchAttempts: number;
  lastError: string | null;
  dispatchedAt: string | null;
}

export interface TransactionAdapter<TClient> {
  begin(): Promise<TClient>;
  commit(client: TClient): Promise<void>;
  rollback(client: TClient): Promise<void>;
}

export interface TransactionalOutboxPort<TClient, TPayload extends Record<string, unknown>> {
  insertPending(client: TClient, event: DomainEventEnvelope<TPayload>): Promise<void>;
  listPending(limit: number): Promise<Array<OutboxEventRecord<TPayload>>>;
  markDispatched(eventId: string, dispatchedAt: string): Promise<void>;
  markDispatchFailure(eventId: string, attempt: number, reason: string): Promise<void>;
  markDeadLettered(eventId: string, attempt: number, reason: string): Promise<void>;
}

export interface DomainEventPublisher<TPayload extends Record<string, unknown>> {
  publish(event: OutboxEventRecord<TPayload>): Promise<void>;
}

export class ExternalCallPolicy {
  private transactionDepth = 0;

  onTransactionStart(): void {
    this.transactionDepth += 1;
  }

  onTransactionEnd(): void {
    this.transactionDepth = Math.max(0, this.transactionDepth - 1);
  }

  assertOutsideTransaction(callLabel: string): void {
    if (this.transactionDepth > 0) {
      throw new Error(`External call '${callLabel}' is forbidden inside an active transaction.`);
    }
  }

  isTransactionActive(): boolean {
    return this.transactionDepth > 0;
  }
}

export interface TransactionWorkContext<TClient, TPayload extends Record<string, unknown>> {
  client: TClient;
  enqueueDomainEvent(event: DomainEventEnvelope<TPayload>): Promise<void>;
  assertExternalCallAllowed(callLabel: string): void;
}

export async function runTransactionalWorkWithOutbox<
  TClient,
  TPayload extends Record<string, unknown>,
  TResult
>(input: {
  transaction: TransactionAdapter<TClient>;
  outbox: TransactionalOutboxPort<TClient, TPayload>;
  externalCallPolicy: ExternalCallPolicy;
  work: (ctx: TransactionWorkContext<TClient, TPayload>) => Promise<TResult>;
}): Promise<TResult> {
  const client = await input.transaction.begin();
  input.externalCallPolicy.onTransactionStart();

  try {
    const result = await input.work({
      client,
      enqueueDomainEvent: async (event) => {
        assertSafeDomainEvent(event);
        await input.outbox.insertPending(client, event);
      },
      assertExternalCallAllowed: (callLabel) => {
        input.externalCallPolicy.assertOutsideTransaction(callLabel);
      }
    });

    await input.transaction.commit(client);
    return result;
  } catch (error) {
    await input.transaction.rollback(client);
    throw error;
  } finally {
    input.externalCallPolicy.onTransactionEnd();
  }
}

export async function dispatchPendingOutboxEvents<
  TClient,
  TPayload extends Record<string, unknown>
>(input: {
  outbox: TransactionalOutboxPort<TClient, TPayload>;
  publisher: DomainEventPublisher<TPayload>;
  externalCallPolicy: ExternalCallPolicy;
  maxAttempts: number;
  batchSize?: number;
}): Promise<{
  dispatched: number;
  retried: number;
  deadLettered: number;
}> {
  const batchSize = input.batchSize ?? 50;
  const pendingEvents = await input.outbox.listPending(batchSize);

  let dispatched = 0;
  let retried = 0;
  let deadLettered = 0;

  for (const event of pendingEvents) {
    input.externalCallPolicy.assertOutsideTransaction("outbox-publisher.publish");

    try {
      await input.publisher.publish(event);
      await input.outbox.markDispatched(event.eventId, new Date().toISOString());
      dispatched += 1;
    } catch (error) {
      const attempt = event.dispatchAttempts + 1;
      const reason = toErrorMessage(error);
      if (attempt >= input.maxAttempts) {
        await input.outbox.markDeadLettered(event.eventId, attempt, reason);
        deadLettered += 1;
      } else {
        await input.outbox.markDispatchFailure(event.eventId, attempt, reason);
        retried += 1;
      }
    }
  }

  return {
    dispatched,
    retried,
    deadLettered
  };
}

export function createDomainEventEnvelope<TPayload extends Record<string, unknown>>(
  input: Omit<DomainEventEnvelope<TPayload>, "eventId" | "createdAt"> & {
    eventId?: string;
    createdAt?: string;
  }
): DomainEventEnvelope<TPayload> {
  return {
    eventId: input.eventId ?? randomUUID(),
    eventType: input.eventType,
    aggregateId: input.aggregateId,
    safeContext: input.safeContext,
    payload: input.payload,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export class SyntheticInMemoryOutboxStore<
  TPayload extends Record<string, unknown>
> implements TransactionalOutboxPort<{ txId: string }, TPayload> {
  private readonly records = new Map<string, OutboxEventRecord<TPayload>>();

  async insertPending(
    _client: { txId: string },
    event: DomainEventEnvelope<TPayload>
  ): Promise<void> {
    this.records.set(event.eventId, {
      ...event,
      dispatchStatus: "pending",
      dispatchAttempts: 0,
      lastError: null,
      dispatchedAt: null
    });
  }

  async listPending(limit: number): Promise<Array<OutboxEventRecord<TPayload>>> {
    return [...this.records.values()]
      .filter((event) => event.dispatchStatus === "pending")
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .slice(0, limit);
  }

  async markDispatched(eventId: string, dispatchedAt: string): Promise<void> {
    const event = this.requireEvent(eventId);
    this.records.set(eventId, {
      ...event,
      dispatchStatus: "dispatched",
      dispatchedAt,
      lastError: null
    });
  }

  async markDispatchFailure(eventId: string, attempt: number, reason: string): Promise<void> {
    const event = this.requireEvent(eventId);
    this.records.set(eventId, {
      ...event,
      dispatchAttempts: attempt,
      lastError: reason
    });
  }

  async markDeadLettered(eventId: string, attempt: number, reason: string): Promise<void> {
    const event = this.requireEvent(eventId);
    this.records.set(eventId, {
      ...event,
      dispatchStatus: "dead-lettered",
      dispatchAttempts: attempt,
      lastError: reason
    });
  }

  readById(eventId: string): OutboxEventRecord<TPayload> | undefined {
    return this.records.get(eventId);
  }

  listAll(): Array<OutboxEventRecord<TPayload>> {
    return [...this.records.values()].sort((left, right) =>
      left.createdAt.localeCompare(right.createdAt)
    );
  }

  private requireEvent(eventId: string): OutboxEventRecord<TPayload> {
    const event = this.records.get(eventId);
    if (!event) {
      throw new Error(`Outbox event ${eventId} was not found.`);
    }
    return event;
  }
}

export class SyntheticTransactionAdapter implements TransactionAdapter<{ txId: string }> {
  private nextId = 1;
  private readonly lifecycleEntries: string[] = [];

  async begin(): Promise<{ txId: string }> {
    const txId = `tx-${this.nextId}`;
    this.nextId += 1;
    this.lifecycleEntries.push(`begin:${txId}`);
    return { txId };
  }

  async commit(client: { txId: string }): Promise<void> {
    this.lifecycleEntries.push(`commit:${client.txId}`);
  }

  async rollback(client: { txId: string }): Promise<void> {
    this.lifecycleEntries.push(`rollback:${client.txId}`);
  }

  getLifecycleEntries(): string[] {
    return [...this.lifecycleEntries];
  }
}

function assertSafeDomainEvent<TPayload extends Record<string, unknown>>(
  event: DomainEventEnvelope<TPayload>
): void {
  if (!event.safeContext.correlationId || !event.safeContext.idempotencyKey) {
    throw new Error("Outbox domain event requires correlationId and idempotencyKey.");
  }

  // Converged onto the domain's single source of truth (M3.x retrofit) so the
  // outbox and the M3.1 audit path enforce the same references-not-bodies rule.
  for (const payloadKey of Object.keys(event.payload)) {
    const normalizedKey = payloadKey.toLowerCase();
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      if (normalizedKey.includes(fragment)) {
        throw new Error(
          `Outbox payload key '${payloadKey}' violates synthetic-safety constraints.`
        );
      }
    }
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Outbox dispatch failed for an unknown reason.";
}
