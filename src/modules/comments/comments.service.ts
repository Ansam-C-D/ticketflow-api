import type { AuthUser } from '../../types/auth';
import { TicketService } from '../tickets/ticket.service';
import { CommmentRepository } from './comments.repository';
import type { CreateCommentSchema } from './comments.schemas';

const ticketService = new TicketService();
const repository = new CommmentRepository();

export class CommentService {
  async createComment(
    currentUser: AuthUser,
    ticketId: string,
    body: CreateCommentSchema
  ) {
    const ticket = await ticketService.getTicketById(currentUser, ticketId);

    return repository.create({
      ticketId: ticket.id,
      body: body.body,
      authorId: currentUser.userId
    });
  }

  async listComment(currentUser: AuthUser, ticketId: string) {
    const ticket = await ticketService.getTicketById(currentUser, ticketId);

    return repository.list(ticket.id);
  }
}

export const commentService = new CommentService();
