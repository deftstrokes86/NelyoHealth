export function createTimelineEntryDto(fields) {
    return {
        entryId: fields.entryId,
        resourceDomain: fields.resourceDomain,
        entryType: fields.entryType,
        aggregateRef: fields.aggregateRef,
        occurredAt: fields.occurredAt
    };
}
//# sourceMappingURL=timeline.js.map