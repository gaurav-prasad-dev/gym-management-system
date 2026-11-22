# Folder Structure – Gym Management System

## 1. Overview

The Gym Management System will use a separate frontend and backend structure.

The project will follow:

- Modular Monolith Architecture.
- Feature-based frontend organization.
- Module-based backend organization.
- Layered backend architecture.
- Centralized configuration and shared utilities.

### Root Project Structure

```text
gym-management-system/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── .gitignore
├── README.md
└── package.json
```

### Directory Responsibilities

| Directory | Responsibility |
|---|---|
| frontend | React application |
| backend | Node.js and Express application |
| docs | Project documentation |
| .gitignore | Files Git should ignore |
| README.md | Project overview and setup instructions |
| package.json | Root scripts and workspace configuration, if required |

---

# 2. Frontend Folder Structure

The frontend will use React, TypeScript, Vite, Tailwind CSS and React Router.

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── tables/
│   │   └── forms/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── memberships/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── trainers/
│   │   ├── expenses/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── staff/
│   │   └── settings/
│   │
│   ├── hooks/
│   │
│   ├── contexts/
│   │
│   ├── services/
│   │
│   ├── routes/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── lib/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## 3. Frontend Directory Responsibilities

### 3.1 public/

Contains static files that can be accessed directly.

Examples:

- Favicon.
- Static logo.
- Public images.
- Other static resources.

### 3.2 assets/

Contains frontend assets imported into components.

```text
assets/
├── images/
├── icons/
└── fonts/
```

### 3.3 components/

Contains reusable components shared across multiple modules.

```text
components/
├── ui/
├── common/
├── layout/
├── tables/
└── forms/
```

