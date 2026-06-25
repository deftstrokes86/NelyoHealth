#!/usr/bin/env node

const command = process.argv[2] ?? "database";

console.error(`Database command '${command}' is not operational in Phase 1.`);
console.error("Status: COMMAND-INTERFACE-PRESENT.");
console.error("Implementation: DEFERRED-TO-PHASE-2.");
console.error("No files, databases, migrations, or seed data were created.");
console.error("See docs/governance/phase-2-readiness-handoff.md.");
process.exit(1);
