import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import { StatusHistoryService } from './status-history.service';

const statusHistoryService = new StatusHistoryService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class StatusHistoryController {
  async list(request: Request, response: Response) {
    const statusHistory = await statusHistoryService.listHistory(
      authUser(request),
      String(request.params.ticketId)
    );

    response.json({ data: statusHistory });
  }
}

export const statusHistoryController = new StatusHistoryController();
