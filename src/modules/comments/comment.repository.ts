import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

type PaginationInput = {
  page: number;
  limit: number;
};
export class CommentRepository {
  async create(data: Prisma.CommentUncheckedCreateInput) {
    return prisma.comment.create({
      data
    });
  }
  async findById(id: string) {
    return prisma.comment.findUnique({
      where: { id }
    });
  }
  async findMany(ticketId: string, pagination: PaginationInput) {
    const where: Prisma.CommentWhereInput = { ticketId };

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      prisma.comment.count({ where })
    ]);
    return { items, total };
  }
}
