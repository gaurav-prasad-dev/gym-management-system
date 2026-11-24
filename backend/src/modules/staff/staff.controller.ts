import { Request, Response, NextFunction } from 'express';
import { staffService } from './staff.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';

export class StaffController {
  async getStaffList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const result = await staffService.getStaffList(gymId, req.query);
      sendPaginated(res, 'Staff list retrieved successfully', result.items, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getStaffById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const staffId = req.params.id as string;
      const staff = await staffService.getStaffById(gymId, staffId);
      sendSuccess(res, 'Staff details retrieved successfully', staff);
    } catch (error) {
      next(error);
    }
  }

  async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const ipAddress = req.ip;

      const staff = await staffService.createStaff(gymId, actorUserId, req.body, ipAddress);
      sendCreated(res, 'Staff created successfully', staff);
    } catch (error) {
      next(error);
    }
  }

  async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const staffId = req.params.id as string;
      const ipAddress = req.ip;

      const updated = await staffService.updateStaff(
        gymId,
        staffId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Staff updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async updateStaffStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const staffId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await staffService.updateStaffStatus(
        gymId,
        staffId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Staff status updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getStaffRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const staffId = req.params.id as string;
      const roles = await staffService.getStaffRoles(gymId, staffId);
      sendSuccess(res, 'Staff roles retrieved successfully', roles);
    } catch (error) {
      next(error);
    }
  }

  async assignStaffRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gymId = req.user!.gymId;
      const actorUserId = req.user!.userId;
      const staffId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await staffService.assignStaffRoles(
        gymId,
        staffId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Staff roles assigned successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export const staffController = new StaffController();
