# System Architecture – Gym Management System

## 1. Overview

The Gym Management System will follow a Modular Monolith Architecture.

The application will initially operate as a single-gym management system, with the database and application architecture designed to support future multi-tenant SaaS conversion.

The system will contain separate frontend and backend applications.

The backend will be organized into independent business modules that communicate through well-defined interfaces.

### Architecture Goals

- Maintain clean separation of concerns.
- Keep modules independent and maintainable.
- Avoid unnecessary complexity.
- Support secure authentication and authorization.
- Ensure database consistency.
- Support future SaaS conversion.
- Make new modules easy to introduce.
- Keep deployment and development simple.

---

# 2. Technology Stack

The following technology stack is recommended.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Frontend development |
| Styling | Tailwind CSS | Styling |
| UI Components | shadcn/ui | Reusable components |
| Routing | React Router | Frontend routing |
| Server State | TanStack Query | API data management |
| Backend | Node.js | Runtime |
| Backend Framework | Express.js | REST API |
| Language | TypeScript | Type safety |
| Database | PostgreSQL | Relational database |
| ORM | Prisma | Database operations |
| Authentication | JWT | Access authentication |
| Validation | Zod | Request validation |
| File Storage | Cloudinary or S3-compatible storage | Images and documents |
| Email | Nodemailer / Email Provider | Email notifications |
| WhatsApp | WhatsApp Business API Provider | WhatsApp notifications |
| API Testing | Postman | API testing |
| Version Control | Git and GitHub | Source control |

Technology decisions should remain consistent across the project.

Redis, Docker and background job queues can be introduced when their use cases justify them.

---

# 3. High-Level Architecture

The application will follow this structure:

```text
                  GYM STAFF / OWNER
                         |
                         v
                  REACT FRONTEND
                         |
                         v
                   API REQUESTS
                         |
                         v
                 EXPRESS BACKEND
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     AUTH MODULE     RBAC MODULE    BUSINESS MODULES
          |              |              |
          |              |       +------+------+
          |              |       |      |      |
          |              |       v      v      v
          |              |    MEMBER MEMBERSHIP ATTENDANCE
          |              |       |      |      |
          |              |       +------+------+
          |              |              |
          |              |              v
          |              |       PAYMENT MODULE
          |              |              |
          +--------------+--------------+
                         |
                         v
                  SERVICE LAYER
                         |
                         v
                   PRISMA ORM
                         |
                         v
                   POSTGRESQL
                         |
                         v
                 EXTERNAL SERVICES
                  /       |       \
                 v        v        v
             CLOUDINARY  EMAIL   WHATSAPP
```

---

# 4. Architecture Pattern: Modular Monolith

The backend will be a single deployable application.

However, its internal structure will be divided into independent modules.

### Why Modular Monolith?

Advantages:

- Easier to develop and debug.
- Simple deployment.
- Lower infrastructure cost.
- Easier database transactions.
- Clear module boundaries.
- No unnecessary network communication between internal modules.
- Can evolve as the application grows.

### Module Independence

Each module should own its business logic.

For example:

The Membership module handles:

- Membership plans.
- Assigning memberships.
- Renewals.
- Freezing.
- Expiry.
- Membership history.

The Payment module handles:

- Payment recording.
- Partial payments.
- Receipts.
- Refunds.
- Collection calculations.

The Dashboard module should retrieve information from other modules rather than independently modifying their records.

Modules should not directly manipulate another module's internal business logic.

---

# 5. Frontend Architecture

The frontend will be developed using React, TypeScript and Vite.

It will contain reusable UI components and module-specific pages.

### Frontend Responsibilities

- Display application pages.
- Handle user interactions.
- Validate forms for usability.
- Communicate with backend APIs.
- Display loading and error states.
- Manage application navigation.
- Display permission-based UI.
- Manage server state and caching.

### Frontend Structure

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── common/
│   │   ├── layout/
│   │   └── forms/
│   │
│   ├── modules/
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
│   │   ├── api.ts
│   │   └── auth.service.ts
│   │
│   ├── routes/
│   │
│   ├── lib/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── vite.config.ts
```

### Frontend Module Structure

Each module should contain its own components, pages, hooks and API functions.

Example:

```text
members/
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
└── types/
    └── member.types.ts
```

---

# 6. Backend Architecture

The backend will use Node.js, Express and TypeScript.

The backend will follow a layered architecture inside each module.

### Backend Responsibilities

- Handle API requests.
- Authenticate users.
- Authorize permissions.
- Validate request data.
- Execute business logic.
- Communicate with the database.
- Handle errors.
- Integrate external services.
- Maintain audit records.

### Backend Layers

```text
HTTP REQUEST
     |
     v
