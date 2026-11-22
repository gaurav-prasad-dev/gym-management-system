# Business Rules – Gym Management System

**Product:** Gym Management System  
**Version:** 1.0  
**Document Type:** Business Rules  
**Architecture:** Modular Monolith  
**Initial Deployment:** Single Gym  
**Future Direction:** Multi-Tenant SaaS

---

# 1. General Business Rules

1. Every gym must have its own gym information and configuration.
2. Every member must have a unique Member ID within their gym.
3. Every trainer must have a unique Trainer ID within their gym.
4. Every membership plan must belong to a gym.
5. Business records must be associated with the appropriate gym.
6. Only authenticated users can access protected application features.
7. Users can perform operations according to their assigned roles and permissions.
8. Important business operations must be validated on the backend.
9. Financial records must maintain accurate historical information.
10. Important records should not be permanently deleted when doing so would affect financial or historical records.

---

# 2. Member Management Rules

## 2.1 Member Registration

1. A member must have a full name.
2. A mobile number is required.
3. Member ID must be unique within a gym.
4. Email should be validated when provided.
5. Joining date should be recorded during registration.
6. Profile pictures must follow supported file types and size restrictions.
7. Member registration should validate duplicate records according to configured gym policies.

## 2.2 Member Status

A member can have two account statuses:

- Active.
- Inactive.

### Active Member
An active member is a registered member whose account is enabled.

### Inactive Member
An inactive member is a member whose account has been disabled.

Important:

Member account status and membership status are different.

For example:

A member can have:
- Member Status: Active.
- Membership Status: Expired.

## 2.3 Member Deactivation

1. Only authorized users can deactivate members.
2. Deactivating a member must not delete their historical records.
3. Deactivated members cannot receive new memberships or record attendance.
4. Existing payment and membership history must remain accessible.
5. Reactivating a member should restore their account access without modifying historical records.

---

# 3. Membership Management Rules

Membership Management is one of the most important parts of the application.

## 3.1 Membership Plan Rules

1. Every membership plan must have a name.
2. Every plan must have a duration.
3. Every plan must have a price.
4. Plans can be activated or deactivated.
5. Deactivated plans cannot be assigned to new memberships.
6. Existing memberships must retain their original plan information and pricing.
7. Updating a plan must not change the price or duration of previously purchased memberships.

## 3.2 Membership Assignment

1. A membership must belong to a registered member.
2. A membership must reference a membership plan.
3. Membership start and end dates must be recorded.
4. The membership price must be saved at the time of purchase.
5. Discounts, if applicable, must be recorded.
6. Final membership amount must be calculated correctly.
7. Membership records must maintain their own historical information.

## 3.3 Membership Activation

1. A membership becomes active according to its start date and activation rules.
2. A membership cannot be activated for an inactive member.
3. A membership should not allow attendance before its start date.
4. A membership should not allow attendance after its expiration date.
5. Membership status must be updated according to its validity period.

## 3.4 Membership Expiration

1. Every membership must have an expiration date.
2. A membership becomes expired after its end date.
3. Expired memberships cannot be used for attendance.
4. Expired memberships should appear in the expired membership list.
5. The system should identify upcoming membership expirations.
6. Membership expiration should not delete the membership record.
7. Expiration notifications should be triggered according to configured reminder schedules.

Date rule:

The membership end date is inclusive.

Example:

Start Date: 1 January  
End Date: 31 January

The membership remains valid throughout 31 January and expires from 1 February.

## 3.5 Membership Renewal

1. Only authorized users can renew memberships.
2. Renewal should create a new membership record or a linked renewal record.
3. Previous membership history must remain unchanged.
4. Renewal must maintain a relationship with the previous membership.
5. If renewed before expiration, the new membership should normally begin after the existing membership ends.
6. If renewed after expiration, the new membership should normally begin from the new agreed start date.
7. Authorized users should be able to override the proposed dates when required.
8. The new membership must have its own payment and financial records.

