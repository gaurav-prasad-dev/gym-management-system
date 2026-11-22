# MVP Scope – Gym Management System

**Product:** Gym Management System  
**Version:** 1.0  
**Release Type:** Minimum Viable Product (MVP)  
**Initial Deployment:** Single Gym  
**Architecture:** Modular Monolith  
**Future Direction:** Multi-Tenant SaaS

---

# 1. Introduction

## 1.1 Purpose

This document defines the features, functionalities and limitations of the first release of the Gym Management System.

The MVP will focus on providing essential gym management capabilities that help small and medium-sized gym owners manage their daily operations efficiently.

The objective is to develop a functional, reliable and user-friendly application without introducing unnecessary complexity.

## 1.2 MVP Objectives

The primary objectives are:

- Digitize daily gym operations.
- Centralize member information.
- Simplify membership management.
- Track member attendance.
- Manage payments and outstanding dues.
- Manage trainers.
- Track gym expenses.
- Automate important notifications.
- Generate operational and financial reports.

---

# 2. MVP Modules

The first release will contain nine modules.

| No. | Module | Priority |
|---|---|---|
| 1 | Dashboard | High |
| 2 | Member Management | Critical |
| 3 | Membership Management | Critical |
| 4 | Attendance Management | High |
| 5 | Payment Management | Critical |
| 6 | Trainer Management | Medium |
| 7 | Expense Management | Medium |
| 8 | Notifications & Automation | Medium |
| 9 | Reports & Analytics | Medium |

---

# 3. Detailed MVP Scope

## 3.1 Dashboard

### Included Features

**Statistics Cards**
- Total Members.
- Active Members.
- Expired Members.
- Today's Attendance.
- Today's Collection.
- Pending Payments.
- Monthly Revenue.

**Recent Activities**
- Recent Registrations.
- Recent Payments.
- Upcoming Membership Expirations.

**Graphs**
- Attendance Graph.
- Revenue Graph.

### Excluded Features
- Advanced business intelligence.
- Predictive analytics.
- Custom dashboard builder.
- Advanced comparison analytics.

---

## 3.2 Member Management

### Included Features

**Member Operations**
- Register New Member.
- Update Member Information.
- View Member Details.
- Upload Profile Picture.
- Search Members.
- Filter Members.
- Activate Members.
- Deactivate Members.

**Member Information**
- Member ID.
- Full Name.
- Mobile Number.
- Email.
- Gender.
- Date of Birth.
- Address.
- Emergency Contact.
- Joining Date.
- Profile Picture.
- Status.

**Member History**
- Membership History.
- Payment History.
- Attendance History.

### Excluded Features
- Member mobile application.
- Member self-registration portal.
- Online member profile management.
- Bulk member import.
- Advanced member engagement analytics.

---

## 3.3 Membership Management

### Included Features

**Membership Plan Management**
- Create Membership Plans.
- Update Membership Plans.
- Activate Plans.
- Deactivate Plans.
- View Available Plans.

**Member Membership Management**
- Assign Membership Plans.
- Activate Memberships.
- Renew Memberships.
- Extend Memberships.
- Freeze Memberships.
- Expire Memberships.
- View Membership History.

**Initial Membership Plans**

| Plan | Duration | Price |
|---|---|---|
| Monthly | 1 Month | ₹1,000 |
| Quarterly | 3 Months | ₹2,700 |
| Half-Yearly | 6 Months | ₹5,000 |
| Yearly | 12 Months | ₹9,000 |

These will be sample plans. Gym owners should be able to create their own plans.

### Excluded Features
- Family memberships.
- Corporate memberships.
- Multiple gym branch memberships.
- Membership transfer between members.
- Complex promotional campaigns.

---

## 3.4 Attendance Management

### Included Features

**Manual Attendance**
- Search Member.
- View Membership Status.
- Mark Attendance.
- View Attendance History.

**QR Code Attendance**
- Generate Unique Member QR Code.
- Scan Member QR Code.
- Identify Member.
- Verify Membership Validity.
- Record Attendance.

