export type FeatureFlagValue = boolean | string | number;

export interface FeatureFlagContext {
  actorId: string;
  actorType: "system" | "operator" | "service";
  environment: "local" | "test" | "development" | "staging";
  attributes?: Record<string, string | number | boolean>;
}

export interface FeatureFlagEvaluation<TValue extends FeatureFlagValue> {
  key: string;
  value: TValue;
  reason: "STATIC" | "OVERRIDE" | "DEFAULT";
  variant: string;
}

export interface FeatureFlagPort {
  evaluateBoolean(
    key: string,
    defaultValue: boolean,
    context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<boolean>>;
  evaluateString(
    key: string,
    defaultValue: string,
    context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<string>>;
  evaluateNumber(
    key: string,
    defaultValue: number,
    context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<number>>;
}

export function assertSafeFeatureFlagKey(key: string): void {
  if (!/^[a-z0-9._-]{3,80}$/.test(key)) {
    throw new Error("Feature flag key must be 3-80 chars and contain lowercase letters, numbers, dot, underscore, or hyphen.");
  }
}