## 3.6 Membership Extension

1. Only authorized users can extend memberships.
2. An extension increases the membership validity period.
3. The previous expiration date must be preserved in membership history.
4. The new expiration date must be recorded.
5. The reason for extension should be recorded.
6. Extensions should be tracked for auditing purposes.

## 3.7 Membership Freezing

Membership freezing temporarily pauses a member's membership.

Rules:

1. Only authorized users can freeze a membership.
2. A freeze must have a start date.
3. A freeze must have an end date or an approved duration.
4. Freeze limits should be configurable by the gym.
5. The membership should not allow attendance during an active freeze period.
6. Membership validity should be extended according to the approved freeze duration.
7. Freeze and unfreeze activities must be recorded in membership history.
8. Overlapping freeze periods must not be allowed.
9. The system must validate freeze requests against membership validity and gym policies.

Example:

Original Expiration Date: 31 January  
Freeze Duration: 7 Days

New Expiration Date: 7 February.

## 3.8 Multiple Memberships

1. A member can have multiple historical memberships.
2. A member should not have overlapping active memberships unless the gym explicitly supports such a policy.
3. Future memberships may be scheduled.
4. Previous memberships must remain accessible.

---

# 4. Attendance Management Rules

## 4.1 Attendance Eligibility

A member can record attendance only when:

1. The member account is active.
2. The membership is active.
3. The current date falls within the membership validity period.
4. The membership is not frozen.
5. The membership has not been cancelled.

## 4.2 Manual Attendance

1. Only authorized users can mark manual attendance.
2. The member must exist in the system.
3. Membership validity must be checked before recording attendance.
4. Attendance date and check-in time must be recorded automatically.
5. The user recording attendance should be identified.
6. Invalid attendance attempts must not create successful attendance records.

## 4.3 QR Code Attendance

1. Every member should have a unique QR code.
2. QR codes must contain a secure identifier or token, not sensitive member information.
3. QR codes must be validated by the backend.
4. QR code scanning must verify member account status.
5. Membership validity must be checked before attendance is recorded.
6. Invalid or inactive QR codes must be rejected.
7. The system must prevent duplicate attendance records according to the gym's attendance policy.

## 4.4 Duplicate Attendance

1. A member should not be able to record multiple check-ins within the same attendance session.
2. Duplicate scans should display an appropriate message.
3. Authorized users may correct attendance mistakes.
4. Attendance corrections must be recorded for auditing.

## 4.5 Attendance History

1. Every successful attendance must be stored.
2. Attendance history must be associated with the member.
3. Attendance records must maintain date and time.
4. Attendance history should support date-based filtering.
5. Attendance records must not be permanently deleted without proper authorization and auditing.

---

# 5. Payment Management Rules

## 5.1 General Payment Rules

1. Every payment must have a unique Payment ID.
2. Every payment must be associated with a member.
3. Membership-related payments should reference the relevant membership.
4. Every payment must have an amount.
5. Every payment must have a payment date.
6. Every payment must have a payment method.
7. The user recording the payment must be identified.
8. Payment records must preserve historical information.
9. Payments must be recorded through validated backend operations.

## 5.2 Supported Payment Methods

Initially, the system will support:

- Cash.
- UPI.
- Card.

## 5.3 Full Payment

When the member pays the entire membership amount:

Membership Amount: ₹3,000  
Paid Amount: ₹3,000  
Outstanding: ₹0

Payment status: Paid.

## 5.4 Partial Payment

When the member pays only part of the membership amount:

Membership Amount: ₹3,000  
Paid Amount: ₹2,000  
Outstanding: ₹1,000

Payment status: Partially Paid.

The system must allow additional payments against the outstanding amount.

## 5.5 Outstanding Payment Rules

Outstanding Amount = Final Membership Amount - Total Successful Payments + Applicable Refund Adjustments.

Rules:

1. Outstanding balance must be calculated correctly.
2. Additional payments must reduce outstanding dues.
3. Payments exceeding the outstanding amount must be rejected unless an authorized advance-payment policy exists.
4. Outstanding dues must remain visible in the member's payment history.
5. Pending amounts must not be counted as collected revenue.

## 5.6 Payment Status

Possible payment-related statuses:

- Pending.
- Partially Paid.
- Paid.
- Failed.
- Partially Refunded.
- Refunded.

Payment status should reflect the actual payment transaction.

Membership payment status and individual transaction status must be maintained separately.

## 5.7 Refund Rules

1. Only authorized users can process refunds.
2. Refunds must reference the original payment.
3. Refund amounts cannot exceed the refundable amount.
4. Refund date must be recorded.
5. Refund reason should be recorded.
6. Refund records must remain available for auditing.
7. Refunds must update the relevant financial calculations.
8. Refunded payments must not be counted as fully collected revenue.

## 5.8 Payment Receipts

1. Every successful payment should generate a receipt.
2. Receipt numbers must be unique.
3. Receipts should contain member and gym information.
4. Receipts should contain payment amount and method.
5. Receipts should identify the relevant membership when applicable.
6. Receipts should be accessible through payment history.

---

# 6. Financial Calculation Rules

The system must distinguish between different financial values.

## 6.1 Membership Revenue

Represents the value of memberships sold or recognized according to the gym's selected reporting policy.

## 6.2 Payment Collection

Represents the actual successful payments received during a particular period.

## 6.3 Outstanding Dues

Represents the amount members still owe the gym.

## 6.4 Refunds

Represents money returned to members.

## 6.5 Expenses

Represents money spent on gym operations.

## 6.6 Estimated Operating Profit

Estimated Operating Profit = Net Recognized Revenue - Recorded Expenses.

The reporting policy for revenue recognition should be documented separately from cash collection.

The dashboard must not treat membership sales, collections and outstanding dues as the same value.

---

# 7. Trainer Management Rules

1. Every trainer must have a unique Trainer ID.
2. Trainer information must be stored independently from member information.
3. Only authorized users can add or update trainer records.
4. Trainers can be activated or deactivated.
5. Deactivating a trainer must not delete historical records.
6. Trainers can be assigned to multiple members.
7. Member-trainer assignments must maintain their history.
8. Trainer attendance must record date and time.
9. Salary information must only be accessible to authorized users.
10. Trainer salary payments should be recorded as gym expenses when paid.

---

# 8. Expense Management Rules

## 8.1 Expense Creation

1. Every expense must have a unique Expense ID.
2. Every expense must have a category.
3. Every expense must have an amount.
4. Every expense must have an expense date.
5. The user recording the expense must be identified.
6. Expense descriptions should be supported.
7. Attachments may be added when applicable.

## 8.2 Expense Categories

Initial categories include:

- Rent.
- Electricity.
- Trainer Salaries.
- Equipment.
- Maintenance.
- Marketing.
- Other Expenses.

## 8.3 Expense Updates

1. Authorized users can update expense information.
2. Expense modifications should be recorded for auditing.
3. Financial history must be preserved.
4. Incorrect expenses should be voided rather than silently removed.

## 8.4 Expense Calculations

The system should calculate:

- Daily Expenses.
- Monthly Expenses.
- Category-Wise Expenses.
- Total Expenses.

Expenses should be calculated using the expense date.

---

# 9. Notification and Automation Rules

## 9.1 General Rules

1. Notifications should be triggered by relevant business events.
2. Notifications should use approved templates.
3. Notification delivery attempts must be recorded.
4. Failed notifications should be logged.
5. Duplicate notifications should be prevented.
6. Notification history should be accessible to authorized users.

## 9.2 Membership Notifications

The system should support:

- Welcome Message.
- Membership Expiration Reminder.
- Membership Expired Notification.

Expiration reminders should follow configurable schedules.

Example:
- 7 days before expiration.
- 3 days before expiration.
- 1 day before expiration.

## 9.3 Payment Notifications

