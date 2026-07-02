export type BreakGlassAccessStatus =
  | "requested"
  | "active"
  | "expired"
  | "review-completed";

export interface BreakGlassReviewDraft {
  reviewId: string;
  reviewedByActorId: string;
  reviewedAt: string;
  outcome: "approved" | "rejected" | "follow-up-required";
  notes?: string;
}

export interface BreakGlassAccessDraft {
  accessId: string;
  actorId: string;
  patientId: string;
  organizationId: string;
  reason: string;
  requestedAt: string;
  ttlMinutes: number;
  expiresAt: string;
  status: BreakGlassAccessStatus;
  activatedAt?: string;
  complianceNotifiedAt?: string;
  complianceNotificationId?: string;
  reviews: BreakGlassReviewDraft[];
}

export interface PatientBreakGlassHistoryEntry {
  accessId: string;
  actorId: string;
  patientId: string;
  organizationId: string;
  reason: string;
  usedAt: string;
  expiresAt: string;
  status: BreakGlassAccessStatus;
  reviewOutcome?: BreakGlassReviewDraft["outcome"];
  reviewedAt?: string;
}

export interface BreakGlassRepository {
  save(access: BreakGlassAccessDraft): BreakGlassAccessDraft;
  getById(accessId: string): BreakGlassAccessDraft | null;
  listByPatient(patientId: string, organizationId: string): BreakGlassAccessDraft[];
}

export interface ComplianceNotifier {
  notifyBreakGlassUsage(input: {
    accessId: string;
    actorId: string;
    patientId: string;
    organizationId: string;
    reason: string;
    requestedAt: string;
    activatedAt: string;
    expiresAt: string;
  }): { notificationId: string; notifiedAt: string };
}

export class InMemoryBreakGlassRepository implements BreakGlassRepository {
  private readonly records = new Map<string, BreakGlassAccessDraft>();

  save(access: BreakGlassAccessDraft): BreakGlassAccessDraft {
    const copy = createBreakGlassAccessDraft(access);
    this.records.set(copy.accessId, copy);
    return createBreakGlassAccessDraft(copy);
  }

  getById(accessId: string): BreakGlassAccessDraft | null {
    const access = this.records.get(accessId);
    return access ? createBreakGlassAccessDraft(access) : null;
  }

  listByPatient(patientId: string, organizationId: string): BreakGlassAccessDraft[] {
    return [...this.records.values()]
      .filter((access) => access.patientId === patientId && access.organizationId === organizationId)
      .map((access) => createBreakGlassAccessDraft(access));
  }
}

export class InMemoryComplianceNotifier implements ComplianceNotifier {
  readonly notifications: Array<{
    notificationId: string;
    accessId: string;
    actorId: string;
    patientId: string;
    organizationId: string;
    reason: string;
    requestedAt: string;
    activatedAt: string;
    expiresAt: string;
    notifiedAt: string;
  }> = [];

  notifyBreakGlassUsage(input: {
    accessId: string;
    actorId: string;
    patientId: string;
    organizationId: string;
    reason: string;
    requestedAt: string;
    activatedAt: string;
    expiresAt: string;
  }): { notificationId: string; notifiedAt: string } {
    const notifiedAt = input.activatedAt;
    const notificationId = `compliance-${input.accessId}-${notifiedAt}`;

    this.notifications.push({
      notificationId,
      ...input,
      notifiedAt
    });

    return {
      notificationId,
      notifiedAt
    };
  }
}

export interface RequestBreakGlassAccessInput {
  accessId: string;
  actorId: string;
  patientId: string;
  organizationId: string;
  reason: string;
  requestedAt: string;
  ttlMinutes: number;
}

export interface ActivateBreakGlassAccessInput {
  accessId: string;
  activatedAt: string;
}

export interface ReviewBreakGlassAccessInput {
  accessId: string;
  reviewId: string;
  reviewedByActorId: string;
  reviewedAt: string;
  outcome: BreakGlassReviewDraft["outcome"];
  notes?: string;
}

export interface ListPatientBreakGlassHistoryInput {
  patientId: string;
  organizationId: string;
}

export class BreakGlassNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BreakGlassNotFoundError";
  }
}

export class BreakGlassExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BreakGlassExpiredError";
  }
}

export class BreakGlassValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BreakGlassValidationError";
  }
}

