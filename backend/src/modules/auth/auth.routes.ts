import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validate';
import { loginSchema, changePasswordSchema, refreshTokenSchema } from './auth.validation';

const router = Router();

router.post('/login', validateRequest({ body: loginSchema }), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/logout', (req, res) => authController.logout(req, res));

router.post('/refresh', validateRequest({ body: refreshTokenSchema }), (req, res, next) =>
  authController.refresh(req, res, next)
);

router.get('/me', authenticate, (req, res, next) =>
  authController.me(req, res, next)
);

router.post(
  '/change-password',
  authenticate,
  validateRequest({ body: changePasswordSchema }),
  (req, res, next) => authController.changePassword(req, res, next)
);

export const authRoutes = router;
