import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export const requirePermission = (permissionKey: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const userRoles = await prisma.userRole.findMany({
        where: { userId: req.user.userId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const effectivePermissions = new Set<string>();

      for (const ur of userRoles) {
        if (ur.role.status === 'active') {
          for (const rp of ur.role.permissions) {
            effectivePermissions.add(rp.permission.permissionKey);
          }
        }
      }

      if (!effectivePermissions.has(permissionKey)) {
        throw new AppError(
          `Permission denied: requires '${permissionKey}'`,
          403,
          'FORBIDDEN'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
