import { randomUUID } from "node:crypto";
import { FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS } from "@nelyohealth/domain";
import {
  runTransactionalWorkWithOutbox,
  type DomainEventEnvelope,
  type DomainEventSafeContext,
  type ExternalCallPolicy,
  type TransactionAdapter,
  type TransactionalOutboxPort
} from "./transaction-outbox.js";

/**
 * Transactional Command (roadmap M3.1).
 *
 * The canonical "Execute" step of the request lifecycle: every state change
 * writes **state + outbox + audit intent in one transaction**
 * (architecture-evolution-report.md). This helper composes over
 * runTransactionalWorkWithOutbox and adds the mandatory, atomic audit-intent
 * write — so a command's state mutation, the events it emits, and the audit
 * record that says it happened either all commit together or all roll back
 * together. There is no code path that mutates state without an audit trail.
 *
 * The dispatcher fan-out (audit consumers, notifications, projections) and
 * the unification of this audit intent with the clinical audit model are
 * M3.2; this milestone establishes the atomic write.
 */

/** The authenticated actor a command runs as (derived from the ActingContext). */
export interface CommandActor {
  accountRef: string;
  personaKind: string;
  actorRole: string;
  /** Active organization tenant, or null in the Personal workspace. */
  tenantRef?: string | null;
}

export interface CommandDescriptor {
  /** Dotted command name, e.g. "identity.sessions.revoke". */
  name: string;
  aggregateId: string;
  /** The verb the command performs, e.g. "revoke", "register". */
  action: string;
  actor: CommandActor;
  safeContext: DomainEventSafeContext;
}

/** Audit outcome the command's work reports — outcome label + reference-only details. */
export interface CommandAuditOutcome {
  outcome: string;
  safeDetails?: Record<string, unknown>;
}

export interface AuditEventRecord {
  auditId: string;
  commandName: string;
  aggregateId: string;
  action: string;
  outcome: string;
  actorAccountRef: string;
  actorPersonaKind: string;
  actorRole: string;
  tenantRef: string | null;
  correlationId: string;
  requestId: string;
  idempotencyKey: string;
  safeDetails: Record<string, unknown>;
  occurredAt: string;
}

/** Persists an audit event on the command's transaction client (same TX as state). */
export interface AuditSink<TClient> {
  record(client: TClient, event: AuditEventRecord): Promise<void>;
}

export interface TransactionalCommandContext<TClient, TPayload extends Record<string, unknown>> {
  client: TClient;
  enqueueDomainEvent(event: DomainEventEnvelope<TPayload>): Promise<void>;
  assertExternalCallAllowed(callLabel: string): void;
}

export interface TransactionalCommandResult<TResult> {
  result: TResult;
  auditId: string;
}

/**
 * Reject audit detail keys that name protected bodies — the audit record
 * carries references, never PHI/secrets. Converges on the domain's single
 * source of truth (FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS), the same list the
 * outbox uses.
 */
export function assertSafeAuditEvent(event: AuditEventRecord): void {
  if (!event.correlationId || !event.idempotencyKey) {
    throw new Error("Audit event requires correlationId and idempotencyKey.");
  }
  for (const detailKey of Object.keys(event.safeDetails)) {
    const normalizedKey = detailKey.toLowerCase();
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      if (normalizedKey.includes(fragment)) {
        throw new Error(
          `Audit detail key '${detailKey}' is forbidden (references-not-bodies rule: '${fragment}').`
        );
      }
    }
  }
}

/**
 * Execute a command transactionally. The work performs the state mutation and
 * enqueues any domain events, then returns its result plus the audit outcome;
 * this helper writes exactly one audit event (mandatory, non-optional) on the
 * same transaction client and commits. Any failure — in the work, the event
 * enqueue, the audit safety check, or the audit write — rolls the entire
 * transaction back, leaving no state, no outbox event, and no audit record.
 */
export async function runTransactionalCommand<
  TClient,
  TPayload extends Record<string, unknown>,
  TResult
>(input: {
  transaction: TransactionAdapter<TClient>;
  outbox: TransactionalOutboxPort<TClient, TPayload>;
  auditSink: AuditSink<TClient>;
  externalCallPolicy: ExternalCallPolicy;
  command: CommandDescriptor;
  work: (
    ctx: TransactionalCommandContext<TClient, TPayload>
  ) => Promise<{ result: TResult; audit: CommandAuditOutcome }>;
}): Promise<TransactionalCommandResult<TResult>> {
  const auditId = randomUUID();

  const result = await runTransactionalWorkWithOutbox<TClient, TPayload, TResult>({
    transaction: input.transaction,
    outbox: input.outbox,
    externalCallPolicy: input.externalCallPolicy,
    work: async (ctx) => {
      const { result: workResult, audit } = await input.work({
        client: ctx.client,
        enqueueDomainEvent: ctx.enqueueDomainEvent,
        assertExternalCallAllowed: ctx.assertExternalCallAllowed
      });

      const auditEvent: AuditEventRecord = {
        auditId,
        commandName: input.command.name,
        aggregateId: input.command.aggregateId,
        action: input.command.action,
        outcome: audit.outcome,
        actorAccountRef: input.command.actor.accountRef,
        actorPersonaKind: input.command.actor.personaKind,
        actorRole: input.command.actor.actorRole,
        tenantRef: input.command.actor.tenantRef ?? null,
        correlationId: input.command.safeContext.correlationId,
        requestId: input.command.safeContext.requestId,
        idempotencyKey: input.command.safeContext.idempotencyKey,
        safeDetails: audit.safeDetails ?? {},
        occurredAt: new Date().toISOString()
      };
      assertSafeAuditEvent(auditEvent);
      await input.auditSink.record(ctx.client, auditEvent);

      return workResult;
    }
  });

  return { result, auditId };
}

/** In-memory audit sink for unit tests (mirrors SyntheticInMemoryOutboxStore). */
export class SyntheticInMemoryAuditSink implements AuditSink<{ txId: string }> {
  private readonly records: AuditEventRecord[] = [];

  async record(_client: { txId: string }, event: AuditEventRecord): Promise<void> {
    this.records.push({ ...event, safeDetails: { ...event.safeDetails } });
  }

  all(): AuditEventRecord[] {
    return this.records.map((event) => ({ ...event, safeDetails: { ...event.safeDetails } }));
  }

  readById(auditId: string): AuditEventRecord | undefined {
    const found = this.records.find((event) => event.auditId === auditId);
    return found ? { ...found, safeDetails: { ...found.safeDetails } } : undefined;
  }
}
