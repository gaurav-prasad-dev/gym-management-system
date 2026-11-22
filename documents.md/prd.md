# Product Requirements Document (PRD)
# Gym Management System

**Product Name:** Gym Management System  
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Product Stage:** MVP  
**Architecture:** Modular Monolith  
**Initial Deployment:** Single Gym  
**Future Direction:** Multi-Tenant SaaS

---

# 1. Product Overview

## 1.1 Introduction

The Gym Management System is a web-based application designed to help gym owners manage and automate their daily business operations.

The application will provide a centralized platform for managing members, memberships, attendance, payments, trainers, expenses, notifications and business reports.

The system will initially target small and medium-sized gyms that require an affordable and easy-to-use management solution.

The first version will support a single gym. However, the application architecture and database design should consider future conversion into a multi-tenant SaaS platform.

## 1.2 Product Vision

To provide gym owners with a reliable, affordable and easy-to-use platform that simplifies gym operations, reduces manual work and improves business management.

## 1.3 Product Goals

- Digitize gym operations.
- Centralize member information.
- Simplify membership management.
- Automate attendance tracking.
- Maintain accurate payment records.
- Track gym expenses.
- Automate important notifications.
- Generate useful business reports.
- Build a foundation for future SaaS expansion.

---

# 2. Target Users

The application will support the following user types.

## 2.1 Gym Owner

The gym owner has complete control over gym operations.

Responsibilities:
- View business dashboard.
- Manage members.
- Create membership plans.
- Manage memberships.
- Monitor payments and collections.
- Manage trainers.
- Track expenses.
- Configure notifications.
- Access reports and analytics.
- Manage staff accounts and permissions.

## 2.2 Administrator

The administrator helps manage daily gym operations.

Responsibilities:
- Manage members.
- Manage memberships.
- Record payments.
- Manage attendance.
- View relevant reports.

Access will depend on permissions assigned by the gym owner.

## 2.3 Receptionist

The receptionist handles daily front-desk operations.

Responsibilities:
- Register members.
- Update member information.
- Assign membership plans.
- Record payments.
- Mark attendance.
- Scan member QR codes.
- View membership status.

## 2.4 Trainer

The trainer manages assigned members and their training-related activities.

Responsibilities:
- View assigned members.
- View member information.
- Track trainer attendance.
- Access permitted member records.

---

# 3. MVP Modules and Requirements

The MVP will contain the following nine modules.

1. Dashboard
2. Member Management
3. Membership Management
4. Attendance Management
5. Payment Management
6. Trainer Management
7. Expense Management
8. Notifications and Automation
9. Reports and Analytics

---

# 4. Module Requirements

# 4.1 Dashboard

## Objective

Provide gym owners and authorized staff with a centralized overview of gym operations and important business statistics.

## Functional Requirements

### Statistics Cards

The dashboard should display:

- Total Members
- Active Members
- Expired Members
- Today's Attendance
- Today's Collection
- Pending Payments
- Monthly Revenue

### Recent Activities

The dashboard should display:

- Recent Member Registrations.
- Recent Payments.
- Upcoming Membership Expirations.

### Graphs and Analytics

The dashboard should include:

- Attendance Graph.
- Revenue Graph.

### Additional Requirements

- Dashboard statistics should be calculated using actual database records.
- Statistics should update when relevant operations occur.
- Users should only see information permitted by their roles.
- Graphs should support relevant date-based filtering.

---

# 4.2 Member Management

## Objective

Provide a centralized system for registering, managing and tracking gym members.

## Functional Requirements

### Member Registration

Users should be able to register new members by entering:

- Member ID
- Full Name
- Mobile Number
- Email
- Gender
- Date of Birth
- Address
- Emergency Contact
- Joining Date
- Profile Picture
- Status

### Member Management Operations

The system should support:

- Register New Member.
- Update Member Information.
- Upload Profile Picture.
- Search Members.
- Filter Members.
- View Member Details.
- Activate Members.
- Deactivate Members.

### Member History

