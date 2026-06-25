import type { HTMLAttributes, ReactNode } from "react";
export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "article" | "div";
  tone?: "plain" | "raised" | "emphasis";
  children: ReactNode;
}
export const Surface = ({
  as: Component = "section",
  tone = "plain",
  children,
  className = "",
  ...props
}: SurfaceProps) => (
  <Component className={`nh-surface nh-surface--${tone} ${className}`.trim()} {...props}>
    {children}
  </Component>
);
