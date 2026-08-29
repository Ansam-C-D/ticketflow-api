import type { AuthUser } from '../../types/auth';

import type { GetHistory } from './history.schemas';
import { HistoryRepository } from './history.repository';

const repository = new HistoryRepository();

export class HistoryService {
  async getHistory(currentUser: AuthUser, input: GetHistory) {
    return await repository.getHistory(input.ticketId as string);
  }
}
