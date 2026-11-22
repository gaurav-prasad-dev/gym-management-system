# UI/UX Guidelines – Gym Management System

## 1. Purpose

This document defines the design principles, layout, components, and user experience standards for the Gym Management System.

The goal is to build a modern, clean, professional, and easy-to-use application that gym owners and staff can operate without technical knowledge.

The UI should be:
- Simple and intuitive.
- Modern and professional.
- Consistent across all modules.
- Responsive across desktop, tablet, and mobile.
- Easy to maintain and extend.
- Focused on functionality rather than unnecessary animations.

---

## 2. Design Philosophy

Follow these principles throughout the application:

### 2.1 Simplicity
- Avoid unnecessary UI elements.
- Keep pages clean and organized.
- Show important information first.
- Avoid overwhelming users with too many options.

### 2.2 Consistency
- Use the same button styles across modules.
- Maintain consistent spacing, typography, and colors.
- Reuse components wherever possible.
- Keep forms, tables, dialogs, and cards visually consistent.

### 2.3 User-Friendly Experience
- Make important actions easy to find.
- Display meaningful success and error messages.
- Confirm destructive actions.
- Provide loading states and empty states.
- Use clear labels instead of technical terminology.

### 2.4 Scalability
The UI architecture should support adding new modules in the future without redesigning the entire application.

---

## 3. Design Direction

### Overall Style

Use a modern SaaS dashboard design.

Reference characteristics:
- Clean dashboard layout.
- Minimal visual clutter.
- Rounded cards and buttons.
- Clear typography.
- Subtle borders and shadows.
- Professional color palette.
- Consistent icons.
- Well-organized data tables.

Avoid:
- Excessive gradients.
- Too many colors.
- Unnecessary animations.
- Overly rounded elements.
- Large decorative sections that waste space.

---

## 4. Color System

Use a centralized color system instead of hardcoding colors in individual components.

Suggested color palette:

| Purpose | Color | Hex Code |
|---|---|---|
| Primary | Indigo | #4F46E5 |
| Primary Hover | Dark Indigo | #4338CA |
| Secondary | Slate | #64748B |
| Background | Light Gray | #F8FAFC |
| Surface | White | #FFFFFF |
| Main Text | Dark Slate | #0F172A |
| Secondary Text | Gray | #64748B |
| Border | Light Slate | #E2E8F0 |
| Success | Green | #16A34A |
| Warning | Amber | #D97706 |
| Danger | Red | #DC2626 |
| Info | Blue | #2563EB |

### Color Usage

- Primary: Main actions, active navigation, important buttons.
- Success: Successful payments, active memberships, completed actions.
- Warning: Memberships expiring soon, pending payments.
- Danger: Expired memberships, failed payments, destructive actions.
- Info: Informational messages and general notifications.

Do not use colors as the only way to communicate status. Always include text labels.

---

## 5. Typography

Use a readable and consistent font throughout the application.

Recommended font:
- Inter

Typography hierarchy:

| Element | Suggested Size | Weight |
|---|---|---|
| Page Heading | 24–28px | 600 |
| Section Heading | 18–20px | 600 |
| Card Heading | 14–16px | 500 |
| Body Text | 14px | 400 |
| Table Text | 13–14px | 400 |
| Labels | 13–14px | 500 |
| Helper Text | 12px | 400 |

Maintain proper line height and avoid using too many font sizes.

---

## 6. Application Layout

Use a standard dashboard layout.

### 6.1 Sidebar

The sidebar should contain the main navigation.

Suggested navigation:

**Main**
- Dashboard

**Management**
- Members
- Memberships
- Attendance
- Payments

**Operations**
- Trainers
- Expenses
- Notifications

**Analytics**
- Reports

**Settings**
- Gym Settings
- Staff Management
- Roles & Permissions
- Audit Logs

### Sidebar Behavior

- Fixed or collapsible sidebar on desktop.
- Active page should be visually highlighted.
- Icons should be used with navigation labels.
- Group related navigation items.
- Hide navigation items when the logged-in staff member lacks the required permissions.
- On mobile, use a drawer menu.

Important: Hiding navigation items is only a frontend convenience. Backend authorization must still protect every API.

### 6.2 Topbar

The topbar should contain:
- Page breadcrumb or page context.
- Global search (if implemented).
- Notifications icon.
- User profile menu.
- Logout option.

