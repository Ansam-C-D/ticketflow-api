import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import { statusHistoryService } from './statusHistory.services';

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class StatusHistoryController {
  async list(request: Request, response: Response) {
    const statusHistories = await statusHistoryService.listStatusHistory(
      authUser(request),
      String(request.params.id)
    );
    response.status(200).json({
      data: statusHistories
    });
  }
}

export const statusHistoryController = new StatusHistoryController();