ROUTE
     |
     v
AUTHENTICATION MIDDLEWARE
     |
     v
AUTHORIZATION MIDDLEWARE
     |
     v
VALIDATION MIDDLEWARE
     |
     v
CONTROLLER
     |
     v
SERVICE
     |
     v
REPOSITORY / DATABASE ACCESS
     |
     v
POSTGRESQL
```

### Layer Responsibilities

**Routes**

Define API endpoints and attach middleware.

**Middleware**

Handle authentication, authorization, validation and request processing.

**Controllers**

Receive requests, call services and return responses.

**Services**

Contain business rules and application logic.

**Repositories**

Handle database queries and persistence.

**Database**

Stores application data.

Controllers should not contain complex business logic or direct database operations.

---

# 7. Backend Folder Structure

Recommended structure:

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
│   │   └── cloudinary.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
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
│   │   └── dashboard/
│   │
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   │
│   ├── shared/
│   │   ├── errors/
│   │   ├── constants/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── integrations/
│   │   ├── email/
│   │   ├── whatsapp/
│   │   └── storage/
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Backend Module Structure

Every business module should follow a consistent structure.

Example:

```text
members/
│
├── member.routes.ts
├── member.controller.ts
├── member.service.ts
├── member.repository.ts
├── member.validation.ts
├── member.types.ts
└── member.constants.ts
```

Not every module needs every file. Create files when the module requires them.

---

# 8. API Architecture

The backend will expose REST APIs.

Base URL:

```text
/api/v1
```

All APIs should follow consistent naming and response conventions.

### Example API Structure

```text
/api/v1
│
├── /auth
├── /users
├── /staff
├── /roles
├── /permissions
├── /members
├── /memberships
├── /attendance
├── /payments
├── /trainers
├── /expenses
├── /notifications
├── /reports
└── /dashboard
```

### Example Member APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /members | Get members |
| GET | /members/:id | Get member details |
| POST | /members | Create member |
| PATCH | /members/:id | Update member |
| PATCH | /members/:id/status | Change member status |
| GET | /members/:id/memberships | Get membership history |
| GET | /members/:id/payments | Get payment history |
| GET | /members/:id/attendance | Get attendance history |

### API Response Convention

Successful response:

```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "member-uuid",
    "fullName": "Rahul Sharma"
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Member not found",
  "error": {
    "code": "MEMBER_NOT_FOUND"
  }
}
```

Use appropriate HTTP status codes.

---

# 9. Authentication Architecture

Authentication will use JWT-based access authentication.

Recommended initial approach:

- Short-lived access token.
- Longer-lived refresh token.
- Secure HttpOnly cookies for browser-based authentication.
- Password hashing.
- Refresh token rotation.
- Logout and token revocation.
- Protected backend routes.

### Authentication Flow

```text
USER
 |
 v
LOGIN PAGE
 |
 v
POST /auth/login
 |
 v
VALIDATE CREDENTIALS
 |
 v
GENERATE TOKENS
 |
 v
SET SECURE COOKIES
 |
 v
AUTHENTICATED USER
 |
 v
ACCESS PROTECTED ROUTES
```

### Required Authentication APIs

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
POST /auth/change-password
```

The frontend must not be responsible for deciding whether credentials are valid.

The backend is the source of truth.

---

# 10. Authorization Architecture

The system will implement Dynamic Role-Based Access Control.

### Authorization Flow

```text
API REQUEST
    |
    v
AUTHENTICATE USER
    |
    v
IDENTIFY GYM CONTEXT
    |
    v
LOAD USER ROLES
    |
    v
LOAD ROLE PERMISSIONS
    |
    v
CHECK REQUIRED PERMISSION
    |
    +----------+
    |          |
    v          v
  ALLOW      DENY
    |          |
    v          v
CONTROLLER   HTTP 403
```

Example:

```typescript
router.post(
  "/members",
  authenticate,
  authorize("members.create"),
  createMember
);
```

Important rules:

- Permissions must be validated on the backend.
- The frontend can hide unauthorized actions, but cannot grant access.
- Users cannot assign permissions to themselves.
- All role assignments must respect gym boundaries.
- Trainer access may require additional record-level checks.
- Owner access must be protected.

---

# 11. Database Architecture

PostgreSQL will be the primary database.

Prisma will manage:

- Database schema.
- Migrations.
- Relations.
- Queries.
- Transactions.
- Type-safe database access.

### Database Design Principles

- Use UUID primary keys.
- Use foreign keys.
- Use NUMERIC for financial values.
- Use TIMESTAMPTZ for timestamps.
- Use JSONB for flexible settings.
- Maintain historical records.
- Index frequently queried columns.
- Include gym_id in gym-owned records.

