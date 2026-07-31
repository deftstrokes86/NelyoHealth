import { TOOLS, type Tool } from "./tool.js";
import {
  type ResolvedComposition,
  compositionHasCapability,
  resolveComposition
} from "./resolve.js";

/**
 * Consumer contract (roadmap M8.3d) — the AI / Automation / Integration read over the
 * Tool Registry.
 *
 * ADR-0016 §4: AI is a CONSUMER, not a parallel platform. There is no separate "AI tool"
 * surface; an AI Context Resolver, an automation runner, and the UI all call this same
 * function and receive the same declared contracts, differing only in which surface they
 * name. Adding an AI feature therefore adds no registry — it adds a consumer.
 *
 * The contract answers one question: for this acting context, on this surface, which
 * tools may be OFFERED, with what invocation characteristics? It reports withheld tools
 * and why, because an agent that cannot see why a tool is unavailable will retry, and an
 * auditor needs the negative answer as much as the positive one.
 *
 * INVARIANT: composition, never authorization. Appearing in `tools` is permission to
 * OFFER, not to invoke. The PDP authorizes the underlying capability at invocation, and
 * `requiresApproval` means a human must confirm before the effect commits — neither is
 * satisfied by this function returning the tool.
 */
export const CONSUMER_SURFACES = ["ui", "mobile", "ai", "automation", "api", "offline"] as const;
export type ConsumerSurface = (typeof CONSUMER_SURFACES)[number];

/** Why a tool the registry knows about was not offered to this consumer. */
export type WithheldReason =
  | "composition-inactive"
  | "capability-not-composed"
  | "surface-unsupported";

export interface OfferedTool {
  tool: Tool;
  /** A human must confirm before the effect commits (always true for an AI write). */
  requiresApproval: boolean;
  effect: Tool["effect"];
  streaming: boolean;
}

export interface WithheldTool {
  toolId: string;
  reason: WithheldReason;
}

export interface ResolvedToolContract {
  workspaceId: string;
  personaId: string;
  consumer: ConsumerSurface;
  active: boolean;
  reasonCode: ResolvedComposition["reasonCode"];
  tools: OfferedTool[];
  withheld: WithheldTool[];
}

const SURFACE_SUPPORT: Record<ConsumerSurface, (tool: Tool) => boolean> = {
  ui: (tool) => tool.compatibility.supportsUI,
  mobile: (tool) => tool.compatibility.supportsMobile,
  ai: (tool) => tool.compatibility.supportsAI,
  automation: (tool) => tool.compatibility.supportsAutomation,
  api: (tool) => tool.compatibility.supportsAPI,
  offline: (tool) => tool.compatibility.supportsOffline
};

/**
 * Resolve the tool contract for a workspace + persona on a consumer surface. Fails
 * CLOSED: an inactive composition offers nothing, and every registry tool is reported as
 * withheld with `composition-inactive` so the caller can distinguish "no tools" from
 * "not resolved".
 */
export function resolveToolContract(
  workspaceId: string,
  personaId: string,
  consumer: ConsumerSurface
): ResolvedToolContract {
  const composition = resolveComposition(workspaceId, personaId);

  if (!composition.active) {
    return {
      workspaceId,
      personaId,
      consumer,
      active: false,
      reasonCode: composition.reasonCode,
      tools: [],
      withheld: TOOLS.map((tool) => ({ toolId: tool.id, reason: "composition-inactive" as const }))
    };
  }

  const supportsSurface = SURFACE_SUPPORT[consumer];
  const tools: OfferedTool[] = [];
  const withheld: WithheldTool[] = [];

  for (const tool of TOOLS) {
    if (!compositionHasCapability(composition, tool.capability)) {
      withheld.push({ toolId: tool.id, reason: "capability-not-composed" });
      continue;
    }
    if (!supportsSurface(tool)) {
      withheld.push({ toolId: tool.id, reason: "surface-unsupported" });
      continue;
    }
    tools.push({
      tool,
      // An unattended surface never commits a write silently: the registry gate requires
      // approval on any write tool that declares AI or automation support, and we
      // re-assert it here so a future data change cannot quietly widen the contract.
      requiresApproval:
        tool.compatibility.requiresApproval ||
        (tool.effect === "write" && (consumer === "ai" || consumer === "automation")),
      effect: tool.effect,
      streaming: tool.compatibility.requiresStreaming
    });
  }

  return {
    workspaceId,
    personaId,
    consumer,
    active: true,
    reasonCode: composition.reasonCode,
    tools,
    withheld
  };
}

/** Whether a resolved contract offers a given tool id. */
export function contractHasTool(contract: ResolvedToolContract, toolId: string): boolean {
  return contract.tools.some((offered) => offered.tool.id === toolId);
}
