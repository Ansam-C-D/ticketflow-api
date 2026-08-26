import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.ts';

const commentInclude = {
  commented_by: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  }
} satisfies Prisma.CommentsInclude;

type PaginationInput = {
  page: number;
  limit: number;
};

export class CommentsRespository {
  async create(data: Prisma.CommentsUncheckedCreateInput) {
    return prisma.comments.create({ data, include: commentInclude });
  }
  async findManyByTicketId(ticketId: string, pagination: PaginationInput) {
    const where: Prisma.CommentsWhereInput = {
      ticketId: ticketId
    };
    const [items, total] = await Promise.all([
      prisma.comments.findMany({
        where,
        include: commentInclude,
        orderBy: {
          createdAt: 'asc'
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      prisma.comments.count({ where })
    ]);
    return { items, total };
  }
}
