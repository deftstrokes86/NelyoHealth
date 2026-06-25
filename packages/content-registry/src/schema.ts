import { z } from "zod";
import { contentFamilies } from "./ids.js";
export const contentStatusSchema = z.enum(["draft", "review", "approved", "deprecated"]);
export const contentClassSchema = z.enum([
  "public",
  "operational",
  "clinical-sensitive",
  "payment-sensitive",
  "provider-protected"
]);
export const surfaceSchema = z.enum([
  "preview",
  "patient-client",
  "clinician-client",
  "admin-client",
  "browser-test"
]);
export const contentEntrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+.[a-z0-9-]+(?:.[a-z0-9-]+)*$/),
    family: z.enum(contentFamilies),
    status: contentStatusSchema,
    contentClass: contentClassSchema,
    surface: surfaceSchema,
    title: z.string().min(1),
    body: z.string().min(1),
    cta: z.string().optional(),
    approvedBy: z.string().optional(),
    evidence: z.array(z.string()).default([]),
    syntheticOnly: z.boolean().default(true),
    notes: z.string().optional()
  })
  .superRefine((entry, ctx) => {
    if (!entry.id.startsWith(entry.family + "."))
      ctx.addIssue({
        code: "custom",
        path: ["id"],
        message: "Content ID must start with its family."
      });
    if (entry.surface === "preview" && entry.syntheticOnly !== true)
      ctx.addIssue({
        code: "custom",
        path: ["syntheticOnly"],
        message: "Preview content must be synthetic only."
      });
    if (
      entry.contentClass === "provider-protected" &&
      /address|coordinate|distance|phone|pickup|branch|map/i.test(entry.title + " " + entry.body)
    )
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message:
          "Provider-protected content must not contain pre-payment provider-location details."
      });
  });
export const contentRegistrySchema = z.array(contentEntrySchema);
export type ContentEntry = z.infer<typeof contentEntrySchema>;
export type ContentRegistry = z.infer<typeof contentRegistrySchema>;
