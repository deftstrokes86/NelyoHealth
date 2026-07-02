import {
  type MembershipLifecycleDecisionDraft,
  type MembershipLifecycleDecisionInput,
  type TenancyAccessDecisionDraft,
  type TenancyAccessDraft
} from "./tenancy.js";

export interface EvaluateTenancyAccessDecisionInput {
  access: TenancyAccessDraft;
}

export function evaluateTenancyAccessDecision(
  input: EvaluateTenancyAccessDecisionInput
): TenancyAccessDecisionDraft {
  const { access } = input;

  if (!access.requestedTenantId) {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "tenant-context-missing",
      sessionTenantAction: "none",
      resolvedTenantId: null,
      nextSteps: ["select-tenant-context"],
      evaluatedAt: access.evaluatedAt
    };
  }

  const membership = access.memberships.find(
    (candidate) => candidate.tenantId === access.requestedTenantId
  );

  if (!membership) {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "tenant-membership-missing",
      sessionTenantAction: "none",
      resolvedTenantId: null,
      nextSteps: ["request-organization-invitation"],
      evaluatedAt: access.evaluatedAt
    };
  }

  if (membership.status !== "active") {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "membership-not-active",
      sessionTenantAction:
        membership.status === "offboarded" ? "revoke-session" : "none",
      resolvedTenantId: membership.tenantId,
      nextSteps:
        membership.status === "invited"
          ? ["accept-invitation"]
          : ["contact-organization-administrator"],
      evaluatedAt: access.evaluatedAt
    };
  }

  const roleScope = membership.roleScopes.find(
    (candidate) => candidate.roleCode === access.requiredRoleCode
  );

  if (!roleScope) {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "role-assignment-missing",
      sessionTenantAction: "none",
      resolvedTenantId: membership.tenantId,
      nextSteps: ["request-role-assignment"],
      evaluatedAt: access.evaluatedAt
    };
  }

  if (roleScope.status !== "active") {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "role-assignment-not-active",
      sessionTenantAction: "none",
      resolvedTenantId: membership.tenantId,
      nextSteps: ["contact-organization-administrator"],
      evaluatedAt: access.evaluatedAt
    };
  }

  if (
    access.requestedFacilityId &&
    !roleScope.facilityIds.includes(access.requestedFacilityId)
  ) {
    return {
      accessRequestId: access.accessRequestId,
      status: "denied",
      reasonCode: "facility-out-of-scope",
      sessionTenantAction: "none",
      resolvedTenantId: membership.tenantId,
      nextSteps: ["switch-facility-context", "request-facility-scope"],
      evaluatedAt: access.evaluatedAt
    };
  }

  if (access.activeTenantId !== access.requestedTenantId && !access.allowTenantSwitch) {
    return {
      accessRequestId: access.accessRequestId,
      status: "challenge-required",
      reasonCode: "tenant-switch-required",
      sessionTenantAction: "none",
      resolvedTenantId: access.requestedTenantId,
      nextSteps: ["confirm-tenant-switch"],
      evaluatedAt: access.evaluatedAt
    };
  }

  return {
    accessRequestId: access.accessRequestId,
    status: "allowed",
    reasonCode: "allowed",
    sessionTenantAction:
      access.activeTenantId === access.requestedTenantId ? "none" : "switch-tenant",
    resolvedTenantId: access.requestedTenantId,
    nextSteps: ["proceed"],
    evaluatedAt: access.evaluatedAt
  };
}

export function evaluateMembershipLifecycleDecision(
  input: MembershipLifecycleDecisionInput
): MembershipLifecycleDecisionDraft {
  if (input.action === "accept-invitation") {
    if (input.currentStatus !== "invited") {
      return {
        membershipId: input.membershipId,
        tenantId: input.tenantId,
        action: input.action,
        status: "denied",
        reasonCode: "invitation-not-pending",
        updatedStatus: input.currentStatus,
        sessionAction: "none",
        evaluatedAt: input.evaluatedAt
      };
    }

    return {
      membershipId: input.membershipId,
      tenantId: input.tenantId,
      action: input.action,
      status: "applied",
      reasonCode: "applied",
      updatedStatus: "active",
      sessionAction: "none",
      evaluatedAt: input.evaluatedAt
    };
  }

  if (input.action === "suspend-membership") {
    if (input.currentStatus !== "active") {
      return {
        membershipId: input.membershipId,
        tenantId: input.tenantId,
        action: input.action,
        status: "denied",
        reasonCode: "membership-not-active",
        updatedStatus: input.currentStatus,
        sessionAction: "none",
        evaluatedAt: input.evaluatedAt
      };
    }

    return {
      membershipId: input.membershipId,
      tenantId: input.tenantId,
      action: input.action,
      status: "applied",
      reasonCode: "applied",
      updatedStatus: "suspended",
      sessionAction: "revoke-session",
      evaluatedAt: input.evaluatedAt
    };
  }

  if (input.currentStatus === "offboarded") {
    return {
      membershipId: input.membershipId,
      tenantId: input.tenantId,
      action: input.action,
      status: "denied",
      reasonCode: "membership-already-offboarded",
      updatedStatus: "offboarded",
      sessionAction: "none",
      evaluatedAt: input.evaluatedAt
    };
  }

  return {
    membershipId: input.membershipId,
    tenantId: input.tenantId,
    action: input.action,
    status: "applied",
    reasonCode: "applied",
    updatedStatus: "offboarded",
    sessionAction: "revoke-session",
    evaluatedAt: input.evaluatedAt
  };
}
