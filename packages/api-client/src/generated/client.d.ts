import type { paths } from "./openapi-types.js";
export type ApiClient = ReturnType<typeof createApiClient>;
export declare function createApiClient(baseUrl: string): import("openapi-fetch").Client<paths, `${string}/${string}`>;
//# sourceMappingURL=client.d.ts.map