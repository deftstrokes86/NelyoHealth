import type { Pool } from "pg";
import type {
  Organization,
  OrganizationMembership,
  RoleAssignment,
  Session,
  UserAccount
} from "@nelyohealth/domain";
import {
  getOrganizationById,
  getSessionById,
  getUserAccountById,
  listMembershipsForPerson,
  listRoleAssignmentsForMembership
} from "@nelyohealth/database";
import type { RoleScope, TenancyAccessDecisionDraft, TenantMembershipDraft } from "./tenancy.js";
import { createTenancyAccessDraft } from "./tenancy.js";
import { evaluateTenancyAccessDecision } from "./tenancy-handlers.js";

/**
 * ActingContext resolver (roadmap M2.2).
 *
 * The request lifecycle is Authenticate -> Resolve ActingContext -> Authorize
 * -> Execute -> Dispatch. This module is the second step: it DERIVES the
 * ActingContext from persisted identity, session, and tenancy state. Nothing
 * here is persisted — ActingContext, Persona, and Workspace are computed each
 * request (derive-don't-persist).
 *
 * It also owns the validation of session.active_tenant_id, which M2.1 left as
 * a soft reference precisely so the Identity context would not hold a
 * persistence-level dependency on the Tenancy context. A session may claim an
 * active tenant that has since been revoked, offboarded, or lost its
 * membership; the resolver checks the claim against the Tenancy context and
 * degrades to the Personal workspace when it no longer holds.
 *
 * Ports are injectable for unit tests; createPgActingContextPorts wires the
 * production implementations from @nelyohealth/database.
 */

export type WorkspaceKind = "personal" | "organization";
export type ResolvedSessionStatus = "active" | "stale" | "revoked";

export interface ResolvedPersona {
  /** Personal = self-capacity; Organization = acting within a tenant. */
  kind: WorkspaceKind;
  /** Primary capacity: "patient" in Personal, the primary active role otherwise. */
  actorRole: string;
  /** All active role codes held in the active tenant (empty in Personal). */
  actorRoles: string[];
}

export interface ActingContext {
  identity: { accountId: string; personId: string };
  sessionId: string;
  sessionStatus: ResolvedSessionStatus;
  authLevel: "primary" | "elevated";
  /** Validated active tenant; null once the claim no longer holds (Personal). */
  activeTenantId: string | null;
  /** Whether the session's claimed active tenant survived validation. */
  activeTenantValid: boolean;
  /** Why an active-tenant claim was rejected, when applicable. */
  activeTenantReasonCode:
    | "personal-context"
    | "tenant-valid"
    | "tenant-not-found"
    | "tenant-not-active"
    | "membership-missing"
    | "membership-not-active";
  workspace: WorkspaceKind;
  persona: ResolvedPersona;
  /** Derived read model of every tenant membership the person holds. */
  memberships: TenantMembershipDraft[];
  resolvedAt: string;
}

export interface ActingContextPorts {
  getUserAccountById(accountId: string): Promise<UserAccount | null>;
  getSessionById(sessionId: string): Promise<Session | null>;
  listMembershipsForPerson(personId: string): Promise<OrganizationMembership[]>;
  listRoleAssignmentsForMembership(membershipId: string): Promise<RoleAssignment[]>;
  getOrganizationById(tenantId: string): Promise<Organization | null>;
}

export function createPgActingContextPorts(pool: Pool): ActingContextPorts {
  const withClient = async <T>(fn: (client: import("pg").PoolClient) => Promise<T>): Promise<T> => {
    const client = await pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  };
  return {
    getUserAccountById: (accountId) => withClient((c) => getUserAccountById(c, accountId)),
    getSessionById: (sessionId) => withClient((c) => getSessionById(c, sessionId)),
    listMembershipsForPerson: (personId) =>
      withClient((c) => listMembershipsForPerson(c, personId)),
    listRoleAssignmentsForMembership: (membershipId) =>
      withClient((c) => listRoleAssignmentsForMembership(c, membershipId)),
    getOrganizationById: (tenantId) => withClient((c) => getOrganizationById(c, tenantId))
  };
}

/** Groups role assignments into one RoleScope per role code (facilities unioned). */
function toRoleScopes(assignments: RoleAssignment[]): RoleScope[] {
  const byCode = new Map<string, RoleScope>();
  for (const assignment of assignments) {
    let scope = byCode.get(assignment.roleCode);
    if (!scope) {
      scope = { roleCode: assignment.roleCode, status: assignment.status, facilityIds: [] };
      byCode.set(assignment.roleCode, scope);
    }
    // An active assignment wins the scope status.
    if (assignment.status === "active") {
      scope.status = "active";
    }
    if (assignment.facilityId && !scope.facilityIds.includes(assignment.facilityId)) {
      scope.facilityIds.push(assignment.facilityId);
    }
  }
  return [...byCode.values()];
}

function resolveSessionStatus(session: Session, now: Date): ResolvedSessionStatus {
  if (session.status === "revoked") return "revoked";
  if (session.status === "expired") return "stale";
  if (session.expiresAtIso && Date.parse(session.expiresAtIso) <= now.getTime()) {
    return "stale";
  }
  return "active";
}

