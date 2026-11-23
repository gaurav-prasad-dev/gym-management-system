# AI Agent Rules — Automobile ERP SaaS

## 1. Project Overview

This project is a production-oriented, multi-tenant Automobile ERP SaaS.

The goal is to build a secure, maintainable, scalable application with consistent UI/UX, reusable components, reliable database operations, and configurable role-based permissions.

The owner controls project decisions. AI agents assist with analysis, planning, implementation, and testing; they must not independently make major decisions.

## 2. Mandatory Rules Before Starting Work

1. Read all relevant `.md` files inside the `docs/` folder before beginning a task.
2. Inspect the existing codebase before proposing or making changes.
3. Understand the existing architecture, business flow, coding conventions, and dependencies.
4. If documentation is missing, contradictory, or unclear, explain the issue and ask for clarification.
5. Do not assume permission to implement a task simply because it has been discussed.
6. Never build the entire project independently. Work with the owner one approved task at a time.

## 3. Approval and Communication Rules

Before implementing a task, explain:

1. **What:** What we are going to do.
2. **Why:** Why the change is necessary.
3. **Flow:** How the feature or change will work from beginning to end.
4. **Advantages:** Benefits of the proposed approach.
5. **Disadvantages:** Limitations and trade-offs.
6. **Affected files:** Which existing and new files may be involved.
7. **Side effects:** What existing features or systems could be affected.
8. **Scaling:** Possible bottlenecks and future scaling problems.
9. **Alternatives:** Other reasonable approaches and why the proposed one is preferred.
10. **Testing:** How we will verify the change.

After explaining, ask the owner for explicit approval before implementing the task.

Do not treat silence, an earlier discussion, or a request to plan as approval to implement.

For small, clearly authorized tasks, keep the explanation proportionate. Never skip approval for risky or major changes.

## 4. Git and GitHub Rules

1. Never push, add, stage, or commit code without explicit permission.
2. Never merge branches or create releases without permission.
3. Never force-push, rewrite Git history, or delete branches without permission.
4. Never overwrite or discard the owner's uncommitted changes.
5. Before modifying files, inspect the Git status when Git is available.
6. Explain which files changed and why.
7. Ask before performing operations that may lose work or affect shared branches.

## 5. Database Safety Rules

1. Never delete, reset, drop, truncate, or recreate a database without explicit approval.
2. Never execute destructive database commands without first explaining their consequences and receiving approval.
3. Before any schema change, explain the migration, affected tables, data impact, compatibility risks, and rollback plan.
4. Do not run database migrations automatically unless the owner has approved the specific migration and execution environment.
5. Preserve existing data and use safe, version-controlled migrations.
6. Consider backward compatibility when changing schemas used by existing code.
7. Explain whether a migration can lock tables, cause downtime, or require data backfilling.
8. Verify the target environment before any database operation. Never assume that a connection points to development rather than production.
9. Recommend and verify backups before approved high-risk operations.
10. Report every database change and its actual result.

## 6. Architecture and Technology Stack

1. Never change the approved technology stack, architecture, or major design patterns without permission.
2. Do not introduce microservices, distributed systems, or additional infrastructure without explaining why they are needed.
3. Prefer a modular architecture with clear separation of responsibilities.
4. Avoid unnecessary abstractions and premature optimization.
5. Prefer the simplest design that meets current requirements while allowing sensible future growth.
6. Explain major architectural trade-offs and potential scaling bottlenecks before implementation.
7. Do not duplicate business logic across multiple modules.
8. Maintain clear boundaries between modules.

## 7. Reusable Components and UI/UX

1. Always read and follow `ui-ux-guidelines.md`.
2. Use Tailwind CSS consistently throughout the application.
3. Build and reuse shared components wherever practical.
4. Use common components for buttons, forms, inputs, tables, pagination, modals, dropdowns, badges, alerts, and other repeated UI elements.
5. Maintain consistent colors, typography, font sizes, spacing, borders, shadows, and interaction states.
6. Use shared design tokens or theme configuration rather than scattered hardcoded styling values.
7. Never create a new styling pattern when an approved shared component already exists.
8. Do not introduce another UI library or component system without approval.
9. Every page must be responsive across mobile, tablet, and desktop.
10. Handle loading, empty, error, validation, success, and disabled states consistently.
11. Follow accessibility basics, including keyboard navigation, readable contrast, and appropriate labels.
12. Explain proposed design-system changes and their impact before modifying shared styles or components.

## 8. Reusability and Code Quality

1. Reuse existing utilities, hooks, services, middleware, validation schemas, and components.
2. Avoid unnecessary code duplication.
3. Keep functions and modules focused on clear responsibilities.
4. Follow existing naming conventions and folder structure.
5. Do not add unnecessary dependencies.
6. Ask before installing, removing, or upgrading dependencies.
7. Avoid unrelated refactoring during feature implementation.
8. Do not silently remove existing functionality.
9. Handle errors explicitly and return consistent API responses.
10. Keep code readable and maintainable rather than unnecessarily clever.

