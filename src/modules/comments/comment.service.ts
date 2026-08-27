import { Role } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import type { CreateComment, ListCommentsQuery } from './comment.schemas';
import { CommentRepository } from './comment.repository';
import { AppError } from '../../utils/errors';
import { prisma } from '../../db/prisma';

const repository = new CommentRepository();

export class CommentService {
  async createComment(currentUser: AuthUser, input: CreateComment) {
    if (currentUser.role === Role.USER) {
      console.log('Injecting authorId from', currentUser);
      const comment = await repository.create({
        ...input,
        ...{ authorId: currentUser.userId }
      });
      if (!comment)
        throw new AppError(500, 'DB Insert failed', 'Failed to add a comment');
    }
  }

  async listComments(currentUser: AuthUser, input: ListCommentsQuery) {
    const where: Record<string, unknown> = {}; //'where' is never reassigned. Use 'const' instead.
    if (input.ticketId) {
      where.ticketId = input.ticketId;
    }

    console.log('WHERE', where, input);
    const result = await prisma.comment.findMany({
      where: where,
      skip: (input.page - 1) * input.limit,
      take: input.limit
    });
    console.log(result);
    return result;
  }
}
