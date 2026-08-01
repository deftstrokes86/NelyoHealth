import { describe, expect, it } from "vitest";
import {
  DASHBOARDS,
  INTEGRATIONS,
  PERSONAS,
  REPORTS,
  SEARCH_SCOPES,
  TOOLS,
  composeSurface,
  contractHasTool,
  findEvent,
  findSearchScope,
  integrationSchema,
  reportSchema,
  resolveToolContract,
  searchScopeSchema,
  validatePlatformRegistry
} from "../../packages/platform-registry/src/index.js";

/**
 * M8.3d Search / Report / Integration registries + the AI-and-Automation consumer
 * contract. These tests pin the policy rules the layer enforces structurally — ADR-0010
 * analytics, unattended writes, search reach vs classification — and the completion
 * claim that no forward reference remains.
 */
const ids = (entries: { id: string }[]) => entries.map((e) => e.id);

describe("search registry (M8.3d)", () => {
  it("declares reach and result classification on every scope", () => {
    for (const scope of SEARCH_SCOPES) {
      expect(scope.reach).toBeTruthy();
      expect(scope.resultClassification).toBeTruthy();
      expect(scope.fields.length).toBeGreaterThan(0);
    }
    expect(findSearchScope("my-documents")?.resultClassification).toBe("PROTECTED-CLINICAL-DATA");
    expect(findSearchScope("provider-directory")?.resultClassification).toBe("PUBLIC");
  });

  it("refuses cross-organization reach over clinical or sensitive results", () => {
    const base = {
      id: "fishing-scope",
      label: "Bad",
      description: "Cross-org clinical search.",
      resource: "clinical-record",
      appliesToWorkspaceKinds: ["organization"],
      reach: "cross-organization",
      fields: [{ name: "summary" }]
    };
    expect(() =>
      searchScopeSchema.parse({ ...base, resultClassification: "PROTECTED-CLINICAL-DATA" })
    ).toThrow();
    expect(() =>
      searchScopeSchema.parse({ ...base, resultClassification: "SENSITIVE-PERSONAL-DATA" })
    ).toThrow();
    // The same reach over public directory data is legitimate.
    expect(() =>
      searchScopeSchema.parse({ ...base, resultClassification: "PUBLIC" })
    ).not.toThrow();
  });
});

describe("report registry (M8.3d)", () => {
  it("enforces ADR-0010 structurally: analytics is never row-level PHI", () => {
    const base = {
      id: "bad-analytics",
      label: "Bad",
      description: "Analytics over identified rows.",
      kind: "analytics",
      domain: "analytics",
      appliesToWorkspaceKinds: ["organization"],
      sourceEvents: ["AppointmentBooked"],
      delivery: ["in-app"]
    };
    expect(() =>
      reportSchema.parse({
        ...base,
        aggregation: "row-level",
        classification: "DEIDENTIFIED-OR-AGGREGATED-DATA"
      })
    ).toThrow();
    expect(() =>
      reportSchema.parse({
        ...base,
        aggregation: "de-identified",
        classification: "PROTECTED-CLINICAL-DATA"
      })
    ).toThrow();
    // A row-level clinical report is still expressible — as a clinical report.
    expect(() =>
      reportSchema.parse({
        ...base,
        kind: "clinical",
        domain: "clinical",
        aggregation: "row-level",
        classification: "PROTECTED-CLINICAL-DATA"
      })
    ).not.toThrow();
  });

  it("sources every analytics report from analytics-visible events only", () => {
    for (const report of REPORTS) {
      if (report.kind !== "analytics") continue;
      for (const eventId of report.sourceEvents) {
        expect(findEvent(eventId)?.analyticsVisible).toBe(true);
      }
    }
  });
});

describe("integration registry (M8.3d)", () => {
  it("refuses anonymous or unagreed boundaries for non-public data", () => {
    const base = {
      id: "bad-integration",
      label: "Bad",
      description: "An outbound clinical feed.",
      direction: "outbound",
      protocol: "rest",
      counterparty: "laboratory",
      classification: "PROTECTED-CLINICAL-DATA"
    };
    // Unauthenticated egress of clinical data.
    expect(() => integrationSchema.parse({ ...base, auth: "none" })).toThrow();
    // Authenticated, but no processor agreement.
    expect(() =>
      integrationSchema.parse({ ...base, auth: "mtls", processorAgreement: false })
    ).toThrow();
    expect(() =>
      integrationSchema.parse({ ...base, auth: "mtls", processorAgreement: true })
    ).not.toThrow();
  });

  it("holds a processor agreement on every non-public boundary that sends data", () => {
    for (const integration of INTEGRATIONS) {
      if (integration.classification === "PUBLIC") continue;
      if (integration.direction === "inbound" && !integration.crossBorder) continue;
      expect(integration.processorAgreement).toBe(true);
    }
  });
});

