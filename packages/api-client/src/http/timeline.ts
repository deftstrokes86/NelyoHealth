/**
 * Timeline HTTP contract (roadmap M7, exposes ADR-0013's read service).
 *
 * Reference-only: an entry carries a deep-link target (`aggregateRef`) and the
 * facts needed to render one row — never clinical content. `create*` builds the
 * DTO field-by-field (allowlist construction) so a server-side object can never
 * leak internal fields (sourceEventRef, organizationRef, patientRef) by spread.
 */
export type TimelineResourceDomainDto =
  | "appointment"
  | "consultation"
  | "medication"
  | "lab"
  | "clinical-record"
  | "document"
  | "message";

export interface TimelineEntryDto {
  entryId: string;
  resourceDomain: TimelineResourceDomainDto;
  entryType: string;
  aggregateRef: string;
  occurredAt: string;
}

export interface TimelinePageDto {
  entries: TimelineEntryDto[];
  /** Opaque keyset cursor for the next (older) page; null when exhausted. */
  nextCursor: string | null;
}

export interface ReadTimelineQueryDto {
  limit?: number;
  cursor?: string;
}

export function createTimelineEntryDto(fields: {
  entryId: string;
  resourceDomain: TimelineResourceDomainDto;
  entryType: string;
  aggregateRef: string;
  occurredAt: string;
}): TimelineEntryDto {
  return {
    entryId: fields.entryId,
    resourceDomain: fields.resourceDomain,
    entryType: fields.entryType,
    aggregateRef: fields.aggregateRef,
    occurredAt: fields.occurredAt
  };
}
