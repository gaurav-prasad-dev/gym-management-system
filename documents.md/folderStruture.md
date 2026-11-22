# Folder Structure – Gym Management System

## 1. Purpose

This document defines the standard folder and file structure for the Gym Management System.

The project will follow a **Modular Monolith Architecture**.

The application will initially serve a single gym but will be designed with future SaaS expansion in mind.

### Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod

**Backend**
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod Validation

---

# 2. Root Project Structure

```text
gym-management-system/
│
├── frontend/
├── backend/
│
├── docs/
│   ├── problemDefination.md
│   ├── prd.md
│   ├── mvpScope.md
│   ├── businessRules.md
│   ├── systemArchitecture.md
│   ├── dbDesign.md
│   ├── erDiagram.md
│   ├── databaseIndexes.md
│   ├── rbac.md
│   ├── apiDesign.md
│   ├── userFlows.md
│   ├── uiUxguidelines.md
│   ├── testingStrategy.md
│   ├── testCases.md
│   ├── moduleDocumentation.md
│   ├── folderStructure.md
│   ├── developmentPlan.md
│   └── futureEnhancements.md
│
├── .gitignore
├── README.md
└── package.json
```

---

# 3. Backend Folder Structure

The backend will follow a modular structure.

Each business module will have its own routes, controllers, services, validation schemas, and related logic.

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   └── appConfig.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── dashboard.service.ts
│   │   │
│   │   ├── members/
│   │   │   ├── members.routes.ts
│   │   │   ├── members.controller.ts
│   │   │   ├── members.service.ts
│   │   │   ├── members.validation.ts
│   │   │   └── members.types.ts
│   │   │
│   │   ├── memberships/
│   │   │   ├── memberships.routes.ts
│   │   │   ├── memberships.controller.ts
│   │   │   ├── memberships.service.ts
│   │   │   ├── memberships.validation.ts
│   │   │   └── memberships.types.ts
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.routes.ts
│   │   │   ├── attendance.controller.ts
│   │   │   ├── attendance.service.ts
│   │   │   ├── attendance.validation.ts
│   │   │   └── attendance.types.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.routes.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.validation.ts
│   │   │   └── payments.types.ts
│   │   │
│   │   ├── trainers/
│   │   │   ├── trainers.routes.ts
│   │   │   ├── trainers.controller.ts
│   │   │   ├── trainers.service.ts
│   │   │   ├── trainers.validation.ts
│   │   │   └── trainers.types.ts
│   │   │
│   │   ├── expenses/
│   │   │   ├── expenses.routes.ts
│   │   │   ├── expenses.controller.ts
│   │   │   ├── expenses.service.ts
│   │   │   └── expenses.validation.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.routes.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notification.providers.ts
│   │   │   └── notification.templates.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── reports.routes.ts
│   │   │   ├── reports.controller.ts
│   │   │   └── reports.service.ts
│   │   │
│   │   ├── staff/
│   │   │   ├── staff.routes.ts
│   │   │   ├── staff.controller.ts
│   │   │   ├── staff.service.ts
│   │   │   └── staff.validation.ts
│   │   │
│   │   ├── roles/
│   │   │   ├── roles.routes.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   └── roles.validation.ts
│   │   │
│   │   ├── permissions/
│   │   │   ├── permissions.routes.ts
│   │   │   ├── permissions.controller.ts
│   │   │   └── permissions.service.ts
│   │   │
│   │   ├── gym-settings/
│   │   │   ├── gym-settings.routes.ts
│   │   │   ├── gym-settings.controller.ts
│   │   │   ├── gym-settings.service.ts
│   │   │   └── gym-settings.validation.ts
│   │   │
│   │   └── audit-logs/
│   │       ├── audit-logs.routes.ts
│   │       ├── audit-logs.controller.ts
│   │       └── audit-logs.service.ts
│   │
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── errorHandler.ts
│   │   ├── validateRequest.ts
│   │   ├── notFound.ts
│   │   └── rateLimiter.ts
│   │
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── errorCodes.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── pagination.ts
│   │   │   ├── password.ts
│   │   │   └── response.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── permissions.ts
│   │   │   └── statuses.ts
│   │   │
│   │   └── types/
│   │       ├── express.d.ts
│   │       └── common.types.ts
│   │
│   ├── jobs/
│   │   ├── membershipExpiry.job.ts
│   │   ├── notification.job.ts
│   │   └── scheduledJobs.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 4. Backend Folder Responsibilities