### 6.3 Main Content

The main content area should contain:
- Page title.
- Short page description where useful.
- Primary action button.
- Filters or search controls.
- Main page content.

Maintain consistent horizontal and vertical spacing.

---

## 7. Dashboard Design

The dashboard should give the gym owner a quick overview of gym operations.

### 7.1 Statistics Cards

Display:

1. Total Members
2. Active Members
3. Expired Members
4. Today's Attendance
5. Today's Collection
6. Pending Payments
7. Monthly Revenue

Each card should include:
- Title.
- Main value.
- Relevant icon.
- Optional comparison with the previous period.

### 7.2 Charts

Recommended charts:

- Monthly Revenue Chart.
- Attendance Overview.
- Membership Growth.
- Payment Collection Overview.

Use charts only when they help users understand data.

### 7.3 Recent Activities

Display:
- Recently registered members.
- Recent payments.
- Upcoming membership expirations.
- Recent attendance activity.

Provide links to the relevant detail pages.

---

## 8. Table Design

Tables will be used in Members, Memberships, Payments, Trainers, Expenses, and other modules.

### Table Standards

Every data table should support relevant features:

- Search.
- Pagination.
- Sorting.
- Filters.
- Loading state.
- Empty state.
- Error state.
- Row actions.

### Example: Members Table

| Member ID | Name | Mobile | Membership | Status | Actions |
|---|---|---|---|---|---|
| MEM001 | Rahul Sharma | 9876543210 | Monthly | Active | View / Edit |
| MEM002 | Amit Verma | 9876543211 | Quarterly | Expired | View / Edit |

### Table Guidelines

- Keep columns readable.
- Avoid unnecessary columns.
- Use status badges.
- Keep action buttons consistent.
- Use a dropdown for multiple row actions.
- Make important information easy to scan.
- Use server-side pagination for large datasets.

### Empty State

When no records exist, display:
- A simple icon or illustration.
- A clear message.
- An action button when appropriate.

Example:

"No members found."

"Add your first member to get started."

---

## 9. Form Design

All forms should follow a consistent structure.

### Form Guidelines

- Use clear labels.
- Mark required fields.
- Show validation errors near the relevant fields.
- Provide helpful placeholder text.
- Group related fields.
- Avoid unnecessarily long forms.
- Disable submission while saving.
- Display success or error feedback.

### Example: Add Member Form

**Personal Information**
- Full Name
- Mobile Number
- Email
- Gender
- Date of Birth
- Profile Picture

**Contact Information**
- Address
- Emergency Contact

**Membership Information**
- Membership Plan (optional during registration)
- Joining Date

### Validation

- Validate required fields.
- Validate email format.
- Validate mobile number.
- Validate date fields.
- Validate numeric values.
- Perform validation on both frontend and backend.

Frontend validation improves usability; backend validation is mandatory.

---

## 10. Buttons and Actions

Maintain consistent button styles.

### Primary Button
Used for main actions:
- Add Member
- Create Membership
- Collect Payment
- Add Trainer

### Secondary Button
Used for supporting actions:
- Cancel
- Reset
- Back

### Danger Button
Used for destructive actions:
- Delete
- Refund
- Deactivate

### Button Guidelines

- Use clear action labels.
- Show loading indicators during API requests.
- Prevent accidental double submissions.
- Use confirmation dialogs for destructive actions.
- Avoid displaying too many primary buttons on one page.

---

## 11. Status Badges

Use consistent badges for statuses.

| Status | Suggested Color |
|---|---|
| Active | Green |
| Inactive | Gray |
| Upcoming | Blue |
| Expired | Red |
| Frozen | Purple |
| Pending | Amber |
| Paid | Green |
| Failed | Red |
| Cancelled | Gray |
| Refunded | Purple |

Status labels must be consistent across tables, detail pages, and filters.

---

## 12. Modal and Dialog Design

Use modals for small actions that do not require a separate page.

Examples:
- Quick Add Member.
- Assign Membership.
- Collect Payment.
- Confirm Refund.
- Confirm Deactivation.

Use dedicated pages for complex forms and workflows.

### Dialog Guidelines

- Keep dialog content focused.
- Use clear titles.
- Provide Cancel and Confirm actions.
- Display validation errors.
- Prevent accidental closure during important operations when necessary.

---