export class BreakGlassWorkflowService {
  constructor(
    private readonly repository: BreakGlassRepository,
    private readonly complianceNotifier: ComplianceNotifier
  ) {}

  requestAccess(input: RequestBreakGlassAccessInput): BreakGlassAccessDraft {
    if (!input.reason.trim()) {
      throw new BreakGlassValidationError("Break-glass reason is required.");
    }

    if (input.ttlMinutes <= 0 || input.ttlMinutes > 15) {
      throw new BreakGlassValidationError("Break-glass TTL must be between 1 and 15 minutes.");
    }

    const requestedAtMs = Date.parse(input.requestedAt);
    if (Number.isNaN(requestedAtMs)) {
      throw new BreakGlassValidationError("Break-glass requestedAt must be a valid timestamp.");
    }

    const expiresAt = new Date(requestedAtMs + input.ttlMinutes * 60_000).toISOString();

    return this.repository.save({
      accessId: input.accessId,
      actorId: input.actorId,
      patientId: input.patientId,
      organizationId: input.organizationId,
      reason: input.reason,
      requestedAt: input.requestedAt,
      ttlMinutes: input.ttlMinutes,
      expiresAt,
      status: "requested",
      reviews: []
    });
  }

  activateAccess(input: ActivateBreakGlassAccessInput): BreakGlassAccessDraft {
    const access = this.mustGet(input.accessId);

    const activatedAtMs = Date.parse(input.activatedAt);
    const expiresAtMs = Date.parse(access.expiresAt);
    if (!Number.isNaN(activatedAtMs) && !Number.isNaN(expiresAtMs) && activatedAtMs > expiresAtMs) {
      const expired = this.repository.save({
        ...access,
        status: "expired"
      });

      throw new BreakGlassExpiredError(
        `Break-glass access expired for ${input.accessId} at ${expired.expiresAt}`
      );
    }

    const notification = this.complianceNotifier.notifyBreakGlassUsage({
      accessId: access.accessId,
      actorId: access.actorId,
      patientId: access.patientId,
      organizationId: access.organizationId,
      reason: access.reason,
      requestedAt: access.requestedAt,
      activatedAt: input.activatedAt,
      expiresAt: access.expiresAt
    });

    return this.repository.save({
      ...access,
      status: "active",
      activatedAt: input.activatedAt,
      complianceNotificationId: notification.notificationId,
      complianceNotifiedAt: notification.notifiedAt
    });
  }

  reviewAccess(input: ReviewBreakGlassAccessInput): BreakGlassAccessDraft {
    const access = this.mustGet(input.accessId);

    const review: BreakGlassReviewDraft = {
      reviewId: input.reviewId,
      reviewedByActorId: input.reviewedByActorId,
      reviewedAt: input.reviewedAt,
      outcome: input.outcome,
      notes: input.notes
    };

    return this.repository.save({
      ...access,
      status: "review-completed",
      reviews: [...access.reviews, review]
    });
  }

  listPatientVisibleHistory(input: ListPatientBreakGlassHistoryInput): PatientBreakGlassHistoryEntry[] {
    return this.repository
      .listByPatient(input.patientId, input.organizationId)
      .filter((access) => access.status !== "requested")
      .sort((left, right) => Date.parse(right.requestedAt) - Date.parse(left.requestedAt))
      .map((access) => {
        const latestReview = access.reviews.length > 0 ? access.reviews[access.reviews.length - 1] : null;

        return {
          accessId: access.accessId,
          actorId: access.actorId,
          patientId: access.patientId,
          organizationId: access.organizationId,
          reason: access.reason,
          usedAt: access.activatedAt ?? access.requestedAt,
          expiresAt: access.expiresAt,
          status: access.status,
          reviewOutcome: latestReview?.outcome,
          reviewedAt: latestReview?.reviewedAt
        };
      });
  }

  getAccess(accessId: string): BreakGlassAccessDraft | null {
    return this.repository.getById(accessId);
  }

  private mustGet(accessId: string): BreakGlassAccessDraft {
    const access = this.repository.getById(accessId);
    if (!access) {
      throw new BreakGlassNotFoundError(`Break-glass access not found: ${accessId}`);
    }

    return access;
  }
}

export function createBreakGlassAccessDraft(input: BreakGlassAccessDraft): BreakGlassAccessDraft {
  return {
    ...input,
    reviews: input.reviews.map((review) => ({ ...review }))
  };
}
