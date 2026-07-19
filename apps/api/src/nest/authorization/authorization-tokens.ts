/**
 * Nest DI tokens for the authorization infrastructure (roadmap M2.3).
 * Kept in their own module so the guard and the module can both import them
 * without a circular dependency.
 */
export const DATABASE_POOL = "NELYO_DATABASE_POOL";
export const ACTING_CONTEXT_PORTS = "NELYO_ACTING_CONTEXT_PORTS";
