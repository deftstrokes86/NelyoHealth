import type { Metadata } from "next";
import "@nelyohealth/ui-foundation/styles.css";

export const metadata: Metadata = {
  title: "NelyoHealth Organization Web",
  description: "Synthetic-only organization shell for P02-ISS-012"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
