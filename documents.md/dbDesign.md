# Database Design – Gym Management System

## 1. Overview

The Gym Management System will use PostgreSQL as its relational database.

The database will be designed to support:

- Member management.
- Membership plan management.
- Member membership history.
- Attendance management.
- Payment management.
- Trainer management.
- Expense management.
- Staff management.
- Dynamic Role-Based Access Control (RBAC).
- Notifications.
- Reports and analytics.
- Future SaaS conversion.

### Database Design Principles

1. Use relational database structures.
2. Maintain proper relationships between entities.
3. Avoid unnecessary data duplication.
4. Maintain historical records.
5. Use foreign keys and constraints.
6. Use transactions for financial operations.
7. Use appropriate indexes.
8. Maintain audit logs for important operations.
9. Include `gym_id` in business records for future multi-tenant support.
10. Never permanently delete important financial or historical records.

---

# 2. Database Architecture

The database will be divided into the following logical modules.

| Module | Responsibility |
|---|---|
| Gym Management | Gym information and settings |
| Authentication | Users and login accounts |
| RBAC | Roles and permissions |
| Member Management | Gym member information |
| Membership Management | Plans and member memberships |
| Attendance | Member attendance records |
| Payment Management | Payments, dues and refunds |
| Trainer Management | Trainer profiles and assignments |
| Expense Management | Gym expenses |
| Notification Management | Notifications and delivery history |
| Audit Management | Activity tracking |

---

# 3. Database Tables Overview

The following tables are planned.

### Gym Management

- gyms
- gym_settings

### Authentication and RBAC

- users
- staff
- roles
- permissions
- role_permissions
- user_roles

### Member Management

- members

### Membership Management

- membership_plans
- member_memberships
- membership_freeze_periods
- membership_events

### Attendance Management

- attendance
- member_qr_tokens

### Payment Management

- payments
- refunds

### Trainer Management

- trainers
- trainer_member_assignments
- trainer_attendance

### Expense Management

- expense_categories
- expenses

### Notification Management

- notification_templates
- notifications

### Audit Management

- audit_logs

Reports and analytics will initially be generated using database queries rather than maintaining duplicate report tables.

---

# 4. Gym Management

## 4.1 gyms

Stores gym information.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR(150) | Gym name |
| code | VARCHAR(50) | Unique gym code |
| email | VARCHAR(150) | Gym email |
| phone | VARCHAR(20) | Contact number |
| address | TEXT | Gym address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State |
| pincode | VARCHAR(10) | Postal code |
| timezone | VARCHAR(100) | Gym timezone |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

For the initial version, one gym record will be created.

Future SaaS version: Each gym will have its own record.

## 4.2 gym_settings

Stores configurable gym settings.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| setting_key | VARCHAR(100) | Setting name |
| setting_value | JSONB | Setting value |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Examples:

- Gym opening time.
- Gym closing time.
- Currency.
- Attendance rules.
- Membership expiry notification days.
- Receipt settings.

Constraint: `gym_id + setting_key` must be unique.

---

# 5. Authentication and RBAC

## 5.1 users

Stores application login accounts.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| full_name | VARCHAR(150) | User name |
| email | VARCHAR(150) | Login email |
| mobile | VARCHAR(20) | Contact number |
| password_hash | TEXT | Hashed password |
| status | VARCHAR(20) | Active, inactive, suspended |
| last_login_at | TIMESTAMPTZ | Last login |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Users represent people who can log into the application.

Gym customers who do not need login accounts should not be stored in this table.

## 5.2 staff

Stores additional employee information.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| user_id | UUID | User reference |
| designation | VARCHAR(100) | Job designation |
| joining_date | DATE | Joining date |
| salary | NUMERIC(12,2) | Salary, if applicable |
| status | VARCHAR(20) | Active, inactive |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Each staff record must be connected to a user account.

## 5.3 roles

Stores predefined and custom roles.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| name | VARCHAR(100) | Role name |
| slug | VARCHAR(100) | Unique role identifier |
| description | TEXT | Role description |
| is_system | BOOLEAN | Predefined role |
| is_protected | BOOLEAN | Protected role |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Examples:

