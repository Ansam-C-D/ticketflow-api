import { prisma } from '../../db/prisma.js';
import type { Prisma } from '@prisma/client';

const commentInclude = {
  relatedTicket: {
    select: {
      id: true,
      title: true,
      status: true
    }
  },
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
} satisfies Prisma.CommentInclude;

type CommentFilter = {
  ticketId?: string;
  authorId?: string;
};

export class CommentRepository {
  async create(data: Prisma.CommentUncheckedCreateInput) {
    return prisma.comment.create({
      data,
      include: commentInclude
    });
  }
  async findMany(filter: CommentFilter) {
    const condition: Prisma.CommentWhereInput = {
      ...(filter.authorId ? { authorId: filter.authorId } : {}),
      ...(filter.ticketId ? { ticketId: filter.ticketId } : {})
    };
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: condition,
        include: commentInclude
      }),
      prisma.comment.count({ where: condition })
    ]);
    return { items, total };
  }
}
