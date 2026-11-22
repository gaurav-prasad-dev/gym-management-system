# RBAC – Dynamic Role-Based Access Control

## 1. Overview

The Gym Management System will implement a Dynamic Role-Based Access Control (RBAC) system.

Instead of restricting the application to predefined roles such as Owner, Admin, Receptionist, Accountant and Trainer, the system will allow authorized administrators to create custom roles and assign permissions according to the responsibilities of gym staff.

The purpose of this system is to provide flexible, secure and manageable access control.

For example, one gym may have:
- Receptionist
- Accountant
- Floor Manager
- Personal Trainer

Another gym may have completely different staff positions.

The system should support both scenarios without requiring any code changes.

### Core Principles

- Roles must be dynamically created and managed.
- Permissions must be stored in the database.
- Multiple staff members can share the same role.
- Each staff member can have one or more assigned roles.
- Permissions must be validated on the backend.
- Changes to role permissions must automatically apply to assigned staff.
- Only authorized users can manage roles and permissions.

---

## 2. Important Terminology

### 2.1 Gym Member

A gym member is a customer who purchases a gym membership and uses the gym facilities.

Examples:
- Regular gym member
- Personal training client
- Annual membership customer

Gym members do not receive application administration roles by default.

### 2.2 Staff User

A staff user is someone who has an account to log into and operate the Gym Management System.

Examples:
- Receptionist
- Accountant
- Trainer
- Floor Manager
- Administrator

RBAC roles are assigned to staff users, not ordinary gym members.

### 2.3 Role

A role represents a staff member's responsibilities within the gym.

Examples:
- Receptionist
- Accountant
- Trainer
- Floor Manager
- Custom roles created by the gym owner.

A role is a collection of permissions.

### 2.4 Permission

A permission defines what an authenticated staff user can do within the application.

Examples:
- View members.
- Create members.
- Edit members.
- Delete members.
- Record payments.
- Process refunds.
- Export reports.

---

## 3. RBAC Architecture

The application will follow this structure:

```text
                  GYM OWNER
                      |
                      v
                SETTINGS PAGE
                      |
                      v
             ROLES & PERMISSIONS
                      |
             +--------+--------+
             |                 |
             v                 v
         Create Role      Manage Permissions
             |                 |
             +--------+--------+
                      |
                      v
               Assign Role
                      |
                      v
                 STAFF USER
                      |
                      v
              AUTHENTICATION
                      |
                      v
             PERMISSION CHECK
                      |
             +--------+--------+
             |                 |
             v                 v
          Allowed           Denied
             |                 |
             v                 v
       Access Resource     403 Forbidden
```

---

## 4. Role Management

The system must provide a dedicated Role Management section inside Settings.

### 4.1 Settings Structure

```text
Settings
│
├── General Settings
├── Gym Information
├── Membership Settings
├── Attendance Settings
├── Notification Settings
│
├── Staff Management
│   ├── Staff List
│   ├── Add Staff
│   └── Edit Staff
│
└── Roles & Permissions
    ├── Roles List
    ├── Create Role
    ├── Edit Role
    ├── Assign Permissions
    └── Delete Role
```

### 4.2 Create Role

Authorized administrators should be able to create custom roles.

Required fields:

| Field | Description |
|---|---|
| Role Name | Name of the role |
| Description | Purpose of the role |
| Permissions | Selected permissions |
| Status | Active or inactive |

Example:

```text
Role Name: Accountant

Description:
Responsible for managing gym finances.

Permissions:
- Dashboard: View
- Payments: View, Create, Edit
- Expenses: View, Create, Edit
- Reports: View, Export

Status: Active
```

### 4.3 Edit Role

Authorized administrators can:
- Change the role name.
- Update the description.
- Add permissions.
- Remove permissions.
- Activate or deactivate the role.

Changes to a role should automatically affect all staff users assigned to that role.

### 4.4 Delete Role

