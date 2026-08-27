import { Role, type Ticket } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { StatusHistoryRepository } from './status-history.repository';

const repository = new StatusHistoryRepository();

function canViewStatusHistory(currentUser: AuthUser, ticket: Ticket) {
  if (currentUser.role === Role.ADMIN || currentUser.role === Role.AGENT) {
    return true;
  }

  return ticket.createdById === currentUser.userId;
}

export class StatusHistoryService {
  async listHistory(currentUser: AuthUser, ticketId: string) {
    const ticket = await repository.findTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (!canViewStatusHistory(currentUser, ticket)) {
      throw new ForbiddenError(
        'You are not allowed to view status history on this ticket'
      );
    }

    return repository.findByTicketId(ticketId);
  }
}
