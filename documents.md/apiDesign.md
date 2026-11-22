# API Design – Gym Management System

## 1. Overview

The Gym Management System will use RESTful APIs for communication between the React frontend and Node.js backend.

The backend will be developed using:

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM

The frontend will communicate with the backend using HTTP requests and JSON.

### API Base URL

Development:

```text
http://localhost:5000/api/v1
```

Production:

```text
https://api.example.com/api/v1
```

All API endpoints must follow consistent naming conventions, request validation and response formats.

---

# 2. API Design Principles

The following principles must be followed:

1. Use REST API conventions.
2. Use plural resource names.
3. Use appropriate HTTP methods.
4. Use consistent response formats.
5. Validate all incoming requests.
6. Implement centralized error handling.
7. Protect APIs using authentication.
8. Implement dynamic RBAC authorization.
9. Enforce gym-level data isolation.
10. Use pagination for large datasets.
11. Use database transactions for critical operations.
12. Maintain API versioning.
13. Never trust frontend authorization checks.
14. Do not expose sensitive database information.

---

# 3. HTTP Methods

| Method | Purpose | Example |
|---|---|---|
| GET | Retrieve data | GET /members |
| POST | Create a resource or execute an action | POST /members |
| PUT | Replace a resource | PUT /members/:id |
| PATCH | Partially update a resource | PATCH /members/:id |
| DELETE | Delete a resource | DELETE /members/:id |

Use soft deletion or archival for important business records where historical data must be preserved.

For financial records, use explicit cancellation or reversal workflows instead of ordinary deletion.

---

# 4. Standard API Response Format

All APIs should follow a consistent response structure.

## 4.1 Success Response

```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "member-uuid",
    "fullName": "Rahul Sharma",
    "mobile": "9876543210"
  }
}
```

## 4.2 Error Response

```json
{
  "success": false,
  "message": "Member not found",
  "error": {
    "code": "MEMBER_NOT_FOUND"
  }
}
```

