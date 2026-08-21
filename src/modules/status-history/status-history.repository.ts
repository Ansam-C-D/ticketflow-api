import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { TicketRepository } from '../tickets/ticket.repository.js';
import { BadRequestError } from '../../utils/errors.js';

type PaginationInput = {
  page: number;
  limit: number;
};

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
const repo = new TicketRepository();

export class StatusHistoryRepo {
  async findmany(id: string, pagination: PaginationInput) {
    const ticket = await repo.findById(id);
    if (!ticket)
      throw new BadRequestError('INVALID_TICKET', 'Invalid ticket id');
    const skipVal = (pagination.page - 1) * pagination.limit;
    const [data, total] = await Promise.all([
      prisma.status_History.findMany({
        where: { ticketId: id },
        skip: skipVal,
        take: pagination.limit,
        include: statusInclude
      }),
      prisma.status_History.count({ where: { ticketId: id } })
    ]);
    return { data, total };
  }
  async create(data: Prisma.Status_HistoryUncheckedCreateInput) {
    return prisma.status_History.create({
      data,
      include: statusInclude
    });
  }
}
