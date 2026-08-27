import { Role, type Ticket } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { CommentRepository } from './comment.repository';
import type { CreateCommentInput } from './comment.schemas';

const repository = new CommentRepository();

function canViewComments(currentUser: AuthUser, ticket: Ticket) {
  if (currentUser.role === Role.ADMIN || currentUser.role === Role.AGENT) {
    return true;
  }

  return ticket.createdById === currentUser.userId;
}

function canComment(currentUser: AuthUser, ticket: Ticket) {
  if (currentUser.role === Role.ADMIN) {
    return true;
  }

  if (currentUser.role === Role.AGENT) {
    return ticket.assignedToId === currentUser.userId;
  }

  return ticket.createdById === currentUser.userId;
}

export class CommentService {
  async createComment(
    currentUser: AuthUser,
    ticketId: string,
    input: CreateCommentInput
  ) {
    const ticket = await repository.findTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (!canComment(currentUser, ticket)) {
      throw new ForbiddenError('You are not allowed to comment on this ticket');
    }

    return repository.create({
      ticketId,
      authorId: currentUser.userId,
      body: input.body
    });
  }

  async listComments(currentUser: AuthUser, ticketId: string) {
    const ticket = await repository.findTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (!canViewComments(currentUser, ticket)) {
      throw new ForbiddenError(
        'You are not allowed to view comments on this ticket'
      );
    }

    return repository.findByTicketId(ticketId);
  }
}
