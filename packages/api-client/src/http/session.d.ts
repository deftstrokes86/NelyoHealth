/**
 * Session context HTTP contract (roadmap M7.1). The caller's resolved persona /
 * workspace, as returned by `GET /api/session/context` — "who am I / what am I
 * acting as". Reference identity + capability labels only; no PHI.
 */
export interface SessionContextDto {
    accountId: string;
    personId: string;
    workspace: string;
    persona: {
        kind: string;
        actorRole: string;
        actorRoles: string[];
    };
    activeTenantId: string | null;
    sessionStatus: string;
}
//# sourceMappingURL=session.d.ts.map