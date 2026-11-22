# User Flows – Gym Management System

## 1. Overview

This document defines the user journeys and workflows of the Gym Management System.

It explains how different users interact with the application and how the system responds to their actions.

The system will initially support a single gym, with architecture prepared for future SaaS conversion.

### Main User Types

1. Gym Owner
2. Administrator
3. Receptionist
4. Accountant
5. Trainer

These are default role templates. The gym owner or authorized administrator can create custom roles and assign permissions through the Settings page.

Ordinary gym members do not need login accounts in the initial version.

---

# 2. Overall Application Flow

```text
                 OPEN APPLICATION
                        |
                        v
                   LOGIN PAGE
                        |
                        v
                 ENTER CREDENTIALS
                        |
                        v
                VALIDATE CREDENTIALS
                        |
                +-------+-------+
                |               |
                v               v
             SUCCESS          FAILURE
                |               |
                v               v
          LOAD USER DATA    SHOW ERROR
                |
                v
          LOAD PERMISSIONS
                |
                v
             DASHBOARD
                |
       +--------+--------+
       |        |        |
       v        v        v
     MEMBERS MEMBERSHIPS PAYMENTS
       |        |        |
       +--------+--------+
                |
                v
           OTHER MODULES
```

The application should display navigation and actions according to the authenticated user's permissions.

The backend must independently enforce all permissions.

---

# 3. First-Time Gym Setup Flow

This flow describes how the gym owner configures the application for the first time.

### Steps

1. The owner opens the application.
2. The owner logs in using the initial account.
3. The system verifies the account.
4. The system redirects the owner to the dashboard or initial setup page.
5. The owner enters gym information.
6. The owner configures basic settings.
7. The owner reviews default roles.
8. The owner reviews the permission catalogue.
9. The owner configures membership plans.
10. The owner can start registering members.

### Flow Diagram

```text
INITIAL LOGIN
      |
      v
GYM PROFILE SETUP
      |
      v
BASIC SETTINGS
      |
      v
REVIEW DEFAULT ROLES
      |
      v
CREATE MEMBERSHIP PLANS
      |
      v
DASHBOARD
      |
      v
READY TO USE
```

### Gym Information

- Gym name.
- Gym address.
- Contact number.
- Email address.
- Logo.
- Timezone.
- Currency.

### Expected Result

The gym is configured and ready to manage members and daily operations.

---

# 4. Authentication Flow

## 4.1 Login Flow

### User Journey

1. User opens the application.
2. User enters email and password.
3. User clicks Login.
4. Frontend sends credentials to the backend.
5. Backend validates the credentials.
6. Backend checks whether the user is active.
7. Backend creates an authenticated session using access and refresh tokens.
8. Backend returns user information and sets secure authentication cookies.
9. Frontend retrieves the current user and permissions.
10. User is redirected to the dashboard.

### Flow Diagram

```text
LOGIN PAGE
    |
    v
ENTER EMAIL AND PASSWORD
    |
    v
SEND LOGIN REQUEST
    |
    v
VALIDATE CREDENTIALS
    |
    +----------------+
    |                |
    v                v
  VALID           INVALID
    |                |
    v                v
CHECK ACCOUNT     SHOW ERROR
STATUS
    |
    +----------------+
    |                |
    v                v
 ACTIVE           INACTIVE
    |                |
    v                v
CREATE SESSION    DENY ACCESS
    |
    v
LOAD USER AND PERMISSIONS
    |
    v
DASHBOARD
```

## 4.2 Logout Flow

1. User clicks Logout.
2. Frontend sends logout request.
3. Backend revokes the refresh session.
4. Backend clears authentication cookies.
5. Frontend clears user-related application state.
6. User is redirected to the login page.

## 4.3 Session Expiry Flow

1. Access token expires.
2. Frontend attempts to refresh the session.
3. Backend validates the refresh token.
4. If valid, a new access token is issued.
5. If invalid or revoked, the user is logged out.
6. User is redirected to login.

---

# 5. Staff Management Flow

The gym owner or authorized administrator can create staff accounts.

### User Journey

