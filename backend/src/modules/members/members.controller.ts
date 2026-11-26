import { Request, Response, NextFunction } from 'express';
import { membersService } from './members.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';
import { prisma } from '../../config/database';

async function resolveContext(req: Request) {
  if (req.user?.gymId) {
    return { gymId: req.user.gymId, actorUserId: req.user.userId };
  }
  // Temporary development fallback: get primary active gym and user so anyone can make entries
  const gym = await prisma.gym.findFirst({
    where: { status: 'active' },
    select: { id: true },
  });
  const user = await prisma.user.findFirst({
    where: { gymId: gym?.id, status: 'active' },
    select: { id: true },
  });
  return {
    gymId: gym?.id || '',
    actorUserId: user?.id || '',
  };
}

export class MembersController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId } = await resolveContext(req);
      const stats = await membersService.getStats(gymId);
      sendSuccess(res, 'Member statistics retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId } = await resolveContext(req);
      const result = await membersService.getMembers(gymId, req.query);
      sendPaginated(res, 'Members retrieved successfully', result.items, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getMemberById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId } = await resolveContext(req);
      const memberId = req.params.id as string;
      const member = await membersService.getMemberById(gymId, memberId);
      sendSuccess(res, 'Member details retrieved successfully', member);
    } catch (error) {
      next(error);
    }
  }

  async createMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId, actorUserId } = await resolveContext(req);
      const ipAddress = req.ip;

      const member = await membersService.createMember(gymId, actorUserId, req.body, ipAddress);
      sendCreated(res, 'Member registered successfully', member);
    } catch (error) {
      next(error);
    }
  }

  async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId, actorUserId } = await resolveContext(req);
      const memberId = req.params.id as string;
      const ipAddress = req.ip;

      const updated = await membersService.updateMember(
        gymId,
        memberId,
        actorUserId,
        req.body,
        ipAddress
      );
      sendSuccess(res, 'Member updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async activateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId, actorUserId } = await resolveContext(req);
      const memberId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await membersService.updateMemberStatus(
        gymId,
        memberId,
        actorUserId,
        'active',
        ipAddress
      );
      sendSuccess(res, 'Member activated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async deactivateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId, actorUserId } = await resolveContext(req);
      const memberId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await membersService.updateMemberStatus(
        gymId,
        memberId,
        actorUserId,
        'inactive',
        ipAddress
      );
      sendSuccess(res, 'Member deactivated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async archiveMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gymId, actorUserId } = await resolveContext(req);
      const memberId = req.params.id as string;
      const ipAddress = req.ip;

      const result = await membersService.archiveMember(gymId, memberId, actorUserId, ipAddress);
      sendSuccess(res, 'Member archived successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export const membersController = new MembersController();
