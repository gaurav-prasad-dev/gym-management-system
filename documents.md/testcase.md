# Test Cases – Gym Management System

## 1. Purpose

This document contains detailed test cases for verifying the functionality, business logic, security, and reliability of the Gym Management System.

Each test case defines:
- Test Case ID.
- Module.
- Test Scenario.
- Preconditions.
- Test Steps.
- Test Data.
- Expected Result.
- Priority.
- Execution Status.

This document will be updated as new features are implemented.

---

## 2. Test Case Status

Use the following statuses:

| Status | Meaning |
|---|---|
| Not Run | Test has not been executed |
| Pass | Actual result matches expected result |
| Fail | Actual result does not match expected result |
| Blocked | Testing cannot continue because of another issue |
| Retest | Bug has been fixed and needs verification |

---

# 3. Authentication Test Cases

### TC-AUTH-001: Login with Valid Credentials

**Priority:** Critical

**Preconditions:**
- Staff account exists.
- Account is active.

**Steps:**
1. Open login page.
2. Enter valid email.
3. Enter valid password.
4. Click Login.

**Expected Result:**
- User should log in successfully.
- User should be redirected to the dashboard.
- Authentication session should be established securely.

**Status:** Not Run

### TC-AUTH-002: Login with Incorrect Password

**Priority:** Critical

**Steps:**
1. Open login page.
2. Enter valid email.
3. Enter incorrect password.
4. Click Login.

**Expected Result:**
- Login should fail.
- A meaningful error message should appear.
- No authenticated session should be created.

**Status:** Not Run

### TC-AUTH-003: Login with Non-Existing Email

**Priority:** High

**Steps:**
1. Enter an email that does not exist.
2. Enter any password.
3. Click Login.

**Expected Result:**
- Login should fail.
- No authenticated session should be created.

**Status:** Not Run

### TC-AUTH-004: Login with Inactive Staff Account

**Priority:** Critical

**Preconditions:**
- Staff account exists.
- Staff account is inactive.

**Steps:**
1. Enter valid credentials.
2. Click Login.

**Expected Result:**
- Login should be rejected.
- User should not access protected pages.

**Status:** Not Run

### TC-AUTH-005: Access Protected API Without Authentication

**Priority:** Critical

**Steps:**
1. Open Postman.
2. Send a request to a protected API.
3. Do not provide authentication credentials.

**Expected Result:**
- API should reject the request.
- HTTP 401 Unauthorized should be returned.

**Status:** Not Run

### TC-AUTH-006: Logout

**Priority:** High

**Preconditions:**
- User is logged in.

**Steps:**
1. Click Logout.
2. Try accessing a protected page.
3. Try using the old refresh session.

**Expected Result:**
- User should be logged out.
- Refresh session should be invalidated.
- Protected pages should no longer be accessible.

**Status:** Not Run

### TC-AUTH-007: Refresh Access Token

**Priority:** Critical

**Preconditions:**
- Valid refresh session exists.
- Access token has expired.

**Steps:**
1. Send a request requiring authentication.
2. Trigger the refresh process.

**Expected Result:**
- A valid session should receive a new access token.
- Invalid or revoked refresh sessions should be rejected.
- Refresh token rotation should work if implemented.

**Status:** Not Run

---

# 4. RBAC Test Cases

### TC-RBAC-001: Create Custom Role

**Priority:** Critical

**Preconditions:**
- Owner is logged in.

**Steps:**
1. Open Roles & Permissions.
2. Click Create Role.
3. Enter role name.
4. Select permissions.
5. Save.

**Expected Result:**
- Role should be created.
- Selected permissions should be saved.
- Role should appear in the role list.

**Status:** Not Run

### TC-RBAC-002: Assign Role to Staff

**Priority:** Critical

**Preconditions:**
- Staff account exists.
- Role exists.

**Steps:**
1. Open Staff Management.
2. Select a staff member.
3. Assign a role.
4. Save changes.

**Expected Result:**
- Role should be assigned successfully.
- Staff permissions should reflect the assigned role.