Every member should have access to relevant historical information:

- Membership History.
- Payment History.
- Attendance History.

### Search and Filtering

Users should be able to search and filter members using:

- Member ID.
- Member Name.
- Mobile Number.
- Email.
- Membership Status.
- Member Status.

### Member Status

Possible member statuses:

- Active.
- Inactive.

Membership status and member account status must be maintained separately.

---

# 4.3 Membership Management

## Objective

Allow gym owners to create membership plans and manage individual member memberships.

## Important Concept

Membership Plans and Member Memberships must be separate entities.

A membership plan defines the available pricing and duration.

A member membership represents an actual purchase or assignment of a particular plan to a member.

## Functional Requirements

### Membership Plan Management

Users should be able to:

- Create Membership Plans.
- Update Membership Plans.
- Activate Plans.
- Deactivate Plans.
- View Available Plans.

### Example Membership Plans

| Plan | Duration | Price |
|---|---|---|
| Monthly | 1 Month | ₹1,000 |
| Quarterly | 3 Months | ₹2,700 |
| Half-Yearly | 6 Months | ₹5,000 |
| Yearly | 12 Months | ₹9,000 |

### Member Membership Management

Users should be able to:

- Assign Membership Plans to Members.
- Activate Memberships.
- Renew Memberships.
- Extend Memberships.
- Freeze Memberships.
- Expire Memberships.
- View Membership History.

### Membership Information

Each member membership should maintain:

- Member.
- Membership Plan.
- Membership Start Date.
- Membership End Date.
- Membership Amount.
- Discount, if applicable.
- Final Membership Amount.
- Membership Status.
- Freeze Information.

### Membership Status

- Upcoming.
- Active.
- Expired.
- Frozen.
- Cancelled.

---

# 4.4 Attendance Management

## Objective

Provide an efficient system for recording and tracking member attendance.

## Functional Requirements

The initial version will support two attendance methods.

### Method 1: Manual Attendance

- Receptionist searches for a member.
- System displays member information.
- System verifies membership validity.
- Receptionist marks attendance.
- Attendance is saved in the database.

### Method 2: QR Code Attendance

Every member should receive a unique QR code.

Attendance workflow:

1. Member presents their QR code.
2. Receptionist opens the attendance scanner.
3. System scans the QR code.
4. Backend identifies the member.
5. Backend verifies membership validity.
6. Attendance is recorded.
7. System displays the attendance result.

### Attendance Features

- Mark Attendance.
- QR Code Scanning.
- View Attendance History.
- Search Attendance Records.
- Filter Attendance by Date.
- View Daily Attendance.
- View Member Attendance History.

### Attendance Information

- Attendance ID.
- Member ID.
- Attendance Date.
- Check-in Time.
- Check-out Time, if implemented.
- Attendance Method.

### Future Enhancement

Biometric attendance machine integration.

---

# 4.5 Payment Management

## Objective

Provide a centralized system for recording, tracking and managing all member payments.

## Functional Requirements

### Payment Operations

Users should be able to:

- Record Payments.
- View Payment History.
- Search Payments.
- Filter Payments.
- Record Partial Payments.
- Track Pending Payments.
- Record Refunds.
- Generate Payment Receipts.

### Supported Payment Methods

- Cash.
- UPI.
- Card.

### Partial Payment Management

Example:

A member purchases a membership worth ₹3,000 but initially pays ₹2,000.

| Description | Amount |
|---|---:|
| Membership Fee | ₹3,000 |
| Paid Amount | ₹2,000 |
| Outstanding | ₹1,000 |

The system should maintain the outstanding balance and allow additional payments later.

### Payment Information

- Payment ID.
- Member ID.
- Membership ID, where applicable.
- Payment Amount.
- Payment Method.
- Payment Date.
- Transaction Reference.
- Payment Status.
- Recorded By.

### Payment Status

- Pending.
- Partially Paid.
- Paid.
- Failed.
- Refunded.
- Partially Refunded.

### Payment Receipts