- Owner
- Administrator
- Receptionist
- Accountant
- Trainer
- Floor Manager

These roles must be database records, not hardcoded authorization conditions.

## 5.4 permissions

Stores the application's predefined permission catalogue.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| module | VARCHAR(100) | Module name |
| action | VARCHAR(100) | Action name |
| permission_key | VARCHAR(150) | Unique permission |
| description | TEXT | Description |
| created_at | TIMESTAMPTZ | Creation time |

Examples:

```text
dashboard.view

members.view
members.create
members.update
members.delete

memberships.view
memberships.assign
memberships.renew

payments.view
payments.create
payments.refund

expenses.view
expenses.create

reports.view
reports.export
```

Permissions will be seeded by the application.

Gym administrators cannot create arbitrary permission keys.

## 5.5 role_permissions

Connects roles and permissions.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| role_id | UUID | Role reference |
| permission_id | UUID | Permission reference |
| created_at | TIMESTAMPTZ | Creation time |

Constraint:

`role_id + permission_id` must be unique.

## 5.6 user_roles

Assigns roles to staff users.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | User reference |
| role_id | UUID | Role reference |
| assigned_by | UUID | Administrator |
| assigned_at | TIMESTAMPTZ | Assignment time |

Constraint:

`user_id + role_id` must be unique.

A user can have multiple roles, and multiple users can share the same role.

---

# 6. Member Management

## 6.1 members

Stores gym customer information.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_code | VARCHAR(50) | Unique member ID |
| full_name | VARCHAR(150) | Member name |
| mobile | VARCHAR(20) | Contact number |
| email | VARCHAR(150) | Email |
| gender | VARCHAR(20) | Gender |
| date_of_birth | DATE | Date of birth |
| address | TEXT | Address |
| emergency_contact_name | VARCHAR(150) | Emergency contact |
| emergency_contact_mobile | VARCHAR(20) | Emergency number |
| profile_image | TEXT | Profile image URL |
| joining_date | DATE | Joining date |
| status | VARCHAR(20) | Active or inactive |
| notes | TEXT | Additional notes |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Important:

- A member can have multiple memberships over time.
- A member can have multiple attendance records.
- A member can have multiple payments.
- Member account status and membership status are different concepts.

Example:

A member may have an active account but an expired membership.

---

# 7. Membership Management

Membership plans and member memberships must be stored separately.

A membership plan defines what the gym sells.

A member membership represents a particular purchase or assignment of that plan to a member.

## 7.1 membership_plans

Stores available membership plans.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| name | VARCHAR(150) | Plan name |
| description | TEXT | Description |
| duration_value | INTEGER | Duration amount |
| duration_unit | VARCHAR(20) | Days, weeks, months |
| price | NUMERIC(12,2) | Plan price |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Examples:

| Plan | Duration | Price |
|---|---|---:|
| Monthly | 1 Month | ₹1,000 |
| Quarterly | 3 Months | ₹2,700 |
| Half Yearly | 6 Months | ₹5,000 |
| Yearly | 12 Months | ₹9,000 |

## 7.2 member_memberships

Stores membership purchases and assignments.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_id | UUID | Member reference |
| plan_id | UUID | Membership plan reference |
| membership_code | VARCHAR(50) | Unique membership ID |
| start_date | DATE | Membership start |
| end_date | DATE | Membership end |
| plan_name_snapshot | VARCHAR(150) | Plan name at purchase |
| plan_price_snapshot | NUMERIC(12,2) | Original plan price |
| final_amount | NUMERIC(12,2) | Final agreed amount |
| discount_amount | NUMERIC(12,2) | Discount |
| status | VARCHAR(20) | Upcoming, active, expired, frozen, cancelled |
| assigned_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Why store snapshots?

Suppose the Monthly plan costs ₹1,000 today.

Next month, the gym changes its price to ₹1,200.

Old memberships must continue showing the original price of ₹1,000.

Therefore, important plan details must be copied into the member membership record at purchase time.

