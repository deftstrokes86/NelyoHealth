import {
  syntheticPreviewContent,
  validateContentRegistry,
  assertNoProtectedProviderLeakage,
  evaluateContentRelease
} from "../lib/index.js";
const entries = validateContentRegistry(syntheticPreviewContent);
assertNoProtectedProviderLeakage(entries);
const productionFailures = entries.filter(
  (entry) => evaluateContentRelease(entry, "production").releasable
);
if (productionFailures.length > 0)
  throw new Error(
    "Synthetic preview content unexpectedly production-releasable: " +
      productionFailures.map((entry) => entry.id).join(", ")
  );
console.log("Validated " + entries.length + " synthetic preview content entries.");
