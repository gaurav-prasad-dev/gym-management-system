# Development Plan – Gym Management System

## 1. Project Overview

The Gym Management System will be developed using a phased development approach.

The initial version will serve a single gym. However, the architecture and database will support future SaaS conversion.

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS |
| API | REST API |
| Authentication | JWT Access + Refresh Tokens |
| Authorization | Dynamic RBAC |
| Validation | Zod |
| API Testing | Postman |
| Frontend Testing | React Testing Library |
| Backend Testing | Vitest + Supertest |
| E2E Testing | Playwright |
| Version Control | Git + GitHub |

---

# 2. Development Strategy

We will follow these principles:

1. Backend-first development.
2. Modular monolith architecture.
3. Database design before module implementation.
4. Business logic separated from controllers.
5. Authentication and authorization from the beginning.
6. API testing before frontend integration.
7. Frontend development module by module.
8. Testing throughout development, not only at the end.
9. No unnecessary microservices or overengineering.
10. Keep future SaaS compatibility in mind without implementing SaaS features in the MVP.

### Development Flow

```text
Planning
   |
   v
Project Setup
   |
   v
Database Setup
   |
   v
Backend Foundation
   |
   v
Authentication + RBAC
   |
   v
Core Business Modules
   |
   v
Frontend Integration
   |
   v
Testing
   |
   v
Deployment
   |
   v
MVP Release
```

---

# 3. Development Phases

## Phase 0 – Project Setup

**Goal:** Prepare the development environment and initialize the project.

### Tasks

- Create GitHub repository.
- Clone repository in VS Code.
- Create frontend and backend directories.
- Initialize React + TypeScript + Vite.
- Initialize Node.js + Express + TypeScript.
- Install required dependencies.
- Configure environment variables.
- Configure ESLint and Prettier.
- Configure Git and `.gitignore`.
- Create README.md.
- Create initial folder structure.

### Backend Dependencies

- express
- typescript
- tsx
- prisma
- @prisma/client
- zod
- dotenv
- cors
- helmet
- cookie-parser
- bcrypt
- jsonwebtoken
- express-rate-limit

### Frontend Dependencies

- react
- react-dom
- react-router-dom
- @tanstack/react-query
- axios
- react-hook-form
- zod
- @hookform/resolvers
- tailwindcss
- lucide-react

### Deliverables

- Working frontend application.
- Working backend server.
- GitHub repository.
- Environment configuration.
- Initial project structure.

### Completion Criteria

- Frontend runs successfully.
- Backend runs successfully.
- Backend health-check API works.
- Frontend can communicate with backend.
- Project can be pushed to GitHub.

---

## Phase 1 – Database and Backend Foundation

**Goal:** Prepare the database and reusable backend infrastructure.

### Tasks

1. Install and configure PostgreSQL.
2. Configure Prisma.
3. Connect Prisma with PostgreSQL.
4. Create initial Prisma schema.
5. Implement database migrations.
6. Create Prisma seed script.
7. Configure environment validation.
8. Create centralized error handling.
9. Create API response utility.
10. Create request validation middleware.
11. Create authentication middleware foundation.
12. Configure application logging.
13. Configure API versioning.

### Database Tables

Start with:

- gyms
- gym_settings
- users
- staff
- roles
- permissions
- role_permissions
- user_roles

Other business tables will be added in their respective development phases.

### Deliverables

- PostgreSQL connection.
- Prisma configuration.
- Initial database migrations.
- Seed system.
- Centralized error handling.
- Common middleware.
- Standard API response structure.

### Completion Criteria

- Database connects successfully.
- Prisma migrations run successfully.
- Seed script creates initial data.
- Backend handles errors consistently.
- API validation works.

---

## Phase 2 – Authentication, Staff and RBAC

**Goal:** Build a secure login system and dynamic permission management.

This phase is important because all future modules will depend on authentication and authorization.

### Module 1: Authentication

Features:

- Staff login.
- Logout.
- Access token generation.
- Refresh token generation and rotation.
- Token revocation.
- Get current logged-in user.
- Change password.
- Inactive staff login restriction.

### Module 2: Staff Management

Features:

- Create staff account.
- Update staff information.
- Activate/deactivate staff.
- View staff list.
- View staff details.
- Assign roles to staff.
- Remove roles from staff.

### Module 3: Dynamic RBAC

