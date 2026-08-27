import { Role } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { CommentRepository } from './comment.repository';
import type { CreateCommentInput } from './comment.schemas';

const repository = new CommentRepository();

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

    const canComment =
      currentUser.role === Role.ADMIN ||
      (currentUser.role === Role.AGENT &&
        ticket.assignedToId === currentUser.userId) ||
      (currentUser.role === Role.USER &&
        ticket.createdById === currentUser.userId);

    if (!canComment) {
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

    const canView =
      currentUser.role === Role.ADMIN ||
      (currentUser.role === Role.AGENT &&
        ticket.assignedToId === currentUser.userId) ||
      (currentUser.role === Role.USER &&
        ticket.createdById === currentUser.userId);

    if (!canView) {
      throw new ForbiddenError(
        'You are not allowed to view comments on this ticket'
      );
    }

    return repository.findByTicketId(ticketId);
  }
}
