import { Router } from 'express';
import { rolesController } from './roles.controller';
import { authenticate } from '../../middleware/authenticate';
import { requirePermission } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import {
  createRoleSchema,
  updateRoleSchema,
  assignRolePermissionsSchema,
  roleIdParamSchema,
} from './roles.validation';

const rolesRouter = Router();
const permissionsRouter = Router();

// ==================== Permissions Catalogue Endpoints ====================
permissionsRouter.get('/', authenticate, requirePermission('roles.manage'), (req, res, next) =>
  rolesController.getPermissionsCatalogue(req, res, next)
);

permissionsRouter.get('/modules', authenticate, requirePermission('roles.manage'), (req, res, next) =>
  rolesController.getPermissionModules(req, res, next)
);

// ==================== Roles Endpoints ====================
rolesRouter.get('/', authenticate, requirePermission('roles.manage'), (req, res, next) =>
  rolesController.getRoles(req, res, next)
);

rolesRouter.get(
  '/:id',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ params: roleIdParamSchema }),
  (req, res, next) => rolesController.getRoleById(req, res, next)
);

rolesRouter.post(
  '/',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ body: createRoleSchema }),
  (req, res, next) => rolesController.createRole(req, res, next)
);

rolesRouter.patch(
  '/:id',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ params: roleIdParamSchema, body: updateRoleSchema }),
  (req, res, next) => rolesController.updateRole(req, res, next)
);

rolesRouter.delete(
  '/:id',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ params: roleIdParamSchema }),
  (req, res, next) => rolesController.deleteRole(req, res, next)
);

rolesRouter.get(
  '/:id/permissions',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ params: roleIdParamSchema }),
  (req, res, next) => rolesController.getRoleById(req, res, next)
);

rolesRouter.put(
  '/:id/permissions',
  authenticate,
  requirePermission('roles.manage'),
  validateRequest({ params: roleIdParamSchema, body: assignRolePermissionsSchema }),
  (req, res, next) => rolesController.assignPermissions(req, res, next)
);

export { rolesRouter, permissionsRouter };
