import type { Pool, PoolClient } from "pg";
import {
  listTimelineForPatient,
  type PersistedTimelineEntry,
  type TimelineResourceDomain
} from "@nelyohealth/database";
import {
  resolveAndDecideResourceAccess,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import { decideSelfAccessAndAudit, resolveDecideAndAuditAccess } from "./access-audit.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Timeline read service (roadmap M6.5, ADR-0013).
 *
 * Reads the per-patient timeline projection with **read-time per-domain filtering**.
 * Two distinct kinds of decision (the filter-vs-access split — ADR-0013):
 *
 *  - ACCESS decision (audited, ONCE): may this reader read this patient's timeline
 *    at all? `resolveDecideAndAuditAccess`, resource `timeline`. A denied timeline
 *    read deny-audits normally.
 *
 *  - FILTER decisions (decide-only, per domain, NOT persisted): which domains'
 *    entries return? Each domain is gated by the SAME decision kind as that domain's
 *    OWN read path (the visibility invariant). These are expected filter outcomes,
 *    not access-attempt denials, so they must NOT emit deny-audit rows (that would
 *    bury real denials under ~one row per unavailable domain per page load).
 *
 * Messaging is participant/self-scoped, NOT consent-scoped: a care-circle member
 * with broad consent still cannot list a patient's threads, so message entries are
 * visible only to the participant/self scope (in M6.5: the patient) — never gated
 * by a consent decision (which would leak message-activity metadata).
 */

export type TimelineAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface TimelineServiceDeps {
  pool: Pool;
}

export function createPgTimelineServiceDeps(pool: Pool): TimelineServiceDeps {
  return { pool };
}

/** Each domain's filter uses its own read-path resource; "self" = participant/self. */
const DOMAIN_READ_RESOURCE: Record<TimelineResourceDomain, string | "self"> = {
  appointment: "appointment",
  consultation: "consultation",
  medication: "prescription",
  lab: "laboratory",
  "clinical-record": "clinical-record-summary",
  document: "document",
  message: "self"
};

export type ReadTimelineOutcome =
  | {
      status: "allowed";
      entries: PersistedTimelineEntry[];
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a patient's timeline: decide access (audited) BEFORE loading, then filter the
 * loaded entries per domain by decide-only decisions (not audited).
 */
export async function readPatientTimeline(
  deps: TimelineServiceDeps,
  input: {
    access: TimelineAccessContext;
    /**
     * Server-derived (ADR-0014): the reader IS the data subject. Set only by the
     * trust seam after it verified the identity linkage — never a client claim.
     * When true, access routes to the SELF decision kind (consent inapplicable)
     * and every domain is self-visible.
     */
    subjectIsSelf?: boolean;
    limit?: number;
    before?: { occurredAt: string; entryId: string };
  }
): Promise<ReadTimelineOutcome> {
  // ACCESS decision (audited, once) — self kind for a data subject, else the
  // composed consent/relationship/break-glass pipeline for a third party.
  const decision = input.subjectIsSelf
    ? await decideSelfAccessAndAudit(deps.pool, {
        decisionRequestId: input.access.decisionRequestId,
        actorId: input.access.actorId,
        actorRole: input.access.actorRole,
        actorType: input.access.actorType,
        subjectRef: input.access.patientId,
        subjectVerified: true,
        workspace: "personal",
        requestedResource: "timeline",
        requestedAction: "read",
        purpose: input.access.purpose,
        sessionStatus: input.access.sessionStatus,
        evaluatedAt: input.access.evaluatedAt
      })
    : await resolveDecideAndAuditAccess(deps.pool, {
        ...input.access,
        requestedResource: "timeline",
        requestedAction: "read"
      });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const entries = await withClient(deps.pool, (client) =>
    listTimelineForPatient(client, {
      patientRef: input.access.patientId,
      limit: input.limit,
      before: input.before
    })
  );

  // A data subject sees every domain of their own timeline (self-scope); no
  // per-domain consent filter applies (there is no delegation to gate).
  if (input.subjectIsSelf) {
    return { status: "allowed", entries, decision };
  }

  // FILTER decisions (decide-only, per DISTINCT domain present — never audited).
  const domainsPresent = new Set(entries.map((entry) => entry.resourceDomain));
  const allowedDomains = new Set<TimelineResourceDomain>();
  for (const domain of domainsPresent) {
    if (await isDomainVisible(deps.pool, input.access, domain)) {
      allowedDomains.add(domain);
    }
  }

  return {
    status: "allowed",
    entries: entries.filter((entry) => allowedDomains.has(entry.resourceDomain)),
    decision
  };
}

async function isDomainVisible(
  pool: Pool,
  access: TimelineAccessContext,
  domain: TimelineResourceDomain
): Promise<boolean> {
  const resource = DOMAIN_READ_RESOURCE[domain];
  if (resource === "self") {
    // Messaging: participant/self scope — in M6.5, the patient only. A consent
    // decision would leak message-activity metadata to consent-granted viewers.
    return access.actorId === access.patientId;
  }
  // Consent-gated domain: the domain's own read decision, DECIDE-ONLY (no audit).
  const decision = await resolveAndDecideResourceAccess(pool, {
    ...access,
    requestedResource: resource,
    requestedAction: "read"
  });
  return decision.status === "allowed";
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
