import createClient from "openapi-fetch";
import type { paths } from "./openapi-types.js";

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(baseUrl: string) {
  return createClient<paths>({
    baseUrl
  });
}
