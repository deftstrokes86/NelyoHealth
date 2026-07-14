import type { Metadata } from "next";
import { marketingContentById } from "@nelyohealth/content-registry";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://nelyohealth.example";

const lookup = (id: string) => marketingContentById.get(id);

export const marketingMetadata = (pageSlug: string, path: string): Metadata => {
  const title = lookup(`marketing-seo.${pageSlug}.title`);
  const description = lookup(`marketing-seo.${pageSlug}.description`);
  const image = lookup(`marketing-seo.${pageSlug}.og-image-id`);
  const canonical = `${SITE_ORIGIN}${path}`;
  return {
    title: title?.title ?? "NelyoHealth",
    description: description?.body ?? "",
    alternates: { canonical },
    openGraph: {
      title: title?.title ?? "NelyoHealth",
      description: description?.body ?? "",
      url: canonical,
      type: "website",
      siteName: "NelyoHealth"
    },
    robots: { index: true, follow: true },
    other: {
      "nh-og-image-id": image?.title ?? "neutral-placeholder"
    }
  };
};
