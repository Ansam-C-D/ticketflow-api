import { prisma } from '../../db/prisma.ts';

export class Commentsrepository {
  async create(data: any) {
    return prisma.comments.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.comments.findMany({
      where: { ticketId:id },
    });
  }

  
}