## 9. Multi-Tenant SaaS Security

1. Every business-owned record must be protected by business-level data isolation.
2. Derive the current business scope from trusted, authenticated server-side context.
3. Never trust a client-provided `businessId` as proof of authorization.
4. Apply tenant scoping to reads, creates, updates, deletes, reports, background jobs, and exports.
5. Prevent cross-business access through direct object IDs, search endpoints, and related records.
6. Enforce authorization on the backend, not only by hiding frontend buttons.
7. Avoid caching one business's data under keys that another business can access.
8. Ensure background jobs and real-time events preserve business boundaries.
9. Test cross-tenant access attempts.
10. Explain security implications before changing authentication, authorization, or tenant-isolation logic.

## 10. Authentication and Configurable RBAC

1. Read and follow `authentication-rbac.md`.
2. Store and manage role permissions through the approved permission system.
3. Do not hardcode business-role permissions throughout the application.
4. Authorized administrators must be able to change permissions through Settings without code changes.
5. Check permissions on every relevant backend operation.
6. Follow least-privilege principles: users receive only the access they need.
7. Protect sensitive actions such as approvals, financial changes, role management, and user administration.
8. Do not expose passwords, access tokens, refresh tokens, or other secrets in logs or API responses.
9. Explain changes to token handling, sessions, or permission models before implementation.

## 11. Inventory and Transaction Integrity

1. Never change inventory outside the approved business workflow.
2. Follow the defined rules for purchase receipt, sales finalization, cancellation, and returns.
3. Prevent duplicate stock updates caused by repeated requests, retries, or webhook deliveries.
4. Consider concurrent transactions and race conditions.
5. Use appropriate database transactions, constraints, and locking strategies where required.
6. Maintain an auditable inventory movement history.
7. Do not silently modify financial or inventory calculations.
8. Explain how failures, retries, cancellations, and partial operations will be handled before implementation.

## 12. API Rules

1. Follow `api-design.md`.
2. Use consistent endpoint naming, validation, status codes, and response formats.
3. Enforce authentication, permissions, and tenant isolation on the backend.
4. Validate all untrusted input.
5. Use pagination for potentially large result sets.
6. Consider rate limiting and abuse prevention for sensitive or public endpoints.
7. Design retryable operations carefully to avoid duplicate transactions.
8. Document important API changes and their effect on existing frontend or integrations.

## 13. Testing and Verification

1. Add or update tests for important business rules and changed behavior.
2. Run relevant tests, linting, type checks, and builds when available and appropriate.
3. Never claim a test passed unless it was actually executed and passed.
4. Report failures, skipped tests, and unverified behavior honestly.
5. Test authorization, tenant isolation, invalid input, and important error paths.
6. Test database and inventory workflows under relevant failure and concurrency scenarios.
7. Do not remove or weaken tests just to make a build pass without approval.
8. Ask before running tests or commands that may modify, reset, or delete important data.

## 14. Secrets and Configuration

1. Never commit API keys, passwords, database credentials, private keys, or production secrets.
2. Use environment variables and appropriate secret-management practices.
3. Keep `.env` files out of Git where they contain secrets.
4. Maintain a safe `.env.example` with placeholder values only.
5. Never send secrets to external services or include them in prompts unnecessarily.
6. Ask before changing deployment configuration, permissions, infrastructure, or production environment variables.

## 15. Documentation

1. Treat `docs/` as the main project documentation source.
2. Read relevant documentation before making changes.
3. Update documentation when an approved decision changes the architecture, API, database, security, or UI/UX guidelines.
4. Do not silently change the approved requirements.
5. Explain documentation changes and keep decisions consistent across files.
6. Record unresolved questions instead of inventing answers.

## 16. Scaling and Performance

1. Consider expected data growth, concurrent users, and query patterns.
2. Use indexes based on actual query requirements.
3. Avoid unnecessary database queries and unbounded result sets.
4. Consider caching only when it provides a clear benefit and consistency rules are understood.
5. Consider queues for appropriate long-running or retryable background work.
6. Avoid adding Redis, queues, microservices, or other infrastructure without explaining the cost and operational complexity.
7. Identify likely bottlenecks and explain when a proposed optimization will become necessary.
8. Prefer measurement and profiling over unsupported performance claims.

## 17. Final Report After Every Approved Task

After completing a task, report:

1. What was implemented.
2. Why it was implemented this way.
3. Files created, modified, or deleted.
4. Database or dependency changes.
5. Tests and commands actually run, with results.
6. Security, compatibility, or scaling considerations.
7. Known limitations or unfinished work.
8. Suggested next step.

Do not claim completion if required work remains unfinished.

## 18. Golden Rule

**The owner makes the decisions; the AI agent explains, proposes, and implements only what has been approved.**

When uncertain, stop and ask rather than guessing.

Protect existing code and data. Keep the architecture consistent. Prefer reusable components. Follow the documentation. Explain risks before making changes. Never perform destructive, external, or irreversible actions without explicit permission.