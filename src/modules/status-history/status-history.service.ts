import type { PaginationType } from './status-history.schema.js';
import { StatusHistoryRepo } from './status-history.repository.js';
const repo = new StatusHistoryRepo();
export class StatusHistoryService {
  async listHistory(id: string, input: PaginationType) {
    const { data, total } = await repo.findmany(id, input);
    return {
      data,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit)
      }
    };
  }
}
