import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED');
    }

    let payload: TokenPayload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new AppError('Invalid or expired access token', 401, 'INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, status: true, gymId: true, email: true },
    });

    if (!user || user.status !== 'active') {
      throw new AppError('User account is inactive or no longer exists', 401, 'ACCOUNT_INACTIVE');
    }

    req.user = {
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
