import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import {
  createDatabaseClient,
  createMembership,
  createOrganization,
  createPerson,
  assignRole,
  createSession,
  createUserAccount,
  insertRelationship,
  updateMembershipStatus
} from "../../packages/database/src/index.js";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

/**
 * M8.3e runtime composition over REAL HTTP (roadmap M8.3e).
 *
 * The unit suite proves the composition rules; this proves the whole pipeline —
 * authenticate -> resolve ActingContext -> resolve composition target -> compose ->
 * project -> envelope — actually runs end to end against a live database and a live Nest
 * application, over `fetch`.
 *
 * Covered: GET /api/me/surface, GET /api/me/tools, persona switching, subject switching,
 * organization-type switching, Care Circle composition, and Diaspora composition.
 *
 * Requires Postgres: run with NELYO_RUN_DB_INTEGRATION=1 (skipped otherwise), exactly
 * like every other integration spec in this directory.
 */
describe.skipIf(!shouldRun)("runtime surface HTTP (M8.3e)", () => {
  const client = createDatabaseClient();
  const run = `m83e-${Date.now()}`;
  let app: NestApiApp | undefined;
  let port = 0;

  // The actor: one person, several capacities.
  let actorPersonId = "";
  let actorAccountId = "";
  let personalSessionId = "";

  // Subjects the actor may act for.
  let wardPersonId = "";
  let sponsoredPersonId = "";
  let strangerPersonId = "";

  // Organization sessions (same actor, different active tenant).
  let hospitalSessionId = "";
  let pharmacySessionId = "";
  let untypedOrgSessionId = "";

  function get(path: string, token: string): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  async function surface(path: string, token: string) {
    const response = await get(path, token);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { data: Record<string, unknown> };
    return body.data;
  }

  /** Give the actor an active membership + role in an organization, and a session on it. */
  async function joinOrganization(
    organizationType: string,
    roleCode: string,
    label: string
  ): Promise<string> {
    const org = await createOrganization(client, {
      legalName: `${run} ${label} Ltd`,
      displayName: `${run} ${label}`,
      ...(organizationType ? { organizationType: organizationType as never } : {})
    });
    const membership = await createMembership(client, {
      organizationId: org.id,
      personId: actorPersonId,
      status: "active"
    });
    await updateMembershipStatus(client, membership.id, "active");
    await assignRole(client, {
      organizationId: org.id,
      membershipId: membership.id,
      roleCode,
      status: "active"
    });
    const session = await createSession(client, {
      userAccountId: actorAccountId,
      expiresAtIso: new Date(Date.now() + 300_000).toISOString(),
      activeTenantId: org.id
    });
    return session.id;
  }

  async function relate(patientRef: string, relationshipType: string): Promise<void> {
    await insertRelationship(client, {
      relationshipId: randomUUID(),
      actorRef: actorAccountId,
      patientRef,
      organizationRef: (
        await createOrganization(client, {
          legalName: `${run} rel ${relationshipType} Ltd`,
          displayName: `${run} rel ${relationshipType}`
        })
      ).id,
      relationshipType,
      status: "active",
      verificationMethod: "legal-document",
      effectiveDate: new Date(Date.now() - 86_400_000).toISOString(),
      permittedActions: ["read"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  beforeAll(async () => {
    await client.connect();

    const actor = await createPerson(client, { displayName: `${run}-actor` });
    actorPersonId = actor.id;
    const account = await createUserAccount(client, {
      personId: actorPersonId,
      loginEmail: `${run}-actor@example.test`,
      status: "active"
    });
    actorAccountId = account.id;
    personalSessionId = (
      await createSession(client, {
        userAccountId: actorAccountId,
        expiresAtIso: new Date(Date.now() + 300_000).toISOString()
      })
    ).id;

    wardPersonId = (await createPerson(client, { displayName: `${run}-ward` })).id;
    sponsoredPersonId = (await createPerson(client, { displayName: `${run}-sponsored` })).id;
    strangerPersonId = (await createPerson(client, { displayName: `${run}-stranger` })).id;

    await relate(wardPersonId, "guardian");
    await relate(sponsoredPersonId, "sponsor");

    hospitalSessionId = await joinOrganization("hospital", "clinician", "Hospital");
    pharmacySessionId = await joinOrganization("pharmacy", "pharmacist", "Pharmacy");
    // An organization row predating migration 0025 defaults to hospital; to exercise the
    // untyped path we use a role the registry has no persona for instead.
    untypedOrgSessionId = await joinOrganization("hospital", "unmapped-role", "Unmapped");

    app = await createNestApiApp();
    await app.listen(0, "127.0.0.1");
    port = (app.getHttpServer().address() as AddressInfo).port;
  }, 120_000);

  afterAll(async () => {
    await app?.close();
    await client.end();
  });

  it("GET /api/me/surface composes the caller's own personal surface", async () => {
    const data = await surface("/api/me/surface", personalSessionId);
    expect(data).toMatchObject({
      workspaceId: "personal",
      personaId: "patient",
      subjectRef: actorPersonId,
      subjectIsSelf: true,
      careCircleRoleId: null,
      active: true,
      landingDashboardId: "patient-home"
    });
    const navigation = data.navigation as { id: string }[];
    expect(navigation.map((item) => item.id)).toContain("appointments");
    expect((data.capabilities as string[]).length).toBeGreaterThan(0);
    expect((data.search as { id: string }[]).map((s) => s.id)).toContain("my-appointments");
  });

  it("GET /api/me/tools resolves per consumer surface over HTTP", async () => {
    const ui = await surface("/api/me/tools?consumer=ui", personalSessionId);
    const ai = await surface("/api/me/tools?consumer=ai", personalSessionId);

    const uiTools = (ui.available as { id: string }[]).map((t) => t.id);
    const aiTools = (ai.available as { id: string }[]).map((t) => t.id);
    expect(uiTools).toContain("send-message");
    // send-message declares no AI support, so the AI consumer is told why.
    expect(aiTools).not.toContain("send-message");
    expect(ai.unavailable).toContainEqual({
      toolId: "send-message",
      reason: "surface-unsupported"
    });
    // An AI-offered write is always approval-gated.
    for (const tool of ai.available as { effect: string; requiresApproval: boolean }[]) {
      if (tool.effect === "write") expect(tool.requiresApproval).toBe(true);
    }
  });

  it("switches persona and workspace when the session's active tenant changes", async () => {
    const hospital = await surface("/api/me/surface", hospitalSessionId);
    expect(hospital).toMatchObject({
      workspaceId: "hospital",
      personaId: "clinician",
      landingDashboardId: "clinician-home"
    });

    const pharmacy = await surface("/api/me/surface", pharmacySessionId);
    expect(pharmacy).toMatchObject({
      workspaceId: "pharmacy",
      personaId: "pharmacist",
      landingDashboardId: "pharmacy-home"
    });

    // Same person, same account — only the organization changed.
    expect(hospital.subjectRef).toBe(pharmacy.subjectRef);
    const hospitalNav = (hospital.navigation as { id: string }[]).map((i) => i.id);
    const pharmacyNav = (pharmacy.navigation as { id: string }[]).map((i) => i.id);
    expect(hospitalNav).toContain("org-clinical");
    expect(pharmacyNav).toContain("pharmacy-dispensing");
    expect(pharmacyNav).not.toContain("org-clinical");
  });

  it("switches composition by SUBJECT: self vs ward (Care Circle)", async () => {
    const self = await surface("/api/me/surface", personalSessionId);
    const ward = await surface(`/api/me/surface?subject=${wardPersonId}`, personalSessionId);

    expect(ward).toMatchObject({
      workspaceId: "personal",
      personaId: "guardian",
      careCircleRoleId: "guardian",
      subjectRef: wardPersonId,
      subjectIsSelf: false,
      active: true
    });

    // Acting for another narrows: a strict subset of the self capability set.
    const selfCaps = self.capabilities as string[];
    const wardCaps = ward.capabilities as string[];
    expect(wardCaps.length).toBeLessThan(selfCaps.length);
    expect(wardCaps.every((id) => selfCaps.includes(id))).toBe(true);
  });

  it("composes the Diaspora sponsor surface for a sponsored person", async () => {
    const sponsored = await surface(
      `/api/me/surface?subject=${sponsoredPersonId}`,
      personalSessionId
    );
    expect(sponsored).toMatchObject({
      workspaceId: "diaspora-household",
      personaId: "diaspora-sponsor",
      careCircleRoleId: "diaspora-sponsor",
      subjectIsSelf: false,
      active: true,
      landingDashboardId: "sponsor-home"
    });
    expect((sponsored.navigation as { id: string }[]).map((i) => i.id)).toContain(
      "sponsor-funding"
    );
    expect((sponsored.reports as { id: string }[]).map((r) => r.id)).toEqual([
      "sponsorship-statement"
    ]);
    // Non-clinical by design: the composed set carries no clinical capability.
    for (const clinical of ["timeline.read", "clinical-record.read", "document.read"]) {
      expect(sponsored.capabilities as string[]).not.toContain(clinical);
    }
  });

  it("fails CLOSED over HTTP for a subject with no declared capacity", async () => {
    const stranger = await surface(
      `/api/me/surface?subject=${strangerPersonId}`,
      personalSessionId
    );
    expect(stranger).toMatchObject({
      active: false,
      reasonCode: "subject-no-capacity",
      workspaceId: "",
      personaId: "",
      landingDashboardId: null
    });
    expect(stranger.navigation).toEqual([]);
    expect(stranger.dashboards).toEqual([]);
    expect(stranger.capabilities).toEqual([]);

    const tools = await surface(
      `/api/me/tools?consumer=ai&subject=${strangerPersonId}`,
      personalSessionId
    );
    expect(tools.active).toBe(false);
    expect(tools.available).toEqual([]);
  });

  it("fails CLOSED for an organization role with no registry persona", async () => {
    const data = await surface("/api/me/surface", untypedOrgSessionId);
    expect(data.active).toBe(false);
    expect(data.navigation).toEqual([]);
  });

  it("requires authentication on both composition endpoints", async () => {
    for (const path of ["/api/me/surface", "/api/me/tools"]) {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      expect(response.status).toBe(401);
    }
  });
});