1. Owner opens Settings.
2. Owner selects Staff Management.
3. Owner clicks Add Staff.
4. Owner enters staff details.
5. Owner selects one or more roles.
6. Owner saves the staff account.
7. Backend validates the details and role assignments.
8. Backend creates the user and staff records.
9. Backend assigns the selected roles.
10. System records the action in audit logs.
11. Staff account is created.

### Flow Diagram

```text
SETTINGS
   |
   v
STAFF MANAGEMENT
   |
   v
ADD STAFF
   |
   v
ENTER STAFF DETAILS
   |
   v
SELECT ROLE
   |
   v
SAVE STAFF
   |
   v
VALIDATE DETAILS AND ROLES
   |
   +----------------+
   |                |
   v                v
 VALID             INVALID
   |                |
   v                v
CREATE ACCOUNT    SHOW ERROR
   |
   v
ASSIGN ROLES
   |
   v
AUDIT LOG
   |
   v
STAFF CREATED
```

### Staff Details

- Full name.
- Email.
- Mobile number.
- Password or invitation setup.
- Assigned role.
- Account status.

### Expected Result

Staff can log in and access only the features allowed by their assigned permissions.

---

# 6. Dynamic Role and Permission Management Flow

The owner can create custom roles based on staff responsibilities.

### Example

A gym might have:

- Front Desk Executive.
- Senior Trainer.
- Junior Trainer.
- Cashier.
- Gym Manager.

The owner can create these roles without requiring changes to the backend code.

## 6.1 Create Role Flow

1. Owner opens Settings.
2. Owner selects Roles & Permissions.
3. Owner clicks Create Role.
4. Owner enters the role name.
5. Owner enters a description.
6. System displays available modules.
7. Owner selects the required permissions.
8. Owner saves the role.
9. Backend validates the permission IDs.
10. Role and permission assignments are saved.
11. Audit log is created.

### Flow Diagram

```text
SETTINGS
   |
   v
ROLES & PERMISSIONS
   |
   v
CREATE ROLE
   |
   v
ENTER ROLE DETAILS
   |
   v
DISPLAY PERMISSION CATALOGUE
   |
   v
SELECT PERMISSIONS
   |
   v
SAVE ROLE
   |
   v
VALIDATE PERMISSIONS
   |
   v
CREATE ROLE AND ASSIGN PERMISSIONS
   |
   v
AUDIT LOG
   |
   v
ROLE CREATED
```

## 6.2 Edit Role Flow

1. Owner opens Roles & Permissions.
2. Owner selects an existing role.
3. Owner clicks Edit.
4. Owner modifies role details or permissions.
5. Owner saves changes.
6. Backend validates the changes.
7. Role permissions are updated.
8. Audit log is created.

Users with the updated role receive the new effective permissions on subsequent authorization checks.

## 6.3 Delete Role Flow

1. Owner selects a role.
2. Owner clicks Delete.
3. System checks whether the role is protected.
4. System checks whether the role is assigned to staff.
5. If protected or assigned, deletion is denied.
6. Otherwise, the role can be deleted.
7. Audit log is created.

## 6.4 Assign Role to Staff Flow

1. Owner opens Staff Management.
2. Owner selects a staff member.
3. Owner opens Role Assignment.
4. Owner selects the required roles.
5. Owner saves the changes.
6. Backend validates the roles and gym ownership.
7. Role assignments are updated.
8. Audit log is created.

### Important Rules

- One staff member can have multiple roles.
- Multiple staff members can share the same role.
- Effective permissions are the union of permissions from active assigned roles.
- Protected owner access cannot be removed through ordinary role management.
- The last active owner must not lose critical owner access.
- All role assignments must belong to the same gym.

---

# 7. Member Registration Flow

This is one of the most important workflows.

### User Journey

1. Receptionist opens Members.
2. Receptionist clicks Add Member.
3. System displays the registration form.
4. Receptionist enters member information.
5. Receptionist submits the form.
6. Backend validates the information.
7. Backend checks duplicate records according to gym rules.
8. Backend generates a unique member code.
9. Backend creates the member record.
10. Backend records the activity in audit logs.
11. System displays the member profile.

### Flow Diagram

