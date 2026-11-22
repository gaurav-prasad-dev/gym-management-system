# ER Diagram – Gym Management System

## 1. Overview

This document defines the Entity Relationship Diagram (ERD) for the Gym Management System.

The ERD represents:

- Database entities.
- Primary keys (PK).
- Foreign keys (FK).
- Relationships between tables.
- One-to-one relationships.
- One-to-many relationships.
- Many-to-many relationships.

### Database Technology

- Database: PostgreSQL
- Primary Key: UUID
- Relationships: Foreign Keys
- Diagram Format: Mermaid ER Diagram

### Relationship Notation

| Symbol | Meaning |
|---|---|
| `||` | Exactly one |
| `o|` | Zero or one |
| `|{` | One or more |
| `o{` | Zero or more |

---

# 2. Complete Database Entity Overview

The following diagram shows the major modules and their relationships.

```mermaid
erDiagram

    GYMS ||--o{ USERS : has
    GYMS ||--o{ STAFF : employs
    GYMS ||--o{ ROLES : defines
    GYMS ||--o{ MEMBERS : registers
    GYMS ||--o{ MEMBERSHIP_PLANS : creates
    GYMS ||--o{ MEMBER_MEMBERSHIPS : manages
    GYMS ||--o{ ATTENDANCE : records
    GYMS ||--o{ PAYMENTS : receives
    GYMS ||--o{ TRAINERS : employs
    GYMS ||--o{ EXPENSES : records
    GYMS ||--o{ NOTIFICATIONS : sends

    USERS ||--o| STAFF : has_profile
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : contains
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included_in

    MEMBERS ||--o{ MEMBER_MEMBERSHIPS : purchases
    MEMBERSHIP_PLANS ||--o{ MEMBER_MEMBERSHIPS : selected_for
    MEMBER_MEMBERSHIPS ||--o{ MEMBERSHIP_FREEZE_PERIODS : has
    MEMBER_MEMBERSHIPS ||--o{ MEMBERSHIP_EVENTS : records

    MEMBERS ||--o{ ATTENDANCE : attends
    MEMBERS ||--o{ MEMBER_QR_TOKENS : owns

    MEMBERS ||--o{ PAYMENTS : makes
    MEMBER_MEMBERSHIPS ||--o{ PAYMENTS : receives
    PAYMENTS ||--o{ REFUNDS : refunded_by

    STAFF ||--o| TRAINERS : trainer_profile
    TRAINERS ||--o{ TRAINER_MEMBER_ASSIGNMENTS : assigned
    MEMBERS ||--o{ TRAINER_MEMBER_ASSIGNMENTS : receives
    TRAINERS ||--o{ TRAINER_ATTENDANCE : records

    EXPENSE_CATEGORIES ||--o{ EXPENSES : categorizes

    MEMBERS ||--o{ NOTIFICATIONS : receives

    GYMS ||--o{ GYM_SETTINGS : configures
    USERS ||--o{ AUDIT_LOGS : performs
```

---

# 3. Gym and Authentication Relationships

