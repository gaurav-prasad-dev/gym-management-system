import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { auditService } from '../audit/audit.service';
import {
  CreateMemberInput,
  UpdateMemberInput,
  MemberListQuery,
  MemberStatsResponse,
} from './members.types';

export class MembersService {
  private async generateNextMemberCode(gymId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.member.count({ where: { gymId } });
    const sequence = String(count + 1).padStart(4, '0');
    return `MEM-${year}-${sequence}`;
  }

  async getStats(gymId: string): Promise<MemberStatsResponse> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalMembers, activeMembers, inactiveMembers, newThisMonth] = await Promise.all([
      prisma.member.count({
        where: { gymId, status: { not: 'archived' } },
      }),
      prisma.member.count({
        where: { gymId, status: 'active' },
      }),
      prisma.member.count({
        where: { gymId, status: 'inactive' },
      }),
      prisma.member.count({
        where: { gymId, createdAt: { gte: startOfMonth } },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      newThisMonth,
    };
  }

  async getMembers(gymId: string, query: MemberListQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      gymId,
    };

    if (query.status && query.status !== 'all') {
      whereClause.status = query.status;
    } else if (!query.status) {
      whereClause.status = { not: 'archived' };
    }

    if (query.city) {
      whereClause.city = { contains: query.city.trim(), mode: 'insensitive' };
    }

    if (query.startDate || query.endDate) {
      whereClause.createdAt = {};
      if (query.startDate) {
        whereClause.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    if (query.search) {
      const search = query.search.trim();
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { memberCode: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [total, items] = await Promise.all([
      prisma.member.count({ where: whereClause }),
      prisma.member.findMany({
        where: whereClause,
        include: {
          createdBy: {
            select: { id: true, fullName: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMemberById(gymId: string, memberId: string) {
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        gymId,
      },
      include: {
        createdBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!member) {
      throw new AppError('Member not found', 404, 'MEMBER_NOT_FOUND');
    }

    return member;
  }

  async createMember(
    gymId: string,
    actorUserId: string,
    input: CreateMemberInput,
    ipAddress?: string
  ) {
    const cleanPhone = input.phone.trim();

    // Check duplicate phone in same gym
    const existing = await prisma.member.findFirst({
      where: {
        gymId,
        phone: cleanPhone,
        status: { not: 'archived' },
      },
    });

    if (existing) {
      throw new AppError(
        `A member with phone number '${cleanPhone}' already exists in your gym (${existing.fullName})`,
        409,
        'DUPLICATE_PHONE'
      );
    }

    const memberCode = await this.generateNextMemberCode(gymId);
    const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`;

    return await prisma.$transaction(async (tx) => {
      const member = await tx.member.create({
        data: {
          gymId,
          memberCode,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          fullName,
          profileImage: input.profileImage || null,
          gender: input.gender || null,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          occupation: input.occupation?.trim() || null,
          phone: cleanPhone,
          alternatePhone: input.alternatePhone?.trim() || null,
          email: input.email?.trim().toLowerCase() || null,
          address: input.address?.trim() || null,
          city: input.city?.trim() || null,
          state: input.state?.trim() || null,
          pincode: input.pincode?.trim() || null,
          emergencyContactName: input.emergencyContactName?.trim() || null,
          emergencyContactRelation: input.emergencyContactRelation?.trim() || null,
          emergencyContactPhone: input.emergencyContactPhone?.trim() || null,
          source: input.source?.trim() || null,
          notes: input.notes?.trim() || null,
          status: 'active',
          createdById: actorUserId,
        },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'create_member',
          entityType: 'member',
          entityId: member.id,
          newValues: {
            memberCode: member.memberCode,
            fullName: member.fullName,
            phone: member.phone,
            status: member.status,
          },
          ipAddress,
        },
        tx
      );

      return member;
    });
  }

  async updateMember(
    gymId: string,
    memberId: string,
    actorUserId: string,
    input: UpdateMemberInput,
    ipAddress?: string
  ) {
    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId },
    });

    if (!member) {
      throw new AppError('Member not found', 404, 'MEMBER_NOT_FOUND');
    }

    if (input.phone && input.phone.trim() !== member.phone) {
      const duplicate = await prisma.member.findFirst({
        where: {
          gymId,
          phone: input.phone.trim(),
          id: { not: memberId },
          status: { not: 'archived' },
        },
      });

      if (duplicate) {
        throw new AppError(
          `Another member with phone '${input.phone.trim()}' already exists (${duplicate.fullName})`,
          409,
          'DUPLICATE_PHONE'
        );
      }
    }

    const firstName = input.firstName !== undefined ? input.firstName.trim() : member.firstName;
    const lastName = input.lastName !== undefined ? input.lastName.trim() : member.lastName;
    const fullName = `${firstName} ${lastName}`;

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.member.update({
        where: { id: memberId },
        data: {
          firstName: input.firstName ? input.firstName.trim() : undefined,
          lastName: input.lastName ? input.lastName.trim() : undefined,
          fullName,
          profileImage: input.profileImage !== undefined ? input.profileImage : undefined,
          gender: input.gender !== undefined ? input.gender : undefined,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
          occupation: input.occupation !== undefined ? input.occupation?.trim() || null : undefined,
          phone: input.phone ? input.phone.trim() : undefined,
          alternatePhone:
            input.alternatePhone !== undefined ? input.alternatePhone?.trim() || null : undefined,
          email: input.email !== undefined ? input.email?.trim().toLowerCase() || null : undefined,
          address: input.address !== undefined ? input.address?.trim() || null : undefined,
          city: input.city !== undefined ? input.city?.trim() || null : undefined,
          state: input.state !== undefined ? input.state?.trim() || null : undefined,
          pincode: input.pincode !== undefined ? input.pincode?.trim() || null : undefined,
          emergencyContactName:
            input.emergencyContactName !== undefined
              ? input.emergencyContactName?.trim() || null
              : undefined,
          emergencyContactRelation:
            input.emergencyContactRelation !== undefined
              ? input.emergencyContactRelation?.trim() || null
              : undefined,
          emergencyContactPhone:
            input.emergencyContactPhone !== undefined
              ? input.emergencyContactPhone?.trim() || null
              : undefined,
          source: input.source !== undefined ? input.source?.trim() || null : undefined,
          notes: input.notes !== undefined ? input.notes?.trim() || null : undefined,
        },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'update_member',
          entityType: 'member',
          entityId: memberId,
          oldValues: { fullName: member.fullName, phone: member.phone },
          newValues: input,
          ipAddress,
        },
        tx
      );

      return res;
    });

    return updated;
  }

  async updateMemberStatus(
    gymId: string,
    memberId: string,
    actorUserId: string,
    status: 'active' | 'inactive',
    ipAddress?: string
  ) {
    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId },
    });

    if (!member) {
      throw new AppError('Member not found', 404, 'MEMBER_NOT_FOUND');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.member.update({
        where: { id: memberId },
        data: { status },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: status === 'active' ? 'activate_member' : 'deactivate_member',
          entityType: 'member',
          entityId: memberId,
          oldValues: { status: member.status },
          newValues: { status },
          ipAddress,
        },
        tx
      );

      return res;
    });

    return updated;
  }

  async archiveMember(gymId: string, memberId: string, actorUserId: string, ipAddress?: string) {
    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId },
    });

    if (!member) {
      throw new AppError('Member not found', 404, 'MEMBER_NOT_FOUND');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.member.update({
        where: { id: memberId },
        data: {
          status: 'archived',
          archivedAt: new Date(),
        },
      });

      await auditService.log(
        {
          gymId,
          userId: actorUserId,
          action: 'archive_member',
          entityType: 'member',
          entityId: memberId,
          oldValues: { status: member.status },
          newValues: { status: 'archived', archivedAt: res.archivedAt },
          ipAddress,
        },
        tx
      );

      return res;
    });

    return updated;
  }
}

export const membersService = new MembersService();
