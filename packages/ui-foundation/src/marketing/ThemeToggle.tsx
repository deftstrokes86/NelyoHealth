"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "nh-theme";

const isTheme = (value: unknown): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

const readStoredPreference = (): ThemePreference => {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(raw)) return raw;
  } catch {
    // localStorage unavailable — treat as system default.
  }
  return "system";
};

const resolvePreference = (preference: ThemePreference): ResolvedTheme => {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (preference: ThemePreference) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", preference);
  }
};

export interface ThemeToggleProps {
  labelLight?: string;
  labelDark?: string;
  labelSystem?: string;
  className?: string;
}

export const ThemeToggle = ({
  labelLight = "Use light theme",
  labelDark = "Use dark theme",
  labelSystem = "Use system theme",
  className = ""
}: ThemeToggleProps) => {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readStoredPreference();
    setPreference(initial);
    setResolved(resolvePreference(initial));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(preference);
    setResolved(resolvePreference(preference));
    try {
      if (preference === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage failures.
    }
  }, [preference, mounted]);

  useEffect(() => {
    if (!mounted || preference !== "system") return;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const handler = () => setResolved(resolvePreference("system"));
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mounted, preference]);

  const cycle = useCallback(() => {
    setPreference((current) =>
      current === "system" ? "dark" : current === "dark" ? "light" : "system"
    );
  }, []);

  const label =
    preference === "light"
      ? labelLight
      : preference === "dark"
        ? labelDark
        : labelSystem;

  return (
    <button
      type="button"
      className={`nh-theme-toggle ${className}`.trim()}
      data-preference={preference}
      data-resolved={resolved}
      aria-label={label}
      aria-pressed={preference !== "system"}
      onClick={cycle}
    >
      <span className="nh-theme-toggle__icon" aria-hidden="true">
        {resolved === "dark" ? (
          <svg viewBox="0 0 20 20" width="18" height="18">
            <path
              d="M15 11.5A6.5 6.5 0 0 1 8.5 5c0-.7.1-1.4.3-2A7 7 0 1 0 17 12.2c-.6.2-1.3.3-2 .3z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="18" height="18">
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.5">
              <path d="M10 2v2" />
              <path d="M10 16v2" />
              <path d="M2 10h2" />
              <path d="M16 10h2" />
              <path d="M4.2 4.2l1.4 1.4" />
              <path d="M14.4 14.4l1.4 1.4" />
              <path d="M4.2 15.8l1.4-1.4" />
              <path d="M14.4 5.6l1.4-1.4" />
            </g>
          </svg>
        )}
      </span>
      <span className="nh-theme-toggle__text">{label}</span>
    </button>
  );
};
