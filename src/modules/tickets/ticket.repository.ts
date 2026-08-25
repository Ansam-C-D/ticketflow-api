import type { Prisma, TicketPriority, TicketStatus } from '@prisma/client';
import { prisma } from '../../db/prisma.ts';
import { UnauthorizedError } from '../../utils/errors.ts';

const ticketInclude = {
  createdBy: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  },
  assignedTo: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  }
} satisfies Prisma.TicketInclude;

export type TicketWithRelations = Prisma.TicketGetPayload<{
  include: typeof ticketInclude;
}>;

type TicketFilters = {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string;
  createdById?: string;
};

type PaginationInput = {
  page: number;
  limit: number;
};

export class TicketRepository {
  async create(data: Prisma.TicketUncheckedCreateInput) {
    return prisma.ticket.create({
      data,
      include: ticketInclude
    });
  }

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: ticketInclude
    });
  }

  async findMany(filters: TicketFilters, pagination: PaginationInput) {
    const where: Prisma.TicketWhereInput = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.assignedToId ? { assignedToId: filters.assignedToId } : {}),
      ...(filters.createdById ? { createdById: filters.createdById } : {})
    };

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: ticketInclude,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      prisma.ticket.count({ where })
    ]);

    return { items, total };
  }

  

async update(id: string, data: Prisma.TicketUncheckedUpdateInput, status?: string, userId?: string) {
 return await prisma.$transaction(async (tx) => {
    if (data.status && status && userId) {
      await tx.statusHistory.create({
        data: {
          ticketId: id,
          fromStatus: status,
          toStatus: String(data.status),
        },
      });
    }
    return tx.ticket.update({
      where: { id },
      data,
      include: ticketInclude,
    });
  });
}

  async delete(id: string) {
    return prisma.ticket.delete({
      where: { id },
      include: ticketInclude
    });
  }

  async findAssignableUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        name: true,
        email: true
      }
    });
  }
}
