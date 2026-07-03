import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui-foundation/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Manrope", "Inter", "IBM Plex Sans", "Segoe UI", "sans-serif"]
      },
      fontSize: {
        display: [
          "clamp(4rem, 7vw, 4.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "800" }
        ],
        h1: [
          "clamp(3rem, 5.5vw, 3.5rem)",
          { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "800" }
        ],
        h2: [
          "clamp(2.25rem, 4.2vw, 2.625rem)",
          { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "650" }
        ],
        h3: [
          "clamp(1.75rem, 3vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }
        ],
        body: ["1.125rem", { lineHeight: "1.72", letterSpacing: "0.002em", fontWeight: "400" }],
        nav: ["0.95rem", { lineHeight: "1.35", letterSpacing: "0.015em", fontWeight: "550" }]
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        ds: {
          brand: {
            50: "#ecf7f4",
            100: "#d7efe8",
            200: "#b4ded3",
            300: "#86c7b8",
            400: "#54ad9d",
            500: "#2e8d7f",
            600: "#0f5d57",
            700: "#0d4e48",
            800: "#103f3b",
            900: "#123633"
          },
          neutral: {
            0: "#ffffff",
            25: "#fcfefd",
            50: "#f8fbfa",
            100: "#f1f6f4",
            200: "#e5ece9",
            300: "#d3ddd8",
            400: "#9dafaa",
            500: "#6f827d",
            600: "#516661",
            700: "#374b47",
            800: "#243734",
            900: "#152624"
          },
          status: {
            success: "#15704f",
            warning: "#9a640a",
            danger: "#b23a3a",
            info: "#1e5f97"
          }
        }
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem"
      },
      maxWidth: {
        "grid-content": "1200px",
        "grid-wide": "1280px",
        "grid-reading": "72ch"
      },
      boxShadow: {
        "ds-1": "0 4px 12px rgba(15, 23, 42, 0.06)",
        "ds-2": "0 10px 24px rgba(15, 23, 42, 0.08)",
        "ds-3": "0 18px 38px rgba(15, 23, 42, 0.12)",
        "ds-inset": "inset 0 1px 0 rgba(255, 255, 255, 0.72)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ds: "1rem",
        "ds-lg": "1.25rem",
        pill: "9999px"
      },
      transitionDuration: {
        180: "180ms",
        220: "220ms",
        260: "260ms"
      },
      transitionTimingFunction: {
        "ds-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "ds-inout": "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },
  plugins: []
};

export default config;
