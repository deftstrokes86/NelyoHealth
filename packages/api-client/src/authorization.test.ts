import { describe, expect, it } from "vitest";
import { createAuthorizationPermissionDraftDto } from "./authorization.js";

describe("api client authorization dto", () => {
  it("maps an authorization permission request into a public dto", () => {
    const dto = createAuthorizationPermissionDraftDto({
      permissionId: "perm-2",
      subjectId: "patient-2",
      scope: "result-release",
      granted: true,
      reason: null
    });

    expect(dto).toMatchObject({
      permissionId: "perm-2",
      subjectId: "patient-2",
      scope: "result-release",
      granted: true,
      reason: null
    });
  });
});
