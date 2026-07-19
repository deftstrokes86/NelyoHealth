import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Root vitest config.
 *
 * Exists solely to force JSX transformation via @vitejs/plugin-react for
 * .tsx test files. Without it, Vite's default esbuild transform honors each
 * file's nearest tsconfig `jsx` setting — apps/patient-web sets
 * `"jsx": "preserve"` (correct: Next.js does its own JSX transform via SWC
 * for the actual app build), which left `.tsx` files under patient-web
 * unparseable by a bare `vitest run`. This plugin only affects the test
 * transform pipeline; it has no effect on `next build`/`next dev`.
 *
 * No `test.include`/`test.exclude`/`test.environment` overrides — this
 * preserves vitest's existing zero-config defaults (explicit paths, and the
 * established per-file `/* @vitest-environment jsdom *\/` pragma pattern)
 * for every other package.
 */
export default defineConfig({
  plugins: [react()]
});