Features:

- Permission catalogue.
- Create custom roles.
- Edit roles.
- Delete roles.
- Assign permissions to roles.
- Assign multiple roles to staff.
- Calculate effective permissions.
- Protect sensitive permissions.
- Backend authorization middleware.

### Default Role Templates

- Owner
- Administrator
- Receptionist
- Accountant
- Trainer

These will be default templates, not hardcoded authorization rules.

### Module 4: Audit Logs Foundation

Record important activities:

- Staff creation.
- Staff activation/deactivation.
- Role creation.
- Role modification.
- Permission changes.
- Role assignment/removal.
- Login and security events where appropriate.

### Deliverables

- Working authentication system.
- Staff management APIs.
- Dynamic RBAC system.
- Permission middleware.
- Audit logging foundation.

### Completion Criteria

- Staff can log in and log out.
- Refresh token rotation works.
- Inactive staff cannot access protected APIs.
- Admin can create custom roles.
- Admin can assign permissions to roles.
- Staff can have multiple roles.
- Unauthorized API requests are rejected.
- Sensitive role changes are audited.

---

## Phase 3 – Core Gym Management Modules

**Goal:** Build the main business functionality of the gym.

Develop these modules in the following order.

### Module 1: Member Management

Features:

- Register member.
- Update member details.
- Delete or archive member according to business rules.
- Activate/deactivate member.
- Search members.
- Filter members.
- View member profile.
- View membership history.
- View payment history.
- View attendance history.
- Upload member profile picture.

**Database tables:**
- members

**Completion criteria:**
- Member CRUD works.
- Search and filters work.
- Member history is accessible.
- Permission checks work.

### Module 2: Membership Plan Management

Features:

- Create membership plan.
- Edit membership plan.
- Activate/deactivate plan.
- View plans.
- Configure duration.
- Configure price.
- Configure plan description.

**Database tables:**
- membership_plans

**Completion criteria:**
- Admin can create and manage plans.
- Inactive plans cannot be assigned to new memberships.
- Existing membership records retain their historical price information.

### Module 3: Membership Management

Features:

- Assign membership to a member.
- Activate membership.
- Renew membership.
- Freeze membership.
- Unfreeze membership.
- Extend membership.
- Cancel membership.
- Expire membership.
- View membership history.
- View upcoming expirations.

**Database tables:**
- member_memberships
- membership_freeze_periods
- membership_events

**Important business rules:**

- A member can exist without an active membership.
- Membership and member account status are separate.
- Renewal creates a new membership record.
- Previous membership history must remain available.
- Membership end date is inclusive.
- Freeze operations must follow the configured business rules.
- Historical plan prices must not change when a plan is edited.

**Completion criteria:**
- Complete membership lifecycle works.
- Membership history is maintained.
- Freeze and renewal calculations are correct.
- Membership status updates correctly.

### Module 4: Payment Management

Features:

- Collect payment.
- Cash payment.
- UPI payment.
- Card payment.
- Partial payment.
- Pending dues.
- Payment history.
- Generate receipt.
- Refund payment.
- View daily collection.
- View monthly collection.

**Database tables:**
- payments
- refunds

**Important business rules:**

- Only successful payments count as collections.
- Partial payments must be supported.
- Refunds must be recorded separately.
- Payment records must not be silently deleted.
- Payment operations must use database transactions where necessary.
- Backend must verify the amount due instead of blindly trusting frontend values.

**Completion criteria:**
- Payments can be recorded.
- Partial payments work.
- Outstanding dues are calculated correctly.
- Receipts can be generated.
- Refunds are recorded correctly.

### Module 5: Attendance Management

Features:

- Manual check-in.
- Manual check-out.
- QR code check-in.
- Member attendance history.
- Today's attendance.
- Attendance filters.
- Attendance reports.

**Database tables:**
- attendance
- member_qr_tokens

**Important business rules:**

- Backend verifies membership eligibility.
- Expired or otherwise ineligible memberships cannot check in.
- Duplicate attendance must be prevented according to the attendance policy.
- QR tokens must be securely validated.
- Store QR token hashes, not raw reusable tokens.

**Completion criteria:**
- Manual attendance works.
- QR attendance works.
- Membership validation works.
- Duplicate attendance is prevented.
- Attendance history is available.

---

## Phase 4 – Trainers and Expenses

