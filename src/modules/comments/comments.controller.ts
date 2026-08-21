import type { Request, Response } from 'express';
import { commentService } from './comments.service';
import type { AuthenticatedRequest } from '../../types/auth';
import type { CreateCommentSchema } from './comments.schemas';

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const comment = await commentService.createComment(
      authUser(request),
      String(request.params.id),
      request.body as CreateCommentSchema
    );
    response.status(201).json({ data: comment });
  }
  async list(request: Request, response: Response) {
    const comments = await commentService.listComment(
      authUser(request),
      String(request.params.id)
    );
    response.status(201).json({ data: comments });
  }
}

export const commentController = new CommentController();
