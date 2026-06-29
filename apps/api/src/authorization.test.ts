import { describe, expect, it } from "vitest";
import { createAuthorizationPermissionDraft } from "./authorization.js";

describe("authorization permission contract", () => {
  it("creates an authorization permission draft with the expected shape", () => {
    const permission = createAuthorizationPermissionDraft({
      permissionId: "perm-1",
      subjectId: "patient-1",
      scope: "clinical-record-access",
      granted: true,
      reason: null
    });

    expect(permission).toMatchObject({
      permissionId: "perm-1",
      subjectId: "patient-1",
      scope: "clinical-record-access",
      granted: true,
      reason: null
    });
  });
});
