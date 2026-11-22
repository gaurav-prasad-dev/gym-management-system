# Testing Strategy – Gym Management System

## 1. Purpose

This document defines the testing strategy for the Gym Management System.

The goal is to ensure that every module works correctly, business rules are followed, data remains consistent, and unauthorized users cannot access restricted information.

Testing should happen throughout development, not only after the application is completed.

---

## 2. Testing Objectives

The main objectives are:

- Verify that all features work as expected.
- Identify bugs before deployment.
- Ensure database operations are reliable.
- Prevent unauthorized access.
- Validate business rules.
- Ensure financial calculations are accurate.
- Verify that modules work correctly together.
- Test important user workflows.
- Ensure the application handles errors properly.

---

## 3. Testing Levels

We will use the following testing levels.

### 3.1 Unit Testing

Tests individual functions or small pieces of logic independently.

Examples:
- Calculate membership expiry date.
- Calculate pending payment amount.
- Validate member information.
- Calculate total revenue.
- Check whether a membership is active.
- Check whether a staff member has a permission.

Purpose: Verify that individual business logic functions work correctly.

### 3.2 Integration Testing

Tests whether multiple components work correctly together.

Examples:
- Create a member and save them in PostgreSQL.
- Assign a membership to a member.
- Record a payment and update the outstanding balance.
- Check in a member after verifying membership status.
- Assign a role and verify the user's effective permissions.

Purpose: Verify communication between services, database, and application modules.

### 3.3 API Testing

Tests backend endpoints.

Examples:
- POST /members
- GET /members
- POST /memberships
- POST /payments
- POST /attendance/check-in

Verify:
- Correct HTTP status codes.
- Correct response format.
- Input validation.
- Authentication.
- Authorization.
- Database changes.
- Error handling.

### 3.4 Frontend Testing

Tests the user interface and user interactions.

Examples:
- Add Member form.
- Membership assignment form.
- Payment collection form.
- Role creation page.
- Search and filtering.
- Pagination.
- Permission-based navigation.

Purpose: Ensure that users can operate the application correctly.

### 3.5 End-to-End Testing

Tests complete workflows from the user's perspective.

Example:

1. Login as receptionist.
2. Register a new member.
3. Assign a membership.
4. Collect a partial payment.
5. Verify the payment history.
6. Mark attendance.
7. Verify the dashboard updates.

Purpose: Ensure that complete business workflows work correctly.

---

## 4. Recommended Testing Tools

For the selected Node.js, Express, TypeScript, PostgreSQL, Prisma, and React stack:

| Purpose | Recommended Tool |
|---|---|
| Unit Testing | Vitest |
| API Testing | Vitest + Supertest |
| Frontend Component Testing | React Testing Library |
| End-to-End Testing | Playwright |
| API Manual Testing | Postman |
| Database Testing | Prisma + Test Database |
| Code Quality | ESLint + TypeScript |
| Coverage | Vitest Coverage |

Use a small, consistent testing stack. Avoid adding multiple tools that perform the same job.

---

## 5. Testing Environment

Maintain separate environments.

### Development Environment
Used for everyday development.

### Test Environment
Used for automated tests.

Requirements:
- Separate test database.
- Test-specific environment variables.
- Fake payment data.
- Mock email and WhatsApp services.
- No production customer data.

### Production Environment
Used by actual gym staff.

Never run automated tests against the production database.

### Database Rules

- Use a separate PostgreSQL database for tests.
- Reset test data between test suites when necessary.
- Use database transactions or controlled fixtures.
- Never use real customer information in test cases.
- Test migrations before applying them to production.

---

## 6. Unit Testing Strategy

Test business logic separately from API routes and database operations wherever possible.

### Membership Module

Test cases:

- Calculate membership end date correctly.
- Reject invalid membership duration.
- Calculate remaining membership days.
- Identify upcoming membership expiry.
- Prevent invalid freeze periods.
- Calculate extended membership dates correctly.
- Ensure renewal creates a new membership record.
- Verify membership status based on dates and business rules.

### Payment Module

Test cases:

- Calculate remaining dues.
- Support partial payments.
- Prevent payment amounts from exceeding allowed outstanding dues.
- Handle successful payments.
- Exclude failed payments from collections.
- Calculate refunds correctly.
- Calculate net collections.

Example:

Membership Amount = ₹5,000

First Payment = ₹2,000

Second Payment = ₹1,000

Remaining Amount = ₹2,000

The calculation should always return the correct balance.

### Attendance Module

Test cases:

- Allow check-in for eligible members.
- Reject expired memberships.
- Reject inactive member accounts.
- Prevent duplicate check-ins according to the attendance policy.
- Validate QR tokens.
- Reject invalid or expired QR tokens.

### RBAC Module

Test cases:

