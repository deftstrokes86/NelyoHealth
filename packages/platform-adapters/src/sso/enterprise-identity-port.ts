export type EnterpriseIdentityProtocol = "oidc" | "saml";

export interface EnterpriseIdentityAuthenticationStartRequest {
  tenantId: string;
  protocol: EnterpriseIdentityProtocol;
  requestedByAccountId: string;
  redirectUri: string;
  state: string;
}

export interface EnterpriseIdentityAuthenticationStartResult {
  protocol: EnterpriseIdentityProtocol;
  authorizationUrl: string;
  state: string;
}

export interface EnterpriseIdentityAuthenticationCompleteRequest {
  tenantId: string;
  protocol: EnterpriseIdentityProtocol;
  state: string;
  codeOrAssertion: string;
  redirectUri: string;
}

export interface EnterpriseIdentityAuthenticationCompleteResult {
  tenantId: string;
  protocol: EnterpriseIdentityProtocol;
  externalSubject: string;
  email?: string;
  displayName?: string;
  authenticationEvent: "authenticated" | "challenge-required" | "denied";
  reasonCode: "authenticated" | "state-mismatch" | "token-invalid" | "tenant-mismatch";
}

export interface JitProvisioningRequest {
  tenantId: string;
  externalSubject: string;
  email?: string;
  displayName?: string;
  targetRoleCodes: string[];
}

export interface JitProvisioningResult {
  tenantId: string;
  externalSubject: string;
  accountId: string;
  membershipId: string;
  status: "provisioned" | "existing-membership-updated";
}

export interface ScimUserUpsertRequest {
  tenantId: string;
  scimId: string;
  externalSubject: string;
  active: boolean;
  email?: string;
  displayName?: string;
  roleCodes: string[];
}

export interface ScimUserUpsertResult {
  tenantId: string;
  scimId: string;
  status: "upserted" | "deactivated";
  accountId: string;
}

export interface WorkforceRosterRecord {
  rosterId: string;
  externalSubject: string;
  email?: string;
  displayName?: string;
  roleCodes: string[];
  facilityIds: string[];
  active: boolean;
}

export interface WorkforceRosterImportRequest {
  tenantId: string;
  importBatchId: string;
  records: WorkforceRosterRecord[];
}

export interface WorkforceRosterImportResult {
  tenantId: string;
  importBatchId: string;
  imported: number;
  deactivated: number;
  skipped: number;
}

export interface EnterpriseIdentityPort {
  startAuthentication(
    request: EnterpriseIdentityAuthenticationStartRequest
  ): Promise<EnterpriseIdentityAuthenticationStartResult>;
  completeAuthentication(
    request: EnterpriseIdentityAuthenticationCompleteRequest
  ): Promise<EnterpriseIdentityAuthenticationCompleteResult>;
  provisionJustInTime(request: JitProvisioningRequest): Promise<JitProvisioningResult>;
  upsertScimUser(request: ScimUserUpsertRequest): Promise<ScimUserUpsertResult>;
  importWorkforceRoster(
    request: WorkforceRosterImportRequest
  ): Promise<WorkforceRosterImportResult>;
}

export function assertSafeEnterpriseTenantId(tenantId: string): void {
  if (!/^[a-z0-9-]{3,64}$/.test(tenantId)) {
    throw new Error(
      "Enterprise tenant ID must be 3-64 chars and contain lowercase letters, numbers, or hyphen."
    );
  }
}

export function assertSafeExternalSubject(externalSubject: string): void {
  if (!/^[A-Za-z0-9._:@-]{3,128}$/.test(externalSubject)) {
    throw new Error(
      "External subject must be 3-128 chars and contain letters, numbers, dot, underscore, colon, at-sign, or hyphen."
    );
  }
}
