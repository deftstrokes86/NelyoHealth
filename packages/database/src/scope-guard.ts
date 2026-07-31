import type { ScopeType } from "./scope-registry.js";

/**
 * Runtime tenant-scope guard (roadmap M8.2, AM-7).
 *
 * The fail-closed runtime companion to the Scope Registry + the CI construction gate.
 * It exists so the repository layer can prove — INDEPENDENTLY of the PDP — that a
 * scope-owned query runs only within a concrete scope, and that a scoped mutation
 * actually landed in the expected scope. Responsibilities stay separate: the PDP
 * decides WHETHER access is permitted; this guard enforces WHERE data may be touched.
 * It is not an authorization engine — it neither loads policy nor evaluates roles.
 *
 * Generalized over `ScopeType` (organization is the only live type today) so the belt
 * extends to future scopes without a rewrite.
 */

/** A resolved scope constraint: a bounded scope type + the concrete ref to filter on. */
export interface ScopeRef {
  readonly type: ScopeType;
  readonly ref: string;
}

/** Raised when a scope-owned query is about to run outside a concrete, matching scope. */
export class ScopeIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScopeIntegrityError";
  }
}

/**
 * Fail-closed: a scope-owned query must carry a concrete, non-blank scope ref. Returns
 * the ref for direct use as a query parameter. A missing/blank ref throws rather than
 * silently running an unscoped (cross-tenant) query.
 */
export function requireScopeRef(
  type: ScopeType,
  ref: string | null | undefined,
  context: string
): string {
  if (ref == null || ref.trim() === "") {
    throw new ScopeIntegrityError(
      `${context}: refusing a ${type}-scoped query without a concrete ${type} scope`
    );
  }
  return ref;
}

/** Ergonomic wrapper for the only live scope type. */
export function requireOrganizationScope(
  organizationRef: string | null | undefined,
  context: string
): string {
  return requireScopeRef("organization", organizationRef, context);
}

/**
 * Fail-closed for scoped WRITES: a scoped UPDATE/DELETE that matched no row means the
 * addressed resource is not in the expected scope. Because the PDP has already allowed
 * the action, a zero-row result is a persistence-integrity violation (the two layers
 * disagree on ownership), not a benign not-found — so it throws. Scoped READS, by
 * contrast, return null/empty (the caller surfaces a uniform not-found — non-
 * enumeration), so reads do NOT use this.
 */
export function assertScopedMutation(rowCount: number | null | undefined, context: string): void {
  if ((rowCount ?? 0) === 0) {
    throw new ScopeIntegrityError(
      `${context}: scoped mutation matched no row in the expected scope (persistence-integrity violation)`
    );
  }
}