## 13. Member Profile Page

The member profile should provide a complete overview of one gym member.

### Profile Header

Display:
- Profile picture.
- Member name.
- Member ID.
- Mobile number.
- Account status.
- Quick actions.

### Profile Sections / Tabs

1. Overview
2. Membership History
3. Payment History
4. Attendance History

### Overview

Display:
- Personal information.
- Contact information.
- Current membership.
- Membership expiry date.
- Pending dues.
- Recent activity.

Important: Member account status and membership status should be displayed separately.

---

## 14. Membership UI

The membership module should make it easy to manage plans and member subscriptions.

### Membership Plans Page

Display:
- Plan name.
- Duration.
- Price.
- Status.
- Edit action.

### Member Membership Page

Display:
- Member name.
- Plan name.
- Start date.
- End date.
- Final amount.
- Paid amount.
- Pending amount.
- Membership status.

### Important Actions

- Assign Membership.
- Renew Membership.
- Freeze Membership.
- Unfreeze Membership.
- Extend Membership.
- Cancel Membership.

Ask for confirmation before actions that change membership dates or status.

---

## 15. Attendance UI

The attendance page should prioritize speed and simplicity.

### Main Screen

Display:
- Today's attendance count.
- Member search.
- QR scanner entry point.
- Manual check-in action.
- Recent check-ins.

### Attendance Table

Display:
- Member name.
- Member ID.
- Check-in time.
- Check-out time.
- Attendance method.
- Marked by.

### UX Requirements

- Make member search fast.
- Clearly show whether a member can check in.
- Display a useful message when membership is expired or inactive.
- Prevent accidental duplicate check-ins.
- Show clear success and failure feedback.

---

## 16. Payment UI

The payment module handles financial information, so accuracy and clarity are important.

### Payments Page

Display:
- Receipt number.
- Member name.
- Membership reference.
- Amount.
- Payment method.
- Payment status.
- Payment date.

### Collect Payment Form

Fields:
- Member.
- Membership.
- Total amount due.
- Amount received.
- Payment method.
- Transaction reference (when applicable).
- Notes.

### Payment UX Requirements

- Show total amount, paid amount, and remaining balance.
- Support partial payments.
- Clearly distinguish pending, successful, and failed payments.
- Show receipt details after successful payment.
- Require confirmation before issuing refunds.
- Restrict financial actions based on staff permissions.

---

## 17. Settings UI

Settings should be organized into clear sections.

Suggested settings navigation:

1. Gym Profile
2. General Settings
3. Staff Management
4. Roles & Permissions
5. Notification Settings
6. Audit Logs

### Staff Management

Display:
- Staff name.
- Email.
- Assigned role(s).
- Status.
- Actions.

Actions:
- Add Staff.
- Edit Staff.
- Assign Role.
- Activate / Deactivate.

### Roles & Permissions

Display:
- Role name.
- Description.
- Number of assigned staff.
- Status.
- Actions.

When creating or editing a role:
- Enter role name.
- Enter description.
- Display permissions grouped by module.
- Allow selecting individual permissions.
- Provide Select All and Clear All options where appropriate.
- Show a summary before saving.

Example permission groups:

**Members**
- View Members
- Create Members
- Edit Members
- Delete Members

**Payments**
- View Payments
- Create Payments
- Refund Payments

**Reports**
- View Reports
- Export Reports

The UI must use the predefined permission catalogue received from the backend rather than inventing permission keys.

---

## 18. Notifications UI

Create a notification center accessible from the topbar.

Display:
- Notification title.
- Description.
- Date and time.
- Read/unread status.
- Related member or record when applicable.

Notification categories:
- Membership Expiry.
- Payment.
- Attendance.
- Birthday.
- System.

Provide:
- Mark as Read.
- Mark All as Read.
- View Related Record.

---

## 19. Reports UI

The reports module should make business information easy to understand.

Suggested reports:

- Daily Revenue.
- Monthly Revenue.
- Expense Report.
- Active Members.
- Expired Members.
- Membership Renewals.
- Attendance Report.
- Payment Collection Report.

### Filters

- Date Range.
- Membership Plan.
- Payment Method.
- Payment Status.

### Report Display

Use:
- Summary cards.
- Tables.
- Charts where useful.
- Export options.

