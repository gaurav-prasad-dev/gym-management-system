import { z } from 'zod';

export const createMemberSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  profileImage: z.string().optional().nullable(),
  gender: z.enum(['male', 'female', 'other']).optional().nullable(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
  occupation: z.string().trim().max(100).optional().nullable(),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20)
    .regex(/^[0-9+ -]{7,20}$/, 'Invalid phone number format'),
  alternatePhone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,20}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  email: z.string().trim().email('Invalid email address').optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  pincode: z.string().trim().max(10).optional().nullable(),
  emergencyContactName: z.string().trim().max(150).optional().nullable(),
  emergencyContactRelation: z.string().trim().max(100).optional().nullable(),
  emergencyContactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,20}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  source: z.string().trim().max(50).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const updateMemberSchema = createMemberSchema.partial();

export const updateMemberStatusSchema = z.object({
  status: z.enum(['active', 'inactive']),
});

export const memberIdParamSchema = z.object({
  id: z.string().uuid('Invalid member ID'),
});

export const memberListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['active', 'inactive', 'archived', 'all']).optional(),
  city: z.string().trim().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sortBy: z.enum(['fullName', 'memberCode', 'createdAt', 'phone', 'city', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