## 4.3 Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "mobile",
        "message": "Mobile number is required"
      }
    ]
  }
}
```

## 4.4 Paginated Response

```json
{
  "success": true,
  "message": "Members retrieved successfully",
  "data": [
    {
      "id": "member-uuid",
      "fullName": "Rahul Sharma",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

# 5. Common API Conventions

## 5.1 Pagination

List APIs should support:

```text
?page=1&limit=10
```

Parameters:

| Parameter | Description | Default |
|---|---|---|
| page | Current page | 1 |
| limit | Records per page | 10 |
| search | Search keyword | Optional |
| sortBy | Sorting field | Module-specific |
| sortOrder | asc or desc | desc |

The backend must validate pagination values and enforce a reasonable maximum page size.

## 5.2 Search

Example:

```text
GET /members?search=rahul
```

Search should be limited to supported fields.

## 5.3 Filtering

Example:

```text
GET /members?status=active&gender=male
```

## 5.4 Sorting

Example:

```text
GET /members?sortBy=createdAt&sortOrder=desc
```

Only allow predefined sortable fields.

## 5.5 Date Filtering

Example:

```text
GET /attendance?startDate=2026-11-01&endDate=2026-11-30
```

Date filtering must use the gym's configured timezone when interpreting gym-local dates.

---

# 6. Authentication APIs

Base path:

```text
/api/v1/auth
```

Authentication will use short-lived access tokens and longer-lived refresh tokens.

For browser authentication, tokens should be managed using appropriately configured Secure, HttpOnly cookies.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | /auth/login | Login | No |
| POST | /auth/logout | Logout | Yes |
| POST | /auth/refresh | Refresh access token | Refresh token |
| GET | /auth/me | Get current user | Yes |
| POST | /auth/change-password | Change password | Yes |

## 6.1 Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "owner@gym.com",
  "password": "StrongPassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "Gym Owner",
      "email": "owner@gym.com",
      "roles": ["Owner"],
      "permissions": [
        "members.view",
        "members.create",
        "payments.view"
      ]
    }
  }
}
```

Tokens should be set in secure cookies rather than returned in the response body for the browser-based application.

## 6.2 Get Current User

```http
GET /api/v1/auth/me
```

Returns the authenticated user's information, active roles and effective permissions.

## 6.3 Logout

```http
POST /api/v1/auth/logout
```

Revokes the relevant refresh session and clears authentication cookies.

## 6.4 Refresh Token

```http
POST /api/v1/auth/refresh
```

Validates and rotates the refresh token, then issues a new access token.

## 6.5 Change Password

```http
POST /api/v1/auth/change-password
```

Request:

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

---

# 7. User and Staff APIs

Base path:

```text
/api/v1/staff
```

Staff accounts are separate from gym member records.

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /staff | List staff | staff.view |
| GET | /staff/:id | Staff details | staff.view |
| POST | /staff | Create staff account | staff.create |
| PATCH | /staff/:id | Update staff | staff.update |
| PATCH | /staff/:id/status | Activate/deactivate staff | staff.update |
| GET | /staff/:id/roles | Get assigned roles | staff.view |
| PUT | /staff/:id/roles | Replace assigned roles | staff.assign_roles |

### Create Staff

```http
POST /api/v1/staff
```

Request:

```json
{
  "name": "Amit Kumar",
  "email": "amit@gym.com",
  "mobile": "9876543210",
  "password": "TemporaryPassword123",
  "roles": ["role-uuid"]
}
```

### Assign Roles

```http
PUT /api/v1/staff/:id/roles
```

Request:

```json
{
  "roleIds": [
    "role-uuid-1",
    "role-uuid-2"
  ]
}
```

The backend must validate that all assigned roles belong to the same gym.

---

# 8. Roles and Permissions APIs

Base paths:

```text
/api/v1/roles
/api/v1/permissions
```

The system will use dynamic RBAC.

Permissions are predefined by the application. Gym administrators can create custom roles by selecting permissions from the available catalogue.

## 8.1 Roles APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /roles | List roles | roles.view |
| GET | /roles/:id | Role details | roles.view |
| POST | /roles | Create role | roles.create |
| PATCH | /roles/:id | Update role | roles.update |
| DELETE | /roles/:id | Delete role | roles.delete |
| GET | /roles/:id/permissions | Get role permissions | roles.view |
| PUT | /roles/:id/permissions | Replace role permissions | roles.assign_permissions |

### Create Role

```http
POST /api/v1/roles
```

Request:

```json
{
  "name": "Receptionist",
  "description": "Handles front desk operations",
  "permissionIds": [
    "permission-uuid-1",
    "permission-uuid-2"
  ]
}
```

### Update Role Permissions

```http
PUT /api/v1/roles/:id/permissions
```

Request:

```json
{
  "permissionIds": [
    "permission-uuid-1",
    "permission-uuid-3"
  ]
}
```

The operation replaces the role's existing permission assignments.

The backend must validate all permission IDs against the application permission catalogue.

## 8.2 Permission APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /permissions | Get permission catalogue | roles.view |
| GET | /permissions/modules | Get permission modules | roles.view |

Example response:

```json
{
  "success": true,
  "data": [
    {
      "module": "members",
      "permissions": [
        {
          "id": "permission-uuid-1",
          "key": "members.view",
          "name": "View Members"
        },
        {
          "id": "permission-uuid-2",
          "key": "members.create",
          "name": "Create Members"
        }
      ]
    }
  ]
}
```

---

# 9. Gym and Settings APIs

Base path:

```text
/api/v1/gym-settings
```

These APIs manage gym information and configuration.

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /gym-settings | Get gym settings | gym_settings.view |
| PATCH | /gym-settings | Update gym settings | gym_settings.update |
| GET | /gym-settings/profile | Get gym profile | gym_settings.view |
| PATCH | /gym-settings/profile | Update gym profile | gym_settings.update |

Example request:

```json
{
  "name": "Fitness First Gym",
  "mobile": "9876543210",
  "email": "contact@gym.com",
  "address": "Indore, Madhya Pradesh",
  "timezone": "Asia/Kolkata",
  "currency": "INR"
}
```

The backend must only allow updates to supported fields.

---

# 10. Member Management APIs

Base path:

```text
/api/v1/members
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /members | List members | members.view |
| GET | /members/:id | Member details | members.view |
| POST | /members | Create member | members.create |
| PATCH | /members/:id | Update member | members.update |
| PATCH | /members/:id/status | Change member status | members.update |
| GET | /members/:id/memberships | Membership history | memberships.view |
| GET | /members/:id/payments | Payment history | payments.view |
| GET | /members/:id/attendance | Attendance history | attendance.view |
| GET | /members/:id/events | Member activity history | members.view |

## 10.1 Create Member

```http
POST /api/v1/members
```

Request:

```json
{
  "fullName": "Rahul Sharma",
  "mobile": "9876543210",
  "email": "rahul@gmail.com",
  "gender": "male",
  "dateOfBirth": "2000-05-15",
  "address": "Indore, Madhya Pradesh",
  "emergencyContact": "9876501234",
  "joiningDate": "2026-11-23"
}
```