**ui/**

Basic UI components such as:

- Button.
- Input.
- Dialog.
- Dropdown.
- Badge.
- Card.

**common/**

Reusable application components such as:

- SearchBar.
- StatusBadge.
- ConfirmDialog.
- PageHeader.
- EmptyState.
- LoadingSpinner.

**layout/**

Application layout components:

- Sidebar.
- Navbar.
- MainLayout.
- AuthLayout.
- PageContainer.

**tables/**

Reusable table-related components:

- DataTable.
- TablePagination.
- TableFilters.

**forms/**

Reusable form-related components:

- FormField.
- FormError.
- FormSection.

### 3.4 modules/

Contains all feature-specific frontend code.

Each module manages its own pages, components, hooks, services and types.

Example:

```text
modules/
│
└── members/
    │
    ├── components/
    │   ├── MemberTable.tsx
    │   ├── MemberForm.tsx
    │   ├── MemberDetails.tsx
    │   └── MemberFilters.tsx
    │
    ├── pages/
    │   ├── MembersPage.tsx
    │   ├── AddMemberPage.tsx
    │   └── MemberDetailsPage.tsx
    │
    ├── hooks/
    │   └── useMembers.ts
    │
    ├── services/
    │   └── member.service.ts
    │
    ├── types/
    │   └── member.types.ts
    │
    └── index.ts
```

The same pattern can be followed for other modules when needed.

### 3.5 hooks/

Contains reusable custom React hooks shared across modules.

Examples:

- useDebounce.
- usePagination.
- usePermissions.
- useDisclosure.

Module-specific hooks should remain inside their respective modules.

### 3.6 contexts/

Contains React contexts for application-wide state.

Examples:

- AuthContext.
- ThemeContext.
- GymContext.

Avoid putting all application state into Context API.

Server data should be managed through TanStack Query.

### 3.7 services/

Contains shared frontend services.

Example:

```text
services/
├── api.ts
├── auth.service.ts
└── upload.service.ts
```

`api.ts` will configure the shared HTTP client, including the API base URL and common request behavior.

Module-specific API functions should remain inside their modules.

### 3.8 routes/

Contains application route definitions and route protection.

Example:

```text
routes/
├── AppRoutes.tsx
├── ProtectedRoute.tsx
└── PermissionRoute.tsx
```

### 3.9 types/

Contains global frontend TypeScript types.

Examples:

- ApiResponse.
- Pagination.
- AuthUser.
- CommonStatus.

Module-specific types should remain inside individual modules.

### 3.10 utils/

Contains reusable helper functions.

Examples:

- formatCurrency.
- formatDate.
- formatPhoneNumber.
- calculatePercentage.

### 3.11 constants/

Contains frontend-wide constants.

Examples:

- Route paths.
- Application configuration.
- Date formats.
- Currency configuration.

### 3.12 lib/

Contains configured third-party libraries and their instances.

Examples:

- QueryClient.
- Utility configurations.
- Other shared library setup.

---

# 4. Backend Folder Structure

The backend will use Node.js, Express, TypeScript, Prisma and PostgreSQL.

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
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── staff/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── members/
│   │   ├── memberships/
│   │   ├── attendance/
│   │   ├── payments/
│   │   ├── trainers/
│   │   ├── expenses/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── dashboard/
│   │   └── gym-settings/
│   │
│   ├── middleware/
│   │
│   ├── shared/
│   │
│   ├── integrations/
│   │
│   ├── routes/
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

# 5. Backend Directory Responsibilities

## 5.1 prisma/

Contains database schema, migrations and seed files.

```text
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

**schema.prisma**

Defines:

- Database models.
- Fields.
- Relations.
- Constraints.
- Indexes.

**migrations/**

Stores database schema changes over time.

**seed.ts**

Inserts initial application data.

Examples:

- Default gym record.
- Initial owner account.
- Default permission catalogue.
- Default role templates.

Never store real production passwords in seed files.

## 5.2 config/

Contains application configuration.

```text
config/
├── env.ts
├── database.ts
├── cors.ts
└── storage.ts
```

Responsibilities:

- Environment variable validation.
- Database configuration.
- CORS configuration.
- Storage configuration.

## 5.3 modules/

Contains all backend business modules.

Each module should own its routes, controllers, services, repositories and validation.

Example:

```text
modules/
│
└── members/
    │
    ├── member.routes.ts
    ├── member.controller.ts
    ├── member.service.ts
    ├── member.repository.ts
    ├── member.validation.ts
    ├── member.types.ts
    ├── member.constants.ts
    └── index.ts
```

### File Responsibilities

| File | Responsibility |
|---|---|
| member.routes.ts | Defines member API endpoints |
| member.controller.ts | Handles HTTP requests and responses |
| member.service.ts | Contains member business logic |
| member.repository.ts | Handles member database queries |
| member.validation.ts | Validates incoming request data |
| member.types.ts | Contains module-specific TypeScript types |
| member.constants.ts | Contains module-specific constants |
| index.ts | Exposes the module's public interface |

Not every module requires all these files.

## 5.4 middleware/

Contains reusable Express middleware.

```text
middleware/
├── authenticate.ts
├── authorize.ts
├── validate.ts
├── errorHandler.ts
├── notFound.ts
├── rateLimiter.ts
└── gymContext.ts
```

Responsibilities:

- Authenticate users.
- Verify permissions.
- Validate requests.
- Handle errors.
- Handle unknown routes.
- Limit excessive requests.
- Establish and validate gym context.

## 5.5 shared/

Contains reusable backend utilities and common application code.

```text
shared/
├── errors/
├── constants/
├── types/
├── utils/
└── database/
```

**errors/**

Custom application errors.

**constants/**

Global application constants.

**types/**

Shared TypeScript types.

**utils/**

Common helper functions.

**database/**

Shared database utilities, transaction helpers and Prisma-related abstractions where required.

Avoid placing business logic from individual modules here.

## 5.6 integrations/

Contains third-party service integrations.

```text
integrations/
├── email/
├── whatsapp/
├── storage/
└── payment-gateway/
```

Responsibilities:

- Email sending.
- WhatsApp messaging.
- File uploads.
- Future online payment gateway integration.

External service code should remain isolated from business modules.

## 5.7 routes/

Contains the main API router.

```text
routes/
└── index.ts
```

It combines module routes and attaches them to the application.

Example:

```typescript
app.use("/api/v1", apiRoutes);
```

## 5.8 app.ts

Responsible for configuring the Express application.

Responsibilities:

- Register middleware.
- Configure CORS.
- Register API routes.
- Register error handling.
- Configure security-related middleware.

## 5.9 server.ts

Responsible for starting the backend server.

Responsibilities:

- Load application configuration.
- Connect to required services.
- Start the HTTP server.
- Handle graceful shutdown.

---

# 6. Backend Module Structure

The following module structure will be used.

### Authentication Module

```text
auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.validation.ts
└── auth.types.ts
```

Responsibilities:

- Login.
- Logout.
- Refresh tokens.
- Current user.
- Change password.
- Session/token management.

### Members Module

```text
members/
├── member.routes.ts
├── member.controller.ts
├── member.service.ts
├── member.repository.ts
├── member.validation.ts
└── member.types.ts
```

Responsibilities:

- Create members.
- Update members.
- Retrieve members.
- Search and filter.
- Activate/deactivate members.
- Member history.

### Memberships Module

```text
memberships/
├── membership.routes.ts
├── membership.controller.ts
├── membership.service.ts
├── membership.repository.ts
├── membership.validation.ts
└── membership.types.ts
```

Responsibilities:

- Membership plans.
- Assign memberships.
- Renew memberships.
- Freeze memberships.
- Extend memberships.
- Expire memberships.
- Membership history.

### Attendance Module

```text
attendance/
├── attendance.routes.ts
├── attendance.controller.ts
├── attendance.service.ts
├── attendance.repository.ts
├── attendance.validation.ts
└── attendance.types.ts
```

Responsibilities:

- Check-in.
- Check-out.
- Manual attendance.
- QR attendance.
- Attendance history.
- Attendance reports.

### Payments Module

```text
payments/
├── payment.routes.ts
├── payment.controller.ts
├── payment.service.ts
├── payment.repository.ts
├── payment.validation.ts
└── payment.types.ts
```

Responsibilities:

- Record payments.
- Partial payments.
- Payment history.
- Receipts.
- Refunds.
- Outstanding dues.

### Other Modules

Follow the same structure for:

- Trainers.
- Expenses.
- Notifications.
- Reports.
- Dashboard.
- Staff.
- Roles.
- Permissions.
- Gym Settings.

---

# 7. Testing Folder Structure

Tests should be organized by application module.

```text
tests/
│
├── unit/
│   ├── members/
│   ├── memberships/
│   ├── payments/
│   └── attendance/
│
├── integration/
│   ├── auth/
│   ├── members/
│   ├── memberships/
│   └── payments/
│
└── e2e/
    ├── member-flow.test.ts
    ├── membership-flow.test.ts
    └── payment-flow.test.ts
```

### Testing Responsibilities

**Unit Tests**

Test individual functions and business logic.

**Integration Tests**

Test interactions between modules, database operations and APIs.

**End-to-End Tests**

Test complete user workflows.

---

# 8. Documentation Folder Structure

All project documentation should remain inside the `docs/` directory.

```text
docs/
│
├── problemDefination.md
├── prd.md
├── mvpScope.md
├── businessRules.md
├── rbac.md
├── dbDesign.md
├── erDiagram.md
├── databaseIndexes.md
├── systemArchitecture.md
├── folderStructure.md
├── apiDesign.md
├── uiUxguidelines.md
├── userFlows.md
├── developmentPlan.md
├── testingStrategy.md
├── testCases.md
├── moduleDocumentation.md
├── futureEnhancements.md
└── projectProgressAndReport.md
```

Additional documentation can be added as the project grows.

---

# 9. Naming Conventions

Consistency is important throughout development.

### Frontend

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | MemberTable.tsx |
| Pages | PascalCase | MembersPage.tsx |
| Hooks | camelCase with use | useMembers.ts |
| Services | camelCase | member.service.ts |
| Types | camelCase filename | member.types.ts |
| Constants | camelCase filename | member.constants.ts |
| Variables | camelCase | memberName |
| Interfaces/Types | PascalCase | Member |

### Backend

| Element | Convention | Example |
|---|---|---|
| Routes | kebab/camel module naming | member.routes.ts |
| Controllers | camel module naming | member.controller.ts |
| Services | camel module naming | member.service.ts |
| Repositories | camel module naming | member.repository.ts |
| Validation | camel module naming | member.validation.ts |
| Types | camel module naming | member.types.ts |
| Classes | PascalCase | MemberService |
| Functions | camelCase | createMember |

### Database

Use consistent naming throughout the database.

Recommended:

- Table names: snake_case.
- Column names: snake_case.
- Foreign keys: `<entity>_id`.
- Primary keys: `id`.
- Indexes: `idx_<table>_<columns>`.
- Unique constraints: `uq_<table>_<columns>`.

Example:

```text
members
member_memberships
membership_plans
member_id
gym_id
created_at
updated_at
```

Follow the actual naming conventions configured in Prisma consistently.

---

# 10. Environment Files

Frontend and backend should maintain separate environment configurations.

### Frontend .env.example

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend .env.example

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

Add other variables when their integrations are implemented.

Never commit actual `.env` files or secrets to GitHub.

---

# 11. Git Ignore

The root `.gitignore` should exclude:

```gitignore
node_modules/
dist/
build/

.env
.env.*
!.env.example

coverage/

.DS_Store
Thumbs.db

*.log

.vscode/
```

Add any required exceptions for shared project configuration.

---

# 12. Folder Structure Rules

Follow these rules during development:

1. Keep frontend and backend separated.
2. Organize frontend code by feature/module.
3. Organize backend code by business module.
4. Keep controllers thin.
5. Keep business logic inside services.
6. Keep database queries inside repositories.
7. Keep module-specific code inside its module.
8. Keep shared utilities inside shared directories.
9. Keep external integrations separate.
10. Avoid creating unnecessary files.
11. Avoid creating empty folders without a purpose.
12. Maintain consistent naming conventions.
13. Do not put all application logic inside one file.
14. Avoid circular dependencies between modules.
15. Keep documentation updated when architecture changes.

---

# 13. Final Decision

The Gym Management System will use a feature-based frontend structure and a module-based backend structure.

The backend will follow:

**Routes → Middleware → Controllers → Services → Repositories → Database**

The frontend will follow:

**Pages → Components → Hooks → Services → API**

This structure will keep the application organized, maintainable and suitable for future expansion into a multi-tenant SaaS product.