import type { AnchorHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type LinkVariant = "default" | "muted" | "inverse";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  external?: boolean;
  children: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = "default",
      external = false,
      children,
      className = "",
      rel,
      target,
      ...props
    },
    ref
  ) => (
    <a
      ref={ref}
      className={
        `nh-link nh-link--${variant}` + (className ? ` ${className}` : "")
      }
      data-variant={variant}
      target={external ? target ?? "_blank" : target}
      rel={external ? rel ?? "noopener noreferrer" : rel}
      {...props}
    >
      {children}
      {external ? (
        <span className="nh-visually-hidden"> (opens in a new tab)</span>
      ) : null}
    </a>
  )
);

Link.displayName = "Link";