The backend should generate the member code.

## 10.2 Get Members

```http
GET /api/v1/members?page=1&limit=10&search=rahul&status=active
```

## 10.3 Update Member

```http
PATCH /api/v1/members/:id
```

Request:

```json
{
  "fullName": "Rahul Sharma",
  "mobile": "9876543210",
  "address": "Vijay Nagar, Indore"
}
```

## 10.4 Change Member Status

```http
PATCH /api/v1/members/:id/status
```

Request:

```json
{
  "status": "inactive"
}
```

Member account status and membership status must remain separate.

---

# 11. Membership Management APIs

Base paths:

```text
/api/v1/membership-plans
/api/v1/memberships
```

Membership plans define available membership packages.

Member memberships represent actual memberships purchased or assigned to individual members.

## 11.1 Membership Plan APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /membership-plans | List plans | memberships.view |
| GET | /membership-plans/:id | Plan details | memberships.view |
| POST | /membership-plans | Create plan | memberships.create |
| PATCH | /membership-plans/:id | Update plan | memberships.update |
| PATCH | /membership-plans/:id/status | Activate/deactivate plan | memberships.update |

## 11.2 Member Membership APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /memberships | List memberships | memberships.view |
| GET | /memberships/:id | Membership details | memberships.view |
| POST | /memberships | Assign membership | memberships.create |
| POST | /memberships/:id/renew | Renew membership | memberships.renew |
| POST | /memberships/:id/freeze | Freeze membership | memberships.freeze |
| POST | /memberships/:id/unfreeze | Unfreeze membership | memberships.freeze |
| POST | /memberships/:id/extend | Extend membership | memberships.extend |
| POST | /memberships/:id/cancel | Cancel membership | memberships.cancel |
| GET | /memberships/:id/events | Membership history | memberships.view |

## 11.3 Create Membership Plan

```http
POST /api/v1/membership-plans
```

Request:

```json
{
  "name": "Monthly Plan",
  "durationDays": 30,
  "price": 1500,
  "description": "Standard monthly gym membership"
}
```

## 11.4 Assign Membership

```http
POST /api/v1/memberships
```

Request:

```json
{
  "memberId": "member-uuid",
  "planId": "plan-uuid",
  "startDate": "2026-11-23",
  "discountAmount": 100,
  "finalAmount": 1400
}
```

The backend must:

1. Validate the member.
2. Validate the plan.
3. Calculate and verify the final amount.
4. Generate the membership code.
5. Determine the membership end date.
6. Create the membership record.
7. Record the membership event.

Membership creation and payment recording should be separate operations so partial and pending payments are supported.

## 11.5 Renew Membership

```http
POST /api/v1/memberships/:id/renew
```

Request:

```json
{
  "planId": "new-plan-uuid",
  "startDate": "2026-12-23",
  "discountAmount": 0,
  "finalAmount": 1500
}
```

The backend should create a new membership record for the renewal rather than overwriting the old membership history.

## 11.6 Freeze Membership

```http
POST /api/v1/memberships/:id/freeze
```

Request:

```json
{
  "startDate": "2026-12-01",
  "endDate": "2026-12-07",
  "reason": "Member travelling"
}
```

## 11.7 Extend Membership

```http
POST /api/v1/memberships/:id/extend
```

Request:

```json
{
  "additionalDays": 7,
  "reason": "Approved extension"
}
```

---

# 12. Attendance Management APIs

Base path:

```text
/api/v1/attendance
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /attendance | Attendance records | attendance.view |
| GET | /attendance/:id | Attendance details | attendance.view |
| POST | /attendance/check-in | Manual check-in | attendance.create |
| POST | /attendance/check-out | Check-out | attendance.update |
| POST | /attendance/qr-check-in | QR check-in | attendance.qr_checkin |
| PATCH | /attendance/:id | Correct attendance | attendance.update |
| GET | /attendance/member/:memberId | Member attendance | attendance.view |
| GET | /attendance/summary | Attendance summary | attendance.view |

## 12.1 Manual Check-in

```http
POST /api/v1/attendance/check-in
```

Request:

```json
{
  "memberId": "member-uuid",
  "method": "manual"
}
```

The backend must verify:

- Member exists.
- Member belongs to the authenticated gym.
- Member account is eligible.
- Member has an active membership.
- Member is not already checked in for the applicable attendance period.

## 12.2 QR Check-in

```http
POST /api/v1/attendance/qr-check-in
```

Request:

```json
{
  "token": "member-qr-token"
}
```

The backend must validate the token securely and verify membership eligibility.

QR tokens must not expose sensitive member information.

## 12.3 Attendance Summary

```http
GET /api/v1/attendance/summary?date=2026-11-23
```

Returns attendance totals and related summary information.

---

# 13. Payment Management APIs

Base path:

```text
/api/v1/payments
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /payments | List payments | payments.view |
| GET | /payments/:id | Payment details | payments.view |
| POST | /payments | Record payment | payments.create |
| GET | /payments/:id/receipt | Get receipt | payments.view |
| POST | /payments/:id/refunds | Create refund | payments.refund |
| GET | /payments/:id/refunds | Refund history | payments.view |
| GET | /payments/summary | Payment summary | payments.view |
| GET | /payments/pending | Pending dues | payments.view |

