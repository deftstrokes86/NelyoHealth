import { describe, expect, it } from "vitest";
import {
  LIVE_SCOPE_TYPES,
  SCOPE_OWNED_TABLES,
  findScopeOwnedTable,
  isScopeOwned
} from "../../packages/database/src/scope-registry.js";

/**
 * M8.2 Scope Registry (AM-7): the single source of truth for tenant-owned persistence.
 * Proves the registry knows aggregates of record vs their scoped-via-parent children,
 * treats intentionally-global tables as global, and stays extensible past organization.
 */
describe("scope registry (M8.2)", () => {
  it("marks aggregates of record as organization-scoped", () => {
    const appointment = findScopeOwnedTable("nelyo_appointment", "appointment");
    expect(appointment?.scopes).toEqual([{ type: "organization", column: "organization_ref" }]);
    expect(appointment?.primaryKey).toEqual(["appointment_id"]);
    expect(isScopeOwned("nelyo_consultation", "consultation")).toBe(true);
  });

  it("marks child tables as scoped-via-parent (no scope column of their own)", () => {
    const message = findScopeOwnedTable("nelyo_messaging", "message");
    expect(message?.scopes).toEqual([]);
    expect(message?.parent).toEqual({
      schema: "nelyo_messaging",
      table: "message_thread",
      foreignKey: "thread_ref"
    });
  });

  it("treats intentionally-global tables as global (not in the registry)", () => {
    for (const [schema, table] of [
      ["nelyo_identity", "person"],
      ["nelyo_identity", "user_account"],
      ["nelyo_identity", "session"],
      ["nelyo_tenancy", "organization"],
      ["nelyo_foundation", "audit_event"]
    ] as const) {
      expect(isScopeOwned(schema, table)).toBe(false);
      expect(findScopeOwnedTable(schema, table)).toBeUndefined();
    }
  });

  it("is extensible: organization is the only LIVE scope type today", () => {
    expect(LIVE_SCOPE_TYPES).toEqual(["organization"]);
    // Every declared scope binding uses a live scope type.
    for (const entry of SCOPE_OWNED_TABLES) {
      for (const scope of entry.scopes) {
        expect(LIVE_SCOPE_TYPES).toContain(scope.type);
      }
    }
  });
});
