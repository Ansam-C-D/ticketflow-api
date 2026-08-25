import { type Request, type Response } from 'express';
import { historyService } from './history.service.ts';

const historyObject = new historyService();

export class historyController {

  async ticketHistory(req: Request, res: Response) {
    const ticketHistory = await historyObject.uniqueHistory(
      String(req.params.ticketId),Number(req.query.page),Number(req.query.limit)
    );
    res.status(200).json({ data: ticketHistory });
  }
}
