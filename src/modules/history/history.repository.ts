import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

type PaginationInput = {
  page: number;
  limit: number;
};
export class HistoryRepository {
  async findMany(ticketId: string, pagination: PaginationInput) {
    const where: Prisma.StatusHistoryWhereInput = { ticketId };
    const [items, total] = await Promise.all([
      prisma.statusHistory.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      prisma.statusHistory.count({ where })
    ]);
    return { items, total };
  }
}