The system should generate payment receipts containing:

- Gym Information.
- Member Information.
- Payment ID.
- Payment Date.
- Payment Amount.
- Payment Method.
- Membership Information.
- Outstanding Balance, if applicable.

### Financial Distinction

The system must maintain separate calculations for:

1. Membership Revenue.
2. Actual Payment Collections.
3. Outstanding Payments.
4. Refunds.

These values must not be treated as interchangeable.

---

# 4.6 Trainer Management

## Objective

Allow gym owners to manage trainer information and monitor trainer-related activities.

## Functional Requirements

### Trainer Operations

Users should be able to:

- Add Trainers.
- Update Trainer Information.
- View Trainer Profiles.
- Activate Trainers.
- Deactivate Trainers.

### Trainer Information

- Trainer ID.
- Full Name.
- Mobile Number.
- Email.
- Address.
- Joining Date.
- Profile Picture.
- Specialization.
- Salary.
- Employment Status.

### Additional Features

- Assign Members to Trainers.
- View Assigned Members.
- Track Trainer Attendance.
- Maintain Trainer Salary Information.

---

# 4.7 Expense Management

## Objective

Provide a system to record and monitor gym operating expenses.

## Functional Requirements

Users should be able to:

- Record Expenses.
- Update Expense Records.
- Delete or Void Expense Records.
- View Expense History.
- Search Expenses.
- Filter Expenses.
- Manage Expense Categories.

### Expense Categories

Examples:

- Rent.
- Electricity.
- Trainer Salaries.
- Equipment Purchases.
- Maintenance.
- Marketing.
- Other Expenses.

### Expense Information

- Expense ID.
- Expense Category.
- Description.
- Amount.
- Expense Date.
- Payment Method.
- Recorded By.
- Supporting Attachment, if applicable.

### Expense Analytics

The system should calculate:

- Daily Expenses.
- Monthly Expenses.
- Category-wise Expenses.
- Total Expenses.

The system should also provide estimated operating profit using recorded financial data.

---

# 4.8 Notifications and Automation

## Objective

Automate important communication between the gym and its members.

## Functional Requirements

The system should support automated notifications for important events.

### Notification Events

| Event | Action |
|---|---|
| New Membership | Send Welcome Message |
| Membership Expiring | Send Expiration Reminder |
| Membership Expired | Notify Member and Owner |
| Payment Received | Send Payment Receipt |
| Payment Pending | Send Payment Reminder |
| Member Birthday | Send Birthday Wishes |

### Notification Channels

Initially:

- Email.
- WhatsApp.

### Notification Management

The system should support:

- Notification Templates.
- Notification History.
- Notification Status.
- Failed Notification Tracking.

### Automation Requirements

- Notifications should be triggered by relevant business events.
- Scheduled reminders should run automatically.
- Failed notifications should be logged.
- Duplicate notifications should be avoided.

---

# 4.9 Reports and Analytics

## Objective

Provide gym owners with useful business information through reports and analytics.

## Functional Requirements

### Revenue Reports

- Daily Revenue Report.
- Monthly Revenue Report.
- Payment Collection Report.
- Outstanding Payments Report.
- Refund Report.

### Membership Reports

- Active Members Report.
- Expired Members Report.
- Upcoming Membership Expirations.
- Membership Renewal Report.
- Membership Plan Performance.

### Attendance Reports

- Daily Attendance Report.
- Monthly Attendance Report.
- Member Attendance History.
- Attendance Trends.

### Expense Reports

- Daily Expense Report.
- Monthly Expense Report.
- Category-wise Expense Report.

### Analytics

The system should provide:

- Revenue Trends.
- Expense Trends.
- Attendance Trends.
- Membership Growth.
- Estimated Operating Profit.

Reports should support date-based filtering.

---

# 5. Authentication and Authorization

## Objective

Ensure that application access is secure and controlled according to user roles.

## Functional Requirements

- User Login.
- User Logout.
- Password Management.
- Secure Password Storage.
- Role-Based Access Control.
- Permission-Based Authorization.
- Protected Application Routes.

