import { type Capability, findCapability } from "./capability.js";
import { type WorkspaceLifecycle, findWorkspace } from "./workspace.js";
import { findPersona } from "./persona.js";

/**
 * Context Engine integration — composition capability resolution (roadmap M8.3a).
 *
 * Given the workspace + persona the Context Engine (ActingContext resolver) already
 * resolves, this returns the COMPOSITION capability set: the union of the workspace's
 * baseline capabilities and the persona's capabilities, gated by the workspace's
 * lifecycle enablement. Every consumer surface (navigation, dashboards, tools, search,
 * reports — later phases) filters itself against this set.
 *
 * INVARIANT — this is NOT authorization. The resolved set decides what may be
 * COMPOSED/OFFERED, never what is permitted. The PDP (Authorization Platform) remains
 * the sole authorization decision point and re-decides every action at the resource
 * door. A capability appearing here does not grant it.
 */
export interface ResolvedComposition {
  workspaceId: string;
  personaId: string;
  /** True when the workspace is enabled and the persona applies to it. */
  active: boolean;
  reasonCode:
    | "resolved"
    | "workspace-unknown"
    | "persona-unknown"
    | "workspace-disabled"
    | "persona-not-applicable";
  lifecycle: WorkspaceLifecycle | null;
  /** The composition capability set (deduplicated, resolved to catalog entries). */
  capabilities: Capability[];
}

/**
 * Resolve the composition capability set for a workspace + persona. Fails CLOSED:
 * unknown/disabled workspace or a non-applicable persona yields an empty set (nothing
 * composed), never a permissive default.
 */
export function resolveComposition(workspaceId: string, personaId: string): ResolvedComposition {
  const empty = (
    reasonCode: ResolvedComposition["reasonCode"],
    lifecycle: WorkspaceLifecycle | null
  ) => ({
    workspaceId,
    personaId,
    active: false,
    reasonCode,
    lifecycle,
    capabilities: [] as Capability[]
  });

  const workspace = findWorkspace(workspaceId);
  if (!workspace) return empty("workspace-unknown", null);

  const persona = findPersona(personaId);
  if (!persona) return empty("persona-unknown", workspace.lifecycle);

  if (workspace.lifecycle.enablementState === "disabled") {
    return empty("workspace-disabled", workspace.lifecycle);
  }
  if (!persona.appliesToWorkspaceKinds.includes(workspace.kind)) {
    return empty("persona-not-applicable", workspace.lifecycle);
  }
  if (!workspace.personas.includes(personaId)) {
    return empty("persona-not-applicable", workspace.lifecycle);
  }

  const ids = new Set<string>([...workspace.capabilities, ...persona.capabilities]);
  const capabilities: Capability[] = [];
  for (const id of ids) {
    const capability = findCapability(id);
    if (capability) capabilities.push(capability);
  }

  return {
    workspaceId,
    personaId,
    active: true,
    reasonCode: "resolved",
    lifecycle: workspace.lifecycle,
    capabilities
  };
}

/** Whether the resolved composition includes a given capability id. */
export function compositionHasCapability(
  resolved: ResolvedComposition,
  capabilityId: string
): boolean {
  return resolved.capabilities.some((capability) => capability.id === capabilityId);
}