This section represents gym information, application users and staff records.

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
        varchar code
        varchar email
        varchar phone
        text address
        varchar timezone
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    GYM_SETTINGS {
        uuid id PK
        uuid gym_id FK
        varchar setting_key
        jsonb setting_value
        timestamptz created_at
        timestamptz updated_at
    }

    USERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
        varchar email
        varchar mobile
        text password_hash
        varchar status
        timestamptz last_login_at
        timestamptz created_at
        timestamptz updated_at
    }

    STAFF {
        uuid id PK
        uuid gym_id FK
        uuid user_id FK
        varchar designation
        date joining_date
        numeric salary
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    GYMS ||--o{ GYM_SETTINGS : has
    GYMS ||--o{ USERS : has
    GYMS ||--o{ STAFF : employs
    USERS ||--o| STAFF : has
```

### Relationship Explanation

- One gym can have multiple users.
- One gym can employ multiple staff members.
- One user can have zero or one staff profile.
- One gym can have multiple settings.

---

# 4. Dynamic RBAC Relationships

This section represents the complete dynamic Role-Based Access Control system.

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    USERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
        varchar email
        varchar status
    }

    ROLES {
        uuid id PK
        uuid gym_id FK
        varchar name
        varchar slug
        text description
        boolean is_system
        boolean is_protected
        varchar status
    }

    PERMISSIONS {
        uuid id PK
        varchar module
        varchar action
        varchar permission_key
        text description
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
        uuid assigned_by FK
        timestamptz assigned_at
    }

    ROLE_PERMISSIONS {
        uuid id PK
        uuid role_id FK
        uuid permission_id FK
        timestamptz created_at
    }

    GYMS ||--o{ USERS : has
    GYMS ||--o{ ROLES : defines

    USERS ||--o{ USER_ROLES : receives
    ROLES ||--o{ USER_ROLES : assigned_to

    ROLES ||--o{ ROLE_PERMISSIONS : contains
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included_in
```

### Relationship Explanation

- One gym can create multiple custom roles.
- One user can have multiple roles.
- One role can be assigned to multiple users.
- One role can contain multiple permissions.
- One permission can belong to multiple roles.

This supports dynamic role creation through the Settings page.

Example:

```text
Accountant Role
    |
    +-- dashboard.view
    +-- payments.view
    +-- payments.create
    +-- expenses.view
    +-- expenses.create
    +-- reports.view
    +-- reports.export
```

Permissions are defined by the application and assigned to roles by authorized administrators.

---

# 5. Member Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar member_code
        varchar full_name
        varchar mobile
        varchar email
        varchar gender
        date date_of_birth
        text address
        varchar emergency_contact_name
        varchar emergency_contact_mobile
        date joining_date
        text profile_image
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    GYMS ||--o{ MEMBERS : registers
```

### Relationship Explanation

- One gym can register multiple members.
- Every member belongs to one gym.
- Member records are separate from application login users.

A member does not need an application user account unless member login functionality is introduced later.

---

# 6. Membership Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    MEMBERSHIP_PLANS {
        uuid id PK
        uuid gym_id FK
        varchar name
        text description
        integer duration_value
        varchar duration_unit
        numeric price
        varchar status
    }

    MEMBER_MEMBERSHIPS {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        uuid plan_id FK
        varchar membership_code
        date start_date
        date end_date
        varchar plan_name_snapshot
        numeric plan_price_snapshot
        numeric final_amount
        numeric discount_amount
        varchar status
        uuid assigned_by FK
    }

    MEMBERSHIP_FREEZE_PERIODS {
        uuid id PK
        uuid gym_id FK
        uuid membership_id FK
        date start_date
        date end_date
        date actual_end_date
        text reason
        uuid created_by FK
    }

    MEMBERSHIP_EVENTS {
        uuid id PK
        uuid gym_id FK
        uuid membership_id FK
        varchar event_type
        text description
        uuid performed_by FK
        timestamptz created_at
    }

    GYMS ||--o{ MEMBERSHIP_PLANS : creates
    GYMS ||--o{ MEMBER_MEMBERSHIPS : manages
    MEMBERS ||--o{ MEMBER_MEMBERSHIPS : purchases
    MEMBERSHIP_PLANS ||--o{ MEMBER_MEMBERSHIPS : selected_for

    MEMBER_MEMBERSHIPS ||--o{ MEMBERSHIP_FREEZE_PERIODS : has
    MEMBER_MEMBERSHIPS ||--o{ MEMBERSHIP_EVENTS : records
```

### Relationship Explanation

- One gym can create multiple membership plans.
- One member can purchase multiple memberships over time.
- One membership plan can be used by multiple members.
- One member membership can have multiple freeze periods.
- One member membership can have multiple historical events.

### Important Business Rule

Membership plans and member memberships must remain separate.

Example:

```text
Membership Plan
    Monthly Plan
    Price: ₹1,000
    Duration: 1 Month
          |
          |
          v
Member Membership
    Member: Rahul
    Start Date: 01-11-2026
    End Date: 30-11-2026
    Final Amount: ₹900
    Status: Active
```

The member membership keeps its original price snapshot even if the plan price changes later.

---

# 7. Attendance Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    ATTENDANCE {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        timestamptz check_in_at
        timestamptz check_out_at
        varchar method
        uuid marked_by FK
        text notes
        timestamptz created_at
    }

    MEMBER_QR_TOKENS {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        text token_hash
        timestamptz expires_at
        timestamptz revoked_at
        timestamptz created_at
    }

    GYMS ||--o{ ATTENDANCE : records
    MEMBERS ||--o{ ATTENDANCE : attends

    GYMS ||--o{ MEMBER_QR_TOKENS : manages
    MEMBERS ||--o{ MEMBER_QR_TOKENS : owns
```

### Relationship Explanation

- One member can have multiple attendance records.
- One member can have multiple QR tokens over time.
- Every attendance record belongs to one gym.
- Attendance can be recorded manually or through QR scanning.

The backend must validate membership eligibility before accepting attendance.

---

# 8. Payment Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    MEMBER_MEMBERSHIPS {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        numeric final_amount
    }

    PAYMENTS {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        uuid membership_id FK
        varchar receipt_number
        numeric amount
        varchar payment_method
        varchar transaction_reference
        varchar status
        timestamptz received_at
        uuid recorded_by FK
    }

    REFUNDS {
        uuid id PK
        uuid gym_id FK
        uuid payment_id FK
        numeric amount
        text reason
        varchar status
        timestamptz refunded_at
        uuid processed_by FK
    }

    GYMS ||--o{ PAYMENTS : receives
    MEMBERS ||--o{ PAYMENTS : makes
    MEMBER_MEMBERSHIPS ||--o{ PAYMENTS : receives
    PAYMENTS ||--o{ REFUNDS : has
```

### Relationship Explanation

- One member can make multiple payments.
- One membership can receive multiple partial payments.
- One payment can have multiple refund records, provided their combined successful amount does not exceed the original successful payment.
- Refund records must remain linked to the original payment.

### Example

```text
Membership Amount: ₹3,000
          |
          |
          +---- Payment 1: ₹1,000
          |
          +---- Payment 2: ₹1,000
          |
          +---- Payment 3: ₹1,000
```

Total successful collection: ₹3,000.

---

# 9. Trainer Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    STAFF {
        uuid id PK
        uuid gym_id FK
        uuid user_id FK
        varchar designation
    }

    TRAINERS {
        uuid id PK
        uuid gym_id FK
        uuid staff_id FK
        varchar full_name
        varchar mobile
        varchar email
        text specialization
        date joining_date
        varchar salary_type
        numeric salary
        varchar status
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    TRAINER_MEMBER_ASSIGNMENTS {
        uuid id PK
        uuid gym_id FK
        uuid trainer_id FK
        uuid member_id FK
        date assigned_from
        date assigned_until
        varchar status
        uuid assigned_by FK
    }

    TRAINER_ATTENDANCE {
        uuid id PK
        uuid gym_id FK
        uuid trainer_id FK
        timestamptz check_in_at
        timestamptz check_out_at
        uuid marked_by FK
    }

    GYMS ||--o{ TRAINERS : employs
    STAFF ||--o| TRAINERS : has_profile

    TRAINERS ||--o{ TRAINER_MEMBER_ASSIGNMENTS : assigned
    MEMBERS ||--o{ TRAINER_MEMBER_ASSIGNMENTS : receives

    TRAINERS ||--o{ TRAINER_ATTENDANCE : records
```

### Relationship Explanation

- A gym can employ multiple trainers.
- A trainer can be connected to a staff profile.
- A trainer can be assigned to multiple members.
- A member can have multiple trainer assignments over time.
- A trainer can have multiple attendance records.

---

# 10. Expense Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    EXPENSE_CATEGORIES {
        uuid id PK
        uuid gym_id FK
        varchar name
        text description
        varchar status
    }

    EXPENSES {
        uuid id PK
        uuid gym_id FK
        uuid category_id FK
        varchar title
        text description
        numeric amount
        date expense_date
        varchar payment_method
        varchar status
        timestamptz paid_at
        text receipt_url
        uuid created_by FK
    }

    GYMS ||--o{ EXPENSE_CATEGORIES : creates
    GYMS ||--o{ EXPENSES : records

    EXPENSE_CATEGORIES ||--o{ EXPENSES : categorizes
```

### Relationship Explanation

- One gym can create multiple expense categories.
- One category can contain multiple expenses.
- Every expense belongs to one gym.

---

# 11. Notification Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    MEMBERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    NOTIFICATION_TEMPLATES {
        uuid id PK
        uuid gym_id FK
        varchar name
        varchar event_type
        varchar channel
        varchar subject
        text message
        varchar status
    }

    NOTIFICATIONS {
        uuid id PK
        uuid gym_id FK
        uuid member_id FK
        varchar recipient
        varchar event_type
        varchar channel
        text message
        varchar status
        varchar provider_reference
        timestamptz sent_at
        text error_message
    }

    GYMS ||--o{ NOTIFICATION_TEMPLATES : creates
    GYMS ||--o{ NOTIFICATIONS : sends
    MEMBERS ||--o{ NOTIFICATIONS : receives
```

### Relationship Explanation

- One gym can create multiple notification templates.
- One gym can send multiple notifications.
- One member can receive multiple notifications.
- Notifications can be sent through Email or WhatsApp.

---

# 12. Audit Management Relationships

```mermaid
erDiagram

    GYMS {
        uuid id PK
        varchar name
    }

    USERS {
        uuid id PK
        uuid gym_id FK
        varchar full_name
    }

    AUDIT_LOGS {
        uuid id PK
        uuid gym_id FK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb old_values
        jsonb new_values
        inet ip_address
        timestamptz created_at
    }

    GYMS ||--o{ AUDIT_LOGS : tracks
    USERS ||--o{ AUDIT_LOGS : performs
```

### Relationship Explanation

- One user can generate multiple audit log entries.
- One gym can have multiple audit log entries.
- Audit logs maintain a history of important activities.

---

# 13. Important Relationship Summary

| Parent Entity | Child Entity | Relationship |
|---|---|---|
| Gym | Users | One-to-Many |
| Gym | Staff | One-to-Many |
| User | Staff | One-to-Zero-or-One |
| User | Roles | Many-to-Many |
| Role | Permissions | Many-to-Many |
| Gym | Members | One-to-Many |
| Member | Member Memberships | One-to-Many |
| Membership Plan | Member Memberships | One-to-Many |
| Member Membership | Freeze Periods | One-to-Many |
| Member Membership | Membership Events | One-to-Many |
| Member | Attendance | One-to-Many |
| Member | Payments | One-to-Many |
| Member Membership | Payments | One-to-Many |
| Payment | Refunds | One-to-Many |
| Trainer | Members | Many-to-Many through assignments |
| Trainer | Trainer Attendance | One-to-Many |
| Expense Category | Expenses | One-to-Many |
| Member | Notifications | One-to-Many |
| User | Audit Logs | One-to-Many |

---

# 14. Important Database Design Rules

1. Every gym-owned record must have a `gym_id`.
2. Every table must have a primary key.
3. Foreign keys must be properly defined.
4. Many-to-many relationships must use junction tables.
5. Membership plans must remain separate from member memberships.
6. Payments must remain separate from memberships.
7. Refunds must remain separate from payments.
8. Member records must remain separate from staff login accounts.
9. Roles must be dynamic database records.
10. Permissions must be predefined application records.
11. Historical records must be preserved.
12. Financial records must not be permanently deleted.
13. All financial calculations must use NUMERIC.
14. All gym-owned relationships must enforce gym-level boundaries.
15. Important operations must be recorded in audit logs.

---

# 15. ERD Validation Checklist

Before implementing database migrations, verify:

- [ ] Every entity in `dbDesign.md` appears in the ERD.
- [ ] Every foreign key has a corresponding relationship.
- [ ] Every many-to-many relationship uses a junction table.
- [ ] Every gym-owned table has `gym_id`.
- [ ] RBAC supports custom roles.
- [ ] Staff and members are separate.
- [ ] Membership plans and member memberships are separate.
- [ ] Payments and refunds are separate.
- [ ] Membership history is preserved.
- [ ] Attendance relationships are correct.
- [ ] Trainer assignment history is preserved.
- [ ] Expense categories are connected to expenses.
- [ ] Notification history is preserved.
- [ ] Audit logs are connected to users and gyms.

---

# 16. Final Architecture Decision

The Gym Management System will use a modular relational database design.

Each module will have its own entities and relationships while sharing common entities such as:

- Gyms
- Users
- Staff
- Members
- Audit Logs

The database will initially support one gym but will be structured to support multiple gyms in the future.

**The ERD is the visual reference for database implementation. The detailed column definitions and constraints in `dbDesign.md` remain the source of truth for migrations.**