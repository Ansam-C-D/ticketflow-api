import { prisma } from '../../db/prisma';

export class CommmentRepository {
  async create(comment: { ticketId: string; body: string; authorId: string }) {
    return prisma.comment.create({
      data: {
        ticketId: comment.ticketId,
        body: comment.body,
        authorId: comment.authorId
      }
    });
  }
  async list(ticketId: string) {
    return prisma.comment.findMany({
      where: {
        ticketId: ticketId
      },
      include: {
        commentBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
}
