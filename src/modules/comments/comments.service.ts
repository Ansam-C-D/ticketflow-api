import type { CreateCommentInput } from './comments.schemas.js';
import { TicketRepository } from '../tickets/ticket.repository.js';
import { CommentRepository } from './comments.repository.js';
import { BadRequestError } from '../../utils/errors.js';
const repository = new TicketRepository();
const commentRepo = new CommentRepository();
export class CommentService {
  async createComment(input: CreateCommentInput) {
    const ticketId = input.ticketId;
    const authorId = input.authorId;
    const user = await repository.findAssignableUserById(authorId);
    const ticket = await repository.findById(ticketId);
    if (!user) throw new BadRequestError('INVALID_USER', 'invalid user id');
    if (!ticket)
      throw new BadRequestError('INVALID_TICKET', 'invalid ticketId');
    return await commentRepo.create({
      ticketId,
      authorId,
      body: input.body
    });
  }
  async findCommentsByTicketId(id: string) {
    const ticket = await repository.findById(id);
    if (!ticket)
      throw new BadRequestError('INVALID_TICKET', 'invalid ticketId');
    return await commentRepo.findByTicketId(id);
  }
}
