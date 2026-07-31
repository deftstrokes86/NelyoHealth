import registryData from "./scope-registry.data.json" with { type: "json" };

/**
 * The Scope Registry (roadmap M8.2, AM-7).
 *
 * The single source of truth for which persistence tables are SCOPE-OWNED (belong to
 * a bounded scope, e.g. an organization) versus intentionally global. Both the runtime
 * tenant-scope guard (`scope-guard.ts`) and the CI construction gate
 * (`tools/checks/tenant-scope-coverage-gate.mjs`) read the same data
 * (`scope-registry.data.json`) so "what is tenant-owned" is declared exactly once.
 *
 * Extensible by design: a table declares a LIST of `scopes` (each a scopeType + the
 * soft-ref column that carries it), so future scope types — facility, department,
 * care-circle, household, employer, insurer, government-region, research-cohort — are
 * additive. `organization` is the only live scopeType today; the abstraction does not
 * bake it in.
 */

/**
 * A bounded scope a resource can belong to. Only `organization` is live today; the
 * union is intentionally open to the reserved future scope types so adding one is a
 * type-level addition, not a redesign.
 */
export type ScopeType =
  | "organization"
  | "facility"
  | "department"
  | "care-circle"
  | "household"
  | "employer"
  | "insurer"
  | "government-region"
  | "research-cohort";

/** One scope a table is owned by: the scope type + the soft-ref column that carries it. */
export interface ScopeBinding {
  type: ScopeType;
  /** The FK-less soft-reference column (context isolation), e.g. `organization_ref`. */
  column: string;
}

/** A child table that inherits its scope from a parent aggregate via a foreign key. */
export interface ParentScope {
  schema: string;
  table: string;
  /** The column on the child that references the parent's primary key. */
  foreignKey: string;
}

/** A scope-owned persistence table. */
export interface ScopeOwnedTable {
  schema: string;
  table: string;
  primaryKey: readonly string[];
  /** ≥1 for an aggregate of record; empty for a child table (see `parent`). */
  scopes: readonly ScopeBinding[];
  /** Present iff this is a child table scoped through a parent aggregate. */
  parent?: ParentScope;
}

const TABLES = registryData.tables as readonly ScopeOwnedTable[];

/** Every scope-owned table (aggregates of record + their scoped-via-parent children). */
export const SCOPE_OWNED_TABLES: readonly ScopeOwnedTable[] = TABLES;

/** The scope types that are live today (vs reserved for future expansion). */
export const LIVE_SCOPE_TYPES: readonly ScopeType[] = registryData.scopeTypes
  .live as readonly ScopeType[];

const BY_QUALIFIED_NAME = new Map<string, ScopeOwnedTable>(
  TABLES.map((entry) => [`${entry.schema}.${entry.table}`, entry])
);

/** The registry entry for a `schema.table`, or undefined if the table is global. */
export function findScopeOwnedTable(schema: string, table: string): ScopeOwnedTable | undefined {
  return BY_QUALIFIED_NAME.get(`${schema}.${table}`);
}

/** Whether a `schema.table` is scope-owned (i.e. must carry a scope predicate). */
export function isScopeOwned(schema: string, table: string): boolean {
  return BY_QUALIFIED_NAME.has(`${schema}.${table}`);
}
