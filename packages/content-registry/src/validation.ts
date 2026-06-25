import { contentRegistrySchema, type ContentEntry } from "./schema.js";
export const validateContentRegistry = (entries: unknown): ContentEntry[] =>
  contentRegistrySchema.parse(entries);
export const assertNoProtectedProviderLeakage = (entries: ContentEntry[]) => {
  const banned =
    /address|coordinate|distance|phone|pickup|branch|map pin|directions|contact|latitude|longitude/i;
  const leaks = entries.filter(
    (entry) =>
      entry.contentClass === "provider-protected" &&
      banned.test(entry.title + " " + entry.body + " " + (entry.cta ?? ""))
  );
  if (leaks.length > 0)
    throw new Error(
      "Protected provider leakage in content entries: " + leaks.map((entry) => entry.id).join(", ")
    );
};