**Status:** Not Run

### TC-RBAC-003: Access Permitted Module

**Priority:** Critical

**Preconditions:**
- Staff has `members.view` permission.

**Steps:**
1. Login as that staff member.
2. Open Members.

**Expected Result:**
- Members page should be accessible.
- Member data should be displayed according to applicable restrictions.

**Status:** Not Run

### TC-RBAC-004: Access Restricted Module

**Priority:** Critical

**Preconditions:**
- Staff does not have `payments.refund` permission.

**Steps:**
1. Login as that staff member.
2. Try accessing the refund action.
3. Send a refund API request directly.

**Expected Result:**
- Refund action should not be available in the UI.
- Backend should reject the API request with HTTP 403 Forbidden.

**Status:** Not Run

### TC-RBAC-005: Update Role Permissions

**Priority:** High

**Steps:**
1. Open Roles & Permissions.
2. Select an existing role.
3. Add or remove permissions.
4. Save changes.
5. Login as a user assigned that role.

**Expected Result:**
- Role permissions should be updated.
- Effective permissions should reflect the updated role.

**Status:** Not Run

### TC-RBAC-006: Delete Assigned Role

**Priority:** High

**Preconditions:**
- Role is assigned to at least one staff member.

**Steps:**
1. Open Roles & Permissions.
2. Attempt to delete the assigned role.

**Expected Result:**
- Deletion should be rejected.
- User should receive a meaningful message.

**Status:** Not Run

### TC-RBAC-007: Prevent Deletion of Protected Owner Role

**Priority:** Critical

**Steps:**
1. Open Roles & Permissions.
2. Attempt to delete the protected Owner role.

**Expected Result:**
- Owner role deletion should be rejected.

**Status:** Not Run

### TC-RBAC-008: Combine Multiple Role Permissions

**Priority:** High

**Preconditions:**
- Staff has two active roles.
- First role has `members.view`.
- Second role has `payments.view`.

**Steps:**
1. Login as the staff member.
2. Open Members.
3. Open Payments.

**Expected Result:**
- Staff should have both permissions.
- Effective permissions should be the union of permissions from active assigned roles.

**Status:** Not Run

---

# 5. Member Management Test Cases

### TC-MEM-001: Create Member with Valid Information

**Priority:** Critical

**Steps:**
1. Open Members.
2. Click Add Member.
3. Enter required information.
4. Submit the form.

**Test Data:**
- Name: Rahul Sharma
- Mobile: 9876543210
- Email: rahul.test@example.com
- Gender: Male

**Expected Result:**
- Member should be created.
- Unique Member ID should be generated.
- Member should appear in the member list.

**Status:** Not Run

### TC-MEM-002: Create Member Without Required Name

**Priority:** High

**Steps:**
1. Open Add Member.
2. Leave the name field empty.
3. Submit the form.

**Expected Result:**
- Form submission should fail.
- Validation message should appear.

**Status:** Not Run

### TC-MEM-003: Create Member with Invalid Email

**Priority:** Medium

**Steps:**
1. Enter an invalid email.
2. Submit the form.

**Expected Result:**
- Invalid email should be rejected.

**Status:** Not Run

### TC-MEM-004: Create Duplicate Member

**Priority:** High

**Preconditions:**
- A member with the same mobile number already exists.

**Steps:**
1. Open Add Member.
2. Enter an already registered mobile number.
3. Submit the form.

**Expected Result:**
- Duplicate member should be rejected if the gym's configured uniqueness policy requires unique mobile numbers.
- A meaningful error message should appear.

**Status:** Not Run

### TC-MEM-005: Update Member Information

**Priority:** High

**Steps:**
1. Open a member profile.
2. Click Edit.
3. Update mobile number or address.
4. Save changes.

**Expected Result:**
- Updated information should be saved.
- Updated details should appear on the profile.

**Status:** Not Run

### TC-MEM-006: Search Member

**Priority:** High

**Steps:**
1. Open Members.
2. Search using member name, ID, or mobile number.

