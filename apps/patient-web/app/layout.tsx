import type { Metadata } from "next";
import "./tailwind.css";
import "@nelyohealth/ui-foundation/styles.css";

export const metadata: Metadata = {
  title: "NelyoHealth Patient Web",
  description: "Synthetic-only patient shell for P02-ISS-012"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
