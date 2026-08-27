import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import type { ListCommentsQuery } from './comment.schemas.js';
export class CommentRepository {
  create(data: Prisma.CommentUncheckedCreateInput) {
    return prisma.comment.create({
      data
    });
  }
  async findMany(input: ListCommentsQuery) {
    console.log('Finding with pagination');
    const where: Record<string, unknown> = {}; //'where' is never reassigned. Use 'const' instead.
    if (input.ticketId) {
      where.ticketId = input.ticketId;
    }
    return await prisma.comment.findMany({
      where: where,
      skip: input.page,
      take: input.limit
    });
  }
}