## 13.1 Record Payment

```http
POST /api/v1/payments
```

Request:

```json
{
  "memberId": "member-uuid",
  "membershipId": "membership-uuid",
  "amount": 1000,
  "method": "upi",
  "referenceNumber": "UPI123456"
}
```

The backend must:

1. Validate the member and membership.
2. Validate the amount.
3. Verify the outstanding amount.
4. Record the payment.
5. Generate a receipt number.
6. Update the relevant financial calculations.
7. Record an audit event.

For the initial version, each payment will be allocated to one membership.

If the system later supports a single payment covering multiple invoices or memberships, introduce a payment allocation model.

## 13.2 Partial Payment

Example:

Membership amount: ₹1,500.

First payment: ₹1,000.

Remaining due: ₹500.

Second payment: ₹500.

Remaining due: ₹0.

Outstanding dues must be calculated from the successful payments allocated to the membership, subject to the refund and adjustment rules in `businessRules.md`.

## 13.3 Refund

```http
POST /api/v1/payments/:id/refunds
```

Request:

```json
{
  "amount": 500,
  "reason": "Approved refund"
}
```

The backend must validate that the cumulative successful refunds do not exceed the refundable payment amount.

Refunds must be recorded separately from payments.

---

# 14. Trainer Management APIs

Base path:

```text
/api/v1/trainers
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /trainers | List trainers | trainers.view |
| GET | /trainers/:id | Trainer details | trainers.view |
| POST | /trainers | Create trainer | trainers.create |
| PATCH | /trainers/:id | Update trainer | trainers.update |
| PATCH | /trainers/:id/status | Change trainer status | trainers.update |
| GET | /trainers/:id/members | Assigned members | trainers.view |
| POST | /trainers/:id/members | Assign member | trainers.assign_members |
| DELETE | /trainers/:id/members/:memberId | End assignment | trainers.assign_members |
| GET | /trainers/:id/attendance | Trainer attendance | trainers.view |

## 14.1 Create Trainer

```http
POST /api/v1/trainers
```

Request:

```json
{
  "name": "Amit Verma",
  "mobile": "9876543210",
  "email": "amit@gym.com",
  "specialization": "Weight Training",
  "salary": 15000
}
```

A trainer may optionally be linked to a staff login account.

Trainer profile data and staff login credentials must remain separate.

## 14.2 Assign Member

```http
POST /api/v1/trainers/:id/members
```

Request:

```json
{
  "memberId": "member-uuid",
  "startDate": "2026-11-23"
}
```

The backend must validate both records and their gym ownership.

---

# 15. Trainer Attendance APIs

Base path:

```text
/api/v1/trainer-attendance
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /trainer-attendance | List trainer attendance | trainers.view |
| POST | /trainer-attendance/check-in | Trainer check-in | trainers.attendance |
| POST | /trainer-attendance/check-out | Trainer check-out | trainers.attendance |
| GET | /trainer-attendance/summary | Attendance summary | trainers.view |

This module can be implemented as part of the trainer module initially if keeping fewer modules is preferable.

---

# 16. Expense Management APIs

Base paths:

```text
/api/v1/expense-categories
/api/v1/expenses
```

## 16.1 Expense Category APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /expense-categories | List categories | expenses.view |
| POST | /expense-categories | Create category | expenses.create |
| PATCH | /expense-categories/:id | Update category | expenses.update |
| PATCH | /expense-categories/:id/status | Change category status | expenses.update |