- Check whether a user has a specific permission.
- Combine permissions from multiple assigned roles.
- Reject users without the required permission.
- Ignore permissions from inactive roles.
- Prevent unauthorized role modifications.
- Prevent removal of the last active owner.

### Dashboard and Reports

Test cases:

- Calculate total members.
- Calculate active and expired members.
- Calculate today's attendance.
- Calculate daily collections.
- Calculate monthly collections.
- Calculate outstanding dues.
- Calculate paid expenses.
- Calculate net collections.

---

## 7. API Testing Strategy

Every API endpoint should be tested for:

1. Successful request.
2. Missing required fields.
3. Invalid input.
4. Unauthorized access.
5. Invalid resource ID.
6. Resource not found.
7. Database failure handling where practical.
8. Correct response structure.

### Authentication APIs

Test:
- Login with valid credentials.
- Login with incorrect credentials.
- Login with inactive account.
- Access protected API without authentication.
- Refresh expired access token.
- Reject invalid refresh token.
- Logout and invalidate refresh session.
- Change password with valid and invalid current passwords.

### Member APIs

Test:
- Create member.
- Get member list.
- Get member details.
- Update member.
- Change member status.
- Delete or archive member according to business rules.
- Search members.
- Filter members.
- Get membership history.
- Get payment history.
- Get attendance history.

### Membership APIs

Test:
- Create membership plan.
- Update membership plan.
- Deactivate membership plan.
- Assign membership.
- Renew membership.
- Freeze membership.
- Unfreeze membership.
- Extend membership.
- Cancel membership.
- Retrieve membership history.

### Attendance APIs

Test:
- Manual check-in.
- QR check-in.
- Check-out.
- Reject expired membership.
- Reject invalid QR token.
- Reject duplicate attendance.
- Retrieve daily attendance.
- Retrieve member attendance history.

### Payment APIs

Test:
- Create payment.
- Create partial payment.
- Retrieve payment.
- Retrieve payment history.
- Generate receipt.
- Create refund.
- Reject unauthorized refund.
- Retrieve pending dues.
- Retrieve collection summary.

### Staff and RBAC APIs

Test:
- Create staff.
- Update staff.
- Deactivate staff.
- Create custom role.
- Update role permissions.
- Delete unused role.
- Reject deletion of assigned role.
- Assign role to staff.
- Remove role from staff.
- Retrieve permission catalogue.
- Reject unauthorized permission changes.

---

## 8. Integration Testing Strategy

Integration tests should verify important operations involving multiple modules.

### Member Registration

Verify:
- Member is created successfully.
- Member ID is generated correctly.
- Member information is stored.
- Audit log is generated where required.

### Membership Assignment

Verify:
- Membership is linked to the correct member.
- Correct plan information is stored.
- Price snapshot is saved.
- Membership dates are correct.
- Membership event is recorded.

### Payment Collection

Verify:
- Payment is saved.
- Correct membership is linked.
- Receipt number is generated.
- Outstanding balance is updated.
- Payment history is updated.
- Audit log is recorded.

### Attendance

Verify:
- Member is found.
- Membership eligibility is checked.
- Attendance is recorded.
- Attendance history is updated.
- Dashboard attendance count is updated.

### Role Assignment

Verify:
- Role is assigned to the correct staff user.
- Effective permissions are updated.
- Unauthorized actions are rejected.
- Assignment history is recorded.

---

## 9. Frontend Testing Strategy

Test important UI components and pages.

### Authentication

- Login form validation.
- Invalid login message.
- Logout functionality.
- Protected routes.
- Session expiration behavior.

### Members

- Member list rendering.
- Search functionality.
- Filters.
- Add member form.
- Edit member form.
- Member profile.
- Membership and payment history.

### Memberships

- Plan creation.
- Plan editing.
- Membership assignment.
- Renewal.
- Freeze and unfreeze.
- Membership status display.

### Attendance

- Member search.
- Manual check-in.
- QR scanner interaction.
- Success and error messages.
- Attendance history.

### Payments

- Payment form validation.
- Partial payment calculations.
- Payment history.
- Receipt display.
- Refund confirmation.

### RBAC

- Permission-based navigation.
- Hide unauthorized actions.
- Role creation and editing.
- Permission selection.
- Staff role assignment.

Remember: frontend permission tests do not replace backend authorization tests.

---

## 10. End-to-End Testing

Use Playwright to test complete workflows.

### Workflow 1: New Member Registration

1. Login as receptionist.
2. Open Members.
3. Click Add Member.
4. Enter member details.
5. Submit the form.
6. Verify member creation.
7. Open the member profile.

Expected Result: Member should be created and displayed correctly.

### Workflow 2: Membership Assignment

