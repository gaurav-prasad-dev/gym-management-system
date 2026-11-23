import { prisma } from '../../config/database';
import { comparePassword, hashPassword } from '../../utils/password';
import { generateTokens, verifyRefreshToken, GeneratedTokens } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';
import { UserProfileResponse, LoginResponseData } from './auth.types';

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponseData> {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      include: {
        gym: true,
        roles: {
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
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status !== 'active') {
      throw new AppError('Account is inactive or suspended', 403, 'ACCOUNT_INACTIVE');
    }

    if (user.gym.status !== 'active') {
      throw new AppError('Gym account is inactive', 403, 'GYM_INACTIVE');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    for (const ur of user.roles) {
      if (ur.role.status === 'active') {
        roles.push(ur.role.name);
        for (const rp of ur.role.permissions) {
          permissionsSet.add(rp.permission.permissionKey);
        }
      }
    }

    const tokens = generateTokens({
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
    });

    const userProfile: UserProfileResponse = {
      id: user.id,
      gymId: user.gymId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      status: user.status,
      roles,
      permissions: Array.from(permissionsSet),
    };

    return { user: userProfile, tokens };
  }

  async refreshToken(refreshToken: string): Promise<GeneratedTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, gymId: true, email: true, status: true },
    });

    if (!user || user.status !== 'active') {
      throw new AppError('User account is inactive or removed', 401, 'ACCOUNT_INACTIVE');
    }

    return generateTokens({
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
    });
  }

  async getCurrentUser(userId: string): Promise<UserProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
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
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    for (const ur of user.roles) {
      if (ur.role.status === 'active') {
        roles.push(ur.role.name);
        for (const rp of ur.role.permissions) {
          permissionsSet.add(rp.permission.permissionKey);
        }
      }
    }

    return {
      id: user.id,
      gymId: user.gymId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      status: user.status,
      roles,
      permissions: Array.from(permissionsSet),
    };
  }

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const isMatch = await comparePassword(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400, 'INCORRECT_PASSWORD');
    }

    const newHash = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }
}

export const authService = new AuthService();
