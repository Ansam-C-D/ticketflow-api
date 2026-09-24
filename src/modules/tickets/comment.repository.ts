import { prisma } from '../../db/prisma.js';

export class CommentRepository {
  async create(ticketId: string, authorId: string, body: string) {
    return prisma.comment.create({
      data: {
        ticketId,
        authorId,
        body
      },
      include: {
        author: {
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

  async findByTicketId(ticketId: string) {
    return prisma.comment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
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
