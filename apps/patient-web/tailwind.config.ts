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
        h4: ["1.5rem", { lineHeight: "1.28", letterSpacing: "-0.01em", fontWeight: "600" }],
        h5: ["1.25rem", { lineHeight: "1.36", letterSpacing: "-0.006em", fontWeight: "600" }],
        lead: ["1.25rem", { lineHeight: "1.6", letterSpacing: "0.001em", fontWeight: "400" }],
        body: ["1.125rem", { lineHeight: "1.72", letterSpacing: "0.002em", fontWeight: "400" }],
        "body-sm": ["1rem", { lineHeight: "1.62", letterSpacing: "0.002em", fontWeight: "400" }],
        nav: ["0.95rem", { lineHeight: "1.35", letterSpacing: "0.015em", fontWeight: "550" }],
        label: ["0.875rem", { lineHeight: "1.35", letterSpacing: "0.01em", fontWeight: "650" }],
        caption: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" }],
        overline: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.08em", fontWeight: "700" }],
        button: ["0.95rem", { lineHeight: "1", letterSpacing: "0.015em", fontWeight: "650" }]
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
          accent: {
            50: "#fff8e8",
            100: "#ffefc8",
            200: "#fde19a",
            300: "#f9d06b",
            400: "#f2b94f",
            500: "#de9a22",
            600: "#b97a12",
            700: "#8c5d0f",
            800: "#6a470f",
            900: "#52390f"
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
          info: {
            50: "#eaf4ff",
            100: "#d6eaff",
            200: "#afccf0",
            300: "#82addf",
            400: "#4f89c8",
            500: "#286eab",
            600: "#1e5f97",
            700: "#1a4f7e",
            800: "#1a4368",
            900: "#1a3956"
          },
          success: {
            50: "#e8f8ef",
            100: "#cff0dd",
            200: "#a0dfbe",
            300: "#75cc9f",
            400: "#4aae7f",
            500: "#2f9065",
            600: "#15704f",
            700: "#125c43",
            800: "#124b39",
            900: "#133f32"
          },
          warning: {
            50: "#fff8ea",
            100: "#ffefcc",
            200: "#fddf9a",
            300: "#f9c96a",
            400: "#edaf3d",
            500: "#cc8a1a",
            600: "#9a640a",
            700: "#7c4e0c",
            800: "#613f10",
            900: "#50350f"
          },
          danger: {
            50: "#fdf0f0",
            100: "#fbdedd",
            200: "#f4bcbc",
            300: "#ea9292",
            400: "#de6668",
            500: "#cd4b4f",
            600: "#b23a3a",
            700: "#943131",
            800: "#7a2d2d",
            900: "#662b2d"
          },
          status: {
            success: "#15704f",
            warning: "#9a640a",
            danger: "#b23a3a",
            info: "#1e5f97"
          },
          semantic: {
            "bg-page": "#fcfefd",
            "bg-surface": "#ffffff",
            "bg-subtle": "#f1f6f4",
            "text-primary": "#152624",
            "text-secondary": "#374b47",
            "text-muted": "#516661",
            "border-soft": "#d3ddd8",
            "border-strong": "#9dafaa",
            focus: "#f2b94f"
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
        "ds-0": "none",
        "ds-1": "0 2px 8px rgba(15, 23, 42, 0.05)",
        "ds-2": "0 6px 16px rgba(15, 23, 42, 0.08)",
        "ds-3": "0 12px 28px rgba(15, 23, 42, 0.1)",
        "ds-4": "0 20px 44px rgba(15, 23, 42, 0.14)",
        "ds-5": "0 30px 64px rgba(15, 23, 42, 0.18)",
        "ds-inset": "inset 0 1px 0 rgba(255, 255, 255, 0.72)",
        "ds-border": "inset 0 0 0 1px rgba(15, 23, 42, 0.1)",
        "ds-focus": "0 0 0 3px rgba(242, 185, 79, 0.22)",
        "ds-surface-rest": "0 2px 8px rgba(15, 23, 42, 0.05)",
        "ds-surface-hover": "0 10px 24px rgba(15, 23, 42, 0.1)",
        "ds-surface-active": "0 6px 16px rgba(15, 23, 42, 0.08)",
        "ds-overlay": "0 32px 72px rgba(15, 23, 42, 0.22)"
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
