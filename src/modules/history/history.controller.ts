import { HistoryService } from './history.service.js';
import type { Request, Response } from 'express';
import { authUser } from '../../utils/permissions.js';
import type { ListHistoryQuery } from './history.schema.js';
const historyService = new HistoryService();
export class HistoryController {
  async list(request: Request, response: Response) {
    const result = await historyService.listHistory(
      authUser(request),
      String(request.params.id),
      request.query as unknown as ListHistoryQuery
    );
    response.json(result);
  }
}
export const historyController = new HistoryController();