A role can be deleted only when it is not assigned to any active staff user.

If the role is currently assigned:
- Display a warning.
- Ask the administrator to reassign affected staff members.
- Prevent deletion until the assignments are resolved.

System-protected roles must not be deleted.

---

## 5. Permission Management

Permissions will be predefined by the application.

Administrators can select permissions when creating or editing roles, but they cannot create arbitrary permission keys.

This prevents invalid permissions from being introduced into the system.

### 5.1 Permission Structure

Use a consistent permission naming convention:

```text
module.action
```

Examples:

```text
dashboard.view

members.view
members.create
members.update
members.delete

members.activate
members.deactivate

memberships.view
memberships.create
memberships.update
memberships.delete
memberships.assign
memberships.renew
memberships.freeze
memberships.extend

attendance.view
attendance.create
attendance.update
attendance.delete

payments.view
payments.create
payments.update
payments.refund

trainers.view
trainers.create
trainers.update
trainers.delete
trainers.assign_members

expenses.view
expenses.create
expenses.update
expenses.delete

reports.view
reports.export

notifications.view
notifications.send

staff.view
staff.create
staff.update
staff.deactivate

roles.view
roles.create
roles.update
roles.delete
roles.assign_permissions
```

The exact permission catalogue should be maintained centrally in the backend.

### 5.2 Permission Categories

Each module should have relevant permissions.

| Module | Available Permissions |
|---|---|
| Dashboard | View |
| Members | View, Create, Update, Delete, Activate, Deactivate |
| Memberships | View, Create, Update, Delete, Assign, Renew, Freeze, Extend |
| Attendance | View, Create, Update, Delete |
| Payments | View, Create, Update, Refund |
| Trainers | View, Create, Update, Delete, Assign Members |
| Expenses | View, Create, Update, Delete |
| Reports | View, Export |
| Notifications | View, Send |
| Staff | View, Create, Update, Deactivate |
| Roles | View, Create, Update, Delete, Assign Permissions |

The application can introduce additional permissions as new features are added.

---

## 6. Permission Selection UI

When creating or editing a role, display permissions in a structured table.

Example:

| Module | View | Create | Edit | Delete | Special Permissions |
|---|---|---|---|---|---|
| Dashboard | Yes | - | - | - | - |
| Members | Yes | Yes | Yes | No | Activate |
| Memberships | Yes | Yes | Yes | No | Renew, Freeze |
| Attendance | Yes | Yes | Yes | No | - |
| Payments | Yes | Yes | Yes | No | Refund |
| Trainers | No | No | No | No | - |
| Expenses | Yes | Yes | Yes | No | - |
| Reports | Yes | - | - | - | Export |
| Notifications | Yes | - | - | - | Send |

UI requirements:

- Group permissions by module.
- Provide individual permission checkboxes.
- Provide Select All and Deselect All options.
- Allow selecting all permissions for a particular module.
- Show selected permission count.
- Prevent saving a role without a name.
- Display a confirmation before saving major permission changes.

The UI should be generated from the backend permission catalogue rather than maintaining a separate hardcoded permission list in the frontend.

---

## 7. Staff Management and Role Assignment

Staff management will be responsible for creating application accounts and assigning roles.

### 7.1 Add Staff

Required information:

| Field | Description |
|---|---|
| Full Name | Staff member's name |
| Mobile Number | Contact number |
| Email | Login email |
| Password | Initial login password |
| Designation | Job title |
| Assigned Role | Role selected from existing roles |
| Status | Active or inactive |

### 7.2 Assign Role

When adding or editing a staff user:

1. Fetch all active roles.
2. Display available roles.
3. Allow the administrator to select one or more roles.
4. Save the assignment.
5. Load permissions from the assigned roles during authorization.

Example:

| Staff Name | Designation | Assigned Role | Status |
|---|---|---|---|
| Rahul | Receptionist | Receptionist | Active |
| Amit | Accountant | Accountant | Active |
| Priya | Floor Manager | Floor Manager | Active |
| Karan | Personal Trainer | Trainer | Active |

