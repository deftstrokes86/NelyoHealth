# Execution Plan Convention

This file defines an execution-plan convention. It is not an autonomous-agent configuration, does not create or spawn agents, and does not enable background execution.

## When a Plan Is Required

- Multi-file change
- Architecture decision
- Dependency addition
- Migration
- Security-sensitive change
- Clinical or financial behavior
- User-facing workflow
- Cross-package change
- Work expected to span several commits

## Plan Structure

1. Objective
2. Existing context
3. Scope
4. Non-goals
5. Source documents
6. Locked rules
7. Files affected
8. Data-model impact
9. API impact
10. UI impact
11. Privacy and security
12. Browser scenarios
13. Tests
14. Milestones
15. Validation commands
16. Rollback
17. Risks
18. Decisions
19. Completion report
