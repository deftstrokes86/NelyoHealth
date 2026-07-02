export interface AuditStateSnapshot {
  [key: string]: unknown;
}

export interface AuditDeviceMetadata {
  deviceId: string;
  deviceType: string;
  userAgent: string;
}

export interface AuditEventDraft {
  eventId: string;
  eventVersion: number;
  appendOnly: true;
  actorId: string;
  subjectId: string;
  organizationId: string;
  action: string;
  resource: string;
  purpose: string;
  occurredAt: string;
  requestId: string;
  ipAddress: string;
  device: AuditDeviceMetadata;
  breakGlassUsed: boolean;
  priorState: AuditStateSnapshot | null;
  newState: AuditStateSnapshot | null;
  supersedesEventId?: string;
  amendmentReason?: string;
}

export interface AuditEventRepository {
  save(event: AuditEventDraft): AuditEventDraft;
  getById(eventId: string): AuditEventDraft | null;
  listAll(): AuditEventDraft[];
}

export class InMemoryAuditEventRepository implements AuditEventRepository {
  private readonly records = new Map<string, AuditEventDraft>();

  save(event: AuditEventDraft): AuditEventDraft {
    const copy = createAuditEventDraft(event);
    this.records.set(copy.eventId, copy);
    return createAuditEventDraft(copy);
  }

  getById(eventId: string): AuditEventDraft | null {
    const event = this.records.get(eventId);
    return event ? createAuditEventDraft(event) : null;
  }

  listAll(): AuditEventDraft[] {
    return [...this.records.values()].map((event) => createAuditEventDraft(event));
  }
}

export interface AppendAuditEventInput {
  eventId: string;
  actorId: string;
  subjectId: string;
  organizationId: string;
  action: string;
  resource: string;
  purpose: string;
  occurredAt: string;
  requestId: string;
  ipAddress: string;
  device: AuditDeviceMetadata;
  breakGlassUsed: boolean;
  priorState?: AuditStateSnapshot;
  newState?: AuditStateSnapshot;
}

export interface AmendAuditEventInput {
  amendmentEventId: string;
  targetEventId: string;
  actorId: string;
  subjectId: string;
  organizationId: string;
  action: string;
  resource: string;
  purpose: string;
  occurredAt: string;
  requestId: string;
  ipAddress: string;
  device: AuditDeviceMetadata;
  breakGlassUsed: boolean;
  priorState: AuditStateSnapshot;
  newState: AuditStateSnapshot;
  amendmentReason: string;
}

export interface MutationAttemptInput {
  eventId: string;
  attemptedOperation: "update" | "delete";
  attemptedAt: string;
  actorId: string;
}

export class AuditAppendOnlyViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditAppendOnlyViolationError";
  }
}

export class AuditEventNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditEventNotFoundError";
  }
}

export class AuditEventWorkflowService {
  constructor(private readonly repository: AuditEventRepository) {}

  appendEvent(input: AppendAuditEventInput): AuditEventDraft {
    if (this.repository.getById(input.eventId)) {
      throw new AuditAppendOnlyViolationError(
        `Audit event already exists and cannot be overwritten: ${input.eventId}`
      );
    }

    const event = createAuditEventDraft({
      eventId: input.eventId,
      eventVersion: 1,
      appendOnly: true,
      actorId: input.actorId,
      subjectId: input.subjectId,
      organizationId: input.organizationId,
      action: input.action,
      resource: input.resource,
      purpose: input.purpose,
      occurredAt: input.occurredAt,
      requestId: input.requestId,
      ipAddress: input.ipAddress,
      device: input.device,
      breakGlassUsed: input.breakGlassUsed,
      priorState: input.priorState ?? null,
      newState: input.newState ?? null
    });

    return this.repository.save(event);
  }

  appendAmendment(input: AmendAuditEventInput): AuditEventDraft {
    const targetEvent = this.repository.getById(input.targetEventId);
    if (!targetEvent) {
      throw new AuditEventNotFoundError(`Audit event not found: ${input.targetEventId}`);
    }

    if (this.repository.getById(input.amendmentEventId)) {
      throw new AuditAppendOnlyViolationError(
        `Audit event already exists and cannot be overwritten: ${input.amendmentEventId}`
      );
    }

    const amendment = createAuditEventDraft({
      eventId: input.amendmentEventId,
      eventVersion: targetEvent.eventVersion + 1,
      appendOnly: true,
      actorId: input.actorId,
      subjectId: input.subjectId,
      organizationId: input.organizationId,
      action: input.action,
      resource: input.resource,
      purpose: input.purpose,
      occurredAt: input.occurredAt,
      requestId: input.requestId,
      ipAddress: input.ipAddress,
      device: input.device,
      breakGlassUsed: input.breakGlassUsed,
      priorState: input.priorState,
      newState: input.newState,
      supersedesEventId: targetEvent.eventId,
      amendmentReason: input.amendmentReason
    });

    return this.repository.save(amendment);
  }

  rejectMutationAttempt(input: MutationAttemptInput): never {
    throw new AuditAppendOnlyViolationError(
      `Append-only audit store rejected ${input.attemptedOperation} for ${input.eventId} at ${input.attemptedAt} by ${input.actorId}`
    );
  }

  getEvent(eventId: string): AuditEventDraft | null {
    return this.repository.getById(eventId);
  }
}

export function createAuditEventDraft(input: AuditEventDraft): AuditEventDraft {
  return {
    ...input,
    appendOnly: true,
    device: {
      ...input.device
    },
    priorState: input.priorState ? { ...input.priorState } : null,
    newState: input.newState ? { ...input.newState } : null
  };
}