### 7.3 Multiple Roles

The system should support assigning multiple roles to a staff user.

For example:

A staff member may have:
- Receptionist
- Attendance Manager

The user's effective permissions will be the union of permissions granted by all assigned roles.

If a user has a permission through any active assigned role, the user can perform that action, subject to additional restrictions.

For the initial version, the UI can default to assigning one role while the database supports multiple roles.

---

## 8. Default System Roles

The application can provide predefined roles when a gym is first configured.

These are starting templates, not hardcoded authorization rules.

Suggested default roles:

### Owner
- Full access to all modules.
- Manage staff.
- Manage roles and permissions.
- Access financial information.
- Manage gym settings.

### Administrator
- Access to operational modules.
- Manage members and memberships.
- Manage attendance and payments.
- Manage staff if permitted.
- Manage reports.

### Receptionist
- View dashboard.
- Manage member registrations.
- Assign and renew memberships.
- Record payments.
- Mark attendance.

### Accountant
- View financial dashboard.
- View payments.
- Manage expenses.
- Generate financial reports.
- Export reports.

### Trainer
- View assigned members.
- View relevant member membership information.
- View and manage permitted attendance records.
- View their own profile and schedule.

Important: Default role permissions should be configurable by the gym owner.

The Owner account should receive protected administrative access and must not accidentally lose all administrative permissions.

---

## 9. Database Design

The RBAC system should use relational database tables.

### 9.1 users

Stores login accounts.

| Column | Description |
|---|---|
| id | Primary key |
| gym_id | Gym reference |
| full_name | User name |
| email | Login email |
| mobile | Contact number |
| password_hash | Hashed password |
| status | Active, inactive, suspended |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

### 9.2 staff

Stores additional staff information.

| Column | Description |
|---|---|
| id | Primary key |
| gym_id | Gym reference |
| user_id | User reference |
| designation | Job title |
| joining_date | Joining date |
| salary | Salary information, if required |
| status | Employment status |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

### 9.3 roles

Stores custom and predefined roles.

| Column | Description |
|---|---|
| id | Primary key |
| gym_id | Gym reference |
| name | Role name |
| slug | Unique role identifier within gym |
| description | Role description |
| is_system | Indicates predefined role |
| is_protected | Prevents deletion or loss of critical access |
| status | Active or inactive |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

### 9.4 permissions

Stores the application's permission catalogue.

| Column | Description |
|---|---|
| id | Primary key |
| module | Module name |
| action | Permission action |
| permission_key | Unique key |
| description | Permission description |

Example:

```text
members.view
members.create
members.update
members.delete
payments.refund
```

Permissions are application-defined and shared across gyms. They should not be independently created by gym administrators.

### 9.5 role_permissions

Connects roles with permissions.

| Column | Description |
|---|---|
| id | Primary key |
| role_id | Role reference |
| permission_id | Permission reference |
| created_at | Creation timestamp |

A role can have multiple permissions, and a permission can belong to multiple roles.

### 9.6 user_roles

Connects users with roles.

| Column | Description |
|---|---|
| id | Primary key |
| user_id | User reference |
| role_id | Role reference |
| assigned_by | Administrator who assigned the role |
| assigned_at | Assignment timestamp |

A user can have multiple roles, and a role can be assigned to multiple users.

### 9.7 audit_logs

Tracks important security and administrative activities.

| Column | Description |
|---|---|
| id | Primary key |
| gym_id | Gym reference |
| performed_by | User who performed the action |
| action | Action performed |
| entity_type | Affected entity |
| entity_id | Affected record |
| old_values | Previous values |
| new_values | Updated values |
| created_at | Timestamp |

Important activities to log:
- Role creation.
- Role updates.
- Role deletion.
- Permission changes.
- Role assignment.
- Role removal.
- Staff activation and deactivation.

