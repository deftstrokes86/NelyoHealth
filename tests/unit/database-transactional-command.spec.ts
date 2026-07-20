import { describe, expect, it } from "vitest";
import {
  createDomainEventEnvelope,
  ExternalCallPolicy,
  runTransactionalCommand,
  SyntheticInMemoryAuditSink,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  type CommandDescriptor
} from "../../packages/database/src/index.js";

interface SyntheticPayload extends Record<string, unknown> {
  aggregateRef: string;
}

function command(overrides: Partial<CommandDescriptor> = {}): CommandDescriptor {
  return {
    name: "synthetic.thing.mutate",
    aggregateId: "thing-1",
    action: "mutate",
    actor: {
      accountRef: "acc-1",
      personaKind: "organization",
      actorRole: "clinician",
      tenantRef: "org-1"
    },
    safeContext: {
      requestId: "req-1",
      correlationId: "corr-1",
      idempotencyKey: "idem-1",
      operationTag: "synthetic.thing.mutate"
    },
    ...overrides
  };
}

function harness() {
  return {
    transaction: new SyntheticTransactionAdapter(),
    outbox: new SyntheticInMemoryOutboxStore<SyntheticPayload>(),
    auditSink: new SyntheticInMemoryAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

describe("runTransactionalCommand", () => {
  it("commits state work + outbox event + audit intent together", async () => {
    const h = harness();
    const stateMutations: string[] = [];

    const { result, auditId } = await runTransactionalCommand({
      ...h,
      command: command(),
      work: async (ctx) => {
        stateMutations.push("mutated"); // stands in for a real state write
        await ctx.enqueueDomainEvent(
          createDomainEventEnvelope<SyntheticPayload>({
            eventType: "ThingMutated",
            aggregateId: "thing-1",
            safeContext: command().safeContext,
            payload: { aggregateRef: "thing-1" }
          })
        );
        return { result: "done", audit: { outcome: "committed", safeDetails: { changed: 1 } } };
      }
    });

    expect(result).toBe("done");
    expect(stateMutations).toEqual(["mutated"]);
    expect(h.transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "commit:tx-1"]);
    expect(h.outbox.listAll()).toHaveLength(1);

    const audits = h.auditSink.all();
    expect(audits).toHaveLength(1);
    expect(audits[0]).toMatchObject({
      auditId,
      commandName: "synthetic.thing.mutate",
      aggregateId: "thing-1",
      action: "mutate",
      outcome: "committed",
      actorAccountRef: "acc-1",
      actorPersonaKind: "organization",
      actorRole: "clinician",
      tenantRef: "org-1",
      correlationId: "corr-1",
      safeDetails: { changed: 1 }
    });
  });

  it("always writes exactly one audit event, even for a command that emits no domain event", async () => {
    const h = harness();
    await runTransactionalCommand({
      ...h,
      command: command(),
      work: async () => ({ result: null, audit: { outcome: "committed" } })
    });
    expect(h.outbox.listAll()).toHaveLength(0);
    expect(h.auditSink.all()).toHaveLength(1);
    expect(h.auditSink.all()[0].safeDetails).toEqual({});
  });

  it("records tenantRef as null in the Personal workspace", async () => {
    const h = harness();
    await runTransactionalCommand({
      ...h,
      command: command({
        actor: {
          accountRef: "acc-1",
          personaKind: "personal",
          actorRole: "patient",
          tenantRef: null
        }
      }),
      work: async () => ({ result: null, audit: { outcome: "committed" } })
    });
    expect(h.auditSink.all()[0].tenantRef).toBeNull();
  });

  it("rolls the transaction back when the work fails (state, outbox, and audit all undone at the DB)", async () => {
    const h = harness();
    await expect(
      runTransactionalCommand({
        ...h,
        command: command(),
        work: async (ctx) => {
          await ctx.enqueueDomainEvent(
            createDomainEventEnvelope<SyntheticPayload>({
              eventType: "ThingMutated",
              aggregateId: "thing-1",
              safeContext: command().safeContext,
              payload: { aggregateRef: "thing-1" }
            })
          );
          throw new Error("synthetic command failure");
        }
      })
    ).rejects.toThrow("synthetic command failure");

    // The adapter received rollback (a real DB transaction discards state,
    // the outbox row, and the audit row atomically).
    expect(h.transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "rollback:tx-1"]);
    expect(h.externalCallPolicy.isTransactionActive()).toBe(false);
  });

  it("rejects a command whose audit details name a protected body (no PHI), and rolls back", async () => {
    const h = harness();
    await expect(
      runTransactionalCommand({
        ...h,
        command: command(),
        work: async () => ({
          result: null,
          audit: { outcome: "committed", safeDetails: { clinicalNote: "should never persist" } }
        })
      })
    ).rejects.toThrow(/references-not-bodies/);

    expect(h.transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "rollback:tx-1"]);
    expect(h.auditSink.all()).toHaveLength(0);
  });
});