## 16.2 Expense APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /expenses | List expenses | expenses.view |
| GET | /expenses/:id | Expense details | expenses.view |
| POST | /expenses | Create expense | expenses.create |
| PATCH | /expenses/:id | Update expense | expenses.update |
| PATCH | /expenses/:id/status | Update expense status | expenses.update |
| GET | /expenses/summary | Expense summary | expenses.view |

## 16.3 Create Expense

```http
POST /api/v1/expenses
```

Request:

```json
{
  "categoryId": "category-uuid",
  "title": "Electricity Bill",
  "amount": 3500,
  "expenseDate": "2026-11-23",
  "paymentMethod": "upi",
  "status": "paid",
  "description": "Monthly electricity bill"
}
```

Expense creation must validate the category and amount.

Only paid expenses should be included in actual cash-outflow calculations.

---

# 17. Notification APIs

Base paths:

```text
/api/v1/notifications
/api/v1/notification-templates
```

## 17.1 Notification APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /notifications | List notifications | notifications.view |
| GET | /notifications/:id | Notification details | notifications.view |
| POST | /notifications/:id/retry | Retry failed notification | notifications.manage |
| GET | /notifications/summary | Notification summary | notifications.view |

## 17.2 Notification Template APIs

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /notification-templates | List templates | notifications.view |
| POST | /notification-templates | Create template | notifications.manage |
| PATCH | /notification-templates/:id | Update template | notifications.manage |
| PATCH | /notification-templates/:id/status | Activate/deactivate template | notifications.manage |

The system should generate notifications from business events.

Manual sending APIs can be introduced later if required.

Notification delivery status should be stored for tracking.

---

# 18. Reports APIs

Base path:

```text
/api/v1/reports
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /reports/dashboard | Dashboard report | reports.view |
| GET | /reports/revenue | Revenue report | reports.view |
| GET | /reports/expenses | Expense report | reports.view |
| GET | /reports/members | Member report | reports.view |
| GET | /reports/memberships | Membership report | reports.view |
| GET | /reports/attendance | Attendance report | reports.view |
| GET | /reports/collections | Payment collection report | reports.view |
| GET | /reports/renewals | Membership renewal report | reports.view |
| GET | /reports/export | Export report | reports.export |

Example:

```http
GET /api/v1/reports/revenue?startDate=2026-11-01&endDate=2026-11-30
```

Example response:

```json
{
  "success": true,
  "message": "Revenue report retrieved successfully",
  "data": {
    "totalCollections": 50000,
    "totalRefunds": 2000,
    "netCollections": 48000,
    "totalExpenses": 15000
  }
}
```

Financial reports must clearly distinguish:

- Membership sales.
- Successful payment collections.
- Outstanding dues.
- Refunds.
- Net collections.
- Paid expenses.

Do not treat membership sales as automatically collected revenue.

---

# 19. Dashboard APIs

Base path:

```text
/api/v1/dashboard
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /dashboard/overview | Dashboard statistics | dashboard.view |
| GET | /dashboard/revenue-chart | Revenue chart | dashboard.view |
| GET | /dashboard/attendance-chart | Attendance chart | dashboard.view |
| GET | /dashboard/recent-members | Recent registrations | dashboard.view |
| GET | /dashboard/recent-payments | Recent payments | dashboard.view |
| GET | /dashboard/expiring-memberships | Upcoming expirations | dashboard.view |

## 19.1 Dashboard Overview

```http
GET /api/v1/dashboard/overview
```

Example response:

```json
{
  "success": true,
  "data": {
    "totalMembers": 500,
    "activeMembers": 420,
    "expiredMembers": 80,
    "todayAttendance": 120,
    "todayCollections": 15000,
    "pendingDues": 25000,
    "monthlyCollections": 250000
  }
}
```

Dashboard APIs should use efficient aggregate queries.

---

# 20. Audit Log APIs

Base path:

```text
/api/v1/audit-logs
```

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /audit-logs | List audit logs | audit_logs.view |
| GET | /audit-logs/:id | Audit log details | audit_logs.view |

Audit logs should capture important actions such as:

- Member creation and updates.
- Membership assignment and renewal.
- Payment creation.
- Refunds.
- Expense changes.
- Role creation and updates.
- Permission changes.
- Staff role assignments.
- Staff activation and deactivation.

Audit logs should not be editable or deletable through ordinary application APIs.

---

# 21. API Authorization Rules

Every protected endpoint must declare the permission it requires.

Example:

```typescript
router.post(
  "/members",
  authenticate,
  authorize("members.create"),
  validate(createMemberSchema),
  createMember
);
```

### Authorization Responsibilities

**Authentication middleware**

