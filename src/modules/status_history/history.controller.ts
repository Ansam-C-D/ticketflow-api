import type { AuthenticatedRequest } from '../../types/auth.ts';
import { StatusHistoryService } from './history.service.ts';
import type { Request, Response } from 'express';

const statusHistoryService = new StatusHistoryService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}
export class StatusHistoryController {
  async list(request: Request, response: Response) {
    const result = await statusHistoryService.listStatusHistory(
      authUser(request),
      String(request.params.ticketId)
    );
    response.json(result);
  }
}
export const statusHistoryController = new StatusHistoryController();
