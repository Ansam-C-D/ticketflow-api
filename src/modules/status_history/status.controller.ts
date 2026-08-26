import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import { StatusHistoryService } from './status.service.ts';

const statusHistoryService = new StatusHistoryService();
function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class StatusHistoryController {
  async list(request: Request, response: Response) {
    const result = await statusHistoryService.getHistory(
      authUser(request),
      String(request.params.id)
    );
    response.json(result);
  }
}
