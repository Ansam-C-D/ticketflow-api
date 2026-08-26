import type { AuthUser } from '../../types/auth';
import { TicketService } from '../tickets/ticket.service.ts';
import { StatusHistoryRepository } from './history.repository.ts';

const repository = new StatusHistoryRepository();
const ticketService = new TicketService();

export class StatusHistoryService {
  async listStatusHistory(currentUser: AuthUser, ticketId: string) {
    await ticketService.getTicketById(currentUser, ticketId);
    const history = await repository.findById(ticketId);
    return { data: history };
  }
}