Financial reports must clearly distinguish:
- Successful payment collections.
- Refunds.
- Net collections.
- Pending dues.
- Paid expenses.

Do not label all membership sales as collected revenue.

---

## 20. Responsive Design

The application should work on desktop, tablet, and mobile.

### Desktop
- Full sidebar.
- Multi-column dashboard cards.
- Full data tables.
- Wider forms.

### Tablet
- Collapsible sidebar.
- Reduced dashboard columns.
- Responsive tables.

### Mobile
- Drawer navigation.
- Single-column cards.
- Stacked forms.
- Mobile-friendly buttons.
- Horizontally scrollable tables or card-based data views where appropriate.

Prioritize desktop because gym administration is likely to happen mostly on computers, but ensure important tasks such as attendance and member lookup work well on mobile.

---

## 21. Loading, Error, and Empty States

Every page that fetches data must handle these states.

### Loading State
- Use skeleton loaders or spinners.
- Avoid showing a blank page.
- Disable repeated submissions.

### Error State
- Display a readable error message.
- Provide a retry action when appropriate.
- Do not expose internal server errors or sensitive technical details.

### Empty State
- Explain that no records are available.
- Provide a relevant next action.
- Avoid displaying empty tables without explanation.

### Success Feedback
Use toast notifications or inline feedback for:
- Member created.
- Membership assigned.
- Payment received.
- Attendance marked.
- Staff role updated.

---

## 22. Accessibility

Follow basic accessibility standards:

- Use readable text sizes.
- Maintain sufficient color contrast.
- Support keyboard navigation.
- Add labels to form inputs.
- Provide accessible names for icon-only buttons.
- Do not communicate status through color alone.
- Make dialogs keyboard accessible.
- Provide visible focus states.

---

## 23. Reusable UI Components

Build reusable components instead of repeating UI code.

Suggested components:

**Layout**
- AppLayout
- Sidebar
- Topbar
- PageHeader
- Breadcrumbs

**Data Display**
- DataTable
- StatCard
- StatusBadge
- EmptyState
- Pagination
- SearchInput
- FilterPanel

**Forms**
- FormInput
- FormSelect
- FormDatePicker
- FormTextarea
- FormCheckbox
- FormFileUpload

**Feedback**
- Toast
- Alert
- ConfirmDialog
- LoadingSpinner
- SkeletonLoader

**Other**
- Modal
- Dropdown
- Tabs
- Avatar
- NotificationBell

Keep components reusable but avoid building overly generic components that become difficult to maintain.

---

## 24. Frontend Architecture Guidelines

- Keep pages separate from reusable components.
- Separate API calls from UI components.
- Use shared form validation schemas where practical.
- Use centralized API error handling.
- Use a consistent state management approach.
- Use permission-aware navigation and action visibility.
- Keep business logic out of presentation components.
- Avoid duplicating API request logic.
- Keep loading, error, and empty states consistent.

Suggested frontend structure:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── store/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── shared/
│
├── modules/
│   ├── dashboard/
│   ├── members/
│   ├── memberships/
│   ├── attendance/
│   ├── payments/
│   ├── trainers/
│   ├── expenses/
│   ├── notifications/
│   ├── reports/
│   └── settings/
│
├── services/
├── hooks/
├── utils/
├── constants/
├── types/
└── styles/
```

This is a suggested structure. Adjust it according to the final frontend architecture.

---

## 25. UI/UX Development Rules

Follow these rules while developing the application:

1. Build the common layout before individual module pages.
2. Create reusable components before duplicating UI patterns.
3. Complete one module at a time.
4. Maintain consistent colors, spacing, and typography.
5. Make all buttons and actions functional.
6. Connect forms to real backend APIs.
7. Handle loading, error, success, and empty states.
8. Make the UI responsive.
9. Implement frontend permission checks.
10. Never rely on frontend permission checks for backend security.
11. Avoid unnecessary animations and decorative elements.
12. Test important workflows from the user's perspective.

---

## 26. Final Design Goal

The final application should feel like a professional gym management SaaS dashboard, even though the initial version is designed for a single gym.

The interface should allow gym owners and staff to:

- Manage members easily.
- Track memberships.
- Record attendance quickly.
- Collect and monitor payments.
- Manage trainers and expenses.
- View important business reports.
- Manage staff and permissions.

**The main priority is usability, consistency, clarity, and maintainability — not visual complexity.**