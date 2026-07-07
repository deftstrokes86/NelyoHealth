import type { HTMLAttributes, ReactNode } from "react";

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  id: string;
}

export const HelperText = ({
  children,
  className = "",
  ...props
}: HelperTextProps) => (
  <p className={`nh-helper-text ${className}`.trim()} {...props}>
    {children}
  </p>
);
