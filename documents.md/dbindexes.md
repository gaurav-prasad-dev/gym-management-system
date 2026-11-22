# Database Indexing Strategy – Gym Management System

## 1. Overview

This document defines the database indexing strategy for the Gym Management System.

The purpose of database indexing is to improve query performance, reduce unnecessary table scans and make frequently used operations faster.

The application will use PostgreSQL indexes to optimize:

- Member searches.
- Membership lookups.
- Membership expiry checks.
- Attendance records.
- Payment history.
- Expense reports.
- Trainer assignments.
- Staff and role lookups.
- Dashboard analytics.
- Notifications.
- Audit logs.

### Database Technology

- Database: PostgreSQL
- Index Types: B-tree, GIN, Partial Index
- Primary Keys: UUID
- Financial Values: NUMERIC
- Flexible Data: JSONB

---

# 2. Indexing Principles

Follow these principles when creating database indexes.

### 2.1 Primary Key Indexes

Every table should have a primary key.

PostgreSQL automatically creates a unique B-tree index for primary keys.

Example:

```sql
CREATE TABLE members (
    id UUID PRIMARY KEY,
    full_name VARCHAR(150)
);
```

No additional index is required on `id` unless a specific use case requires another index structure.

### 2.2 Foreign Key Indexes

PostgreSQL does not automatically create indexes on referencing foreign-key columns.

Frequently queried foreign keys should be indexed.

Examples:

- `members.gym_id`
- `attendance.member_id`
- `payments.member_id`
- `member_memberships.member_id`
- `role_permissions.role_id`

These indexes improve joins and filtering.

### 2.3 Composite Indexes

A composite index contains multiple columns.

Example:

```sql
CREATE INDEX idx_members_gym_mobile
ON members (gym_id, mobile);
```

This is useful when queries filter by both gym and mobile number.

Column order matters.

For example, an index on `(gym_id, mobile)` is suitable for:

```sql
WHERE gym_id = ? AND mobile = ?
```

It can also help with:

```sql
WHERE gym_id = ?
```

But it is not generally suitable for searching only by `mobile`.

### 2.4 Partial Indexes

Partial indexes include only rows that satisfy a condition.

Example:

```sql
CREATE INDEX idx_active_members
ON members (gym_id)
WHERE status = 'active';
```

Useful when queries frequently access a smaller subset of records.

### 2.5 Avoid Unnecessary Indexes

Do not create indexes on every column.

Indexes consume storage and add overhead to:

- INSERT operations.
- UPDATE operations.
- DELETE operations.

Create indexes according to actual application queries.

---

# 3. Authentication and RBAC Indexes

## 3.1 users

Common queries:

- Find user by email.
- Get users belonging to a gym.
- Find active users.

Recommended indexes:

```sql
CREATE UNIQUE INDEX idx_users_gym_email
ON users (gym_id, email);

CREATE INDEX idx_users_gym_status
ON users (gym_id, status);
```

Email should be normalized consistently before storage and lookup.

## 3.2 staff

Common queries:

- Get staff belonging to a gym.
- Find staff by user ID.
- Get active staff.

```sql
CREATE UNIQUE INDEX idx_staff_user_id
ON staff (user_id);

CREATE INDEX idx_staff_gym_status
ON staff (gym_id, status);
```

## 3.3 roles

Common queries:

- Get roles belonging to a gym.
- Find role by slug.
- Get active roles.

```sql
CREATE UNIQUE INDEX idx_roles_gym_slug
ON roles (gym_id, slug);

CREATE INDEX idx_roles_gym_status
ON roles (gym_id, status);
```

## 3.4 permissions

Common queries:

- Find permission by permission key.
- Get permissions by module.

```sql
CREATE UNIQUE INDEX idx_permissions_key
ON permissions (permission_key);

CREATE INDEX idx_permissions_module
ON permissions (module);
```

## 3.5 user_roles

Common queries:

- Get all roles assigned to a user.
- Find users assigned to a particular role.

```sql
CREATE UNIQUE INDEX idx_user_roles_unique
ON user_roles (user_id, role_id);

CREATE INDEX idx_user_roles_role_id
ON user_roles (role_id);
```

## 3.6 role_permissions

Common queries:

- Get permissions assigned to a role.
- Find roles associated with a permission.

```sql
CREATE UNIQUE INDEX idx_role_permissions_unique
ON role_permissions (role_id, permission_id);

CREATE INDEX idx_role_permissions_permission_id
ON role_permissions (permission_id);
```

---

# 4. Member Management Indexes

## 4.1 members

Member searches are among the most frequently used operations.

Common queries:

- Search by member ID.
- Search by mobile number.
- Search by name.
- Get active members.
- Filter members by joining date.
- Get all members of a gym.

