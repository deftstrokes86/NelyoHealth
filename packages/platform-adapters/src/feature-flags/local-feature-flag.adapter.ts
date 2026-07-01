import {
  assertSafeFeatureFlagKey,
  type FeatureFlagContext,
  type FeatureFlagEvaluation,
  type FeatureFlagPort,
  type FeatureFlagValue
} from "./feature-flag-port.js";

export interface LocalFeatureFlagAdapterConfig {
  initialFlags?: Record<string, FeatureFlagValue>;
}

export class LocalFeatureFlagAdapter implements FeatureFlagPort {
  private readonly flags = new Map<string, FeatureFlagValue>();

  constructor(config?: LocalFeatureFlagAdapterConfig) {
    if (config?.initialFlags) {
      for (const [key, value] of Object.entries(config.initialFlags)) {
        assertSafeFeatureFlagKey(key);
        this.flags.set(key, value);
      }
    }
  }

  async evaluateBoolean(
    key: string,
    defaultValue: boolean,
    _context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<boolean>> {
    void _context;
    assertSafeFeatureFlagKey(key);
    const value = this.flags.get(key);
    if (typeof value === "boolean") {
      return {
        key,
        value,
        reason: "OVERRIDE",
        variant: value ? "on" : "off"
      };
    }

    return {
      key,
      value: defaultValue,
      reason: value === undefined ? "DEFAULT" : "STATIC",
      variant: defaultValue ? "on" : "off"
    };
  }

  async evaluateString(
    key: string,
    defaultValue: string,
    _context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<string>> {
    void _context;
    assertSafeFeatureFlagKey(key);
    const value = this.flags.get(key);
    if (typeof value === "string") {
      return {
        key,
        value,
        reason: "OVERRIDE",
        variant: value
      };
    }

    return {
      key,
      value: defaultValue,
      reason: value === undefined ? "DEFAULT" : "STATIC",
      variant: defaultValue
    };
  }

  async evaluateNumber(
    key: string,
    defaultValue: number,
    _context: FeatureFlagContext
  ): Promise<FeatureFlagEvaluation<number>> {
    void _context;
    assertSafeFeatureFlagKey(key);
    const value = this.flags.get(key);
    if (typeof value === "number") {
      return {
        key,
        value,
        reason: "OVERRIDE",
        variant: String(value)
      };
    }

    return {
      key,
      value: defaultValue,
      reason: value === undefined ? "DEFAULT" : "STATIC",
      variant: String(defaultValue)
    };
  }

  setFlag(key: string, value: FeatureFlagValue): void {
    assertSafeFeatureFlagKey(key);
    this.flags.set(key, value);
  }

  clearFlag(key: string): void {
    this.flags.delete(key);
  }
}
