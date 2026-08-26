import type { AuthUser } from '../../types/auth.ts';
import type { CreateCommentInput } from './comment.schema.ts';
import { TicketService } from '../tickets/ticket.service.ts';
import { CommentRepository } from './comment.repository.ts';
import { Role } from '@prisma/client';
import { ForbiddenError } from '../../utils/errors.ts';

const ticketService = new TicketService();
const repository = new CommentRepository();

function canCreateComment(user: AuthUser) {
  return user.role === Role.USER || user.role == Role.AGENT;
}

export class CommentService {
  async createComment(
    currentUser: AuthUser,
    input: CreateCommentInput,
    ticketId: string
  ) {
    if (!canCreateComment(currentUser)) {
      throw new ForbiddenError('You are not allowed to comment on tickets.');
    }
    await ticketService.getTicketById(currentUser, ticketId);

    return repository.create({
      body: input.body,
      ticketId,
      authorId: currentUser.userId
    });
  }
  async listComments(currentUser: AuthUser, ticketId: string) {
    const ticket = await ticketService.getTicketById(currentUser, ticketId);

    const canViewComment =
      currentUser.role === Role.ADMIN ||
      (currentUser.role === Role.AGENT &&
        ticket.assignedToId === currentUser.userId) ||
      (currentUser.role === Role.USER &&
        ticket.createdById === currentUser.userId);
    if (!canViewComment) {
      throw new ForbiddenError(
        'You are not allowed to view comments on this ticket.'
      );
    }
    return repository.findMany({ ticketId });
  }
}
