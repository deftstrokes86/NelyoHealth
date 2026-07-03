export type TokenValue = string | number;
export interface TokenDefinition<T extends TokenValue = TokenValue> {
  value: T;
  description: string;
  category: string;
}
export type TokenGroup<T extends TokenValue = TokenValue> = Record<string, TokenDefinition<T>>;
export interface DesignTokens {
  color: TokenGroup;
  typography: TokenGroup;
  spacing: TokenGroup;
  sizing: TokenGroup;
  radius: TokenGroup;
  elevation: TokenGroup;
  shadow: TokenGroup;
  zIndex: TokenGroup;
  breakpoint: TokenGroup;
  grid: TokenGroup;
  icon: TokenGroup;
  status: TokenGroup;
  button: TokenGroup;
  card: TokenGroup;
  formControl: TokenGroup;
  navigation: TokenGroup;
  badge: TokenGroup;
  motion: TokenGroup;
}
export interface TokenAuditSummary {
  category: keyof DesignTokens;
  count: number;
}