```text
MEMBERS
   |
   v
ADD MEMBER
   |
   v
ENTER MEMBER DETAILS
   |
   v
SUBMIT FORM
   |
   v
VALIDATE DATA
   |
   v
CHECK DUPLICATES
   |
   +----------------+
   |                |
   v                v
 VALID             INVALID
   |                |
   v                v
CREATE MEMBER     SHOW ERROR
   |
   v
GENERATE MEMBER CODE
   |
   v
SAVE MEMBER
   |
   v
AUDIT LOG
   |
   v
MEMBER PROFILE
```

### Member Information

- Full name.
- Mobile number.
- Email.
- Gender.
- Date of birth.
- Address.
- Emergency contact.
- Joining date.
- Profile picture.

### Expected Result

A new member is registered successfully.

A member can exist without an active membership.

---

# 8. Membership Plan Creation Flow

The owner or authorized staff member can create membership plans.

### User Journey

1. User opens Memberships.
2. User selects Plans.
3. User clicks Create Plan.
4. User enters plan name.
5. User enters duration.
6. User enters price.
7. User enters description.
8. User saves the plan.
9. Backend validates the information.
10. Plan is created.

### Example Plans

| Plan | Duration | Price |
|---|---:|---:|
| Monthly | 30 days | ₹1,500 |
| Quarterly | 90 days | ₹4,000 |
| Half Yearly | 180 days | ₹7,000 |
| Yearly | 365 days | ₹12,000 |

### Flow Diagram

```text
MEMBERSHIPS
     |
     v
PLANS
     |
     v
CREATE PLAN
     |
     v
ENTER PLAN DETAILS
     |
     v
VALIDATE DATA
     |
     v
SAVE PLAN
     |
     v
PLAN CREATED
```

Changing a plan's price must not change the historical price of memberships already assigned to members.

---

# 9. Assign Membership to Member Flow

### User Journey

1. Receptionist opens Members.
2. Receptionist selects a member.
3. Receptionist clicks Assign Membership.
4. System displays available membership plans.
5. Receptionist selects a plan.
6. Receptionist selects the start date.
7. System calculates the default end date.
8. Receptionist applies an eligible discount if permitted.
9. System displays the final amount.
10. Receptionist confirms the membership.
11. Backend validates the member and plan.
12. Backend creates the membership record.
13. Backend records the membership event.
14. System displays membership details.

### Flow Diagram

```text
MEMBER PROFILE
      |
      v
ASSIGN MEMBERSHIP
      |
      v
SELECT PLAN
      |
      v
SELECT START DATE
      |
      v
CALCULATE END DATE
      |
      v
APPLY DISCOUNT IF ALLOWED
      |
      v
DISPLAY FINAL AMOUNT
      |
      v
CONFIRM
      |
      v
VALIDATE
      |
      v
CREATE MEMBERSHIP
      |
      v
SAVE MEMBERSHIP HISTORY
      |
      v
MEMBERSHIP CREATED
```

### Important Rules

- Membership plan must be active.
- Member must belong to the authenticated gym.
- Membership price must be stored as a historical snapshot.
- Start and end dates must follow membership business rules.
- Membership status is independent of member account status.
- Payment can be recorded separately.
- A membership can have full, partial or pending payment.

---

# 10. Membership Renewal Flow

### User Journey

1. Receptionist opens a member profile.
2. Receptionist opens Membership History.
3. Receptionist selects the membership to renew.
4. Receptionist clicks Renew.
5. System displays available plans.
6. Receptionist selects a plan.
7. System calculates the renewal dates.
8. Receptionist confirms the amount.
9. Backend validates the request.
10. Backend creates a new membership record.
11. Old membership history remains unchanged.
12. New membership is linked to the member.
13. Audit and membership events are recorded.

### Flow Diagram

```text
MEMBER PROFILE
      |
      v
MEMBERSHIP HISTORY
      |
      v
SELECT MEMBERSHIP
      |
      v
CLICK RENEW
      |
      v
SELECT NEW PLAN
      |
      v
CALCULATE DATES AND AMOUNT
      |
      v
CONFIRM
      |
      v
CREATE NEW MEMBERSHIP
      |
      v
SAVE RENEWAL HISTORY
      |
      v
RENEWAL COMPLETED
```

