declare module "@nelyohealth/config" {
  export type NodeEnvironment = "development" | "test" | "production";

  export interface RuntimeConfig {
    nodeEnv: NodeEnvironment;
    port: number;
    apiBaseUrl: string;
    enableSyntheticData: boolean;
    logLevel: "debug" | "info" | "warn" | "error";
    featureFlags: {
      paymentsEnabled: boolean;
      providerDisclosureEnabled: boolean;
    };
  }
}
