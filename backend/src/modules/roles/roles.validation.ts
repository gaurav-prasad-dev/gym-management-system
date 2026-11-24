import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional(),
  permissionIds: z.array(z.string().uuid('Invalid permission ID')).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must be at least 2 characters').max(100).optional(),
  description: z.string().trim().max(500).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const assignRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid('Invalid permission ID')),
});

export const roleIdParamSchema = z.object({
  id: z.string().uuid('Invalid role ID'),
});
