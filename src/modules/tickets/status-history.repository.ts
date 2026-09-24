import { prisma } from '../../db/prisma.js';

export class StatusHistoryRepository {
  async findByTicketId(ticketId: string) {
    return prisma.statusHistory.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
  }
}
