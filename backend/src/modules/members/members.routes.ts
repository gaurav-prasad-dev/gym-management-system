import { Router } from 'express';
import { membersController } from './members.controller';
import { validateRequest } from '../../middleware/validate';
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdParamSchema,
  memberListQuerySchema,
} from './members.validation';

const router = Router();

// Stats (Auth & Admin restriction temporarily lifted for testing entry)
router.get('/stats', (req, res, next) =>
  membersController.getStats(req, res, next)
);

// List members
router.get(
  '/',
  validateRequest({ query: memberListQuerySchema }),
  (req, res, next) => membersController.getMembers(req, res, next)
);

// Member details
router.get(
  '/:id',
  validateRequest({ params: memberIdParamSchema }),
  (req, res, next) => membersController.getMemberById(req, res, next)
);

// Register member
router.post(
  '/',
  validateRequest({ body: createMemberSchema }),
  (req, res, next) => membersController.createMember(req, res, next)
);

// Update member
router.patch(
  '/:id',
  validateRequest({ params: memberIdParamSchema, body: updateMemberSchema }),
  (req, res, next) => membersController.updateMember(req, res, next)
);

// Activate member
router.patch(
  '/:id/activate',
  validateRequest({ params: memberIdParamSchema }),
  (req, res, next) => membersController.activateMember(req, res, next)
);

// Deactivate member
router.patch(
  '/:id/deactivate',
  validateRequest({ params: memberIdParamSchema }),
  (req, res, next) => membersController.deactivateMember(req, res, next)
);

// Archive member
router.patch(
  '/:id/archive',
  validateRequest({ params: memberIdParamSchema }),
  (req, res, next) => membersController.archiveMember(req, res, next)
);

export const membersRoutes = router;
