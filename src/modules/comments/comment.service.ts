import type { AuthUser } from '../../types/auth';
import type {
  CreateComment,
  GetCommentsQuery,
  ListCommentsQuery
} from './comment.schemas';
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
      const finalCC = {
        ...input,
        ...{ authorId: currentUser.userId }
      };
      console.log('FINALCC', finalCC);
      const comment = await repository.create(finalCC);
      if (!comment)
        throw new AppError(500, 'DB Insert failed', 'Failed to add a comment');
      return comment;
    }
    throw new UnauthorizedError(
      "You're not permitted to create a comment in this post"
    );
  }

  async listComments(currentUser: AuthUser, input: ListCommentsQuery) {
    const result = await prisma.comment.findMany({
      skip: (input.page - 1) * input.limit,
      take: input.limit
    });
    console.log(result);
    return result;
  }

  async getComments(currentUser: AuthUser, input: GetCommentsQuery) {
    console.log('Input', input);
    if (input.ticketId) {
      return await repository.getComment(input.ticketId);
    }
  }
}
