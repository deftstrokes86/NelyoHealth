import type { Pool } from "pg";
import {
  listActiveRelationshipsForActorPatient,
  type PersistedRelationship
} from "@nelyohealth/database";
import {
  careCircleCompositionPriority,
  composeSurface,
  findCareCircleRoleByRelationshipType,
  resolveToolContract,
  type CareCircleRole,
  type ComposedSurface,
  type CompositionSubject,
  type ConsumerSurface,
  type ResolvedToolContract
} from "@nelyohealth/platform-registry";
import type { ActingContext } from "./acting-context-resolver.js";

/**
 * Runtime composition service (roadmap M8.3e) — the ONE path from ActingContext to a
 * composed experience.
 *
 * The pipeline is: Platform Registry -> Context Engine (ActingContext) -> this service ->
 * composeSurface / resolveToolContract -> API -> client. Nothing else in the platform
 * composes navigation, dashboards, widgets, homepage, onboarding, search, reports, or
 * tool access; there is no second implementation and no hardcoded fallback.
 *
 * Three runtime facts are resolved here, all by REGISTRY LOOKUP rather than code branch:
 *
 *  1. **Workspace** — `actingContext.workspaceId`, which is the active organization's own
 *     `organizationType` (a Workspace Registry id). A pharmacy composes as a pharmacy.
 *     An organization that cannot be typed composes NOTHING rather than defaulting.
 *  2. **Persona** — `patient` when acting on your own record; otherwise the persona the
 *     care-circle role declares (`composesAsPersona`), resolved from the AUTHORITATIVE
 *     relationship graph.
 *  3. **Subject** — who the surface is for. Acting for another narrows the capability set
 *     by the care-circle role's own capabilities, so viewing your ward is a materially
 *     different experience from viewing yourself.
 *
 * INVARIANT — composition, never authorization. This service decides what may be
 * OFFERED. The PDP remains the sole authorization decision point and re-decides every
 * action at the resource door; the relationship graph is read here only to select a
 * COMPOSITION capacity, and a composed surface never implies an allowed read. In
 * particular a diaspora sponsor composes a funding/coordination surface while the PDP
 * continues to deny clinical access (`sponsor-payment-no-clinical-access`).
 */

export interface CompositionPorts {
  listActiveRelationshipsForActorPatient(input: {
    actorRef: string;
    patientRef: string;
  }): Promise<PersistedRelationship[]>;
}

export function createPgCompositionPorts(pool: Pool): CompositionPorts {
  return {
    listActiveRelationshipsForActorPatient: async (input) => {
      const client = await pool.connect();
      try {
        return await listActiveRelationshipsForActorPatient(client, input);
      } finally {
        client.release();
      }
    }
  };
}

/** Why the runtime resolved the composition target it did. */
export type CompositionTargetReason =
  | "self"
  | "delegated"
  | "subject-no-capacity"
  | "workspace-untyped";

export interface CompositionTarget {
  workspaceId: string;
  personaId: string;
  subject: CompositionSubject;
  /** The person this surface is composed for. */
  subjectPersonRef: string;
  /** The care-circle role selected for a delegated composition. */
  careCircleRoleId: string | null;
  reason: CompositionTargetReason;
}

/** A workspace id no registry entry uses, so composition fails closed on it. */
const UNRESOLVED_WORKSPACE = "__unresolved__";

function isEffective(relationship: PersistedRelationship, nowMs: number): boolean {
  const started = !relationship.effectiveDate || Date.parse(relationship.effectiveDate) <= nowMs;
  const notExpired = !relationship.expiryDate || Date.parse(relationship.expiryDate) > nowMs;
  return started && notExpired;
}

/**
 * Select the COMPOSITION care-circle role from an actor's relationships to a subject.
 *
 * Precedence comes from the Care Circle Registry's declaration order, and only roles that
 * declare a composition mapping are eligible — a role the registry has not said how to
 * compose is skipped rather than guessed at. Ties break on most-recently-effective, then
 * on relationship id, so the choice is deterministic.
 *
 * This is NOT the PDP's capacity selection: it never widens access, and the PDP resolves
 * its own capacity independently at the resource door.
 */