describe("tool contract — AI and automation as consumers (M8.3d)", () => {
  it("offers a persona the tools its composition supports on the named surface", () => {
    const ui = resolveToolContract("personal", "patient", "ui");
    expect(ui.active).toBe(true);
    expect(contractHasTool(ui, "book-appointment")).toBe(true);
    expect(contractHasTool(ui, "send-message")).toBe(true);

    // The AI surface sees only tools that declare AI support — same registry, same
    // capabilities, narrower compatibility.
    const ai = resolveToolContract("personal", "patient", "ai");
    expect(contractHasTool(ai, "book-appointment")).toBe(true);
    expect(contractHasTool(ai, "send-message")).toBe(false);
    expect(ai.withheld).toContainEqual({ toolId: "send-message", reason: "surface-unsupported" });
  });

  it("withholds tools whose capability the persona does not compose, with a reason", () => {
    const clinician = resolveToolContract("hospital", "clinician", "ui");
    // A clinician composes no appointment.book capability.
    expect(contractHasTool(clinician, "book-appointment")).toBe(false);
    expect(clinician.withheld).toContainEqual({
      toolId: "book-appointment",
      reason: "capability-not-composed"
    });
  });

  it("never hands an unattended surface a silent write", () => {
    for (const surface of ["ai", "automation"] as const) {
      const contract = resolveToolContract("personal", "patient", surface);
      for (const offered of contract.tools) {
        if (offered.effect === "write") expect(offered.requiresApproval).toBe(true);
      }
    }
    // The same rule is enforced on the data itself by the validation gate.
    for (const tool of TOOLS) {
      const unattended = tool.compatibility.supportsAI || tool.compatibility.supportsAutomation;
      if (tool.effect === "write" && unattended) {
        expect(tool.compatibility.requiresApproval).toBe(true);
      }
    }
  });

  it("fails CLOSED: an inactive composition offers nothing and says why", () => {
    const contract = resolveToolContract("nope", "pharmacist", "ai");
    expect(contract.active).toBe(false);
    expect(contract.reasonCode).toBe("workspace-unknown");
    expect(contract.tools).toEqual([]);
    // Every tool is reported withheld, so "no tools" is distinguishable from "unresolved".
    expect(contract.withheld).toHaveLength(TOOLS.length);
    expect(contract.withheld.every((w) => w.reason === "composition-inactive")).toBe(true);
  });
});

describe("composeSurface — search and reports (M8.3d)", () => {
  it("composes a patient's search scopes and reports in declared order", () => {
    const patient = composeSurface("personal", "patient");
    expect(ids(patient.search)).toEqual([
      "my-appointments",
      "my-documents",
      "my-messages",
      "provider-directory"
    ]);
    expect(ids(patient.reports)).toEqual(["my-care-summary"]);
  });

  it("filters a caregiver's scopes down to the capabilities they compose", () => {
    const caregiver = composeSurface("personal", "caregiver");
    // No document.read -> no document search.
    expect(ids(caregiver.search)).toEqual(["my-appointments", "my-messages", "provider-directory"]);
    expect(caregiver.reports).toEqual([]);
  });

  it("never composes a `planned` scope or report", () => {
    const admin = composeSurface("hospital", "organization-admin");
    // `platform-demand-trends` is declared on the persona but still planned.
    expect(PERSONAS.find((p) => p.id === "organization-admin")?.reports).toContain(
      "platform-demand-trends"
    );
    expect(ids(admin.reports)).toEqual([
      "clinic-activity",
      "schedule-utilisation",
      "consent-evidence"
    ]);
  });
});

describe("registry completion (M8.3d)", () => {
  it("is coherent with every registry wired in", () => {
    expect(validatePlatformRegistry()).toEqual([]);
  });

  it("leaves no forward reference: every live persona resolves search and reports", () => {
    for (const persona of ["patient", "guardian", "clinician", "organization-admin"]) {
      const entry = PERSONAS.find((p) => p.id === persona)!;
      expect(entry.searchScopes.length).toBeGreaterThan(0);
      for (const id of entry.searchScopes) expect(findSearchScope(id)).toBeDefined();
    }
  });

  it("leaves no orphaned tool: every tool is reachable through a dashboard widget", () => {
    const reachable = new Set(
      DASHBOARDS.flatMap((d) => d.widgets.map((w) => w.tool)).filter(
        (tool): tool is string => tool !== null
      )
    );
    for (const tool of TOOLS) expect(reachable.has(tool.id)).toBe(true);
  });
});
