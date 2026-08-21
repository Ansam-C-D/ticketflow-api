import type { AuthUser } from '../../types/auth';
import { TicketService } from '../tickets/ticket.service';
import { StatusHistoryRepository } from './statusHistory.repository';

const ticketService = new TicketService();
const repository = new StatusHistoryRepository();

export class StatusHistoryService {
  async listStatusHistory(currentUser: AuthUser, ticketId: string) {
    const ticket = await ticketService.getTicketById(currentUser, ticketId);

    return repository.list(ticket.id);
  }
}

export const statusHistoryService = new StatusHistoryService();
