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
  zIndex: TokenGroup;
  breakpoint: TokenGroup;
  motion: TokenGroup;
}
export interface TokenAuditSummary {
  category: keyof DesignTokens;
  count: number;
}
