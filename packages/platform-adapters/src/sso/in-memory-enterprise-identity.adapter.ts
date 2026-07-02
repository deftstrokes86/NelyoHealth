import {
  assertSafeEnterpriseTenantId,
  assertSafeExternalSubject,
  type EnterpriseIdentityAuthenticationCompleteRequest,
  type EnterpriseIdentityAuthenticationCompleteResult,
  type EnterpriseIdentityAuthenticationStartRequest,
  type EnterpriseIdentityAuthenticationStartResult,
  type EnterpriseIdentityPort,
  type JitProvisioningRequest,
  type JitProvisioningResult,
  type ScimUserUpsertRequest,
  type ScimUserUpsertResult,
  type WorkforceRosterImportRequest,
  type WorkforceRosterImportResult
} from "./enterprise-identity-port.js";

interface StoredIdentityRecord {
  accountId: string;
  membershipId: string;
  email?: string;
  displayName?: string;
  active: boolean;
}

export class InMemoryEnterpriseIdentityAdapter implements EnterpriseIdentityPort {
  private readonly stateByTenant = new Map<string, string>();
  private readonly identitiesByTenant = new Map<string, Map<string, StoredIdentityRecord>>();

  async startAuthentication(
    request: EnterpriseIdentityAuthenticationStartRequest
  ): Promise<EnterpriseIdentityAuthenticationStartResult> {
    assertSafeEnterpriseTenantId(request.tenantId);
    this.stateByTenant.set(request.tenantId, request.state);

    return {
      protocol: request.protocol,
      authorizationUrl: `${request.redirectUri}?tenant=${request.tenantId}&protocol=${request.protocol}&state=${request.state}`,
      state: request.state
    };
  }

  async completeAuthentication(
    request: EnterpriseIdentityAuthenticationCompleteRequest
  ): Promise<EnterpriseIdentityAuthenticationCompleteResult> {
    assertSafeEnterpriseTenantId(request.tenantId);
    const expectedState = this.stateByTenant.get(request.tenantId);

    if (!expectedState || expectedState !== request.state) {
      return {
        tenantId: request.tenantId,
        protocol: request.protocol,
        externalSubject: "",
        authenticationEvent: "denied",
        reasonCode: "state-mismatch"
      };
    }

    const externalSubject = request.codeOrAssertion;
    assertSafeExternalSubject(externalSubject);
    const record = this.identitiesByTenant
      .get(request.tenantId)
      ?.get(externalSubject);

    return {
      tenantId: request.tenantId,
      protocol: request.protocol,
      externalSubject,
      email: record?.email,
      displayName: record?.displayName,
      authenticationEvent: "authenticated",
      reasonCode: "authenticated"
    };
  }

  async provisionJustInTime(request: JitProvisioningRequest): Promise<JitProvisioningResult> {
    assertSafeEnterpriseTenantId(request.tenantId);
    assertSafeExternalSubject(request.externalSubject);

    const tenantMap = this.getOrCreateTenantMap(request.tenantId);
    const existing = tenantMap.get(request.externalSubject);
    if (existing) {
      existing.email = request.email ?? existing.email;
      existing.displayName = request.displayName ?? existing.displayName;
      existing.active = true;
      return {
        tenantId: request.tenantId,
        externalSubject: request.externalSubject,
        accountId: existing.accountId,
        membershipId: existing.membershipId,
        status: "existing-membership-updated"
      };
    }

    const accountId = `account-${request.tenantId}-${tenantMap.size + 1}`;
    const membershipId = `membership-${request.tenantId}-${tenantMap.size + 1}`;
    tenantMap.set(request.externalSubject, {
      accountId,
      membershipId,
      email: request.email,
      displayName: request.displayName,
      active: true
    });

    return {
      tenantId: request.tenantId,
      externalSubject: request.externalSubject,
      accountId,
      membershipId,
      status: "provisioned"
    };
  }

  async upsertScimUser(request: ScimUserUpsertRequest): Promise<ScimUserUpsertResult> {
    assertSafeEnterpriseTenantId(request.tenantId);
    assertSafeExternalSubject(request.externalSubject);

    const tenantMap = this.getOrCreateTenantMap(request.tenantId);
    const existing = tenantMap.get(request.externalSubject);
    if (existing) {
      existing.email = request.email ?? existing.email;
      existing.displayName = request.displayName ?? existing.displayName;
      existing.active = request.active;
      return {
        tenantId: request.tenantId,
        scimId: request.scimId,
        status: request.active ? "upserted" : "deactivated",
        accountId: existing.accountId
      };
    }

    const accountId = `account-${request.tenantId}-${tenantMap.size + 1}`;
    const membershipId = `membership-${request.tenantId}-${tenantMap.size + 1}`;
    tenantMap.set(request.externalSubject, {
      accountId,
      membershipId,
      email: request.email,
      displayName: request.displayName,
      active: request.active
    });

    return {
      tenantId: request.tenantId,
      scimId: request.scimId,
      status: request.active ? "upserted" : "deactivated",
      accountId
    };
  }

  async importWorkforceRoster(
    request: WorkforceRosterImportRequest
  ): Promise<WorkforceRosterImportResult> {
    assertSafeEnterpriseTenantId(request.tenantId);

    let imported = 0;
    let deactivated = 0;
    let skipped = 0;

    for (const record of request.records) {
      if (!record.externalSubject) {
        skipped += 1;
        continue;
      }

      const result = await this.upsertScimUser({
        tenantId: request.tenantId,
        scimId: record.rosterId,
        externalSubject: record.externalSubject,
        active: record.active,
        email: record.email,
        displayName: record.displayName,
        roleCodes: record.roleCodes
      });

      if (result.status === "deactivated") {
        deactivated += 1;
      } else {
        imported += 1;
      }
    }

    return {
      tenantId: request.tenantId,
      importBatchId: request.importBatchId,
      imported,
      deactivated,
      skipped
    };
  }

  private getOrCreateTenantMap(tenantId: string): Map<string, StoredIdentityRecord> {
    const existing = this.identitiesByTenant.get(tenantId);
    if (existing) {
      return existing;
    }

    const created = new Map<string, StoredIdentityRecord>();
    this.identitiesByTenant.set(tenantId, created);
    return created;
  }
}
