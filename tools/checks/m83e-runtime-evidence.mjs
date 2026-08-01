/**
 * M8.3e runtime evidence (roadmap M8.3e).
 *
 * Drives the runtime composition service exactly as the HTTP layer does and prints the
 * composed surfaces and tool contracts. This exists so the milestone's central claim —
 * "changing only registry data changes runtime behaviour" — is demonstrable on demand
 * rather than asserted: every difference below comes from registry data plus the acting
 * context, with no branch in the composition path.
 *
 * Run: node tools/checks/m83e-runtime-evidence.mjs
 */
import { performance } from "node:perf_hooks";
import {
  composeRuntimeSurface,
  resolveRuntimeToolContract
} from "../../apps/api/lib/platform-composition.js";

const ACTOR = { personId: "person-actor", accountId: "account-actor" };
const SUBJECT = "person-subject";

const ctx = (over = {}) => ({
  identity: ACTOR,
  sessionId: "s1",
  sessionStatus: "active",
  authLevel: "primary",
  activeTenantId: null,
  activeTenantValid: false,
  activeTenantReasonCode: "personal-context",
  workspace: "personal",
  workspaceId: "personal",
  persona: { kind: "personal", actorRole: "patient", actorRoles: ["patient"] },
  memberships: [],
  resolvedAt: new Date().toISOString(),
  ...over
});

const rel = (relationshipType) => [
  {
    relationshipId: "rel-1",
    relationshipType,
    status: "active",
    organizationRef: "org-1",
    effectiveDate: "2020-01-01T00:00:00.000Z",
    expiryDate: null
  }
];
const ports = (relationships) => ({
  listActiveRelationshipsForActorPatient: async () => relationships
});
const NONE = ports([]);

const org = (workspaceId, actorRole) =>
  ctx({
    workspace: "organization",
    workspaceId,
    activeTenantId: "org-1",
    persona: { kind: "organization", actorRole, actorRoles: [actorRole] }
  });

const line = (t) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

const show = async (title, portsIn, context, subject) => {
  const { target, composed } = await composeRuntimeSurface(portsIn, context, subject);
  console.log(`\n--- ${title}`);
  console.log(
    `  target      : workspace=${target.workspaceId} persona=${target.personaId} ` +
      `careCircleRole=${target.careCircleRoleId ?? "-"} reason=${target.reason}`
  );
  if (!composed.active) {
    console.log(`  composed    : INACTIVE (${composed.reasonCode}) - empty surface`);
    return;
  }
  console.log(`  capabilities: ${composed.capabilities.length}`);
  console.log(`  navigation  : ${composed.navigation.map((n) => n.id).join(", ") || "-"}`);
  console.log(`  landing     : ${composed.landingDashboard?.id ?? "-"}`);
  console.log(
    `  widgets     : ${
      composed.dashboards.flatMap((d) => d.widgets.map((w) => w.id)).join(", ") || "-"
    }`
  );
  console.log(`  homepage    : ${composed.homepage.map((h) => h.id).join(", ") || "-"}`);
  console.log(
    `  onboarding  : ${
      composed.onboarding.map((o) => `${o.id}(${o.steps.length} steps)`).join(", ") || "-"
    }`
  );
  console.log(`  profile     : ${composed.experienceProfile?.id ?? "-"}`);
  console.log(`  search      : ${composed.search.map((s) => s.id).join(", ") || "-"}`);
  console.log(`  reports     : ${composed.reports.map((r) => r.id).join(", ") || "-"}`);
};

line("1. PERSONA + SUBJECT SWITCHING (same actor, same session)");
await show("self (patient)", NONE, ctx(), null);
await show("subject = ward, guardian relationship", ports(rel("guardian")), ctx(), SUBJECT);
await show(
  "subject = ward, caregiver delegation",
  ports(rel("caregiver-delegation")),
  ctx(),
  SUBJECT
);
await show("subject = stranger (no capacity)", NONE, ctx(), "person-stranger");

line("2. DIASPORA - sponsor composing for a sponsored person");
await show("subject = sponsored person", ports(rel("sponsor")), ctx(), SUBJECT);

line("3. ORGANIZATION TYPE (only organizationType differs)");
await show("hospital / clinician", NONE, org("hospital", "clinician"), null);
await show("pharmacy / pharmacist", NONE, org("pharmacy", "pharmacist"), null);
await show("laboratory / lab-technician", NONE, org("laboratory", "lab-technician"), null);
await show("employer / employer-admin", NONE, org("employer", "employer-admin"), null);
await show("insurer / insurer-agent", NONE, org("insurer", "insurer-agent"), null);
await show("ngo / program-administrator", NONE, org("ngo", "program-administrator"), null);
await show(
  "government / program-administrator",
  NONE,
  org("government", "program-administrator"),
  null
);
await show("untyped organization (fails closed)", NONE, org(null, "clinician"), null);

line("4. TOOL CONTRACT - same registry, different consumer surfaces");
for (const consumer of ["ui", "ai", "automation", "offline"]) {
  const { composed } = await resolveRuntimeToolContract(NONE, ctx(), consumer, null);
  console.log(
    `  ${consumer.padEnd(11)}: available=[${composed.tools.map((t) => t.tool.id).join(", ")}] ` +
      `withheld=[${composed.withheld.map((w) => `${w.toolId}:${w.reason}`).join(", ")}]`
  );
}
const aiWard = await resolveRuntimeToolContract(ports(rel("guardian")), ctx(), "ai", SUBJECT);
console.log(
  `  ai(ward)   : available=[${aiWard.composed.tools
    .map((t) => `${t.tool.id}${t.requiresApproval ? "*approval" : ""}`)
    .join(", ")}]`
);

line("5. PERFORMANCE (in-process composition, 1000 iterations)");
for (const [label, portsIn, context, subject] of [
  ["self", NONE, ctx(), null],
  ["delegated", ports(rel("guardian")), ctx(), SUBJECT]
]) {
  const start = performance.now();
  for (let i = 0; i < 1000; i += 1) await composeRuntimeSurface(portsIn, context, subject);
  const total = performance.now() - start;
  console.log(
    `  ${label.padEnd(10)}: ${(total / 1000).toFixed(4)} ms/compose (${total.toFixed(1)} ms total)`
  );
}