---

## 10. Database Relationships

```text
                    GYMS
                      |
             +--------+--------+
             |                 |
             v                 v
           USERS              ROLES
             |                 |
             |                 |
         USER_ROLES            |
             |                 |
             +-----------------+
                      |
                   ROLES
                      |
               ROLE_PERMISSIONS
                      |
                      v
                 PERMISSIONS

USERS
  |
  v
STAFF

USERS
  |
  v
AUDIT_LOGS
```

Important database constraints:

- Unique email per gym for staff login accounts.
- Unique role slug per gym.
- Unique permission key globally.
- Unique role-permission combination.
- Unique user-role combination.
- Foreign keys for all relationships.
- Indexes on gym_id, user_id, role_id and permission_id.

All role assignments and permission lookups must respect gym-level boundaries.

---

## 11. Backend Authorization

Backend authorization is mandatory.

Hiding buttons or menu items in the frontend is not sufficient security.

Every protected API endpoint must validate the authenticated user's permissions.

### 11.1 Authentication

The authentication middleware should:

1. Validate the access token.
2. Identify the authenticated user.
3. Verify that the user account is active.
4. Identify the current gym context.
5. Attach the authenticated user information to the request.

### 11.2 Permission Middleware

Create reusable middleware:

```javascript
authorize("members.create")
```

Example:

```javascript
router.post(
  "/members",
  authenticate,
  authorize("members.create"),
  createMember
);
```

The authorization middleware should:

1. Identify the authenticated user.
2. Fetch their active role assignments.
3. Fetch permissions associated with those roles.
4. Check whether the required permission exists.
5. Allow the request if authorized.
6. Return HTTP 403 if permission is missing.

### 11.3 Authorization Responses

| Situation | HTTP Status |
|---|---|
| User is not authenticated | 401 |
| User lacks required permission | 403 |
| Resource does not exist | 404 |
| Request is authorized | 200 / 201 |

### 11.4 Permission Caching

Initially, permissions can be retrieved from the database.

If performance becomes an issue, Redis can be introduced to cache effective permissions.

When a role's permissions or a user's role assignments change, the corresponding cached permissions must be invalidated.

---

## 12. Frontend Authorization

The frontend should use permissions returned by the backend.

Example:

```javascript
const permissions = [
  "members.view",
  "members.create",
  "members.update",
  "payments.view"
];
```

### 12.1 Sidebar Access

Only show modules the staff user is allowed to access.

Example:

```text
Dashboard
Members
Memberships
Payments
```

### 12.2 Button Access

Show or hide actions according to permissions.

Example:

```javascript
if (hasPermission("members.create")) {
  // Display Add Member button
}
```

Other examples:

- Show Edit button only with `members.update`.
- Show Delete button only with `members.delete`.
- Show Refund button only with `payments.refund`.
- Show Export button only with `reports.export`.

The frontend is responsible for the user experience, while the backend remains the final authority.

---

## 13. Special Access Restrictions

Some permissions require restrictions beyond basic RBAC.

Examples:

### Trainer Access

A trainer may have:

```text
members.view
attendance.view
```

However, this should not automatically grant access to every gym member.

The backend must additionally verify that the member is assigned to that trainer, if the gym has enabled assigned-member restrictions.

### Financial Access

Financial permissions should be separate.

For example:

```text
payments.view
payments.create
payments.refund

expenses.view
expenses.create
expenses.update

reports.view
reports.export
```

A staff member who can view payments should not automatically be able to issue refunds.

### Owner Protection

- The Owner account must have protected administrative access.
- The last active Owner account cannot be deactivated.
- The last Owner role assignment cannot be removed without transferring ownership.
- Ordinary staff users cannot modify their own permissions.
- Critical administrative changes must be logged.

---

## 14. Security Requirements