Recommended indexes:

```sql
CREATE UNIQUE INDEX idx_members_gym_member_code
ON members (gym_id, member_code);

CREATE INDEX idx_members_gym_mobile
ON members (gym_id, mobile);

CREATE INDEX idx_members_gym_status
ON members (gym_id, status);

CREATE INDEX idx_members_gym_joining_date
ON members (gym_id, joining_date DESC);
```

### Name Search

For large datasets, PostgreSQL trigram indexing can improve partial-name searches.

Enable the extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Create the index:

```sql
CREATE INDEX idx_members_full_name_trgm
ON members
USING GIN (full_name gin_trgm_ops);
```

Example query:

```sql
SELECT *
FROM members
WHERE full_name ILIKE '%rahul%';
```

For a multi-gym application, evaluate a gym-scoped search strategy and query performance before introducing this index into production.

---

# 5. Membership Management Indexes

## 5.1 membership_plans

Common queries:

- Get active membership plans.
- Get plans belonging to a gym.

```sql
CREATE INDEX idx_membership_plans_gym_status
ON membership_plans (gym_id, status);
```

## 5.2 member_memberships

This table will grow as members purchase and renew memberships.

Common queries:

- Get memberships of a member.
- Find active memberships.
- Find expired memberships.
- Find memberships expiring soon.
- Get memberships by plan.
- Get membership history.

Recommended indexes:

```sql
CREATE UNIQUE INDEX idx_member_memberships_gym_code
ON member_memberships (gym_id, membership_code);

CREATE INDEX idx_member_memberships_member
ON member_memberships (gym_id, member_id);

CREATE INDEX idx_member_memberships_status
ON member_memberships (gym_id, status);

CREATE INDEX idx_member_memberships_end_date
ON member_memberships (gym_id, end_date);

CREATE INDEX idx_member_memberships_plan
ON member_memberships (gym_id, plan_id);
```

### Expiring Memberships

Example query:

```sql
SELECT *
FROM member_memberships
WHERE gym_id = $1
  AND status = 'active'
  AND end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7;
```

The `(gym_id, status, end_date)` index may be more suitable if this exact query is frequent.

An alternative is:

```sql
CREATE INDEX idx_memberships_expiry_lookup
ON member_memberships (gym_id, status, end_date);
```

Choose the composite index instead of redundant overlapping indexes after checking query plans.

## 5.3 membership_freeze_periods

Common queries:

- Get freeze history for a membership.
- Find current freeze periods.

```sql
CREATE INDEX idx_freeze_membership
ON membership_freeze_periods (gym_id, membership_id);

CREATE INDEX idx_freeze_dates
ON membership_freeze_periods (gym_id, start_date, end_date);
```

## 5.4 membership_events

Common queries:

- Get membership activity history.
- Find recent membership events.

```sql
CREATE INDEX idx_membership_events_history
ON membership_events (gym_id, membership_id, created_at DESC);
```

---

# 6. Attendance Management Indexes

Attendance can generate a large number of records over time.

Common queries:

- Today's attendance.
- Attendance history of a member.
- Daily attendance count.
- Monthly attendance reports.
- Find duplicate attendance.

Recommended indexes:

```sql
CREATE INDEX idx_attendance_gym_checkin
ON attendance (gym_id, check_in_at DESC);

CREATE INDEX idx_attendance_member_history
ON attendance (gym_id, member_id, check_in_at DESC);
```

### Duplicate Attendance Prevention

If the business rule is one check-in per member per local day, a normal unique index on the timestamp is not appropriate.

For the initial implementation, calculate the gym-local attendance date and store it in a dedicated `attendance_date` DATE column.

Then create:

```sql
CREATE UNIQUE INDEX idx_attendance_one_per_day
ON attendance (gym_id, member_id, attendance_date);
```

This assumes one attendance record per member per local day.

If multiple sessions per day are introduced, change the constraint to include a session identifier.

### QR Token Lookup

```sql
CREATE UNIQUE INDEX idx_qr_token_hash
ON member_qr_tokens (token_hash);

CREATE INDEX idx_qr_member
ON member_qr_tokens (gym_id, member_id);
```

---

# 7. Payment Management Indexes

Payments are important for financial reporting and transaction history.

Common queries:

- Get payments of a member.
- Get payments for a membership.
- Get today's collections.
- Get monthly collections.
- Find pending transactions.
- Find payments by receipt number.

Recommended indexes:

```sql
CREATE UNIQUE INDEX idx_payments_gym_receipt
ON payments (gym_id, receipt_number);

CREATE INDEX idx_payments_member_history
ON payments (gym_id, member_id, received_at DESC);

CREATE INDEX idx_payments_membership
ON payments (gym_id, membership_id);

CREATE INDEX idx_payments_status_date
ON payments (gym_id, status, received_at DESC);
```

