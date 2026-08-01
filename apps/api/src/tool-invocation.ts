import type { Pool } from "pg";
import { findTool, type Tool, type ToolField } from "@nelyohealth/platform-registry";
import { readPatientTimeline, createPgTimelineServiceDeps } from "./timeline-service.js";
import { readPatientCareCircle, createPgCareCircleServiceDeps } from "./care-circle-service.js";
import {
  bookAppointment,
  listMyAppointments,
  createPgAppointmentServiceDeps
} from "./appointment-service.js";
import { postMessage, createPgMessagingServiceDeps } from "./messaging-service.js";
import {
  createCapacityResolverPorts,
  resolveResourceAccessContext
} from "./nest/resource/resource-access-context.js";
import type { ActingContext } from "./acting-context-resolver.js";

/**
 * Tool Invocation runtime (roadmap M8.3f).
 *
 * The single execution path for everything the Tool Registry declares:
 *
 *   Tool Registry -> resolveToolContract -> invokeTool -> domain service -> response
 *
 * This module owns the ONLY binding from a tool id to an implementation. That binding
 * lived nowhere before, which is why a client had to know that the `list-appointments`
 * tool meant `GET /api/me/appointments`. Moving it here is the whole point: a client now
 * names a tool and supplies its declared input, and never learns a route.
 *
 * INVARIANTS
 *  - **Composition is not authorization.** A tool being offered by the contract only
 *    means it may be shown. Every executor runs the normal resource pipeline (trust seam
 *    -> capacity -> PDP -> audit), so an invocation the PDP refuses fails exactly as the
 *    equivalent REST call would.
 *  - **Declared input only.** Arguments are validated against the tool's own `input`
 *    contract before dispatch; undeclared fields are dropped rather than forwarded, so a
 *    caller cannot smuggle a parameter the registry never described.
 *  - **Fail closed.** An unknown tool, an unimplemented tool, and a tool the caller does
 *    not compose are all rejected without disclosing which — a probe learns nothing about
 *    what exists.
 */

export type ToolInvocationStatus =
  | "ok"
  | "tool-unknown"
  | "tool-not-implemented"
  | "input-invalid"
  | "denied";

export interface ToolInvocationResult {
  status: ToolInvocationStatus;
  toolId: string;
  /** Present when status is `ok`. Shape is the executor's own payload. */
  data?: unknown;
  /** Present when the input failed the tool's declared contract. */
  invalidFields?: string[];
}

/** Request-scoped command metadata a write executor needs (audit + idempotency). */
export interface ToolCommandContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
}

export interface ToolExecutorContext {
  pool: Pool;
  actingContext: ActingContext;
  /** The person the invocation acts for (the caller unless a subject was given). */
  subjectRef: string;
  input: Record<string, unknown>;
  command: ToolCommandContext;
}

/** The acting identity a transactional command is recorded against. */
function commandActor(actingContext: ActingContext) {
  return {
    accountRef: actingContext.identity.accountId,
    personaKind: actingContext.persona.kind,
    actorRole: actingContext.persona.actorRole,
    tenantRef: actingContext.activeTenantId
  };
}

/** Safe (no-PHI) command context, tagged with the tool that produced the write. */
function safeContext(command: ToolCommandContext, toolId: string) {
  return {
    requestId: command.requestId,
    correlationId: command.correlationId,
    idempotencyKey: command.idempotencyKey,
    operationTag: `tool.${toolId}`
  };
}

type ToolExecutor = (context: ToolExecutorContext) => Promise<ToolInvocationResult>;

/** Resolve the access context for a tool that reads/writes a subject's record. */
async function accessFor(context: ToolExecutorContext, purpose: string) {
  return resolveResourceAccessContext(
    createCapacityResolverPorts(context.pool),
    context.actingContext,
    { subjectPatientRef: context.subjectRef, purpose }
  );
}

const ok = (toolId: string, data: unknown): ToolInvocationResult => ({
  status: "ok",
  toolId,
  data
});
const denied = (toolId: string): ToolInvocationResult => ({ status: "denied", toolId });

/**
 * The tool -> implementation bindings. A tool absent from this map is DECLARED but not
 * executable; the contract reports it so a client can render it disabled instead of
 * offering an action that cannot run.
 */
