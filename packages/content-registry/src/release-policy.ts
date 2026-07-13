import type { ContentEntry } from "./schema.js";
export interface ReleaseDecision {
  releasable: boolean;
  reasons: string[];
}
export const evaluateContentRelease = (
  entry: ContentEntry,
  target: "preview" | "production"
): ReleaseDecision => {
  const reasons: string[] = [];
  if (target === "production") {
    if (entry.status !== "approved")
      reasons.push("Production release requires approved content status.");
    if (!entry.approvedBy) reasons.push("Production release requires approvedBy evidence.");
    if (entry.syntheticOnly) reasons.push("Synthetic-only content cannot ship to production.");
    if (entry.surface === "public-site" && entry.status !== "approved")
      reasons.push(
        "Public-site content requires Content Owner approval before production release."
      );
  }
  if (entry.contentClass === "provider-protected" && entry.surface === "patient-client")
    reasons.push(
      "Provider-protected patient-client content requires order-scoped post-payment authorization outside this registry."
    );
  return { releasable: reasons.length === 0, reasons };
};
export const assertRegistryReleasable = (
  entries: ContentEntry[],
  target: "preview" | "production"
) => {
  const failures = entries.flatMap((entry) => {
    const decision = evaluateContentRelease(entry, target);
    return decision.releasable ? [] : [{ id: entry.id, reasons: decision.reasons }];
  });
  if (failures.length > 0) throw new Error(JSON.stringify(failures, null, 2));
};
