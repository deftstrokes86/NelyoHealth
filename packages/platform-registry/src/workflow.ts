import { z } from "zod";
import { capabilityDomainSchema } from "./capability.js";

/**
 * Workflow Registry (roadmap M8.3b, refinement 7).
 *
 * A GENERIC workflow engine, not resource-specific handlers: each workflow declares its
 * states and transitions, and each transition declares its permission (a capability),
 * the events it emits, and its notification / automation / AI / reporting hooks. New
 * workflows (appointments, telemedicine, labs, prescriptions, referrals, consent, care-
 * circle creation, diaspora care, employer programs, insurance, admission, discharge)
 * are added as DATA against this one engine.
 *
 * INVARIANT: `requiresCapability` is a COMPOSITION/declaration of the capability a
 * transition involves — it is not the authorization decision. The PDP still authorizes
 * the underlying action at execution.
 */
export const workflowTransitionSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  from: z.string().min(1),
  to: z.string().min(1),
  /** The action/trigger that fires this transition. */
  trigger: z.string().min(1),
  /** Capability ref this transition involves (declaration; the PDP decides). */
  requiresCapability: z.string().nullable().default(null),
  /** Event Registry refs emitted on this transition. */
  emitsEvents: z.array(z.string()).default([]),
  /** Notification Registry route refs fired on this transition. */
  notificationHooks: z.array(z.string()).default([]),
  /** Declarative hook names for automation / AI / reporting (resolved by consumers). */
  automationHooks: z.array(z.string()).default([]),
  aiHooks: z.array(z.string()).default([]),
  reportingHooks: z.array(z.string()).default([])
});
export type WorkflowTransition = z.infer<typeof workflowTransitionSchema>;

export const workflowSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    name: z.string().min(1),
    domain: capabilityDomainSchema,
    states: z.array(z.string().min(1)).min(2),
    initialState: z.string().min(1),
    transitions: z.array(workflowTransitionSchema).min(1),
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((workflow, ctx) => {
    const states = new Set(workflow.states);
    if (!states.has(workflow.initialState)) {
      ctx.addIssue({
        code: "custom",
        path: ["initialState"],
        message: "initialState must be a declared state"
      });
    }
    for (const transition of workflow.transitions) {
      if (!states.has(transition.from)) {
        ctx.addIssue({
          code: "custom",
          path: ["transitions"],
          message: `transition '${transition.id}' from unknown state '${transition.from}'`
        });
      }
      if (!states.has(transition.to)) {
        ctx.addIssue({
          code: "custom",
          path: ["transitions"],
          message: `transition '${transition.id}' to unknown state '${transition.to}'`
        });
      }
    }
  });
export type Workflow = z.infer<typeof workflowSchema>;

export const WORKFLOWS: readonly Workflow[] = [
  workflowSchema.parse({
    id: "appointment-booking",
    name: "Appointment booking",
    domain: "clinical",
    states: ["requested", "confirmed", "checked-in", "completed", "cancelled"],
    initialState: "requested",
    transitions: [
      {
        id: "book",
        from: "requested",
        to: "confirmed",
        trigger: "book",
        requiresCapability: "appointment.book",
        emitsEvents: ["AppointmentBooked"],
        notificationHooks: ["appointment-confirmed"],
        reportingHooks: ["appointment-volume"]
      },
      {
        id: "check-in",
        from: "confirmed",
        to: "checked-in",
        trigger: "check-in",
        requiresCapability: "appointment.read"
      },
      {
        id: "complete",
        from: "checked-in",
        to: "completed",
        trigger: "complete",
        requiresCapability: "consultation.conduct",
        reportingHooks: ["appointment-completion"]
      },
      {
        id: "cancel",
        from: "confirmed",
        to: "cancelled",
        trigger: "cancel",
        requiresCapability: "appointment.cancel",
        emitsEvents: ["AppointmentCancelled"],
        notificationHooks: ["appointment-cancelled"]
      }
    ]
  }),
  workflowSchema.parse({
    id: "consultation",
    name: "Consultation",
    domain: "clinical",
    states: ["scheduled", "in-progress", "completed", "cancelled"],
    initialState: "scheduled",
    transitions: [
      {
        id: "start",
        from: "scheduled",
        to: "in-progress",
        trigger: "start",
        requiresCapability: "consultation.conduct"
      },
      {
        id: "complete",
        from: "in-progress",
        to: "completed",
        trigger: "complete",
        requiresCapability: "consultation.conduct",
        emitsEvents: ["ConsultationCompleted"]
      }
    ]
  }),
  workflowSchema.parse({
    id: "care-circle-creation",
    name: "Care circle creation",
    domain: "care-coordination",
    states: ["invited", "active", "revoked"],
    initialState: "invited",
    transitions: [
      {
        id: "activate",
        from: "invited",
        to: "active",
        trigger: "accept",
        requiresCapability: "care-circle.manage",
        emitsEvents: ["CareCircleMemberAdded"],
        aiHooks: ["care-circle-suggest"]
      },
      {
        id: "revoke",
        from: "active",
        to: "revoked",
        trigger: "revoke",
        requiresCapability: "care-circle.manage"
      }
    ]
  })
] as const;

const WORKFLOW_IDS = new Set(WORKFLOWS.map((entry) => entry.id));

export function isKnownWorkflow(id: string): boolean {
  return WORKFLOW_IDS.has(id);
}

export function findWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((entry) => entry.id === id);
}
