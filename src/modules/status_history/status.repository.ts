import { prisma } from '../../db/prisma.ts';

export class StatusHistoryRespository {
  async findByTicketId(ticketId: string) {
    return prisma.status_History.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });
  }
}
