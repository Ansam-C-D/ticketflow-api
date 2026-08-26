import { AuthUser } from '../../types/auth';
import { ForbiddenError } from '../../utils/errors';
import { TicketService } from '../tickets/ticket.service';
import { CommentsRespository } from './comments.repository';
import { CreateCommentInput, ListCommentsQuery } from './comments.schema';

const ticketService = new TicketService();
const repository = new CommentsRespository();
export class CommentService {
  async createComment(
    currentUser: AuthUser,
    ticketId: string,
    input: CreateCommentInput
  ) {
    if (currentUser.role === 'ADMIN') {
      throw new ForbiddenError(
        'Administrators are not allowed to post comments. Only the assigned agents and the ticket issuer can post comments'
      );
    }
    const ticket = await ticketService.getTicketById(currentUser, ticketId);
    if (
      currentUser.role === 'AGENT' &&
      ticket.assignedToId !== currentUser.userId
    ) {
      throw new ForbiddenError(
        'You are only allowed to comment on tickets that are assigned to you!.'
      );
    }
    return repository.create({
      body: input.body,
      ticketId: ticketId,
      authorId: currentUser.userId
    });
  }
  async listComments(
    currentUser: AuthUser,
    ticketId: string,
    input: ListCommentsQuery
  ) {
    const ticket = await ticketService.getTicketById(currentUser, ticketId);
    if (
      currentUser.role === 'AGENT' &&
      ticket.assignedToId !== currentUser.userId
    ) {
      throw new ForbiddenError(
        'You are only allowed to view the comments on the tickets assigned to you.'
      );
    }
    const { items, total } = await repository.findManyByTicketId(ticketId, {
      page: Number(input.page),
      limit: Number(input.limit)
    });
    return {
      data: items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit)
      }
    };
  }
}