### Successful Payment Queries

If successful payment reporting is frequent, consider a partial index:

```sql
CREATE INDEX idx_successful_payments_date
ON payments (gym_id, received_at DESC)
WHERE status = 'successful';
```

Only successful payments should count toward collections.

## 7.1 refunds

Common queries:

- Get refunds for a payment.
- Find successful refunds.
- Generate refund reports.

```sql
CREATE INDEX idx_refunds_payment
ON refunds (gym_id, payment_id);

CREATE INDEX idx_refunds_status_date
ON refunds (gym_id, status, refunded_at DESC);
```

---

# 8. Trainer Management Indexes

## 8.1 trainers

Common queries:

- Get trainers of a gym.
- Find active trainers.
- Find trainer by staff ID.

```sql
CREATE UNIQUE INDEX idx_trainers_staff
ON trainers (staff_id)
WHERE staff_id IS NOT NULL;

CREATE INDEX idx_trainers_gym_status
ON trainers (gym_id, status);
```

## 8.2 trainer_member_assignments

Common queries:

- Get members assigned to a trainer.
- Get trainers assigned to a member.
- Find active assignments.
- View assignment history.

```sql
CREATE INDEX idx_trainer_assignments_trainer
ON trainer_member_assignments (gym_id, trainer_id, status);

CREATE INDEX idx_trainer_assignments_member
ON trainer_member_assignments (gym_id, member_id, status);
```

## 8.3 trainer_attendance

```sql
CREATE INDEX idx_trainer_attendance_history
ON trainer_attendance (gym_id, trainer_id, check_in_at DESC);
```

---

# 9. Expense Management Indexes

## 9.1 expense_categories

```sql
CREATE INDEX idx_expense_categories_gym_status
ON expense_categories (gym_id, status);
```

## 9.2 expenses

Common queries:

- Get expenses by date.
- Get expenses by category.
- Get monthly expenses.
- Find pending expenses.

Recommended indexes:

```sql
CREATE INDEX idx_expenses_gym_date
ON expenses (gym_id, expense_date DESC);

CREATE INDEX idx_expenses_category
ON expenses (gym_id, category_id);

CREATE INDEX idx_expenses_status_date
ON expenses (gym_id, status, expense_date DESC);
```

For reports that frequently calculate paid expenses, consider:

```sql
CREATE INDEX idx_paid_expenses_date
ON expenses (gym_id, expense_date DESC)
WHERE status = 'paid';
```

---

# 10. Notification Management Indexes

Common queries:

- Find pending notifications.
- Get notifications of a member.
- Find failed notifications.
- Get recent notifications.

Recommended indexes:

```sql
CREATE INDEX idx_notifications_status
ON notifications (gym_id, status, created_at);

CREATE INDEX idx_notifications_member
ON notifications (gym_id, member_id, created_at DESC);

CREATE INDEX idx_notifications_event
ON notifications (gym_id, event_type, created_at DESC);

CREATE INDEX idx_notification_templates_event
ON notification_templates (gym_id, event_type, channel);
```

---

# 11. Audit Log Indexes

Audit logs can become large over time.

Common queries:

- Get recent activities.
- Get activities performed by a user.
- Get history of a particular entity.

Recommended indexes:

```sql
CREATE INDEX idx_audit_logs_gym_date
ON audit_logs (gym_id, created_at DESC);

CREATE INDEX idx_audit_logs_user
ON audit_logs (gym_id, user_id, created_at DESC);

CREATE INDEX idx_audit_logs_entity
ON audit_logs (gym_id, entity_type, entity_id);
```

Avoid indexing large JSONB columns unless actual queries require searching inside them.

---

# 12. Dashboard Query Optimization

The dashboard will frequently execute queries across multiple tables.

Important metrics:

- Total members.
- Active members.
- Expired members.
- Today's attendance.
- Today's collections.
- Pending dues.
- Monthly collections.
- Monthly expenses.

### Example: Total Members

```sql
SELECT COUNT(*)
FROM members
WHERE gym_id = $1;
```

### Example: Active Members

```sql
SELECT COUNT(*)
FROM members
WHERE gym_id = $1
  AND status = 'active';
```

### Example: Today's Attendance

```sql
SELECT COUNT(*)
FROM attendance
WHERE gym_id = $1
  AND attendance_date = CURRENT_DATE;
```

### Example: Today's Collections

```sql
SELECT COALESCE(SUM(amount), 0)
FROM payments
WHERE gym_id = $1
  AND status = 'successful'
  AND received_at >= $2
  AND received_at < $3;
```

Here `$2` and `$3` represent the start and end timestamps of the current gym-local day, converted to the correct timezone.