**Goal:** Build supporting gym operations.

### Module 1: Trainer Management

Features:

- Add trainer.
- Update trainer profile.
- Activate/deactivate trainer.
- Assign members to trainers.
- Remove member assignments.
- View assigned members.
- View trainer attendance.
- View trainer details.

**Database tables:**

- trainers
- trainer_member_assignments
- trainer_attendance

**Important rules:**

- Trainer profile can optionally link to a staff account.
- Trainer access must be restricted to authorized records.
- Assignment history must be preserved.

### Module 2: Expense Management

Features:

- Create expense category.
- Add expense.
- Edit expense.
- Mark expense as paid.
- Track pending expenses.
- View expense history.
- Filter expenses by category and date.
- View expense summary.

**Database tables:**

- expense_categories
- expenses

**Expense categories:**

- Rent
- Electricity
- Staff Salary
- Trainer Salary
- Equipment
- Maintenance
- Marketing
- Other

**Completion criteria:**

- Trainers can be managed.
- Member assignments work.
- Expense records can be created and updated.
- Paid and pending expenses are tracked separately.
- Expense reports show correct values.

---

## Phase 5 – Notifications and Automation

**Goal:** Automate routine gym operations.

### Features

- Welcome notification.
- Membership expiry reminder.
- Membership expired notification.
- Payment received notification.
- Pending payment reminder.
- Birthday notification.

### Notification Channels

Initially:

- Email
- WhatsApp

Use provider integrations for delivery.

### Background Jobs

Create scheduled jobs for:

- Checking upcoming membership expirations.
- Generating expiry notifications.
- Processing scheduled reminders.
- Retrying failed notifications where supported.

### Database Tables

- notification_templates
- notifications

### Important Rules

- Notifications should not block core business operations.
- Failed notifications must be logged.
- Avoid sending duplicate reminders.
- Notification delivery status must be tracked.
- Scheduled jobs must be safe to run more than once.

### Completion Criteria

- Notifications can be generated.
- Scheduled jobs run successfully.
- Delivery status is stored.
- Failures are logged.
- Duplicate notifications are prevented.

---

## Phase 6 – Dashboard and Reports

**Goal:** Provide useful business insights to gym owners and authorized staff.

### Dashboard Features

- Total members.
- Active members.
- Expired members.
- Today's attendance.
- Today's collection.
- Pending payments.
- Monthly revenue.
- Recent registrations.
- Recent payments.
- Upcoming membership expirations.
- Attendance chart.
- Revenue chart.

### Reports

- Daily collection report.
- Monthly collection report.
- Expense report.
- Active members report.
- Expired members report.
- Membership renewal report.
- Attendance report.
- Pending payment report.

### Important Rules

- Dashboard values must come from actual database records.
- Financial figures must follow the definitions in `businessRules.md`.
- Reports must respect user permissions.
- All data queries must be gym-scoped.
- Date filters must respect the gym's configured timezone.

### Completion Criteria

- Dashboard statistics are accurate.
- Charts display correct data.
- Reports support date filters.
- Financial calculations are verified.
- Unauthorized staff cannot access restricted reports.

---

## Phase 7 – Frontend Development and Integration

Frontend development should happen alongside backend module development, not only after all backend modules are finished.

For each module, follow this sequence:

```text
Backend API
    |
    v
API Testing
    |
    v
Frontend Page
    |
    v
API Integration
    |
    v
Loading / Error Handling
    |
    v
Permission-Based UI
    |
    v
Frontend Testing
```

### Frontend Development Order

1. Authentication pages.
2. Application layout.
3. Sidebar and navigation.
4. Dashboard.
5. Members.
6. Membership plans.
7. Membership management.
8. Payments.
9. Attendance.
10. Trainers.
11. Expenses.
12. Notifications.
13. Reports.
14. Staff management.
15. Roles and permissions.
16. Gym settings.
17. Audit logs.

### Common UI Components

Build reusable components when needed:

- Button
- Input
- Select
- Modal
- Confirmation dialog
- Data table
- Search bar
- Pagination
- Status badge
- Date picker
- Loading state
- Empty state
- Error state
- Stat card

### Completion Criteria

- All implemented frontend modules connect to their APIs.
- Forms validate correctly.
- Loading and error states are handled.
- Navigation respects permissions.
- Responsive layouts work on supported screen sizes.

---