| Folder | Responsibility |
|---|---|
| config | Database, environment and application configuration |
| modules | Business modules and their logic |
| routes | API endpoint definitions |
| controllers | Handle HTTP requests and responses |
| services | Core business logic |
| validation | Validate incoming request data |
| middlewares | Authentication, authorization, validation and error handling |
| shared | Reusable utilities, constants, errors and types |
| jobs | Scheduled background tasks |
| prisma | Database schema, migrations and seed data |
| tests | Backend automated tests |

### Important Rule

Keep business logic inside service files.

Example:

When registering a member:

1. Route receives the request.
2. Authentication middleware verifies the user.
3. Authorization middleware checks `members.create`.
4. Validation middleware validates the input.
5. Controller receives the validated request.
6. Service performs the registration logic.
7. Prisma communicates with PostgreSQL.
8. Controller sends the response.

Controllers should not contain complicated business logic.

---

# 5. Frontend Folder Structure

The frontend will follow a feature-based modular architecture.

```text
frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   └── queryClient.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   └── shared/
│   │       ├── DataTable.tsx
│   │       ├── SearchBar.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingState.tsx
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── members/
│   │   │   ├── pages/
│   │   │   │   ├── MembersPage.tsx
│   │   │   │   ├── MemberDetailsPage.tsx
│   │   │   │   └── CreateMemberPage.tsx
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── memberships/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── attendance/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── payments/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── trainers/
│   │   ├── expenses/
│   │   ├── notifications/
│   │   ├── reports/
│   │   │
│   │   ├── staff/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── roles/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── gym-settings/
│   │   └── audit-logs/
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── authService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── usePermissions.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── permissions.ts
│   │
│   ├── constants/
│   │   ├── routes.ts
│   │   └── permissions.ts
│   │
│   ├── types/
│   │   └── common.types.ts
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   └── main.tsx
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 6. Frontend Folder Responsibilities

| Folder | Responsibility |
|---|---|
| app | Application initialization, providers and routing |
| assets | Images, icons and static assets |
| components/ui | Reusable UI components |
| components/layout | Sidebar, header and application layout |
| components/shared | Reusable business-independent components |
| modules | Feature-specific frontend code |
| services | API communication |
| hooks | Reusable React hooks |
| context | Global React context |
| utils | Formatting and helper functions |
| constants | Routes and application constants |
| types | Shared TypeScript types |
| styles | Global styles |

### Important Rule

Keep module-specific components inside their respective module.

For example:

- MemberForm belongs inside `modules/members/components/`.
- PaymentTable belongs inside `modules/payments/components/`.
- RoleForm belongs inside `modules/roles/components/`.

Only genuinely reusable components should go inside the global `components/` directory.

---

# 7. Standard Backend Module Structure

Every backend module should follow a consistent structure.

Example: Members Module

```text
members/
│
├── members.routes.ts
├── members.controller.ts
├── members.service.ts
├── members.validation.ts
├── members.types.ts
└── members.repository.ts
```

### Responsibilities

**1. Routes**
- Define API endpoints.
- Attach authentication middleware.
- Attach permission middleware.
- Attach validation middleware.

**2. Controller**
- Read request parameters and body.
- Call service methods.
- Return HTTP responses.

**3. Service**
- Implement business rules.
- Coordinate database operations.
- Handle transactions.
- Call other modules when required.

**4. Validation**
- Define Zod schemas.
- Validate request body, query and parameters.

**5. Types**
- Define module-specific TypeScript types.

**6. Repository**
- Optional layer for complex database queries.
- Keep simple Prisma queries in services initially.
- Introduce repositories when database access becomes sufficiently complex.

Do not create unnecessary abstraction layers just to make the project look professional.

---

# 8. Authentication and RBAC Structure

Authentication and authorization should be centralized.

### Backend

```text
middlewares/
│
├── authenticate.ts
├── authorize.ts
└── validateRequest.ts

