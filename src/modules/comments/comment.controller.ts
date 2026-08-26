import type { AuthenticatedRequest } from '../../types/auth.ts';
import type { CreateCommentInput } from './comment.schema.ts';
import { CommentService } from './comment.service.ts';
import type { Request, Response } from 'express';

const commentService = new CommentService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const comment = await commentService.createComment(
      authUser(request),
      request.body as CreateCommentInput,
      String(request.params.ticketId)
    );
    response.status(201).json({ data: comment });
  }
  async list(request: Request, response: Response) {
    const result = await commentService.listComments(
      authUser(request),
      String(request.params.ticketId)
    );
    response.json(result);
  }
}
export const commentController = new CommentController();
