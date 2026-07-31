import {
  CAPABILITIES,
  TOOLS,
  WORKSPACES,
  PERSONAS,
  EVENTS,
  FEATURES,
  CARE_CIRCLE_ROLES,
  NOTIFICATION_ROUTES,
  WORKFLOWS,
  validatePlatformRegistry
} from "../lib/index.js";

/**
 * Platform Registry validation gate (roadmap M8.3). Runs cross-registry referential
 * integrity; exits non-zero on any issue so a broken reference — by a developer or a
 * future admin platform builder — fails CI rather than shipping an incoherent surface.
 */
const issues = validatePlatformRegistry();

console.log("Platform Registry validation");
console.log(`  capabilities:        ${CAPABILITIES.length}`);
console.log(`  tools:               ${TOOLS.length}`);
console.log(`  workspaces:          ${WORKSPACES.length}`);
console.log(`  personas:            ${PERSONAS.length}`);
console.log(`  events:              ${EVENTS.length}`);
console.log(`  features:            ${FEATURES.length}`);
console.log(`  care-circle roles:   ${CARE_CIRCLE_ROLES.length}`);
console.log(`  notification routes: ${NOTIFICATION_ROUTES.length}`);
console.log(`  workflows:           ${WORKFLOWS.length}`);
console.log(`  issues:              ${issues.length}`);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`  [${issue.registry}:${issue.entryId}] ${issue.message}`);
  }
  console.error("\nFAIL: Platform Registry is not coherent.");
  process.exit(1);
}
console.log("\nPlatform Registry OK: all entries valid and cross-references resolve.");