## 7.3 membership_freeze_periods

Stores membership freezing history.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| membership_id | UUID | Membership reference |
| start_date | DATE | Freeze start |
| end_date | DATE | Planned freeze end |
| actual_end_date | DATE | Actual unfreeze date |
| reason | TEXT | Freeze reason |
| created_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |

A member may have multiple freeze periods, depending on gym policy.

## 7.4 membership_events

Stores membership activity history.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| membership_id | UUID | Membership reference |
| event_type | VARCHAR(50) | Event type |
| description | TEXT | Event details |
| performed_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Event time |

Examples:

- Membership created.
- Membership activated.
- Membership renewed.
- Membership extended.
- Membership frozen.
- Membership unfrozen.
- Membership cancelled.
- Membership expired.

---

# 8. Attendance Management

## 8.1 attendance

Stores member attendance records.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_id | UUID | Member reference |
| check_in_at | TIMESTAMPTZ | Check-in time |
| check_out_at | TIMESTAMPTZ | Check-out time |
| method | VARCHAR(20) | Manual or QR |
| marked_by | UUID | Staff user |
| notes | TEXT | Additional information |
| created_at | TIMESTAMPTZ | Creation time |

Important rules:

- Only members with eligible memberships can check in.
- Duplicate check-ins must be prevented according to the gym's attendance policy.
- Manual and QR attendance must use the same backend validation.
- Attendance timestamps must be stored with timezone information.

Initially, the gym can allow one attendance session per member per local day.

If multiple daily sessions are introduced later, an attendance session model can be added.

## 8.2 member_qr_tokens

Stores QR attendance credentials.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_id | UUID | Member reference |
| token_hash | TEXT | Hashed QR token |
| expires_at | TIMESTAMPTZ | Expiry time |
| revoked_at | TIMESTAMPTZ | Revocation time |
| created_at | TIMESTAMPTZ | Creation time |

QR codes must not expose sensitive member information.

The backend should validate the token and membership before marking attendance.

---

# 9. Payment Management

Payments must be maintained separately from memberships.

A membership represents an amount owed or agreed upon.

A payment represents money actually received.

## 9.1 payments

Stores payment transactions.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_id | UUID | Member reference |
| membership_id | UUID | Related membership |
| receipt_number | VARCHAR(50) | Unique receipt number |
| amount | NUMERIC(12,2) | Transaction amount |
| payment_method | VARCHAR(30) | Cash, UPI, card, bank transfer |
| transaction_reference | VARCHAR(150) | External reference |
| status | VARCHAR(20) | Pending, successful, failed |
| received_at | TIMESTAMPTZ | Payment time |
| recorded_by | UUID | Staff user |
| notes | TEXT | Additional details |
| created_at | TIMESTAMPTZ | Creation time |

Multiple successful payments can be associated with one membership.

Example:

Membership final amount: ₹3,000.

| Payment | Amount |
|---|---:|
| First payment | ₹1,000 |
| Second payment | ₹1,000 |
| Third payment | ₹1,000 |

Total collected: ₹3,000.

This supports partial payments.

Only successful payments should count toward actual collections.

## 9.2 refunds

Stores refunded transactions.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| payment_id | UUID | Original payment |
| amount | NUMERIC(12,2) | Refund amount |
| reason | TEXT | Refund reason |
| status | VARCHAR(20) | Pending, successful, failed |
| refunded_at | TIMESTAMPTZ | Refund time |
| processed_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |

Important financial definitions:

**Membership Sales:** Total membership charges created during a period.

**Collections:** Total successful payments received during a period.

**Outstanding Dues:** Amount still owed against memberships.

**Refunds:** Money returned to members.

Refunds must be recorded separately and must not delete or modify the original payment transaction.

Refunds should only affect membership dues when an explicit business rule reopens the amount owed. A refund must not automatically create an outstanding membership balance.

---

# 10. Trainer Management

## 10.1 trainers