## Phase 8 – Testing and Quality Assurance

**Goal:** Verify the complete application before release.

### Backend Testing

- Unit testing.
- API integration testing.
- Authentication testing.
- RBAC testing.
- Database testing.
- Business rule testing.

### Frontend Testing

- Component testing.
- Form validation testing.
- Permission-based UI testing.
- API integration testing.

### End-to-End Testing

Test complete workflows:

**Workflow 1: New Member Registration**

1. Admin logs in.
2. Admin registers a member.
3. Admin assigns a membership plan.
4. Admin collects payment.
5. System activates the membership.
6. Member appears in the active member list.

**Workflow 2: Member Attendance**

1. Receptionist logs in.
2. Receptionist searches for a member or scans QR code.
3. Backend checks membership eligibility.
4. Attendance is recorded.
5. Attendance appears in the daily attendance report.

**Workflow 3: Staff Permissions**

1. Owner creates a custom role.
2. Owner selects permissions.
3. Owner assigns the role to staff.
4. Staff logs in.
5. Staff can access authorized modules.
6. Staff cannot access unauthorized APIs.

**Workflow 4: Membership Renewal**

1. Admin opens an expired or expiring member profile.
2. Admin selects a new membership plan.
3. Admin processes payment.
4. New membership record is created.
5. Previous membership history remains unchanged.

**Workflow 5: Financial Reporting**

1. Accountant logs in.
2. Accountant records payments.
3. Accountant records expenses.
4. Accountant opens financial reports.
5. Reports display correct collections, refunds and expenses.

### Completion Criteria

- Critical business workflows pass.
- No critical authorization vulnerabilities remain.
- Financial calculations are verified.
- Database migrations work on a fresh database.
- No known critical bugs remain.

---

## Phase 9 – Deployment and MVP Release

**Goal:** Make the application available for real-world use.

### Tasks

- Prepare production environment.
- Configure production PostgreSQL.
- Configure environment variables.
- Build frontend for production.
- Deploy backend.
- Deploy frontend.
- Configure domain and HTTPS.
- Configure CORS and secure cookies.
- Run production database migrations.
- Configure database backups.
- Configure application logging.
- Configure error monitoring.
- Test production authentication.
- Test critical workflows.
- Prepare initial admin account securely.

### Completion Criteria

- Application is accessible through the production domain.
- HTTPS works.
- Production database is connected.
- Authentication works securely.
- Database backups are configured.
- Critical workflows work in production.

---

# 4. Recommended Development Order

Follow this order instead of randomly selecting modules.

| Order | Module / Task | Priority |
|---|---|---|
| 1 | Project Setup | Critical |
| 2 | Database Setup | Critical |
| 3 | Backend Foundation | Critical |
| 4 | Authentication | Critical |
| 5 | Staff Management | Critical |
| 6 | Dynamic RBAC | Critical |
| 7 | Audit Logs Foundation | High |
| 8 | Member Management | Critical |
| 9 | Membership Plans | Critical |
| 10 | Membership Management | Critical |
| 11 | Payment Management | Critical |
| 12 | Attendance Management | Critical |
| 13 | Trainer Management | Medium |
| 14 | Expense Management | High |
| 15 | Notifications | Medium |
| 16 | Dashboard | High |
| 17 | Reports | High |
| 18 | Gym Settings | High |
| 19 | Final Testing | Critical |
| 20 | Deployment | Critical |

---

# 5. Development Workflow for Every Module

Follow the same workflow whenever you start a new module.

### Step 1: Understand Requirements

Read:

- PRD
- MVP Scope
- Business Rules
- Module Documentation
- Database Design
- API Design

### Step 2: Database

- Review required tables.
- Check relationships.
- Add or update Prisma schema.
- Create migration.
- Verify constraints and indexes.

### Step 3: Backend

- Create routes.
- Create validation schemas.
- Create controllers.
- Create services.
- Add authorization middleware.
- Implement business logic.
- Handle errors and transactions.

### Step 4: API Testing

- Test successful requests.
- Test invalid requests.
- Test unauthorized requests.
- Test edge cases.
- Verify database records.

### Step 5: Frontend

- Create pages.
- Create components.
- Create forms.
- Integrate APIs.
- Add loading and error states.
- Add permission-based visibility.

### Step 6: Testing

- Test business logic.
- Test API integration.
- Test frontend behavior.
- Test complete workflows.

