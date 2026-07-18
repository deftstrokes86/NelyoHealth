export type IdentityId = string;
export type TenantId = string;

export interface Person {
  id: IdentityId;
  displayName: string;
  dateOfBirthIso?: string;
  primaryContactPointId?: IdentityId;
  primaryAddressId?: IdentityId;
}

export interface UserAccount {
  id: IdentityId;
  personId: IdentityId;
  loginEmail?: string;
  loginPhoneE164?: string;
  status: "pending" | "active" | "suspended" | "recovery-locked";
}

export interface ExternalIdentity {
  id: IdentityId;
  userAccountId: IdentityId;
  provider: "phone-otp" | "email-otp" | "oidc" | "saml" | "scim";
  externalSubject: string;
}

export interface ContactPoint {
  id: IdentityId;
  personId: IdentityId;
  kind: "email" | "phone";
  value: string;
  verified: boolean;
}

export interface Address {
  id: IdentityId;
  personId?: IdentityId;
  organizationId?: IdentityId;
  line1: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode?: string;
}

export interface Organization {
  id: TenantId;
  legalName: string;
  displayName: string;
  status: "active" | "suspended" | "offboarded";
}

export interface Facility {
  id: IdentityId;
  organizationId: TenantId;
  displayName: string;
  status: "active" | "suspended" | "offboarded";
}

export interface OrganizationMembership {
  id: IdentityId;
  organizationId: TenantId;
  personId: IdentityId;
  status: "invited" | "active" | "suspended" | "offboarded";
  activeRoleAssignmentIds: IdentityId[];
}

export interface RoleAssignment {
  id: IdentityId;
  organizationId: TenantId;
  facilityId?: IdentityId;
  membershipId: IdentityId;
  roleCode: string;
  status: "active" | "suspended" | "revoked";
}

export interface Invitation {
  id: IdentityId;
  organizationId: TenantId;
  invitedByPersonId: IdentityId;
  invitedEmail?: string;
  invitedPhoneE164?: string;
  roleCodes: string[];
  status: "pending" | "accepted" | "declined" | "expired" | "revoked";
}

export interface Session {
  id: IdentityId;
  userAccountId: IdentityId;
  activeTenantId?: TenantId;
  trustedDeviceId?: IdentityId;
  status: "active" | "expired" | "revoked";
  /** Step-up state: "primary" after first factor, "elevated" after MFA (additive M1.2). */
  authLevel?: "primary" | "elevated";
  /** Session expiry instant (additive M1.2; sessions are time-bounded). */
  expiresAtIso?: string;
}

export interface Device {
  id: IdentityId;
  userAccountId: IdentityId;
  displayName: string;
  trusted: boolean;
}

export interface AuthenticationEvent {
  id: IdentityId;
  userAccountId?: IdentityId;
  tenantId?: TenantId;
  result: "success" | "failure" | "challenge-required";
  method: "otp" | "password" | "mfa" | "recovery";
  reasonCode?: string;
}

export interface IdentityTenancyModel {
  person: Person;
  userAccount: UserAccount;
  externalIdentity: ExternalIdentity;
  contactPoint: ContactPoint;
  address: Address;
  organization: Organization;
  facility: Facility;
  organizationMembership: OrganizationMembership;
  roleAssignment: RoleAssignment;
  invitation: Invitation;
  session: Session;
  device: Device;
  authenticationEvent: AuthenticationEvent;
}

export const phase3IdentityTenancyModel = {
  entities: [
    "Person",
    "UserAccount",
    "ExternalIdentity",
    "ContactPoint",
    "Address",
    "Organization",
    "Facility",
    "OrganizationMembership",
    "RoleAssignment",
    "Invitation",
    "Session",
    "Device",
    "AuthenticationEvent"
  ]
} as const;

export type Phase3IdentityTenancyEntityName = (typeof phase3IdentityTenancyModel.entities)[number];
