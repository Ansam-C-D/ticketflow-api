import { CommentService } from './comments.service.js';
import type { Request, Response } from 'express';
import type { CreateCommentInput } from './comments.schemas.js';
import type { AuthenticatedRequest } from '../../types/auth.js';
function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}
const service = new CommentService();
export class CommentController {
  async createComment(req: Request, res: Response) {
    const user = authUser(req);
    const data = {
      authorId: user.userId,
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
