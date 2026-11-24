import { Request, Response, NextFunction } from 'express';
import { rolesService } from './roles.service';
import { sendSuccess, sendCreated } from '../../utils/response';

export class RolesController {
  async getPermissionsCatalogue(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await rolesService.getPermissionsCatalogue();
      sendSuccess(res, 'Permissions catalogue retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getPermissionModules(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await rolesService.getPermissionModules();
      sendSuccess(res, 'Permission modules retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const roles = await rolesService.getRoles(gymId);
      sendSuccess(res, 'Roles retrieved successfully', roles);
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const roleId = req.params.id as string;
      const role = await rolesService.getRoleById(gymId, roleId);
      sendSuccess(res, 'Role details retrieved successfully', role);
    } catch (error) {
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const ipAddress = req.ip;

      const role = await rolesService.createRole(gymId, actorUserId, req.body, ipAddress);
      sendCreated(res, 'Role created successfully', role);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const roleId = req.params.id as string;
      const ipAddress = req.ip;

      const updated = await rolesService.updateRole(
        gymId,
        roleId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Role updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const roleId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await rolesService.deleteRole(gymId, roleId, actorUserId, ipAddress);
      sendSuccess(res, 'Role deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async assignPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const roleId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await rolesService.assignPermissions(
        gymId,
        roleId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Permissions assigned successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export const rolesController = new RolesController();
