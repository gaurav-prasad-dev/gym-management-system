import { z } from 'zod';

export const createStaffSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(150),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,20}$/, 'Invalid phone number format')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
  designation: z.string().trim().max(100).optional(),
  joiningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  salary: z.number().positive('Salary must be greater than zero').optional(),
  roleIds: z.array(z.string().uuid('Invalid role ID')).optional(),
});

export const updateStaffSchema = z.object({
  fullName: z.string().trim().min(2).max(150).optional(),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,20}$/, 'Invalid phone number format')
    .optional(),
  designation: z.string().trim().max(100).optional(),
  joiningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  salary: z.number().positive('Salary must be greater than zero').optional(),
});

export const updateStaffStatusSchema = z.object({
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
  }),
});

export const assignStaffRolesSchema = z.object({
  roleIds: z.array(z.string().uuid('Invalid role ID')).min(1, 'At least one role ID is required'),
});

export const staffIdParamSchema = z.object({
  id: z.string().uuid('Invalid staff ID'),
});

export const staffListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