### Important Rules

- Never overwrite the previous membership record.
- Renewal must create a new membership record.
- Renewal dates must follow the business rules.
- Payment remains a separate operation.

---

# 11. Membership Freeze Flow

### User Journey

1. Receptionist opens the member profile.
2. Receptionist selects the active membership.
3. Receptionist clicks Freeze.
4. System displays freeze form.
5. Receptionist enters start date.
6. Receptionist enters end date.
7. Receptionist enters reason.
8. Receptionist submits the request.
9. Backend validates freeze eligibility.
10. Backend creates a freeze period.
11. Membership status and dates are updated according to business rules.
12. Membership event is recorded.

### Flow Diagram

```text
MEMBER PROFILE
      |
      v
SELECT MEMBERSHIP
      |
      v
FREEZE MEMBERSHIP
      |
      v
ENTER FREEZE DATES
      |
      v
ENTER REASON
      |
      v
VALIDATE REQUEST
      |
      v
CREATE FREEZE PERIOD
      |
      v
UPDATE MEMBERSHIP
      |
      v
SAVE EVENT
      |
      v
FREEZE COMPLETED
```

### Important Rules

- Only eligible memberships can be frozen.
- Freeze dates must be valid.
- Freeze limits must follow gym policy.
- Freeze periods must not overlap.
- Membership history must be preserved.

---

# 12. Payment Collection Flow

This workflow handles membership payments.

### User Journey

1. Receptionist opens a member profile.
2. Receptionist opens Payments.
3. Receptionist clicks Collect Payment.
4. System displays outstanding dues.
5. Receptionist enters payment amount.
6. Receptionist selects payment method.
7. Receptionist enters a transaction reference if applicable.
8. Receptionist confirms payment.
9. Backend validates the amount and membership.
10. Backend creates a successful payment record.
11. Backend generates a receipt number.
12. Backend records an audit event.
13. System displays payment confirmation.
14. Receipt becomes available.

### Flow Diagram

```text
MEMBER PROFILE
      |
      v
PAYMENTS
      |
      v
COLLECT PAYMENT
      |
      v
DISPLAY OUTSTANDING DUES
      |
      v
ENTER PAYMENT AMOUNT
      |
      v
SELECT PAYMENT METHOD
      |
      v
CONFIRM PAYMENT
      |
      v
VALIDATE PAYMENT
      |
      +----------------+
      |                |
      v                v
 VALID             INVALID
      |                |
      v                v
SAVE PAYMENT       SHOW ERROR
      |
      v
GENERATE RECEIPT
      |
      v
UPDATE DUES
      |
      v
PAYMENT SUCCESSFUL
```

### Example

Membership amount: ₹1,500.

First payment: ₹1,000.

Remaining due: ₹500.

Second payment: ₹500.

Remaining due: ₹0.

### Supported Payment Methods

- Cash.
- UPI.
- Card.
- Bank transfer.
- Other configured methods.

### Important Rules

- Only successful payments count toward collections.
- Partial payments are supported.
- Receipt numbers must be unique within the gym.
- Payment records should not be deleted through ordinary CRUD operations.
- Refunds must use a separate workflow.

---

# 13. Payment Refund Flow

### User Journey

1. Accountant opens Payments.
2. Accountant selects a payment.
3. Accountant clicks Refund.
4. System displays refundable amount.
5. Accountant enters refund amount.
6. Accountant enters refund reason.
7. Accountant submits the request.
8. Backend validates refund eligibility.
9. Refund record is created.
10. Audit log is recorded.
11. System displays refund details.

### Flow Diagram

```text
PAYMENTS
   |
   v
SELECT PAYMENT
   |
   v
CLICK REFUND
   |
   v
ENTER REFUND AMOUNT
   |
   v
ENTER REASON
   |
   v
VALIDATE REFUND
   |
   v
CREATE REFUND RECORD
   |
   v
UPDATE REFUND SUMMARY
   |
   v
AUDIT LOG
   |
   v
REFUND COMPLETED
```