**Expected Result:**
- Matching members should be displayed.
- Unrelated members should not appear.

**Status:** Not Run

### TC-MEM-007: Deactivate Member

**Priority:** High

**Steps:**
1. Open member profile.
2. Click Deactivate.
3. Confirm the action.

**Expected Result:**
- Member account should become inactive.
- Membership history should remain available.
- Attendance should be rejected according to business rules.

**Status:** Not Run

### TC-MEM-008: View Member History

**Priority:** Medium

**Steps:**
1. Open member profile.
2. Navigate through membership, payment, and attendance history.

**Expected Result:**
- Correct historical records should be displayed.
- Records should belong to the selected member.

**Status:** Not Run

---

# 6. Membership Management Test Cases

### TC-MSHIP-001: Create Membership Plan

**Priority:** Critical

**Steps:**
1. Open Membership Plans.
2. Click Add Plan.
3. Enter plan name, duration, and price.
4. Save.

**Expected Result:**
- Plan should be created.
- Plan should appear in the plans list.

**Status:** Not Run

### TC-MSHIP-002: Create Plan with Invalid Price

**Priority:** High

**Steps:**
1. Open Add Plan.
2. Enter a negative price.
3. Submit the form.

**Expected Result:**
- Negative price should be rejected.

**Status:** Not Run

### TC-MSHIP-003: Assign Membership to Member

**Priority:** Critical

**Preconditions:**
- Member exists.
- Active membership plan exists.

**Steps:**
1. Open member profile.
2. Click Assign Membership.
3. Select plan.
4. Enter start date.
5. Confirm assignment.

**Expected Result:**
- New membership record should be created.
- Plan information and price snapshot should be stored.
- Start and end dates should be calculated correctly.

**Status:** Not Run

### TC-MSHIP-004: Prevent Invalid Membership Dates

**Priority:** High

**Steps:**
1. Open membership assignment.
2. Enter an invalid date range.
3. Submit.

**Expected Result:**
- Invalid date range should be rejected.

**Status:** Not Run

### TC-MSHIP-005: Renew Membership

**Priority:** Critical

**Preconditions:**
- Member has an existing membership.

**Steps:**
1. Open member profile.
2. Click Renew Membership.
3. Select a plan.
4. Confirm renewal.

**Expected Result:**
- A new membership record should be created.
- Previous membership history should remain unchanged.
- New membership dates should follow the renewal policy.

**Status:** Not Run

### TC-MSHIP-006: Freeze Membership

**Priority:** High

**Steps:**
1. Open active membership.
2. Click Freeze.
3. Enter freeze start and end dates.
4. Confirm.

**Expected Result:**
- Freeze period should be recorded.
- Membership status and dates should follow the freeze business rules.

**Status:** Not Run

### TC-MSHIP-007: Unfreeze Membership

**Priority:** High

**Preconditions:**
- Membership is frozen.

**Steps:**
1. Open frozen membership.
2. Click Unfreeze.
3. Confirm.

**Expected Result:**
- Membership should be unfrozen according to business rules.
- Freeze history should remain available.

**Status:** Not Run

### TC-MSHIP-008: Expired Membership

**Priority:** Critical

**Preconditions:**
- Membership end date is in the past.

**Steps:**
1. Open member profile.
2. Check membership status.
3. Attempt attendance check-in.

**Expected Result:**
- Membership should be shown as expired.
- Attendance should be rejected.

**Status:** Not Run

### TC-MSHIP-009: Update Plan Price

**Priority:** High

**Preconditions:**
- Existing members have purchased the plan.

**Steps:**
1. Open Membership Plans.
2. Change the plan price.
3. Save.
4. Open an older membership record.

**Expected Result:**
- New plan price should be updated.
- Previously purchased membership price snapshots should remain unchanged.

**Status:** Not Run

---

# 7. Attendance Test Cases

### TC-ATT-001: Manual Check-in for Active Member

**Priority:** Critical

**Preconditions:**
- Member is active.
- Membership is active.

**Steps:**
1. Open Attendance.
2. Search member.
3. Click Check-in.

