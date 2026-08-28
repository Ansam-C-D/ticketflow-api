import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
// import { BadRequestError } from '../../utils/errors';
import { HistoryService } from './history.service';
const historyService = new HistoryService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class HistoryController {
  async getHistory(request: Request, response: Response) {
    const history = await historyService.getHistory(
      authUser(request),
      request.params
    );
    response.status(201).json(history);
  }
}

export const historyController = new HistoryController();
