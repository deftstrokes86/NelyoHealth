import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `account.${slug}`,
  family: "account",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const accountEntries: ContentEntry[] = [
  e("welcome.headline", "Welcome back.", "The account landing headline."),
  e("welcome.body", "You're securely signed in.", "The account landing subheading."),
  e("field.workspace", "Workspace", "Label for the resolved workspace."),
  e("field.acting-as", "Acting as", "Label for the resolved persona role."),
  e("cta.sign-out", "Sign out", "Sign-out button label.")
];