**Expected Result:**
- Attendance should be recorded successfully.
- Check-in time should be stored.

**Status:** Not Run

### TC-ATT-002: Check-in for Expired Membership

**Priority:** Critical

**Preconditions:**
- Member has expired membership.

**Steps:**
1. Search member.
2. Attempt check-in.

**Expected Result:**
- Check-in should be rejected.
- Reason should be displayed.

**Status:** Not Run

### TC-ATT-003: Check-in for Inactive Member

**Priority:** Critical

**Preconditions:**
- Member account is inactive.

**Steps:**
1. Search member.
2. Attempt check-in.

**Expected Result:**
- Check-in should be rejected.

**Status:** Not Run

### TC-ATT-004: Duplicate Check-in

**Priority:** High

**Preconditions:**
- Member has already checked in for the permitted attendance period.

**Steps:**
1. Perform check-in.
2. Attempt another check-in.

**Expected Result:**
- Duplicate attendance should be rejected according to the attendance policy.

**Status:** Not Run

### TC-ATT-005: QR Check-in

**Priority:** Critical

**Preconditions:**
- Member has a valid QR token.
- Member is eligible for attendance.

**Steps:**
1. Open QR scanner.
2. Scan member QR code.
3. Submit the scan.

**Expected Result:**
- QR token should be validated.
- Attendance should be recorded.

**Status:** Not Run

### TC-ATT-006: Invalid QR Token

**Priority:** High

**Steps:**
1. Scan an invalid QR code.

**Expected Result:**
- Check-in should be rejected.
- No attendance record should be created.

**Status:** Not Run

### TC-ATT-007: Check-out

**Priority:** Medium

**Preconditions:**
- Member has an open attendance record.

**Steps:**
1. Open attendance record.
2. Click Check-out.

**Expected Result:**
- Check-out time should be recorded.
- Existing check-in data should remain unchanged.

**Status:** Not Run

---

# 8. Payment Management Test Cases

### TC-PAY-001: Collect Full Payment

**Priority:** Critical

**Preconditions:**
- Member has an outstanding membership amount.

**Steps:**
1. Open Collect Payment.
2. Select member and membership.
3. Enter the full outstanding amount.
4. Select payment method.
5. Submit.

**Expected Result:**
- Successful payment should be recorded.
- Receipt number should be generated.
- Outstanding dues should become zero.

**Status:** Not Run

### TC-PAY-002: Collect Partial Payment

**Priority:** Critical

**Steps:**
1. Open Collect Payment.
2. Enter an amount smaller than the outstanding amount.
3. Submit.

**Expected Result:**
- Payment should be recorded.
- Remaining dues should be calculated correctly.

**Status:** Not Run

### TC-PAY-003: Payment Greater Than Outstanding Amount

**Priority:** High

**Steps:**
1. Open Collect Payment.
2. Enter an amount greater than the allowed outstanding amount.
3. Submit.

**Expected Result:**
- Payment should be rejected unless the system explicitly supports advance payments or credits.
- No incorrect balance should be created.

**Status:** Not Run

### TC-PAY-004: Failed Payment

**Priority:** Critical

**Steps:**
1. Simulate a failed payment.
2. Check payment history.
3. Check collection report.

**Expected Result:**
- Payment should be marked failed.
- Failed payment should not count as successful collection.
- Outstanding dues should remain unchanged.

**Status:** Not Run

### TC-PAY-005: Generate Payment Receipt

**Priority:** High

**Preconditions:**
- Successful payment exists.

**Steps:**
1. Open payment details.
2. Click Generate Receipt.

**Expected Result:**
- Receipt should contain correct member and payment details.
- Receipt number should be unique.

**Status:** Not Run

### TC-PAY-006: Refund Payment

**Priority:** Critical

**Preconditions:**
- Successful payment exists.
- Staff has refund permission.

**Steps:**
1. Open payment details.
2. Click Refund.
3. Enter refund amount and reason.
4. Confirm refund.