Verifies the user's identity and active session.

**Gym context middleware**

Determines the user's gym and establishes the request's tenant context.

**Authorization middleware**

Checks whether the user has the required permission.

**Service layer**

Performs additional business-level and record-level authorization checks where necessary.

### Important Rules

1. Never trust permissions sent by the frontend.
2. Never trust a client-supplied gym ID as proof of access.
3. Verify that requested records belong to the user's gym.
4. Check record-level restrictions for trainers.
5. Protect critical owner operations.
6. Record sensitive authorization changes in audit logs.

---

# 22. HTTP Status Codes

| Status Code | Meaning | Example |
|---|---|---|
| 200 | OK | Data retrieved |
| 201 | Created | Member created |
| 204 | No Content | Successful operation without response body |
| 400 | Bad Request | Invalid request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Member not found |
| 409 | Conflict | Duplicate member mobile or email |
| 422 | Unprocessable Entity | Valid format but business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected backend error |
| 503 | Service Unavailable | Required service unavailable |

---

# 23. API Validation Rules

Use Zod for request validation.

Validate:

- Request body.
- URL parameters.
- Query parameters.
- UUID formats.
- Email addresses.
- Mobile numbers.
- Dates.
- Monetary values.
- Enum values.
- Pagination limits.

Validation must happen on the backend even if frontend validation already exists.

Never accept arbitrary database fields from frontend requests.

---

# 24. Transaction Requirements

The following operations require careful transactional handling.

| Operation | Related Actions |
|---|---|
| Create Member | Create member and audit event |
| Assign Membership | Create membership and membership event |
| Record Payment | Create payment, receipt reference and audit event |
| Refund Payment | Create refund and audit event |
| Freeze Membership | Create freeze period and membership event |
| Renew Membership | Create new membership and renewal history |
| Assign Staff Roles | Update role assignments and audit event |
| Update Role Permissions | Replace permission assignments and audit event |

Use database transactions whenever multiple database changes must succeed or fail together.

External operations, such as email delivery, should generally happen after the database transaction commits.

---

# 25. API Security Requirements

- Use HTTPS in production.
- Use secure authentication cookies.
- Configure CORS correctly.
- Apply rate limiting.
- Validate all incoming data.
- Use parameterized database queries through Prisma.
- Enforce backend RBAC.
- Enforce gym-level data isolation.
- Avoid exposing passwords and token hashes.
- Restrict file uploads.
- Log important actions.
- Never expose internal stack traces in production responses.

---

# 26. API Development Priority

Implement APIs in the following order.

| Priority | Module | APIs |
|---|---|---|
| 1 | Authentication | Login, logout, refresh, current user |
| 2 | Gym Settings | Gym profile and settings |
| 3 | Staff and RBAC | Staff, roles, permissions |
| 4 | Members | Member CRUD and history |
| 5 | Memberships | Plans, assignment, renewal, freeze |
| 6 | Payments | Payment, receipt, refund, dues |
| 7 | Attendance | Manual and QR attendance |
| 8 | Trainers | Trainer CRUD and assignments |
| 9 | Expenses | Categories and expenses |
| 10 | Notifications | Templates and delivery records |
| 11 | Dashboard | Statistics and charts |
| 12 | Reports | Financial and operational reports |
| 13 | Audit Logs | Activity history |

Some modules can be developed in parallel after their dependencies are ready.

---

# 27. API Development Rules

1. Define the API contract before implementing the frontend integration.
2. Use consistent endpoint naming.
3. Use Zod for request validation.
4. Use centralized error handling.
5. Use authentication middleware for protected endpoints.
6. Use authorization middleware for permission checks.
7. Keep controllers thin.
8. Keep business logic inside services.
9. Keep database queries inside repositories.
10. Use Prisma transactions for related database changes.
11. Enforce gym-level data isolation.
12. Return consistent response structures.
13. Document changes to API contracts.
14. Test APIs using Postman or automated tests.

---

# 28. Final API Architecture Decision

The Gym Management System will use:

| Area | Decision |
|---|---|
| API Style | REST |
| API Version | v1 |
| Data Format | JSON |
| Authentication | JWT |
| Authorization | Dynamic RBAC |
| Validation | Zod |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Error Handling | Centralized |
| Pagination | Page and limit |
| Security | Backend authorization and gym isolation |

All APIs must follow these conventions to maintain consistency throughout the project.

The API design may evolve as modules are implemented, but changes must remain consistent with `prd.md`, `businessRules.md`, `rbac.md` and `dbDesign.md`.