### Step 7: Documentation

- Update API documentation if endpoints change.
- Update database documentation if schema changes.
- Update test cases.
- Update project progress.

### Step 8: GitHub

- Review code changes.
- Commit changes.
- Push to GitHub.
- Merge the completed feature branch.

---

# 6. Git Workflow

Use feature branches to keep development organized.

### Main Branches

```text
main
develop
```

### Feature Branch Examples

```text
feature/project-setup
feature/database-setup
feature/authentication
feature/rbac
feature/member-management
feature/membership-management
feature/payment-management
feature/attendance-management
```

### Workflow

```text
develop
   |
   v
Create Feature Branch
   |
   v
Write Code
   |
   v
Test Feature
   |
   v
Commit Changes
   |
   v
Merge into Develop
   |
   v
Release to Main
```

### Commit Message Examples

```text
feat: add staff authentication

feat: implement dynamic role management

feat: add member registration

fix: correct membership expiry calculation

test: add payment service test cases

docs: update database design
```

---

# 7. Definition of Done

A module is not complete just because its frontend page is ready.

Every module must satisfy these conditions:

- [ ] Database structure is implemented.
- [ ] Database migrations work.
- [ ] Backend APIs are implemented.
- [ ] Request validation is implemented.
- [ ] Business rules are implemented.
- [ ] Authentication is applied.
- [ ] Authorization is applied.
- [ ] Error handling is implemented.
- [ ] API tests pass.
- [ ] Frontend pages are implemented.
- [ ] API integration works.
- [ ] Loading and error states are handled.
- [ ] Permission-based UI is implemented.
- [ ] Important edge cases are tested.
- [ ] Documentation is updated.
- [ ] Changes are pushed to GitHub.

---

# 8. MVP Release Scope

The first production release should focus on the essential gym operations.

### Must Have

- Authentication.
- Staff management.
- Dynamic RBAC.
- Member management.
- Membership plans.
- Membership management.
- Payment management.
- Attendance management.
- Expense management.
- Dashboard.
- Basic reports.
- Gym settings.
- Audit logs.

### Should Have

- Trainer management.
- QR attendance.
- Email notifications.
- Membership expiry automation.
- Payment receipts.

### Can Be Added Later

- WhatsApp automation.
- Biometric attendance.
- Workout management.
- Diet management.
- Mobile application.
- Advanced analytics.
- SaaS subscriptions and billing.
- Multiple gym branches.

---

# 9. Important Development Rules

1. Do not start all modules simultaneously.
2. Complete the foundation before developing business modules.
3. Do not implement frontend pages with fake data as a substitute for working backend APIs.
4. Do not skip API testing.
5. Never trust frontend calculations for payments or membership dates.
6. Never rely on frontend permissions for security.
7. Use database transactions for related financial and membership operations.
8. Preserve historical membership and payment records.
9. Use database migrations for schema changes.
10. Test critical business rules before moving to the next module.
11. Do not introduce microservices for this MVP.
12. Do not implement SaaS billing until the single-gym product is stable.

---

# 10. Project Progress Tracking

Maintain the following progress table as development continues.

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Project Setup | Not Started |
| Phase 1 | Database and Backend Foundation | Not Started |
| Phase 2 | Authentication, Staff and RBAC | Not Started |
| Phase 3 | Core Gym Management Modules | Not Started |
| Phase 4 | Trainers and Expenses | Not Started |
| Phase 5 | Notifications and Automation | Not Started |
| Phase 6 | Dashboard and Reports | Not Started |
| Phase 7 | Frontend Integration | Not Started |
| Phase 8 | Testing and Quality Assurance | Not Started |
| Phase 9 | Deployment and MVP Release | Not Started |

Update the status as:

- Not Started
- In Progress
- Completed
- Blocked

---

# 11. Final Development Strategy

The most important thing is to build the application in a controlled sequence.

**First:** Build the foundation, database, authentication and RBAC.

**Second:** Build the core business modules: members, memberships, payments and attendance.

**Third:** Build supporting modules: trainers, expenses and notifications.

**Fourth:** Complete dashboard, reports and frontend integration.

**Finally:** Test, secure and deploy the application.

The objective is not to finish as quickly as possible. The objective is to build a maintainable, secure and production-ready Gym Management System that can later evolve into a SaaS product.