export type MembershipStatus = "invited" | "active" | "suspended" | "offboarded";

export interface RoleScope {
  roleCode: string;
  status: "active" | "suspended" | "revoked";
  facilityIds: string[];
}

export interface TenantMembershipDraft {
  membershipId: string;
  tenantId: string;
  status: MembershipStatus;
  roleScopes: RoleScope[];
}

export interface TenancyAccessDraft {
  accessRequestId: string;
  accountId: string;
  activeTenantId: string | null;
  requestedTenantId: string | null;
  requiredRoleCode: string;
  requestedFacilityId?: string;
  allowTenantSwitch: boolean;
  memberships: TenantMembershipDraft[];
  evaluatedAt: string;
}

export interface TenancyAccessDraftInput {
  accessRequestId: string;
  accountId: string;
  activeTenantId: string | null;
  requestedTenantId: string | null;
  requiredRoleCode: string;
  requestedFacilityId?: string;
  allowTenantSwitch: boolean;
  memberships: TenantMembershipDraft[];
  evaluatedAt: string;
}

export interface TenancyAccessDecisionDraft {
  accessRequestId: string;
  status: "allowed" | "challenge-required" | "denied";
  reasonCode:
    | "allowed"
    | "tenant-context-missing"
    | "tenant-membership-missing"
    | "membership-not-active"
    | "role-assignment-missing"
    | "role-assignment-not-active"
    | "facility-out-of-scope"
    | "tenant-switch-required";
  sessionTenantAction: "none" | "switch-tenant" | "revoke-session";
  resolvedTenantId: string | null;
  nextSteps: string[];
  evaluatedAt: string;
}

export interface MembershipLifecycleDecisionDraft {
  membershipId: string;
  tenantId: string;
  action: "accept-invitation" | "suspend-membership" | "offboard-membership";
  status: "applied" | "denied";
  reasonCode:
    | "applied"
    | "invitation-not-pending"
    | "membership-not-active"
    | "membership-already-offboarded";
  updatedStatus: MembershipStatus;
  sessionAction: "none" | "revoke-session";
  evaluatedAt: string;
}

export interface MembershipLifecycleDecisionInput {
  membershipId: string;
  tenantId: string;
  currentStatus: MembershipStatus;
  action: "accept-invitation" | "suspend-membership" | "offboard-membership";
  evaluatedAt: string;
}

export function createTenancyAccessDraft(input: TenancyAccessDraftInput): TenancyAccessDraft {
  return {
    accessRequestId: input.accessRequestId,
    accountId: input.accountId,
    activeTenantId: input.activeTenantId,
    requestedTenantId: input.requestedTenantId,
    requiredRoleCode: input.requiredRoleCode,
    requestedFacilityId: input.requestedFacilityId,
    allowTenantSwitch: input.allowTenantSwitch,
    memberships: input.memberships,
    evaluatedAt: input.evaluatedAt
  };
}
