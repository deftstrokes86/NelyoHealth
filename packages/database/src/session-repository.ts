import type { ClientBase } from "pg";
import type { AuthenticationEvent, Device, Session } from "@nelyohealth/domain";

/**
 * Session / device / authentication-event repository (roadmap M1.2).
 *
 * Owns SQL for the session tables in nelyo_identity. Client-parameterized so
 * callers control the transaction boundary; from M3.x mutations run inside
 * the transactional-command path. authentication_event is append-only by
 * construction: no update or delete functions are exposed.
 */

export type SessionAuthLevel = NonNullable<Session["authLevel"]>;
export type AuthenticationEventResult = AuthenticationEvent["result"];
export type AuthenticationEventMethod = AuthenticationEvent["method"];

interface DeviceRow {
  id: string;
  user_account_id: string;
  display_name: string;
  trusted: boolean;
}

interface SessionRow {
  id: string;
  user_account_id: string;
  active_tenant_id: string | null;
  trusted_device_id: string | null;
  status: Session["status"];
  auth_level: SessionAuthLevel;
  expires_at: string | Date;
}

interface AuthenticationEventRow {
  id: string;
  user_account_id: string | null;
  tenant_id: string | null;
  result: AuthenticationEventResult;
  method: AuthenticationEventMethod;
  reason_code: string | null;
}

const SESSION_COLUMNS =
  "id, user_account_id, active_tenant_id, trusted_device_id, status, auth_level, expires_at";

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    userAccountId: row.user_account_id,
    displayName: row.display_name,
    trusted: row.trusted
  };
}

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    userAccountId: row.user_account_id,
    activeTenantId: row.active_tenant_id ?? undefined,
    trustedDeviceId: row.trusted_device_id ?? undefined,
    status: row.status,
    authLevel: row.auth_level,
    expiresAtIso: toIso(row.expires_at)
  };
}

function mapAuthenticationEvent(row: AuthenticationEventRow): AuthenticationEvent {
  return {
    id: row.id,
    userAccountId: row.user_account_id ?? undefined,
    tenantId: row.tenant_id ?? undefined,
    result: row.result,
    method: row.method,
    reasonCode: row.reason_code ?? undefined
  };
}

// ---------- Device ----------

export async function registerDevice(
  client: ClientBase,
  input: { userAccountId: string; displayName: string; trusted?: boolean }
): Promise<Device> {
  const result = await client.query<DeviceRow>(
    `INSERT INTO nelyo_identity.device (user_account_id, display_name, trusted)
     VALUES ($1, $2, $3)
     RETURNING id, user_account_id, display_name, trusted`,
    [input.userAccountId, input.displayName, input.trusted ?? false]
  );
  return mapDevice(result.rows[0]);
}

export async function setDeviceTrusted(
  client: ClientBase,
  deviceId: string,
  trusted: boolean
): Promise<Device | null> {
  const result = await client.query<DeviceRow>(
    `UPDATE nelyo_identity.device
     SET trusted = $2, last_seen_at = NOW()
     WHERE id = $1
     RETURNING id, user_account_id, display_name, trusted`,
    [deviceId, trusted]
  );
  return result.rows[0] ? mapDevice(result.rows[0]) : null;
}

export async function getDeviceById(client: ClientBase, deviceId: string): Promise<Device | null> {
  const result = await client.query<DeviceRow>(
    `SELECT id, user_account_id, display_name, trusted
     FROM nelyo_identity.device WHERE id = $1`,
    [deviceId]
  );
  return result.rows[0] ? mapDevice(result.rows[0]) : null;
}

// ---------- Session ----------

export async function createSession(
  client: ClientBase,
  input: {
    userAccountId: string;
    expiresAtIso: string;
    authLevel?: SessionAuthLevel;
    trustedDeviceId?: string;
    activeTenantId?: string;
  }
): Promise<Session> {
  const result = await client.query<SessionRow>(
    `INSERT INTO nelyo_identity.session
       (user_account_id, active_tenant_id, trusted_device_id, auth_level, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${SESSION_COLUMNS}`,
    [
      input.userAccountId,
      input.activeTenantId ?? null,
      input.trustedDeviceId ?? null,
      input.authLevel ?? "primary",
      input.expiresAtIso
    ]
  );
  return mapSession(result.rows[0]);
}

export async function getSessionById(
  client: ClientBase,
  sessionId: string
): Promise<Session | null> {
  const result = await client.query<SessionRow>(
    `SELECT ${SESSION_COLUMNS} FROM nelyo_identity.session WHERE id = $1`,
    [sessionId]
  );
  return result.rows[0] ? mapSession(result.rows[0]) : null;
}

export async function listActiveSessionsForAccount(
  client: ClientBase,
  userAccountId: string
): Promise<Session[]> {
  const result = await client.query<SessionRow>(
    `SELECT ${SESSION_COLUMNS}
     FROM nelyo_identity.session
     WHERE user_account_id = $1 AND status = 'active'
     ORDER BY created_at ASC`,
    [userAccountId]
  );
  return result.rows.map(mapSession);
}

/**
 * Elevate a session to MFA level. Guarded in SQL: only active, unexpired
 * sessions elevate — an expired or revoked session returns null.
 */
export async function elevateSession(
  client: ClientBase,
  sessionId: string
): Promise<Session | null> {
  const result = await client.query<SessionRow>(
    `UPDATE nelyo_identity.session
     SET auth_level = 'elevated', updated_at = NOW()
     WHERE id = $1 AND status = 'active' AND expires_at > NOW()
     RETURNING ${SESSION_COLUMNS}`,
    [sessionId]
  );
  return result.rows[0] ? mapSession(result.rows[0]) : null;
}

/** Revoke every active session for an account; returns the revoked sessions. */
export async function revokeSessionsForAccount(
  client: ClientBase,
  userAccountId: string
): Promise<Session[]> {
  const result = await client.query<SessionRow>(
    `UPDATE nelyo_identity.session
     SET status = 'revoked', revoked_at = NOW(), updated_at = NOW()
     WHERE user_account_id = $1 AND status = 'active'
     RETURNING ${SESSION_COLUMNS}`,
    [userAccountId]
  );
  return result.rows.map(mapSession);
}

// ---------- AuthenticationEvent (append-only) ----------

export async function recordAuthenticationEvent(
  client: ClientBase,
  input: {
    userAccountId?: string;
    tenantId?: string;
    result: AuthenticationEventResult;
    method: AuthenticationEventMethod;
    reasonCode?: string;
  }
): Promise<AuthenticationEvent> {
  const result = await client.query<AuthenticationEventRow>(
    `INSERT INTO nelyo_identity.authentication_event
       (user_account_id, tenant_id, result, method, reason_code)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_account_id, tenant_id, result, method, reason_code`,
    [
      input.userAccountId ?? null,
      input.tenantId ?? null,
      input.result,
      input.method,
      input.reasonCode ?? null
    ]
  );
  return mapAuthenticationEvent(result.rows[0]);
}

export async function listAuthenticationEventsForAccount(
  client: ClientBase,
  userAccountId: string,
  limit = 20
): Promise<AuthenticationEvent[]> {
  const result = await client.query<AuthenticationEventRow>(
    `SELECT id, user_account_id, tenant_id, result, method, reason_code
     FROM nelyo_identity.authentication_event
     WHERE user_account_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userAccountId, limit]
  );
  return result.rows.map(mapAuthenticationEvent);
}