**Expected Result:**
- Refund should be recorded separately.
- Refund should be linked to the original payment.
- Net collection should be calculated correctly.
- Outstanding dues should follow the configured refund policy.

**Status:** Not Run

### TC-PAY-007: Unauthorized Refund

**Priority:** Critical

**Preconditions:**
- Staff does not have `payments.refund` permission.

**Steps:**
1. Login as staff.
2. Send refund API request directly.

**Expected Result:**
- Backend should reject the request with HTTP 403 Forbidden.

**Status:** Not Run

---

# 9. Trainer Management Test Cases

### TC-TRN-001: Create Trainer

**Priority:** Medium

**Steps:**
1. Open Trainers.
2. Click Add Trainer.
3. Enter trainer details.
4. Save.

**Expected Result:**
- Trainer record should be created successfully.

**Status:** Not Run

### TC-TRN-002: Assign Members to Trainer

**Priority:** Medium

**Preconditions:**
- Trainer exists.
- Members exist.

**Steps:**
1. Open trainer profile.
2. Click Assign Members.
3. Select members.
4. Save.

**Expected Result:**
- Selected members should be assigned to the trainer.
- Assignment history should be stored.

**Status:** Not Run

### TC-TRN-003: Trainer Access Restriction

**Priority:** High

**Preconditions:**
- Trainer has access only to assigned members.

**Steps:**
1. Login as trainer.
2. Open Members.
3. Try accessing an unassigned member through the API.

**Expected Result:**
- Trainer should only access permitted member records.
- Backend should reject unauthorized record access.

**Status:** Not Run

### TC-TRN-004: Record Trainer Attendance

**Priority:** Medium

**Preconditions:**
- Trainer exists and is active.

**Steps:**
1. Open Trainer Attendance.
2. Mark attendance.

**Expected Result:**
- Trainer attendance should be recorded successfully.

**Status:** Not Run

---

# 10. Expense Management Test Cases

### TC-EXP-001: Create Expense

**Priority:** High

**Steps:**
1. Open Expenses.
2. Click Add Expense.
3. Select category.
4. Enter amount and date.
5. Save.

**Expected Result:**
- Expense should be created successfully.

**Status:** Not Run

### TC-EXP-002: Create Expense with Negative Amount

**Priority:** High

**Steps:**
1. Open Add Expense.
2. Enter a negative amount.
3. Submit.

**Expected Result:**
- Expense should be rejected.

**Status:** Not Run

### TC-EXP-003: Update Expense

**Priority:** Medium

**Steps:**
1. Open an expense.
2. Update its description or amount.
3. Save.

**Expected Result:**
- Expense should be updated according to applicable business rules.
- Audit history should be recorded.

**Status:** Not Run

### TC-EXP-004: Filter Expenses by Date

**Priority:** Medium

**Steps:**
1. Open Expenses.
2. Select a date range.
3. Apply filter.

**Expected Result:**
- Only expenses within the selected date range should appear.

**Status:** Not Run

---

# 11. Notifications Test Cases

### TC-NOT-001: Membership Expiry Notification

**Priority:** Medium

**Preconditions:**
- Membership is approaching its expiry date.

**Steps:**
1. Run expiry notification processing.
2. Check notification records.

**Expected Result:**
- Correct notification should be generated.
- Duplicate notifications should be prevented according to the notification policy.

**Status:** Not Run

### TC-NOT-002: Payment Confirmation Notification

**Priority:** Medium

**Preconditions:**
- Successful payment exists.

**Steps:**
1. Complete payment.
2. Trigger notification processing.

**Expected Result:**
- Payment confirmation notification should be generated.

**Status:** Not Run

### TC-NOT-003: Notification Provider Failure

**Priority:** High

**Steps:**
1. Simulate email or WhatsApp provider failure.
2. Complete a member registration or payment operation.

**Expected Result:**
- Main business operation should remain successful.
- Notification failure should be recorded.
- Retry should follow the configured retry policy.

**Status:** Not Run

---

# 12. Dashboard and Reports Test Cases

### TC-DASH-001: Dashboard Statistics

**Priority:** Critical

