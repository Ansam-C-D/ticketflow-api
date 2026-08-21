import type { Request, Response } from 'express';
import { StatusHistoryService } from './status-history.service.js';
import type { PaginationType } from './status-history.schema.js';

const service = new StatusHistoryService();
class StatusHistoryController {
  async getStatusHistory(req: Request, res: Response) {
    const id = String(req.params.ticketId);
    console.log(id);
    // console.log(req.query);
    const queryVal = req.query;
    console.log(req.query);
    const val = await service.listHistory(
      id,
      queryVal as unknown as PaginationType
    );
    res.status(200).json({ data: val });
  }
}

export const statusHistory = new StatusHistoryController();
