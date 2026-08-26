import { prisma } from '../../db/prisma.ts';
import type { Prisma } from '@prisma/client';

const statusHistroyInclude = {
  changedBy: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  }
} satisfies Prisma.StatusHistoryInclude;

export class StatusHistoryRepository {
  async findById(ticketId: string) {
    return prisma.statusHistory.findMany({
      where: { ticketId },
      include: statusHistroyInclude
    });
  }
}
