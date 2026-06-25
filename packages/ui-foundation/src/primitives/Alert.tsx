import type { ReactNode } from "react";
export interface AlertProps {
  tone?: "info" | "success" | "warning" | "danger";
  title: string;
  children: ReactNode;
}
export const Alert = ({ tone = "info", title, children }: AlertProps) => (
  <section
    className={`nh-alert nh-alert--${tone}`}
    role={tone === "danger" ? "alert" : "status"}
    aria-label={title}
  >
    <strong>{title}</strong>
    <div>{children}</div>
  </section>
);
