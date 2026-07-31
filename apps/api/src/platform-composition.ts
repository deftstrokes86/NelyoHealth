import { resolveComposition, type ResolvedComposition } from "@nelyohealth/platform-registry";
import type { ActingContext } from "./acting-context-resolver.js";

/**
 * Context Engine → Platform Registry integration (roadmap M8.3a).
 *
 * The Context Engine (the ActingContext resolver) is authoritative: it resolves WHO is
 * acting, in which workspace, as which persona. This adapter maps that resolved
 * ActingContext onto the Platform Registry and returns the COMPOSITION capability set
 * used to assemble surfaces (navigation, dashboards, tools, search — later phases).
 *
 * INVARIANT: composition-only. The resolved set governs what may be OFFERED, never what
 * is permitted. The PDP (Authorization Platform) remains the sole authorization
 * decision point and re-decides every action at the resource door. This function must
 * never be consulted to authorize a resource operation.
 */

/**
 * Map the Context Engine's coarse `WorkspaceKind` to a Workspace Registry id. Personal
 * maps directly; an organization workspace maps to the generic active `hospital`
 * workspace until organization-type metadata (pharmacy / laboratory / employer / …) is
 * carried on the ActingContext — a later refinement. Fail-closed by default.
 */
const WORKSPACE_ID_BY_KIND: Record<ActingContext["workspace"], string> = {
  personal: "personal",
  organization: "hospital"
};

export function resolveCompositionForActingContext(context: ActingContext): ResolvedComposition {
  const workspaceId = WORKSPACE_ID_BY_KIND[context.workspace] ?? "personal";
  // The persona's actorRole is the Persona Registry id (patient / clinician /
  // organization-admin / caregiver / guardian). An unmapped role composes nothing.
  const personaId = context.persona.actorRole;
  return resolveComposition(workspaceId, personaId);
}
