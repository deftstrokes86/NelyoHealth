import { describe, expect, it } from "vitest";
import {
  patientShellDescriptor,
  patientShellNavigation,
  patientShellStateScaffolds
} from "../../apps/patient-web/src/shell.js";
import {
  providerShellDescriptor,
  providerShellNavigation,
  providerShellStateScaffolds
} from "../../apps/provider-web/src/shell.js";
import {
  organizationShellDescriptor,
  organizationShellNavigation,
  organizationShellStateScaffolds
} from "../../apps/organization-web/src/shell.js";
import {
  adminShellDescriptor,
  adminShellNavigation,
  adminShellStateScaffolds
} from "../../apps/admin-web/src/shell.js";

const expectedStateKeys = [
  "loading",
  "empty",
  "error",
  "unauthorized",
  "offline",
  "reduced-motion"
] as const;

describe("phase 5 shell state scaffolds", () => {
  it("marks all shell descriptors with P05-ISS-001 context", () => {
    expect(patientShellDescriptor.phase5Issue).toBe("P05-ISS-001");
    expect(providerShellDescriptor.phase5Issue).toBe("P05-ISS-001");
    expect(organizationShellDescriptor.phase5Issue).toBe("P05-ISS-001");
    expect(adminShellDescriptor.phase5Issue).toBe("P05-ISS-001");
  });

  it("keeps navigation scaffolds non-empty for each shell", () => {
    expect(patientShellNavigation.length).toBeGreaterThanOrEqual(4);
    expect(providerShellNavigation.length).toBeGreaterThanOrEqual(4);
    expect(organizationShellNavigation.length).toBeGreaterThanOrEqual(4);
    expect(adminShellNavigation.length).toBeGreaterThanOrEqual(4);
  });

  it("covers all required shell states in each app scaffold", () => {
    const stateSets = [
      patientShellStateScaffolds,
      providerShellStateScaffolds,
      organizationShellStateScaffolds,
      adminShellStateScaffolds
    ].map((states) => states.map((state) => state.key));

    for (const keys of stateSets) {
      expect(keys).toEqual(expectedStateKeys);
    }
  });
});