- Store passwords using secure password hashing.
- Never trust permissions sent by the frontend.
- Validate permissions on every protected backend endpoint.
- Prevent cross-gym data access.
- Prevent unauthorized role assignment.
- Prevent users from escalating their own privileges.
- Validate role ownership before editing or deleting a role.
- Use database transactions when updating role permissions.
- Log sensitive administrative changes.
- Revalidate permissions after role changes.
- Protect Owner-level access.

---

## 15. Future SaaS Compatibility

Although the first version is designed for a single gym, the database should support multiple gyms in the future.

The following design decisions should be implemented from the beginning:

1. Every gym should have a unique gym_id.
2. Staff users should be associated with a gym.
3. Custom roles should belong to a gym.
4. Role assignments must be gym-specific.
5. Permissions should remain application-defined.
6. Every authorization check must validate the gym context.
7. One gym must never access another gym's roles, staff or records.

This will make future SaaS conversion easier without requiring a complete RBAC redesign.

---

## 16. Implementation Phases

### Phase 1: Permission Catalogue
- Define all modules.
- Define all actions.
- Create permission keys.
- Seed permissions into the database.

### Phase 2: Database
- Create users table.
- Create staff table.
- Create roles table.
- Create permissions table.
- Create role_permissions table.
- Create user_roles table.
- Create audit_logs table.

### Phase 3: Role Management APIs
- Create role.
- Get all roles.
- Get role details.
- Update role.
- Delete role.
- Assign permissions to role.
- Remove permissions from role.

### Phase 4: Staff Management APIs
- Create staff.
- Get staff list.
- Get staff details.
- Update staff.
- Assign roles.
- Remove roles.
- Activate or deactivate staff.

### Phase 5: Authorization Middleware
- Authentication middleware.
- Permission middleware.
- Gym-level access validation.
- Owner protection.

### Phase 6: Frontend
- Roles list page.
- Create role page.
- Edit role page.
- Permission selection interface.
- Staff management page.
- Role assignment interface.
- Permission-based sidebar.
- Permission-based buttons and actions.

### Phase 7: Testing
- Test role creation.
- Test permission assignment.
- Test multiple users sharing a role.
- Test multiple roles assigned to one user.
- Test permission changes.
- Test unauthorized API requests.
- Test cross-gym access restrictions.
- Test Owner protection.

---

## 17. Acceptance Criteria

The RBAC system will be considered complete when:

- [ ] Owner can create custom roles.
- [ ] Authorized administrators can manage roles.
- [ ] Roles can be edited and deleted when eligible.
- [ ] The application provides a predefined permission catalogue.
- [ ] Administrators can select individual permissions.
- [ ] Staff users can be created.
- [ ] Roles can be assigned to staff users.
- [ ] Multiple staff users can share the same role.
- [ ] A staff user can have multiple roles.
- [ ] Permission changes automatically affect assigned users.
- [ ] Unauthorized users cannot access protected APIs.
- [ ] Frontend navigation respects permissions.
- [ ] Special restrictions are enforced by the backend.
- [ ] Role and permission changes are recorded in audit logs.
- [ ] Gym-level data isolation is enforced.
- [ ] Owner access cannot be accidentally removed.

---

## 18. Final Architecture Decision

The application will implement:

**Dynamic Role-Based Access Control with Permission-Based Authorization.**

Key decisions:

| Feature | Decision |
|---|---|
| Role creation | Dynamic |
| Role assignment | Staff users |
| Permission creation | Predefined by application |
| Permission assignment | Configurable by authorized administrators |
| Multiple roles per user | Supported |
| Multiple users per role | Supported |
| Permission changes | Dynamic |
| Backend authorization | Mandatory |
| Frontend authorization | Permission-based |
| Record-level restrictions | Supported |
| Gym-level isolation | Mandatory |
| SaaS compatibility | Planned from the beginning |

The system must not depend on hardcoded role names such as Receptionist, Accountant or Trainer.

Instead, roles will be database records, and permissions will determine what each staff user can access and perform.