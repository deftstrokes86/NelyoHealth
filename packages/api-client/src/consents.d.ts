export interface ConsentDraftDto {
    consentId: string;
    subjectId: string;
    grantedTo: string;
    scope: string;
    status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
    effectiveAt: string;
    revokedAt: string | null;
}
export interface ConsentDraftRequestDto {
    consentId: string;
    subjectId: string;
    grantedTo: string;
    scope: string;
    status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
    effectiveAt: string;
    revokedAt: string | null;
}
export declare function createConsentDraftDto(input: ConsentDraftRequestDto): ConsentDraftDto;
//# sourceMappingURL=consents.d.ts.map