1. Open a member profile.
2. Click Assign Membership.
3. Select a membership plan.
4. Enter the start date.
5. Confirm assignment.
6. Verify membership details.

Expected Result: A new membership record should be created with correct dates and amount.

### Workflow 3: Partial Payment

1. Open a member's membership.
2. Open Collect Payment.
3. Enter an amount smaller than the total amount due.
4. Select payment method.
5. Submit payment.
6. Verify receipt.
7. Verify remaining balance.

Expected Result: Payment should be recorded and outstanding dues should be calculated correctly.

### Workflow 4: Attendance

1. Open Attendance.
2. Search for a member.
3. Perform check-in.
4. Verify attendance entry.
5. Try checking in again.

Expected Result: First check-in should succeed. Duplicate check-in should be rejected according to the attendance policy.

### Workflow 5: Dynamic RBAC

1. Login as owner.
2. Open Roles & Permissions.
3. Create a Receptionist role.
4. Select member and attendance permissions.
5. Save the role.
6. Create a staff account.
7. Assign the Receptionist role.
8. Login as that staff member.
9. Verify allowed pages and actions.
10. Try accessing a restricted API directly.

Expected Result: Authorized actions should work, and unauthorized actions should be rejected by the backend.

### Workflow 6: Membership Expiry

1. Create a membership with an expiry date in the past.
2. Run the expiry processing logic.
3. Verify membership status.
4. Attempt attendance check-in.
5. Verify the check-in is rejected.
6. Verify the expiry notification is generated if configured.

Expected Result: Expired membership should not be eligible for attendance.

---

## 11. Security Testing

Security testing is mandatory because the application stores personal and financial information.

Test the following:

### Authentication
- Passwords are securely hashed.
- Invalid credentials are rejected.
- Refresh sessions are handled securely.
- Cookies use appropriate security settings.
- Logout invalidates the refresh session.

### Authorization
- Backend checks permissions for protected operations.
- Staff cannot access unauthorized modules.
- Users cannot change their own permissions without authorization.
- Staff cannot access another gym's data if gym isolation is implemented.

### Input Validation
- Reject invalid input.
- Prevent SQL injection through safe database access.
- Prevent unsafe file uploads.
- Validate uploaded file types and sizes.
- Sanitize user-generated content where necessary.

### Data Protection
- Never expose passwords or password hashes in API responses.
- Never expose refresh tokens in ordinary API response bodies.
- Do not store plain QR tokens.
- Avoid exposing sensitive personal information unnecessarily.
- Do not log passwords, tokens, or payment credentials.

### Important Authorization Test

A receptionist may not have permission to refund payments.

Even if the receptionist manually sends a refund API request through Postman, the backend must reject it.

---

## 12. Database Testing

Test database integrity and consistency.

Verify:

- Primary keys are unique.
- Foreign keys reference valid records.
- Required fields cannot be null.
- Unique constraints work.
- Transactions roll back on failure.
- Deleting records does not unexpectedly destroy required history.
- Indexes support important queries.
- Database migrations run successfully.

### Transaction Testing

For operations involving multiple database changes, verify that partial updates cannot remain after failure.

Example: Payment Collection

1. Create payment record.
2. Generate receipt.
3. Record audit event.

If an essential database operation fails, the transaction should roll back.

External operations such as sending an email should not be treated as part of a PostgreSQL transaction.

---

## 13. Performance Testing

Test performance as the amount of data increases.

Important areas:

- Member listing.
- Member search.
- Attendance history.
- Payment history.
- Dashboard statistics.
- Monthly reports.
- Membership expiry processing.

### Performance Guidelines

- Use pagination for large lists.
- Add indexes for frequently queried columns.
- Avoid unnecessary database queries.
- Avoid N+1 query problems.
- Use database aggregation for suitable reports.
- Avoid loading entire tables into memory.
- Monitor slow queries.

Initial performance targets (to be validated under realistic test conditions):

| Operation | Target |
|---|---|
| Normal API request | Under 500ms |
| Member search | Under 500ms |
| Dashboard API | Under 1 second |
| Standard report | Under 2 seconds |

These are initial targets, not guarantees. Measure actual performance before deciding whether optimization is required.

---

## 14. Automation Testing

Automated tests should run regularly.

Recommended workflow:

1. Developer writes code.
2. Developer runs linting and type checking.
3. Unit tests run.
4. Integration tests run.
5. Build is generated.
6. Pull request is reviewed.
7. End-to-end tests run in the appropriate CI environment.
8. Deployment happens only if required checks pass.

Use GitHub Actions or another CI tool to automate these checks.

Do not deploy code when critical tests are failing.

---

## 15. Test Data Strategy

Create reusable test data.

Suggested test accounts:

| Account | Role | Purpose |
|---|---|---|
| Owner | Owner | Full access testing |
| Admin | Administrator | Administration testing |
| Receptionist | Receptionist | Member and attendance testing |
| Accountant | Accountant | Financial testing |
| Trainer | Trainer | Trainer access testing |

Suggested test members:

- Active member.
- Expired member.
- Upcoming membership member.
- Frozen membership member.
- Member with pending dues.
- Member with fully paid membership.
- Member with partial payments.

Use fictional names, phone numbers, and email addresses.

---

## 16. Critical Business Scenarios

The following scenarios must be tested before production deployment.

| Scenario | Expected Result |
|---|---|
| Member without membership checks in | Rejected |
| Member with expired membership checks in | Rejected |
| Inactive member checks in | Rejected |
| Duplicate check-in | Rejected according to policy |
| Partial payment received | Remaining dues calculated correctly |
| Failed payment | Not counted as collection |
| Refund created | Refund recorded separately |
| Membership renewed | New membership history preserved |
| Membership frozen | Freeze period recorded |
| Unauthorized staff accesses API | Request rejected |
| Role deleted while assigned | Deletion rejected |
| Notification service fails | Main business operation remains successful |
| Database transaction fails | Related database changes roll back |
| Staff accesses another gym's data | Rejected when multi-tenancy is enabled |

---

## 17. Bug Reporting

Every identified bug should be documented.

Suggested bug report format:

- Bug ID.
- Title.
- Module.
- Description.
- Steps to reproduce.
- Expected result.
- Actual result.
- Severity.
- Status.
- Screenshot or API response, if applicable.

### Bug Severity

| Severity | Meaning |
|---|---|
| Critical | Application unusable, data loss, serious security issue |
| High | Important business operation broken |
| Medium | Feature partially broken |
| Low | Minor UI or usability issue |

Fix critical and high-severity bugs before production deployment.

---

## 18. Testing Checklist Before Deployment

### Authentication
- [ ] Login works.
- [ ] Logout works.
- [ ] Session refresh works.
- [ ] Protected routes work.
- [ ] Inactive staff cannot log in.

### Members
- [ ] Create member.
- [ ] Update member.
- [ ] Search and filter.
- [ ] Member profile.
- [ ] Member history.

### Memberships
- [ ] Create plans.
- [ ] Assign membership.
- [ ] Renew membership.
- [ ] Freeze and unfreeze.
- [ ] Extend membership.
- [ ] Expiry processing.

### Attendance
- [ ] Manual check-in.
- [ ] QR check-in.
- [ ] Check-out.
- [ ] Duplicate check-in prevention.
- [ ] Membership eligibility validation.

### Payments
- [ ] Collect payment.
- [ ] Partial payment.
- [ ] Payment history.
- [ ] Receipt generation.
- [ ] Refund.
- [ ] Pending dues calculation.

### Trainers and Expenses
- [ ] Create trainer.
- [ ] Assign members.
- [ ] Record trainer attendance.
- [ ] Create expense.
- [ ] Update expense.
- [ ] Expense reports.

### RBAC
- [ ] Create custom role.
- [ ] Update permissions.
- [ ] Assign role.
- [ ] Remove role.
- [ ] Prevent unauthorized actions.
- [ ] Protect owner access.

### Dashboard and Reports
- [ ] Dashboard statistics.
- [ ] Revenue charts.
- [ ] Attendance charts.
- [ ] Expense reports.
- [ ] Date filters.
- [ ] Export functionality.

### General
- [ ] Responsive UI.
- [ ] Loading states.
- [ ] Empty states.
- [ ] Error handling.
- [ ] Database migrations.
- [ ] Backup and restore process.
- [ ] Production environment variables.
- [ ] Logging and monitoring.

---

## 19. Testing Priorities

Do not try to test every feature with the same priority.

### Priority 1: Critical Business Logic
- Authentication.
- RBAC.
- Member management.
- Membership assignment and expiry.
- Attendance eligibility.
- Payments and refunds.
- Gym data isolation when applicable.

### Priority 2: Core Workflows
- Registration.
- Membership renewal.
- Partial payments.
- Trainer management.
- Expense management.
- Dashboard calculations.

### Priority 3: Supporting Features
- Notifications.
- Reports.
- Charts.
- Export functionality.
- UI polish.

---

## 20. Final Testing Principle

A feature is not complete just because its UI looks correct or its API returns a successful response.

A feature is complete when:

1. Its business rules work correctly.
2. Its database changes are correct.
3. Its API handles valid and invalid requests.
4. Its permissions are enforced by the backend.
5. Its frontend handles success, loading, and error states.
6. Its important workflows pass testing.

**Our goal is to build a reliable gym management application where business data, financial records, memberships, attendance, and staff permissions remain correct even when users make mistakes or unexpected failures occur.**