### Database Communication

```text
CONTROLLER
    |
    v
SERVICE
    |
    v
REPOSITORY
    |
    v
PRISMA
    |
    v
POSTGRESQL
```

Business modules should not bypass their service and repository layers to perform unrelated operations.

For operations involving multiple database records, use Prisma transactions.

Example:

When recording a membership payment:

1. Validate the membership.
2. Validate the payment amount.
3. Create the payment record.
4. Update any required financial state.
5. Record an audit event.

These operations must be handled consistently in a database transaction where appropriate.

---

# 12. File Storage Architecture

Files should not be stored directly in PostgreSQL.

Use external object storage for:

- Member profile pictures.
- Trainer profile pictures.
- Payment receipts.
- Expense attachments.
- Other documents.

Recommended options:

- Cloudinary.
- Amazon S3.
- S3-compatible storage.

The database should store file URLs or storage object keys.

### Upload Flow

```text
FRONTEND
   |
   v
BACKEND UPLOAD API
   |
   v
VALIDATE FILE
   |
   v
CLOUD STORAGE
   |
   v
RETURN FILE REFERENCE
   |
   v
SAVE REFERENCE IN DATABASE
```

Validate file size, MIME type and upload permissions.

---

# 13. Notification Architecture

Notifications will be handled through a separate notification module.

Supported channels:

- Email.
- WhatsApp.

### Notification Events

- Member registration.
- Membership expiry reminder.
- Membership expired.
- Payment received.
- Payment pending.
- Birthday notification.

### Notification Flow

```text
BUSINESS EVENT
      |
      v
NOTIFICATION SERVICE
      |
      v
SELECT TEMPLATE
      |
      v
PREPARE MESSAGE
      |
      v
SELECT CHANNEL
      |
      +----------+
      |          |
      v          v
    EMAIL     WHATSAPP
      |          |
      +----------+
           |
           v
     SAVE DELIVERY STATUS
```

Initially, notifications can be sent through direct service calls or scheduled tasks.

A background job queue can be introduced later if notification volume or reliability requirements justify it.

Notification failures should not accidentally reverse successful business operations such as member registration or payment recording.

---

# 14. Dashboard and Reporting Architecture

The dashboard should collect information from different modules.

It must not maintain independent copies of financial or membership data.

### Dashboard Data Sources

| Dashboard Metric | Source |
|---|---|
| Total Members | members |
| Active Members | members |
| Active Memberships | member_memberships |
| Expired Memberships | member_memberships |
| Today's Attendance | attendance |
| Today's Collections | payments |
| Outstanding Dues | member_memberships and payments |
| Monthly Expenses | expenses |
| Monthly Collections | payments |

### Reporting Strategy

Initially:

- Use PostgreSQL aggregate queries.
- Use joins where appropriate.
- Apply indexes.
- Use pagination.
- Cache only where necessary.

Later:

- Materialized views.
- Redis caching.
- Precomputed reporting tables.

Financial metrics must follow the definitions in `businessRules.md` and `dbDesign.md`.

---

# 15. Error Handling Architecture

Use centralized error handling.

### Error Types

- Validation Error.
- Authentication Error.
- Authorization Error.
- Not Found Error.
- Conflict Error.
- Database Error.
- External Service Error.
- Internal Server Error.

### Error Flow

```text
REQUEST
   |
   v
ROUTE / CONTROLLER
   |
   v
SERVICE
   |
   v
ERROR OCCURS
   |
   v
CENTRAL ERROR HANDLER
   |
   v
STANDARD ERROR RESPONSE
```

Do not expose sensitive internal error details to frontend users.

Log technical details on the backend.

---

# 16. Security Architecture

Security must be considered from the beginning.

### Authentication Security

- Hash passwords securely.
- Use HttpOnly cookies.
- Use Secure cookies in production.
- Configure SameSite appropriately.
- Implement refresh token rotation.
- Revoke refresh tokens on logout.
- Rate-limit login attempts.

### API Security

- Validate all incoming data.
- Implement RBAC.
- Enforce gym-level data isolation.
- Prevent SQL injection through safe database access.
- Configure CORS correctly.
- Apply request rate limits.
- Limit upload file types and sizes.
- Protect sensitive information.

### Database Security

- Use environment variables for credentials.
- Never commit `.env` files.
- Use least-privilege database credentials.
- Back up production data.
- Use migrations for schema changes.

---

# 17. Multi-Tenant SaaS Readiness

The first version will serve one gym.

However, the architecture should support future multiple gyms.

### Initial Version

