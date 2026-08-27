import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';

const commentInclude = {
  author: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  }
} satisfies Prisma.CommentInclude;

export class CommentRepository {
  async create(data: Prisma.CommentUncheckedCreateInput) {
    return prisma.comment.create({
      data,
      include: commentInclude
    });
  }

  async findByTicketId(ticketId: string) {
    return prisma.comment.findMany({
      where: { ticketId },
      include: commentInclude,
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async findTicketById(ticketId: string) {
    return prisma.ticket.findUnique({
      where: { id: ticketId }
    });
  }
}
