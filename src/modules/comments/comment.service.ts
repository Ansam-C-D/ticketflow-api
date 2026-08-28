import type { AuthUser } from '../../types/auth';
import type { CreateComment, ListCommentsQuery } from './comment.schemas';
import { CommentRepository } from './comment.repository';
import { AppError, UnauthorizedError } from '../../utils/errors';
import { prisma } from '../../db/prisma';
import { TicketService } from '../tickets/ticket.service';

const repository = new CommentRepository();
const ticketService = new TicketService();

export class CommentService {
  async createComment(currentUser: AuthUser, input: CreateComment) {
    console.log('Injecting authorId from', currentUser);
    const ticket = await ticketService.getTicketById(
      currentUser,
      input.ticketId
    );
    if (
      currentUser.role === 'ADMIN' ||
      (currentUser.role === 'AGENT' &&
        currentUser.userId === ticket.assignedToId) ||
      currentUser.userId === ticket.createdById
    ) {
      const comment = await repository.create({
        ...input,
        ...{ authorId: currentUser.userId }
      });
      if (!comment)
        throw new AppError(500, 'DB Insert failed', 'Failed to add a comment');
      return comment;
    }
    throw new UnauthorizedError(
      "You're not permitted to create a comment in this post"
    );
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
