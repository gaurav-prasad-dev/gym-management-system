import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { auditService } from '../audit/audit.service';
import { CreateRoleInput, UpdateRoleInput, AssignRolePermissionsInput } from './roles.types';

export class RolesService {
  async getPermissionsCatalogue() {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { permissionKey: 'asc' }],
    });

    // Group by module for convenient UI consumption
    const grouped: Record<string, typeof permissions> = {};
    for (const p of permissions) {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(p);
    }

    return {
      total: permissions.length,
      permissions,
      byModule: grouped,
    };
  }

  async getPermissionModules() {
    const modules = await prisma.permission.findMany({
      select: { module: true },
      distinct: ['module'],
      orderBy: { module: 'asc' },
    });
    return modules.map((m) => m.module);
  }

  async getRoles(gymId: string) {
    const roles = await prisma.role.findMany({
      where: {
        OR: [{ gymId }, { gymId: null }],
      },
      include: {
        _count: {
          select: {
            permissions: true,
            users: true,
          },
        },
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });

    return roles.map((r) => ({
      id: r.id,
      gymId: r.gymId,
      name: r.name,
      slug: r.slug,
      description: r.description,
      isSystem: r.isSystem,
      isProtected: r.isProtected,
      status: r.status,
      permissionsCount: r._count.permissions,
      usersCount: r._count.users,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async getRoleById(gymId: string, roleId: string) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        OR: [{ gymId }, { gymId: null }],
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    }

    return {
      id: role.id,
      gymId: role.gymId,
      name: role.name,
      slug: role.slug,
      description: role.description,
      isSystem: role.isSystem,
      isProtected: role.isProtected,
      status: role.status,
      usersCount: role._count.users,
      permissions: role.permissions.map((rp) => rp.permission),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async createRole(gymId: string, actorUserId: string, input: CreateRoleInput, ipAddress?: string) {
    const slug = input.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const existing = await prisma.role.findFirst({
      where: {
        gymId,
        slug,
      },
    });

    if (existing) {
      throw new AppError(`A role with name '${input.name}' already exists in your gym`, 409, 'ROLE_EXISTS');
    }

    return await prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          gymId,
          name: input.name.trim(),
          slug,
          description: input.description?.trim() || null,
          isSystem: false,
          isProtected: false,
          status: 'active',
        },
      });

      if (input.permissionIds && input.permissionIds.length > 0) {
        // Verify all permission IDs exist
        const validPermissions = await tx.permission.findMany({
          where: { id: { in: input.permissionIds } },
          select: { id: true },
        });

        if (validPermissions.length !== input.permissionIds.length) {
          throw new AppError('One or more permission IDs are invalid', 400, 'INVALID_PERMISSIONS');
        }

        await tx.rolePermission.createMany({
          data: validPermissions.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
          })),
        });
      }

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'create_role',
          entityType: 'role',
          entityId: role.id,
          newValues: { name: role.name, slug: role.slug, permissionIds: input.permissionIds },
          ipAddress,
        },
        tx
      );

      return role;
    });
  }

  async updateRole(
    gymId: string,
    roleId: string,
    actorUserId: string,
    input: UpdateRoleInput,
    ipAddress?: string
  ) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        gymId,
      },
    });

    if (!role) {
      throw new AppError('Role not found or cannot be modified', 404, 'ROLE_NOT_FOUND');
    }

    if (role.isProtected) {
      throw new AppError('Protected system roles cannot be modified', 403, 'ROLE_PROTECTED');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.role.update({
        where: { id: roleId },
        data: {
          name: input.name ? input.name.trim() : undefined,
          description: input.description !== undefined ? input.description?.trim() || null : undefined,
          status: input.status,
        },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'update_role',
          entityType: 'role',
          entityId: roleId,
          oldValues: { name: role.name, description: role.description, status: role.status },
          newValues: { name: res.name, description: res.description, status: res.status },
          ipAddress,
        },
        tx
      );

      return res;
    });

    return updated;
  }

  async deleteRole(gymId: string, roleId: string, actorUserId: string, ipAddress?: string) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        gymId,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new AppError('Role not found or cannot be deleted', 404, 'ROLE_NOT_FOUND');
    }

    if (role.isProtected || role.isSystem) {
      throw new AppError('System and protected roles cannot be deleted', 403, 'ROLE_PROTECTED');
    }

    if (role._count.users > 0) {
      throw new AppError(
        `Cannot delete role because it is currently assigned to ${role._count.users} user(s). Reassign them first.`,
        400,
        'ROLE_IN_USE'
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      await tx.role.delete({
        where: { id: roleId },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'delete_role',
          entityType: 'role',
          entityId: roleId,
          oldValues: { name: role.name, slug: role.slug },
          ipAddress,
        },
        tx
      );
    });

    return { id: roleId };
  }

  async assignPermissions(
    gymId: string,
    roleId: string,
    actorUserId: string,
    input: AssignRolePermissionsInput,
    ipAddress?: string
  ) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        OR: [{ gymId }, { gymId: null }],
      },
      include: {
        permissions: {
          select: { permissionId: true },
        },
      },
    });

    if (!role) {
      throw new AppError('Role not found', 404, 'ROLE_NOT_FOUND');
    }

    if (role.isProtected && role.slug === 'owner') {
      throw new AppError('Owner role permissions cannot be altered', 403, 'ROLE_PROTECTED');
    }

    // Verify all permission IDs exist in database
    const validPermissions = await prisma.permission.findMany({
      where: { id: { in: input.permissionIds } },
      select: { id: true, permissionKey: true },
    });

    if (validPermissions.length !== input.permissionIds.length) {
      throw new AppError('One or more permission IDs are invalid', 400, 'INVALID_PERMISSIONS');
    }

    const oldPermissionIds = role.permissions.map((p) => p.permissionId);

    await prisma.$transaction(async (tx) => {
      // Delete existing role permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // Insert new role permissions
      if (input.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: input.permissionIds.map((pId) => ({
            roleId,
            permissionId: pId,
          })),
        });
      }

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'assign_role_permissions',
          entityType: 'role',
          entityId: roleId,
          oldValues: { permissionIds: oldPermissionIds },
          newValues: { permissionIds: input.permissionIds },
          ipAddress,
        },
        tx
      );
    });

    return {
      roleId,
      assignedPermissionsCount: input.permissionIds.length,
      permissionKeys: validPermissions.map((p) => p.permissionKey),
    };
  }
}

export const rolesService = new RolesService();
