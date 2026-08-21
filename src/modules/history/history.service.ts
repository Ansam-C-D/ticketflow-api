import type { AuthUser } from '../../types/auth';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { canViewTicket } from '../../utils/permissions.js';
import { TicketRepository } from '../tickets/ticket.repository.js';
import { HistoryRepository } from './history.repository.js';
import type { ListHistoryQuery } from './history.schema.js';

const historyRepository = new HistoryRepository();
const ticketRepository = new TicketRepository();

export class HistoryService {
  async listHistory(
    currentUser: AuthUser,
    ticketId: string,
    input: ListHistoryQuery
  ) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }
    if (!canViewTicket(currentUser, ticket)) {
      throw new ForbiddenError('You are not allowed to view  this ticket');
    }
    const { items, total } = await historyRepository.findMany(ticketId, {
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