```text
GYM MANAGEMENT SYSTEM
        |
        v
     ONE GYM
        |
        v
   USERS AND STAFF
        |
        v
   GYM OPERATIONS
```

### Future SaaS Version

```text
             SAAS APPLICATION
                    |
          +---------+---------+
          |         |         |
          v         v         v
        GYM A     GYM B     GYM C
          |         |         |
          v         v         v
        STAFF     STAFF     STAFF
          |         |         |
          v         v         v
        DATA      DATA      DATA
```

### SaaS Preparation Requirements

- Every gym has a unique gym_id.
- All gym-owned records contain gym_id.
- Backend queries enforce gym boundaries.
- Roles are gym-specific.
- Permissions are application-defined.
- Gym settings are isolated.
- Authorization validates gym context.

Subscription management, billing and plan limits will be introduced during SaaS conversion.

---

# 18. Deployment Architecture

The initial application can be deployed as a frontend and backend with a managed PostgreSQL database.

### Production Architecture

```text
              USERS
                |
                v
          FRONTEND HOST
                |
                v
           HTTPS REQUEST
                |
                v
          BACKEND HOST
                |
         +------+------+
         |             |
         v             v
     POSTGRESQL    EXTERNAL SERVICES
                       |
                 +-----+-----+
                 |     |     |
                 v     v     v
              STORAGE EMAIL WHATSAPP
```

### Deployment Requirements

- Environment-specific configuration.
- HTTPS.
- Database backups.
- Application logging.
- Error monitoring.
- Health check endpoint.
- Database migrations.
- Secure environment variables.

Docker can be introduced to standardize local development and deployment.

---

# 19. Development Architecture Rules

The following rules must be followed throughout development:

1. Use TypeScript in frontend and backend.
2. Follow modular monolith architecture.
3. Keep business logic inside service layers.
4. Keep controllers thin.
5. Validate requests using Zod.
6. Use Prisma for database operations.
7. Use transactions for related financial operations.
8. Enforce RBAC on backend APIs.
9. Enforce gym-level data isolation.
10. Keep frontend modules organized.
11. Use reusable components.
12. Maintain consistent API responses.
13. Use centralized error handling.
14. Maintain audit logs for important operations.
15. Avoid unnecessary abstractions.
16. Do not introduce microservices in the initial version.

---

# 20. Future Scalability

The architecture should allow gradual improvements.

| Requirement | Future Solution |
|---|---|
| Faster repeated queries | Redis |
| High notification volume | BullMQ |
| Background processing | Job workers |
| Large reporting workloads | Materialized views |
| Multiple application instances | Horizontal scaling |
| Reverse proxy and load balancing | Nginx |
| Multi-gym SaaS | Tenant isolation |
| Subscription billing | Billing module |
| Automated deployment | CI/CD |
| Centralized monitoring | Logging and monitoring platform |

These technologies should be introduced only when there is a clear requirement.

---

# 21. Final Architecture Decisions

| Area | Decision |
|---|---|
| Architecture | Modular Monolith |
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Server State | TanStack Query |
| Backend | Node.js + Express |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| API Style | REST |
| Authentication | JWT |
| Authorization | Dynamic RBAC |
| Validation | Zod |
| File Storage | Cloudinary / S3 |
| Email | Email Provider |
| WhatsApp | WhatsApp Business API Provider |
| Deployment | Separate frontend and backend |
| Future Caching | Redis |
| Future Jobs | BullMQ |
| Future SaaS | Multi-tenant architecture |

---

# 22. Architecture Acceptance Checklist

- [ ] Frontend and backend are separated.
- [ ] Backend follows modular monolith architecture.
- [ ] Every module has clear responsibilities.
- [ ] Controllers and services are separated.
- [ ] Database access is centralized.
- [ ] Authentication is implemented.
- [ ] Dynamic RBAC is implemented.
- [ ] Gym-level data isolation is enforced.
- [ ] API versioning is implemented.
- [ ] Centralized error handling is implemented.
- [ ] External services are isolated in integrations.
- [ ] Financial operations use database transactions.
- [ ] Notifications do not compromise business operations.
- [ ] Deployment configuration is documented.
- [ ] Future SaaS conversion is considered.

---

# 23. Final Decision

The Gym Management System will use a **Modular Monolith Architecture with a layered backend and modular frontend**.

This architecture is suitable for the initial single-gym application while keeping the system maintainable, secure and ready for future SaaS expansion.

The primary focus during development will be:

1. Clean architecture.
2. Correct business logic.
3. Database consistency.
4. Secure authorization.
5. Maintainable modules.
6. Reliable financial operations.
7. Scalable database design.