### Optimization Strategy

- Use indexes for filtering.
- Avoid selecting unnecessary columns.
- Use aggregate queries.
- Avoid loading all records into application memory.
- Use pagination for large lists.
- Avoid executing separate queries for every dashboard card when they can be combined efficiently.
- Consider materialized views only when measurements show a need.

---

# 13. Pagination Strategy

Large datasets must use pagination.

For smaller datasets, offset pagination is acceptable.

Example:

```sql
SELECT *
FROM members
WHERE gym_id = $1
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;
```

For large datasets, prefer cursor-based pagination.

Example:

```sql
SELECT *
FROM members
WHERE gym_id = $1
  AND created_at < $2
ORDER BY created_at DESC
LIMIT 20;
```

The cursor should use a stable ordering, preferably `(created_at, id)` to handle records with identical timestamps.

Avoid very large OFFSET values because PostgreSQL still has to process skipped rows.

---

# 14. Index Migration Strategy

Indexes must be managed through database migrations.

Do not manually create production indexes without recording them in the migration system.

Recommended process:

1. Identify frequently executed queries.
2. Check existing indexes.
3. Create the required index in a migration.
4. Run the migration.
5. Test query performance.
6. Remove redundant indexes when safe.

For large production tables, consider `CREATE INDEX CONCURRENTLY` to reduce write blocking.

Important: PostgreSQL does not allow `CREATE INDEX CONCURRENTLY` inside a transaction block. The migration tool must support a non-transactional migration for this operation.

---

# 15. Query Performance Monitoring

Use PostgreSQL's query analysis tools.

### EXPLAIN

Shows the query execution plan.

```sql
EXPLAIN
SELECT *
FROM members
WHERE gym_id = '00000000-0000-0000-0000-000000000001';
```

### EXPLAIN ANALYZE

Executes the query and reports actual execution statistics.

```sql
EXPLAIN ANALYZE
SELECT *
FROM members
WHERE gym_id = '00000000-0000-0000-0000-000000000001';
```

Use this in a safe development or testing environment when queries modify data, since `EXPLAIN ANALYZE` actually executes the statement.

### Performance Monitoring Goals

- Identify slow queries.
- Detect unnecessary sequential scans.
- Check index usage.
- Monitor query execution time.
- Identify redundant indexes.
- Review database performance as data volume increases.

Do not assume every sequential scan is a problem. For small tables or queries returning a large portion of a table, a sequential scan can be faster.

---

# 16. Indexing Checklist

## Authentication and RBAC

- [ ] Users indexed by gym and email.
- [ ] Staff indexed by user ID.
- [ ] Roles indexed by gym and slug.
- [ ] Permissions indexed by permission key.
- [ ] User-role relationships indexed.
- [ ] Role-permission relationships indexed.

## Members

- [ ] Member code indexed.
- [ ] Mobile number indexed.
- [ ] Member status indexed.
- [ ] Joining date indexed.
- [ ] Name search strategy defined.

## Memberships

- [ ] Member membership history indexed.
- [ ] Membership status indexed.
- [ ] Membership expiry date indexed.
- [ ] Membership plans indexed.
- [ ] Freeze history indexed.

## Attendance

- [ ] Attendance history indexed.
- [ ] Daily attendance queries optimized.
- [ ] Duplicate attendance constraint implemented.
- [ ] QR token hash indexed.

## Payments

- [ ] Receipt number unique index created.
- [ ] Member payment history indexed.
- [ ] Membership payment lookup indexed.
- [ ] Successful payment reporting optimized.
- [ ] Refund lookup indexed.

## Trainers and Expenses

- [ ] Trainer status indexed.
- [ ] Trainer assignments indexed.
- [ ] Trainer attendance indexed.
- [ ] Expense dates indexed.
- [ ] Expense categories indexed.

## Notifications and Audit

- [ ] Notification status indexed.
- [ ] Member notification history indexed.
- [ ] Audit log date indexed.
- [ ] Audit log user indexed.
- [ ] Audit log entity indexed.

---

# 17. Final Indexing Decisions

| Module | Indexing Strategy |
|---|---|
| Authentication | Unique and composite B-tree |
| RBAC | Unique relationship indexes |
| Members | Composite B-tree and optional GIN trigram |
| Memberships | Composite B-tree |
| Attendance | Composite B-tree and unique daily constraint |
| Payments | Composite and partial B-tree |
| Refunds | Composite B-tree |
| Trainers | Composite B-tree |
| Expenses | Composite and partial B-tree |
| Notifications | Composite B-tree |
| Audit Logs | Composite B-tree |

**Final Principle:**

Indexes must be designed around actual query patterns. Start with the essential indexes defined in this document, monitor query performance and add or modify indexes when real usage demonstrates a need.