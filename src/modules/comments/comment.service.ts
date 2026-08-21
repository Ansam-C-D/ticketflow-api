import type { AuthUser } from '../../types/auth.js';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { canViewTicket } from '../../utils/permissions';
import { TicketRepository } from '../tickets/ticket.repository.js';
import { CommentRepository } from './comment.repository.js';
import type {
  CreateCommentInput,
  ListCommentsQuery
} from './comment.schema.js';

const ticketRepository = new TicketRepository();
const commentRepository = new CommentRepository();

export class CommentService {
  async createComment(
    currentUser: AuthUser,
    ticketId: string,
    input: CreateCommentInput
  ) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }
    if (!canViewTicket(currentUser, ticket)) {
      throw new ForbiddenError('You are not allowed to comment on this ticket');
    }
    return commentRepository.create({
      ticketId,
      authorId: currentUser.userId,
      body: input.body
    });
  }
  async listComments(
    currentUser: AuthUser,
    ticketId: string,
    input: ListCommentsQuery
  ) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }
    if (!canViewTicket(currentUser, ticket)) {
      throw new ForbiddenError('You are not allowed to view  this ticket');
    }
    const { items, total } = await commentRepository.findMany(ticketId, {
      page: input.page,
      limit: input.limit
    });
    return {
      data: items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: total,
        totalPages: Math.ceil(total / input.limit)
      }
    };
  }
}
