import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

export class CommentRepository {
  create(data: Prisma.CommentUncheckedCreateInput) {
    return prisma.comment.create({
      data
    });
  }
}