**Preconditions:**
- Test members, memberships, attendance, and payments exist.

**Steps:**
1. Login as an authorized user.
2. Open Dashboard.

**Expected Result:**
- Total members should be correct.
- Active and expired members should be correct.
- Today's attendance should be correct.
- Today's collection should be correct.
- Pending dues should be correct.

**Status:** Not Run

### TC-DASH-002: Dashboard Date Handling

**Priority:** High

**Steps:**
1. Create attendance and payment records near midnight.
2. View dashboard using the gym's configured timezone.

**Expected Result:**
- Records should appear under the correct local date.
- UTC storage should not cause incorrect daily statistics.

**Status:** Not Run

### TC-REPORT-001: Monthly Revenue Report

**Priority:** Critical

**Steps:**
1. Open Reports.
2. Select a month.
3. Generate report.

**Expected Result:**
- Successful collections should be calculated correctly.
- Refunds should be shown separately.
- Net collections should be correct.

**Status:** Not Run

### TC-REPORT-002: Expense Report

**Priority:** High

**Steps:**
1. Open Expense Report.
2. Select a date range.
3. Generate report.

**Expected Result:**
- Expenses should be grouped and calculated correctly.
- Pending expenses should not be included in paid expenses.

**Status:** Not Run

### TC-REPORT-003: Export Report

**Priority:** Medium

**Preconditions:**
- User has report export permission.

**Steps:**
1. Open a report.
2. Click Export.

**Expected Result:**
- Report should be downloaded in the supported format.
- Exported information should match the selected filters.

**Status:** Not Run

---

# 13. Security Test Cases

### TC-SEC-001: Unauthorized API Access

**Priority:** Critical

**Steps:**
1. Login as a user without access to a module.
2. Send a direct API request to that module.

**Expected Result:**
- Backend should reject the request.

**Status:** Not Run

### TC-SEC-002: Cross-Gym Data Access

**Priority:** Critical — Future SaaS Requirement

**Preconditions:**
- Two separate gyms exist.
- Each gym has its own users and records.

**Steps:**
1. Login as a user from Gym A.
2. Attempt to access a member belonging to Gym B.
3. Attempt to access Gym B's payment records.

**Expected Result:**
- Access should be rejected.
- No data belonging to Gym B should be exposed.

**Status:** Not Run

### TC-SEC-003: Invalid File Upload

**Priority:** High

**Steps:**
1. Open member profile upload.
2. Upload an unsupported file type.
3. Submit.

**Expected Result:**
- Unsupported file should be rejected.
- File size restrictions should be enforced.

**Status:** Not Run

### TC-SEC-004: Sensitive Data Exposure

**Priority:** Critical

**Steps:**
1. Login.
2. Inspect authentication and staff API responses.
3. Inspect application logs.

**Expected Result:**
- Password hashes, refresh tokens, and other sensitive credentials should not be exposed.

**Status:** Not Run

---

# 14. Database and Reliability Test Cases

### TC-DB-001: Duplicate Member ID

**Priority:** High

**Steps:**
1. Attempt to create two members with the same gym-specific member ID.

**Expected Result:**
- Database uniqueness constraint should prevent duplicates.

**Status:** Not Run

### TC-DB-002: Invalid Foreign Key

**Priority:** High

**Steps:**
1. Attempt to create a membership linked to a non-existing member.

**Expected Result:**
- Database should reject the invalid relationship.

**Status:** Not Run

### TC-DB-003: Transaction Rollback

**Priority:** Critical

**Steps:**
1. Start a payment operation.
2. Simulate a failure during an essential database operation.
3. Inspect database records.

**Expected Result:**
- Related database changes should roll back.
- No incomplete payment operation should remain.

**Status:** Not Run

### TC-DB-004: Database Migration

**Priority:** High

**Steps:**
1. Create a clean test database.
2. Run all migrations.
3. Verify tables, constraints, and indexes.

**Expected Result:**
- Migrations should complete successfully.
- Expected database structure should exist.

**Status:** Not Run

---

# 15. Performance Test Cases

