export interface DatabaseCommandConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export interface SyntheticSeedRow {
  seedKey: string;
  seedValue: string;
  seedVersion: string;
}

export const databasePackageBoundary = {
  id: "database",
  packageName: "@nelyohealth/database",
  kind: "shared-package",
  status: "phase-2-foundation",
  owningIssue: "P02-ISS-004/P02-ISS-008",
  publicApi: "Database migration, synthetic seed conventions, and transactional outbox foundation",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type DatabasePackageBoundary = typeof databasePackageBoundary;

export function parsePort(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1024 || parsed > 65535) {
    throw new Error("Database port must be an integer from 1024 through 65535.");
  }
  return parsed;
}

export function resolveDatabaseCommandConfig(
  env: NodeJS.ProcessEnv = process.env
): DatabaseCommandConfig {
  return {
    host: env.NELYO_LOCAL_POSTGRES_HOST ?? "127.0.0.1",
    port: parsePort(env.NELYO_LOCAL_POSTGRES_PORT, 55432),
    database: env.NELYO_LOCAL_POSTGRES_DB ?? "nelyohealth_local",
    user: env.NELYO_LOCAL_POSTGRES_USER ?? "nelyohealth",
    password: env.NELYO_LOCAL_POSTGRES_PASSWORD ?? "localdev",
    ssl: env.NELYO_LOCAL_POSTGRES_SSL === "true"
  };
}

export function assertSafeDatabaseCommandEnvironment(
  command: "migrate" | "seed" | "reset" | "status" | "rollback",
  env: NodeJS.ProcessEnv = process.env
): void {
  const nodeEnv = (env.NODE_ENV ?? "development").toLowerCase();
  const declaredEnv = (env.NELYO_DEPLOYMENT_ENV ?? "local").toLowerCase();

  if (nodeEnv === "production" || declaredEnv === "production") {
    throw new Error(
      `Refusing to run db:${command} when NODE_ENV or NELYO_DEPLOYMENT_ENV is production.`
    );
  }

  if (env.NELYO_ALLOW_PRODUCTION_DB_COMMANDS === "true") {
    throw new Error(
      "NELYO_ALLOW_PRODUCTION_DB_COMMANDS=true is forbidden for Phase 2 database foundation commands."
    );
  }
}

export function deterministicSyntheticSeedRows(seedVersion = "p02-iss-004-v1"): SyntheticSeedRow[] {
  return [
    {
      seedKey: "synthetic.system.region",
      seedValue: "sandbox-west",
      seedVersion
    },
    {
      seedKey: "synthetic.system.release_channel",
      seedValue: "phase-2-foundation",
      seedVersion
    },
    {
      seedKey: "synthetic.system.seed_marker",
      seedValue: "SYNTHETIC_ONLY",
      seedVersion
    }
  ];
}

export {
  createDomainEventEnvelope,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  runTransactionalWorkWithOutbox,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  type DispatchStatus,
  type DomainEventEnvelope,
  type DomainEventPublisher,
  type DomainEventSafeContext,
  type OutboxEventRecord,
  type TransactionAdapter,
  type TransactionalOutboxPort,
  type TransactionWorkContext
} from "./transaction-outbox.js";

export {
  DuplicateIdentityError,
  addAddress,
  addContactPoint,
  addExternalIdentity,
  createPerson,
  createUserAccount,
  findExternalIdentity,
  findUserAccountByLoginEmail,
  findUserAccountByLoginPhone,
  getPersonById,
  getUserAccountById,
  listAddressesForPerson,
  listContactPoints,
  markContactPointVerified,
  setPrimaryAddress,
  setPrimaryContactPoint,
  updateUserAccountStatus,
  type ContactPointKind,
  type ExternalIdentityProvider,
  type UserAccountStatus
} from "./identity-repository.js";

export {
  assignRole,
  createFacility,
  createInvitation,
  createMembership,
  createOrganization,
  getInvitationById,
  getMembershipById,
  getOrganizationById,
  listFacilitiesForOrganization,
  listMembershipsForPerson,
  listRoleAssignmentsForMembership,
  updateInvitationStatus,
  updateMembershipStatus,
  updateOrganizationStatus,
  updateRoleAssignmentStatus
} from "./tenancy-repository.js";

export {
  createDatabaseClient,
  createDatabasePool,
  localDatabaseConfigFromEnv,
  type DatabaseClientConfig
} from "./client.js";

export {
  elevateSession,
  createSession,
  getDeviceById,
  getSessionById,
  listActiveSessionsForAccount,
  listAuthenticationEventsForAccount,
  recordAuthenticationEvent,
  registerDevice,
  revokeSessionsForAccount,
  setDeviceTrusted,
  type AuthenticationEventMethod,
  type AuthenticationEventResult,
  type SessionAuthLevel
} from "./session-repository.js";

export { PgOutboxStore, PgTransactionAdapter } from "./pg-outbox.js";

export {
  assertSafeAuditEvent,
  runTransactionalCommand,
  SyntheticInMemoryAuditSink,
  type AuditEventRecord,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type CommandDescriptor,
  type TransactionalCommandContext,
  type TransactionalCommandResult
} from "./transactional-command.js";

export { PgAuditSink, listAuditEventsForAggregate, readAuditEventById } from "./pg-audit.js";

export {
  countRecentAuthenticationFailures,
  createPasswordCredential,
  getPasswordCredentialByUserAccountId,
  type PasswordCredential
} from "./password-credential-repository.js";
