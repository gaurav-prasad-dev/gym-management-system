import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

      sendSuccess(res, 'Login successful', {
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookies(res);
    sendSuccess(res, 'Logout successful');
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!token) {
        throw new AppError('Refresh token required', 401, 'REFRESH_TOKEN_REQUIRED');
      }

      const tokens = await authService.refreshToken(token);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      sendSuccess(res, 'Token refreshed successfully', { tokens });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const user = await authService.getCurrentUser(req.user.userId);
      sendSuccess(res, 'Current user retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.userId, currentPassword, newPassword);

      sendSuccess(res, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
