import type { HTMLAttributes, ReactNode } from "react";

export interface ErrorTextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  id: string;
}

export const ErrorText = ({
  children,
  className = "",
  ...props
}: ErrorTextProps) => (
  <p
    className={`nh-error-text ${className}`.trim()}
    role="alert"
    aria-live="polite"
    {...props}
  >
    {children}
  </p>
);
