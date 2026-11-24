import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/password';
import { AppError } from '../../utils/AppError';
import { auditService } from '../audit/audit.service';
import {
  CreateStaffInput,
  UpdateStaffInput,
  UpdateStaffStatusInput,
  AssignStaffRolesInput,
  StaffFilterQuery,
} from './staff.types';

export class StaffService {
  async getStaffList(gymId: string, query: StaffFilterQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      gymId,
    };

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.search) {
      const search = query.search.trim();
      whereClause.OR = [
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { mobile: { contains: search } } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, staffRecords] = await Promise.all([
      prisma.staff.count({ where: whereClause }),
      prisma.staff.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              status: true,
              lastLoginAt: true,
              roles: {
                include: {
                  role: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      isSystem: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const formattedStaff = staffRecords.map((s) => ({
      id: s.id,
      userId: s.userId,
      gymId: s.gymId,
      fullName: s.user.fullName,
      email: s.user.email,
      mobile: s.user.mobile,
      designation: s.designation,
      joiningDate: s.joiningDate,
      salary: s.salary,
      status: s.status,
      userStatus: s.user.status,
      lastLoginAt: s.user.lastLoginAt,
      roles: s.user.roles.map((r) => r.role),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return {
      items: formattedStaff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStaffById(gymId: string, staffId: string) {
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        gymId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true,
            status: true,
            lastLoginAt: true,
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
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
    }

    const effectivePermissions = new Set<string>();
    const roles = staff.user.roles.map((r) => {
      for (const p of r.role.permissions) {
        effectivePermissions.add(p.permission.permissionKey);
      }
      return {
        id: r.role.id,
        name: r.role.name,
        slug: r.role.slug,
        isSystem: r.role.isSystem,
      };
    });

    return {
      id: staff.id,
      userId: staff.userId,
      gymId: staff.gymId,
      fullName: staff.user.fullName,
      email: staff.user.email,
      mobile: staff.user.mobile,
      designation: staff.designation,
      joiningDate: staff.joiningDate,
      salary: staff.salary,
      status: staff.status,
      userStatus: staff.user.status,
      lastLoginAt: staff.user.lastLoginAt,
      roles,
      effectivePermissions: Array.from(effectivePermissions),
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  async createStaff(
    gymId: string,
    actorUserId: string,
    input: CreateStaffInput,
    ipAddress?: string
  ) {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check if user email already exists in this gym
    const existing = await prisma.user.findFirst({
      where: {
        gymId,
        email: normalizedEmail,
      },
    });

    if (existing) {
      throw new AppError('A user with this email already exists in your gym', 409, 'EMAIL_EXISTS');
    }

    const passwordToHash = input.password || 'StaffTemp@123';
    const passwordHash = await hashPassword(passwordToHash);

    // Verify roleIds if passed
    if (input.roleIds && input.roleIds.length > 0) {
      const validRoles = await prisma.role.findMany({
        where: {
          id: { in: input.roleIds },
          OR: [{ gymId }, { gymId: null }],
        },
        select: { id: true },
      });

      if (validRoles.length !== input.roleIds.length) {
        throw new AppError('One or more selected role IDs are invalid', 400, 'INVALID_ROLES');
      }
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          gymId,
          fullName: input.fullName.trim(),
          email: normalizedEmail,
          mobile: input.mobile?.trim() || null,
          passwordHash,
          status: 'active',
        },
      });

      // 2. Create Staff profile
      const staff = await tx.staff.create({
        data: {
          gymId,
          userId: user.id,
          designation: input.designation?.trim() || null,
          joiningDate: input.joiningDate ? new Date(input.joiningDate) : null,
          salary: input.salary ? input.salary : null,
          status: 'active',
        },
      });

      // 3. Assign Roles
      if (input.roleIds && input.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: input.roleIds.map((rId) => ({
            userId: user.id,
            roleId: rId,
            assignedBy: actorUserId,
          })),
        });
      }

      // 4. Audit Log
      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'create_staff',
          entityType: 'staff',
          entityId: staff.id,
          newValues: {
            staffId: staff.id,
            userId: user.id,
            fullName: user.fullName,
            email: user.email,
            designation: staff.designation,
            roleIds: input.roleIds,
          },
          ipAddress,
        },
        tx
      );

      return {
        id: staff.id,
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        designation: staff.designation,
        status: staff.status,
        createdAt: staff.createdAt,
      };
    });
  }

  async updateStaff(
    gymId: string,
    staffId: string,
    actorUserId: string,
    input: UpdateStaffInput,
    ipAddress?: string
  ) {
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, gymId },
      include: { user: true },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (input.fullName !== undefined || input.mobile !== undefined) {
        await tx.user.update({
          where: { id: staff.userId },
          data: {
            fullName: input.fullName ? input.fullName.trim() : undefined,
            mobile: input.mobile !== undefined ? input.mobile.trim() : undefined,
          },
        });
      }

      const updatedStaff = await tx.staff.update({
        where: { id: staffId },
        data: {
          designation: input.designation !== undefined ? input.designation?.trim() || null : undefined,
          joiningDate: input.joiningDate ? new Date(input.joiningDate) : undefined,
          salary: input.salary !== undefined ? input.salary : undefined,
        },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'update_staff',
          entityType: 'staff',
          entityId: staffId,
          oldValues: {
            fullName: staff.user.fullName,
            mobile: staff.user.mobile,
            designation: staff.designation,
            salary: staff.salary,
          },
          newValues: input,
          ipAddress,
        },
        tx
      );

      return updatedStaff;
    });

    return updated;
  }

  async updateStaffStatus(
    gymId: string,
    staffId: string,
    actorUserId: string,
    input: UpdateStaffStatusInput,
    ipAddress?: string
  ) {
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, gymId },
      include: {
        user: {
          include: {
            roles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
    }

    if (staff.userId === actorUserId && input.status === 'inactive') {
      throw new AppError('You cannot deactivate your own staff account', 400, 'CANNOT_DEACTIVATE_SELF');
    }

    const isOwner = staff.user.roles.some((r) => r.role.slug === 'owner');
    if (isOwner && input.status === 'inactive') {
      throw new AppError('The primary Gym Owner account cannot be deactivated', 403, 'CANNOT_DEACTIVATE_OWNER');
    }

    await prisma.$transaction(async (tx) => {
      await tx.staff.update({
        where: { id: staffId },
        data: { status: input.status },
      });

      await tx.user.update({
        where: { id: staff.userId },
        data: { status: input.status },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'update_staff_status',
          entityType: 'staff',
          entityId: staffId,
          oldValues: { status: staff.status },
          newValues: { status: input.status },
          ipAddress,
        },
        tx
      );
    });

    return { id: staffId, status: input.status };
  }

  async getStaffRoles(gymId: string, staffId: string) {
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, gymId },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    isSystem: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
    }

    return staff.user.roles.map((r) => r.role);
  }

  async assignStaffRoles(
    gymId: string,
    staffId: string,
    actorUserId: string,
    input: AssignStaffRolesInput,
    ipAddress?: string
  ) {
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, gymId },
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
    }

    // Verify all role IDs exist and are active
    const validRoles = await prisma.role.findMany({
      where: {
        id: { in: input.roleIds },
        OR: [{ gymId }, { gymId: null }],
        status: 'active',
      },
      select: { id: true, name: true, slug: true },
    });

    if (validRoles.length !== input.roleIds.length) {
      throw new AppError('One or more selected role IDs are invalid or inactive', 400, 'INVALID_ROLES');
    }

    const oldRoleIds = staff.user.roles.map((r) => r.roleId);

    await prisma.$transaction(async (tx) => {
      // Clear previous roles
      await tx.userRole.deleteMany({
        where: { userId: staff.userId },
      });

      // Insert new roles
      await tx.userRole.createMany({
        data: input.roleIds.map((rId) => ({
          userId: staff.userId,
          roleId: rId,
          assignedBy: actorUserId,
        })),
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'assign_staff_roles',
          entityType: 'staff',
          entityId: staffId,
          oldValues: { roleIds: oldRoleIds },
          newValues: { roleIds: input.roleIds },
          ipAddress,
        },
        tx
      );
    });

    return {
      staffId,
      userId: staff.userId,
      roles: validRoles,
    };
  }
}

export const staffService = new StaffService();
