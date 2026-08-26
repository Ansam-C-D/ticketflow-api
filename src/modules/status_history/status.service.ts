import type { AuthUser } from '../../types/auth';
import { TicketService } from '../tickets/ticket.service';
import { StatusHistoryRespository } from './status.repository';

const repository = new StatusHistoryRespository();
const ticketService = new TicketService();

export class StatusHistoryService {
  async getHistory(currentUser: AuthUser, ticketId: string) {
    await ticketService.getTicketById(currentUser, ticketId);
    const history = await repository.findByTicketId(ticketId);
    return { data: history };
  }
}