export interface ResolveActingContextInput {
  accountId: string;
  sessionId: string;
  now?: () => Date;
}

/**
 * Resolve the derived ActingContext for an authenticated account + session.
 * Throws only when the account cannot be found (a caller invariant: this runs
 * after authentication). A missing/expired/revoked session degrades safely to
 * a non-active sessionStatus rather than throwing.
 */
export async function resolveActingContext(
  ports: ActingContextPorts,
  input: ResolveActingContextInput
): Promise<ActingContext> {
  const now = input.now?.() ?? new Date();
  const account = await ports.getUserAccountById(input.accountId);
  if (!account) {
    throw new Error(`ActingContext resolution failed: account ${input.accountId} not found.`);
  }

  const session = await ports.getSessionById(input.sessionId);
  const sessionStatus: ResolvedSessionStatus = session
    ? resolveSessionStatus(session, now)
    : "revoked";
  const authLevel = session?.authLevel ?? "primary";
  const claimedTenantId = session?.activeTenantId ?? null;

  // Derive the membership read model across all tenants the person belongs to.
  const membershipRows = await ports.listMembershipsForPerson(account.personId);
  const memberships: TenantMembershipDraft[] = [];
  for (const membership of membershipRows) {
    const assignments = await ports.listRoleAssignmentsForMembership(membership.id);
    memberships.push({
      membershipId: membership.id,
      tenantId: membership.organizationId,
      status: membership.status,
      roleScopes: toRoleScopes(assignments)
    });
  }

  // Validate the session's active-tenant claim against the Tenancy context.
  let activeTenantId: string | null = null;
  let activeTenantValid = false;
  let activeTenantReasonCode: ActingContext["activeTenantReasonCode"] = "personal-context";

  if (claimedTenantId) {
    const membership = memberships.find((candidate) => candidate.tenantId === claimedTenantId);
    if (!membership) {
      activeTenantReasonCode = "membership-missing";
    } else if (membership.status !== "active") {
      activeTenantReasonCode = "membership-not-active";
    } else {
      const organization = await ports.getOrganizationById(claimedTenantId);
      if (!organization) {
        activeTenantReasonCode = "tenant-not-found";
      } else if (organization.status !== "active") {
        activeTenantReasonCode = "tenant-not-active";
      } else {
        activeTenantId = claimedTenantId;
        activeTenantValid = true;
        activeTenantReasonCode = "tenant-valid";
      }
    }
  }

  const workspace: WorkspaceKind = activeTenantId ? "organization" : "personal";
  const persona = resolvePersona(workspace, activeTenantId, memberships);

  return {
    identity: { accountId: account.id, personId: account.personId },
    sessionId: input.sessionId,
    sessionStatus,
    authLevel,
    activeTenantId,
    activeTenantValid,
    activeTenantReasonCode,
    workspace,
    persona,
    memberships,
    resolvedAt: now.toISOString()
  };
}

function resolvePersona(
  workspace: WorkspaceKind,
  activeTenantId: string | null,
  memberships: TenantMembershipDraft[]
): ResolvedPersona {
  if (workspace === "personal" || !activeTenantId) {
    return { kind: "personal", actorRole: "patient", actorRoles: ["patient"] };
  }
  const membership = memberships.find((candidate) => candidate.tenantId === activeTenantId);
  const actorRoles = (membership?.roleScopes ?? [])
    .filter((scope) => scope.status === "active")
    .map((scope) => scope.roleCode);
  return {
    kind: "organization",
    // Fall back to "member" when the membership carries no active role yet.
    actorRole: actorRoles[0] ?? "member",
    actorRoles
  };
}

export interface ResolveTenancyAccessInput {
  accountId: string;
  sessionId: string;
  accessRequestId: string;
  requestedTenantId: string | null;
  requiredRoleCode: string;
  requestedFacilityId?: string;
  allowTenantSwitch: boolean;
  now?: () => Date;
}

export interface ResolveTenancyAccessResult {
  actingContext: ActingContext;
  decision: TenancyAccessDecisionDraft;
}

/**
 * Resolve the ActingContext and evaluate tenancy-scoped access for a specific
 * requested tenant/role/facility — the seam that feeds the M2.3 authorization
 * decision point. The tenancy decision logic itself is unchanged
 * (evaluateTenancyAccessDecision); this only supplies it derived, persisted
 * inputs.
 */
export async function resolveTenancyAccess(
  ports: ActingContextPorts,
  input: ResolveTenancyAccessInput
): Promise<ResolveTenancyAccessResult> {
  const actingContext = await resolveActingContext(ports, {
    accountId: input.accountId,
    sessionId: input.sessionId,
    now: input.now
  });

  const draft = createTenancyAccessDraft({
    accessRequestId: input.accessRequestId,
    accountId: actingContext.identity.accountId,
    activeTenantId: actingContext.activeTenantId,
    requestedTenantId: input.requestedTenantId,
    requiredRoleCode: input.requiredRoleCode,
    requestedFacilityId: input.requestedFacilityId,
    allowTenantSwitch: input.allowTenantSwitch,
    memberships: actingContext.memberships,
    evaluatedAt: actingContext.resolvedAt
  });

  return {
    actingContext,
    decision: evaluateTenancyAccessDecision({ access: draft })
  };
}
