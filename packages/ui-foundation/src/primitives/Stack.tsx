import type { HTMLAttributes, ReactNode } from "react";
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
  direction?: "column" | "row";
  children: ReactNode;
}
export const Stack = ({
  gap = "md",
  direction = "column",
  children,
  className = "",
  ...props
}: StackProps) => (
  <div
    className={`nh-stack nh-stack--${direction} nh-stack--${gap} ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);
