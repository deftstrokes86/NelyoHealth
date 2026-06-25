import type { ButtonHTMLAttributes, ReactNode } from "react";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
}
export const Button = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) => (
  <button className={`nh-button nh-button--${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);