### Important Rules

- Refund cannot exceed the refundable amount.
- Refund must be linked to an original payment.
- Refunds must be stored separately.
- Refund status should distinguish pending, successful and failed refunds.
- Outstanding dues must follow the refund policy defined in `businessRules.md`.

---

# 14. Manual Attendance Flow

### User Journey

1. Receptionist opens Attendance.
2. Receptionist searches for a member.
3. System displays member details.
4. Receptionist selects the member.
5. System checks membership eligibility.
6. If eligible, receptionist clicks Check-in.
7. Backend validates attendance rules.
8. Attendance record is created.
9. System displays successful check-in.

### Flow Diagram

```text
ATTENDANCE
    |
    v
SEARCH MEMBER
    |
    v
SELECT MEMBER
    |
    v
CHECK MEMBERSHIP STATUS
    |
    +----------------+
    |                |
    v                v
 ELIGIBLE         NOT ELIGIBLE
    |                |
    v                v
CHECK DUPLICATE   DENY CHECK-IN
    |
    +----------------+
    |                |
    v                v
 ALLOWED           EXISTS
    |                |
    v                v
CREATE RECORD     SHOW MESSAGE
    |
    v
CHECK-IN SUCCESSFUL
```

### Important Rules

- Member must belong to the authenticated gym.
- Member account must be eligible.
- Member must have an active membership.
- Frozen memberships must not be allowed to check in.
- Duplicate check-in must be prevented according to attendance policy.

---

# 15. QR Attendance Flow

### User Journey

1. Member presents their QR code.
2. Receptionist opens the QR scanner.
3. System scans the QR code.
4. Frontend sends the token to the backend.
5. Backend validates the token.
6. Backend identifies the member.
7. Backend verifies membership eligibility.
8. Backend checks duplicate attendance.
9. Backend creates the attendance record.
10. Frontend displays the result.

### Flow Diagram

```text
SCAN QR CODE
      |
      v
SEND TOKEN TO BACKEND
      |
      v
VALIDATE TOKEN
      |
      +----------------+
      |                |
      v                v
 VALID             INVALID
      |                |
      v                v
IDENTIFY MEMBER    DENY ACCESS
      |
      v
CHECK MEMBERSHIP
      |
      +----------------+
      |                |
      v                v
 ACTIVE            INACTIVE
      |                |
      v                v
CHECK DUPLICATE    DENY ACCESS
      |
      v
CREATE ATTENDANCE
      |
      v
SUCCESS MESSAGE
```

### Security Rules

- QR code must not contain sensitive personal information.
- Store token hashes rather than raw tokens.
- Support token expiry or rotation.
- Backend must verify all attendance conditions.
- Never trust the frontend scan result alone.

---

# 16. Trainer Management Flow

### Create Trainer

1. User opens Trainers.
2. User clicks Add Trainer.
3. User enters trainer details.
4. User optionally links an existing staff account.
5. User submits the form.
6. Backend validates the details.
7. Trainer profile is created.
8. Audit event is recorded.

### Assign Member to Trainer

1. User opens Trainers.
2. User selects a trainer.
3. User clicks Assign Member.
4. User searches for a member.
5. User selects the member.
6. User enters assignment start date.
7. User confirms.
8. Backend validates both records.
9. Assignment is created.
10. Audit event is recorded.

### Flow Diagram

```text
TRAINERS
    |
    v
SELECT TRAINER
    |
    v
ASSIGN MEMBER
    |
    v
SEARCH MEMBER
    |
    v
SELECT MEMBER
    |
    v
CONFIRM ASSIGNMENT
    |
    v
VALIDATE RECORDS
    |
    v
CREATE ASSIGNMENT
    |
    v
ASSIGNMENT COMPLETED
```

### Important Rules

- Trainer and member must belong to the same gym.
- Assignment history must be preserved.
- Ended assignments must not be treated as active.
- Trainer-specific access must be enforced at record level.

---

# 17. Trainer Attendance Flow

### User Journey

1. Authorized user opens Trainer Attendance.
2. User selects a trainer.
3. User clicks Check-in.
4. Backend validates trainer status.
5. Attendance record is created.
6. System displays confirmation.
7. Trainer checks out when leaving.
8. Attendance record is updated.

