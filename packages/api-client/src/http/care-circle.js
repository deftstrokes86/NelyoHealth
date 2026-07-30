export function createCareCircleMemberDto(fields) {
    return {
        memberRef: fields.memberRef,
        actorRef: fields.actorRef,
        relationshipType: fields.relationshipType,
        membershipStatus: fields.membershipStatus,
        permittedActions: [...fields.permittedActions],
        effectiveDate: fields.effectiveDate,
        expiryDate: fields.expiryDate
    };
}
export function createWardDto(fields) {
    return {
        patientRef: fields.patientRef,
        relationshipType: fields.relationshipType,
        membershipStatus: fields.membershipStatus,
        permittedActions: [...fields.permittedActions],
        effectiveDate: fields.effectiveDate,
        expiryDate: fields.expiryDate
    };
}
//# sourceMappingURL=care-circle.js.map