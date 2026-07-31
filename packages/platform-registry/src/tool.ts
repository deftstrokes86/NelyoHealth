import { z } from "zod";
import { capabilityCategorySchema } from "./capability.js";

/**
 * Tool Registry (roadmap M8.3a, refinement: "AI is a consumer, not a parallel
 * platform").
 *
 * A tool is an invocable unit of platform behaviour that EXPOSES a capability. Every
 * consumer — AI, UI, Mobile, Automation, and future Integrations — invokes the SAME
 * tool through the same declared input/output contract. There is deliberately no
 * separate "AI capability" surface: the AI Context Resolver (a later consumer) reads
 * this registry exactly as the UI does, and the PDP still authorizes the underlying
 * capability at invocation. The `input`/`output` shapes are declarative contracts
 * (JSON-serializable) so the same tool description drives an AI tool schema, a UI
 * action, a mobile action, and an automation step without divergence.
 */

export const toolConsumerSchema = z.enum(["ui", "mobile", "ai", "automation", "integration"]);
export type ToolConsumer = z.infer<typeof toolConsumerSchema>;

/** A declarative field contract for a tool's input/output (builder- and AI-friendly). */
export const toolFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["string", "number", "boolean", "date", "reference", "enum", "object"]),
  required: z.boolean().default(false),
  description: z.string().default("")
});
export type ToolField = z.infer<typeof toolFieldSchema>;

export const toolSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** The capability id this tool exposes; the PDP authorizes it at invocation. */
  capability: z.string().regex(/^[a-z][a-z-]*\.[a-z][a-z-]*$/),
  name: z.string().min(1),
  description: z.string().min(1),
  category: capabilityCategorySchema,
  /** Every consumer surface that may invoke this tool. */
  consumers: z.array(toolConsumerSchema).min(1),
  input: z.array(toolFieldSchema).default([]),
  output: z.array(toolFieldSchema).default([]),
  /** Whether the tool changes state (an AI/automation consumer may gate on this). */
  effect: z.enum(["read", "write"]),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Tool = z.infer<typeof toolSchema>;

/**
 * The initial tool set — one shared contract per capability, consumable everywhere.
 * Extended additively as capabilities are exposed to more surfaces.
 */
export const TOOLS: readonly Tool[] = [
  toolSchema.parse({
    id: "view-timeline",
    capability: "timeline.read",
    name: "View timeline",
    description: "Return a patient's longitudinal timeline entries.",
    category: "care-coordination",
    consumers: ["ui", "mobile", "ai"],
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  }),
  toolSchema.parse({
    id: "view-care-circle",
    capability: "care-circle.read",
    name: "View care circle",
    description: "Return a patient's care-circle membership.",
    category: "care-coordination",
    consumers: ["ui", "mobile", "ai"],
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  }),
  toolSchema.parse({
    id: "book-appointment",
    capability: "appointment.book",
    name: "Book appointment",
    description: "Book an appointment into an open availability slot.",
    category: "scheduling",
    consumers: ["ui", "mobile", "ai", "automation"],
    input: [
      { name: "slotId", type: "reference", required: true },
      { name: "reasonForVisit", type: "string", required: false }
    ],
    effect: "write"
  }),
  toolSchema.parse({
    id: "send-message",
    capability: "message.send",
    name: "Send message",
    description: "Send a secure message on a thread.",
    category: "communication",
    consumers: ["ui", "mobile"],
    input: [
      { name: "threadId", type: "reference", required: true },
      { name: "body", type: "string", required: true }
    ],
    effect: "write"
  }),
  toolSchema.parse({
    id: "list-appointments",
    capability: "appointment.read",
    name: "List appointments",
    description: "List a patient's appointments.",
    category: "scheduling",
    consumers: ["ui", "mobile", "ai", "integration"],
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  })
] as const;