**Attendance Reports**
- Daily Attendance.
- Member Attendance History.
- Date-Based Attendance Filtering.

### Excluded Features
- Biometric Machine Integration.
- Facial Recognition.
- GPS-Based Attendance.
- Automated Turnstile Integration.

---

## 3.5 Payment Management

### Included Features

**Payment Operations**
- Record Payments.
- Cash Payments.
- UPI Payments.
- Card Payments.
- Partial Payments.
- Pending Payments.
- Additional Payment Collection.
- Payment History.
- Refund Records.
- Payment Receipts.

**Payment Tracking**
- Membership Amount.
- Total Paid Amount.
- Outstanding Balance.
- Refund Amount.
- Payment Status.

**Payment Receipts**
- Generate Printable Receipts.
- View Payment Details.
- Download Receipts.

### Excluded Features
- Online Payment Gateway.
- Automatic Bank Reconciliation.
- EMI Management.
- Automated Subscription Payments.
- Accounting Software Integration.

---

## 3.6 Trainer Management

### Included Features

**Trainer Operations**
- Add Trainers.
- Update Trainer Information.
- View Trainer Profiles.
- Activate Trainers.
- Deactivate Trainers.

**Trainer Information**
- Trainer ID.
- Full Name.
- Mobile Number.
- Email.
- Address.
- Joining Date.
- Specialization.
- Salary Details.
- Employment Status.

**Additional Features**
- Assign Members to Trainers.
- View Assigned Members.
- Track Trainer Attendance.
- Maintain Salary Records.

### Excluded Features
- Trainer Payroll Automation.
- Trainer Commission Management.
- Trainer Performance Analytics.
- Online Trainer Scheduling.

---

## 3.7 Expense Management

### Included Features

**Expense Operations**
- Add Expenses.
- Update Expenses.
- View Expense History.
- Search Expenses.
- Filter Expenses.
- Manage Expense Categories.

**Initial Expense Categories**
- Rent.
- Electricity.
- Trainer Salaries.
- Equipment Purchases.
- Maintenance.
- Marketing.
- Other Expenses.

**Expense Reports**
- Daily Expenses.
- Monthly Expenses.
- Category-Wise Expenses.
- Total Expenses.

### Excluded Features
- Full Accounting System.
- GST Filing.
- Tax Management.
- Vendor Management.
- Automated Bank Transactions.

---

## 3.8 Notifications & Automation

### Included Features

**Notification Events**

| Event | Action |
|---|---|
| New Membership | Welcome Message |
| Membership Expiring | Expiration Reminder |
| Membership Expired | Member and Owner Notification |
| Payment Received | Payment Receipt |
| Payment Pending | Payment Reminder |
| Member Birthday | Birthday Wishes |

**Notification Channels**
- Email.
- WhatsApp.

**Notification Management**
- Notification Templates.
- Notification History.
- Delivery Status.
- Failed Notification Logs.

### Excluded Features
- SMS Gateway Integration.
- Push Notifications.
- Advanced Marketing Automation.
- Bulk Promotional Campaigns.
- AI-Powered Communication.

Note: WhatsApp notifications will require an appropriate WhatsApp Business integration and credentials.

---

## 3.9 Reports & Analytics

### Included Features

**Revenue Reports**
- Daily Revenue.
- Monthly Revenue.
- Payment Collection.
- Outstanding Payments.
- Refund Reports.

**Membership Reports**
- Active Members.
- Expired Members.
- Upcoming Expirations.
- Membership Renewals.
- Membership Plan Performance.

**Attendance Reports**
- Daily Attendance.
- Monthly Attendance.
- Member Attendance History.
- Attendance Trends.

**Expense Reports**
- Daily Expenses.
- Monthly Expenses.
- Category-Wise Expenses.

**Business Analytics**
- Revenue Trends.
- Expense Trends.
- Membership Growth.
- Attendance Trends.
- Estimated Operating Profit.

### Excluded Features
- Advanced Predictive Analytics.
- AI-Based Business Recommendations.
- Custom Report Builder.
- Advanced Financial Forecasting.

---

# 4. Authentication and Authorization Scope

