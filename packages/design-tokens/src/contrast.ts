import { tokens } from "./tokens.js";
export type ContrastTheme = "light" | "dark";
export interface ContrastCheck {
  foreground: string;
  background: string;
  theme: ContrastTheme;
  ratio: number;
  passesAaNormal: boolean;
}
const expandHex = (hex: string) => {
  const clean = hex.replace("#", "").trim();
  return clean.length === 3
    ? clean
        .split("")
        .map((char) => char + char)
        .join("")
    : clean;
};
export const hexToRgb = (hex: string): [number, number, number] => {
  const expanded = expandHex(hex);
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) throw new Error(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((start) => Number.parseInt(expanded.slice(start, start + 2), 16)) as [
    number,
    number,
    number
  ];
};
const channel = (value: number) => {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};
export const relativeLuminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
export const contrastRatio = (foreground: string, background: string) => {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return Number(((light + 0.05) / (dark + 0.05)).toFixed(2));
};
export const requiredContrastPairs = [
  ["text", "background"],
  ["text", "surface"],
  ["text", "surface-raised"],
  ["text-muted", "background"],
  ["brand-900", "brand-100"],
  ["action", "background"],
  ["danger", "background"],
  ["ink-900", "paper-050"],
  ["teal-900", "teal-100"],
  ["coral-700", "coral-200"],
  ["sky-700", "sky-100"],
  ["success-700", "success-100"],
  ["status-success-fg", "status-success-bg"],
  ["status-warning-fg", "status-warning-bg"],
  ["status-danger-fg", "status-danger-bg"],
  ["status-info-fg", "status-info-bg"]
] as const;
type ColorTokenName = keyof typeof tokens.color;
const resolveThemeValue = (token: string, theme: ContrastTheme) => {
  const definition = tokens.color[token as ColorTokenName];
  if (!definition) throw new Error(`Unknown color token: ${token}`);
  if (theme === "dark" && definition.dark) return definition.dark;
  return String(definition.value);
};
const hasDarkPair = (foreground: string, background: string) => {
  const fg = tokens.color[foreground as ColorTokenName];
  const bg = tokens.color[background as ColorTokenName];
  return Boolean(fg?.dark || bg?.dark);
};
export const evaluateContrast = (theme: ContrastTheme = "light"): ContrastCheck[] =>
  requiredContrastPairs
    .filter(([foreground, background]) =>
      theme === "light" ? true : hasDarkPair(foreground, background)
    )
    .map(([foreground, background]) => {
      const foregroundValue = resolveThemeValue(foreground, theme);
      const backgroundValue = resolveThemeValue(background, theme);
      const ratio = contrastRatio(foregroundValue, backgroundValue);
      return {
        foreground,
        background,
        theme,
        ratio,
        passesAaNormal: ratio >= 4.5
      };
    });
export const assertAccessibleContrast = (theme: ContrastTheme = "light") => {
  const failures = evaluateContrast(theme).filter((item) => !item.passesAaNormal);
  if (failures.length > 0)
    throw new Error(
      `Contrast failures (${theme}): ${failures.map((item) => `${item.foreground}/${item.background}=${item.ratio}`).join(", ")}`
    );
};
