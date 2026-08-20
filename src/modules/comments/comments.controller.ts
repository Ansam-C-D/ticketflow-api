import { CommentService } from './comments.service.js';
import type { Request, Response } from 'express';
import type { CreateCommentInput } from './comments.schemas.js';

const service = new CommentService();
export class CommentController {
  async createComment(req: Request, res: Response) {
    const data = {
      ticketId: String(req.params.ticketId),
      ...req.body
    } as CreateCommentInput;
    console.log(data);
    const comment = await service.createComment(data);
    res.status(201).json({ data: comment });
  }
  async getCommentByTicketId(req: Request, res: Response) {
    const ticketId = String(req.params.ticketId);

    const comments = await service.findCommentsByTicketId(ticketId);
    res.status(200).json({ data: comments });
  }
}

export const commentController = new CommentController();