Stores trainer profiles.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| staff_id | UUID | Related staff record, optional |
| full_name | VARCHAR(150) | Trainer name |
| mobile | VARCHAR(20) | Contact number |
| email | VARCHAR(150) | Email |
| specialization | TEXT | Training specialization |
| joining_date | DATE | Joining date |
| salary_type | VARCHAR(30) | Monthly, per session, commission |
| salary | NUMERIC(12,2) | Salary amount |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

A trainer may optionally be linked to a staff user account.

## 10.2 trainer_member_assignments

Stores trainer-member relationships.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| trainer_id | UUID | Trainer reference |
| member_id | UUID | Member reference |
| assigned_from | DATE | Assignment start |
| assigned_until | DATE | Assignment end |
| status | VARCHAR(20) | Active or inactive |
| assigned_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |

This table maintains assignment history.

## 10.3 trainer_attendance

Stores trainer attendance.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| trainer_id | UUID | Trainer reference |
| check_in_at | TIMESTAMPTZ | Check-in time |
| check_out_at | TIMESTAMPTZ | Check-out time |
| marked_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |

---

# 11. Expense Management

## 11.1 expense_categories

Stores expense categories.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| name | VARCHAR(100) | Category name |
| description | TEXT | Description |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |

Examples:

- Rent.
- Electricity.
- Trainer Salaries.
- Staff Salaries.
- Equipment.
- Maintenance.
- Marketing.
- Miscellaneous.

## 11.2 expenses

Stores gym expenses.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| category_id | UUID | Category reference |
| title | VARCHAR(150) | Expense title |
| description | TEXT | Description |
| amount | NUMERIC(12,2) | Expense amount |
| expense_date | DATE | Expense date |
| payment_method | VARCHAR(30) | Payment method |
| status | VARCHAR(20) | Paid, pending, voided |
| paid_at | TIMESTAMPTZ | Payment time |
| receipt_url | TEXT | Receipt attachment |
| created_by | UUID | Staff user |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update |

Trainer and staff salary payments can be recorded as expenses when actually paid.

Avoid recording the same salary payment twice.

---

# 12. Notification Management

## 12.1 notification_templates

Stores reusable notification templates.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| name | VARCHAR(150) | Template name |
| event_type | VARCHAR(100) | Event |
| channel | VARCHAR(20) | Email, WhatsApp |
| subject | VARCHAR(200) | Message subject |
| message | TEXT | Message content |
| status | VARCHAR(20) | Active or inactive |
| created_at | TIMESTAMPTZ | Creation time |

## 12.2 notifications

Stores notification delivery history.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| member_id | UUID | Related member, optional |
| recipient | VARCHAR(200) | Recipient contact |
| event_type | VARCHAR(100) | Notification event |
| channel | VARCHAR(20) | Email or WhatsApp |
| message | TEXT | Message content |
| status | VARCHAR(20) | Pending, sent, failed |
| provider_reference | VARCHAR(150) | Provider message ID |
| sent_at | TIMESTAMPTZ | Delivery attempt time |
| error_message | TEXT | Failure reason |
| created_at | TIMESTAMPTZ | Creation time |

Supported events:

- Welcome notification.
- Membership expiry reminder.
- Membership expired.
- Payment received.
- Payment pending.
- Birthday notification.

---

# 13. Audit Management

## 13.1 audit_logs

Stores important application activities.

| Column | Data Type | Description |
|---|---|---|
| id | UUID | Primary key |
| gym_id | UUID | Gym reference |
| user_id | UUID | Performing user |
| action | VARCHAR(100) | Action name |
| entity_type | VARCHAR(100) | Entity name |
| entity_id | UUID | Related record |
| old_values | JSONB | Previous values |
| new_values | JSONB | Updated values |
| ip_address | INET | Request IP |
| created_at | TIMESTAMPTZ | Activity time |

Examples:

- Member created.
- Member updated.
- Membership renewed.
- Payment recorded.
- Refund processed.
- Expense created.
- Staff role changed.
- Permission updated.

Audit logs should be append-only for normal application users.

---

# 14. Entity Relationships

The major relationships are:

