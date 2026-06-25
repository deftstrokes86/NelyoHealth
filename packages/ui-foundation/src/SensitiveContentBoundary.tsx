import type { ReactNode } from "react";
export interface SensitiveContentBoundaryProps {
  authorized: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}
export const SensitiveContentBoundary = ({
  authorized,
  children,
  fallback = null,
  label = "Sensitive content boundary"
}: SensitiveContentBoundaryProps) => {
  if (!authorized)
    return fallback ? (
      <div aria-label={label} data-sensitive-boundary="redacted">
        {fallback}
      </div>
    ) : null;
  return <>{children}</>;
};
