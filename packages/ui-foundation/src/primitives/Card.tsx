import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type CardTone = "default" | "raised" | "interactive" | "muted" | "critical";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: CardTone;
  padding?: CardPadding;
  children: ReactNode;
}

export const Card = ({
  as: Component = "section",
  tone = "default",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) => (
  <Component
    className={
      `nh-card nh-card--${tone} nh-card--pad-${padding}` +
      (className ? ` ${className}` : "")
    }
    data-tone={tone}
    data-padding={padding}
    {...props}
  >
    {children}
  </Component>
);
