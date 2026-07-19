import type { ReactNode } from "react";

export interface AuthLayoutProps {
  eyebrow: string;
  headline: string;
  body: string;
  trustFeatures: ReactNode;
  children: ReactNode;
}

/**
 * Premium two-column auth shell: brand/onboarding panel + form card.
 * Single column on mobile — the brand panel condenses above the card.
 */
export function AuthLayout({ eyebrow, headline, body, trustFeatures, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-1px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-ds-brand-700 via-ds-brand-600 to-ds-brand-800 px-6 py-16 sm:px-12 lg:px-16 lg:py-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-ds-accent-400/20 blur-3xl"
        />
        <div className="relative flex max-w-md flex-col gap-8">
          <span className="text-overline uppercase tracking-widest text-white/70">{eyebrow}</span>
          <div className="flex flex-col gap-3">
            <h2 className="text-h1 font-extrabold leading-tight text-white">{headline}</h2>
            <p className="text-lead text-white/80">{body}</p>
          </div>
          <div className="flex flex-col gap-5">{trustFeatures}</div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background px-6 py-16 sm:px-12">
        {children}
      </div>
    </div>
  );
}
