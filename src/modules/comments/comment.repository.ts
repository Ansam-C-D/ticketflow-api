import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.ts';

const commentInclude = {
  createdBy: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  },
  commentedOn: {
    select: {
      id: true,
      title: true,
      priority: true
    }
  }
} satisfies Prisma.CommentsInclude;

export type CommentWithRelations = Prisma.CommentsGetPayload<{
  include: typeof commentInclude;
}>;

type CommentFilters = {
  ticketId?: string;
  authorId?: string;
};

export class CommentRepository {
  async create(data: Prisma.CommentsUncheckedCreateInput) {
    return prisma.comments.create({
      data,
      include: commentInclude
    });
  }
  async findMany(filters: CommentFilters) {
    const where: Prisma.CommentsWhereInput = {
      ...(filters.ticketId ? { ticketId: filters.ticketId } : {}),
      ...(filters.authorId ? { authorId: filters.authorId } : {})
    };
    const items = await Promise.all([
      prisma.comments.findMany({
        where,
        include: commentInclude,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.comments.count({ where })
    ]);
    return items;
  }
}
