import { Role } from '@prisma/client';
import type { AuthUser } from '../../types/auth';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { StatusHistoryRepository } from './status-history.repository';

const repository = new StatusHistoryRepository();

export class StatusHistoryService {
  async listHistory(currentUser: AuthUser, ticketId: string) {
    const ticket = await repository.findTicketById(ticketId);

    if (!ticket) {
      throw new NotFoundError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    const canViewStatusHistory =
      currentUser.role === Role.ADMIN ||
      (currentUser.role === Role.AGENT &&
        ticket.assignedToId === currentUser.userId) ||
      (currentUser.role === Role.USER &&
        ticket.createdById === currentUser.userId);

    if (!canViewStatusHistory) {
      throw new ForbiddenError(
        'You are not allowed to view status history on this ticket'
      );
    }

    return repository.findByTicketId(ticketId);
  }
}
