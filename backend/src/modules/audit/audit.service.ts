import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export interface CreateAuditLogParams {
  gymId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
}

export class AuditService {
  async log(params: CreateAuditLogParams, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || prisma;
    try {
      await client.auditLog.create({
        data: {
          gymId: params.gymId,
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          oldValues: params.oldValues ? (params.oldValues as Prisma.InputJsonValue) : Prisma.JsonNull,
          newValues: params.newValues ? (params.newValues as Prisma.InputJsonValue) : Prisma.JsonNull,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (err) {
      // Audit log failures should not crash critical operations, but should be logged to stderr
      console.error('Failed to record audit log:', err);
    }
  }
}

export const auditService = new AuditService();
