# @nelyohealth/domain

Domain contracts package for shared domain primitives and early model scaffolds.

## Public API

- Exports `domainPackageBoundary` for topology and execution-phase tracking.
- Exports Phase 3 step 1 identity and tenancy model contracts in `identity-tenancy-model`.
- Contains no runtime persistence, framework imports, vendor SDK types, or feature workflows.

Authentication flows, tenancy enforcement, and workflow behavior remain implementation work in later Phase 3 steps.