modules/
│
├── auth/
├── staff/
├── roles/
├── permissions/
└── audit-logs/
```

### Frontend

```text
hooks/
│
├── useAuth.ts
└── usePermissions.ts

components/
│
└── shared/
    └── ProtectedComponent.tsx
```

Example permission usage:

```tsx
<ProtectedComponent permission="members.create">
    <Button>Add Member</Button>
</ProtectedComponent>
```

Backend example:

```ts
router.post(
    "/",
    authenticate,
    authorize("members.create"),
    validateRequest(createMemberSchema),
    createMember
);
```

**Security rule:** Frontend permission checks are only for UI visibility. All actual authorization must happen on the backend.

---

# 9. Future SaaS Compatibility

Although the first version is for a single gym, the architecture should support multiple gyms later.

Follow these rules:

1. Keep a `gym_id` field in gym-owned database records.
2. Associate staff users with their gym.
3. Store gym-specific roles separately.
4. Resolve gym context from the authenticated user.
5. Never trust a client-supplied `gym_id` for authorization.
6. Keep business modules independent.
7. Avoid hardcoding gym-specific information.
8. Keep gym settings configurable.
9. Ensure database queries are scoped to the correct gym.
10. Keep subscription and billing functionality outside the initial MVP.

Do not implement SaaS subscription logic now. Only maintain the architectural foundation.

---

# 10. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Folders | lowercase | members |
| React components | PascalCase | MemberForm.tsx |
| Backend files | camelCase | members.service.ts |
| Variables | camelCase | memberId |
| Functions | camelCase | createMember() |
| Classes | PascalCase | AppError |
| Constants | UPPER_SNAKE_CASE | MAX_FILE_SIZE |
| Database tables | snake_case | member_memberships |
| Database fields | snake_case | created_at |
| API routes | kebab-case where needed | gym-settings |

---

# 11. Development Rules

1. Follow the defined folder structure.
2. Keep frontend and backend separate.
3. Follow modular monolith architecture.
4. Do not put all backend logic in one controller.
5. Keep business logic inside services.
6. Use Zod for request validation.
7. Use Prisma for database operations.
8. Keep API responses consistent.
9. Use centralized error handling.
10. Use middleware for authentication and authorization.
11. Use database transactions for operations involving multiple related records.
12. Keep reusable components separate from module-specific components.
13. Avoid unnecessary dependencies and abstractions.
14. Write tests for critical business logic.
15. Update documentation when architecture or module responsibilities change.

---

# 12. Instructions for AI Coding Agents

Before creating or modifying files:

1. Read `prd.md`.
2. Read `mvpScope.md`.
3. Read `businessRules.md`.
4. Read `systemArchitecture.md`.
5. Read `dbDesign.md`.
6. Read `erDiagram.md`.
7. Read `apiDesign.md`.
8. Read `rbac.md`.
9. Read `moduleDocumentation.md`.
10. Read this `folderStructure.md`.

### AI Agent Rules

- Follow the existing folder structure.
- Do not create duplicate modules.
- Do not introduce microservices.
- Do not create unnecessary files.
- Do not put business logic in controllers.
- Do not bypass RBAC.
- Do not change database relationships without checking `dbDesign.md`.
- Do not implement features outside the current development phase.
- Reuse existing components and utilities.
- Keep frontend and backend naming conventions consistent.
- Explain significant architectural changes before implementing them.

---

# 13. Final Architecture Decision

The Gym Management System will use:

| Layer | Architecture |
|---|---|
| Frontend | Feature-based modular architecture |
| Backend | Modular monolith |
| Database | PostgreSQL |
| ORM | Prisma |
| API | REST API |
| Authentication | JWT with access and refresh tokens |
| Authorization | Dynamic RBAC |
| Validation | Zod |
| Background Jobs | Scheduled jobs initially |
| Testing | Unit, integration and E2E |

**Final principle:**

Build a clean and maintainable modular monolith first. Do not overengineer the application for future scale. Keep clear module boundaries and enforce business rules properly so the application can grow without requiring a complete rewrite.