```text
GYMS
 |
 +---- USERS
 |       |
 |       +---- STAFF
 |       |
 |       +---- USER_ROLES
 |                |
 |                +---- ROLES
 |                        |
 |                        +---- ROLE_PERMISSIONS
 |                                  |
 |                                  +---- PERMISSIONS
 |
 +---- MEMBERS
 |       |
 |       +---- MEMBER_MEMBERSHIPS
 |       |          |
 |       |          +---- MEMBERSHIP_PLANS
 |       |          |
 |       |          +---- MEMBERSHIP_FREEZE_PERIODS
 |       |          |
 |       |          +---- MEMBERSHIP_EVENTS
 |       |
 |       +---- ATTENDANCE
 |       |
 |       +---- MEMBER_QR_TOKENS
 |       |
 |       +---- PAYMENTS
 |                    |
 |                    +---- REFUNDS
 |
 +---- TRAINERS
 |       |
 |       +---- TRAINER_MEMBER_ASSIGNMENTS
 |       |
 |       +---- TRAINER_ATTENDANCE
 |
 +---- EXPENSE_CATEGORIES
 |       |
 |       +---- EXPENSES
 |
 +---- NOTIFICATION_TEMPLATES
 |
 +---- NOTIFICATIONS
 |
 +---- GYM_SETTINGS
 |
 +---- AUDIT_LOGS
```

---

# 15. Important Database Constraints

The following constraints must be implemented.

### General

- Every business record must belong to a gym.
- Foreign keys must be maintained.
- Use UUID primary keys.
- Use `created_at` and `updated_at` where applicable.
- Avoid hard deletion of historical financial records.

### Members

- Member code must be unique within a gym.
- Mobile number should be validated.
- Member status must use supported values.

### Memberships

- Plan duration must be positive.
- Final amount cannot be negative.
- End date must not be earlier than start date.
- Membership history must be preserved.
- Membership price snapshots must not change when a plan is updated.

### Attendance

- Check-out cannot be earlier than check-in.
- Duplicate attendance must be prevented according to gym policy.
- Attendance must be validated against membership eligibility.

### Payments

- Payment amount must be greater than zero.
- Refund amount must be greater than zero.
- Total successful refunds must not exceed the original successful payment amount.
- Pending and failed payments must not count as collections.

### RBAC

- Permission keys must be unique.
- Role-permission combinations must be unique.
- User-role combinations must be unique.
- Role assignment must respect gym boundaries.

---

# 16. Database Indexing Strategy

Indexes should be created for frequently searched and filtered columns.

| Table | Recommended Index |
|---|---|
| users | gym_id, email |
| staff | gym_id, user_id |
| roles | gym_id, slug |
| members | gym_id, member_code |
| members | gym_id, mobile |
| members | gym_id, full_name |
| membership_plans | gym_id, status |
| member_memberships | gym_id, member_id |
| member_memberships | gym_id, status |
| member_memberships | gym_id, end_date |
| attendance | gym_id, member_id, check_in_at |
| payments | gym_id, member_id, received_at |
| payments | gym_id, membership_id |
| expenses | gym_id, expense_date |
| trainers | gym_id, status |
| notifications | gym_id, status |
| audit_logs | gym_id, created_at |

Use composite indexes where queries commonly filter by multiple columns.

Unique constraints should be used for identifiers and relationships.

---

# 17. Financial Data Integrity

Financial calculations must use PostgreSQL `NUMERIC`, not floating-point types.

Example:

```sql
NUMERIC(12,2)
```

### Membership Outstanding

For a membership:

```text
Outstanding =
Final Membership Amount
- Successful Payments Allocated
+ Applicable Reopened Dues
```

Refunds must be tracked separately. They should only reopen dues when an explicit business event or refund policy requires it.

### Total Collections

```text
Total Collections =
SUM(Successful Payments)
- SUM(Successful Refunds)
```

### Net Operating Result

```text
Net Operating Result =
Net Collections
- Paid Expenses
```

These financial definitions must remain consistent across the dashboard and reports.

All financial updates must use database transactions where multiple related records are modified.

---

