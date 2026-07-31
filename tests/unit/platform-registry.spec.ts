import { describe, expect, it } from "vitest";
import {
  CAPABILITIES,
  PERSONAS,
  TOOLS,
  compositionHasCapability,
  findWorkspace,
  isKnownCapability,
  resolveComposition,
  validatePlatformRegistry
} from "../../packages/platform-registry/src/index.js";

/**
 * M8.3a Platform Registry Layer foundation: the registries are coherent, tools expose
 * real capabilities, org types are declared data (not code branches), and the Context
 * Engine composition resolver is fail-closed and composition-only (never authorization).
 */
describe("platform registry (M8.3a)", () => {
  it("is internally coherent (schemas + cross-references)", () => {
    expect(validatePlatformRegistry()).toEqual([]);
  });

  it("has a structured capability vocabulary (resource.action + category + scope)", () => {
    const timeline = CAPABILITIES.find((c) => c.id === "timeline.read");
    expect(timeline).toMatchObject({ resource: "timeline", action: "read", scope: "care-circle" });
    for (const tool of TOOLS) expect(isKnownCapability(tool.capability)).toBe(true);
  });

  it("carries workspace lifecycle so org types are data, not code branches", () => {
    expect(findWorkspace("personal")?.lifecycle.status).toBe("active");
    expect(findWorkspace("hospital")?.lifecycle.status).toBe("active");
    expect(findWorkspace("pharmacy")?.lifecycle.enablementState).toBe("disabled");
    for (const id of ["employer", "insurer", "government"]) {
      expect(findWorkspace(id)?.kind).toBe("organization");
    }
  });

  it("resolves the patient composition set for the personal workspace", () => {
    const resolved = resolveComposition("personal", "patient");
    expect(resolved.active).toBe(true);
    expect(resolved.reasonCode).toBe("resolved");
    expect(compositionHasCapability(resolved, "appointment.book")).toBe(true);
    expect(compositionHasCapability(resolved, "timeline.read")).toBe(true);
    // A clinician-only capability is NOT composed for a patient.
    expect(compositionHasCapability(resolved, "clinical-record.amend")).toBe(false);
  });

  it("fails CLOSED: unknown / disabled workspace or non-applicable persona composes nothing", () => {
    expect(resolveComposition("nope", "patient").reasonCode).toBe("workspace-unknown");
    expect(resolveComposition("personal", "nope").reasonCode).toBe("persona-unknown");
    const disabled = resolveComposition("pharmacy", "pharmacist");
    expect(disabled.active).toBe(false);
    expect(disabled.reasonCode).toBe("workspace-disabled");
    expect(disabled.capabilities).toEqual([]);
    expect(resolveComposition("hospital", "patient").reasonCode).toBe("persona-not-applicable");
  });

  it("keeps personas expandable: composition forward-refs default to empty, not invalid", () => {
    for (const persona of PERSONAS) {
      expect(Array.isArray(persona.defaultDashboards)).toBe(true);
      expect(Array.isArray(persona.navigation)).toBe(true);
      expect(Array.isArray(persona.searchScopes)).toBe(true);
    }
  });
});
