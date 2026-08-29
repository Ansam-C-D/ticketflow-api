import { prisma } from '../../db/prisma.js';

export class HistoryRepository {
  async getHistory(ticketId: string) {
    return await prisma.ticketStatusHistory.findMany({
      where: {
        ticketId
      }
    });
  }
}
