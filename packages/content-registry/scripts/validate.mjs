import {
  syntheticPreviewContent,
  validateContentRegistry,
  assertNoProtectedProviderLeakage,
  evaluateContentRelease,
  marketingContentEntries,
  assertVoiceToneClean,
  lintContentRegistry
} from "../lib/index.js";

const preview = validateContentRegistry(syntheticPreviewContent);
assertNoProtectedProviderLeakage(preview);
const previewShipToProd = preview.filter(
  (entry) => evaluateContentRelease(entry, "production").releasable
);
if (previewShipToProd.length > 0)
  throw new Error(
    "Synthetic preview content unexpectedly production-releasable: " +
      previewShipToProd.map((entry) => entry.id).join(", ")
  );
console.log("Validated " + preview.length + " synthetic preview content entries.");

const marketing = validateContentRegistry(marketingContentEntries);
assertNoProtectedProviderLeakage(marketing);

const marketingShipToProd = marketing.filter(
  (entry) => evaluateContentRelease(entry, "production").releasable
);
if (marketingShipToProd.length > 0)
  throw new Error(
    "Draft marketing entries unexpectedly production-releasable: " +
      marketingShipToProd.map((entry) => entry.id).join(", ")
  );

const violations = lintContentRegistry(marketing);
if (violations.length > 0) {
  console.error(JSON.stringify(violations, null, 2));
  assertVoiceToneClean(marketing);
}

console.log("Validated " + marketing.length + " marketing content entries.");
