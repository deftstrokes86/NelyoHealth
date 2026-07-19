import type { ReactNode } from "react";
import { Card } from "@nelyohealth/ui-foundation";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Card
      as="section"
      tone="raised"
      padding="lg"
      className="w-full max-w-md rounded-3xl border border-border/60 shadow-xl shadow-ds-brand-900/5"
    >
      <div className="flex flex-col gap-1.5 pb-6">
        <h1 className="text-h3 font-semibold text-foreground">{title}</h1>
        <p className="text-body-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </Card>
  );
}