const EXECUTORS: Record<string, ToolExecutor> = {
  "view-timeline": async (context) => {
    const resolution = await accessFor(context, "care-coordination");
    const outcome = await readPatientTimeline(createPgTimelineServiceDeps(context.pool), {
      access: resolution.access,
      subjectIsSelf: resolution.subjectIsSelf,
      delegation: resolution.selectedRelationshipRef
        ? {
            relationshipRef: resolution.selectedRelationshipRef,
            derivedActorRole: resolution.derivedActorRole ?? ""
          }
        : undefined,
      limit: typeof context.input.limit === "number" ? context.input.limit : undefined
    });
    if (outcome.status !== "allowed") return denied("view-timeline");
    return ok("view-timeline", { entries: outcome.entries });
  },

  "view-care-circle": async (context) => {
    const resolution = await accessFor(context, "care-coordination");
    const outcome = await readPatientCareCircle(createPgCareCircleServiceDeps(context.pool), {
      access: resolution.access,
      subjectIsSelf: resolution.subjectIsSelf,
      delegation: resolution.selectedRelationshipRef
        ? {
            relationshipRef: resolution.selectedRelationshipRef,
            derivedActorRole: resolution.derivedActorRole ?? ""
          }
        : undefined
    });
    if (outcome.status !== "allowed") return denied("view-care-circle");
    return ok("view-care-circle", { members: outcome.members });
  },

  "list-appointments": async (context) => {
    const resolution = await accessFor(context, "care-coordination");
    const outcome = await listMyAppointments(createPgAppointmentServiceDeps(context.pool), {
      access: resolution.access,
      limit: typeof context.input.limit === "number" ? context.input.limit : undefined
    });
    if (outcome.status !== "allowed") return denied("list-appointments");
    return ok("list-appointments", { appointments: outcome.appointments });
  },

  "book-appointment": async (context) => {
    const resolution = await accessFor(context, "care-delivery");
    const outcome = await bookAppointment(createPgAppointmentServiceDeps(context.pool), {
      slotId: String(context.input.slotId ?? ""),
      // The registry's booking contract carries no appointment type, so the runtime books
      // the general type; a typed booking is a contract change, not a client choice.
      appointmentType: "general",
      reasonForVisit:
        typeof context.input.reasonForVisit === "string" ? context.input.reasonForVisit : undefined,
      access: resolution.access,
      subjectPersonRef: resolution.subjectPersonRef,
      actor: commandActor(context.actingContext),
      safeContext: safeContext(context.command, "book-appointment")
    });
    if (outcome.status !== "booked") return denied("book-appointment");
    return ok("book-appointment", { appointmentId: outcome.appointmentId, status: "booked" });
  },

  "send-message": async (context) => {
    const resolution = await accessFor(context, "care-coordination");
    const outcome = await postMessage(createPgMessagingServiceDeps(context.pool), {
      threadId: String(context.input.threadId ?? ""),
      body: String(context.input.body ?? ""),
      access: resolution.access,
      actor: commandActor(context.actingContext),
      safeContext: safeContext(context.command, "send-message")
    });
    if (outcome.status !== "posted") return denied("send-message");
    return ok("send-message", { messageId: outcome.messageId, status: "posted" });
  }
};

/** Whether a declared tool has a runtime implementation. */
export function isToolExecutable(toolId: string): boolean {
  return Object.hasOwn(EXECUTORS, toolId);
}

/**
 * Declared input fields the SERVER supplies, never the client.
 *
 * `patientRef` names the subject of the invocation, which the runtime has already
 * resolved (and authorized) from `?subject=`. Taking it from the request instead would
 * let a caller resolve a contract for one subject and then act on another, so it is
 * bound from the acting context and any client-sent value is discarded.
 */
const SERVER_BOUND_FIELDS = new Set(["patientRef"]);

/** Validate raw arguments against a tool's declared input contract. */
export function validateToolInput(
  tool: Tool,
  raw: Record<string, unknown>,
  serverBound: Record<string, unknown> = {}
): { ok: true; input: Record<string, unknown> } | { ok: false; invalidFields: string[] } {
  const invalidFields: string[] = [];
  const input: Record<string, unknown> = {};

  const matchesType = (field: ToolField, value: unknown): boolean => {
    switch (field.type) {
      case "string":
      case "reference":
      case "enum":
      case "date":
        return typeof value === "string";
      case "number":
        return typeof value === "number" && Number.isFinite(value);
      case "boolean":
        return typeof value === "boolean";
      case "object":
        return typeof value === "object" && value !== null;
      default:
        return false;
    }
  };

  for (const field of tool.input) {
    // A server-bound field ignores whatever the client sent.
    const value = SERVER_BOUND_FIELDS.has(field.name) ? serverBound[field.name] : raw[field.name];
    if (value === undefined || value === null) {
      if (field.required) invalidFields.push(field.name);
      continue;
    }
    if (!matchesType(field, value)) {
      invalidFields.push(field.name);
      continue;
    }
    // Only declared fields are forwarded — an undeclared argument is dropped, never
    // passed through to a service.
    input[field.name] = value;
  }

  return invalidFields.length > 0 ? { ok: false, invalidFields } : { ok: true, input };
}

export interface InvokeToolInput {
  pool: Pool;
  actingContext: ActingContext;
  toolId: string;
  subjectRef: string;
  /** Raw client arguments, validated against the tool's declared contract. */
  input: Record<string, unknown>;
  /** Tool ids the caller's composed contract offers. */
  offeredToolIds: string[];
  command: ToolCommandContext;
}

/**
 * Invoke a tool. The caller must already have resolved the tool contract for this acting
 * context; `offeredToolIds` is that contract's available set, so a tool the caller does
 * not compose is refused here without ever reaching a service.
 */
export async function invokeTool(input: InvokeToolInput): Promise<ToolInvocationResult> {
  const tool = findTool(input.toolId);
  // Unknown and not-offered collapse to the same answer: a probe cannot map the registry.
  if (!tool || !input.offeredToolIds.includes(input.toolId)) {
    return { status: "tool-unknown", toolId: input.toolId };
  }
  if (!isToolExecutable(input.toolId)) {
    return { status: "tool-not-implemented", toolId: input.toolId };
  }

  const validated = validateToolInput(tool, input.input, { patientRef: input.subjectRef });
  if (!validated.ok) {
    return {
      status: "input-invalid",
      toolId: input.toolId,
      invalidFields: validated.invalidFields
    };
  }

  return EXECUTORS[input.toolId]({
    pool: input.pool,
    actingContext: input.actingContext,
    subjectRef: input.subjectRef,
    input: validated.input,
    command: input.command
  });
}
