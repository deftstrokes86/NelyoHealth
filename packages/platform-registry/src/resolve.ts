import { type Capability, findCapability } from "./capability.js";
import { findCareCircleRole } from "./care-circle.js";
import { type WorkspaceLifecycle, findWorkspace } from "./workspace.js";
import { findPersona } from "./persona.js";

/**
 * Context Engine integration — composition capability resolution (roadmap M8.3a;
 * subject- and care-circle-aware from M8.3e).
 *
 * Given the workspace, persona, and SUBJECT the Context Engine resolves, this returns the
 * COMPOSITION capability set. Every consumer surface (navigation, dashboards, tools,
 * search, reports) filters itself against this set.
 *
 * Three inputs, applied in order:
 *  1. `workspace.capabilities` ∪ `persona.capabilities` — the baseline for acting as
 *     yourself in this workspace.
 *  2. When the subject is NOT the actor, the care-circle role the actor holds toward that
 *     subject **narrows** the set by intersection. Acting for someone else can never
 *     compose more than acting for yourself: a guardian viewing a ward sees the guardian
 *     capability set, not the full patient set.
 *  3. No declared capacity toward a non-self subject composes NOTHING. A stranger's
 *     surface is empty, not partial.
 *
 * INVARIANT — this is NOT authorization. The resolved set decides what may be
 * COMPOSED/OFFERED, never what is permitted. The PDP (Authorization Platform) remains
 * the sole authorization decision point and re-decides every action at the resource
 * door, resolving real capacity from the relationship graph + consent. A capability
 * appearing here does not grant it, and the care-circle role used here is a composition
 * DECLARATION, never an authorization input.
 */
export interface ResolvedComposition {
  workspaceId: string;
  personaId: string;
  /** The care-circle role narrowing this composition, when acting for another. */
  careCircleRoleId: string | null;
  /** Whether the composition was resolved for the actor's own record. */
  subjectIsSelf: boolean;
  /** True when the workspace is enabled and the persona applies to it. */
  active: boolean;
  reasonCode:
    | "resolved"
    | "workspace-unknown"
    | "persona-unknown"
    | "workspace-disabled"
    | "persona-not-applicable"
    | "subject-capacity-unknown"
    | "subject-no-capacity";
  lifecycle: WorkspaceLifecycle | null;
  /** The composition capability set (deduplicated, resolved to catalog entries). */
  capabilities: Capability[];
}

/** Who the composition is being resolved FOR, when that is not the actor themselves. */
export interface CompositionSubject {
  /** False when acting for another person (a child, ward, patient, or sponsored person). */
  isSelf: boolean;
  /**
   * The Care Circle Registry role the actor holds toward the subject. Required when
   * `isSelf` is false — composition fails closed without it.
   */
  careCircleRoleId?: string | null;
}

const SELF: CompositionSubject = { isSelf: true, careCircleRoleId: null };

/**
 * Whether a workspace's lifecycle permits composition. `disabled` composes nothing;
 * `enabled` and `invite-only` both compose (invitation gates who may HAVE the workspace,
 * not what it offers once they do). Exported as a pure predicate so the rule is testable
 * independently of which catalog entries happen to be disabled today.
 */
export function isWorkspaceComposable(workspace: { lifecycle: WorkspaceLifecycle }): boolean {
  return workspace.lifecycle.enablementState !== "disabled";
}

/**
 * Resolve the composition capability set for a workspace + persona, optionally for a
 * subject other than the actor. Fails CLOSED at every branch: unknown/disabled workspace,
 * a non-applicable persona, or a non-self subject with no declared capacity all yield an
 * empty set, never a permissive default.
 */
export function resolveComposition(
  workspaceId: string,
  personaId: string,
  subject: CompositionSubject = SELF
): ResolvedComposition {
  const careCircleRoleId = subject.isSelf ? null : (subject.careCircleRoleId ?? null);

  const empty = (
    reasonCode: ResolvedComposition["reasonCode"],
    lifecycle: WorkspaceLifecycle | null
  ): ResolvedComposition => ({
    workspaceId,
    personaId,
    careCircleRoleId,
    subjectIsSelf: subject.isSelf,
    active: false,
    reasonCode,
    lifecycle,
    capabilities: []
  });

  const workspace = findWorkspace(workspaceId);
  if (!workspace) return empty("workspace-unknown", null);

  const persona = findPersona(personaId);
  if (!persona) return empty("persona-unknown", workspace.lifecycle);

  if (!isWorkspaceComposable(workspace)) {
    return empty("workspace-disabled", workspace.lifecycle);
  }
  if (!persona.appliesToWorkspaceKinds.includes(workspace.kind)) {
    return empty("persona-not-applicable", workspace.lifecycle);
  }
  if (!workspace.personas.includes(personaId)) {
    return empty("persona-not-applicable", workspace.lifecycle);
  }

  const ids = new Set<string>([...workspace.capabilities, ...persona.capabilities]);

  // Acting for another person: narrow to the declared capacity, or compose nothing.
  if (!subject.isSelf) {
    if (!careCircleRoleId) return empty("subject-no-capacity", workspace.lifecycle);
    const role = findCareCircleRole(careCircleRoleId);
    if (!role) return empty("subject-capacity-unknown", workspace.lifecycle);
    const permitted = new Set(role.capabilities);
    for (const id of [...ids]) {
      if (!permitted.has(id)) ids.delete(id);
    }
  }

  const capabilities: Capability[] = [];
  for (const id of ids) {
    const capability = findCapability(id);
    if (capability) capabilities.push(capability);
  }

  return {
    workspaceId,
    personaId,
    careCircleRoleId,
    subjectIsSelf: subject.isSelf,
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