The system should support:

- Payment Confirmation.
- Payment Receipt.
- Outstanding Payment Reminder.

Payment reminders should not be sent when the outstanding amount is zero.

## 9.4 Birthday Notifications

1. The system should identify members whose birthdays occur on the current date.
2. Birthday notifications should be sent according to gym configuration.
3. Duplicate birthday messages should be prevented.

## 9.5 Notification Channels

Initially:

- Email.
- WhatsApp Business integration.

The system should maintain separate delivery statuses for different notification channels.

---

# 10. Reports and Analytics Rules

## 10.1 Member Reports

The system should calculate:

- Total Members.
- Active Members.
- Inactive Members.
- Members with Active Memberships.
- Members with Expired Memberships.

Member account status and membership status must not be confused.

## 10.2 Membership Reports

The system should provide:

- Active Memberships.
- Expired Memberships.
- Upcoming Expirations.
- Membership Renewals.
- Plan-Wise Membership Statistics.

## 10.3 Attendance Reports

The system should calculate:

- Daily Attendance.
- Monthly Attendance.
- Member Attendance History.
- Attendance Trends.

## 10.4 Payment Reports

The system should provide:

- Daily Payment Collections.
- Monthly Payment Collections.
- Outstanding Dues.
- Payment Method Statistics.
- Refund Reports.

Only successful payments should contribute to actual collection figures.

## 10.5 Expense Reports

The system should provide:

- Daily Expenses.
- Monthly Expenses.
- Category-Wise Expenses.

## 10.6 Dashboard Calculations

Dashboard statistics must use consistent business definitions.

Examples:

- Total Members: Count of registered members, including inactive accounts unless a specific filter is applied.
- Active Members: Count of members with active account status.
- Expired Members: Count of members whose relevant memberships have expired.
- Today's Attendance: Number of successful attendance check-ins today.
- Today's Collection: Total successful payments received today minus refunds processed today.
- Pending Payments: Total outstanding member dues.
- Monthly Revenue: Calculated according to the configured revenue reporting policy.

---

# 11. Authentication and Authorization Rules

1. Users must authenticate before accessing protected resources.
2. Passwords must never be stored in plain text.
3. Every protected backend operation must verify permissions.
4. Frontend permission checks must not replace backend authorization.
5. The owner should have full control over gym operations.
6. Receptionists should only access permitted operational features.
7. Trainers should only access information permitted by their assigned permissions.
8. Sensitive financial information should have restricted access.
9. Important administrative actions should be recorded.

---

# 12. Data Integrity and Audit Rules

1. Important business records should not be permanently deleted.
2. Financial transactions must maintain historical information.
3. Membership changes should be recorded.
4. Attendance corrections should be auditable.
5. Payment modifications and refunds should be tracked.
6. Important operations involving multiple database records should use database transactions.
7. Every business record should maintain creation and modification timestamps.
8. Records should be associated with the correct gym.
9. Historical membership pricing must not change when a membership plan is updated.
10. Financial calculations should use decimal-safe numeric types rather than floating-point arithmetic.

---

# 13. Date and Time Rules

1. The application should use the gym's configured timezone.
2. Attendance timestamps should be stored consistently.
3. Reports should use the gym's local date boundaries.
4. Membership validity should be calculated using calendar dates.
5. Membership end dates should be inclusive.
6. Scheduled notifications should follow the gym's local timezone.
7. Date calculations must handle month lengths and leap years correctly.

---

# 14. Future Business Rules

The following rules will be defined when the corresponding features are introduced:

- Workout Plan Assignment.
- Diet Plan Management.
- Biometric Attendance.
- Online Payment Gateway.
- Multi-Gym Management.
- SaaS Subscription Billing.
- Multi-Tenant Access Control.
- Multiple Gym Branches.

---

# 15. Document Status

**Document:** Business Rules  
**Version:** 1.0  
**Status:** Initial Business Rules Defined  
**Next Document:** rbac.md