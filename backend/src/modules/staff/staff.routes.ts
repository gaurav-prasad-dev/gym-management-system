import { Router } from 'express';
import { staffController } from './staff.controller';
import { authenticate } from '../../middleware/authenticate';
import { requirePermission } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validate';
import {
  createStaffSchema,
  updateStaffSchema,
  updateStaffStatusSchema,
  assignStaffRolesSchema,
  staffIdParamSchema,
  staffListQuerySchema,
} from './staff.validation';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('staff.view'),
  validateRequest({ query: staffListQuerySchema }),
  (req, res, next) => staffController.getStaffList(req, res, next)
);

router.get(
  '/:id',
  authenticate,
  requirePermission('staff.view'),
  validateRequest({ params: staffIdParamSchema }),
  (req, res, next) => staffController.getStaffById(req, res, next)
);

router.post(
  '/',
  authenticate,
  requirePermission('staff.manage'),
  validateRequest({ body: createStaffSchema }),
  (req, res, next) => staffController.createStaff(req, res, next)
);

router.patch(
  '/:id',
  authenticate,
  requirePermission('staff.manage'),
  validateRequest({ params: staffIdParamSchema, body: updateStaffSchema }),
  (req, res, next) => staffController.updateStaff(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  requirePermission('staff.manage'),
  validateRequest({ params: staffIdParamSchema, body: updateStaffStatusSchema }),
  (req, res, next) => staffController.updateStaffStatus(req, res, next)
);

router.get(
  '/:id/roles',
  authenticate,
  requirePermission('staff.view'),
  validateRequest({ params: staffIdParamSchema }),
  (req, res, next) => staffController.getStaffRoles(req, res, next)
);

router.put(
  '/:id/roles',
  authenticate,
  requirePermission('staff.manage'),
  validateRequest({ params: staffIdParamSchema, body: assignStaffRolesSchema }),
  (req, res, next) => staffController.assignStaffRoles(req, res, next)
);

export const staffRoutes = router;