### Initial Roles

- Owner.
- Administrator.
- Receptionist.
- Trainer.

The owner should be able to manage staff accounts and assign permissions.

---

# 6. Non-Functional Requirements

## 6.1 Performance

- Application pages should load efficiently.
- Database queries should be optimized.
- Large data lists should support pagination.
- Search and filtering should remain responsive.

## 6.2 Security

- Passwords must be securely hashed.
- APIs must be protected.
- Authorization must be enforced on the backend.
- Sensitive information must not be exposed unnecessarily.
- Input validation must be implemented.
- Database operations must preserve data integrity.

## 6.3 Scalability

- Application should follow modular architecture.
- Database design should support future multi-tenancy.
- Modules should remain logically independent.
- Future integrations should be possible without major architectural changes.

## 6.4 Maintainability

- Follow consistent coding conventions.
- Maintain separation of concerns.
- Use reusable components.
- Keep business logic separate from controllers.
- Maintain proper error handling and logging.

## 6.5 Usability

- Interface should be simple and intuitive.
- Navigation should be consistent.
- Forms should provide clear validation messages.
- Application should support desktop, tablet and mobile screens.

## 6.6 Reliability

- Financial records must remain consistent.
- Important operations should be properly validated.
- Errors should be logged.
- Data should be backed up regularly.

---

# 7. Data Management Requirements

The application should maintain proper relationships between business entities.

Important entities include:

- Gyms.
- Users.
- Roles.
- Permissions.
- Members.
- Membership Plans.
- Member Memberships.
- Membership History.
- Attendance.
- Payments.
- Refunds.
- Trainers.
- Trainer Attendance.
- Expenses.
- Expense Categories.
- Notifications.
- Notification Templates.

### Important Database Principles

1. Membership Plans and Member Memberships must be separate.
2. Payments must be maintained separately from membership records.
3. Attendance must be linked to members.
4. Trainers must be maintained independently from members.
5. Expense categories must be reusable.
6. Financial records must preserve historical information.
7. Business records should support future gym-level data isolation.

---

# 8. MVP Scope

The first release will include:

| Module | MVP Status |
|---|---|
| Dashboard | Included |
| Member Management | Included |
| Membership Management | Included |
| Attendance Management | Included |
| Payment Management | Included |
| Trainer Management | Included |
| Expense Management | Included |
| Notifications and Automation | Included |
| Reports and Analytics | Included |
| Workout Management | Excluded |
| Diet Management | Excluded |
| Biometric Integration | Excluded |
| Member Mobile Application | Excluded |
| Multi-Tenant SaaS Billing | Excluded |

Excluded features may be considered for future releases.

---

# 9. Success Criteria

The MVP will be considered successful when:

1. Gym owners can manage their gym operations through one application.
2. Members can be registered and managed successfully.
3. Membership plans can be created and assigned.
4. Membership expiration and renewal work correctly.
5. Attendance can be recorded manually and through QR codes.
6. Full and partial payments can be recorded accurately.
7. Outstanding balances are calculated correctly.
8. Trainers and expenses can be managed.
9. Automated notifications can be triggered.
10. Reports display accurate information.
11. Role-based access works correctly.
12. Important business operations are properly validated.

---

# 10. Future Product Direction

After successfully implementing the initial version, the system may evolve into a multi-tenant SaaS platform.

Potential capabilities:

- Gym Registration and Onboarding.
- Multiple Gym Management.
- Subscription Plans for Gym Owners.
- SaaS Billing and Payments.
- Tenant-Level Data Isolation.
- Subscription Expiration Management.
- Advanced Analytics.
- Mobile Applications.
- Third-Party Integrations.

The initial development should avoid architectural decisions that unnecessarily complicate future SaaS conversion.

---

# 11. Document Status

**Version:** 1.0  
**Status:** Initial Product Requirements Defined  
**Next Document:** mvpScope.md

This document will be updated as product requirements evolve.