Trainer attendance is separate from member attendance.

---

# 18. Expense Management Flow

### Create Expense

1. Accountant opens Expenses.
2. Accountant clicks Add Expense.
3. System displays expense form.
4. Accountant selects expense category.
5. Accountant enters title and amount.
6. Accountant selects expense date.
7. Accountant selects payment method.
8. Accountant chooses the expense status.
9. Accountant submits the form.
10. Backend validates the information.
11. Expense record is created.
12. Audit log is recorded.

### Flow Diagram

```text
EXPENSES
   |
   v
ADD EXPENSE
   |
   v
SELECT CATEGORY
   |
   v
ENTER EXPENSE DETAILS
   |
   v
SELECT PAYMENT STATUS
   |
   v
SUBMIT
   |
   v
VALIDATE
   |
   v
CREATE EXPENSE
   |
   v
AUDIT LOG
   |
   v
EXPENSE SAVED
```

### Example Expense Categories

- Rent.
- Electricity.
- Water.
- Salaries.
- Equipment.
- Maintenance.
- Marketing.
- Miscellaneous.

### Important Rules

- Expense amount must be greater than zero.
- Category must belong to the authenticated gym.
- Only paid expenses count as actual cash outflow.
- Pending expenses must remain distinguishable from paid expenses.

---

# 19. Notification Flow

Notifications can be generated automatically when specific business events occur.

### Supported Events

- Member registration.
- Membership expiring soon.
- Membership expired.
- Payment received.
- Payment pending.
- Member birthday.

### Notification Flow

```text
BUSINESS EVENT
      |
      v
NOTIFICATION SERVICE
      |
      v
CHECK NOTIFICATION SETTINGS
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
     SEND MESSAGE
           |
           v
    SAVE DELIVERY STATUS
           |
           v
      COMPLETED
```

### Example: Membership Expiry Reminder

1. Scheduled task checks upcoming membership expirations.
2. System identifies eligible memberships.
3. Notification service selects the expiry template.
4. System prepares the message.
5. Message is sent through the configured channel.
6. Delivery status is saved.
7. Failed notifications can be retried according to retry policy.

### Important Rules

- Respect notification preferences.
- Avoid sending duplicate reminders for the same event and reminder period.
- Record delivery status.
- Notification failure must not reverse the original business operation.

---

# 20. Dashboard Flow

### User Journey

1. User logs in.
2. User reaches the dashboard.
3. Frontend requests dashboard data.
4. Backend verifies dashboard permissions.
5. Backend retrieves required information from business modules.
6. Backend calculates dashboard statistics.
7. Backend returns dashboard data.
8. Frontend displays statistics and charts.

### Dashboard Information

- Total members.
- Active members.
- Expired members.
- Today's attendance.
- Today's collections.
- Pending dues.
- Monthly collections.
- Recent registrations.
- Recent payments.
- Upcoming membership expirations.

### Flow Diagram

```text
USER OPENS DASHBOARD
         |
         v
REQUEST DASHBOARD DATA
         |
         v
VERIFY PERMISSION
         |
         v
FETCH MODULE DATA
         |
         v
CALCULATE STATISTICS
         |
         v
RETURN API RESPONSE
         |
         v
DISPLAY DASHBOARD
```

Dashboard calculations must use the financial and membership definitions established in `businessRules.md`.

---

# 21. Reports and Analytics Flow

### User Journey

1. User opens Reports.
2. User selects report type.
3. User selects date range.
4. User applies filters.
5. User clicks Generate Report.
6. Backend verifies report permissions.
7. Backend fetches relevant records.
8. Backend calculates report data.
9. Backend returns results.
10. User views the report.
11. If authorized, user exports the report.

### Supported Reports

- Revenue report.
- Expense report.
- Member report.
- Membership report.
- Attendance report.
- Payment collection report.
- Renewal report.

### Export Flow

