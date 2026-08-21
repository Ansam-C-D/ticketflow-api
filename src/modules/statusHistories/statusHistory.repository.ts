import { prisma } from '../../db/prisma';

export class StatusHistoryRepository {
  async list(ticketId: string) {
    return prisma.statusHistory.findMany({
      where: {
        ticketId: ticketId
      },
      select: {
        fromStatus: true,
        toStatus: true,
        changedBy: true
      }
    });
  }
}
