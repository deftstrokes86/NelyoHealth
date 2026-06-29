import { describe, expect, it } from "vitest";
import { createAuthorizationPermissionViewModel } from "./authorization.js";

describe("patient web authorization view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createAuthorizationPermissionViewModel({
      permissionId: "perm-4",
      subjectId: "patient-4",
      scope: "care-team-access",
      granted: true,
      reason: null
    });

    expect(viewModel).toMatchObject({
      permissionId: "perm-4",
      subjectId: "patient-4",
      scope: "care-team-access",
      granted: true,
      reason: null
    });
  });
});