```text
REPORT PAGE
     |
     v
SELECT REPORT TYPE
     |
     v
SELECT DATE RANGE
     |
     v
GENERATE REPORT
     |
     v
FETCH AND CALCULATE DATA
     |
     v
DISPLAY REPORT
     |
     v
CHECK EXPORT PERMISSION
     |
     v
EXPORT FILE
```

Export formats can include CSV, Excel and PDF depending on implementation priority.

---

# 22. Member Expiry Automation Flow

The system should periodically identify memberships approaching their end date.

### Workflow

1. Scheduled task runs.
2. Backend checks the gym's timezone.
3. Backend identifies memberships nearing expiry.
4. Backend excludes cancelled or otherwise ineligible memberships.
5. Backend checks notification history.
6. Backend creates reminder notifications.
7. Notification service sends messages.
8. Delivery status is stored.

### Flow Diagram

```text
SCHEDULED TASK
      |
      v
CHECK MEMBERSHIPS
      |
      v
IDENTIFY UPCOMING EXPIRATIONS
      |
      v
CHECK DUPLICATE REMINDERS
      |
      v
CREATE NOTIFICATIONS
      |
      v
SEND EMAIL / WHATSAPP
      |
      v
SAVE DELIVERY STATUS
```

Membership expiry itself must be determined by membership dates and business rules, not by whether a notification was sent.

---

# 23. Search and Filter Flow

Search and filtering should work consistently across modules.

### User Journey

1. User opens a listing page.
2. User enters a search term.
3. Frontend waits briefly to avoid unnecessary requests.
4. Frontend sends search and filter parameters.
5. Backend validates query parameters.
6. Backend applies gym-level filtering.
7. Backend executes database query.
8. Backend returns paginated results.
9. Frontend displays results.

### Flow Diagram

```text
OPEN LISTING PAGE
        |
        v
ENTER SEARCH / FILTER
        |
        v
SEND API REQUEST
        |
        v
VALIDATE QUERY
        |
        v
APPLY GYM FILTER
        |
        v
QUERY DATABASE
        |
        v
RETURN PAGINATED RESULTS
        |
        v
DISPLAY RESULTS
```

Search results must never include records belonging to another gym.

---

# 24. Error Handling Flows

The system must handle errors consistently.

### Validation Error

```text
USER SUBMITS FORM
       |
       v
BACKEND VALIDATION
       |
       v
INVALID DATA
       |
       v
RETURN VALIDATION ERROR
       |
       v
DISPLAY FIELD ERRORS
```

### Permission Error

```text
USER REQUESTS ACTION
       |
       v
AUTHENTICATION
       |
       v
PERMISSION CHECK
       |
       v
PERMISSION DENIED
       |
       v
RETURN HTTP 403
       |
       v
DISPLAY ACCESS DENIED
```

### Resource Not Found

```text
USER REQUESTS RECORD
       |
       v
CHECK RECORD
       |
       v
NOT FOUND OR NOT ACCESSIBLE
       |
       v
RETURN HTTP 404
```

Do not reveal whether a record belongs to another gym.

### External Service Failure

```text
BUSINESS OPERATION
       |
       v
SAVE DATABASE RECORD
       |
       v
SEND NOTIFICATION
       |
       v
EXTERNAL SERVICE FAILURE
       |
       v
SAVE FAILED DELIVERY STATUS
       |
       v
RETRY WHEN APPROPRIATE
```

An email or WhatsApp failure should not undo a successfully committed membership or payment transaction.

---

# 25. Permission-Based Navigation Flow

The frontend should display only the navigation items the user is allowed to access.

### Workflow

1. User logs in.
2. Frontend retrieves current user information.
3. Backend returns effective permissions.
4. Frontend checks permissions for navigation items.
5. Allowed navigation items are displayed.
6. Unauthorized items are hidden.
7. Backend independently verifies every protected request.

### Example

A Receptionist might have:

```text
Dashboard
Members
Memberships
Attendance
Payments
```

An Accountant might have:

```text
Dashboard
Payments
Expenses
Reports
```

A Trainer might have:

```text
Dashboard
Assigned Members
Trainer Attendance
```

These are examples, not fixed role definitions.

The actual navigation depends on the permissions assigned to each staff member.

---

# 26. Important Business Edge Cases