### TC-PERF-001: Member List with Large Dataset

**Priority:** Medium

**Preconditions:**
- Database contains a large number of test members.

**Steps:**
1. Open Members.
2. Load the first page.
3. Navigate through multiple pages.

**Expected Result:**
- Pagination should work.
- API response time should remain within the agreed performance target.

**Status:** Not Run

### TC-PERF-002: Member Search with Large Dataset

**Priority:** Medium

**Steps:**
1. Search for a member in a large dataset.
2. Measure response time.

**Expected Result:**
- Relevant results should be returned efficiently.

**Status:** Not Run

### TC-PERF-003: Dashboard with Large Dataset

**Priority:** Medium

**Steps:**
1. Populate test data.
2. Open Dashboard.
3. Measure API response time.

**Expected Result:**
- Dashboard statistics should remain accurate.
- Response time should remain within the agreed target.

**Status:** Not Run

---

# 16. End-to-End Test Cases

### TC-E2E-001: Complete New Member Journey

**Priority:** Critical

**Steps:**
1. Login as receptionist.
2. Create a new member.
3. Assign a membership.
4. Collect partial payment.
5. Open member profile.
6. Verify membership details.
7. Verify payment history.
8. Mark attendance.

**Expected Result:**
- Member should be created.
- Membership should be assigned.
- Payment should be recorded.
- Outstanding dues should be correct.
- Attendance should be recorded successfully.

**Status:** Not Run

### TC-E2E-002: Complete Membership Renewal Journey

**Priority:** High

**Steps:**
1. Open an existing member.
2. View expired membership.
3. Renew membership.
4. Collect payment.
5. Verify new membership record.
6. Verify previous membership history.

**Expected Result:**
- New membership should be created.
- Previous history should remain unchanged.
- Payment should be recorded correctly.

**Status:** Not Run

### TC-E2E-003: Staff Permission Journey

**Priority:** Critical

**Steps:**
1. Login as owner.
2. Create a custom role.
3. Select permissions.
4. Create a staff account.
5. Assign the role.
6. Login as the new staff member.
7. Test permitted actions.
8. Test restricted actions through the API.

**Expected Result:**
- Role assignment should work.
- Permitted actions should succeed.
- Restricted actions should be rejected by the backend.

**Status:** Not Run

---

# 17. Test Execution Summary

Maintain this summary as testing progresses.

| Module | Total Test Cases | Passed | Failed | Blocked | Not Run |
|---|---:|---:|---:|---:|---:|
| Authentication | 7 | 0 | 0 | 0 | 7 |
| RBAC | 8 | 0 | 0 | 0 | 8 |
| Members | 8 | 0 | 0 | 0 | 8 |
| Memberships | 9 | 0 | 0 | 0 | 9 |
| Attendance | 7 | 0 | 0 | 0 | 7 |
| Payments | 7 | 0 | 0 | 0 | 7 |
| Trainers | 4 | 0 | 0 | 0 | 4 |
| Expenses | 4 | 0 | 0 | 0 | 4 |
| Notifications | 3 | 0 | 0 | 0 | 3 |
| Dashboard & Reports | 5 | 0 | 0 | 0 | 5 |
| Security | 4 | 0 | 0 | 0 | 4 |
| Database | 4 | 0 | 0 | 0 | 4 |
| Performance | 3 | 0 | 0 | 0 | 3 |
| End-to-End | 3 | 0 | 0 | 0 | 3 |
| **Total** | **76** | **0** | **0** | **0** | **76** |

---

# 18. Final Testing Rules

1. Every critical business feature must have test cases.
2. Test both successful and unsuccessful scenarios.
3. Test backend authorization independently of frontend behavior.
4. Test financial calculations carefully.
5. Test membership date and expiry logic.
6. Test database transactions for important operations.
7. Never use production data for automated testing.
8. Fix critical and high-severity bugs before deployment.
9. Update this document whenever new features are introduced.
10. Record actual test results instead of marking tests as passed without execution.

**A feature should be considered complete only after its relevant test cases pass.**