# 18. Date and Time Management

The application must use consistent date and time handling.

- Use `DATE` for membership start and end dates.
- Use `DATE` for joining dates and expense dates.
- Use `TIMESTAMPTZ` for attendance and transaction timestamps.
- Store timestamps consistently and convert them using the gym's configured timezone.
- Membership end dates are inclusive.
- Membership expiry calculations must use the gym's local date.

Example:

A membership ending on 30 November remains valid throughout 30 November in the gym's timezone.

---

# 19. Soft Delete and Historical Data

Important historical data should not be permanently deleted.

Recommended approach:

| Entity | Deletion Strategy |
|---|---|
| Members | Deactivate or archive |
| Membership Plans | Deactivate |
| Member Memberships | Preserve history |
| Payments | Never hard delete |
| Refunds | Never hard delete |
| Attendance | Preserve history |
| Expenses | Void or cancel |
| Staff | Deactivate |
| Roles | Delete only when unused |
| Audit Logs | Preserve |

For entities that need reversible deletion, an `archived_at` or status field can be introduced.

---

# 20. Reports and Analytics

Reports should initially be generated through SQL queries.

Examples:

### Dashboard

- Total members.
- Active members.
- Expired members.
- Today's attendance.
- Today's collections.
- Pending membership dues.
- Monthly revenue.

### Financial Reports

- Daily collections.
- Monthly collections.
- Membership sales.
- Refunds.
- Expenses.
- Outstanding dues.
- Net collections.

### Membership Reports

- Active memberships.
- Expired memberships.
- Upcoming expiries.
- Renewals.
- Membership plan popularity.

### Attendance Reports

- Daily attendance.
- Monthly attendance.
- Member attendance history.
- Trainer attendance.

As data volume increases, materialized views or summary tables can be introduced after measuring query performance.

---

# 21. Future SaaS Compatibility

The first version will operate as a single-gym application.

However, the database should be designed with future multi-tenancy in mind.

Requirements:

1. Every gym must have a unique `gym_id`.
2. All gym-owned business records must contain `gym_id`.
3. All queries must enforce gym-level data isolation.
4. Roles must belong to a gym.
5. Staff users must be associated with a gym.
6. Permission definitions should be shared across the application.
7. Cross-gym access must be prohibited.
8. Gym-specific settings must be stored separately.

The application should not implement unnecessary subscription or billing complexity in the first version.

---

# 22. Implementation Order

Create database tables in the following order to respect foreign-key dependencies.

### Phase 1: Foundation

1. gyms
2. gym_settings
3. users
4. staff

### Phase 2: RBAC

5. roles
6. permissions
7. role_permissions
8. user_roles

### Phase 3: Members and Memberships

9. members
10. membership_plans
11. member_memberships
12. membership_freeze_periods
13. membership_events

### Phase 4: Attendance

14. attendance
15. member_qr_tokens

### Phase 5: Payments

16. payments
17. refunds

### Phase 6: Trainers

18. trainers
19. trainer_member_assignments
20. trainer_attendance

### Phase 7: Expenses

21. expense_categories
22. expenses

### Phase 8: Notifications and Audit

23. notification_templates
24. notifications
25. audit_logs

---

# 23. Final Database Design Decisions

| Area | Decision |
|---|---|
| Database | PostgreSQL |
| Primary Keys | UUID |
| Money | NUMERIC(12,2) |
| Timestamps | TIMESTAMPTZ |
| Flexible Settings | JSONB |
| Authentication | Separate users table |
| Staff | Separate staff table |
| RBAC | Dynamic roles and permissions |
| Members | Separate from staff users |
| Membership Plans | Separate from member memberships |
| Payments | Separate transaction records |
| Refunds | Separate refund records |
| Attendance | Individual attendance records |
| Expenses | Category-based expense records |
| Notifications | Template and delivery records |
| Audit | Centralized audit logs |
| Multi-tenancy | gym_id from the beginning |

**Final principle:** The database must preserve business history, maintain financial accuracy, enforce relationships and support future expansion without requiring a complete redesign.