The following cases must be handled during implementation.

| Scenario | Expected System Behavior |
|---|---|
| Duplicate member registration | Reject according to configured uniqueness rules |
| Member without membership | Allow member profile but deny attendance |
| Expired membership | Deny attendance |
| Frozen membership | Deny attendance |
| Duplicate check-in | Prevent duplicate attendance |
| Partial payment | Update outstanding dues correctly |
| Payment exceeds outstanding amount | Reject unless an explicit advance-payment policy exists |
| Refund exceeds refundable amount | Reject refund |
| Membership plan price changes | Preserve historical membership amount |
| Delete assigned role | Reject deletion |
| Disable last active owner | Reject operation |
| Staff without permissions | Deny protected operations |
| Trainer accesses unassigned member | Deny if trainer restrictions are enabled |
| Notification fails | Preserve original business operation |
| Cross-gym record access | Deny access |
| Duplicate expiry notification | Prevent repeated notification for the same reminder event |
| Failed payment | Do not count it as successful collection |

---

# 27. End-to-End Primary Business Workflow

This is the main workflow connecting member registration, membership and payment.

### Complete New Member Journey

```text
REGISTER MEMBER
      |
      v
CREATE MEMBER PROFILE
      |
      v
SELECT MEMBERSHIP PLAN
      |
      v
ASSIGN MEMBERSHIP
      |
      v
CALCULATE FINAL AMOUNT
      |
      v
RECORD PAYMENT
      |
      v
CALCULATE OUTSTANDING DUES
      |
      v
GENERATE RECEIPT
      |
      v
SEND WELCOME NOTIFICATION
      |
      v
MEMBER READY FOR ATTENDANCE
```

### Example

A new member joins the gym.

1. Receptionist registers Rahul.
2. Rahul receives a member code.
3. Receptionist assigns the Monthly Plan.
4. Membership price is ₹1,500.
5. Rahul pays ₹1,000 using UPI.
6. System records the payment.
7. Outstanding dues become ₹500.
8. System generates a receipt for ₹1,000.
9. Membership and payment history are saved.
10. Rahul can check in if his membership is active and all attendance eligibility rules are satisfied.

---

# 28. User Flow Development Priority

Implement the workflows in the following order.

| Priority | Workflow | Dependency |
|---|---|---|
| 1 | Initial gym setup | Database and authentication |
| 2 | Login and logout | Users and authentication |
| 3 | Staff management | Authentication |
| 4 | Roles and permissions | Staff and RBAC |
| 5 | Member registration | Authentication and RBAC |
| 6 | Membership plan creation | RBAC |
| 7 | Membership assignment | Members and plans |
| 8 | Payment collection | Members and memberships |
| 9 | Attendance | Members and memberships |
| 10 | Membership renewal and freeze | Memberships |
| 11 | Trainer management | Staff and members |
| 12 | Expense management | RBAC |
| 13 | Notifications | Business events |
| 14 | Dashboard | All primary modules |
| 15 | Reports and analytics | Operational and financial data |

---

# 29. Final Workflow Rules

1. Every workflow must have backend validation.
2. Every protected operation must check permissions.
3. Every gym-related operation must enforce gym-level isolation.
4. Financial operations must be transaction-safe.
5. Membership history must be preserved.
6. Payment history must be preserved.
7. Refunds must be separate records.
8. Staff and members must remain separate entities.
9. Member account status and membership status must remain independent.
10. Notifications must not compromise business transactions.
11. Important actions must generate audit logs.
12. Frontend validation must never replace backend validation.
13. Every workflow must follow the business rules defined in `businessRules.md`.

---

# 30. Final Decision

The Gym Management System will follow clearly defined user journeys for all major operations.

The primary workflow is:

**Register Member → Assign Membership → Collect Payment → Track Attendance → Manage Renewals → Generate Reports**

All workflows must remain consistent with:

- `prd.md`
- `mvpScope.md`
- `businessRules.md`
- `rbac.md`
- `dbDesign.md`
- `apiDesign.md`
- `systemArchitecture.md`

These workflows will serve as the reference when designing frontend pages, backend services and integration tests.