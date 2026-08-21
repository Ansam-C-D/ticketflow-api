import type { Prisma, TicketPriority, TicketStatus } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

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

const statusInclude = {
  relatedTicket: {
    select: {
      id: true,
      title: true
    }
  },
  changedUser: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
};

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

  async update(id: string, data: Prisma.TicketUncheckedUpdateInput) {
    return prisma.ticket.update({
      where: { id },
      data,
      include: ticketInclude
    });
  }
  async statusUpate(
    id: string,
    userId: string,
    data: Prisma.TicketUncheckedUpdateInput
  ) {
    return prisma.$transaction(async (tx) => {
      const ticket = await this.findById(id);
      const updated = await tx.ticket.update({
        where: { id },
        data,
        include: ticketInclude
      });
      const val = {
        ticketId: id,
        fromStatus: ticket!.status,
        toStatus: data.status as TicketStatus,
        changedById: userId
      };
      const history = await tx.status_History.create({
        data: val,
        include: statusInclude
      });
      return { updated, history };
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