export function selectCompositionRole(
  relationships: PersistedRelationship[],
  nowMs: number
): { role: CareCircleRole; relationshipRef: string } | null {
  const candidates = relationships
    .filter((entry) => entry.status === "active" && isEffective(entry, nowMs))
    .map((entry) => ({
      entry,
      role: findCareCircleRoleByRelationshipType(entry.relationshipType)
    }))
    .filter(
      (candidate): candidate is { entry: PersistedRelationship; role: CareCircleRole } =>
        candidate.role !== undefined &&
        candidate.role.composesAsPersona !== null &&
        candidate.role.composesInWorkspace !== null
    );

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const priority =
      careCircleCompositionPriority(a.role.id) - careCircleCompositionPriority(b.role.id);
    if (priority !== 0) return priority;
    const aEffective = Date.parse(a.entry.effectiveDate ?? "") || 0;
    const bEffective = Date.parse(b.entry.effectiveDate ?? "") || 0;
    if (aEffective !== bEffective) return bEffective - aEffective;
    return a.entry.relationshipId.localeCompare(b.entry.relationshipId);
  });

  const best = candidates[0];
  return { role: best.role, relationshipRef: best.entry.relationshipId };
}

/**
 * Resolve which workspace + persona + subject the runtime composes for. Exported so the
 * surface and tool-contract reads share exactly one resolution — they cannot drift.
 */
export async function resolveCompositionTarget(
  ports: CompositionPorts,
  actingContext: ActingContext,
  subjectPersonRef?: string | null,
  now: () => Date = () => new Date()
): Promise<CompositionTarget> {
  const actorPersonRef = actingContext.identity.personId;
  const subjectRef = subjectPersonRef?.trim() || actorPersonRef;
  const subjectIsSelf = subjectRef === actorPersonRef;

  // An organization context that could not be typed composes nothing. Failing closed
  // here is what removes the old "organization === hospital" assumption.
  if (actingContext.workspaceId === null) {
    return {
      workspaceId: UNRESOLVED_WORKSPACE,
      personaId: actingContext.persona.actorRole,
      subject: { isSelf: subjectIsSelf, careCircleRoleId: null },
      subjectPersonRef: subjectRef,
      careCircleRoleId: null,
      reason: "workspace-untyped"
    };
  }

  // Acting on your own record, or acting inside an organization (where capacity comes
  // from the membership, not the relationship graph).
  if (subjectIsSelf || actingContext.workspace === "organization") {
    return {
      workspaceId: actingContext.workspaceId,
      personaId: actingContext.persona.actorRole,
      subject: { isSelf: subjectIsSelf, careCircleRoleId: null },
      subjectPersonRef: subjectRef,
      careCircleRoleId: null,
      reason: subjectIsSelf ? "self" : "delegated"
    };
  }

  // Personal workspace, acting for someone else: the relationship graph decides.
  const relationships = await ports.listActiveRelationshipsForActorPatient({
    actorRef: actingContext.identity.accountId,
    patientRef: subjectRef
  });
  const selected = selectCompositionRole(relationships, now().getTime());

  if (!selected) {
    return {
      workspaceId: UNRESOLVED_WORKSPACE,
      personaId: actingContext.persona.actorRole,
      subject: { isSelf: false, careCircleRoleId: null },
      subjectPersonRef: subjectRef,
      careCircleRoleId: null,
      reason: "subject-no-capacity"
    };
  }

  return {
    // Both are non-null by the filter in selectCompositionRole.
    workspaceId: selected.role.composesInWorkspace!,
    personaId: selected.role.composesAsPersona!,
    subject: { isSelf: false, careCircleRoleId: selected.role.id },
    subjectPersonRef: subjectRef,
    careCircleRoleId: selected.role.id,
    reason: "delegated"
  };
}

export interface RuntimeComposition<T> {
  target: CompositionTarget;
  composed: T;
}

/** Compose the full surface for an acting context and optional subject. */
export async function composeRuntimeSurface(
  ports: CompositionPorts,
  actingContext: ActingContext,
  subjectPersonRef?: string | null,
  now?: () => Date
): Promise<RuntimeComposition<ComposedSurface>> {
  const target = await resolveCompositionTarget(ports, actingContext, subjectPersonRef, now);
  return {
    target,
    composed: composeSurface(target.workspaceId, target.personaId, target.subject)
  };
}

/** Resolve the tool contract for an acting context, consumer surface, and subject. */
export async function resolveRuntimeToolContract(
  ports: CompositionPorts,
  actingContext: ActingContext,
  consumer: ConsumerSurface,
  subjectPersonRef?: string | null,
  now?: () => Date
): Promise<RuntimeComposition<ResolvedToolContract>> {
  const target = await resolveCompositionTarget(ports, actingContext, subjectPersonRef, now);
  return {
    target,
    composed: resolveToolContract(target.workspaceId, target.personaId, consumer, target.subject)
  };
}
