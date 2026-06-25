import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "**/dist/**",
      "lib/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".artifacts/**",
      "packages/design-tokens/generated/**",
      ".agents/skills/ui-ux-pro-max/data/**",
      ".agents/skills/ui-ux-pro-max/scripts/**",
      "tools/vendor/ui-ux-pro-max/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser }
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  }
];