Authentication and authorization are essential foundations of the MVP.

### Included Features

- User Login.
- User Logout.
- Secure Password Storage.
- Password Management.
- Role-Based Access Control.
- Permission-Based Authorization.
- Protected Routes.
- Staff Account Management.

### Initial Roles

1. Owner.
2. Administrator.
3. Receptionist.
4. Trainer.

The owner will have control over staff accounts and permissions.

---

# 5. Technical Scope

## 5.1 Architecture

- Modular Monolith Architecture.
- Separation of Frontend and Backend.
- Independent Business Modules.
- Reusable Components.
- Centralized Error Handling.
- Consistent API Structure.

## 5.2 Database

- PostgreSQL.
- Relational Database Design.
- Proper Foreign Key Relationships.
- Database Transactions for critical operations.
- Database Indexing.
- Data Validation.

## 5.3 Security

- Secure Authentication.
- Password Hashing.
- Backend Authorization.
- Input Validation.
- Protected APIs.
- Proper Error Handling.
- Secure File Uploads.

## 5.4 Future SaaS Compatibility

Although the initial version will support one gym, the architecture should consider:

- Gym-Level Data Isolation.
- Gym ID in Business Records.
- Configurable Gym Information.
- Role-Based Access.
- Future Tenant-Level Permissions.

Full SaaS subscription management and billing are not included in the MVP.

---

# 6. Features Excluded From MVP

The following modules and functionalities will not be implemented in the first release.

| Feature | Reason |
|---|---|
| Workout Management | Can be introduced later |
| Diet Management | Can be introduced later |
| Member Mobile App | Not essential initially |
| Biometric Attendance | Requires hardware integration |
| Facial Recognition | Additional complexity |
| Online Payment Gateway | Can be integrated later |
| SaaS Subscription Billing | Future SaaS requirement |
| Multi-Gym Management | Future SaaS requirement |
| Advanced AI Analytics | Not required initially |
| Member Self-Service Portal | Future enhancement |

---

# 7. MVP Development Priorities

Development will follow this sequence.

| Phase | Module | Priority |
|---|---|---|
| 1 | Project Setup & Architecture | Critical |
| 2 | Authentication & Authorization | Critical |
| 3 | Member Management | Critical |
| 4 | Membership Management | Critical |
| 5 | Payment Management | Critical |
| 6 | Attendance Management | High |
| 7 | Dashboard | High |
| 8 | Trainer Management | Medium |
| 9 | Expense Management | Medium |
| 10 | Notifications & Automation | Medium |
| 11 | Reports & Analytics | Medium |
| 12 | Testing & Deployment | Critical |

---

# 8. MVP Acceptance Criteria

The MVP will be considered ready for its first release when:

1. Users can log in securely.
2. Different user roles have appropriate permissions.
3. Gym owners can register and manage members.
4. Membership plans can be created and assigned.
5. Membership renewals, extensions and freezing work correctly.
6. Membership expiration is handled automatically.
7. Attendance can be recorded manually.
8. QR code attendance works correctly.
9. Full and partial payments can be recorded.
10. Outstanding balances are calculated accurately.
11. Payment receipts can be generated.
12. Trainers can be managed.
13. Expenses can be recorded and categorized.
14. Important notifications can be triggered.
15. Reports display accurate information.
16. Dashboard statistics reflect actual database records.
17. Critical operations have appropriate validation.
18. Application data is protected against unauthorized access.

---

# 9. Future Release Possibilities

After completing and validating the MVP, future versions may include:

## Version 2
- Workout Management.
- Diet Management.
- Member Mobile Application.
- Online Payment Integration.
- Biometric Attendance.
- Advanced Reports.

## Version 3
- Multi-Tenant SaaS Architecture.
- Gym Owner Registration.
- SaaS Subscription Plans.
- Subscription Billing.
- Tenant-Level Data Isolation.
- Multiple Gym Branches.
- Advanced Analytics.

---

# 10. Document Status

**Document:** MVP Scope Definition  
**Version:** 1.0  
**Status:** Initial Scope Defined  
**Next Document:** businessRules.md