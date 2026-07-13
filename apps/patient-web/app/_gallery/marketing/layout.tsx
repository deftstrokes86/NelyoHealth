import type { Metadata } from "next";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Marketing component gallery — NelyoHealth",
  description: "Internal design gallery for P05-MKT-002 marketing components.",
  robots: { index: false, follow: false }
};

export default function GalleryLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
