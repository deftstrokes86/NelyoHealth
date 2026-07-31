import { z } from "zod";
import { capabilityCategorySchema } from "./capability.js";

/**
 * Tool Registry (roadmap M8.3a; extended M8.3b, refinement 2 — "AI is a consumer, not
 * a parallel platform").
 *
 * A tool is an invocable unit of platform behaviour that EXPOSES a capability. Every
 * consumer — UI, Mobile, AI, Automation, Integration — invokes the SAME tool through
 * the same declared contract. There is deliberately no separate "AI tool" surface; the
 * AI Context Resolver reads this registry exactly as the UI does, and the PDP still
 * authorizes the underlying capability at invocation.
 *
 * Each tool declares its `compatibility` (which surfaces it supports) and `execution`
 * characteristics (approval, streaming) so a consumer can decide whether/how to invoke
 * it without hardcoded per-tool branching.
 */

/** Which surfaces a tool supports, and its execution characteristics. */
export const toolCompatibilitySchema = z.object({
  supportsUI: z.boolean().default(true),
  supportsMobile: z.boolean().default(true),
  supportsAI: z.boolean().default(false),
  supportsAutomation: z.boolean().default(false),
  supportsAPI: z.boolean().default(true),
  supportsOffline: z.boolean().default(false),
  /** A human must approve before the effect commits (e.g. an AI-initiated write). */
  requiresApproval: z.boolean().default(false),
  /** The tool streams its output (long-running / incremental). */
  requiresStreaming: z.boolean().default(false)
});
export type ToolCompatibility = z.infer<typeof toolCompatibilitySchema>;

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
  compatibility: toolCompatibilitySchema,
  input: z.array(toolFieldSchema).default([]),
  output: z.array(toolFieldSchema).default([]),
  /** Whether the tool changes state (an AI/automation consumer gates on this). */
  effect: z.enum(["read", "write"]),
  /** Event Registry refs this tool produces/consumes (validated in M8.3b). */
  events: z
    .object({
      produces: z.array(z.string()).default([]),
      consumes: z.array(z.string()).default([])
    })
    .default({ produces: [], consumes: [] }),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Tool = z.infer<typeof toolSchema>;

const compat = (overrides: Partial<ToolCompatibility>): ToolCompatibility =>
  toolCompatibilitySchema.parse(overrides);

/** The initial tool set — one shared contract per capability, consumable everywhere. */
export const TOOLS: readonly Tool[] = [
  toolSchema.parse({
    id: "view-timeline",
    capability: "timeline.read",
    name: "View timeline",
    description: "Return a patient's longitudinal timeline entries.",
    category: "care-coordination",
    compatibility: compat({ supportsAI: true, supportsOffline: true }),
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  }),
  toolSchema.parse({
    id: "view-care-circle",
    capability: "care-circle.read",
    name: "View care circle",
    description: "Return a patient's care-circle membership.",
    category: "care-coordination",
    compatibility: compat({ supportsAI: true }),
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  }),
  toolSchema.parse({
    id: "book-appointment",
    capability: "appointment.book",
    name: "Book appointment",
    description: "Book an appointment into an open availability slot.",
    category: "scheduling",
    compatibility: compat({ supportsAI: true, supportsAutomation: true, requiresApproval: true }),
    input: [
      { name: "slotId", type: "reference", required: true },
      { name: "reasonForVisit", type: "string", required: false }
    ],
    effect: "write",
    events: { produces: ["AppointmentBooked"], consumes: [] }
  }),
  toolSchema.parse({
    id: "send-message",
    capability: "message.send",
    name: "Send message",
    description: "Send a secure message on a thread.",
    category: "communication",
    compatibility: compat({ requiresApproval: true }),
    input: [
      { name: "threadId", type: "reference", required: true },
      { name: "body", type: "string", required: true }
    ],
    effect: "write",
    events: { produces: ["MessagePosted"], consumes: [] }
  }),
  toolSchema.parse({
    id: "list-appointments",
    capability: "appointment.read",
    name: "List appointments",
    description: "List a patient's appointments.",
    category: "scheduling",
    compatibility: compat({ supportsAI: true, supportsAutomation: true, supportsOffline: true }),
    input: [{ name: "patientRef", type: "reference", required: true }],
    effect: "read"
  })
] as const;

const TOOL_IDS = new Set(TOOLS.map((entry) => entry.id));

export function isKnownTool(id: string): boolean {
  return TOOL_IDS.has(id);
}

export function findTool(id: string): Tool | undefined {
  return TOOLS.find((entry) => entry.id === id);
}
