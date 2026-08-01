import { describe, expect, it } from "vitest";
import type { PersistedRelationship } from "../../packages/database/src/index.js";
import { selectCapacityFromRelationships } from "../../apps/api/src/nest/resource/resource-access-context.js";

/**
 * M7.2 capacity selection (ADR-0014). From an actor's relationships to a patient,
 * pick ONE capacity deterministically. The mapping is deliberately small
 * (guardian, caregiver-delegation); everything else is default-deny. Determinism is
 * load-bearing: nondeterministic capacity selection is nondeterministic visibility.
 */
const NOW = Date.parse("2026-07-29T00:00:00.000Z");

function rel(overrides: Partial<PersistedRelationship>): PersistedRelationship {
  return {
    relationshipId: "rel-1",
    actorRef: "account-1",
    patientRef: "person-2",
    organizationRef: "org-1",
    relationshipType: "caregiver-delegation",
    status: "active",
    verificationMethod: "organization-attestation",
    effectiveDate: "2026-01-01T00:00:00.000Z",
    permittedActions: ["read"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  } as PersistedRelationship;
}

describe("selectCapacityFromRelationships (M7.2)", () => {
  it("maps guardian, caregiver-delegation and sponsor; nothing else", () => {
    expect(
      selectCapacityFromRelationships([rel({ relationshipType: "guardian" })], NOW)?.actorRole
    ).toBe("guardian");
    expect(
      selectCapacityFromRelationships([rel({ relationshipType: "caregiver-delegation" })], NOW)
        ?.actorRole
    ).toBe("caregiver");
    // M8.3f (ADR-0007 extension): sponsor resolves capacity, but its policy grant is
    // funding + coordination only — every clinical read still default-denies.
    expect(
      selectCapacityFromRelationships([rel({ relationshipType: "sponsor" })], NOW)?.actorRole
    ).toBe("sponsor");
    // Excluded types confer NO routine capacity (default-deny).
    for (const type of ["emergency-contact", "household", "clinical-proxy", "none"]) {
      expect(selectCapacityFromRelationships([rel({ relationshipType: type })], NOW)).toBeNull();
    }
  });

  it("ranks guardian over caregiver over sponsor when an actor holds several", () => {
    const chosen = selectCapacityFromRelationships(
      [
        rel({ relationshipId: "spon", relationshipType: "sponsor" }),
        rel({ relationshipId: "care", relationshipType: "caregiver-delegation" })
      ],
      NOW
    );
    // The wider clinical capacity wins over the narrower funding one.
    expect(chosen?.actorRole).toBe("caregiver");
    expect(chosen?.relationshipRef).toBe("care");
  });

  it("prioritizes guardian over caregiver when the actor holds both", () => {
    const chosen = selectCapacityFromRelationships(
      [
        rel({ relationshipId: "care", relationshipType: "caregiver-delegation" }),
        rel({ relationshipId: "guard", relationshipType: "guardian" })
      ],
      NOW
    );
    expect(chosen?.actorRole).toBe("guardian");
    expect(chosen?.relationshipRef).toBe("guard");
  });

  it("MULTI-ORG TIE-BREAK: same tier at two facilities -> most-recently-effective wins (deterministic)", () => {
    const older = rel({
      relationshipId: "facility-a",
      organizationRef: "org-a",
      effectiveDate: "2026-02-01T00:00:00.000Z"
    });
    const newer = rel({
      relationshipId: "facility-b",
      organizationRef: "org-b",
      effectiveDate: "2026-06-01T00:00:00.000Z"
    });
    // Order of input must not matter — selection is deterministic.
    const a = selectCapacityFromRelationships([older, newer], NOW);
    const b = selectCapacityFromRelationships([newer, older], NOW);
    expect(a?.relationshipRef).toBe("facility-b");
    expect(a?.organizationRef).toBe("org-b"); // the org that scopes consent is fixed
    expect(b).toEqual(a);
  });

  it("ignores inactive and expired relationships", () => {
    expect(selectCapacityFromRelationships([rel({ status: "revoked" })], NOW)).toBeNull();
    expect(
      selectCapacityFromRelationships(
        [rel({ expiryDate: "2026-06-01T00:00:00.000Z" })], // expired before NOW
        NOW
      )
    ).toBeNull();
    expect(
      selectCapacityFromRelationships(
        [rel({ effectiveDate: "2026-12-01T00:00:00.000Z" })], // not yet effective
        NOW
      )
    ).toBeNull();
  });

  it("returns null when there are no relationships (stranger -> non-privileged -> deny)", () => {
    expect(selectCapacityFromRelationships([], NOW)).toBeNull();
  });
});
